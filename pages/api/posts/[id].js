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

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  const findQuery = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

  if (req.method === "GET") {
    try {
      const post = await Post.findOne(findQuery).lean();
      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }
      return res.status(200).json({ post });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Error loading post." });
    }
  }

  if (req.method === "PUT") {
    const claims = verifyAuthHeader(req);
    if (!claims) {
      return res.status(401).json({ error: "Authentication required to edit a post." });
    }

    try {
      const post = await Post.findOne(findQuery);
      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }

      const { title, summary, content, tags } = req.body || {};
      if (title) post.title = String(title).trim();
      if (summary) post.summary = String(summary).trim();
      if (content) post.content = String(content);
      if (tags !== undefined) {
        post.tags = Array.isArray(tags)
          ? tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
          : String(tags)
              .split(",")
              .map((t) => t.trim().toLowerCase())
              .filter(Boolean);
      }

      await post.save();
      return res.status(200).json({ post });
    } catch (error) {
      return res.status(400).json({ error: error.message || "Failed to update post." });
    }
  }

  if (req.method === "DELETE") {
    const claims = verifyAuthHeader(req);
    if (!claims) {
      return res.status(401).json({ error: "Authentication required to delete a post." });
    }

    try {
      const deleted = await Post.findOneAndDelete(findQuery);
      if (!deleted) {
        return res.status(404).json({ error: "Post not found." });
      }
      return res.status(200).json({ deletedId: deleted._id.toString() });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Failed to delete post." });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
