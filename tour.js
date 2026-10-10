// Linux Tour — shared chrome renderer.
// Matches the real tour's actual structure: a top header bar listing ALL
// chapters, a left sidebar listing the CURRENT chapter's sub-topics, and
// a bottom bar with short labels, the current chapter muted since you're
// already there.

const TOUR_CHAPTERS = [
  {
    id: "start",
    color: "#808080",
    title: "Start Here",
    shortTitle: "Start Here",
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
    shortTitle: "Personal Computing",
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
    shortTitle: "Digital Media",
    pages: [
      { id: "built", title: "Built-in Creative & Media Tools" },
      { id: "optimized", title: "Optimized for Games" }
    ]
  },
  {
    id: "connected",
    color: "#495AD1",
    title: "The Connected Home and Office",
    shortTitle: "Home and Office",
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
    shortTitle: "Business",
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

// Top header bar: lists all 5 chapters, horizontally
function renderTopNav(currentChapterId) {
  const el = document.getElementById("tour-topnav");
  if (!el) return;

  const items = TOUR_CHAPTERS.map((chapter) => {
    const isCurrent = chapter.id === currentChapterId;
    const classes = isCurrent ? "topnav-link current" : "topnav-link";
    return `
      <a href="${pageUrl(chapter.id, chapter.pages[0].id)}" class="${classes}" style="color:${chapter.color}">
        ${chapter.title}
        <span class="topnav-bar" style="background:${chapter.color}"></span>
      </a>`;
  }).join("");

  el.innerHTML = `
    <img src="pics/linuxlogo.png" alt="Linux" class="topnav-logo">
    <nav class="topnav-nav">${items}</nav>
  `;
}

// Left sidebar: lists the CURRENT chapter's own sub-topics
function renderSidebar(chapter, currentPageId) {
  const el = document.getElementById("tour-sidebar");
  if (!el) return;

  const items = chapter.pages.map((p) => {
    const isCurrent = p.id === currentPageId;
    const classes = isCurrent ? "sidebar-link current" : "sidebar-link";
    return `
      <a href="${pageUrl(chapter.id, p.id)}" class="${classes}">
        <span class="sidebar-dot" style="background:${chapter.color}"></span>
        ${p.title}
      </a>`;
  }).join("");

  el.innerHTML = `
    <a href="index.html" class="sidebar-home">&larr; Tour Home</a>
    <nav class="sidebar-nav">${items}</nav>
  `;
}

// Bottom bar: short labels, current chapter muted instead of highlighted
function renderBottomBar(currentChapterId) {
  const el = document.getElementById("tour-bottombar");
  if (!el) return;

  const items = TOUR_CHAPTERS.map((chapter) => {
    const isCurrent = chapter.id === currentChapterId;
    if (isCurrent) {
      return `<span class="bottombar-link current">${chapter.shortTitle}</span>`;
    }
    return `<a href="${pageUrl(chapter.id, chapter.pages[0].id)}" class="bottombar-link">${chapter.shortTitle}</a>`;
  }).join('<span class="bottombar-sep">|</span>');

  el.innerHTML = `<nav class="bottombar-nav">${items}</nav>`;
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

  renderTopNav(chapterId);
  renderSidebar(chapter, pageId);
  renderBottomBar(chapterId);
  setupNextLink(chapterId, pageId);
}

document.addEventListener("DOMContentLoaded", initTourPage);
