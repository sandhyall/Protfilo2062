import Blog from "../models/BlogModel.js";
import cloudinary from "../config/cloudinary.js";

const toSlug = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const removeCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }
};

export const getAdminBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const { search, status } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const [blogs, count, publishedCount, draftCount] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Blog.countDocuments(filter),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
    ]);

    res.json({ blogs, count, publishedCount, draftCount, totalPages: Math.max(1, Math.ceil(count / limit)), page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBlog = async (req, res) => {
  console.log("createBlog called");
  console.log(req.file);
  console.log(req.body);
  try {
    const body = { ...req.body };
    body.tags = JSON.parse(body.tags || "[]");
    body.sections = JSON.parse(body.sections || "[]");
    body.faqs = JSON.parse(body.faqs || "[]");
    body.slug = body.slug ? toSlug(body.slug) : toSlug(body.title);

    if (req.file) {
      body.heroImage = req.file.path; // Cloudinary secure URL
      body.heroImagePublicId = req.file.filename; // Cloudinary public_id
    }

    body.author = req.admin._id;

    const blog = await Blog.create(body);
    res.status(201).json(blog);
  } catch (err) {
    console.error("========== BLOG ERROR ==========");
    console.error(err);
    console.error(err.stack);

    return res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const body = { ...req.body };
    body.tags = JSON.parse(body.tags || "[]");
    body.sections = JSON.parse(body.sections || "[]");
    body.faqs = JSON.parse(body.faqs || "[]");
    body.slug = toSlug(body.slug || body.title);

    if (req.file) {
      await removeCloudinaryImage(blog.heroImagePublicId);
      body.heroImage = req.file.path;
      body.heroImagePublicId = req.file.filename;
    } else if (body.removeHeroImage === "true") {
      await removeCloudinaryImage(blog.heroImagePublicId);
      body.heroImage = "";
      body.heroImagePublicId = "";
    } else {
      delete body.heroImage;
    }
    delete body.removeHeroImage;

    Object.assign(blog, body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Slug already exists" });
    res.status(500).json({ message: err.message });
  }
};

export const archiveBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { status: "archived" }, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    await removeCloudinaryImage(blog.heroImagePublicId);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};