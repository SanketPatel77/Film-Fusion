const API_KEY = "ece985488c982715535011849742081f";
const imagePath = "https://image.tmdb.org/t/p/w1280";
const input = document.querySelector(".search input");
const button = document.querySelector(".search button");
const mainGridTitle = document.querySelector(".favourite h1");
const mainGrid = document.querySelector(".favourite .movies-grid");
const trendingGrid = document.querySelector(".trending .movies-grid");
const popupContainer = document.querySelector(".popup-container");

window.addEventListener("load", () => {
  renderFavourites();
  addTrendingMoviesToDOM();
});

async function getMovieBySearch(search_term) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`
  );
  let respData = await response.json();
  return respData.results;
}

async function addSearchMoviesToDOM() {
  const search_term = input.value;
  const data = await getMovieBySearch(search_term);
  mainGridTitle.innerHTML = "Search Results...";

  let resultArr = data.map((m) => {
    return `<div class="card" data-id="${m.id}">
    <!-- card image  -->
    <div class="img">
        <img src=${imagePath + m.poster_path} alt="">
    </div>
    <!-- card info  -->
    <div class="info">
        <h2>${m.title}</h2>
        <div class="single-info">
            <span>Rating :</span>
            <span>${m.vote_average}</span>
        </div>
        <div class="single-info">
            <span>Release Date :</span>
            <span>${m.release_date}</span>
        </div>
    </div>
</div>`;
  });
  mainGrid.innerHTML = resultArr.join(" ");

  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}

button.addEventListener("click", addSearchMoviesToDOM);

function addClickEffectToCards(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      showPopUp(card);
    });
  });
}

async function getMovieById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = response.json();
  return data;
}

async function getTrailerById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results[0].key;
}



async function showPopUp(card) {
  popupContainer.classList.add("show-popup");
  const movieId = card.getAttribute("data-id");
  const movie = await getMovieById(movieId);
  const key = await getTrailerById(movieId);

  popupContainer.style.background = ` linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),
  url(${imagePath + movie.poster_path})`;

  popupContainer.innerHTML = `
  <span class="x-icon">&#10006;</span> 
  <div class="content">
            
            <div class="left">
                <div class="poster-img">
                    <img src="${imagePath + movie.poster_path}" alt="" />
                </div>
                <div class="single-info">
                    <span>Add to favourites :</span>
                    <span class="heart-icon">&#9829;</span>
                </div>
            </div>
          
            <div class="right">
                <h1>${movie.title}</h1>
                <h3>${movie.tagline}</h3>
                
    <div class="single-info-container">
        <div class="single-info">
            <span>Languages :</span>
            <span>${movie.spoken_languages[0].name}</span>
        </div>
        <div class="single-info">
            <span>Length :</span>
            <span>${movie.runtime} minutes</span>
        </div>
        <div class="single-info">
            <span>Rating :</span>
            <span>${movie.vote_average}/10</span>
        </div>
        <div class="single-info">
            <span>Budget :</span>
            <span>${movie.budget}</span>
        </div>
        <div class="single-info">
            <span>Release Date</span>
            <span>${movie.release_date}</span>
        </div>
    </div>
    
    <div class="genres">
        <h2>Genres</h2>
        <ul>
            ${movie.genres
              .map((e) => {
                return `<li>${e.name}</li>`;
              })
              .join("")}
        </ul>
    </div>
   
    <div class="overview">
        <h2>Overview</h2>
        <p>${movie.overview}
        </p>
    </div>
    

    <div class="trailer">
        <h2>Trailer</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}?si=SwnsQjPpxw6knwRc"
            title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"> --></iframe>`;

  const x_icon = document.querySelector(".x-icon");
  x_icon.addEventListener("click", () => {
    popupContainer.classList.remove("show-popup");
  });

  const heart_icon = document.querySelector(".heart-icon");
  let favorites = JSON.parse(window.localStorage.getItem("favorites")) || {};
  if (favorites[movieId]) {
    heart_icon.classList.add("change-color");
  }

  heart_icon.addEventListener("click", () => {
    if (heart_icon.classList.contains("change-color")) {
      heart_icon.classList.remove("change-color");
      removeFromFavourite(movieId);
    } else {
      heart_icon.classList.add("change-color");
      addToFavourite(movieId, movie);
    }
  });
}

async function getTrendingMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
  );

  let data = await response.json();

  return data.results;
}

async function addTrendingMoviesToDOM() {
  const data = await getTrendingMovies();

  const displayMovies = data.slice(0, 10);

  let resultArr = displayMovies.map((m) => {
    return `<div class="card" data-id="${m.id}">
    <!-- card image  -->
    <div class="img">
        <img src=${imagePath + m.poster_path} alt="">
    </div>
    <!-- card info  -->
    <div class="info">
        <h2>${m.title}</h2>
        <div class="single-info">
            <span>Rating :</span>
            <span>${m.vote_average}</span>
        </div>
        <div class="single-info">
            <span>Release Date :</span>
            <span>${m.release_date}</span>
        </div>
    </div>
</div>`;
  });
  trendingGrid.innerHTML = resultArr.join(" ");
  // console.log(resultArr);

  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}

function removeFromFavourite(movieId) {
  let favorites = JSON.parse(window.localStorage.getItem("favorites")) || {};
  delete favorites[movieId];
  window.localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavourites();
}

function addToFavourite(movieId, movie) {
  let favorites = JSON.parse(window.localStorage.getItem("favorites")) || {};
  favorites[movieId] = movie;
  window.localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavourites();
}

function renderFavourites() {
  let favorites = JSON.parse(window.localStorage.getItem("favorites")) || {};
  let keys = Object.keys(favorites);

  mainGrid.innerHTML = keys
    .map((key) => {
      let movie = favorites[key];
      return `<div class="card" data-id="${movie.id}">
      <!-- card image  -->
      <div class="img">
          <img src=${imagePath + movie.poster_path} alt="">
      </div>
      <!-- card info  -->
      <div class="info">
          <h2>${movie.title}</h2>
          <div class="single-info">
              <span>Rating :</span>
              <span>${movie.vote_average}</span>
          </div>
          <div class="single-info">
              <span>Release Date :</span>
              <span>${movie.release_date}</span>
          </div>
      </div>
    </div>`;
    })
    .join(" ");

  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}
