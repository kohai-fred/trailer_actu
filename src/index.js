import "./index.scss";
import { apiTmdb } from "./assets/javascripts/api_key.js";
import { createModal } from "./assets/javascripts/modal.js";

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

let language;
let region;
let movies = [];
/*********************************** 
    Functions
************************************/
function setLang(lang) {
  let data;
  if (lang === undefined) {
    data = navigator.language.match(/[a-z]{2}/)[0];
  } else {
    data = lang;
  }
  //   console.log("Set LANG : ", lang);
  //   console.log("Set lang DATA : ", data);
  return data;
}
function setRegion(region) {
  let data;
  if (region === undefined) {
    data = navigator.language.match(/[A-Z]{2}/)[0];
  } else {
    data = region;
  }
  //   console.log("DATA region = ", data);
  return data;
}

function checkLanguage(language) {
  let lang;
  if (language === undefined) {
    lang = setLang();
  } else {
    lang = language;
  }
  return lang;
}
function checkRegion(region) {
  let reg;
  if (region === undefined) {
    reg = setRegion();
  } else {
    reg = region;
  }
  //   console.log("Check reg : ", reg);
  return reg;
}
function checkFirstTile(firstTile, movieTarget) {
  let data;

  if (movieTarget === undefined) {
    data = firstTile;
  } else {
    data = movieTarget;
  }
  return data;
}
const createSpinner = () => {
  const spinner = document.createElement("div");
  spinner.classList.add("loader");
  posterElem.append(spinner);
};

////// Functions async /////
async function allCountriesConfig() {
  const response = await fetch(`
    https://api.themoviedb.org/3/configuration/primary_translations?api_key=${apiTmdb}`);
  const result = await response.json();
  console.log(result);

  return result;
}
allCountriesConfig();
async function waitingLoad() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}`
  );
  const result = await response.json();
  console.log(result);
  if (result.results[0].backdrop_path) {
    contentVideoElem.style.background = `url(https://image.tmdb.org/t/p/original${result.results[0].backdrop_path}) 0% 0% / cover`;
  } else {
    contentVideoElem.style.background = "black";
  }

  createSpinner();
}
waitingLoad();

async function getAllUpcomingMoviesId(language, region) {
  let lang = checkLanguage();
  //   let reg = checkRegion();
  let reg = "US";
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}`
  );
  const result = await response.json();
  // console.log(result);
  const movieUpcomingId = await getMovieUpcomingId();

  async function getMovieUpcomingId() {
    let data = [];
    for (let i = 1; i < result.total_pages; i++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&page=${i}`
      );
      const page = await response.json();
      for (let j = 0; j < page.results.length; j++) {
        data.push(page.results[j].id);
      }
    }
    // console.log(data);

    return data;
  }
  return movieUpcomingId;
}

async function getDetailsMoviesId(language, region) {
  let lang = checkLanguage();
  let reg = checkRegion();
  // let reg = "US";
  const moviesId = await getAllUpcomingMoviesId();
  const moviesDetails = getMoviesDetails();

  async function getMoviesDetails() {
    let data = [];
    // let movies = [];

    for (let i = 0; i < moviesId.length; i++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${moviesId[i]}?api_key=${apiTmdb}&append_to_response=release_dates%2Cvideos`
      );

      const result = await response.json();
      if (result.overview && result.poster_path) {
        data.push(result);
      }
    }
    // console.log("Resp : ", data);

    for (let i = 0; i < data.length; i++) {
      const responseVo = await fetch(
        `https://api.themoviedb.org/3/movie/${data[i].id}?api_key=${apiTmdb}&language=${lang}&append_to_response=videos`
      );
      const resultVo = await responseVo.json();

      data[i].overview_vo = resultVo.overview ? resultVo.overview : "";
      data[i].videos_vo = resultVo.videos;
    }
    // console.log("RespVO : ", data);

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].videos.results.length > 0 ||
        data[i].videos_vo.results.length > 0
      ) {
        movies.push(data[i]);
      }
    }

    return movies;
  }
  // console.log("DETAILS : ", moviesDetails);
  return moviesDetails;
}

async function displayTiles() {
  const moviesDetails = await getDetailsMoviesId();
  const firstTile = moviesDetails[moviesDetails.length - 1];
  console.log("firstTileid : ", firstTile);

  for (let i = 0; i < moviesDetails.length; i++) {
    const img = document.createElement("img");

    img.id = `${moviesDetails[i].id}`;
    // img.src = `https://image.tmdb.org/t/p/original${allPages[i].poster_path}`;
    img.src = moviesDetails[i].poster_path
      ? `https://image.tmdb.org/t/p/original${moviesDetails[i].poster_path}`
      : // `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${allPages[i].poster_path}`
        "./src/assets/images/error-404-no-wallpaper-found.png";
    img.alt =
      `Affiche du film : ` + moviesDetails[i].original_title !=
      moviesDetails[i].title
        ? `${moviesDetails[i].original_title} - ${moviesDetails[i].title} `
        : ` ${moviesDetails[i].original_title}`;
    img.title =
      moviesDetails[i].original_title != moviesDetails[i].title
        ? `${moviesDetails[i].original_title} - ${moviesDetails[i].title} `
        : ` ${moviesDetails[i].original_title}`;
    posterElem.insertAdjacentElement("afterbegin", img);
  }
  //   console.log(moviesDetails);
  window.onload = posterElem.lastChild.remove();
  displayVideo(firstTile);
}

async function displayVideo(firstTile, movieTarget) {
  // const moviesDetails = await getDetailsMoviesId();
  let movie = await checkFirstTile(firstTile, movieTarget);
  // console.log(movieObj);

  console.log(movie);
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
/*********************************** 
    AddEventLiseteners
************************************/
posterElem.addEventListener("click", (event) => {
  const target = event.target;
  console.log(target);
  // console.log("Movie : ", movies);
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
  displayVideo(movieTarget);
  displayInfo(movieTarget);
  createModal();
});

spanWhere.addEventListener("click", () => {
  console.log(spanWhere.dataset.where);
  spanWhere.dataset.where = "test";
});
