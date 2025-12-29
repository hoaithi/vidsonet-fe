// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Search, Filter, Loader2 } from 'lucide-react';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { Separator } from '@/components/ui/separator';

// import VideoGrid from '@/components/video/video-grid';
// import { CategoryService } from '@/services/category-service';
// import { VideoService } from '@/services/video-service';
// import { Video, Category } from '@/types/video';

// export default function ExplorePage() {
//   const searchParams = useSearchParams();
//   const initialQuery = searchParams.get('q') || '';
//   const initialCategoryId = searchParams.get('category') || '';

//   const [searchQuery, setSearchQuery] = useState(initialQuery);
//   const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
//   const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);
//   const [durationFilter, setDurationFilter] = useState<string>('all');
//   const [sortBy, setSortBy] = useState('publishedAt');
//   const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

//   const [videos, setVideos] = useState<Video[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalVideos, setTotalVideos] = useState(0);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch categories on mount
//   // useEffect(() => {
//   //   const fetchCategories = async () => {
//   //     try {
//   //       const response = await CategoryService.getAllCategories();
//   //       if (response.result) {
//   //         setCategories(response.result);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching categories:', error);
//   //     }
//   //   };

//   //   fetchCategories();
//   // }, []);

//   // Initial search based on URL params
//   useEffect(() => {
//     searchVideos(true);
//   }, []); // Only run on mount

//   // Search videos when sort parameters change
//   useEffect(() => {
//     // Don't trigger on initial load (when videos is empty and not loading)
//     if (videos.length > 0 || isLoading) {
//       searchVideos(true);
//     }
//   }, [sortBy, sortDir, durationFilter]); // Re-search when sort or duration filter changes

//   // Search videos function
//   const searchVideos = async (reset: boolean = false) => {
//     setIsLoading(true);

//     // Reset to page 0 if this is a new search
//     const page = reset ? 0 : currentPage;

//     try {
//       const response = await VideoService.searchVideos({
//         keyword: searchQuery || undefined,
//         categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
//         isPremium: isPremium,
//       }, page, 6, sortBy, sortDir); // Changed limit from 3 to 10

//       if (response.result) {
//         let newVideos = response.result.content;

//         // Apply duration filter on frontend since backend doesn't support it
//         if (durationFilter !== 'all') {
//           newVideos = newVideos.filter(video => {
//             const duration = video.duration; // duration in seconds
//             switch (durationFilter) {
//               case 'short': // Under 4 minutes
//                 return duration < 240;
//               case 'medium': // 4-20 minutes
//                 return duration >= 240 && duration <= 1200;
//               case 'long': // Over 20 minutes
//                 return duration > 1200;
//               default:
//                 return true;
//             }
//           });
//         }

//         // Update videos list
//         if (reset) {
//           setVideos(newVideos);
//           setCurrentPage(0);
//         } else {
//           setVideos(prev => {
//             const uniqueVideos = [...prev, ...newVideos].filter(
//               (video, index, self) =>
//                 index === self.findIndex(v => v.id === video.id)
//             );
//             return uniqueVideos;
//           });
//           setCurrentPage(page + 1);
//         }

//         setTotalVideos(newVideos.length); // Update with filtered count
//         setHasMore(!response.result.last && newVideos.length > 0);
//       }
//     } catch (error) {
//       console.error('Error searching videos:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle search form submission
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     searchVideos(true); // Reset results for new search

//     // Update URL with search params
//     const url = new URL(window.location.href);
//     if (searchQuery) {
//       url.searchParams.set('q', searchQuery);
//     } else {
//       url.searchParams.delete('q');
//     }

//     if (selectedCategory) {
//       url.searchParams.set('category', selectedCategory);
//     } else {
//       url.searchParams.delete('category');
//     }

//     window.history.pushState({}, '', url.toString());
//   };

//   // Handle sort by change
//   const handleSortByChange = (value: string) => {
//     setSortBy(value);
//     // Note: The useEffect will handle the re-search
//   };

//   // Handle sort direction toggle
//   const handleSortDirToggle = () => {
//     setSortDir(current => current === 'asc' ? 'desc' : 'asc');
//     // Note: The useEffect will handle the re-search
//   };

//   // Handle filter apply (for the sheet)
//   const handleApplyFilters = () => {
//     searchVideos(true);
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Explore Videos</h1>

//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <form onSubmit={handleSearch} className="flex-1 flex gap-2">
//           <Input
//             type="search"
//             placeholder="Search videos..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="flex-1"
//           />
//           <Button type="submit">
//             <Search className="h-4 w-4 mr-2" />
//             Search
//           </Button>
//         </form>

