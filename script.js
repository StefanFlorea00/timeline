"use strict";
document.addEventListener("DOMContentLoaded", init);

let movies = [];
let bullets = [];
const Movie = {
  title: "",
  titleDk: "",
  year: 0,
  length: "",
  director: "",
  writers: "",
  poster: "",
};

async function init() {
  getSvg("popup_timeline.svg", ".timeline-wrapper", addTimelineEvents);
  getSvg("timeline_infobox.svg", ".infobox", addInfoBoxEvents);
  loadJSON("potterfilms.json");
}

async function getSvg(link, div, callback) {
  await fetch(link)
    .then((r) => r.text())
    .then((text) => {
      document.querySelector(div).innerHTML = text;
      callback();
    })
    .catch(console.error.bind(console));
}

async function loadJSON(jsonLink) {
  const response = await fetch(jsonLink);
  const jsonData = await response.json();

  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  movies = jsonData.map(prepareObjectMovie);
  movies.sort(movies.year);
}

function prepareObjectMovie(jsonObject) {
  const movie = Object.create(Movie);

  movie.title = jsonObject.title.original;
  movie.titleDk = jsonObject.title.danish;
  //getDK
  movie.year = jsonObject.year;
  movie.length = jsonObject.length;
  movie.writers = jsonObject.writers.screenplay;
  movie.director = jsonObject.director;
  //getScreenplay
  movie.poster = "./images/" + jsonObject.poster;

  return movie;
}

function addTimelineEvents() {
  bullets = document.querySelectorAll("#actual-bullets circle");
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].addEventListener("click", selectBullet);
  }
}

function addInfoBoxEvents() {
  createInfobox();
}

function createInfobox() {
  let newInfobox = document.createElementNS("http://www.w3.org/2000/svg", "use");
  newInfobox.setAttribute("href", "#infobox_x5F_template");
  document.querySelector("#infoboxes-timeline").appendChild(newInfobox);
}

function selectBullet() {
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i] == this) {
      console.log(i, movies[i]);
      displayInfoBox(this, movies[i]);
    }
  }
}

function displayInfoBox(bullet, movie) {
  document.querySelector("#infoline line").setAttribute("x1", bullet.getAttribute("cx"));
  document.querySelector("#infoline line").setAttribute("y1", bullet.getAttribute("cy"));

  const bounding = document.querySelector("use").getBoundingClientRect();

  if (bounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
    document.querySelector("use").setAttribute("x", parseInt(bullet.getAttribute("cx")) - 54 - 836);
    document.querySelector("use").setAttribute("y", parseInt(bullet.getAttribute("cy")) - 207 - 302);

    document.querySelector("#infoline line").setAttribute("x2", parseInt(bullet.getAttribute("cx")) - 54);
    document.querySelector("#infoline line").setAttribute("y2", parseInt(bullet.getAttribute("cy")) - 207);
  } else {
    document.querySelector("use").setAttribute("x", parseInt(bullet.getAttribute("cx")) + 54);
    document.querySelector("use").setAttribute("y", parseInt(bullet.getAttribute("cy")) - 207 - 302);

    document.querySelector("#infoline line").setAttribute("x2", parseInt(bullet.getAttribute("cx")) + 54);
    document.querySelector("#infoline line").setAttribute("y2", parseInt(bullet.getAttribute("cy")) - 207);
  }

  document.querySelectorAll("#infobox_x5F_template text")[0].textContent = movie.title;
  document.querySelectorAll("#infobox_x5F_template text")[1].textContent = movie.titleDk;
  document.querySelectorAll("#infobox_x5F_template text")[2].textContent = movie.year;
  document.querySelectorAll("#infobox_x5F_template text")[3].textContent = movie.length;
  document.querySelectorAll("#infobox_x5F_template text")[5].textContent = movie.director;
  document.querySelectorAll("#infobox_x5F_template text")[7].textContent = movie.writers;
  document.querySelector("#infobox_x5F_template image").setAttribute("xlink:href", movie.poster);

}