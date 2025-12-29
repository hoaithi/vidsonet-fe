'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, Loader2} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthStore } from '@/store/auth-store';
import { videoUploadSchema } from '@/lib/validation';
import { useVideos } from '@/lib/hooks/use-videos';
import { getLocalStorage } from '@/lib/utils';
import VideoFileUploader from '@/components/video/video-file-uploader';
import { VideoDetailsForm } from '@/components/video/video-details-form';

export default function UploadVideoPage() {
  const { isAuthenticated, profile } = useAuthStore();
  const router = useRouter();
  const { uploadVideo } = useVideos();
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    const hasToken = getLocalStorage('accessToken')
    if (!isAuthenticated && !hasToken) {
      console.log("upload page: isAuthenticated" , isAuthenticated)
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  

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
  
    try {

      const uploadData = {
        ...values
      };
      
      const result = await uploadVideo(uploadData);
      
      if (result) {
        router.push(`/video/${result.id}`);
      } else {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setIsUploading(false);;
    }
  };

  // Check if user has a channel
  const hasNoChannel = isAuthenticated && profile && (!profile.fullName || profile.fullName?.trim() === '');

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
          <VideoFileUploader form={form} isUploading={isUploading}/>
          <VideoDetailsForm form={form} isUploading={isUploading}/>
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