//         <div className="flex gap-2">
//           <Select value={sortBy} onValueChange={handleSortByChange}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="publishedAt">Date</SelectItem>
//               <SelectItem value="viewCount">Views</SelectItem>
//               <SelectItem value="title">Title</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button
//             variant="outline"
//             size="icon"
//             onClick={handleSortDirToggle}
//             title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
//           >
//             {sortDir === 'asc' ? '↑' : '↓'}
//           </Button>

//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline">
//                 <Filter className="h-4 w-4 mr-2" />
//                 Filters
//               </Button>
//             </SheetTrigger>
//             <SheetContent>
//               <SheetHeader>
//                 <SheetTitle>Filter Videos</SheetTitle>
//                 <SheetDescription>
//                   Apply filters to narrow down results
//                 </SheetDescription>
//               </SheetHeader>

//               <div className="py-4 space-y-4">
//                 <div className="space-y-2">
//                   <h3 className="text-sm font-medium">Category</h3>
//                   <Select
//                     value={selectedCategory || "all"}
//                     onValueChange={(value) => {
//                       setSelectedCategory(value === "all" ? "" : value);
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Categories</SelectItem>
//                       {categories.map((category) => (
//                         <SelectItem key={category.id} value={category.id.toString()}>
//                           {category.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <h3 className="text-sm font-medium">Video Duration</h3>
//                   <Select
//                     value={durationFilter}
//                     onValueChange={setDurationFilter}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Any duration" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">Any Duration</SelectItem>
//                       <SelectItem value="short">Short (Under 4 minutes)</SelectItem>
//                       <SelectItem value="medium">Medium (4-20 minutes)</SelectItem>
//                       <SelectItem value="long">Long (Over 20 minutes)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <h3 className="text-sm font-medium">Premium Content</h3>
//                   <Select
//                     value={isPremium === undefined ? 'all' : isPremium.toString()}
//                     onValueChange={(value) => {
//                       if (value === 'all') {
//                         setIsPremium(undefined);
//                       } else {
//                         setIsPremium(value === 'true');
//                       }
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Premium status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Videos</SelectItem>
//                       <SelectItem value="true">Premium Only</SelectItem>
//                       <SelectItem value="false">Free Videos</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="pt-4">
//                   <Button onClick={handleApplyFilters} className="w-full">
//                     Apply Filters
//                   </Button>
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>

//       {/* Results count */}
//       <div className="text-sm text-muted-foreground mb-4">
//         {totalVideos > 0 ? (
//           <p>Showing {videos.length} of {totalVideos} videos</p>
//         ) : isLoading ? (
//           <p>Searching videos...</p>
//         ) : (
//           <p>No videos found</p>
//         )}
//       </div>

//       {/* Video grid */}
//       {videos.length > 0 ? (
//         <VideoGrid videos={videos} columns={3} />
//       ) : isLoading ? (
//         <div className="py-12 text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
//           <p className="mt-4 text-muted-foreground">Loading videos...</p>
//         </div>
//       ) : (
//         <div className="py-12 text-center">
//           <p className="text-muted-foreground">No videos found with the current filters</p>
//         </div>
//       )}

//       {/* Load more button */}
//       {hasMore && videos.length > 0 && (
//         <div className="mt-8 text-center">
//           <Button
//             variant="outline"
//             onClick={() => searchVideos(false)}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Loading...
//               </>
//             ) : (
//               'Load More'
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import VideoGrid from "@/components/video/video-grid";

