// Linux Tour — shared chrome renderer.
// Inspired by the real Windows XP htmlTour's structure (chapters, colored
// per chapter, a sidebar + bottom nav bar + sub-topic navigation), rebuilt
// with modern DOM APIs instead of the original's frameset/document.all,
// which don't work in current browsers at all.
//
// Each content page just sets data-chapter and data-page on <body> and
// includes empty #tour-sidebar / #tour-bottombar containers — this file
// fills them in identically on every page, so the chrome markup only
// exists once instead of being copy-pasted into 20+ files.

const TOUR_CHAPTERS = [
  {
    id: "start",
    color: "#808080",
    title: "Start Here",
    style: "list",
    pages: [
      { id: "desktop", title: "The Linux Desktop" },
      { id: "icons", title: "Icons" },
      { id: "taskbar", title: "Taskbar / Panel" },
      { id: "menu", title: "Application Menu" },
      { id: "files", title: "Files and Folders" },
      { id: "windows", title: "Windows" },
      { id: "control", title: "Settings" },
      { id: "ending", title: "Ending Your Session" }
    ]
  },
  {
    id: "safe",
    color: "#FF4600",
    title: "Safe and Easy Personal Computing",
    style: "thumb",
    pages: [
      { id: "easier", title: "Easier to Learn and Use" },
      { id: "faster", title: "Faster, Smarter, Safer" },
      { id: "better", title: "Better Help for Every Task" }
    ]
  },
  {
    id: "unlock",
    color: "#54AA2B",
    title: "Unlock the World of Digital Media",
    style: "thumb",
    pages: [
      { id: "built", title: "Built-in Creative & Media Tools" },
      { id: "optimized", title: "Optimized for Games" }
    ]
  },
  {
    id: "connected",
    color: "#495AD1",
    title: "The Connected Home and Office",
    style: "thumb",
    pages: [
      { id: "data", title: "Data Protection, Inside and Out" },
      { id: "multiple", title: "Multiple Users \u2014 A Cinch to Switch" },
      { id: "networks", title: "Networks: Powerful and Practical" },
      { id: "wizard", title: "Let the Installer do the Work" }
    ]
  },
  {
    id: "best",
    color: "#D29B00",
    title: "Best for Business",
    style: "thumb",
    pages: [
      { id: "road", title: "On the Road and Around the World" },
      { id: "robust", title: "Robust, Reliable, Compatible" },
      { id: "secure", title: "More Secure; Easier To Manage" }
    ]
  }
];

function findChapter(chapterId) {
  return TOUR_CHAPTERS.find((c) => c.id === chapterId);
}

function pageUrl(chapterId, pageId) {
  return `${chapterId}_${pageId}.html`;
}

// Works out, for the current chapter/page, what "Next" should point to —
// the next sub-page in this chapter, or the first page of the next
// chapter, or back to the hub if we're at the very end of the tour.
function getNextTarget(chapterId, pageId) {
  const chapterIndex = TOUR_CHAPTERS.findIndex((c) => c.id === chapterId);
  const chapter = TOUR_CHAPTERS[chapterIndex];
  const pageIndex = chapter.pages.findIndex((p) => p.id === pageId);

  if (pageIndex < chapter.pages.length - 1) {
    return pageUrl(chapterId, chapter.pages[pageIndex + 1].id);
  }
  if (chapterIndex < TOUR_CHAPTERS.length - 1) {
    const nextChapter = TOUR_CHAPTERS[chapterIndex + 1];
    return pageUrl(nextChapter.id, nextChapter.pages[0].id);
  }
  return "index.html";
}

function renderSidebar(currentChapterId) {
  const el = document.getElementById("tour-sidebar");
  if (!el) return;

  const items = TOUR_CHAPTERS.map((chapter) => {
    const isCurrent = chapter.id === currentChapterId;
    const firstPage = chapter.pages[0].id;
    const classes = isCurrent ? "sidebar-link current" : "sidebar-link";
    return `<a href="${pageUrl(chapter.id, firstPage)}" class="${classes}" style="--chapter-color:${chapter.color}">${chapter.title}</a>`;
  }).join("");

  el.innerHTML = `
    <a href="index.html" class="sidebar-home">&larr; Tour Home</a>
    <nav class="sidebar-nav">${items}</nav>
  `;
}

function renderBottomBar(currentChapterId) {
  const el = document.getElementById("tour-bottombar");
  if (!el) return;

  const items = TOUR_CHAPTERS.map((chapter) => {
    const isCurrent = chapter.id === currentChapterId;
    const classes = isCurrent ? "bottombar-link current" : "bottombar-link";
    return `<a href="${pageUrl(chapter.id, chapter.pages[0].id)}" class="${classes}">${chapter.title}</a>`;
  }).join("");

  el.innerHTML = `<nav class="bottombar-nav">${items}</nav>`;
}

// The "start" chapter uses a plain bulleted sub-topic list (matching the
// real tour's start_*.htm pages); the other four chapters use a row of
// thumbnail-style topic selectors (matching the real best_*.htm/safe_*.htm
// pattern) — same two layouts the original tour actually used.
function renderSubNav(chapter, currentPageId) {
  const el = document.getElementById("tour-subnav");
  if (!el) return;

  if (chapter.style === "list") {
    const items = chapter.pages.map((p) => {
      const isCurrent = p.id === currentPageId;
      const classes = isCurrent ? "subnav-list-link current" : "subnav-list-link";
      return `<li><a href="${pageUrl(chapter.id, p.id)}" class="${classes}">${p.title}</a></li>`;
    }).join("");
    el.innerHTML = `<ul class="subnav-list">${items}</ul>`;
  } else {
    const items = chapter.pages.map((p) => {
      const isCurrent = p.id === currentPageId;
      const classes = isCurrent ? "subnav-thumb current" : "subnav-thumb";
      return `<a href="${pageUrl(chapter.id, p.id)}" class="${classes}">${p.title}</a>`;
    }).join("");
    el.innerHTML = `<div class="subnav-thumbs">${items}</div>`;
  }
}

function setupNextLink(chapterId, pageId) {
  const nextLink = document.getElementById("next-link");
  if (!nextLink) return;
  nextLink.href = getNextTarget(chapterId, pageId);
}

function initTourPage() {
  const chapterId = document.body.dataset.chapter;
  const pageId = document.body.dataset.page;
  const chapter = findChapter(chapterId);
  if (!chapter) return;

  document.documentElement.style.setProperty("--chapter-color", chapter.color);

  renderSidebar(chapterId);
  renderBottomBar(chapterId);
  renderSubNav(chapter, pageId);
  setupNextLink(chapterId, pageId);
}

document.addEventListener("DOMContentLoaded", initTourPage);
