/**
 * Arya Krishna - Personal Portfolio
 * Tennis-themed interactions & GitHub projects
 */

const GITHUB_USER = 'AryaKrishnaproffessional';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`;

// Fallback projects if API fails (from your GitHub)
const FALLBACK_PROJECTS = [
  { name: 'Job-Market-Analytics-and-Forecasting-Web-Platform-', description: 'Job market analytics and forecasting web platform', language: 'JavaScript', html_url: `https://github.com/${GITHUB_USER}/Job-Market-Analytics-and-Forecasting-Web-Platform-` },
  { name: 'AI_chatbot-using-cursor-', description: 'Creating an AI chatbot using Cursor', language: 'JavaScript', html_url: `https://github.com/${GITHUB_USER}/AI_chatbot-using-cursor-` },
  { name: 'RNA-Sequence-Project', description: 'RNA sequence analysis and bioinformatics', language: 'Jupyter Notebook', html_url: `https://github.com/${GITHUB_USER}/RNA-Sequence-Project` },
  { name: 'RNA-modelling-', description: 'RNA structure and modelling', language: 'Jupyter Notebook', html_url: `https://github.com/${GITHUB_USER}/RNA-modelling-` },
  { name: 'Uno-Inspired-Card-Game-', description: 'Uno-inspired card game implementation', language: 'JavaScript', html_url: `https://github.com/${GITHUB_USER}/Uno-Inspired-Card-Game-` },
  { name: 'Projects-DeepLearning', description: 'Deep learning projects and experiments', language: 'Jupyter Notebook', html_url: `https://github.com/${GITHUB_USER}/Projects-DeepLearning` },
  { name: 'Facial-Recognition-project', description: 'Facial recognition project', language: 'Jupyter Notebook', html_url: `https://github.com/${GITHUB_USER}/Facial-Recognition-project` },
  { name: 'Catheter-Placement', description: 'Catheter placement analysis', language: 'Jupyter Notebook', html_url: `https://github.com/${GITHUB_USER}/Catheter-Placement` },
  { name: 'Virtual-Internships-Monash', description: 'Virtual internships at Monash', language: 'Jupyter Notebook', html_url: `https://github.com/${GITHUB_USER}/Virtual-Internships-Monash` },
  { name: 'Rossmann-sales', description: 'Rossmann sales forecasting', language: 'Jupyter Notebook', html_url: `https://github.com/${GITHUB_USER}/Rossmann-sales` },
  { name: 'Database-Management', description: 'Database management systems', language: 'JavaScript', html_url: `https://github.com/${GITHUB_USER}/Database-Management` },
];

function formatProjectName(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+$/, '')
    .replace(/^\s+/, '');
}

function renderProjects(repos) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = repos.map((repo) => {
    const name = repo.name || '';
    const desc = repo.description || 'No description';
    const lang = repo.language || 'Other';
    const url = repo.html_url || `https://github.com/${GITHUB_USER}/${name}`;
    const title = formatProjectName(name);

    return `
      <a href="${url}" target="_blank" rel="noopener" class="project-card">
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="project-meta">
          <span class="project-lang">${lang}</span>
        </div>
      </a>
    `;
  }).join('');
}

async function fetchProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const res = await fetch(GITHUB_API);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const repos = Array.isArray(data) ? data : [];
    renderProjects(repos.length ? repos : FALLBACK_PROJECTS);
  } catch {
    renderProjects(FALLBACK_PROJECTS);
  }
}

// Theme toggle (tennis court day / night match)
function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'alternate') {
    document.body.classList.add('theme-alternate');
    btn.innerHTML = '☀️';
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('theme-alternate');
    const isAlt = document.body.classList.contains('theme-alternate');
    btn.innerHTML = isAlt ? '☀️' : '🌙';
    localStorage.setItem('portfolio-theme', isAlt ? 'alternate' : '');
  });
}

// Nav mobile toggle
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach((a) => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Footer year
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initNav();
  initThemeToggle();
  fetchProjects();
});
