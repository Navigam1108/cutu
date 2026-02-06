import mongoose, { Schema, Model } from 'mongoose';

export interface IDay {
    dayId: number;
    unlockDate: Date;
    passcode: string;
    hint: string;
    imageUrl: string;
    backNote: string;
    phrase: string;
    digitalAsset: string;
}

const DaySchema = new Schema<IDay>(
    {
        dayId: { type: Number, required: true, unique: true, min: 1, max: 7 },
        unlockDate: { type: Date, required: true },
        passcode: { type: String, required: true },
        hint: { type: String, required: true },
        imageUrl: { type: String, required: true },
        backNote: { type: String, required: true },
        phrase: { type: String, required: true },
        digitalAsset: { type: String, required: true }, // e.g. "rose", "teddy"
    },
    { timestamps: true }
);

// Prevent overwrite on hot reload
const Day: Model<IDay> =
    mongoose.models.Day || mongoose.model<IDay>('Day', DaySchema);

export default Day;
