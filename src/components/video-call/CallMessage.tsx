import { Phone, Video, PhoneOff, PhoneMissed } from "lucide-react";import { cn } from "@/lib/utils";

interface CallMessageProps {
  message: {
    id: string;
    text: string;
    messageType: string;
    metadata?: {
      callId: string;
      duration: number;
      callType: "video" | "voice";
      callStatus: "answered" | "missed" | "declined" | "cancelled";
    };
    sender: "user" | "friend";
    timestamp: string;
  };
}

export function CallMessage({ message }: CallMessageProps) {
  const isUser = message.sender === "user";
  const metadata = message.metadata;

  if (!metadata) return null;

  // Icon based on call type and status
  const getIcon = () => {
    if (metadata.callStatus === "missed") {
      return <PhoneMissed className="w-4 h-4" />;
    }
    if (
      metadata.callStatus === "declined" ||
      metadata.callStatus === "cancelled"
    ) {
      return <PhoneOff className="w-4 h-4" />;
    }
    return metadata.callType === "video" ? (
      <Video className="w-4 h-4" />
    ) : (
      <Phone className="w-4 h-4" />
    );
  };

  // Color based on status
  const getColor = () => {
    switch (metadata.callStatus) {
      case "answered":
        return "text-green-600 bg-green-50 border-green-200";
      case "missed":
        return "text-red-600 bg-red-50 border-red-200";
      case "declined":
      case "cancelled":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        getColor(),
        isUser ? "ml-auto" : "mr-auto",
        "max-w-[200px]"
      )}
    >
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{message.text}</p>
      </div>
    </div>
  );
}

// ✅ Usage in ChatPage.tsx
/*
{message.messageType === 'call' ? (
  <CallMessage message={message} />
) : (
  // Regular message UI
  <div className={...}>
    <p>{message.text}</p>
  </div>
)}
*/
