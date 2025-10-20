const movieList = document.querySelector("main");
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let moviesData = [];

// Utility: save watchlist to localStorage
function saveWatchlist() {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// Add movie to watchlist
function addToWatchlist(movie) {
  watchlist.push(movie);
  saveWatchlist();
  console.log(`${movie.title} added to watchlist!`);
}

// Remove movie from watchlist
function removeFromWatchlist(title) {
  watchlist = watchlist.filter((m) => m.title !== title);
  saveWatchlist();
  console.log(`${title} removed from watchlist!`);
}

// Generate movie cards for search page
function renderSearchCards(movies, dataIndex) {
  if (!movieList) return;

  if (!movies || movies.length === 0) {
    movieList.innerHTML = "<p>No results found.</p>";
    movieList.classList.add("has-background");
    return;
  } else {
    movieList.classList.remove("has-background");
  }

  let html = "";

  const limitedData = movies.slice(dataIndex, dataIndex + 3);

  limitedData.forEach((movie) => {
    const inWatchlist = watchlist.find((m) => m.title === movie.Title);
    console.log("Movie Poster:", movie.Poster, "Title:", movie.Title); // <-- log it

    html += `
      <div class="movie-card">
        <h2>${movie.Title}</h2>
        <p>${movie.Year}</p>
        <img src="${
          movie.Poster && movie.Poster.trim() !== "" && movie.Poster !== "N/A"
            ? movie.Poster
            : "../images/main-background.png"
        }" alt="${movie.Title}"
          onerror="this.src='../images/main-background.png'"
>
        <button class="watchlist-btn"
          data-title="${movie.Title}"
          data-year="${movie.Year}"
          data-poster="${movie.Poster}">
          ${inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      </div>
    `;
  });
  html += `
  <div class="btn-group">
  <button class="control-btn" id="prev-btn"> Prev </button>
  <button class="control-btn" id="next-btn"> Next </button>
  </div>
`;
  movieList.innerHTML = html;
  // --- Disable Prev/Next buttons as needed ---
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (prevBtn) prevBtn.disabled = dataIndex === 0;
  if (nextBtn) nextBtn.disabled = dataIndex + 3 >= movies.length;
}

// Generate movie cards for watchlist page
function generateWatchlistCards() {
  if (!movieList) return;

  if (!watchlist.length) {
    movieList.innerHTML = "<p>Your watchlist is empty.</p>";
    movieList.classList.add("has-background");
    return;
  }
  movieList.classList.remove("has-background");

  let html = "";
  watchlist.forEach((movie) => {
    html += `
      <div class="movie-card">
        <h2>${movie.title}</h2>
        <p>${movie.year}</p>
        <img src="${
          movie.poster && movie.poster.trim() !== "" && movie.poster !== "N/A"
            ? movie.poster
            : "../images/main-background.png"
        }" alt="${movie.title}"
          onerror="this.src='../images/main-background.png'"
>
        <button class="watchlist-btn"
          data-title="${movie.title}"
          data-year="${movie.year}"
          data-poster="${movie.poster}">
          Remove from Watchlist
        </button>
      </div>
    `;
  });

  movieList.innerHTML = html;
}

// Fetch movies from OMDb
async function getMovie(title) {
  const movieTitle = title.trim().replace(/ /g, "+");
  const baseurl = "http://www.omdbapi.com/?apikey=fdd8447e";
  const response = await fetch(`${baseurl}&s=${movieTitle}&type=movie`);
  const data = await response.json();
  moviesData = data.Search;
  return data.Search;
}

// Search page logic
if (document.body.classList.contains("index-page")) {
  const searchBox = document.getElementById("search-box");
  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", async () => {
    const data = await getMovie(searchBox.value);
    currentPage = 0;
    renderSearchCards(data, 0);
  });
}

// Watchlist page logic
if (document.body.classList.contains("watchlist-page")) {
  generateWatchlistCards();
}

// Global event delegation for all watchlist buttons
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("watchlist-btn")) return;

  const button = e.target;
  const movie = {
    title: button.dataset.title,
    year: button.dataset.year,
    poster: button.dataset.poster,
  };

  const inWatchlist = watchlist.find((m) => m.title === movie.title);
  if (inWatchlist) {
    removeFromWatchlist(movie.title);
  } else {
    addToWatchlist(movie);
  }

  // Update UI
  if (document.body.classList.contains("watchlist-page")) {
    generateWatchlistCards();
  } else {
    button.textContent = inWatchlist
      ? "Add to Watchlist"
      : "Remove from Watchlist";
  }
});

let currentPage = 0;
let paginationNum = 3;
//Event delagation for next and prev buttons.
document.addEventListener("click", (e) => {
  console.log(moviesData);
  console.log(`length${moviesData.length}`);
  if (e.target.id === "prev-btn") {
    //do stuff for prev button
    if (currentPage > 0) {
      currentPage -= paginationNum;
      renderSearchCards(moviesData, currentPage);
    }
  }
  if (e.target.id === "next-btn") {
    //do stuff for next,
    if (currentPage < moviesData.length - 1) {
      currentPage += paginationNum;
      renderSearchCards(moviesData, currentPage);
      console.log(currentPage);
    }
  }
});
