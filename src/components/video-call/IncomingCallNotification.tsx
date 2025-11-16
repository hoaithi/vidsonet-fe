"use client";
import { Phone, PhoneOff } from "lucide-react";
import { useEffect, useRef } from "react";

interface IncomingCallNotificationProps {
  isOpen: boolean;
  callerInfo: {
    name: string;
    avatar?: string;
  };
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallNotification({
  isOpen,
  callerInfo,
  onAccept,
  onReject,
}: IncomingCallNotificationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Play ringtone
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.log("Cannot play ringtone:", error);
        });
      }
    } else {
      // Stop ringtone
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Ringtone audio */}
      <audio ref={audioRef} src="/ringtone.mp3" loop preload="auto" />

      {/* Notification */}
      <div className="fixed top-4 right-4 z-[100] animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500 p-6 min-w-[320px] animate-bounce">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {callerInfo.avatar ? (
                  <img
                    src={callerInfo.avatar}
                    alt={callerInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  callerInfo.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse"></div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {callerInfo.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 animate-pulse text-blue-600" />
                Cuộc gọi video đến...
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              Từ chối
            </button>
            <button
              onClick={onAccept}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 animate-pulse"
            >
              <Phone className="w-5 h-5" />
              Chấp nhận
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99]" />
    </>
  );
}

// Optional: Smaller notification variant for when user is in another tab
export function IncomingCallNotificationMinimal({
  isOpen,
  callerInfo,
  onAccept,
  onReject,
}: IncomingCallNotificationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-slide-up">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[280px]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {callerInfo.avatar ? (
              <img
                src={callerInfo.avatar}
                alt={callerInfo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              callerInfo.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{callerInfo.name}</p>
            <p className="text-xs text-gray-600">Cuộc gọi video</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Từ chối
          </button>
          <button
            onClick={onAccept}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Trả lời
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS animations (add to globals.css)
/*
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
*/
