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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [channelPicturePreview, setChannelPicturePreview] = useState<string | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const channelPictureInputRef = useRef<HTMLInputElement>(null);

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
      username: profile?.fullName || '',
      email: profile?.email || '',
      channelName: profile?.fullName || '',
      channelDescription: profile?.description || '',
      profilePicture: undefined,
      bannerImage: undefined,
      channelPicture: undefined,
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.fullName,
        email: profile.email,
        channelName: profile.fullName,
        channelDescription: profile.description,
        profilePicture: undefined,
        bannerImage: undefined,
        channelPicture: undefined,
      });
      
      // Set image previews
      setProfilePreview(profile.avatarUrl || null);
      setBannerPreview(profile.bannerUrl || null);
      setChannelPicturePreview(profile.avatarUrl || null);
    }
  }, [profile, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    if (!isAuthenticated || !profile) return;
    
    setIsSubmitting(true);
    
    // Add image URLs to form values if we have them
    const updateData = {
      username: values.username,
      email: values.email,
      channelName: values.channelName,
      channelDescription: values.channelDescription,
      profilePicture: values.profilePicture,
      bannerImage: values.bannerImage,
      channelPicture: values.channelPicture,
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
  const handleChannelPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('channelPicture', file, {shouldValidate: true});
      const url = URL.createObjectURL(file);
      setChannelPicturePreview(url);
    }
  };

  // Cleanup Blob URLs
  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
      if (channelPicturePreview && channelPicturePreview.startsWith('blob:')) {
        URL.revokeObjectURL(channelPicturePreview);
      }
    };
  }, [profilePreview, bannerPreview, channelPicturePreview]);

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="channel">Channel</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="profile">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  
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
                  
                  <div className="space-y-6">
                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Your username is visible to all users
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your email is private and used for account notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="channel">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Channel Settings</h2>
                  
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
                  
                  {/* Channel Picture */}
                  <div className="flex items-center gap-6 mb-8">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={channelPicturePreview || ''} />
                      <AvatarFallback className="text-xl">
                        {(profile.fullName)?.charAt(0).toUpperCase() || <User />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <input
                        ref={channelPictureInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChannelPictureChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => channelPictureInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Channel Picture
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Channel Name */}
                    <FormField
                      control={form.control}
                      name="channelName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Your channel name is displayed on your channel page and videos
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Channel Description */}
                    <FormField
                      control={form.control}
                      name="channelDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="min-h-32"
                              placeholder="Tell viewers about your channel"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will appear on your channel page and help viewers discover your content
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
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
      </Tabs>
    </div>
  );
}