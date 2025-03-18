import mongoose, { Schema } from 'mongoose';
import { User, UserRole } from '../types';

const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'customer'] as UserRole[],
        default: 'customer',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'users' });

userSchema.set('toJSON', {
    transform: (_document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    }
});

// Export the model and its interface
export const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema, 'users');