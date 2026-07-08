// backend/routes/blog.routes.js
import { Router } from "express";
import { getAdminBlogs, createBlog, updateBlog, archiveBlog, deleteBlog } from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadBlogImage } from "../middleware/uploadMiddleware.js";

const router = Router();
router.use(protect);

router.get("/admin/all", getAdminBlogs);
router.post("/", uploadBlogImage, createBlog);
router.put("/:id", uploadBlogImage, updateBlog);
router.patch("/:id/archive", archiveBlog);
router.delete("/:id", deleteBlog);

export default router;