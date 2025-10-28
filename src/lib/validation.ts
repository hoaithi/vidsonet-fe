import * as z from 'zod';

// Auth schemas
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string()
    .min(4, 'Username must be at least 4 characters')
    .max(30, 'Username must be at most 30 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().optional(),
  dob: z.string().optional(),
  city: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// refine dob (if provided) to ensure user is at least 10 years old
export const dobMinYears = (val?: string | null, minYears = 10) => {
  if (!val) return true;
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= minYears;
};

// attach dob validation to registerSchema
export const registerSchemaWithDob = registerSchema.refine(
  (data) => dobMinYears(data.dob, 10),
  { message: 'You must be at least 10 years old', path: ['dob'] }
);

// Profile update schema
export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name is too long').optional(),
  city: z.string().max(100, 'City is too long').optional(),
  dob: z.string().optional(),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  profilePicture: z.instanceof(File).optional(),
  bannerImage: z.instanceof(File).optional(),
});

// Video upload schema
export const videoUploadSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string().max(5000, 'Description must be at most 5000 characters'),
  categoryIds: z.array(z.number()).optional(),
  isPremium: z.boolean(),
  videoFile: z.instanceof(File, { message: 'Video file is required' }),
  thumbnailFile: z.instanceof(File, { message: 'Thumbnail is required' }),
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
  parentId: z.string(),
});

// Video search schema
export const videoSearchSchema = z.object({
  keyword: z.string().optional(),
  userId: z.string().optional(),
  isPremium: z.boolean().optional(),
});