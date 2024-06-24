import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        username: {
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
        firstName: String,
        lastName: String,
        passwordLastUpdated: Date,
        dateOfBirth: Date,
        access: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User'
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'NotSay']
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'State'
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country'
        },
        profilePicture: String,
        isVerified: {
            type: Boolean,
            default: false
        },
        emailOld: String,
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
