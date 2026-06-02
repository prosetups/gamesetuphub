/* ============================
   MOBILE NAV TOGGLE
============================ */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

/* ============================
   HOMEPAGE SEARCH REDIRECT
============================ */
const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const query = document.getElementById("searchInput").value.trim();

    if (query !== "") {
      window.location.href = `search.html?s=${encodeURIComponent(query)}`;
    }
  });
}

/* ============================
   LOAD & FLATTEN NESTED JSON
============================ */
let searchData = [];

async function loadSearchData() {
  const response = await fetch("search-data.json");
  const data = await response.json();

  // Flatten nested categories into one array
  searchData = Object.keys(data).flatMap(category =>
    data[category].map(item => ({
      ...item,
      category: category // attach category key
    }))
  );
}

/* ============================
   LIVE DROPDOWN SEARCH
============================ */
const searchInput = document.getElementById("searchInput");
const resultsBox = document.getElementById("searchDropdown");


if (searchInput && resultsBox) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query.length === 0) {
      resultsBox.innerHTML = "";
      return;
    }

    if (searchData.length === 0) {
      await loadSearchData();
    }

    const results = searchData.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      resultsBox.innerHTML = `<p class="no-results">No results found.</p>`;
      return;
    }

    resultsBox.innerHTML = results
      .slice(0, 8) // limit dropdown results
      .map(item => `<a href="${item.url}" class="search-result">${item.title}</a>`)
      .join("");
  });
}

/* ============================
   FULL SEARCH RESULTS PAGE
============================ */
function renderResults(results) {
  const container = document.getElementById("resultsContainer");
  if (!container) return;

  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = `<p class="no-results">No results found.</p>`;
    return;
  }

  // Group by category
  const groups = {};
  results.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  // Render each category
  for (const category in groups) {
    const block = document.createElement("div");
    block.classList.add("category-block");

    block.innerHTML = `
      <h3 class="category-title">${category.replace(/_/g, " ")}</h3>
      <ul class="result-list">
        ${groups[category]
          .map(
            item => `
          <li class="result-item">
            <a href="${item.url}">${item.title}</a>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    container.appendChild(block);
  }
}

/* ============================
   FILTER RESULTS
============================ */
function handleSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const query = input.value.toLowerCase().trim();

  const filtered = searchData.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.keywords.toLowerCase().includes(query)
  );

  renderResults(filtered);
}

/* ============================
   LOAD QUERY FROM URL
============================ */
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Load JSON fully
  await loadSearchData();

  // 2. Read URL query
  const params = new URLSearchParams(window.location.search);
  const q = params.get("s") || params.get("q");

  // 3. Get search input
  const input = document.getElementById("searchInput");

  if (q && input) {
    input.value = q;

    // 4. Delay ensures DOM + JSON are ready
    setTimeout(() => {
      handleSearch();
    }, 200);
  }
});



