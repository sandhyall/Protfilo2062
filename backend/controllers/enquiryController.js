import Enquiry from "../models/EnquiryModel.js";

const VALID_SOURCES = ["direct", "google", "facebook", "whatsapp", "referral"];

// Falls back to detecting source from the Referer header when the
// frontend didn't explicitly pass one (e.g. plain HTML forms, older clients).
function detectSourceFromRequest(req) {
  const ref = req.headers["referer"] || req.headers["referrer"] || "";
  if (!ref) return "direct";
  if (ref.includes("google.")) return "google";
  if (ref.includes("facebook.") || ref.includes("fb.")) return "facebook";
  if (ref.includes("wa.me") || ref.includes("whatsapp")) return "whatsapp";
  return "referral";
}

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, message, source } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });

    const resolvedSource =
      source && VALID_SOURCES.includes(source) ? source : detectSourceFromRequest(req);

    const enquiry = await Enquiry.create({
      name,
      phone,
      email,
      message,
      source: resolvedSource,
    });

    res.status(201).json(enquiry);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Enquiry.countDocuments(filter);
    res.json({ data: enquiries, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ message: "Not found" });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};