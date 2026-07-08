// backend/models/Visit.model.js
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    page: { type: String, default: "/" },
    source: { type: String, default: "direct" },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Visit", visitSchema);