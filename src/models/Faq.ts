import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  category: 'general' | 'cloud';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true },
    answer:   { type: String, required: true, trim: true },
    category: { type: String, enum: ['general', 'cloud'], required: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Faq: Model<IFaq> =
  (mongoose.models.Faq as Model<IFaq>) || mongoose.model<IFaq>('Faq', FaqSchema);

export default Faq;
