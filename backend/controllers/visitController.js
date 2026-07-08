import Visit from "../models/VisitModel.js";

export const trackVisit = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const referer = req.headers["referer"] || "direct";
    let source = "direct";

    if (referer.includes("google")) source = "google";
    else if (referer.includes("facebook") || referer.includes("fb.com")) source = "facebook";
    else if (referer.includes("whatsapp")) source = "whatsapp";
    else if (referer !== "direct") source = "referral";

    await Visit.create({
      ip,
      userAgent: req.headers["user-agent"],
      path: req.body.path || "/",
      referer,
      source,
    });

    res.status(201).json({ tracked: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};