import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import Post from "../../../models/Post";

const JWT_SECRET = process.env.JWT_SECRET || "dev-fallback-secret-change-in-env";

function verifyAuthHeader(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function slugify(title) {
  return String(title || "post")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { tag, q } = req.query;
      const filter = {};
      if (tag && tag !== "all") {
        filter.tags = String(tag).toLowerCase();
      }
      if (q) {
        const regex = new RegExp(String(q), "i");
        filter.$or = [{ title: regex }, { summary: regex }, { content: regex }];
      }
      const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ posts });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Failed to fetch posts." });
    }
  }

  if (req.method === "POST") {
    const claims = verifyAuthHeader(req);
    if (!claims) {
      return res.status(401).json({ error: "Authentication required to publish a post." });
    }

    try {
      const { title, summary, content, tags } = req.body || {};
      if (!title || !summary || !content) {
        return res.status(400).json({ error: "Title, summary, and content are required." });
      }

      const baseSlug = slugify(title);
      const slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
      const normalizedTags = Array.isArray(tags)
        ? tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
        : String(tags || "")
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);

      const post = await Post.create({
        title: String(title).trim(),
        slug,
        summary: String(summary).trim(),
        content: String(content),
        tags: normalizedTags,
        authorName: claims.displayName || claims.username,
        authorUsername: claims.username,
      });

      return res.status(201).json({ post });
    } catch (error) {
      return res.status(400).json({ error: error.message || "Failed to create post." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
