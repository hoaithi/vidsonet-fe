import React from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import { Message, MessageStatus } from "@/types/chat";

interface MessageStatusIconProps {
  status: MessageStatus;
  className?: string;
}

export function MessageStatusIcon({
  status,
  className = "w-4 h-4",
}: MessageStatusIconProps) {
  switch (status) {
    case "sending":
      return <Clock className={`${className} text-gray-400 animate-spin`} />;
    case "sent":
      return <Check className={`${className} text-gray-400`} />;
    case "delivered":
      return <CheckCheck className={`${className} text-gray-400`} />;
    case "read":
      return <CheckCheck className={`${className} text-blue-500`} />;
    default:
      return null;
  }
}

// Helper function to determine message status
export function getMessageStatus(message: Message): MessageStatus {
  if (message.status) return message.status;
  if (!message.id || message.tempId) return "sending";
  if (message.isRead) return "read";
  if (message.isDelivered) return "delivered";
  if (message.isSent) return "sent";
  return "sending";
}
