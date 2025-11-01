"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/lib/socket";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  onlineUsers: string[]; // ✅ Thêm danh sách user online
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionStatus: "disconnected",
  onlineUsers: [], // ✅ Default empty
});

export const useSocketContext = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // ✅ Track online users

  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("🔵 Initializing socket connection...");
    setConnectionStatus("connecting");

    try {
      const socketInstance = getSocket();
      setSocket(socketInstance);

      // Connection successful
      socketInstance.on("connect", () => {
        console.log("✅ Socket connected!", {
          socketId: socketInstance.id,
          transport: socketInstance.io.engine.transport.name,
          timestamp: new Date().toISOString(),
        });
        setIsConnected(true);
        setConnectionStatus("connected");
      });

      // ✅ Server confirmation with initial online users list
      socketInstance.on(
        "connected",
        (data: {
          message: string;
          socketId: string;
          userId: string;
          onlineUsers: string[];
        }) => {
          console.log("✅ Server confirmed connection:", data);
          setOnlineUsers(data.onlineUsers); // ✅ Set initial online users
        }
      );

      // ✅ Listen for user coming online
      socketInstance.on(
        "userOnline",
        (data: { userId: string; timestamp: string }) => {
          console.log("👤 User came online:", data);
          setOnlineUsers((prev) => {
            // Avoid duplicates
            if (!prev.includes(data.userId)) {
              return [...prev, data.userId];
            }
            return prev;
          });
        }
      );

      // ✅ Listen for user going offline
      socketInstance.on(
        "userOffline",
        (data: { userId: string; timestamp: string }) => {
          console.log("👤 User went offline:", data);
          setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
        }
      );

      // New message
      socketInstance.on("newMessage", (data: any) => {
        console.log("✅ New message received!", data);
      });

      // Disconnect
      socketInstance.on("disconnect", (reason) => {
        console.log("🔴 Socket disconnected:", reason);
        setIsConnected(false);
        setConnectionStatus("disconnected");
        setOnlineUsers([]); // ✅ Clear online users on disconnect
      });

      // Connection error
      socketInstance.on("connect_error", (error) => {
        console.error("❌ Connection error:", {
          message: error.message,
          type: error.name,
          timestamp: new Date().toISOString(),
        });
        setConnectionStatus("error");
      });

      // Reconnection attempt
      socketInstance.io.on("reconnect_attempt", (attemptNumber) => {
        console.log("🔄 Reconnection attempt:", attemptNumber);
        setConnectionStatus("connecting");
      });

      // Reconnection success
      socketInstance.io.on("reconnect", (attemptNumber) => {
        console.log("✅ Reconnected after", attemptNumber, "attempts");
        setIsConnected(true);
        setConnectionStatus("connected");
      });

      // Reconnection failed
      socketInstance.io.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed");
        setConnectionStatus("error");
      });

      // Check initial connection
      if (socketInstance.connected) {
        console.log("✅ Already connected on init");
        setIsConnected(true);
        setConnectionStatus("connected");
      }

      return () => {
        console.log("🔴 Cleaning up socket connection");
        socketInstance.off("connect");
        socketInstance.off("connected");
        socketInstance.off("userOnline");
        socketInstance.off("userOffline");
        socketInstance.off("newMessage");
        socketInstance.off("disconnect");
        socketInstance.off("connect_error");
        socketInstance.io.off("reconnect_attempt");
        socketInstance.io.off("reconnect");
        socketInstance.io.off("reconnect_failed");
        disconnectSocket();
      };
    } catch (error) {
      console.error("🔴 Failed to initialize socket:", error);
      setConnectionStatus("error");
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, connectionStatus, onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
}
