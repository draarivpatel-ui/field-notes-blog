import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function SinglePostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => setPost(data.post))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <Link href="/">Return to Field Notes</Link>
      </main>
    );
  }

  if (!post) {
    return (
      <main>
        <p>Loading technical dispatch...</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} | Field Notes</title>
      </Head>
      <main className="nextjs-post-detail">
        <nav>
          <Link href="/">All Dispatches</Link>
          <Link href="/about">About</Link>
        </nav>
        <article>
          <header>
            <h1>{post.title}</h1>
            <p>
              By {post.authorName} (@{post.authorUsername}) // {post.wordCount} words //{" "}
              {post.readingTimeMinutes} min read
            </p>
            <div>
              {(post.tags || []).map((tag) => (
                <span key={tag} className="tag-badge">
                  #{tag}
                </span>
              ))}
            </div>
          </header>
          <pre className="markdown-body">{post.content}</pre>
        </article>
      </main>
    </>
  );
}
