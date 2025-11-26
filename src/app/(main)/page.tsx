// 'use client';
// import { useEffect, useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Skeleton } from '@/components/ui/skeleton';
// import VideoGrid from '@/components/video/video-grid';
// import { VideoService } from '@/services/video-service';
// import { Video } from '@/types/video';
// import PasswordDialog from '@/components/auth/password-dialog';
// import { useAuthStore } from '@/store/auth-store';

// export default function HomePage() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [showPasswordDialog, setShowPasswordDialog] = useState(false);
//   const profile = useAuthStore((s) => s.profile);

//   // Fetch videos and categories
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);

//       try {
//         // Fetch trending videos initially
//         const videosResponse = await VideoService.searchVideos();
//         if (videosResponse.result) {
//           setVideos(videosResponse.result.content);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Show password dialog if user is authenticated and has no password
//   useEffect(() => {
//     if (profile && profile.hasPassword === false) {
//       setShowPasswordDialog(true);
//     }
//   }, [profile]);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Discover Videos</h1>
//       <PasswordDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog} />

//       <Tabs defaultValue="all">
//         <div className="border-b mb-6 overflow-x-auto">
//           <TabsList className="bg-transparent h-auto p-0">
//             <TabsTrigger
//               value="all"
//               className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
//             >
//               All
//             </TabsTrigger>

//             {/* {categories.map((category) => (
//               <TabsTrigger
//                 key={category.id}
//                 value={category.id.toString()}
//                 className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
//               >
//                 {category.name}
//               </TabsTrigger>
//             ))} */}
//           </TabsList>
//         </div>

//         <TabsContent value="all" className="mt-0">
//           {isLoading ? (
//             <VideoSkeleton />
//           ) : (
//             <VideoGrid videos={videos} columns={3} />
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // Video grid skeleton loader
// function VideoSkeleton() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//       {[...Array(9)].map((_, i) => (
//         <div key={i} className="space-y-3">
//           <Skeleton className="aspect-video rounded-lg" />
//           <div className="flex gap-3">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="space-y-2 flex-1">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-3 w-3/4" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import VideoGrid from "@/components/video/video-grid";
import { VideoService } from "@/services/video-service";
import { Video } from "@/types/video";
import PasswordDialog from "@/components/auth/password-dialog";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const profile = useAuthStore((s) => s.profile);

  // Fetch videos and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch trending videos initially
        const videosResponse = await VideoService.searchVideos();
        if (videosResponse.result) {
          setVideos(videosResponse.result.content);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show password dialog if user is authenticated and has no password
  useEffect(() => {
    if (profile && profile.hasPassword === false) {
      setShowPasswordDialog(true);
    }
  }, [profile]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Discover Videos</h1>
      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />

      <Tabs defaultValue="all" className="w-full">
        <div className="border-b mb-6 overflow-x-auto">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
            >
              All
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <VideoSkeleton />
          ) : (
            <VideoGrid videos={videos} columns={3} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Video grid skeleton loader
function VideoSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-video rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
