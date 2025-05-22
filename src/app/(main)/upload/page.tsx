// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Upload, Image, AlertCircle, Loader2 } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Card, CardContent } from '@/components/ui/card';

// import { useAuthStore } from '@/store/auth-store';
// import { videoUploadSchema } from '@/lib/validation';
// import { useVideos } from '@/lib/hooks/use-videos';
// import { CategoryService } from '@/services/category-service';
// import { Category } from '@/types/video';

// export default function UploadVideoPage() {
//   const { isAuthenticated, user } = useAuthStore();
//   const router = useRouter();
//   const { uploadVideo } = useVideos();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [videoPreview, setVideoPreview] = useState<string | null>(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

//   const videoInputRef = useRef<HTMLInputElement>(null);
//   const thumbnailInputRef = useRef<HTMLInputElement>(null);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/login');
//     }
//   }, [isAuthenticated, router]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await CategoryService.getAllCategories();
//         if (response.data) {
//           setCategories(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Set up form
//   const form = useForm<z.infer<typeof videoUploadSchema>>({
//     resolver: zodResolver(videoUploadSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       categoryIds: [],
//       isPremium: false,
//     },
//   });

//   // Handle form submission
//   const onSubmit = async (values: z.infer<typeof videoUploadSchema>) => {
//     if (!values.videoFile) {
//       form.setError('videoFile', {
//         type: 'manual',
//         message: 'Please select a video file to upload',
//       });
//       return;
//     }

//     setIsUploading(true);
//     // Simulate upload progress (in a real app, you'd track actual upload progress)
//     const progressInterval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 95) {
//           clearInterval(progressInterval);
//           return 95;
//         }
//         return prev + 5;
//       });
//     }, 500);

//     try {
//       // Add categoryIds to the form values
//       const uploadData = {
//         ...values,
//         categoryIds: selectedCategories,
//       };
      
//       const result = await uploadVideo(uploadData);
      
//       if (result) {
//         setUploadProgress(100);
//         // Redirect to video page after upload completes
//         router.push(`/video/${result.id}`);
//       } else {
//         setIsUploading(false);
//         setUploadProgress(0);
//         clearInterval(progressInterval);
//       }
//     } catch (error) {
//       console.error('Error uploading video:', error);
//       setIsUploading(false);
//       setUploadProgress(0);
//       clearInterval(progressInterval);
//     }
//   };

//   // Handle video file selection
//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       form.setValue('videoFile', file, { shouldValidate: true });
      
//       // Create preview URL
//       const url = URL.createObjectURL(file);
//       setVideoPreview(url);
//     }
//   };

//   // Handle thumbnail file selection
//   const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       form.setValue('thumbnailFile', file, { shouldValidate: true });
      
