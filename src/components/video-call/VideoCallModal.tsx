"use client";
import { useState, useEffect } from "react";
import {
  X,
  Minimize2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MoreHorizontal,
} from "lucide-react";
import { useWebRTCCall } from "@/lib/hooks/useWebRTCCall";

// Types
interface FriendData {
  name: string;
  avatar: string;
  isOnline: boolean;
  userId: string;
}

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendData: FriendData;
  socket: any;
  currentUserId: string;
  currentUserInfo: { name: string; avatar?: string };
  isIncoming?: boolean;
  incomingCallData?: {
    callId: string;
    fromUserId: string;
    fromUserInfo: { name: string; avatar?: string };
    offer: RTCSessionDescriptionInit;
  };
}

export default function VideoCallModal({
  isOpen,
  onClose,
  friendData,
  socket,
  currentUserId,
  currentUserInfo,
  isIncoming = false,
  incomingCallData,
}: VideoCallModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
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
  } = useWebRTCCall({
    socket,
    currentUserId,
    friendData,
    currentUserInfo,
    isIncoming,
    incomingCallData,
    onCallEnd: () => {
      setIsModalVisible(false);
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsModalVisible(true);
      if (!isIncoming) {
        // Delay để modal hiển thị trước
        setTimeout(() => startCall(), 100);
      }
    } else {
      setIsModalVisible(false);
    }
  }, [isOpen, isIncoming, startCall]);

  const onEndCall = () => {
    handleEndCall();
    setIsModalVisible(false);
  };

  if (!isModalVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-black/90 to-zinc-950/95 backdrop-blur-2xl" />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[800px] bg-gradient-to-br from-zinc-900 to-black rounded-3xl shadow-3xl overflow-hidden border border-zinc-700/50 backdrop-blur-sm">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent z-10">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="text-left">
                <h3 className="text-3xl font-bold tracking-tight drop-shadow-lg">
                  {friendData.name}
                </h3>
                <p className="text-lg text-gray-400 mt-1">
                  {callState === "calling" && "Đang gọi..."}
                  {callState === "ringing" && "Cuộc gọi đến..."}
                  {callState === "connected" && formatDuration(callDuration)}
                  {callState === "none" && "Cuộc gọi kết thúc"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={
                  callState === "calling"
                    ? cancelCall
                    : callState === "ringing"
                    ? rejectCall
                    : onEndCall
                }
                className="w-12 h-12 rounded-full text-white/80 hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="relative w-full h-full flex items-center justify-center pt-24 pb-20">
          {callState === "calling" || callState === "ringing" ? (
            // Calling/Ringing State
            <div className="text-center animate-fade-in-up">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto ring-4 ring-white/30 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {friendData.avatar ? (
                    <img
                      src={friendData.avatar}
                      alt={friendData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    friendData.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-pulse"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-purple-400 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">
                {friendData.name}
              </h2>
              <p className="text-xl text-gray-300 animate-pulse">
                {callState === "calling" ? "Đang gọi..." : "Cuộc gọi đến..."}
              </p>

              {/* Ringing - Accept/Reject buttons */}
              {callState === "ringing" && (
                <div className="flex items-center gap-4 mt-8 justify-center">
                  <button
                    onClick={rejectCall}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </button>
                  <button
                    onClick={acceptCall}
                    className="w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulse"
                  >
                    <Phone className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>
          ) : callState === "connected" ? (
            // Connected State - Real video streams
            <div className="relative w-full h-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
              {/* Remote Video (Friend) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover bg-zinc-800"
              />

              {/* Local Video (You - Picture in Picture) */}
              <div className="absolute top-6 right-6 w-52 h-36 bg-zinc-800 rounded-xl border-2 border-zinc-700 overflow-hidden shadow-xl">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-zinc-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {currentUserInfo.name?.charAt(0).toUpperCase() || "B"}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs">Camera tắt</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Controls */}
        {callState === "calling" && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button
              onClick={cancelCall}
              className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-300 animate-pulse hover:scale-110 flex items-center justify-center"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          </div>
        )}

        {callState === "connected" && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-lg rounded-full p-4 border border-zinc-700 shadow-3xl">
            <div className="flex items-center gap-4">
              {/* Mic Toggle */}
              <button
                onClick={handleToggleMic}
                className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center ${
                  isMicOn
                    ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isMicOn ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={handleToggleCamera}
                className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center ${
                  isCameraOn
                    ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isCameraOn ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </button>

              {/* End Call */}
              <button
                onClick={onEndCall}
                className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-300 animate-pulse hover:scale-110 ml-2 flex items-center justify-center"
              >
                <Phone className="w-8 h-8 rotate-[135deg]" />
              </button>

              {/* Screen Share */}
              <button className="w-14 h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center">
                <Monitor className="w-6 h-6" />
              </button>

              {/* More Options */}
              <button className="w-14 h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
