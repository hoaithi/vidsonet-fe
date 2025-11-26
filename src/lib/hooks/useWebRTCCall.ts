"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

interface FriendData {
  name: string;
  avatar: string;
  isOnline: boolean;
  userId: string;
}

interface UseWebRTCCallProps {
  socket: Socket | null;
  currentUserId: string;
  friendData: FriendData;
  currentUserInfo: { name: string; avatar?: string };
  isIncoming?: boolean;
  incomingCallData?: {
    callId: string;
    fromUserId: string;
    fromUserInfo: { name: string; avatar?: string };
    offer: RTCSessionDescriptionInit;
  };
  onCallEnd?: () => void;
}

type CallState = "none" | "calling" | "ringing" | "connected";

export function useWebRTCCall({
  socket,
  currentUserId,
  friendData,
  currentUserInfo,
  isIncoming = false,
  incomingCallData,
  onCallEnd,
}: UseWebRTCCallProps) {
  const [callState, setCallState] = useState<CallState>("none");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallEnding, setIsCallEnding] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callIdRef = useRef<string | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCleanedUpRef = useRef(false);

  // ✅ Track nếu peer đã end call trước
  const peerEndedCallRef = useRef(false);
  const hasEmittedEndCallRef = useRef(false);

  // ✅ FIX: Stable refs cho callbacks
  const onCallEndRef = useRef(onCallEnd);
  const socketRef = useRef(socket);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // ✅ Update refs khi props thay đổi
  useEffect(() => {
    onCallEndRef.current = onCallEnd;
  }, [onCallEnd]);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const startCallTimer = useCallback(() => {
    if (callTimerRef.current) return;
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopCallTimer = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  }, []);

  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("❌ Error getting user media:", error);
      throw error;
    }
  }, []);

  // ✅ Cleanup function - KHÔNG dependencies
  const cleanup = useCallback(() => {
    if (hasCleanedUpRef.current) {
      console.log("⚠️ Cleanup already called, skipping...");
      return;
    }

    // ✅ CRITICAL: Đánh dấu NGAY để tránh race condition
    hasCleanedUpRef.current = true;

    console.log("🧹 Cleaning up call resources...");

    stopCallTimer();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setCallState("none");
    setCallDuration(0);
    callIdRef.current = null;

    // ✅ Reset flags sau delay
    setTimeout(() => {
      hasCleanedUpRef.current = false;
      peerEndedCallRef.current = false;
      hasEmittedEndCallRef.current = false;
    }, 1000);
  }, [stopCallTimer]); // ✅ CHỈ phụ thuộc stopCallTimer

  // ✅ handleEndCall - sử dụng refs thay vì dependencies
  const handleEndCall = useCallback(() => {
    // ✅ FIX 1: Nếu peer đã end trước, KHÔNG emit nữa
    if (peerEndedCallRef.current) {
      console.log("⏭️ Peer already ended call, skipping emit");
      if (!hasCleanedUpRef.current) {
        cleanup();
        onCallEndRef.current?.();
      }
      return;
    }

    // ✅ FIX 2: Nếu đã emit rồi, không emit lần 2
    if (hasEmittedEndCallRef.current || isCallEnding) {
      console.log("⚠️ Already ending call, skipping...");
      return;
    }

    // ✅ FIX 3: Đánh dấu ngay để tránh duplicate
    hasEmittedEndCallRef.current = true;
    setIsCallEnding(true);
    console.log("📴 Ending call...");

    const duration = Math.floor(callDuration);

    let actualCallerId: string;
    let actualReceiverId: string;

    if (isIncoming && incomingCallData) {
      actualCallerId = incomingCallData.fromUserId;
      actualReceiverId = currentUserId;
    } else {
      actualCallerId = currentUserId;
      actualReceiverId = friendData.userId;
    }

    console.log("🔍 Call info (DETAILED):", {
      isIncoming,
      currentUserId,
      friendUserId: friendData.userId,
      "Who called first?": isIncoming ? "Friend called me" : "I called friend",
      actualCallerId,
      actualReceiverId,
      callIdRef: callIdRef.current,
      duration,
    });

    if (callIdRef.current && socketRef.current) {
      console.log("📤 Emitting end-call with:", {
        callId: callIdRef.current,
        toUserId: actualReceiverId,
        callerId: actualCallerId,
        duration,
        callType: "video",
      });

      // ✅ Emit ngay
      socketRef.current.emit("end-call", {
        callId: callIdRef.current,
        toUserId: actualReceiverId,
        callerId: actualCallerId,
        duration,
        callType: "video",
      });

      // ✅ Delay cleanup để đảm bảo message đã được xử lý
      setTimeout(() => {
        if (!hasCleanedUpRef.current) {
          cleanup();
          onCallEndRef.current?.();
        }
        setIsCallEnding(false);
      }, 500); // ✅ Tăng từ 300ms lên 500ms
    } else {
      console.error("❌ Missing data for end-call:", {
        callIdRef: callIdRef.current,
        socket: !!socketRef.current,
      });

      cleanup();
      onCallEndRef.current?.();
      setIsCallEnding(false);
    }
  }, [
    isCallEnding,
    callDuration,
    friendData.userId,
    currentUserId,
    isIncoming,
    incomingCallData,
    cleanup,
  ]); // ✅ Loại bỏ socket và onCallEnd

  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const peerConnection = new RTCPeerConnection(iceServers);
    peerConnectionRef.current = peerConnection;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnection.ontrack = (event) => {
      console.log("🎥 Remote track received");
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && friendData.userId) {
        console.log("🧊 Sending ICE candidate");
        socketRef.current.emit("ice-candidate", {
          toUserId: friendData.userId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", peerConnection.connectionState);

      if (peerConnection.connectionState === "connected") {
        setCallState("connected");
        startCallTimer();
      } else if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed" ||
        peerConnection.connectionState === "closed"
      ) {
        // ✅ FIX: Chỉ gọi handleEndCall nếu:
        // 1. Peer chưa end
        // 2. Mình chưa emit end-call
        // 3. Không đang trong quá trình cleanup
        if (
          !peerEndedCallRef.current &&
          !hasEmittedEndCallRef.current &&
          !hasCleanedUpRef.current
        ) {
          console.log("🔌 Connection closed by local, calling handleEndCall");
          handleEndCall();
        } else {
          console.log(
            "⏭️ Connection closed but already handled, skip emitting"
          );
          // ✅ Chỉ cleanup nếu chưa cleanup
          if (!hasCleanedUpRef.current) {
            cleanup();
            onCallEndRef.current?.();
          }
        }
      }
    };

    return peerConnection;
  }, [friendData.userId, startCallTimer, handleEndCall, cleanup]);

  const startCall = useCallback(async () => {
    if (!socketRef.current || !friendData.userId || callState !== "none")
      return;

    try {
      console.log("📞 Starting call to:", friendData.name);

      // ✅ Reset flags ngay khi bắt đầu call mới
      peerEndedCallRef.current = false;
      hasEmittedEndCallRef.current = false;
      hasCleanedUpRef.current = false;

      setCallState("calling");

      const stream = await getUserMedia();
      const peerConnection = createPeerConnection();

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socketRef.current.emit(
        "call-user",
        {
          fromUserId: currentUserId,
          toUserId: friendData.userId,
          fromUserInfo: currentUserInfo,
          offer: offer,
        },
        (response: { success: boolean; callId?: string }) => {
          if (response.success && response.callId) {
            callIdRef.current = response.callId;
            console.log("✅ Call initiated:", response.callId);
          } else {
            console.error("❌ Failed to initiate call");
            cleanup();
          }
        }
      );
    } catch (error) {
      console.error("❌ Error starting call:", error);
      cleanup();
    }
  }, [
    friendData,
    currentUserId,
    currentUserInfo,
    callState,
    getUserMedia,
    createPeerConnection,
    cleanup,
  ]);

  const acceptCall = useCallback(async () => {
    if (!socketRef.current || !incomingCallData) return;

    try {
      console.log(
        "✅ Accepting call from:",
        incomingCallData.fromUserInfo.name
      );

      // ✅ Reset flags khi accept call
      peerEndedCallRef.current = false;
      hasEmittedEndCallRef.current = false;
      hasCleanedUpRef.current = false;

      setCallState("connected");
      callIdRef.current = incomingCallData.callId;

      const stream = await getUserMedia();
      const peerConnection = createPeerConnection();

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(incomingCallData.offer)
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socketRef.current.emit("accept-call", {
        callId: incomingCallData.callId,
        toUserId: incomingCallData.fromUserId,
        answer: answer,
      });

      startCallTimer();
    } catch (error) {
      console.error("❌ Error accepting call:", error);
      cleanup();
    }
  }, [
    incomingCallData,
    getUserMedia,
    createPeerConnection,
    startCallTimer,
    cleanup,
  ]);

  const rejectCall = useCallback(() => {
    if (!socketRef.current || !incomingCallData) return;

    console.log("❌ Rejecting call");

    socketRef.current.emit("reject-call", {
      callId: incomingCallData.callId,
      toUserId: incomingCallData.fromUserId,
    });

    cleanup();
    onCallEndRef.current?.();
  }, [incomingCallData, cleanup]);

  const cancelCall = useCallback(() => {
    if (!socketRef.current || !callIdRef.current || !friendData.userId) return;

    console.log("🚫 Cancelling call");

    socketRef.current.emit("cancel-call", {
      callId: callIdRef.current,
      toUserId: friendData.userId,
    });

    cleanup();
    onCallEndRef.current?.();
  }, [friendData.userId, cleanup]);

  const handleToggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, []);

  const handleToggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  }, []);

  // ✅ Socket listeners - CHỈ phụ thuộc vào socket (không có cleanup và onCallEnd)
  useEffect(() => {
    if (!socket) return;

    console.log("🎧 Setting up WebRTC socket listeners");

    // ✅ Clear old listeners
    socket.off("call-accepted");
    socket.off("call-rejected");
    socket.off("call-cancelled");
    socket.off("call-ended");
    socket.off("ice-candidate");
    socket.off("call-failed");

    const handleCallAccepted = async (data: {
      callId: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      console.log("✅ Call accepted");
      setCallState("connected");

      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    };

    const handleCallRejected = (data: { callId: string }) => {
      console.log("❌ Call rejected");
      cleanup();
      onCallEndRef.current?.();
    };

    const handleCallCancelled = (data: { callId: string }) => {
      console.log("🚫 Call cancelled by caller");
      cleanup();
      onCallEndRef.current?.();
    };

    // ✅ FIX: Đánh dấu peer đã end call và KHÔNG gọi handleEndCall
    const handleCallEnded = (data: { callId?: string; reason?: string }) => {
      console.log("📴 Call ended by peer:", data.reason || "unknown");

      // ✅ QUAN TRỌNG: Đánh dấu peer đã end
      peerEndedCallRef.current = true;

      // ✅ Cleanup mà KHÔNG emit end-call
      cleanup();
      onCallEndRef.current?.();
    };

    const handleIceCandidate = async (data: {
      candidate: RTCIceCandidateInit;
    }) => {
      console.log("🧊 Received ICE candidate");
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (error) {
          console.error("❌ Error adding ICE candidate:", error);
        }
      }
    };

    const handleCallFailed = (data: { reason: string }) => {
      console.error("❌ Call failed:", data.reason);
      alert(`Cuộc gọi thất bại: ${data.reason}`);
      cleanup();
      onCallEndRef.current?.();
    };

    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-cancelled", handleCallCancelled);
    socket.on("call-ended", handleCallEnded);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("call-failed", handleCallFailed);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-cancelled", handleCallCancelled);
      socket.off("call-ended", handleCallEnded);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("call-failed", handleCallFailed);
    };
  }, [socket, cleanup]); // ✅ CHỈ socket và cleanup

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🔄 Component unmounting, cleaning up...");
      if (!hasCleanedUpRef.current) {
        cleanup();
      }
    };
  }, [cleanup]);

  // ✅ Handle incoming call
  useEffect(() => {
    if (isIncoming && incomingCallData) {
      setCallState("ringing");
      callIdRef.current = incomingCallData.callId;
    }
  }, [isIncoming, incomingCallData]);

  return {
    callState,
    isMicOn,
    isCameraOn,
    callDuration,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    rejectCall,
    cancelCall,
    handleEndCall,
    handleToggleMic,
    handleToggleCamera,
    formatDuration,
  };
}
