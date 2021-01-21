import "./index.scss";
import { apiTmdb } from "./assets/javascripts/api_key.js";
import { openModal, closeModal } from "./assets/javascripts/modal";
// import { burgerIsOpen, burgerIsClosed } from "./assets/javascripts/burger_menu";

/***********************************
    Selectors
************************************/
const contentPosterElem = document.querySelector(".news__content");
let posterElem = document.querySelector(".news__tile");
const tilesElem = document.querySelectorAll(".tile");
const contentVideoElem = document.querySelector(".content__video");
const iframeElem = document.querySelector("iframe");
const contentInfoElem = document.querySelector(".content__info");
const titleElem = document.querySelector(".info__title");
const originalTitleElem = document.querySelector(".info__original-title");
const genreElem = document.querySelector(".info__genre");
const countrieElem = document.querySelector(".info__countrie");
const dateElem = document.querySelector(".info__date");
const durationElem = document.querySelector(".info__duration");
const summaryElem = document.querySelector(".info__summary");
const creditsElem = document.querySelector(".info__credits");
const linkTmdbElem = document.querySelector(".info__tmdb");
const linkImdbElem = document.querySelector(".info__imdb");
const linlYoutubeElem = document.querySelector(".info__youtube");
const contentSpinnerElem = document.querySelector(".content-spinner");
const spanTime = document.querySelector(".news__selection__time");
let spanWhere = document.querySelector(".news__selection__where");
const spanLang = document.querySelector(".info__selection__language");
const burgerElem = document.querySelector(".burger_menu");

const countrieSelect = document.createElement("select");
countrieSelect.name = "countries";
const spinner = document.createElement("div");

let language = navigator.language.match(/[a-z]{2}/)[0];
// let region = "AD";
let region = navigator.language.match(/[A-Z]{2}/)[0];
spanWhere.dataset.where = region;

let allCountries;
// let region = "";
// let firstResult;
// let allMoviesId = [];
let movies = [];
let allMovies;
let queryDateMax;
let queryDateMin;
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

