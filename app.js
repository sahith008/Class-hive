// SAMPLE DATA — real resources.json comes later
const resources = [
  { title: "DBMS Unit 1 Notes", subject: "DBMS", semester: 4, category: "Notes", file: "#" },
  { title: "DBMS Unit 2 Notes", subject: "DBMS", semester: 4, category: "Notes", file: "#" },
  { title: "DBMS 2023 Question Paper", subject: "DBMS", semester: 4, category: "Papers", file: "#" },
  { title: "OS Full Notes", subject: "Operating Systems", semester: 4, category: "Notes", file: "#" },
  { title: "OS Unit 3 Notes", subject: "Operating Systems", semester: 4, category: "Notes", file: "#" },
  { title: "Data Structures Complete Notes", subject: "Data Structures", semester: 3, category: "Notes", file: "#" },
  { title: "DS Lab Manual", subject: "Data Structures", semester: 3, category: "Lab Manual", file: "#" },
  { title: "Maths-3 Reference Book", subject: "Mathematics III", semester: 3, category: "Books", file: "#" },
  { title: "Digital Logic Notes", subject: "Digital Logic", semester: 3, category: "Notes", file: "#" },
  { title: "Computer Networks Notes", subject: "Computer Networks", semester: 5, category: "Notes", file: "#" }
];

let currentSemester = null;
let currentFilter = "All";

// ---------- HOME ----------
function renderSemesters() {
  document.getElementById("semesterGrid").innerHTML =
    [1,2,3,4,5,6,7,8].map(s => `
      <div class="semester-card" onclick="openSemester(${s})">
        <span class="num">${s}</span>
        <span class="label">Semester</span>
      </div>
    `).join("");
}

function renderRecent() {
  const recent = resources.slice(-4).reverse();
  document.getElementById("recentList").innerHTML =
    recent.map(r => resourceCardHTML(r)).join("");
}

function resourceCardHTML(r) {
  return `
    <div class="resource-card">
      <div class="resource-info">
        <div class="resource-title">📄 ${r.title}</div>
        <div class="resource-meta">Sem ${r.semester} • ${r.subject} • ${r.category}</div>
      </div>
      <a class="download-btn" href="${r.file}" target="_blank">Download</a>
    </div>`;
}

// ---------- SEMESTER PAGE ----------
function openSemester(sem) {
  currentSemester = sem;
  currentFilter = "All";
  document.getElementById("homeView").style.display = "none";
  document.getElementById("searchView").style.display = "none";
  document.getElementById("semesterView").style.display = "block";
  document.getElementById("semesterTitle").textContent = "Semester " + sem;
  renderFilterTabs();
  renderSubjects();
  window.scrollTo(0, 0);
}

function renderFilterTabs() {
  const cats = ["All", "Notes", "Papers", "Books", "Lab Manual"];
  document.getElementById("filterTabs").innerHTML = cats.map(c => `
    <button class="filter-tab ${c === currentFilter ? "active" : ""}"
            onclick="setFilter('${c}')">${c}</button>
  `).join("");
}

function setFilter(cat) {
  currentFilter = cat;
  renderFilterTabs();
  renderSubjects();
}

function renderSubjects() {
  const container = document.getElementById("subjectGroups");
  let filtered = resources.filter(r => r.semester === currentSemester);
  if (currentFilter !== "All") {
    filtered = filtered.filter(r => r.category === currentFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty">No resources here yet.</div>`;
    return;
  }

  const groups = {};
  filtered.forEach(r => {
    if (!groups[r.subject]) groups[r.subject] = [];
    groups[r.subject].push(r);
  });

  container.innerHTML = Object.keys(groups).map(subject => `
    <div class="subject-group">
      <h3>${subject}</h3>
      <div class="resource-list">
        ${groups[subject].map(r => resourceCardHTML(r)).join("")}
      </div>
    </div>
  `).join("");
}

// ---------- SEARCH ----------
function handleSearchFromHero() {
  const q = document.getElementById("heroSearch").value.trim();
  if (!q) return;
  runSearch(q);
}

function runSearch(q) {
  q = q.toLowerCase();
  document.getElementById("homeView").style.display = "none";
  document.getElementById("semesterView").style.display = "none";
  document.getElementById("searchView").style.display = "block";

  const results = resources.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.subject.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q)
  );

  document.getElementById("searchTitle").textContent =
    `Search: "${q}" (${results.length} found)`;

  document.getElementById("searchResults").innerHTML = results.length
    ? results.map(r => resourceCardHTML(r)).join("")
    : `<div class="empty">No results found.</div>`;
}

// ---------- NAV ----------
function goHome() {
  document.getElementById("homeView").style.display = "block";
  document.getElementById("semesterView").style.display = "none";
  document.getElementById("searchView").style.display = "none";
  document.getElementById("heroSearch").value = "";
  window.scrollTo(0, 0);
}

// ---------- INIT ----------
renderSemesters();
renderRecent();