import { VideoService } from "@/services/video-service";
import { Video, Category } from "@/types/video";
import { VideoSearchBar } from "@/components/search/VideoSearchBar";
import { normalizeSearchText } from "@/lib/utils";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategoryId = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("publishedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch categories on mount
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await CategoryService.getAllCategories();
  //       if (response.result) {
  //         setCategories(response.result);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  // Initial search based on URL params
  useEffect(() => {
    searchVideos(true);
  }, []); // Only run on mount

  // Search videos when sort parameters change
  useEffect(() => {
    // Don't trigger on initial load (when videos is empty and not loading)
    if (videos.length > 0 || isLoading) {
      searchVideos(true);
    }
  }, [sortBy, sortDir, durationFilter]); // Re-search when sort or duration filter changes

  // Search videos function
  const searchVideos = async (reset: boolean = false, customQuery?: string) => {
    setIsLoading(true);

    // Reset to page 0 if this is a new search
    const page = reset ? 0 : currentPage;
    const queryToUse = customQuery !== undefined ? customQuery : searchQuery;
    const normalizedQuery = queryToUse
      ? normalizeSearchText(queryToUse)
      : undefined;
    try {
      const response = await VideoService.searchVideos(
        {
          keyword: normalizedQuery,
          categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
          isPremium: isPremium,
        },
        page,
        6,
        sortBy,
        sortDir
      );

      if (response.result) {
        let newVideos = response.result.content;

        // Apply duration filter on frontend since backend doesn't support it
        if (durationFilter !== "all") {
          newVideos = newVideos.filter((video) => {
            const duration = video.duration; // duration in seconds
            switch (durationFilter) {
              case "short": // Under 4 minutes
                return duration < 240;
              case "medium": // 4-20 minutes
                return duration >= 240 && duration <= 1200;
              case "long": // Over 20 minutes
                return duration > 1200;
              default:
                return true;
            }
          });
        }

        // Update videos list
        if (reset) {
          setVideos(newVideos);
          setCurrentPage(0);
        } else {
          setVideos((prev) => {
            const uniqueVideos = [...prev, ...newVideos].filter(
              (video, index, self) =>
                index === self.findIndex((v) => v.id === video.id)
            );
            return uniqueVideos;
          });
          setCurrentPage(page + 1);
        }

        setTotalVideos(newVideos.length); // Update with filtered count
        setHasMore(!response.result.last && newVideos.length > 0);
      }
    } catch (error) {
      console.error("Error searching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ============================================================================
   * HANDLER: Search từ VideoSearchBar
   * ============================================================================
   * LUỒNG:
   * 1. VideoSearchBar trả về query string
   * 2. Update searchQuery state
   * 3. Trigger searchVideos(true) để reset và search lại
   * 4. Update URL params
   */
  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);

    // Trigger search sau khi state update
    // Note: Vì searchQuery được dùng trong searchVideos,
    // nên cần đợi state update hoặc pass trực tiếp
    searchVideos(true, query);

    // Update URL with search params
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }

    if (selectedCategory) {
      url.searchParams.set("category", selectedCategory);
    } else {
      url.searchParams.delete("category");
    }

    window.history.pushState({}, "", url.toString());
  };

  // Handle sort by change
  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };

  // Handle sort direction toggle
  const handleSortDirToggle = () => {
    setSortDir((current) => (current === "asc" ? "desc" : "asc"));
  };

  // Handle filter apply (for the sheet)
  const handleApplyFilters = () => {
    searchVideos(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Videos</h1>

      {/* ============================================
          SEARCH BAR MỚI - Thay thế form cũ
          ============================================ */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* VideoSearchBar với History & Suggestions */}
        <div className="flex-1">
          <VideoSearchBar
            onSearch={handleSearchQuery}
            categories={categories}
            externalSearchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publishedAt">Date</SelectItem>
              <SelectItem value="viewCount">Views</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSortDirToggle}
            title={sortDir === "asc" ? "Ascending" : "Descending"}
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Videos</SheetTitle>
                <SheetDescription>
                  Apply filters to narrow down results
                </SheetDescription>
              </SheetHeader>

              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Category</h3>
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={(value) => {
                      setSelectedCategory(value === "all" ? "" : value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Video Duration</h3>
                  <Select
                    value={durationFilter}
                    onValueChange={setDurationFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Duration</SelectItem>
                      <SelectItem value="short">
                        Short (Under 4 minutes)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (4-20 minutes)
                      </SelectItem>
                      <SelectItem value="long">
                        Long (Over 20 minutes)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Premium Content</h3>
                  <Select
                    value={
                      isPremium === undefined ? "all" : isPremium.toString()
                    }
                    onValueChange={(value) => {
                      if (value === "all") {
                        setIsPremium(undefined);
                      } else {
                        setIsPremium(value === "true");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Premium status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Videos</SelectItem>
                      <SelectItem value="true">Premium Only</SelectItem>
                      <SelectItem value="false">Free Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button onClick={handleApplyFilters} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground mb-4">
        {totalVideos > 0 ? (
          <p>
            Showing {videos.length} of {totalVideos} videos
          </p>
        ) : isLoading ? (
          <p>Searching videos...</p>
        ) : (
          <p>No videos found</p>
        )}
      </div>

      {/* Video grid */}
      {videos.length > 0 ? (
        <VideoGrid videos={videos} columns={3} />
      ) : isLoading ? (
        <div className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading videos...</p>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No videos found with the current filters
          </p>
        </div>
      )}

      {/* Load more button */}
      {hasMore && videos.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => searchVideos(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
