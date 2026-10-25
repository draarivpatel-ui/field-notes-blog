import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a post title."],
      trim: true,
      maxlength: [160, "Title cannot be more than 160 characters."],
    },
    slug: {
      type: String,
      required: [true, "Please provide a URL slug."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    summary: {
      type: String,
      required: [true, "Please provide a short summary."],
      maxlength: [360, "Summary cannot exceed 360 characters."],
    },
    content: {
      type: String,
      required: [true, "Post markdown content is required."],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      default: "Aariv Patel",
    },
    authorUsername: {
      type: String,
      required: true,
      default: "aariv",
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    readingTimeMinutes: {
      type: Number,
      default: 1,
    },
    reactions: {
      insightful: { type: Number, default: 0 },
      shipped: { type: Number, default: 0 },
      bookmarked: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const words = String(this.content || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    this.wordCount = words;
    this.readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
