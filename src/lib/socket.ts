// import { useAuthStore } from "@/store/auth-store";import { io, Socket } from "socket.io-client";// let socket: Socket | null = null;
// export const getSocket = (token?: string): Socket => {
//   // Chỉ tạo socket trên client
//   if (typeof window === "undefined") {
//     throw new Error("Socket can only be initialized on client side");
//   }

//   const { profile } = useAuthStore.getState();
//   console.log("profile", profile);
//   const userId = profile?.userId;

//   if (!userId) {
//     console.warn("Socket: missing token or userId");
//     return socket as any; // hoặc null tùy cách bạn dùng
//   }

//   // Singleton pattern
//   if (!socket || !socket.connected) {
//     socket = io(
//       process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000/chat",
//       {
//         auth: {
//           token: token || localStorage.getItem("accessToken"),
//         },
//         query: {
//           // userId: getUserId(), // lấy từ decoded token
//           userId: userId,
//         },
//         transports: ["websocket", "polling"],
//         reconnection: true,
//         reconnectionDelay: 1000,
//         reconnectionAttempts: 5,
//       }
//     );

//     // Event listeners
//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket?.id);
//     });

//     socket.on("connected", (data) => {
//       console.log("✅ Server connected:", data);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//     });

//     socket.on("connect_error", (error) => {
//       console.error("🔴 Connection error:", error);
//     });
//   }

//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

// // Helper function
// const getUserId = () => {
//   if (typeof window === "undefined") return "";

//   const token = localStorage.getItem("auth-storage");
//   if (!token) return "";

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.sub || payload.userId;
//   } catch {
//     return "";
//   }
// };

import { useAuthStore } from "@/store/auth-store";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentUserId: string | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") {
    throw new Error("Socket can only be initialized on client side");
  }

  const state = useAuthStore.getState();

  // ✅ Check if store has hydrated
  if (!state._hasHydrated) {
    console.warn("⏳ Store not hydrated yet, waiting...");
    return null;
  }

  const { profile, accessToken } = state;
  const userId = profile?.id;

  // ✅ No userId = no socket
  if (!userId || !accessToken) {
    console.warn("❌ Missing userId or token, cannot create socket");
    return null;
  }

  // ✅ Check if need to reconnect with different user
  if (socket && currentUserId !== userId) {
    console.log("🔄 User changed, reconnecting socket...");
    console.log(`   Old user: ${currentUserId}`);
    console.log(`   New user: ${userId}`);
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }

  // ✅ Return existing connected socket
  if (socket?.connected && currentUserId === userId) {
    console.log("♻️ Reusing existing socket connection");
    return socket;
  }

  // ✅ Create new socket
  console.log("🔌 Creating socket for user:", userId);

  socket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000/chat",
    {
      auth: {
        token: accessToken, // ✅ Use token from store
      },
      query: {
        userId: userId,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    }
  );

  currentUserId = userId;

  // Basic event listeners (chi tiết hơn trong SocketProvider)
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });

  socket.on("connect_error", (error) => {
    console.error("🔴 Connection error:", error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket");
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }
};
