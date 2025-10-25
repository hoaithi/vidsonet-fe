"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Upload,
  Menu,
  User as UserIcon,
  LogOut,
  Settings,
  Compass,
  Clock,
  History,
  Users,
  Home,
  Video,
  FileText,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { useAuth } from "@/lib/hooks/use-auth";

export function Navbar() {
  const { isAuthenticated, profile } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const isExplorePage = pathname === "/explore";
  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle upload button click
  const handleVideoUpload = () => {
    if (isAuthenticated) {
      router.push("/upload");
    } else {
      router.push("/login");
    }
  };

  // Handle post creation
  const handleCreatePost = () => {
    if (isAuthenticated) {
      router.push("/posts");
    } else {
      router.push("/login");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Left section: Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <div className="py-4 px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-xl mb-6"
                >
                  VidsoNet
                </Link>
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/explore">
                      <Compass className="mr-2 h-4 w-4" />
                      Explore
                    </Link>
                  </Button>

                  {/* Upload options in mobile menu */}
                  {isAuthenticated ? (
                    <>
                      <div className="py-2">
                        <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">
                          CREATE
                        </p>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleVideoUpload}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Upload Video
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleCreatePost}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Create Post
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/posts">
                          <FileText className="mr-2 h-4 w-4" />
                          Posts
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/subscriptions">
                          <Users className="mr-2 h-4 w-4" />
                          Subscriptions
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/watch-later">
                          <Clock className="mr-2 h-4 w-4" />
                          Watch Later
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/history">
                          <History className="mr-2 h-4 w-4" />
                          History
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="py-2">
                      <p className="text-xs text-muted-foreground px-2 mb-2">
                        Sign in to upload content
                      </p>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => router.push("/login")}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Sign In to Upload
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="font-bold text-lg md:text-xl flex items-center gap-2 ml-4"
          >
            <img
              src="/eclipse-svgrepo-com.svg"
              alt="VidsoNet Logo"
              className="h-10 w-10"
            />
            VidsoNet
          </Link>
        </div>

        {/* Middle section: Search */}
        {!isExplorePage && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative w-full max-w-lg mx-4"
          >
            <Input
              type="search"
              placeholder="Search videos..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        )}

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {!isExplorePage && (
            <Button
              variant="ghost"
              size="icon"
              className="relative md:hidden"
              onClick={() => router.push("/explore")}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Upload Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Upload className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleVideoUpload}>
                <Video className="mr-2 h-4 w-4" />
                <span>Upload Video</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreatePost}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Create Post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push("/notifications")}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={profile?.avatarUrl || ""}
                        alt={profile?.fullName || "User"}
                      />
                      <AvatarFallback>
                        {profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push(`/profile/${profile?.id}`)}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Your Channel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/posts")}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Your Posts</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => router.push("/login")} variant="default">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
