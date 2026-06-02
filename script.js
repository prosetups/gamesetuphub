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

// SEARCH RESULTS USING JSON
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



