import { useEffect } from "react";
import { Socket } from "socket.io-client";

export function useMessageStatus(
  socket: Socket | null,
  onMessageSent: (data: any) => void,
  onMessageDelivered: (data: any) => void,
  onMessagesSeen: (data: any) => void,
  onMessageError: (data: any) => void
) {
  useEffect(() => {
    if (!socket) return;

    console.log("🎧 Listening for message status events...");

    // Message successfully saved to server
    socket.on("messageSent", onMessageSent);

    // Message delivered to recipient (they're online)
    socket.on("messageDelivered", onMessageDelivered);

    // Recipient has seen the messages
    socket.on("messagesSeen", onMessagesSeen);

    // Error sending message
    socket.on("messageError", onMessageError);

    return () => {
      socket.off("messageSent", onMessageSent);
      socket.off("messageDelivered", onMessageDelivered);
      socket.off("messagesSeen", onMessagesSeen);
      socket.off("messageError", onMessageError);
    };
  }, [
    socket,
    onMessageSent,
    onMessageDelivered,
    onMessagesSeen,
    onMessageError,
  ]);
}
