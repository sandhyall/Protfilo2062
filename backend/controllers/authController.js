// // // backend/controllers/auth.controller.js
// // import Admin from "../models/AdminModel.js";
// // import { generateToken } from "../utils/generateToken.js";

// // export const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     if (!email || !password) {
// //       return res.status(400).json({ message: "Email and password are required" });
// //     }
// //     const admin = await Admin.findOne({ email: email.toLowerCase() });
// //     if (!admin || !(await admin.comparePassword(password))) {
// //       return res.status(401).json({ message: "Invalid email or password" });
// //     }
// //     const token = generateToken(admin._id);
// //     res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // export const me = async (req, res) => {
// //   res.json({ admin: req.admin });
// // };

// // // Use once to seed the first admin, then lock this route down or remove it.
// // export const register = async (req, res) => {
// //   try {
// //     const { name, email, password, role } = req.body;
// //     const exists = await Admin.findOne({ email: email.toLowerCase() });
// //     if (exists) return res.status(400).json({ message: "Email already in use" });
// //     const admin = await Admin.create({ name, email, password, role });
// //     res.status(201).json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// // backend/controllers/auth.controller.js

// import Admin from "../models/AdminModel.js";
// import { generateToken } from "../utils/generateToken.js";

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//       });
//     }

//     const admin = await Admin.findOne({
//       email: email.toLowerCase(),
//     });

//     if (!admin || !(await admin.comparePassword(password))) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     const token = generateToken(admin._id);

//     return res.status(200).json({
//       success: true,
//       token,
//       admin: {
//         _id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login Error:", err);

//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// export const me = async (req, res) => {
//   return res.status(200).json({
//     admin: {
//       _id: req.admin._id,
//       name: req.admin.name,
//       email: req.admin.email,
//       role: req.admin.role,
//     },
//   });
// };

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const exists = await Admin.findOne({
//       email: email.toLowerCase(),
//     });

//     if (exists) {
//       return res.status(400).json({
//         message: "Email already in use",
//       });
//     }

//     const admin = await Admin.create({
//       name,
//       email,
//       password,
//       role,
//     });

//     return res.status(201).json({
//       success: true,
//       admin: {
//         _id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role,
//       },
//     });
//   } catch (err) {
//     console.error("Register Error:", err);

//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// backend/controllers/auth.controller.js

import Admin from "../models/AdminModel.js";
import { generateToken } from "../utils/generateToken.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

export const me = async (req, res) => {
  return res.status(200).json({
    admin: {
      _id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};

// Locked down: only an authenticated superadmin can create new admin
// accounts. The route mounts `protect` in front of this controller, so
// `req.admin` is guaranteed to exist by the time we get here.
export const register = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({
        message: "Only a superadmin can create new admin accounts",
      });
    }

    const { name, email, password, role } = req.body;

    const exists = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};