const getCountriesList = () => {
  const extractCountriesRegion = allMovies.reduce((acc, movie) => {
    if (movie.release_dates.results) {
      for (let i = 0; i < movie.release_dates.results.length; i++) {
        for (
          let j = 0;
          j < movie.release_dates.results[i].release_dates.length;
          j++
        ) {
          if (
            Date.parse(
              movie.release_dates.results[i].release_dates[j].release_date
            ) > queryDateMin &&
            Date.parse(
              movie.release_dates.results[i].release_dates[j].release_date
            ) < queryDateMax
          ) {
            // if (
            //   movie.release_dates.results[i].iso_3166_1 === "TR" ||
            //   movie.release_dates.results[i].iso_3166_1 === "IE"
            // ) {
            //   console.log("Turkey and Ireland Probleme : ", movie);
            // }
            acc[movie.release_dates.results[i].iso_3166_1] =
              movie.release_dates.results[i].release_dates[j].release_date;
          }
        }
      }
    }
    return acc;
  }, {});
  // console.log(extractCountriesRegion);
  const extractCountriesRegionArr = Object.keys(extractCountriesRegion);
  let countriesArr = [];
  countriesArr.push(["", "All"]);
  for (let i = 0; i < allCountries.length; i++) {
    for (let j = 0; j < extractCountriesRegionArr.length; j++) {
      if (extractCountriesRegionArr[j] === allCountries[i].iso_3166_1) {
        countriesArr.push([
          extractCountriesRegionArr[j],
          allCountries[i].english_name,
        ]);
      }
    }
  }

  // countriesArr.forEach((elem) => {
  //   if (elem[0] === spanWhere.dataset.where) {
  //     spanWhere.innerText = `${elem[1]}`;
  //     spanWhere.setAttribute("data-where_english-name", elem[1]);
  //   }
  // });
  return countriesArr;
};
const createSelectCountriesModal = () => {
  const countriesArr = getCountriesList();
  // console.log(countriesArr);

  countriesArr.sort((a, b) => {
    return a[1].localeCompare(b[1]);
  });
  // console.log(countriesArr);

  const createOption = (country) => {
    let option = document.createElement("option");
    option.value = country[0];
    option.innerHTML = `${country[1]}`;
    countrieSelect.append(option);
  };

  let invokeMakeOption = 0;
  const makeOption = (where) => {
    // To have countries in order (PC, US, All) in first

    countriesArr.forEach((country) => {
      if (country[0] === where) {
        createOption(country);
        invokeMakeOption++;
      }
    });
    // console.log(invokeMakeOption);
    // ...spread countries
    if (invokeMakeOption === 3)
      countriesArr.forEach((country) => {
        if (country[0] !== where) {
          createOption(country);
        }
      });
  };
  makeOption(spanWhere.dataset.where);
  makeOption("US");
  makeOption("");

  // return countrieSelect;
};
const removeTiles = () => {
  const posterImgElem = document.querySelectorAll(".news__tile>img");
  posterImgElem.forEach((elem) => {
    elem.remove();
  });
};
(function createSpinner() {
  spinner.classList.add("loader");

  contentSpinnerElem.appendChild(spinner);
})();
/////////Async//////////
/* TEST */
// Test recuperartion details artiste
// Probleme de connexion TMDB 14/01/2021 -> 20/01
// (async function test() {
//   const resp = await fetch(
//     `https://api.themoviedb.org/3/credit/90633?api_key=2046c2787afbb61a5ccb44ccc6801c13`
//   );
//   console.log(await resp.json());
// })();
/* FIN */
(async function fetchAllCountries() {
  const response = await fetch(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${apiTmdb}`
  );
  allCountries = await response.json();

  // console.log(allCountries);
})();

async function fetchCheckMovies() {
  let firstResult;
  let response;
  try {
    region
      ? (response = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&region=${region}`
        ))
      : (response = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}`
        ));
    firstResult = await response.json();

    if (firstResult.results.length === 0) {
      response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&region=US`
      );
      firstResult = await response.json();
      spanWhere.dataset.where = "US";
      openModal(
        "Il n'y a aucun résultat pour cette recherche. Résultat pour les états unis"
      );
    }

    allCountries.forEach((country) => {
      if (country.iso_3166_1 === spanWhere.dataset.where) {
        spanWhere.innerText = `${country.english_name}`;
        spanWhere.setAttribute("data-where_english-name", country.english_name);
      }
    });

    queryDateMax = Date.parse(firstResult.dates.maximum);
    queryDateMin = Date.parse(firstResult.dates.minimum);
    return firstResult;
  } catch (e) {
    console.error(e);
  }
}

