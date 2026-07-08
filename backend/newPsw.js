// backend/scripts/changeAdminCredentials.js
// Run once: node backend/scripts/changeAdminCredentials.js
//
// Updates an existing admin's name/email/password. Uses .save() (not
// findOneAndUpdate) so the pre("save") hook in Admin.model.js hashes
// the new password correctly.

import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/AdminModel.js";

dotenv.config();

// ─── EDIT THESE VALUES ────────────────────────────────────────────────
const CURRENT_EMAIL = "info@asliyarecruitment.com";      // the admin account to update
const NEW_NAME       = "Sandesh Dahal";                  // required by current schema
const NEW_EMAIL      = "sandeshdahal860@gmail.com";       // set to CURRENT_EMAIL if unchanged
const NEW_PASSWORD   = "SandeshInnovations@2026";         // min 6 chars per schema
// ───────────────────────────────────────────────────────────────────────

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const admin = await Admin.findOne({ email: CURRENT_EMAIL.toLowerCase() });
    if (!admin) {
      console.error(`❌ No admin found with email: ${CURRENT_EMAIL}`);
      process.exit(1);
    }

    admin.name = NEW_NAME;
    admin.email = NEW_EMAIL.toLowerCase();
    admin.password = NEW_PASSWORD; // pre-save hook hashes this automatically
    await admin.save();

    console.log("✅ Admin credentials updated successfully:");
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   (password hashed and saved — not printed)`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating admin credentials:", err.message);
    process.exit(1);
  }
}

run();