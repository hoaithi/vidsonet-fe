import React from 'react';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PremiumContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string;
  onViewMembership: () => void;
  onGoBack: () => void;
}

export function PremiumContentDialog({
  open,
  onOpenChange,
  channelId,
  onViewMembership,
  onGoBack
}: PremiumContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <Crown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          
          <DialogTitle>Premium Content</DialogTitle>
          
          <DialogDescription>
            This video is only available to channel members. 
            Join the membership to access exclusive content.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onGoBack} className="flex-1">
            Go Back
          </Button>
          <Button onClick={onViewMembership} className="flex-1">
            View Membership
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}