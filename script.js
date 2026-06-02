// MOBILE NAV TOGGLE
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// SEARCH BAR REDIRECT
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const query = document.getElementById('searchInput').value.trim();

  if (query !== "") {
    window.location.href = `search.html?s=${encodeURIComponent(query)}`;
  }
});

// SEARCH RESULTS PAGE (search.html)
if (window.location.pathname.includes("search.html")) {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("s").toLowerCase();

  fetch("builds.json")
    .then(res => res.json())
    .then(data => {
      const results = data.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query)
      );

      displayResults(results, query);
    });
}

function displayResults(results, query) {
  const container = document.getElementById("results");

  if (results.length === 0) {
    container.innerHTML = `<p>No results found for <strong>${query}</strong>.</p>`;
    return;
  }

  container.innerHTML = results
    .map(item => `
      <div class="result-item">
        <a href="${item.url}">${item.title}</a>
      </div>
    `)
    .join("");
}

// LIVE SEARCH DROPDOWN (Option B)
const searchInput = document.getElementById("searchInput");
const resultsBox = document.getElementById("searchResults");

// SAFETY CHECK — prevents errors on pages without the dropdown
if (searchInput && resultsBox) {

  async function loadSearchData() {
    const response = await fetch("search-data.json");
    return await response.json();
  }

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.toLowerCase().trim();
    const data = await loadSearchData();

    if (query.length === 0) {
      resultsBox.innerHTML = "";
      return;
    }

    const results = data.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query)
    );

    resultsBox.innerHTML = results
      .map(item => `<a href="${item.url}" class="search-result">${item.title}</a>`)
      .join("");

    if (results.length === 0) {
      resultsBox.innerHTML = `<p class="no-results">No results found.</p>`;
    }
  });

  let searchData = [];

async function loadSearchData() {
  const response = await fetch("search-data.json");
  searchData = await response.json();
}

function groupResults(results) {
  const groups = {};

  results.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  });

  return groups;
}

function renderResults(results) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = `<p class="no-results">No results found.</p>`;
    return;
  }

  const grouped = groupResults(results);

  for (const category in grouped) {
    const block = document.createElement("div");
    block.classList.add("category-block");

    block.innerHTML = `
      <h3 class="category-title">${category}</h3>
      <ul class="result-list">
        ${grouped[category]
          .map(
            item => `
          <li class="result-item">
            <a href="${item.url}">${item.title}</a>
            <span class="result-category">(${item.category})</span>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    container.appendChild(block);
  }
}

function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const filtered = searchData.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.keywords.toLowerCase().includes(query)
  );

  renderResults(filtered);
}

document.getElementById("searchInput").addEventListener("input", handleSearch);

loadSearchData();

/* SEARCH PAGE — READ URL QUERY ON LOAD */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");

  const input = document.getElementById("searchInput");

  if (q && input) {
    input.value = q;
    handleSearch();
  }
});

}
