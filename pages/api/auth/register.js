import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-fallback-secret-change-in-env";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    await dbConnect();

    const { username, displayName, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanDisplay = String(displayName || username).trim();

    if (cleanUsername.length < 2 || password.length < 6) {
      return res.status(400).json({
        error: "Username must be at least 2 characters and password at least 6 characters.",
      });
    }

    const existing = await User.findOne({ username: cleanUsername });
    if (existing) {
      return res.status(409).json({ error: "That username is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await User.create({
      username: cleanUsername,
      displayName: cleanDisplay,
      passwordHash,
      role: "author",
    });

    const token = jwt.sign(
      { sub: created._id.toString(), username: created.username, displayName: created.displayName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: created._id.toString(),
        username: created.username,
        displayName: created.displayName,
        role: created.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Registration failed." });
  }
}
