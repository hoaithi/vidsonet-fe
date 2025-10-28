"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PasswordDialog({
  open,
  onOpenChange,
}: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canClose, setCanClose] = useState(false);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const profile = useAuthStore((s) => s.profile);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange(true);
      return;
    }

    // ignore attempts to close the dialog (overlay click / Esc) until password is set
    if (canClose) {
      onOpenChange(false);
    }
  };

  const submit = async () => {
    setError(null);
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!profile?.email) {
      setError("Cannot set password: email not available");
      return;
    }

    setLoading(true);
    try {
      await AuthService.resetPassword(profile.email, password);
      // Update local profile to mark hasPassword true
      if (profile) {
        updateProfile({ ...profile, hasPassword: true });
      }
      // allow closing now and close
      setCanClose(true);
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md [&>button]:hidden [&_[data-slot=dialog-close]]:hidden"
        data-force-open
      >
        <DialogHeader>
          <DialogTitle>Set a password</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            It looks like you don't have a password yet. Please set one to
            secure your account.
          </p>

          <div>
            <Input
              type="password"
              placeholder="Enter a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button onClick={submit} disabled={loading}>
              {loading ? "Saving..." : "Save password"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
