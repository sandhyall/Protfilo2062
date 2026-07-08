// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });