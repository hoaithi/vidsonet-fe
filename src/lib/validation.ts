import * as z from 'zod';

// Auth schemas
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Profile update schema
export const updateProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  channelName: z.string().max(50, 'Channel name must be at most 50 characters').optional(),
  channelDescription: z.string().max(500, 'Channel description must be at most 500 characters').optional(),
  profilePicture: z.instanceof(File).optional(),
  bannerImage: z.instanceof(File).optional(),
  channelPicture: z.instanceof(File).optional(),
});

// Video upload schema
export const videoUploadSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  categoryIds: z.array(z.number()).optional(),
  isPremium: z.boolean(),
  videoFile: z.instanceof(File, { message: 'Video file is required' }),
  thumbnailFile: z.instanceof(File, { message: 'Thumbnail is required' }).optional(),
});

// Video update schema
export const videoUpdateSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters')
    .optional(),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  categoryIds: z.array(z.number()).optional(),
  isPremium: z.boolean().optional(),
});

// Comment schema
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be at most 1000 characters'),
});

// Reply schema
export const replySchema = z.object({
  content: z.string()
    .min(1, 'Reply cannot be empty')
    .max(1000, 'Reply must be at most 1000 characters'),
  parentId: z.number(),
});

// Video search schema
export const videoSearchSchema = z.object({
  keyword: z.string().optional(),
  categoryId: z.number().optional(),
  userId: z.number().optional(),
  isPremium: z.boolean().optional(),
});