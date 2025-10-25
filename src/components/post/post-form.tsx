'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';

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
import { Input as FileInput } from '@/components/ui/input';
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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const postSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  content: z.string().optional(),
  imageFile: z
    .any()
    .refine(
      (file) => !file || file instanceof File || file?.length === 1,
      'Invalid file'
    )
    .refine(
      (file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file[0];
        return ACCEPTED_IMAGE_TYPES.includes(f.type);
      },
      'Only JPG, PNG, or WEBP are accepted'
    )
    .refine(
      (file) => {
        if (!file) return true;
        const f = file instanceof File ? file : file[0];
        return f.size <= MAX_IMAGE_SIZE;
      },
      'Image must be less than 5MB'
    )
    .optional(),
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
      imageFile: undefined,
    },
  });

  // Update form values when post changes
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        imageFile: undefined,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        imageFile: undefined,
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
          imageFile: (values.imageFile instanceof File) ? values.imageFile : Array.isArray(values.imageFile) ? values.imageFile?.[0] : undefined,
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
          imageFile: (values.imageFile instanceof File) ? values.imageFile : Array.isArray(values.imageFile) ? values.imageFile?.[0] : undefined,
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

            {/* Image upload */}
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image (optional)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={(e) => field.onChange(e.target.files?.[0])}
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