//       // Create preview URL
//       const url = URL.createObjectURL(file);
//       setThumbnailPreview(url);
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (value: string) => {
//     const categoryIds = value ? value.split(',').map(id => parseInt(id)) : [];
//     setSelectedCategories(categoryIds);
//     form.setValue('categoryIds', categoryIds);
//   };

//   // Check if user has a channel
//   const hasNoChannel = isAuthenticated && user && (!user.channelName || user.channelName.trim() === '');

//   // If user doesn't have a channel, show warning
//   if (hasNoChannel) {
//     return (
//       <div className="max-w-2xl mx-auto py-12">
//         <Alert variant="destructive" className="mb-6">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Channel Required</AlertTitle>
//           <AlertDescription>
//             You need to set up your channel before you can upload videos.
//           </AlertDescription>
//         </Alert>
        
//         <Button onClick={() => router.push('/settings')}>
//           Set Up Channel
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {/* Video File Upload */}
//           <Card className="overflow-hidden">
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold">Select Video</h2>
//                   <FormField
//                     control={form.control}
//                     name="videoFile"
//                     render={({ field: { value, onChange, ...fieldProps } }) => (
//                       <FormItem className="hidden">
//                         <FormControl>
//                           <Input
//                             {...fieldProps}
//                             ref={videoInputRef}
//                             type="file"
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <Button
//                     type="button"
//                     onClick={() => videoInputRef.current?.click()}
//                     disabled={isUploading}
//                   >
//                     <Upload className="h-4 w-4 mr-2" />
//                     Select File
//                   </Button>
//                 </div>
                
//                 {videoPreview ? (
//                   <div className="mt-4">
//                     <video
//                       src={videoPreview}
//                       className="w-full aspect-video rounded-md bg-muted"
//                       controls
//                     />
//                     <p className="text-sm text-muted-foreground mt-2">
//                       {form.getValues('videoFile')?.name}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-12 text-center">
//                     <Upload className="h-12 w-12 mx-auto text-muted-foreground/50" />
//                     <p className="mt-2 text-sm text-muted-foreground">
//                       Click the button above to select a video file
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
          
//           {/* Video Information */}
//           <Card>
//             <CardContent className="p-6 space-y-6">
//               <h2 className="text-xl font-semibold">Video Details</h2>
              
//               {/* Title */}
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Title *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter video title" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               {/* Description */}
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Tell viewers about your video"
//                         className="min-h-32"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               {/* Thumbnail */}
//               <FormField
//                 control={form.control}
//                 name="thumbnailFile"
//                 render={({ field: { value, onChange, ...fieldProps } }) => (
//                   <FormItem>
//                     <FormLabel>Thumbnail</FormLabel>
//                     <FormControl>
//                       <div className="space-y-3">
//                         <Input
//                           {...fieldProps}
//                           ref={thumbnailInputRef}
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleThumbnailChange}
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => thumbnailInputRef.current?.click()}
//                           disabled={isUploading}
//                         >
//                           <Image className="h-4 w-4 mr-2" />
//                           {thumbnailPreview ? 'Change Thumbnail' : 'Upload Thumbnail'}
//                         </Button>
                        
//                         {thumbnailPreview && (
//                           <div className="mt-2">
//                             <img
//                               src={thumbnailPreview}
//                               alt="Thumbnail preview"
//                               className="max-h-40 rounded-md"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormDescription>
//                       Recommended size: 1280×720 (16:9)
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               {/* Categories */}
//               <FormField
//                 control={form.control}
//                 name="categoryIds"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Categories</FormLabel>
//                     <FormControl>
//                       <Select
//                         value={selectedCategories.join(',')}
//                         onValueChange={handleCategoryChange}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select categories" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {categories.map((category) => (
//                             <SelectItem
//                               key={category.id}
//                               value={category.id.toString()}
//                             >
//                               {category.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormDescription>
//                       Select categories that best describe your video
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               {/* Premium */}
//               <FormField
//                 control={form.control}
//                 name="isPremium"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel>Premium Content</FormLabel>
//                       <FormDescription>
//                         Make this video available only to your channel members
//                       </FormDescription>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>
          
//           {/* Upload progress */}
//           {isUploading && (
//             <div className="space-y-2">
//               <div className="w-full bg-muted rounded-full h-2.5">
//                 <div
//                   className="bg-primary h-2.5 rounded-full"
//                   style={{ width: `${uploadProgress}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-muted-foreground text-center">
//                 {uploadProgress < 100
//                   ? `Uploading video... ${uploadProgress}%`
//                   : 'Upload complete! Redirecting...'}
//               </p>
//             </div>
//           )}
          
//           {/* Submit button */}
//           <div className="flex justify-end space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.back()}
//               disabled={isUploading}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isUploading}>
//               {isUploading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Uploading...
//                 </>
//               ) : (
//                 'Upload Video'
//               )}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Image, AlertCircle, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

import { useAuthStore } from '@/store/auth-store';
import { videoUploadSchema } from '@/lib/validation';
import { useVideos } from '@/lib/hooks/use-videos';
import { CategoryService } from '@/services/category-service';
import { Category } from '@/types/video';

