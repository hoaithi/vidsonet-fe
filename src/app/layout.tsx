import { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/providers/SocketProvider";

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
    <html lang="en" className="mdl-js" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SocketProvider>
          {children}
          <Toaster position="top-center" />
        </SocketProvider>
      </body>
    </html>
  );
}
