import { z } from 'zod';

/* ────────────────────────────────────────────────────────────────────────────
 *  Shared Zod schemas for every API route.
 *  Import individual schemas where needed.
 * ──────────────────────────────────────────────────────────────────────── */

// ─── Reusable primitives ────────────────────────────────────────────────────

const email = z.string().trim().toLowerCase().email('Invalid email format');
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');
const password = z.string().min(8, 'Password must be at least 8 characters');

// ─── Auth ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  emailOrPhone: z.string().trim().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const signupInitiateSchema = z.object({
  name:     z.string().trim().min(1, 'Name is required'),
  email,
  phone:    z.string().trim().min(1, 'Phone is required'),
  password,
});

export const verifyEmailSchema = z.object({
  email,
  emailOtp: z.string().trim().min(1, 'OTP is required'),
});

export const resendOtpSchema = z.object({
  email,
  type: z.enum(['email']).optional(),
});

export const forgotPasswordInitiateSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or phone number is required'),
});

export const forgotPasswordVerifyOtpSchema = z.object({
  identifier: z.string().trim().min(1, 'Identifier is required'),
  otp:        z.string().trim().min(1, 'OTP is required'),
});

export const forgotPasswordResetSchema = z.object({
  identifier:  z.string().trim().min(1, 'Identifier is required'),
  otp:         z.string().trim().min(1, 'OTP is required'),
  newPassword: password,
});

export const forgotPasswordResendOtpSchema = z.object({
  identifier: z.string().trim().min(1, 'Identifier is required'),
});

// ─── Bookings ───────────────────────────────────────────────────────────────

const bookingCategories = [
  'aimodels', 'appdev', 'webdev', 'uiux', 'seo', 'cloud',
] as const;

export const bookingScheduleSchema = z.object({
  name:     z.string().trim().min(1, 'Name is required').regex(/^[A-Za-z ]+$/, 'Name must only contain letters and spaces'),
  email:    email,
  category: z.enum(bookingCategories, { message: 'Valid category is required' }),
  date:     z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Valid date is required'),
  time:     z.string().trim().min(1, 'Time is required'),
  notes:    z.string().optional().default(''),
});

// ─── Feedback ───────────────────────────────────────────────────────────────

export const feedbackCreateSchema = z.object({
  content:  z.string().trim().min(1, 'Feedback content is required'),
  category: z.string().trim().optional(),
  rating:   z.number().int().min(1).max(5).optional(),
  position: z.string().trim().optional(),
  company:  z.string().trim().optional(),
});

export const feedbackUpdateSchema = z.object({
  id:      objectId,
  content: z.string().trim().min(1, 'Content is required'),
  rating:  z.number().int().min(1).max(5).optional(),
});

export const feedbackDeleteSchema = z.object({
  id: objectId,
});

// ─── Career ─────────────────────────────────────────────────────────────────

export const careerApplySchema = z.object({
  name:    z.string().trim().min(1, 'Name is required'),
  email,
  phone:   z.string().trim().min(1, 'Phone is required'),
  role:    z.string().trim().min(1, 'Role is required'),
  message: z.string().trim().min(1, 'Message is required'),
});

// ─── User Profile ───────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  name:   z.string().trim().min(1).optional(),
  avatar: z.string().optional().refine(
    (v) => !v || v === '' || v.startsWith('data:image/') || v.startsWith('https://'),
    'Avatar must be a valid HTTPS URL or base64 image',
  ),
});

// ─── Admin: Blogs ───────────────────────────────────────────────────────────

export const adminBlogCreateSchema = z.object({
  title:           z.string().trim().min(1, 'Title is required'),
  content:         z.string().min(1, 'Content is required'),
  slug:            z.string().optional(),
  category:        z.string().optional(),
  excerpt:         z.string().optional(),
  metaTitle:       z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage:   z.string().optional(),
  tags:            z.array(z.string()).optional(),
  author:          z.string().optional(),
  status:          z.enum(['published', 'draft']).optional(),
  faq:             z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
});

export const adminBlogUpdateSchema = z.object({
  id:              objectId,
  title:           z.string().trim().optional(),
  slug:            z.string().optional(),
  category:        z.string().optional(),
  excerpt:         z.string().optional(),
  metaTitle:       z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage:   z.string().optional(),
  content:         z.string().optional(),
  tags:            z.array(z.string()).optional(),
  author:          z.string().optional(),
  status:          z.enum(['published', 'draft']).optional(),
  faq:             z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
});

export const adminBlogDeleteSchema = z.object({
  id: objectId,
});

// ─── Admin: Bookings ────────────────────────────────────────────────────────

export const adminBookingUpdateSchema = z.object({
  id:          objectId,
  adminRemark: z.string().trim().optional(),
  status:      z.enum(['pending', 'completed']).optional(),
});

export const adminBookingDeleteSchema = z.object({
  id: objectId,
});

// ─── Admin: Booking Settings ────────────────────────────────────────────────

export const adminBookingSettingsSchema = z.object({
  meetingLink: z.string().trim().url('Enter a valid meeting link'),
  adminEmails: z.array(z.string().email()).default([]),
});

// ─── Admin: Users ───────────────────────────────────────────────────────────

export const adminUserPatchSchema = z.object({
  id:          objectId,
  isVerified:  z.boolean().optional(),
  isSuspended: z.boolean().optional(),
});

export const adminUserDeleteSchema = z.object({
  id: objectId,
});

// ─── Admin: Feedback ────────────────────────────────────────────────────────

export const adminFeedbackUpdateSchema = z.object({
  id:            objectId,
  isTestimonial: z.boolean().optional(),
  isFeatured:    z.boolean().optional(),
  category:      z.string().trim().optional(),
});

export const adminFeedbackDeleteSchema = z.object({
  id: objectId,
});

// ─── Admin: FAQ ─────────────────────────────────────────────────────────────

export const adminFaqCreateSchema = z.object({
  question: z.string().trim().min(1, 'Question is required'),
  answer:   z.string().trim().min(1, 'Answer is required'),
  category: z.string().trim().min(1, 'Category is required'),
});

export const adminFaqUpdateSchema = z.object({
  id:       objectId,
  question: z.string().trim().optional(),
  answer:   z.string().trim().optional(),
  category: z.string().trim().optional(),
});

export const adminFaqDeleteSchema = z.object({
  id: objectId,
});

// ─── Admin: Career Applications ─────────────────────────────────────────────

export const adminCareerUpdateSchema = z.object({
  id:     objectId,
  status: z.enum(['pending', 'accepted', 'rejected']),
});
