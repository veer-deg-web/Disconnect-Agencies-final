import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedback extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    isTestimonial: boolean;
    category?: string;
    rating?: number;
    position?: string;
    company?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, trim: true },
        isTestimonial: { type: Boolean, default: false },
        category: { type: String, trim: true },
        rating: { type: Number, min: 1, max: 10 },
        position: { type: String, trim: true },
        company: { type: String, trim: true },
    },
    { timestamps: true }
);

const Feedback: Model<IFeedback> =
    mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
