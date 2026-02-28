import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBookingSettings extends Document {
  meetingLink: string;
  adminEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BookingSettingsSchema = new Schema<IBookingSettings>(
  {
    meetingLink: { type: String, default: '', trim: true },
    adminEmails: { type: [String], default: [] },
  },
  { timestamps: true }
);

const BookingSettings: Model<IBookingSettings> =
  (mongoose.models.BookingSettings as Model<IBookingSettings>) ||
  mongoose.model<IBookingSettings>('BookingSettings', BookingSettingsSchema);

export default BookingSettings;