async function fetchMoviesAllId() {
  const firstResult = await fetchCheckMovies();
  let allMoviesId = [];
  try {
    if (region) {
      try {
        let response;
        let result;
        for (let i = 1; i <= firstResult.total_pages; i++) {
          response = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&page=${i}&region=${region}`
          );
          result = await response.json();

          if (result.results.length === 0) {
            response = await fetch(
              `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&page=${i}&region=US`
            );
            result = await response.json();
          }

          result.results.forEach((element) => {
            allMoviesId.push(element.id);
          });
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        for (let i = 1; i <= firstResult.total_pages; i++) {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiTmdb}&page=${i}`
          );
          const result = await response.json();
          result.results.forEach((element) => {
            allMoviesId.push(element.id);
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    // console.log("Fetch ID : ", allMoviesId);
    return allMoviesId;
  } catch (e) {
    console.error(e);
  }
}

async function fetchMoviesDetails() {
  const allMoviesId = await fetchMoviesAllId();
  let temp = [];

  try {
    for (let i = 0; i < allMoviesId.length; i++) {
      const responseUs = await fetch(
        `https://api.themoviedb.org/3/movie/${allMoviesId[i]}?api_key=${apiTmdb}&append_to_response=release_dates%2Cvideos%2Ccredits`
      );
      temp.push(await responseUs.json());
    }
    return temp;
  } catch (e) {
    console.error(e);
  }
  // console.log("Fetch DETAILS : ", temp);
}

async function fetchAddVoDetails() {
  const temp = await fetchMoviesDetails();
  movies = [];

  try {
    for (let i = 0; i < temp.length; i++) {
      const responseVo = await fetch(
        `https://api.themoviedb.org/3/movie/${temp[i].id}?api_key=${apiTmdb}&language=${language}&append_to_response=videos`
      );
      const resultVo = await responseVo.json();
      temp[i].overview_vo = resultVo.overview ? resultVo.overview : "";
      temp[i].videos_vo = resultVo.videos;
    }
  } catch (e) {
    console.error(e);
  }
  // empty the array for the second load
  if (loaded > 0) {
    movies = [];
  }
  for (let i = 0; i < temp.length; i++) {
    if (
      temp[i].videos.results.length > 0 ||
      temp[i].videos_vo.results.length > 0
    ) {
      movies.push(temp[i]);
    }
  }

  //   make a deep copy on the second load to have an immutable reference
  if (loaded === 1) {
    allMovies = JSON.parse(JSON.stringify(movies));
    loaded = 2;
  }
  // console.log("Fetch MOVIES : ", movies);
  // console.log("Fetch ALLmovies : ", allMovies);
  return movies;
}

async function displayTiles(movieTarget) {
  let movie;
  if (spanWhere.dataset.where !== "") {
    movie = await fetchAddVoDetails();
  } else {
    movie = allMovies;
  }
  const firstTile = movie[movie.length - 1];
  if (loaded === 0) {
    const dateMin = new Date(queryDateMin);
    const dateMax = new Date(queryDateMax);
    let p = document.createElement("p");
    p = `du ${dateMin.toLocaleDateString()} au ${dateMax.toLocaleDateString()} en `;
    spanWhere.insertAdjacentHTML("beforebegin", p);
  }

  for (let i = 0; i < movie.length; i++) {
    const img = document.createElement("img");
    img.classList.add("tile");

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

  displayVideo(firstTile);
}

async function displayVideo(firstTile, movieTarget) {
  let movie = await checkFirstTile(firstTile, movieTarget);
  let videosVO = [];
  let videosUS = [];
  let youtubeSrc = "https://www.youtube.com/embed/";
  let vimeoSrc = "https://player.vimeo.com/video/";

  if (movie.videos_vo.results.length > 0) {
    videosVO = movie.videos_vo.results;
    console.log(movie.videos_vo.results);
  }
  if (movie.videos.results.length > 0) {
    videosUS = movie.videos.results;
  }
  console.log("videoVO : ", videosVO);
  console.log("videoUS : ", videosUS);
  // iframeElem.src =
  //   `https://www.youtube.com/embed/` +
  //   (videosVO.length > 0
  //     ? `${videosVO[videosVO.length - 1].key}`
  //     : `${videosUS[videosUS.length - 1].key}`);

  iframeElem.src =
    videosVO.length > 0
      ? videosVO[videosVO.length - 1].site === "YouTube"
        ? `${youtubeSrc}` + `${videosVO[videosVO.length - 1].key}`
        : `${vimeoSrc}` + `${videosVO[videosVO.length - 1].key}`
      : videosUS[videosUS.length - 1].site === "YouTube"
      ? `${youtubeSrc}` + `${videosUS[videosUS.length - 1].key}`
      : `${vimeoSrc}` + `${videosUS[videosUS.length - 1].key}`;

  //       <iframe src="https://player.vimeo.com/video/427413466" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
  // <p><a href="https://vimeo.com/427413466">La Bataille du rail</a> from <a href="https://vimeo.com/perig">Perig</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

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
  let release_date;
  let production_countrie;

  // has genre
  if (movie.genres.length > 0) {
    for (let i = 0; i < movie.genres.length; i++) {
      genres += movie.genres[i].name + " ";
    }
  } else {
    genres = "genre non communiqué...";
  }

  // get coutry production
  if (movie.production_countries[0]) {
    production_countrie = movie.production_countries[0].name;
  } else {
    allCountries.forEach((elem) => {
      if (movie.release_dates.results[0].iso_3166_1 === elem.iso_3166_1)
        production_countrie = elem.english_name;
    });
  }

  //get the release date
  if (spanWhere.dataset.where) {
    for (let i = 0; i < movie.release_dates.results.length; i++) {
      if (
        spanWhere.dataset.where === movie.release_dates.results[i].iso_3166_1
      ) {
        for (
          let j = 0;
          j < movie.release_dates.results[i].release_dates.length;
          j++
        ) {
          if (
            Date.parse(
              movie.release_dates.results[i].release_dates[j].release_date
            ) >= queryDateMin
          ) {
            release_date = new Date(
              movie.release_dates.results[i].release_dates[j].release_date
            );
          }
        }
      }
    }
  } else {
    release_date = new Date(
      movie.release_dates.results[0].release_dates[0].release_date
    );
  }
  titleElem.innerHTML = `${movie.title}`;
  originalTitleElem.innerHTML = `<span class="info__span">Titre original :</span> ${movie.original_title}`;
  countrieElem.innerHTML = `<span class="info__span">Pays : </span>${production_countrie}`;
  genreElem.innerHTML = `<span class="info__span">Genre(s) : </span>${genres}`;
  durationElem.innerHTML =
    `<span class="info__span">Durée : </span>` +
    (movie.runtime > 0 ? `${movie.runtime} minutes` : `Non communiqué`);
  dateElem.innerHTML = `<span class="info__span">Prévue le : </span>${release_date.toLocaleDateString()} (${
    spanWhere.dataset.where
      ? spanWhere.dataset.where
      : movie.release_dates.results[0].iso_3166_1
  })`;
  summaryElem.innerHTML =
    '<span class="info__span">Synopsis : </span></br>' +
    (movie.overview_vo
      ? `${movie.overview_vo}`
      : `<i>Aucun synopsis n'est encore proposé en français :( </i></br> <u>Version anglaise :</u> ${movie.overview}`);
  linkTmdbElem.href = `http://themoviedb.org/movie/${movie.id}`;
  linkImdbElem.href = `https://www.imdb.com/title/${movie.imdb_id}`;
  linlYoutubeElem.href = `https://www.youtube.com/results?search_query=${movie.title}`;
}
// displayTiles().then(console.log("test"));

// Reloading of all background processes for all countries because loading all the films is often very long!!!
const rechargeAllMovies = async () => {
  await displayTiles();

  loaded = 1;
  region = null;
  await fetchAddVoDetails();
  spinner.remove();
  burgerElem.classList.remove("display-none");
  createSelectCountriesModal();

  // console.log("time :", allMovies);

  // console.log("reload movies : ", movies);
};

rechargeAllMovies();
/***********************************
    AddEventLiseteners
************************************/
posterElem.addEventListener("click", (event) => {
  const target = event.target;
  // console.log(loaded);
  // console.log("Movie : ", movies);
  // console.log("Display MOVIES", movies);

  let movieTarget;
  (function getMovieObj() {
    let movie = loaded === 1 ? movies : allMovies;

    for (let i = 0; i < movie.length; i++) {
      // console.log("movie : ", movies[i].id, " target : ", target.id);
      // console.log(movies[i].id.toString() === target.id);
      if (movie[i].id.toString() === target.id) {
        movieTarget = JSON.parse(JSON.stringify(movie[i]));
      }
    }
  })();
  console.log("MovieOBJ : ", movieTarget);
  // console.log("Loaded : ", loaded);
  displayVideo(movieTarget);
  displayInfo(movieTarget);
  // createModal();
});
let index;
burgerElem.addEventListener("click", async () => {
  // console.log(posterElem);

  if (burgerElem.classList.contains("is-closed")) {
    const result = await openModal(countrieSelect);
    if (result) {
      spanWhere.dataset.where = countrieSelect.value;
      spanWhere.innerText = `${countrieSelect.options[index].label}`;
      spanWhere.dataset.where_englishName = `${countrieSelect.options[index].label}`;
      region = countrieSelect.value;
      removeTiles();
      displayTiles();
    }
  } else {
    closeModal();
  }
});
countrieSelect.addEventListener("change", (event) => {
  index = event.target.selectedIndex;
  return index;
});
