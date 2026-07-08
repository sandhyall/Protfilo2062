// backend/controllers/stats.controller.js
import Enquiry from "../models/EnquiryModel.js";
import Visit from "../models/VisitModel.js";
import Project from "../models/ProjectModel.js";

const pctChange = (curr, prev) => (prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100));

export const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalVisits, totalEnquiries, visitsThisMonth, enquiriesThisMonth, visitsLastMonth, enquiriesLastMonth] =
      await Promise.all([
        Visit.countDocuments(),
        Enquiry.countDocuments(),
        Visit.countDocuments({ createdAt: { $gte: startOfMonth } }),
        Enquiry.countDocuments({ createdAt: { $gte: startOfMonth } }),
        Visit.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
        Enquiry.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      ]);

    res.json({
      totalVisits,
      totalEnquiries,
      visitsThisMonth,
      enquiriesThisMonth,
      visitChangePercent: pctChange(visitsThisMonth, visitsLastMonth),
      enquiryChangePercent: pctChange(enquiriesThisMonth, enquiriesLastMonth),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDailyVisits = async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const count = await Visit.countDocuments({ createdAt: { $gte: d, $lt: next } });
      days.push({ day: d.toLocaleDateString("en-US", { weekday: "short" }), count });
    }
    res.json(days);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEnquirySources = async (req, res) => {
  try {
    const results = await Enquiry.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]);
    const total = results.reduce((s, r) => s + r.count, 0) || 1;
    res.json(results.map((r) => ({ source: r._id, count: r.count, percent: Math.round((r.count / total) * 100) })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ cost: -1 }).limit(5);
    res.json(projects.map((p) => ({ title: p.title, clientCompany: p.clientCompany, cost: p.cost, status: p.status })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const [enquiries, visits, projects] = await Promise.all([
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Visit.find().sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const activity = [
      ...enquiries.map((e) => ({ type: "enquiry", message: `New enquiry from ${e.name}`, source: e.source, time: e.createdAt })),
      ...visits.map((v) => ({ type: "visit", message: `New visit on ${v.page}`, source: v.source, time: v.createdAt })),
      ...projects.map((p) => ({ type: "job", message: `New project added: ${p.title}`, source: "direct", time: p.createdAt })),
    ];

    activity.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(activity.slice(0, 8));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};