const apiKey = "317c6d91";
let currentPage = 1;

document.getElementById("pagination").style.display = "none";

// 🔹 Search function
async function searchMovies(page = 1) {
  const query = document.getElementById("movieInput").value.trim();
  if (!query) return;

  document.getElementById("pagination").style.display = "block";

  const resultDiv = document.getElementById("resultDiv");
  resultDiv.innerHTML = ""; // clear old results

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=${page}`
  );
  const data = await res.json();

  if (data.Response === "True") {
    for (const movie of data.Search) {
      await fetchMovieDetails(movie.imdbID, resultDiv);
    }

    if (page === 1) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline-block";
    }

    if (data.Search.length < 10) {
      document.getElementById("nextBtn").style.display = "none";
    } else {
      document.getElementById("nextBtn").style.display = "inline-block";
    }
  } else {
    resultDiv.innerHTML = `<center><p>No results found.</p></center>`;
  }
}

// 🔹 Get movie details
async function fetchMovieDetails(imdbID, container) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`
  );
  const movie = await res.json();

  const movieCard = document.createElement("div");
  movieCard.classList.add("result-style");
  movieCard.setAttribute("data-aos", "fade-up");
  movieCard.innerHTML = `
    <div class="result-container">
      <div class="poster">
        <img src="${movie.Poster}" alt="Poster">
      </div>
      <div class="details">
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <a href="https://www.imdb.com/title/${movie.imdbID}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="redirect-button">View on IMDb</a>
      </div>
    </div>
  `;

  container.appendChild(movieCard);
}

async function displayLoading() {
  const loadingDiv = document.getElementById("loadingDiv");
  loadingDiv.innerHTML = `<center><p class="loader"></p></center>`;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  loadingDiv.innerHTML = "";
}

document.getElementById("nextBtn").addEventListener("click", () => {
  currentPage++;
  searchMovies(currentPage);
  displayLoading();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    searchMovies(currentPage);
    displayLoading();
  }
});

document.getElementById("movieInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
    displayLoading();
  }
});
