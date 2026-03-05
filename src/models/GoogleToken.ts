import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGoogleToken extends Document {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // unix ms
    email: string;     // connected Google account email (for display)
    createdAt: Date;
    updatedAt: Date;
}

const GoogleTokenSchema = new Schema<IGoogleToken>(
    {
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        expiresAt: { type: Number, required: true },
        email: { type: String, default: '' },
    },
    { timestamps: true }
);

/**
 * We only ever keep ONE document (singleton).
 * Use GoogleToken.findOneAndReplace / upsert everywhere.
 */
const GoogleToken: Model<IGoogleToken> =
    (mongoose.models.GoogleToken as Model<IGoogleToken>) ||
    mongoose.model<IGoogleToken>('GoogleToken', GoogleTokenSchema);

export default GoogleToken;
