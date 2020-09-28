"use strict";
document.addEventListener("DOMContentLoaded", init);

let movies = [];
let bullets = [];
const Movie = {
  title: "",
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
  //getDK
  movie.year = jsonObject.year;
  movie.length = jsonObject.length;
  movie.writers = jsonObject.writers.novel;
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

function createInfobox(i) {
  //   let infoboxTexts = document.querySelector("#infobox_x5F_template").querySelectorAll("text");
  //   infoboxTexts[0].textContent = movies[i].title;
  //   infoboxTexts[1].textContent = "caca";
  //   infoboxTexts[2].textContent = movies[i].year;
  //   console.log(infoboxTexts[2], movies[i].year);
  //   console.log(infoboxTexts[0], movies[i].title);

  let newInfobox = document.createElementNS("http://www.w3.org/2000/svg", "use");
  newInfobox.setAttribute("href", "#infobox_x5F_template");
  document.querySelector("#infoboxes-timeline").appendChild(newInfobox);
}

function selectBullet() {
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i] == this) {
      console.log(i, movies[i]);
      displayInfoBox(this);
    }
  }
}

function displayInfoBox(bullet) {
  document.querySelector("#infoline line").setAttribute("x1", bullet.getAttribute("cx"));
  document.querySelector("#infoline line").setAttribute("y1", bullet.getAttribute("cy"));
  document.querySelector("#infoline line").setAttribute("x2", parseInt(bullet.getAttribute("cx")) + 54);
  document.querySelector("#infoline line").setAttribute("y2", parseInt(bullet.getAttribute("cy")) - 207);
  document.querySelector("use").setAttribute("x", parseInt(bullet.getAttribute("cx")) + 54);
  document.querySelector("use").setAttribute("y", parseInt(bullet.getAttribute("cy")) - 207 - 302);
}
