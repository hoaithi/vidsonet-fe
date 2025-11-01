import { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/providers/SocketProvider";
import { ConnectionStatus } from "@/components/ConnectionStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VidsoNet - Video Sharing Platform",
  description: "Share and discover videos on VidsoNet",
  icons: {
    icon: "/eclipse-svgrepo-com.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="mdl-js">
      <body className={inter.className}>
        <SocketProvider>
          <ConnectionStatus />
          {children}
          <Toaster position="top-center" />
        </SocketProvider>
      </body>
    </html>
  );
}
