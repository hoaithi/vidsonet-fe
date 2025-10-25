
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Compass, 
  Users, 
  Clock, 
  History, 
  ChevronRight, 
  ChevronLeft,
  FileText,
  CircleChevronLeft,
  CircleChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth-store';
import UserService from '@/services/profile-service';
import { Profile } from '@/types/profile';
import { useUser } from '@/lib/hooks/use-user';

export function Sidebar() {
  const { isAuthenticated } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Profile[]>([]);
  const pathname = usePathname();

  // Check if path is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem('sidebarCollapsed', (!isCollapsed).toString());
  };

  // Get user subscriptions
  useEffect(() => {
    if (isAuthenticated) {
      const fetchSubscriptions = async () => {
        try {
          const response = await UserService.getUserSubscriptions();
          if (response.result) {
            // Extract channel info from subscriptions
            const channels = response.result.map(sub => sub.channel);
            setSubscriptions(channels);
          }
        } catch (error) {
          console.error('Failed to fetch subscriptions:', error);
        }
      };
      
      fetchSubscriptions();
    }
  }, [isAuthenticated]);

  // Load saved collapse state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState) {
        setIsCollapsed(savedState === 'true');
      }
    }
  }, []);

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 hidden md:flex flex-col bg-background border-r transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="px-3 py-2 flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <CircleChevronLeft  className="h-4 w-4" /> : <CircleChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2 px-3">
          <nav className="space-y-1">
            <Button
              variant={isActive('/') ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${isCollapsed? 'justify-center px-0' : ''}`}
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                {!isCollapsed && <span>Home</span>}
              </Link>
            </Button>
            
            <Button
              variant={isActive('/explore') ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
              asChild
            >
              <Link href="/explore">
                <Compass className="h-4 w-4 mr-2" />
                {!isCollapsed && <span>Explore</span>}
              </Link>
            </Button>
            
            {isAuthenticated && (
              <>
                <Button
                  variant={isActive('/posts') ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
                  asChild
                >
                  <Link href="/posts">
                    <FileText className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>Posts</span>}
                  </Link>
                </Button>
                
                <Button
                  variant={isActive('/subscriptions') ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
                  asChild
                >
                  <Link href="/subscriptions">
                    <Users className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>Subscriptions</span>}
                  </Link>
                </Button>
                
                <Button
                  variant={isActive('/watch-later') ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
                  asChild
                >
                  <Link href="/watch-later">
                    <Clock className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>Watch Later</span>}
                  </Link>
                </Button>
                
                <Button
                  variant={isActive('/history') ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
                  asChild
                >
                  <Link href="/history">
                    <History className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>History</span>}
                  </Link>
                </Button>
              </>
            )}
          </nav>
          
          {isAuthenticated && subscriptions.length > 0 && (
            <div className="mt-4 pt-4">
              <Separator />
              <h3 className={`font-medium text-sm mt-4 ${isCollapsed ? 'sr-only' : 'mb-2 px-4'}`}>
                Subscriptions
              </h3>
              
              <div className="space-y-1">
                {subscriptions.map((subscription) => (
                  <Button
                    key={subscription.id}
                    variant="ghost"
                    className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
                    asChild
                  >
                    <Link href={`/profile/${subscription.id}`}>
                      <div className="h-6 w-6 rounded-full mr-2 overflow-hidden flex-shrink-0">
                        {subscription.avatarUrl ? (
                          <img 
                            referrerPolicy="no-referrer"
                            src={subscription.avatarUrl} 
                            alt={subscription.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center text-xs">
                            {(subscription.fullName || 'C').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {!isCollapsed && (
                        <span className="truncate">
                          {subscription.fullName}
                        </span>
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

export default Sidebar;