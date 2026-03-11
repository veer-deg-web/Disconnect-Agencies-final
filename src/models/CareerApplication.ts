import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICareerApplication extends Document {
    name: string;
    email: string;
    phone: string;
    role: string;
    message: string;
    resumeUrl: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const CareerApplicationSchema = new Schema<ICareerApplication>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        resumeUrl: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['pending', 'accepted', 'rejected'], 
            default: 'pending' 
        },
    },
    { timestamps: true }
);

const CareerApplication: Model<ICareerApplication> =
    mongoose.models.CareerApplication || mongoose.model<ICareerApplication>('CareerApplication', CareerApplicationSchema);

export default CareerApplication;
