'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { usePosts } from '@/lib/hooks/use-posts';
import { Post, PostCreateRequest, PostUpdateRequest } from '@/types/post';

// Form validation schema
const postSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be at most 5000 characters'),
});

interface PostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | null;
  onSuccess?: () => void;
}

export function PostForm({ open, onOpenChange, post, onSuccess }: PostFormProps) {
  const { createPost, updatePost } = usePosts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!post;

  // Initialize form
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  // Update form values when post changes
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
      });
    } else {
      form.reset({
        title: '',
        content: '',
      });
    }
  }, [post, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && post) {
        const updateData: PostUpdateRequest = {
          title: values.title,
          content: values.content,
        };
        
        const result = await updatePost(post.id, updateData);
        if (result) {
          onOpenChange(false);
          onSuccess?.();
        }
      } else {
        const createData: PostCreateRequest = {
          title: values.title,
          content: values.content,
        };
        
        const result = await createPost(createData);
        if (result) {
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Make changes to your post below.' 
                  : 'Share your thoughts with your subscribers.'
                }
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your post title..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="min-h-32"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Post' : 'Create Post'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PostForm;