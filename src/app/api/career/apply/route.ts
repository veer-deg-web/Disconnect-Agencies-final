import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CareerApplication from '@/models/CareerApplication';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseForm } from '@/lib/utils';
import { careerApplySchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await safeParseForm(req);
    if (!formData) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty form data', 400);
    }

    const fieldData = {
      name:    formData.get('name') as string || '',
      email:   formData.get('email') as string || '',
      phone:   formData.get('phone') as string || '',
      role:    formData.get('role') as string || '',
      message: formData.get('message') as string || '',
    };

    const parsed = careerApplySchema.safeParse(fieldData);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { name, email, phone, role, message } = sanitizeInput(parsed.data);
    const resume = formData.get('resume');

    if (!resume) {
      return apiError(ErrorCode.VALIDATION_ERROR, 'Resume is required', 400);
    }

    if (!(resume instanceof File)) {
      return apiError(ErrorCode.INVALID_FILE_TYPE, 'Resume must be a valid file upload', 400);
    }

    // Validate file size (5MB)
    if (resume.size > 5 * 1024 * 1024) {
      return apiError(ErrorCode.FILE_TOO_LARGE, 'Resume size must be less than 5MB', 400);
    }

    // Validate file type
    if (resume.type !== 'application/pdf') {
      return apiError(ErrorCode.INVALID_FILE_TYPE, 'Only PDF resumes are accepted', 400);
    }

    // Process file
    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(buffer, 'resumes', 'auto');
    const resumeUrl = cloudinaryResult.secure_url;

    const application = await CareerApplication.create({
      name,
      email,
      phone,
      role,
      message,
      resumeUrl,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error: unknown) {
    console.error('Career application error:', error);
    return dbSafeError(error);
  }
}
