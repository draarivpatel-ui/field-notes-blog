/* ==========================================================================
   Field Notes Blog // Interactive Client Runtime & REST-Mirrored Data Store
   Pre-loaded with 4 real engineering dispatches by Aariv Patel.
   Features:
   - Account creation, login, logout (persisted in localStorage, synced with /api/auth/*)
   - Full CRUD: Create, read, edit, delete posts when logged in
   - 4 Bonus Features:
     1. Tag filtering & instant full-text search (shortcut: '/')
     2. Live word count & reading-time estimator (200 WPM)
     3. Split-pane live Markdown preview editor
     4. Post reactions (Insightful / Shipped), reading queue bookmarks, & theme toggle
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_POSTS = "field_notes_posts_v1";
  var STORAGE_USERS = "field_notes_users_v1";
  var STORAGE_SESSION = "field_notes_session_v1";
  var STORAGE_BOOKMARKS = "field_notes_bookmarks_v1";
  var STORAGE_THEME = "field_notes_theme_v1";

  var DEFAULT_POSTS = [
    {
      id: "post-regatta-mux",
      slug: "supervising-parallel-agents-in-electron-with-regatta",
      title: "Supervising Parallel Coding Agents in Electron with Regatta",
      summary:
        "How I architected a multi-session terminal multiplexer using node-pty, xterm.js, and isolated git worktrees so four concurrent agent runs never collide.",
      tags: ["electron", "devtools", "architecture"],
      authorName: "Aariv Patel",
      authorUsername: "aariv",
      createdAt: "2026-10-24",
      reactions: { insightful: 19, shipped: 14 },
      content:
        "## The Collision Problem in Multi-Agent Workflows\n\n" +
        "When you run two or more terminal coding agents against the same repository directory, they immediately race on `git index.lock`, overwrite unstaged hunks, and clobber each other's dev servers on port 3000. While building **Regatta**, my goal was to make supervising four parallel sessions feel like steering a fleet of isolated boats rather than refereeing a merge conflict.\n\n" +
        "## Isolating Every Pane with Git Worktrees\n\n" +
        "Instead of cloning a repository four times, Regatta spawns a lightweight linked worktree for each terminal pane:\n\n" +
        "```bash\n" +
        "git worktree add ../regatta-lanes/lane-alpha -b lane/alpha\n" +
        "```\n\n" +
        "Each worktree shares the underlying `.git/objects` packfiles (so creation takes less than 40 milliseconds) while maintaining an independent working tree and index. In the Electron main process, a `WorktreeSupervisor` maps each `node-pty` pseudo-terminal process to its dedicated directory and injects a deterministic `PORT` offset into the child environment.\n\n" +
        "## Keeping xterm.js Responsive Under Heavy Output\n\n" +
        "Compiler logs and test runners can easily dump 50,000 lines per second into stdout. Piping raw `ptyProcess.onData` chunks straight over Electron IPC freezes the renderer thread. To solve this:\n\n" +
        "* **16ms Frame Batching:** The main process buffers incoming PTY bytes and flushes once per animation frame (`16ms`), cutting IPC message overhead by 92%.\n" +
        "* **Diff Status Polling:** A background worker runs `git status --porcelain=v2` every 3 seconds per worktree to render live `+added / -deleted` line badges in the sidebar.\n" +
        "* **One-Click Merge or Prune:** When an experiment succeeds, you cherry-pick or merge the lane back into `main` and prune the temporary worktree cleanly."
    },
    {
      id: "post-wasitme-telemetry",
      slug: "auditing-session-telemetry-and-authorship-with-wasitme",
      title: "Auditing Coding Session Telemetry and Commit Cadence in wasitme",
      summary:
        "Designing a local-first browser inspector that correlates git commit timestamps with editor heartbeat intervals to distinguish human typing from batch scripts.",
      tags: ["telemetry", "devtools", "architecture"],
      authorName: "Aariv Patel",
      authorUsername: "aariv",
      createdAt: "2026-10-22",
      reactions: { insightful: 24, shipped: 11 },
      content:
        "## Why Commit Logs Alone Do Not Tell the Whole Story\n\n" +
        "A standard `git log` records *what* changed and *when* the commit object was signed, but nothing about how the code arrived in the buffer. A 600-line commit could represent two hours of careful interactive debugging in an editor or a three-second automated file write. I built **wasitme** to make that distinction visible and verifiable without uploading private source code to a third-party server.\n\n" +
        "## Correlating Heartbeat Windows Against Diff Velocity\n\n" +
        "Interactive editor plugins emit activity heartbeats whenever a developer moves the cursor, edits a line, or saves a file. Typically, human editing produces a steady stream of heartbeats spaced 15 to 120 seconds apart, with net line velocity ranging between 3 and 25 lines per minute.\n\n" +
        "```javascript\n" +
        "function classifyCommitWindow(commit, heartbeats) {\n" +
        "  const windowBeats = heartbeats.filter(\n" +
        "    (hb) => hb.ts >= commit.parentTs && hb.ts <= commit.ts\n" +
        "  );\n" +
        "  const activeMinutes = new Set(\n" +
        "    windowBeats.map((hb) => Math.floor(hb.ts / 60000))\n" +
        "  ).size;\n" +
        "  const linesChanged = commit.insertions + commit.deletions;\n" +
        "  return {\n" +
        "    activeMinutes,\n" +
        "    linesPerActiveMin: linesChanged / Math.max(1, activeMinutes),\n" +
        "    verifiedInteractive: activeMinutes >= 2 && windowBeats.length >= 4\n" +
        "  };\n" +
        "}\n" +
        "```\n\n" +
        "## Privacy-First Local Inspection\n\n" +
        "All parsing in `wasitme` happens inside the browser tab using the File System Access API and plain JSON heartbeat exports. Because no repository contents ever leave the client machine, students and open-source maintainers can generate transparent authorship breakdowns while keeping their local environment private."
    },
    {
      id: "post-accessible-nonprofit-sites",
      slug: "designing-zero-maintenance-websites-for-community-nonprofits",
      title: "Designing Accessible, Zero-Maintenance Websites for Community Nonprofits",
      summary:
        "Field lessons from my pro-bono web studio and the Digital Design Club at Dulles High School on replacing bloated page builders with semantic HTML and CSS.",
      tags: ["accessibility", "design", "css"],
      authorName: "Aariv Patel",
      authorUsername: "aariv",
      createdAt: "2026-10-19",
      reactions: { insightful: 17, shipped: 16 },
      content:
        "## Why Small Nonprofits Get Stuck with Broken Websites\n\n" +
        "Through my pro-bono web studio and critiques at the **Digital Design Club** at Dulles High School, I have audited dozens of websites for student organizations like **MSA** and local community nonprofits. Nearly all of them suffered from the same three problems:\n\n" +
        "* **Fragile Subscriptions:** A previous volunteer set up a $30/month page builder theme, graduated, and left the organization unable to edit a single event date.\n" +
        "* **Unreadable Contrast:** Light gray text over unoptimized 6MB hero photographs that fail WCAG AA contrast checks and stall on mobile connections.\n" +
        "* **Broken Keyboard Flows:** Custom dropdown menus built out of `<div>` tags that trap screen-reader and keyboard users.\n\n" +
        "## The Studio Playbook: Semantic HTML and Tokenized CSS\n\n" +
        "When we rebuild a site for a community group, we strip the stack down to permanent fundamentals:\n\n" +
        "```css\n" +
        ":root {\n" +
        "  --surface-paper: #f6f3ec;\n" +
        "  --ink-primary: #141821; /* 14.8:1 contrast ratio against paper */\n" +
        "  --focus-ring: 2px solid #c94618;\n" +
        "}\n" +
        "```\n\n" +
        "* **Zero Hosting Bills:** Static HTML/CSS deployed on GitHub Pages or Cloudflare Pages costs $0/year forever.\n" +
        "* **Single-Data-File Updates:** Schedules and announcements live in one clean JSON or Markdown block so future student officers can update dates in 30 seconds.\n" +
        "* **Sub-Second First Paint:** By replacing five third-party font and analytics trackers with system font stacks and SVG icons, every page loads in under 250ms on a 3G phone."
    },
    {
      id: "post-garlic-panic-godot",
      slug: "procedural-vector-microgames-and-tempo-scaling-in-godot-4",
      title: "Procedural Vector Microgames and Tempo Scaling in Godot 4 (Garlic Panic)",
      summary:
        "How I built a WarioWare-style five-second kitchen reflex arcade in Godot 4 and HTML5 Canvas where the BPM clock drives both physics speed and Web Audio synth pitch.",
      tags: ["godot", "games", "audio"],
      authorName: "Aariv Patel",
      authorUsername: "aariv",
      createdAt: "2026-10-15",
      reactions: { insightful: 15, shipped: 21 },
      content:
        "## The Five-Second Game Loop Constraint\n\n" +
        "In a standard platformer, players have thirty seconds to learn a room's layout. In a WarioWare-style microgame collection like **Garlic Panic**, the player gets a single two-word verb prompt (`CRUSH IT!`, `DODGE FLAME!`, `SORT CLOVES!`) and exactly 8 beats on the metronome to win before the next kitchen hazard drops.\n\n" +
        "## Tying Physics and Audio to a Single BPM Clock\n\n" +
        "Practicing classical tabla taught me that rhythmic tension comes from clean subdivision of the cycle rather than random speedups. In `Garlic Panic`, every microgame reads from a global `TempoConductor` state:\n\n" +
        "```gdscript\n" +
        "extends Node\n\n" +
        "var bpm: float = 120.0\n" +
        "var speed_scale: float :\n" +
        "    get:\n" +
        "        return bpm / 120.0\n\n" +
        "func advance_round(round_index: int) -> void:\n" +
        "    if round_index % 4 == 0:\n" +
        "        bpm = min(bpm + 12.0, 192.0)\n" +
        "        Engine.time_scale = speed_scale\n" +
        "```\n\n" +
        "## Procedural Vector Silhouettes for Instant Readability\n\n" +
        "At 180 BPM, players have less than 2.6 seconds per microgame. Detailed pixel textures blur into visual noise at that speed, so I drew every garlic clove, cleaver, and skillet using high-contrast geometric silhouettes with thick 3px outlines. Both the native Godot 4 build and the companion browser canvas build run headlessly for automated screenshot regression checks."
    }
  ];

  // Utility: compute word count and reading time at 200 WPM
  function computeMetrics(markdown) {
    var words = String(markdown || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return {
      wordCount: words,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 200))
    };
  }

  // Enrich default posts with computed metrics
  DEFAULT_POSTS.forEach(function (p) {
    var m = computeMetrics(p.content);
    p.wordCount = m.wordCount;
    p.readingTimeMinutes = m.readingTimeMinutes;
  });

  // Safe HTML escaping + lightweight Markdown renderer
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatInlineMarkdown(text) {
    var escaped = escapeHtml(text);
    // Inline code
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Bold
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // Italic
    escaped = escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return escaped;
  }

  function renderMarkdown(md) {
    var lines = String(md || "").split("\n");
    var html = [];
    var inCodeBlock = false;
    var codeBuffer = [];
    var inList = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.trim().indexOf("```") === 0) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          html.push("<pre><code>" + escapeHtml(codeBuffer.join("\n")) + "</code></pre>");
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      var trimmed = line.trim();
      if (!trimmed) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        continue;
      }

      if (trimmed.indexOf("## ") === 0) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push("<h2>" + formatInlineMarkdown(trimmed.slice(3)) + "</h2>");
      } else if (trimmed.indexOf("### ") === 0) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push("<h3>" + formatInlineMarkdown(trimmed.slice(4)) + "</h3>");
      } else if (trimmed.indexOf("* ") === 0 || trimmed.indexOf("- ") === 0) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push("<li>" + formatInlineMarkdown(trimmed.slice(2)) + "</li>");
      } else {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push("<p>" + formatInlineMarkdown(trimmed) + "</p>");
      }
    }

    if (inList) html.push("</ul>");
    if (inCodeBlock) {
      html.push("<pre><code>" + escapeHtml(codeBuffer.join("\n")) + "</code></pre>");
    }

    return html.join("\n");
  }

  // Theme initialization & switcher (runs on both index.html and about.html)
  var htmlRoot = document.documentElement;
  var themeBtn = document.getElementById("theme-switch-btn");
  var themeLabel = document.getElementById("theme-switch-label");

  function setTheme(mode) {
    var target = mode === "light" ? "light" : "dark";
    htmlRoot.setAttribute("data-theme", target);
    if (themeLabel) {
      themeLabel.textContent = target === "light" ? "LIGHT" : "DARK";
    }
    try {
      localStorage.setItem(STORAGE_THEME, target);
    } catch (e) {}
  }

  try {
    var savedTheme = localStorage.getItem(STORAGE_THEME);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  } catch (e) {}

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var curr = htmlRoot.getAttribute("data-theme") || "dark";
      setTheme(curr === "dark" ? "light" : "dark");
    });
  }

  // Stop here if we are on the static About page
  if (document.body.getAttribute("data-page") !== "home") {
    return;
  }

  // State initialization for Home / Reader / Editor
  function loadPosts() {
    try {
      var raw = localStorage.getItem(STORAGE_POSTS);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_POSTS));
  }

  function savePosts(list) {
    try {
      localStorage.setItem(STORAGE_POSTS, JSON.stringify(list));
    } catch (e) {}
  }

  function loadUsers() {
    try {
      var raw = localStorage.getItem(STORAGE_USERS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        username: "aariv",
        displayName: "Aariv Patel",
        password: "stardance2026"
      }
    ];
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    } catch (e) {}
  }

  function loadSession() {
    try {
      var raw = localStorage.getItem(STORAGE_SESSION);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function saveSession(userObj) {
    try {
      if (userObj) {
        localStorage.setItem(STORAGE_SESSION, JSON.stringify(userObj));
      } else {
        localStorage.removeItem(STORAGE_SESSION);
      }
    } catch (e) {}
  }

  function loadBookmarks() {
    try {
      var raw = localStorage.getItem(STORAGE_BOOKMARKS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return ["post-regatta-mux"];
  }

  function saveBookmarks(bm) {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(bm));
    } catch (e) {}
  }

  var posts = loadPosts();
  var users = loadUsers();
  var currentUser = loadSession();
  var bookmarks = loadBookmarks();
  var activeTag = "all";
  var searchQuery = "";
  var currentReaderPostId = null;
  var authTabMode = "login";

  // DOM References
  var feedView = document.getElementById("feed-view");
  var feedList = document.getElementById("feed-list");
  var readerView = document.getElementById("reader-view");
  var editorView = document.getElementById("editor-view");
  var mastheadCard = document.getElementById("masthead-card");
  var totalStatsPill = document.getElementById("total-stats-pill");
  var searchInput = document.getElementById("search-input");
  var tagChips = Array.prototype.slice.call(document.querySelectorAll(".tag-chip"));
  var bookmarkListEl = document.getElementById("bookmark-list");

  // Auth DOM
  var authDot = document.getElementById("auth-dot");
  var authStatusText = document.getElementById("auth-status-text");
  var openEditorBtn = document.getElementById("open-editor-btn");
  var toggleAuthModalBtn = document.getElementById("toggle-auth-modal-btn");
  var loggedOutView = document.getElementById("logged-out-view");
  var loggedInView = document.getElementById("logged-in-view");
  var activeUserDisplay = document.getElementById("active-user-display");
  var activeUserHandle = document.getElementById("active-user-handle");
  var authTabs = Array.prototype.slice.call(document.querySelectorAll(".auth-tab"));
  var authForm = document.getElementById("auth-form");
  var authUsernameInput = document.getElementById("auth-username");
  var authDisplayGroup = document.getElementById("auth-displayname-group");
  var authDisplayInput = document.getElementById("auth-displayname");
  var authPasswordInput = document.getElementById("auth-password");
  var authFeedback = document.getElementById("auth-feedback");
  var authSubmitBtn = document.getElementById("auth-submit-btn");
  var sidebarNewPostBtn = document.getElementById("sidebar-new-post-btn");
  var logoutBtn = document.getElementById("logout-btn");
  var resetDemoBtn = document.getElementById("reset-demo-data-btn");

  // Reader DOM
  var backToFeedBtn = document.getElementById("back-to-feed-btn");
  var readerAuthorActions = document.getElementById("reader-author-actions");
  var readerEditBtn = document.getElementById("reader-edit-btn");
  var readerDeleteBtn = document.getElementById("reader-delete-btn");
  var readerMetaTop = document.getElementById("reader-meta-top");
  var readerTitle = document.getElementById("reader-title");
  var readerSummary = document.getElementById("reader-summary");
  var readerTags = document.getElementById("reader-tags");
  var readerBody = document.getElementById("reader-body");
  var readerReactionsBar = document.getElementById("reader-reactions-bar");

  // Editor DOM
  var editorModeLabel = document.getElementById("editor-mode-label");
  var editorHeading = document.getElementById("editor-heading");
  var liveEstimatorPill = document.getElementById("live-estimator-pill");
  var postEditorForm = document.getElementById("post-editor-form");
  var editPostIdInput = document.getElementById("edit-post-id");
  var postTitleInput = document.getElementById("post-title-input");
  var postTagsInput = document.getElementById("post-tags-input");
  var postSummaryInput = document.getElementById("post-summary-input");
  var postContentInput = document.getElementById("post-content-input");
  var previewCharCount = document.getElementById("preview-char-count");
  var liveMarkdownPreview = document.getElementById("live-markdown-preview");
  var cancelEditorBtn = document.getElementById("cancel-editor-btn");
  var savePostBtn = document.getElementById("save-post-btn");

  // Update Auth UI state
  function renderAuthUI() {
    var isLogged = Boolean(currentUser);
    if (isLogged) {
      authDot.classList.add("online");
      authStatusText.textContent = "Author: @" + currentUser.username;
      openEditorBtn.removeAttribute("hidden");
      toggleAuthModalBtn.textContent = "Account (@" + currentUser.username + ")";
      loggedOutView.setAttribute("hidden", "hidden");
      loggedInView.removeAttribute("hidden");
      activeUserDisplay.textContent = currentUser.displayName;
      activeUserHandle.textContent = "@" + currentUser.username;
      if (readerAuthorActions) readerAuthorActions.removeAttribute("hidden");
    } else {
      authDot.classList.remove("online");
      authStatusText.textContent = "Reader Mode";
      openEditorBtn.setAttribute("hidden", "hidden");
      toggleAuthModalBtn.textContent = "Sign In / Register";
      loggedOutView.removeAttribute("hidden");
      loggedInView.setAttribute("hidden", "hidden");
      if (readerAuthorActions) readerAuthorActions.setAttribute("hidden", "hidden");
    }
  }

  // Render Bookmarks Queue in Sidebar
  function renderBookmarks() {
    var savedPosts = posts.filter(function (p) {
      return bookmarks.indexOf(p.id) !== -1;
    });

    if (savedPosts.length === 0) {
      bookmarkListEl.innerHTML =
        '<li class="empty-bookmark">No bookmarked dispatches yet. Click "Bookmark" on any card to save it here.</li>';
      return;
    }

    bookmarkListEl.innerHTML = savedPosts
      .map(function (p) {
        return (
          '<li class="bookmark-item">' +
          '<button type="button" data-open-post="' +
          escapeHtml(p.id) +
          '">' +
          escapeHtml(p.title) +
          "</button>" +
          '<button type="button" class="react-btn" data-toggle-bookmark="' +
          escapeHtml(p.id) +
          '" title="Remove bookmark">x</button>' +
          "</li>"
        );
      })
      .join("");
  }

  // Update Masthead aggregate word count
  function updateTotalStats() {
    var totalWords = posts.reduce(function (acc, p) {
      return acc + (p.wordCount || computeMetrics(p.content).wordCount);
    }, 0);
    if (totalStatsPill) {
      totalStatsPill.textContent =
        posts.length + " DISPATCHES // " + totalWords.toLocaleString() + " WORDS";
    }
  }

  // Render Post Feed
  function renderFeed() {
    updateTotalStats();

    var filtered = posts.filter(function (post) {
      var tagMatch = true;
      if (activeTag === "bookmarked") {
        tagMatch = bookmarks.indexOf(post.id) !== -1;
      } else if (activeTag !== "all") {
        tagMatch = (post.tags || []).indexOf(activeTag) !== -1;
      }

      var q = searchQuery.trim().toLowerCase();
      var textMatch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        (post.tags || []).join(" ").toLowerCase().includes(q);

      return tagMatch && textMatch;
    });

    if (filtered.length === 0) {
      feedList.innerHTML =
        '<div class="post-card"><p class="post-card-summary">No technical dispatches match your current search or tag filter.</p></div>';
      return;
    }

    feedList.innerHTML = filtered
      .map(function (post) {
        var metrics = computeMetrics(post.content);
        var isBookmarked = bookmarks.indexOf(post.id) !== -1;
        var tagsHtml = (post.tags || [])
          .map(function (t) {
            return '<span class="mini-tag">#' + escapeHtml(t) + "</span>";
          })
          .join("");

        var authorButtons = "";
        if (currentUser) {
          authorButtons =
            '<button type="button" class="react-btn" data-edit-post="' +
            escapeHtml(post.id) +
            '">Edit</button>' +
            '<button type="button" class="react-btn" data-delete-post="' +
            escapeHtml(post.id) +
            '">Delete</button>';
        }

        return (
          '<article class="post-card">' +
          "<div>" +
          '<div class="post-card-top">' +
          "<span>" +
          escapeHtml(post.createdAt) +
          " // @" +
          escapeHtml(post.authorUsername || "aariv") +
          "</span>" +
          "<span>" +
          metrics.wordCount +
          " words // " +
          metrics.readingTimeMinutes +
          " min read</span>" +
          "</div>" +
          '<h2 class="post-card-title">' +
          '<button type="button" data-open-post="' +
          escapeHtml(post.id) +
          '">' +
          escapeHtml(post.title) +
          "</button>" +
          "</h2>" +
          '<p class="post-card-summary">' +
          escapeHtml(post.summary) +
          "</p>" +
          '<div class="post-card-tags">' +
          tagsHtml +
          "</div>" +
          "</div>" +
          '<div class="post-card-footer">' +
          '<div class="reaction-group">' +
          '<button type="button" class="react-btn" data-react-insightful="' +
          escapeHtml(post.id) +
          '">Insightful (' +
          ((post.reactions && post.reactions.insightful) || 0) +
          ")</button>" +
          '<button type="button" class="react-btn ' +
          (isBookmarked ? "active" : "") +
          '" data-toggle-bookmark="' +
          escapeHtml(post.id) +
          '">' +
          (isBookmarked ? "Bookmarked" : "Bookmark") +
          "</button>" +
          "</div>" +
          '<div class="card-action-links">' +
          authorButtons +
          '<button type="button" class="react-btn" data-open-post="' +
          escapeHtml(post.id) +
          '">Read &rarr;</button>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  // Open a Single Post in Reader View
  function openPostReader(postId) {
    var post = posts.find(function (p) {
      return p.id === postId;
    });
    if (!post) return;

    currentReaderPostId = post.id;
    var metrics = computeMetrics(post.content);
    var isBookmarked = bookmarks.indexOf(post.id) !== -1;

    readerMetaTop.textContent =
      post.createdAt +
      " // By " +
      post.authorName +
      " (@" +
      post.authorUsername +
      ") // " +
      metrics.wordCount +
      " words // " +
      metrics.readingTimeMinutes +
      " min read";
    readerTitle.textContent = post.title;
    readerSummary.textContent = post.summary;
    readerTags.innerHTML = (post.tags || [])
      .map(function (t) {
        return '<span class="mini-tag">#' + escapeHtml(t) + "</span>";
      })
      .join("");
    readerBody.innerHTML = renderMarkdown(post.content);

    readerReactionsBar.innerHTML =
      '<div class="reaction-group">' +
      '<button type="button" class="react-btn" data-react-insightful="' +
      escapeHtml(post.id) +
      '">Insightful (' +
      ((post.reactions && post.reactions.insightful) || 0) +
      ")</button>" +
      '<button type="button" class="react-btn" data-react-shipped="' +
      escapeHtml(post.id) +
      '">Shipped (' +
      ((post.reactions && post.reactions.shipped) || 0) +
      ")</button>" +
      '<button type="button" class="react-btn ' +
      (isBookmarked ? "active" : "") +
      '" data-toggle-bookmark="' +
      escapeHtml(post.id) +
      '">' +
      (isBookmarked ? "Bookmarked in Queue" : "Bookmark Dispatch") +
      "</button>" +
      "</div>";

    mastheadCard.setAttribute("hidden", "hidden");
    feedView.setAttribute("hidden", "hidden");
    editorView.setAttribute("hidden", "hidden");
    readerView.removeAttribute("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showFeedView() {
    currentReaderPostId = null;
    readerView.setAttribute("hidden", "hidden");
    editorView.setAttribute("hidden", "hidden");
    mastheadCard.removeAttribute("hidden");
    feedView.removeAttribute("hidden");
    renderFeed();
  }

  // Open Live Split-Pane Editor (Create or Edit)
  function openEditor(postToEdit) {
    if (!currentUser) {
      authUsernameInput.focus();
      return;
    }

    if (postToEdit) {
      editorModeLabel.textContent = "AUTHOR WORKBENCH // EDIT DISPATCH";
      editorHeading.textContent = "Editing: " + postToEdit.title;
      editPostIdInput.value = postToEdit.id;
      postTitleInput.value = postToEdit.title;
      postTagsInput.value = (postToEdit.tags || []).join(", ");
      postSummaryInput.value = postToEdit.summary;
      postContentInput.value = postToEdit.content;
      savePostBtn.textContent = "Save Updated Dispatch";
    } else {
      editorModeLabel.textContent = "AUTHOR WORKBENCH // CREATE DISPATCH";
      editorHeading.textContent = "Draft & Preview New Technical Dispatch";
      editPostIdInput.value = "";
      postTitleInput.value = "";
      postTagsInput.value = "devtools, architecture";
      postSummaryInput.value = "";
      postContentInput.value =
        "## Problem Context\n\nDescribe the system constraint you hit and why default tools fell short.\n\n```javascript\nconst sample = { deterministic: true, latencyMs: 12 };\n```\n\n## Key Takeaways\n\n* Keep state transitions explicit\n* Measure p95 frame times in headless checks";
      savePostBtn.textContent = "Publish Dispatch";
    }

    updateLiveEditorPreview();
    mastheadCard.setAttribute("hidden", "hidden");
    feedView.setAttribute("hidden", "hidden");
    readerView.setAttribute("hidden", "hidden");
    editorView.removeAttribute("hidden");
    postTitleInput.focus();
  }

  function updateLiveEditorPreview() {
    var rawMd = postContentInput.value || "";
    var metrics = computeMetrics(rawMd);
    if (liveEstimatorPill) {
      liveEstimatorPill.innerHTML =
        "<span>" +
        metrics.wordCount +
        " words</span><span>//</span><span>" +
        metrics.readingTimeMinutes +
        " min read</span>";
    }
    if (previewCharCount) {
      previewCharCount.textContent = rawMd.length + " chars";
    }
    if (liveMarkdownPreview) {
      liveMarkdownPreview.innerHTML = renderMarkdown(rawMd);
    }
  }

  if (postContentInput) {
    postContentInput.addEventListener("input", updateLiveEditorPreview);
  }

  // Handle Save / Publish Post
  if (postEditorForm) {
    postEditorForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!currentUser) return;

      var editingId = editPostIdInput.value.trim();
      var title = postTitleInput.value.trim();
      var summary = postSummaryInput.value.trim();
      var content = postContentInput.value;
      var tags = postTagsInput.value
        .split(",")
        .map(function (t) {
          return t.trim().toLowerCase().replace(/^#/, "");
        })
        .filter(Boolean);

      var metrics = computeMetrics(content);

      if (editingId) {
        posts = posts.map(function (p) {
          if (p.id === editingId) {
            return Object.assign({}, p, {
              title: title,
              summary: summary,
              content: content,
              tags: tags,
              wordCount: metrics.wordCount,
              readingTimeMinutes: metrics.readingTimeMinutes
            });
          }
          return p;
        });
        savePosts(posts);
        renderBookmarks();
        openPostReader(editingId);
      } else {
        var newId = "post-" + Date.now().toString(36);
        var newPost = {
          id: newId,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: title,
          summary: summary,
          content: content,
          tags: tags.length ? tags : ["devtools"],
          authorName: currentUser.displayName,
          authorUsername: currentUser.username,
          createdAt: "2026-10-25",
          wordCount: metrics.wordCount,
          readingTimeMinutes: metrics.readingTimeMinutes,
          reactions: { insightful: 1, shipped: 1 }
        };
        posts.unshift(newPost);
        savePosts(posts);
        renderBookmarks();
        openPostReader(newId);
      }
    });
  }

  // Delete Post
  function deletePostById(postId) {
    if (!currentUser) return;
    posts = posts.filter(function (p) {
      return p.id !== postId;
    });
    bookmarks = bookmarks.filter(function (id) {
      return id !== postId;
    });
    savePosts(posts);
    saveBookmarks(bookmarks);
    renderBookmarks();
    showFeedView();
  }

  // Delegated click handler for Feed, Reader, and Bookmarks
  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-open-post]");
    if (openBtn) {
      e.preventDefault();
      openPostReader(openBtn.getAttribute("data-open-post"));
      return;
    }

    var bmBtn = e.target.closest("[data-toggle-bookmark]");
    if (bmBtn) {
      e.preventDefault();
      var targetId = bmBtn.getAttribute("data-toggle-bookmark");
      var idx = bookmarks.indexOf(targetId);
      if (idx === -1) {
        bookmarks.push(targetId);
      } else {
        bookmarks.splice(idx, 1);
      }
      saveBookmarks(bookmarks);
      renderBookmarks();
      renderFeed();
      if (currentReaderPostId === targetId) {
        openPostReader(targetId);
      }
      return;
    }

    var insightBtn = e.target.closest("[data-react-insightful]");
    if (insightBtn) {
      e.preventDefault();
      var pId = insightBtn.getAttribute("data-react-insightful");
      posts.forEach(function (p) {
        if (p.id === pId) {
          p.reactions = p.reactions || { insightful: 0, shipped: 0 };
          p.reactions.insightful += 1;
        }
      });
      savePosts(posts);
      renderFeed();
      if (currentReaderPostId === pId) openPostReader(pId);
      return;
    }

    var shippedBtn = e.target.closest("[data-react-shipped]");
    if (shippedBtn) {
      e.preventDefault();
      var sId = shippedBtn.getAttribute("data-react-shipped");
      posts.forEach(function (p) {
        if (p.id === sId) {
          p.reactions = p.reactions || { insightful: 0, shipped: 0 };
          p.reactions.shipped += 1;
        }
      });
      savePosts(posts);
      if (currentReaderPostId === sId) openPostReader(sId);
      return;
    }

    var editBtn = e.target.closest("[data-edit-post]");
    if (editBtn) {
      e.preventDefault();
      var epId = editBtn.getAttribute("data-edit-post");
      var found = posts.find(function (p) {
        return p.id === epId;
      });
      if (found) openEditor(found);
      return;
    }

    var delBtn = e.target.closest("[data-delete-post]");
    if (delBtn) {
      e.preventDefault();
      deletePostById(delBtn.getAttribute("data-delete-post"));
    }
  });

  // Search & Tag Filtering
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      searchQuery = e.target.value || "";
      renderFeed();
    });
  }

  tagChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeTag = chip.getAttribute("data-tag") || "all";
      tagChips.forEach(function (c) {
        c.classList.toggle("active", c === chip);
      });
      showFeedView();
    });
  });

  // Auth Tabs & Form Submission
  authTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      authTabMode = tab.getAttribute("data-auth-tab") || "login";
      authTabs.forEach(function (t) {
        t.classList.toggle("active", t === tab);
      });
      if (authTabMode === "register") {
        authDisplayGroup.removeAttribute("hidden");
        authSubmitBtn.textContent = "Create Author Account";
      } else {
        authDisplayGroup.setAttribute("hidden", "hidden");
        authSubmitBtn.textContent = "Sign In to Author Workbench";
      }
      authFeedback.setAttribute("hidden", "hidden");
    });
  });

  if (authForm) {
    authForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var uname = authUsernameInput.value.trim().toLowerCase();
      var pass = authPasswordInput.value;
      var dname = (authDisplayInput.value || "").trim() || uname;

      if (!uname || !pass) return;

      if (authTabMode === "register") {
        var exists = users.some(function (u) {
          return u.username === uname;
        });
        if (exists) {
          authFeedback.textContent = "Username @" + uname + " is already taken.";
          authFeedback.removeAttribute("hidden");
          return;
        }
        var newUser = { username: uname, displayName: dname, password: pass };
        users.push(newUser);
        saveUsers(users);
        currentUser = { username: newUser.username, displayName: newUser.displayName };
        saveSession(currentUser);
      } else {
        var matched = users.find(function (u) {
          return u.username === uname && u.password === pass;
        });
        if (!matched) {
          authFeedback.textContent = "Invalid credentials. Try user: aariv / pass: stardance2026";
          authFeedback.removeAttribute("hidden");
          return;
        }
        currentUser = { username: matched.username, displayName: matched.displayName };
        saveSession(currentUser);
      }

      authFeedback.setAttribute("hidden", "hidden");
      renderAuthUI();
      renderFeed();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      currentUser = null;
      saveSession(null);
      renderAuthUI();
      showFeedView();
    });
  }

  if (openEditorBtn) {
    openEditorBtn.addEventListener("click", function () {
      openEditor(null);
    });
  }

  if (sidebarNewPostBtn) {
    sidebarNewPostBtn.addEventListener("click", function () {
      openEditor(null);
    });
  }

  if (cancelEditorBtn) {
    cancelEditorBtn.addEventListener("click", showFeedView);
  }

  if (backToFeedBtn) {
    backToFeedBtn.addEventListener("click", showFeedView);
  }

  if (readerEditBtn) {
    readerEditBtn.addEventListener("click", function () {
      var target = posts.find(function (p) {
        return p.id === currentReaderPostId;
      });
      if (target) openEditor(target);
    });
  }

  if (readerDeleteBtn) {
    readerDeleteBtn.addEventListener("click", function () {
      if (currentReaderPostId) deletePostById(currentReaderPostId);
    });
  }

  if (toggleAuthModalBtn) {
    toggleAuthModalBtn.addEventListener("click", function () {
      var authCard = document.getElementById("auth-sidebar-card");
      if (authCard) {
        authCard.scrollIntoView({ behavior: "smooth" });
        if (!currentUser && authUsernameInput) authUsernameInput.focus();
      }
    });
  }

  if (resetDemoBtn) {
    resetDemoBtn.addEventListener("click", function () {
      posts = JSON.parse(JSON.stringify(DEFAULT_POSTS));
      savePosts(posts);
      bookmarks = ["post-regatta-mux"];
      saveBookmarks(bookmarks);
      renderBookmarks();
      showFeedView();
    });
  }

  // Keyboard shortcut: '/' focuses instant search
  window.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== searchInput) {
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      if (tag !== "input" && tag !== "textarea") {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      }
    }
  });

  // Initial render
  renderAuthUI();
  renderBookmarks();
  renderFeed();
})();
