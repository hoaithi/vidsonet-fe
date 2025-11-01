"use client";

import { useSocketContext } from "@/providers/SocketProvider";

export function ConnectionStatus() {
  const { isConnected, connectionStatus, socket } = useSocketContext();

  const statusConfig = {
    connecting: {
      color: "bg-yellow-500",
      text: "Đang kết nối...",
      icon: "🔄",
    },
    connected: {
      color: "bg-green-500",
      text: "Đã kết nối",
      icon: "✅",
    },
    disconnected: {
      color: "bg-gray-500",
      text: "Mất kết nối",
      icon: "⚫",
    },
    error: {
      color: "bg-red-500",
      text: "Lỗi kết nối",
      icon: "❌",
    },
  };

  const status = statusConfig[connectionStatus];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 min-w-[250px]">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${status.color} animate-pulse`}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span>{status.icon}</span>
              <span className="font-semibold">{status.text}</span>
            </div>
            {socket?.id && (
              <div className="text-xs text-gray-500 mt-1">ID: {socket.id}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
