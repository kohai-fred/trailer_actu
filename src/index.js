import "./index.scss";
import { apiTmdb } from "./assets/javascripts/api_key.js";

/*********************************** 
    Selectors
************************************/
const posterElem = document.querySelector(".news__tile");
const contentVideoElem = document.querySelector(".content__video");
const iframeElem = document.querySelector("iframe");
const contentInfoElem = document.querySelector(".content__info");
const titleElem = document.querySelector(".info__title");
const originalTitleElem = document.querySelector(".info__original-title");
const genreElem = document.querySelector(".info__genre");
const countrieElem = document.querySelector(".info__countrie");
const dateElem = document.querySelector(".info__date");
const summaryElem = document.querySelector(".info__summary");
const creditsElem = document.querySelector(".info__credits");
const linkTmdbElem = document.querySelector(".info__tmdb");
const linkImdbElem = document.querySelector(".info__imdb");
const linlYoutubeElem = document.querySelector(".info__youtube");
const spanTime = document.querySelector(".news__selection__time");
const spanWhere = document.querySelector(".news__selection__where");
const spanLang = document.querySelector(".info__selection__language");

let language = navigator.language.match(/[a-z]{2}/)[0];
let region = navigator.language.match(/[A-Z]{2}/)[0];
// let region;
// let firstResult;
// let allMoviesId = [];
let movies = [];
let loaded = 0;
/*********************************** 
    Functions
************************************/
function checkFirstTile(firstTile, movieTarget) {
  let data;

  if (movieTarget === undefined) {
    data = firstTile;
  } else {
    data = movieTarget;
  }
  return data;
}
/////////Async//////////
/* TEST */
// Test recuperartion details artiste
// Probleme de connexion TMDB 14/01/2021
// (async function test() {
//   const resp = await fetch(
//     `https://api.themoviedb.org/3/credit/90633?api_key=2046c2787afbb61a5ccb44ccc6801c13`
//   );
//   console.log(await resp.json());
// })();
/* FIN */
async function fetchCheckMovies() {
  let firstResult;
  let response;
  region
    ? (response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&region=${region}`
      ))
    : (response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}`
      ));
  firstResult = await response.json();
  // console.log(firstResult);
  return firstResult;
}

async function fetchMoviesAllId() {
  const firstResult = await fetchCheckMovies();
  let allMoviesId = [];

  if (region) {
    for (let i = 1; i <= firstResult.total_pages; i++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&page=${i}&region=${region}`
      );
      const result = await response.json();
      result.results.forEach((element) => {
        allMoviesId.push(element.id);
      });
    }
  } else {
    for (let i = 1; i <= firstResult.total_pages; i++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&page=${i}`
      );
      const result = await response.json();
      result.results.forEach((element) => {
        allMoviesId.push(element.id);
      });
    }
  }
  // console.log("Fetch ID : ", allMoviesId);
  return allMoviesId;
}

async function fetchMoviesDetails() {
  const allMoviesId = await fetchMoviesAllId();

  let temp = [];
  for (let i = 0; i < allMoviesId.length; i++) {
    const responseUs = await fetch(
      `https://api.themoviedb.org/3/movie/${allMoviesId[i]}?api_key=${apiTmdb}&append_to_response=release_dates%2Cvideos%2Ccredits`
    );
    temp.push(await responseUs.json());
  }
  // console.log("Fetch DETAILS : ", temp);
  return temp;
}

async function fetchAddVoDetails() {
  const temp = await fetchMoviesDetails();
  // console.log(movie);
  movies = [];
  for (let i = 0; i < temp.length; i++) {
    const responseVo = await fetch(
      `https://api.themoviedb.org/3/movie/${temp[i].id}?api_key=${apiTmdb}&language=${language}&append_to_response=videos`
    );
    const resultVo = await responseVo.json();
    temp[i].overview_vo = resultVo.overview ? resultVo.overview : "";
    temp[i].videos_vo = resultVo.videos;
  }
  for (let i = 0; i < temp.length; i++) {
    if (
      temp[i].videos.results.length > 0 ||
      temp[i].videos_vo.results.length > 0
    ) {
      movies.push(temp[i]);
    }
  }
  console.log("Fetch MOVIES : ", movies);
  return movies;
}

