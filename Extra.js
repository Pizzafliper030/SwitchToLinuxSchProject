console.log("%cHey there, curious explorer! 🐧", "color: #ffffff; font-size: 18px; font-weight: bold;");
console.log("This site is proudly made by a student who loves efficiency, control, and penguins.");
console.log(`
   .--.
  |o_o |
  |:_/ |
 //   \\ \\
(|     | )
/'\\_   _/\\'
\\___)=(___/
`);
console.log("%cWelcome to the Terminal Underground! 🐧", "color: #d0d0d0; font-size: 14px;");

let devtoolsOpen = false;
const devtoolsCheckInterval = setInterval(() => {
  const widthThreshold = window.outerWidth - window.innerWidth > 100;
  const heightThreshold = window.outerHeight - window.innerHeight > 100;
  if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
    console.log("%cSpotted you with DevTools open! 👀", "color: #ffffff; font-size: 16px; font-weight: bold;");
    devtoolsOpen = true;
  }
}, 500);

let mouseX = 0, mouseY = 0;
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 40;
const radius = 280;
const baseOpacity = 0.08;
const maxOpacity = 0.85;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  const startCol = Math.floor(scrollX / gridSize);
  const startRow = Math.floor(scrollY / gridSize);
  const endCol = Math.ceil((scrollX + canvas.width) / gridSize);
  const endRow = Math.ceil((scrollY + canvas.height) / gridSize);

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const worldX = col * gridSize;
      const worldY = row * gridSize;
      const screenX = worldX - scrollX;
      const screenY = worldY - scrollY;

      const cursorWorldX = mouseX + scrollX;
      const cursorWorldY = mouseY + scrollY;

      const distance = Math.sqrt(Math.pow(worldX - cursorWorldX, 2) + Math.pow(worldY - cursorWorldY, 2));
      const intensity = Math.max(0, 1 - distance / radius);
      const opacity = baseOpacity + (intensity * (maxOpacity - baseOpacity));

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(screenX, screenY, gridSize, gridSize);
    }
  }
}

function animateGrid() {
  drawGrid();
  requestAnimationFrame(animateGrid);
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function fetchDeploymentTime() {
  const deployTimeElement = document.getElementById('deploy-time');
  if (!deployTimeElement) return;
  fetch('https://api.github.com/repos/Drag0n3r3ath030/SwitchToLinuxSchProject/actions/workflows/pages-build-deployment.yml/runs?per_page=1&status=success', {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      const timestamp = data.workflow_runs?.[0]?.updated_at ? new Date(data.workflow_runs[0].updated_at) : null;
      deployTimeElement.textContent = timestamp ? `🕒 Last deployed: ${timestamp.toLocaleString()}` : '🕒 Last deployed: not available';
    })
    .catch(() => { deployTimeElement.textContent = '🕒 Last deployed: unavailable'; });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function observeElements() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

  document.querySelectorAll('.section, .reason-card, .cta-section').forEach(el => {
    el.style.cssText = 'opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease;';
    observer.observe(el);
  });
}

function addScrollAnimations() {
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.section').forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const distance = Math.abs(rect.top - window.innerHeight / 2);
        const intensity = Math.max(0, 1 - distance / (window.innerHeight / 2));
        section.style.opacity = Math.min(1, 0.5 + intensity * 0.5);
      }
    });
  });
}

function addParallaxEffect() {
  window.addEventListener('scroll', () => {
    const bgVideo = document.querySelector('.bg-video');
    if (bgVideo) bgVideo.style.transform = `translateY(${window.scrollY * 0.5}px)`;
  });
}

window.addEventListener('resize', resizeCanvas);

document.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  animateGrid();
  fetchDeploymentTime();
  initSmoothScroll();
  observeElements();
  addScrollAnimations();
  addParallaxEffect();
});

window.addEventListener('load', () => { document.documentElement.style.scrollBehavior = 'smooth'; });
window.addEventListener('beforeunload', () => { clearInterval(devtoolsCheckInterval); });
