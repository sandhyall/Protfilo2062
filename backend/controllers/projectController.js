// backend/controllers/project.controller.js
import Project from "../models/ProjectModel.js";

export const getAdminProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const { search, status, category } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { clientCompany: { $regex: search, $options: "i" } },
      ];
    }

    const [projects, count, ongoingCount, completedCount] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Project.countDocuments(filter),
      Project.countDocuments({ status: "ongoing" }),
      Project.countDocuments({ status: "completed" }),
    ]);

    res.json({ projects, count, ongoingCount, completedCount, totalPages: Math.max(1, Math.ceil(count / limit)), page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const body = { ...req.body, createdBy: req.admin._id };
    if (typeof body.technologies === "string") {
      body.technologies = body.technologies.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (typeof body.payments === "string") body.payments = JSON.parse(body.payments || "[]");
    const project = await Project.create(body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const body = { ...req.body };
    if (typeof body.technologies === "string") {
      body.technologies = body.technologies.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (typeof body.payments === "string") body.payments = JSON.parse(body.payments || "[]");

    Object.assign(project, body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk-delete projects (used by the "N selected → Delete" bulk action).
export const bulkDeleteProjects = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No project ids provided" });
    }
    const result = await Project.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} project(s) deleted`, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addPayment = async (req, res) => {
  try {
    const { amount, date, method, note } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    project.payments.push({ amount, date, method, note });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a single payment record from a project.
export const deletePayment = async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const exists = project.payments.id(paymentId);
    if (!exists) return res.status(404).json({ message: "Payment not found" });

    project.payments.pull({ _id: paymentId });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};