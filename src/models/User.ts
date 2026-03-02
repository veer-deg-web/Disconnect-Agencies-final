import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  emailOtp?: string;
  emailOtpExpiry?: Date;
  smsOtp?: string;
  smsOtpExpiry?: Date;
  forgotPasswordOtp?: string;
  forgotPasswordOtpExpiry?: Date;
  forgotPasswordIdentifier?: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },
    smsOtp: { type: String },
    smsOtpExpiry: { type: Date },
    forgotPasswordOtp: { type: String },
    forgotPasswordOtpExpiry: { type: Date },
    forgotPasswordIdentifier: { type: String },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
