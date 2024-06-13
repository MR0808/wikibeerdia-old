import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        dateOfBirth: Date,
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'NotSay']
        },
        country: String,
        profilePicture: String,
        isVerified: {
            type: Boolean,
            default: false
        },
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