export default function UploadVideoPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const { uploadVideo } = useVideos();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch categories
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

  // Set up form
  const form = useForm<z.infer<typeof videoUploadSchema>>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryIds: [],
      isPremium: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof videoUploadSchema>) => {
    if (!values.videoFile) {
      form.setError('videoFile', {
        type: 'manual',
        message: 'Please select a video file to upload',
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload progress (in a real app, you'd track actual upload progress)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    try {
      // Add categoryIds to the form values
      const categoryIds = selectedCategories.map(category => category.id);
      
      const uploadData = {
        ...values,
        categoryIds,
      };
      
      const result = await uploadVideo(uploadData);
      
      if (result) {
        setUploadProgress(100);
        // Redirect to video page after upload completes
        router.push(`/video/${result.id}`);
      } else {
        setIsUploading(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setIsUploading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('videoFile', file, { shouldValidate: true });
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('thumbnailFile', file, { shouldValidate: true });
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  // Add a category
  const handleSelectCategory = (category: Category) => {
    // Check if category is already selected
    if (!selectedCategories.some(c => c.id === category.id)) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      form.setValue('categoryIds', newCategories.map(c => c.id), { shouldValidate: true });
    }
    setCommandOpen(false);
  };

  // Remove a category
  const handleRemoveCategory = (categoryId: number) => {
    const newCategories = selectedCategories.filter(c => c.id !== categoryId);
    setSelectedCategories(newCategories);
    form.setValue('categoryIds', newCategories.map(c => c.id), { shouldValidate: true });
  };

  // Check if user has a channel
  const hasNoChannel = isAuthenticated && user && (!user.channelName || user.channelName.trim() === '');

  // If user doesn't have a channel, show warning
  if (hasNoChannel) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Channel Required</AlertTitle>
          <AlertDescription>
            You need to set up your channel before you can upload videos.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => router.push('/settings')}>
          Set Up Channel
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Video File Upload */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Select Video</h2>
                  <FormField
                    control={form.control}
                    name="videoFile"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input
                            {...fieldProps}
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                </div>
                
                {videoPreview ? (
                  <div className="mt-4">
                    <video
                      src={videoPreview}
                      className="w-full aspect-video rounded-md bg-muted"
                      controls
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {form.getValues('videoFile')?.name}
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-12 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click the button above to select a video file
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Video Information */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold">Video Details</h2>
              
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell viewers about your video"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Thumbnail */}
              <FormField
                control={form.control}
                name="thumbnailFile"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <Input
                          {...fieldProps}
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => thumbnailInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Image className="h-4 w-4 mr-2" />
                          {thumbnailPreview ? 'Change Thumbnail' : 'Upload Thumbnail'}
                        </Button>
                        
                        {thumbnailPreview && (
                          <div className="mt-2">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="max-h-40 rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Recommended size: 1280×720 (16:9)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Categories */}
              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              type="button"
                              className="w-full justify-between"
                              disabled={isUploading}
                            >
                              Select categories
                              <span className="ml-2 opacity-70">⌄</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5}>
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandEmpty>No categories found</CommandEmpty>
                              <CommandGroup>
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() => handleSelectCategory(category)}
                                    disabled={selectedCategories.some(c => c.id === category.id)}
                                  >
                                    {category.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        
                        {selectedCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedCategories.map((category) => (
                              <Badge key={category.id} variant="secondary" className="px-2 py-1">
                                {category.name}
                                <button
                                  type="button"
                                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                  onClick={() => handleRemoveCategory(category.id)}
                                  disabled={isUploading}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Select categories that best describe your video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Premium */}
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Premium Content</FormLabel>
                      <FormDescription>
                        Make this video available only to your channel members
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {uploadProgress < 100
                  ? `Uploading video... ${uploadProgress}%`
                  : 'Upload complete! Redirecting...'}
              </p>
            </div>
          )}
          
          {/* Submit button */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Video'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}