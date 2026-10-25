import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Username must be at least 2 characters."],
      maxlength: [32, "Username cannot exceed 32 characters."],
    },
    displayName: {
      type: String,
      required: [true, "Display name is required."],
      trim: true,
      maxlength: [64, "Display name cannot exceed 64 characters."],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required."],
    },
    role: {
      type: String,
      enum: ["author", "reader"],
      default: "author",
    },
    bookmarks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