async function displayTiles(movieTarget) {
  console.log("Display TILES");
  // const movie = await fetchAddVoDetails();

  let movie;
  if (loaded === 0) {
    movie = await fetchAddVoDetails();
  } else {
    movie = movies;
  }
  // console.log("Loaded in Display : ", loaded);
  // console.log("Movie in DisplayTiles : ", movie);
  // console.log("MovieS in DisplayTiles : ", movies);
  const firstTile = movie[movie.length - 1];

  for (let i = 0; i < movie.length; i++) {
    const img = document.createElement("img");

    img.id = `${movie[i].id}`;
    // img.src = `https://image.tmdb.org/t/p/original${allPages[i].poster_path}`;
    img.src = movie[i].poster_path
      ? `https://image.tmdb.org/t/p/original${movie[i].poster_path}`
      : // `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${allPages[i].poster_path}`
        "./src/assets/images/error-404-no-wallpaper-found.png";
    img.alt =
      `Affiche du film : ` + movie[i].original_title != movie[i].title
        ? `${movie[i].original_title} - ${movie[i].title} `
        : ` ${movie[i].original_title}`;
    img.title =
      movie[i].original_title != movie[i].title
        ? `${movie[i].original_title} - ${movie[i].title} `
        : ` ${movie[i].original_title}`;
    posterElem.insertAdjacentElement("afterbegin", img);
  }

  loaded++;
  displayVideo(firstTile);
}

async function displayVideo(firstTile, movieTarget) {
  let movie = await checkFirstTile(firstTile, movieTarget);
  let videosVO = [];
  let videosUS = [];

  if (movie.videos_vo.results.length > 0) {
    videosVO = movie.videos_vo.results;
  }
  if (movie.videos.results.length > 0) {
    videosUS = movie.videos.results;
  }

  iframeElem.src =
    `https://www.youtube.com/embed/` +
    (videosVO.length > 0
      ? `${videosVO[videosVO.length - 1].key}`
      : `${videosUS[videosUS.length - 1].key}`);

  if (movie.backdrop_path) {
    contentVideoElem.style.background = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path}) 0% 0% / cover`;
  } else {
    contentVideoElem.style.background = "black";
  }
  displayInfo(firstTile, movieTarget);
}

async function displayInfo(firstTile, movieTarget) {
  let movie = await checkFirstTile(firstTile, movieTarget);
  let genres = "";

  // console.log("INFO : ", movie);
  if (movie.genres.length > 0) {
    for (let i = 0; i < movie.genres.length; i++) {
      genres += movie.genres[i].name + " ";
    }
  } else {
    genres = "genre non communiqué...";
  }

  titleElem.innerHTML = `${movie.title}`;
  originalTitleElem.innerHTML = `<span class="info__span">Titre original :</span> ${movie.original_title}`;
  countrieElem.innerHTML =
    `<span class="info__span">Pays : </span>` +
    (movie.production_countries[0]
      ? `${movie.production_countries[0].name}`
      : `non communiqué`);
  genreElem.innerHTML = `<span class="info__span">Genre(s) : </span>${genres}`;
  dateElem.innerHTML = `<span class="info__span">Prévue le : </span>${movie.release_date}`;
  summaryElem.innerHTML =
    '<span class="info__span">Synopsis : </span></br>' +
    (movie.overview_vo
      ? `${movie.overview_vo}`
      : `<i>Aucun synopsis n'est encore proposé en français :( </i></br> <u>Version anglaise :</u> ${movie.overview}`);
  linkTmdbElem.href = `http://themoviedb.org/movie/${movie.id}`;
  linkImdbElem.href = `https://www.imdb.com/title/${movie.imdb_id}`;
  linlYoutubeElem.href = `https://www.youtube.com/results?search_query=${movie.title}`;
}
displayTiles();

// Reloading of all background processes for all countries because loading all the films is often very long!!!
const rechargeAllMovies = () => {
  region = null;
  fetchAddVoDetails();
};
rechargeAllMovies();

/*********************************** 
    AddEventLiseteners
************************************/
posterElem.addEventListener("click", (event) => {
  const target = event.target;
  console.log(target);
  // console.log("Movie : ", movies);
  console.log("Display MOVIES", movies);

  let movieTarget;
  (function getMovieObj() {
    for (let i = 0; i < movies.length; i++) {
      // console.log("movie : ", movies[i].id, " target : ", target.id);
      // console.log(movies[i].id.toString() === target.id);
      if (movies[i].id.toString() === target.id) {
        movieTarget = JSON.parse(JSON.stringify(movies[i]));
      }
    }
  })();
  console.log("MovieOBJ : ", movieTarget);
  // console.log("Loaded : ", loaded);
  displayVideo(movieTarget);
  displayInfo(movieTarget);
  // createModal();
});
// spanTime.addEventListener("click", displayTiles);
