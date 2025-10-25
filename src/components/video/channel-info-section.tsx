// components/video/channel-info-section.tsx
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface ChannelInfoSectionProps {
  channel: {
    id: string;
    name: string;
    avatarUrl?: string;
    subscriberCount?: number;
  };
  isSubscribed: boolean;
  isLoading?: boolean;
  onToggleSubscribe: () => Promise<void>;
}

export default function ChannelInfoSection({
  channel,
  isSubscribed,
  isLoading = false,
  onToggleSubscribe,
}: ChannelInfoSectionProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-3">
        <Link href={`/channel/${channel.id}`}>
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={channel.avatarUrl || "/default-avatar.png"}
              alt={channel.name}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        <div>
          <Link href={`/channel/${channel.id}`}>
            <p className="font-semibold">{channel.name}</p>
          </Link>
          <p className="text-sm text-muted-foreground">
            {channel.subscriberCount ?? 0} subscribers
          </p>
        </div>
      </div>

      <Button
        variant={isSubscribed ? "secondary" : "default"}
        size="sm"
        onClick={onToggleSubscribe}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
}
