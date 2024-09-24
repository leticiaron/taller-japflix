// Variables
let MOVIES_URL = "https://japceibal.github.io/japflix_api/movies-data.json";
let MOVIES_LIST = document.getElementById("lista");
let SEARCH_INPUT = document.getElementById("inputBuscar");
let SEARCH_FORM = document.getElementById("search-form");
let OFFCANVAS_BODY = document.getElementById("canvas-body");
let DROPDOWN_MENU = document.getElementsByClassName("dropdown-menu")[0];
let FETCHED_MOVIES;

//Función para convertir calificación a escala de estrellas
function stars(score) {
  let scoreStars = "";
  let score2 = Math.round(score / 2);
  for (let i = 1; i <= 5; i++) {
    if (i <= score2) {
      scoreStars += '<span class="fa fa-star checked"></span>';
    } else {
      scoreStars += '<span class="fa fa-star "></span>';
    }
  }
  return scoreStars;
}

// Función para mostrar películas
function showMovies(moviesArray) {
  MOVIES_LIST.innerHTML = "";
  for (let i = 0; i < moviesArray.length; i++) {
    let movie = moviesArray[i];

    let item = document.createElement("div");
    item.className = "search-result list-group-item list-group-item-action";
    item.setAttribute("data-bs-toggle", "offcanvas");
    item.setAttribute("data-bs-target", "#offcanvasTop");
    item.id = `${movie.id}`;

    let container = document.createElement("div");
    container.className = "d-flex w-100 justify-content-between";

    let subContainer = document.createElement("div");
    subContainer.className = "mb-1";

    let title = document.createElement("h5");
    title.innerHTML = `${movie.title}`;

    let tagLine = document.createElement("p");
    tagLine.innerHTML = `${movie.tagline}`;

    let vote_averege = document.createElement("p");
    vote_averege.innerHTML = `${stars(movie.vote_average)}`;

    item.addEventListener("click", () => {
      // Info en el dropdown
      OFFCANVAS_BODY.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
        `;
      for (const genre of movie.genres) {
        OFFCANVAS_BODY.innerHTML += `
            <p>${genre.name}</p>
          `;
      }

      // Botón del dropdown
      let releaseDateYear = movie.release_date.slice(0, 4);
      DROPDOWN_MENU.innerHTML = `
            <li class="dropdown-item"><strong>Year:</strong> ${releaseDateYear}</li>
            <li class="dropdown-item"><strong>Runtime:</strong> ${movie.runtime} mins</li>
            <li class="dropdown-item"><strong>Budget:</strong> $${movie.budget}</li>
            <li class="dropdown-item"><strong>Revenue:</strong> $${movie.revenue}</li>
        `;
    });

    item.appendChild(container);
    container.appendChild(subContainer);
    subContainer.appendChild(title);
    subContainer.appendChild(tagLine);
    subContainer.appendChild(vote_averege);

    MOVIES_LIST.appendChild(item);
  }
}

//Función para buscar películas
function filterMovies() {
  let result = [];
  let searchInput = SEARCH_INPUT.value.toLowerCase();
  for (const movie of FETCHED_MOVIES) {
    let movieTitle = movie.title.toLowerCase();
    let movieTagline = movie.tagline.toLowerCase();
    let movieOverview = movie.overview.toLowerCase();
    let movieGenres = [];
    for (const genre of movie.genres) {
      movieGenres.push(genre.name);
    }

    if (
      movieTitle.includes(searchInput) ||
      movieTagline.includes(searchInput) ||
      movieOverview.includes(searchInput) ||
      movieGenres.includes(searchInput)
    ) {
      result.push(movie);
    }
  }

  return result;
}

// Evento submit
SEARCH_FORM.addEventListener("submit", (event) => {
  event.preventDefault();
  showMovies(filterMovies(FETCHED_MOVIES));
});

// Fetch
document.addEventListener("DOMContentLoaded", () => {
  fetch(MOVIES_URL)
    .then((response) => response.json())
    .then((moviesList) => {
      FETCHED_MOVIES = moviesList;
    });
});
