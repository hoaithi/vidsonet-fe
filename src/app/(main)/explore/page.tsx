'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Loader2 } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

import VideoGrid from '@/components/video/video-grid';
import { CategoryService } from '@/services/category-service';
import { VideoService } from '@/services/video-service';
import { Video, Category } from '@/types/video';

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategoryId = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAllCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Initial search based on URL params
  useEffect(() => {
    if (initialQuery || initialCategoryId) {
      searchVideos(true);
    } else {
      searchVideos(true); // Search with default params
    }
  }, []);

  // Search videos function
  const searchVideos = async (reset: boolean = false) => {
    setIsLoading(true);
    
    // Reset to page 0 if this is a new search
    const page = reset ? 0 : currentPage;
    
    try {
      const response = await VideoService.searchVideos({
        keyword: searchQuery || undefined,
        categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
        isPremium: isPremium,
      }, page, 10, sortBy, sortDir);
      
      if (response.data) {
        const newVideos = response.data.content;
        
        // Update videos list
        if (reset) {
          setVideos(newVideos);
          setCurrentPage(0);
        } else {
          setVideos(prev => [...prev, ...newVideos]);
          setCurrentPage(page + 1);
        }
        
        setTotalVideos(response.data.totalElements);
        setHasMore(!response.data.last);
      }
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVideos(true); // Reset results for new search
    
    // Update URL with search params
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set('q', searchQuery);
    } else {
      url.searchParams.delete('q');
    }
    
    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    } else {
      url.searchParams.delete('category');
    }
    
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Videos</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            type="search"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
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
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
            title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDir === 'asc' ? '↑' : '↓'}
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
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Premium Content</h3>
                  <Select 
                    value={isPremium === undefined ? '' : isPremium.toString()} 
                    onValueChange={(value) => {
                      if (value === '') {
                        setIsPremium(undefined);
                      } else {
                        setIsPremium(value === 'true');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Premium status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Videos</SelectItem>
                      <SelectItem value="true">Premium Only</SelectItem>
                      <SelectItem value="false">Free Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => {
                    searchVideos(true);
                  }} className="w-full">
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
          <p>Showing {videos.length} of {totalVideos} videos</p>
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
          <p className="text-muted-foreground">No videos found with the current filters</p>
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
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}