document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "f8835ecefe1f5f662b116d782a9f28da";
  const form = document.querySelector("#searchForm");
  const resultsContainer = document.querySelector("#results");
  const paginationContainer = document.querySelector("#pagination");
  let currentPage = 1;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document.querySelector("#searchInput").value;
    fetchMovies(query, currentPage);
  });

  function fetchMovies(query, page) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => displayMovies(data))
      .catch((error) => console.error("Erreur:", error));
  }

  function displayMovies(data) {
    resultsContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    if (data.results && data.results.length > 0) {
      data.results.forEach((movie) => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        const title = document.createElement("h2");
        title.textContent = movie.title;

        const description = document.createElement("p");
        description.textContent = movie.overview;

        const image = document.createElement("img");
        image.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        image.alt = movie.title;

        movieElement.appendChild(title);
        movieElement.appendChild(description);
        movieElement.appendChild(image);

        resultsContainer.appendChild(movieElement);
      });
    } else {
      resultsContainer.textContent = "Aucun résultat trouvé";
    }

    const totalPages = data.total_pages;
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("a");
      pageLink.href = "#";
      pageLink.textContent = i;
      pageLink.addEventListener("click", function () {
        currentPage = i;
        fetchMovies(document.querySelector("#searchInput").value, i);
      });
      paginationContainer.appendChild(pageLink);
    }
  }
});
