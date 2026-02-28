import mongoose, { Document, Model, Schema } from 'mongoose';

type BookingCategory = 'aimodels' | 'appdev' | 'webdev' | 'uiux' | 'seo' | 'cloud';
type BookingStatus = 'pending' | 'completed';

export interface IBooking extends Document {
  name: string;
  email: string;
  category: BookingCategory;
  serviceTitle: string;
  dateIso: string;
  dateLabel: string;
  time: string;
  notes: string;
  meetingLink: string;
  adminEmailsNotified: string[];
  adminRemark: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    category: {
      type: String,
      enum: ['aimodels', 'appdev', 'webdev', 'uiux', 'seo', 'cloud'],
      required: true,
    },
    serviceTitle: { type: String, required: true, trim: true },
    dateIso: { type: String, required: true, trim: true },
    dateLabel: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true },
    meetingLink: { type: String, required: true, trim: true },
    adminEmailsNotified: { type: [String], default: [] },
    adminRemark: { type: String, default: '', trim: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
