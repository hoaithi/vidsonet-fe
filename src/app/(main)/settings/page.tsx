    'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, User } from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

import { useAuthStore } from '@/store/auth-store';
import { useUser } from '@/lib/hooks/use-user';
import { updateProfileSchema } from '@/lib/validation';




export default function SettingsPage() {
  const { isAuthenticated, profile } = useAuthStore();
  const { updateProfile } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Initialize form with user data
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile?.fullName || '',
      city: profile?.city || '',
      dob: profile?.dob || '',
      description: profile?.description || '',
      profilePicture: undefined,
      bannerImage: undefined,
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || '',
        city: profile.city || '',
        dob: profile.dob || '',
        description: profile.description || '',
        profilePicture: undefined,
        bannerImage: undefined,
      });
      
      // Set image previews
      setProfilePreview(profile.avatarUrl || null);
      setBannerPreview(profile.bannerUrl || null);
      
    }
  }, [profile, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    if (!isAuthenticated || !profile) return;
    
    setIsSubmitting(true);
    
    // Add image URLs to form values if we have them
    const updateData = {
      id: profile.id,
      fullName: values.fullName,
      city: values.city,
      dob: values.dob,
      description: values.description,
      profilePicture: values.profilePicture,
      bannerImage: values.bannerImage,
    };
    
    try {
      await updateProfile(updateData);
      // Success is handled by the useUser hook
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('profilePicture', file, {shouldValidate: true}); // Set the file in the form state
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
    }
  };

  // Handle banner image upload
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('bannerImage', file, {shouldValidate: true});
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  };

  // Handle channel picture upload
  

  // Cleanup Blob URLs
  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [profilePreview, bannerPreview]);

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Profile</h2>

              {/* Banner Image */}
              <div className="mb-8">
                <p className="font-medium mb-2">Banner Image</p>
                <div className="rounded-md overflow-hidden bg-muted h-36 mb-2 relative">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No banner image</p>
                    </div>
                  )}
                </div>

                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {bannerPreview ? 'Change Banner' : 'Upload Banner'}
                </Button>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-6 mb-8">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profilePreview || ''} />
                  <AvatarFallback className="text-xl">
                    {profile.fullName?.charAt(0).toUpperCase() || <User />}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => profileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Profile Picture
                  </Button>
                </div>
              </div>

              {/* Read-only account fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={profile.email || ''} disabled readOnly className="mt-1" />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional. Format: YYYY-MM-DD
                      </FormDescription>
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
                          className="min-h-32"
                          placeholder="Tell people about yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}