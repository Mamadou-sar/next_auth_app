import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, select: false },
      role: { type: String, default: 'user' },
      image: { type: String },
      authPrividerId: { type: String },
   },
   { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model('User', userSchema);
