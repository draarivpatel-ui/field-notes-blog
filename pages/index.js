import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";

function estimateMetrics(text) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    words,
    minutes: Math.max(1, Math.ceil(words / 200)),
  };
}

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [editorState, setEditorState] = useState({
    id: null,
    title: "",
    summary: "",
    tags: "devtools, architecture",
    content: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(() => {});

    try {
      const savedToken = localStorage.getItem("fn_jwt_token");
      const savedUser = localStorage.getItem("fn_jwt_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {}
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const tagMatch =
        selectedTag === "all" ||
        (Array.isArray(post.tags) && post.tags.includes(selectedTag));
      const q = searchQuery.trim().toLowerCase();
      const textMatch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q);
      return tagMatch && textMatch;
    });
  }, [posts, selectedTag, searchQuery]);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setStatusMessage("");
    const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusMessage(data.error || "Authentication failed.");
      return;
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("fn_jwt_token", data.token);
    localStorage.setItem("fn_jwt_user", JSON.stringify(data.user));
    setUsername("");
    setPassword("");
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("fn_jwt_token");
    localStorage.removeItem("fn_jwt_user");
  }

  async function handleSavePost(e) {
    e.preventDefault();
    if (!token) return;
    const isEdit = Boolean(editorState.id);
    const url = isEdit ? `/api/posts/${editorState.id}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editorState.title,
        summary: editorState.summary,
        content: editorState.content,
        tags: editorState.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatusMessage(data.error || "Failed to save post.");
      return;
    }

    if (isEdit) {
      setPosts((prev) => prev.map((p) => (p._id === data.post._id ? data.post : p)));
    } else {
      setPosts((prev) => [data.post, ...prev]);
    }
    setEditorState({ id: null, title: "", summary: "", tags: "devtools", content: "" });
  }

  async function handleDeletePost(id) {
    if (!token) return;
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p._id !== id));
    }
  }

  const draftStats = estimateMetrics(editorState.content);

  return (
    <>
      <Head>
        <title>Field Notes | Engineering &amp; Design Blog by Aariv Patel</title>
      </Head>
      <main className="nextjs-blog-shell">
        <header className="nextjs-header">
          <div>
            <h1>Field Notes // Aariv Patel</h1>
            <p>Long-form engineering dispatches on terminal tooling, telemetry, and design systems.</p>
          </div>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        <section className="controls-bar">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by title, summary, or markdown content..."
          />
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="all">All tags</option>
            <option value="electron">electron</option>
            <option value="telemetry">telemetry</option>
            <option value="accessibility">accessibility</option>
            <option value="godot">godot</option>
          </select>
        </section>

        <section className="posts-feed">
          {filteredPosts.map((post) => (
            <article key={post._id || post.slug} className="post-item">
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="post-meta">
                By {post.authorName} // {post.wordCount} words // {post.readingTimeMinutes} min read
              </p>
              <p>{post.summary}</p>
              {user && (
                <div className="author-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setEditorState({
                        id: post._id,
                        title: post.title,
                        summary: post.summary,
                        tags: (post.tags || []).join(", "),
                        content: post.content,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeletePost(post._id)}>
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>

        <aside className="auth-editor-panel">
          {!user ? (
            <form onSubmit={handleAuthSubmit}>
              <h3>{authMode === "register" ? "Create Author Account" : "Author Sign In"}</h3>
              {statusMessage && <p className="error-msg">{statusMessage}</p>}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">{authMode === "register" ? "Register" : "Log In"}</button>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}
              >
                Switch to {authMode === "register" ? "Log In" : "Register"}
              </button>
            </form>
          ) : (
            <div>
              <p>
                Signed in as <strong>{user.displayName}</strong> (@{user.username})
                <button type="button" onClick={handleLogout}>
                  Log Out
                </button>
              </p>
              <form onSubmit={handleSavePost}>
                <h3>{editorState.id ? "Edit Post" : "Publish New Post"}</h3>
                <p>
                  Live Estimator: {draftStats.words} words // {draftStats.minutes} min read
                </p>
                <input
                  type="text"
                  placeholder="Post Title"
                  value={editorState.title}
                  onChange={(e) => setEditorState({ ...editorState, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Summary"
                  value={editorState.summary}
                  onChange={(e) => setEditorState({ ...editorState, summary: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Comma-separated tags"
                  value={editorState.tags}
                  onChange={(e) => setEditorState({ ...editorState, tags: e.target.value })}
                />
                <textarea
                  rows={8}
                  placeholder="Write post in Markdown..."
                  value={editorState.content}
                  onChange={(e) => setEditorState({ ...editorState, content: e.target.value })}
                  required
                />
                <button type="submit">{editorState.id ? "Save Changes" : "Publish Post"}</button>
              </form>
            </div>
          )}
        </aside>
      </main>
    </>
  );
}
