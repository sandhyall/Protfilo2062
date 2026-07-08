// backend/models/ProjectModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    method: {
      type: String,
      enum: ["Bank Transfer", "Cash", "eSewa", "Khalti", "PayPal", "Stripe", "Other"],
      default: "Bank Transfer",
    },
    note: { type: String, default: "" },
  },
  { _id: true, timestamps: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Web Development", "AI Services", "Mobile App", "UI/UX Design", "Maintenance", "Other"],
      default: "Web Development",
    },
    description: { type: String, default: "" },
    technologies: [{ type: String }],
    clientCompany: { type: String, required: true, trim: true },
    clientContact: { type: String, default: "" },
    cost: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["USD", "NPR", "EUR", "GBP"], default: "USD" },
    status: { type: String, enum: ["ongoing", "completed", "on-hold", "cancelled"], default: "ongoing" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    payments: [paymentSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

projectSchema.virtual("totalPaid").get(function () {
  return this.payments.reduce((sum, p) => sum + p.amount, 0);
});

projectSchema.virtual("balance").get(function () {
  return this.cost - this.payments.reduce((sum, p) => sum + p.amount, 0);
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

export default mongoose.model("Project", projectSchema);