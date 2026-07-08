// backend/models/Blog.model.js
import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({ heading: String, content: String }, { _id: false });
const faqSchema = new mongoose.Schema({ question: String, answer: String }, { _id: false });

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["Web Development", "AI Services", "Company News", "Case Studies", "Tutorials", "Announcements"],
      default: "Company News",
    },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    heroImage: { type: String, default: "" },
    heroImagePublicId: { type: String, default: "" },
    metaTitle: { type: String, maxlength: 60, default: "" },
    metaDescription: { type: String, maxlength: 160, default: "" },
    focusKeyword: { type: String, default: "" },
    sections: [sectionSchema],
    faqs: [faqSchema],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogSchema.pre("save", async function () {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

export default mongoose.model("Blog", blogSchema);