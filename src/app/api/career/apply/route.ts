import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CareerApplication from '@/models/CareerApplication';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as string;
    const message = formData.get('message') as string;
    const resume = formData.get('resume') as File;

    if (!name || !email || !phone || !role || !message || !resume) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate file size (5MB)
    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Resume size must be less than 5MB' }, { status: 400 });
    }

    // Validate file type
    if (resume.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF resumes are accepted' }, { status: 400 });
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
      status: 'pending'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully!',
      application 
    });

  } catch (error: unknown) {
    console.error('Career application error:', error);
    return NextResponse.json({ error: (error as Error)?.message || 'Internal server error' }, { status: 500 });
  }
}
