import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Field Notes | Aariv Patel</title>
      </Head>
      <main className="nextjs-about-shell">
        <header>
          <Link href="/">Back to Field Notes</Link>
          <h1>About Field Notes &amp; Architecture</h1>
        </header>

        <section>
          <h2>About the Author</h2>
          <p>
            I am <strong>Aariv Patel</strong>, a freshman at Dulles High School, founder of the
            Digital Design Club, and builder of open-source developer tools and pro-bono community
            websites. I started Field Notes to document the engineering trade-offs behind my builds:
            from supervising parallel coding agents in <code>Regatta</code> to auditing keystroke
            cadence in <code>wasitme</code>, shipping accessible websites for student and community
            initiatives like <strong>MSA</strong>, and tuning 60fps microgames in Godot 4.
          </p>
        </section>

        <section>
          <h2>Hybrid Fullstack Architecture</h2>
          <p>
            Field Notes is built for the Hack Club Stardance &quot;Build Your Own Blog&quot; mission
            using a dual-mode architecture:
          </p>
          <ul>
            <li>
              <strong>Next.js + Mongoose + MongoDB Mode:</strong> Runs via <code>npm run dev</code>{" "}
              with Mongoose schemas in <code>models/Post.js</code> and <code>models/User.js</code>,
              REST endpoints in <code>pages/api/posts/*</code> and <code>pages/api/auth/*</code>,
              bcrypt password hashing, and JWT bearer authentication.
            </li>
            <li>
              <strong>Static GitHub Pages Runtime:</strong> Served at{" "}
              <a href="https://aariv.me/field-notes-blog/">aariv.me/field-notes-blog</a> using a
              zero-dependency client data layer that mirrors the REST API against{" "}
              <code>localStorage</code> so visitors can register accounts, log in, write posts with
              a live split-pane Markdown preview, filter by tags, and bookmark articles right in the
              browser.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
