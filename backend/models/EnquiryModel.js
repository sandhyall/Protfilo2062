// backend/models/EnquiryModel.js
import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, default: "" },
    source: { type: String, enum: ["direct", "google", "facebook", "whatsapp", "referral"], default: "direct" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);