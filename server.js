const fs = require("fs");
const http = require("http");
const path = require("path");
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone.js");

let lastForeCast;
var express = require("express");
var app = express();
app.use(express.json());

const { fork } = require("child_process");
const EventEmitter = require("events");
var eventEmitter = new EventEmitter();

eventEmitter.on("allTime", (res, messageName) => {
  // create a Child process using fork
  let allTimezon = fork(__dirname + "/child.js");
  allTimezon.on("message", (weatherinfo) => {
    lastForeCast = weatherinfo;
    res.json(weatherinfo);
  });
  allTimezon.send({ messagename: messageName, messagebody: {} });
});

eventEmitter.on("cityData", (res, messageName, city) => {
  // create a Child process using fork
  let cityInfo = fork(__dirname + "/child.js");
  cityInfo.on("message", (cityData) => {
    res.json(cityData);
  });
  cityInfo.send({
    messagename: messageName,
    messagebody: { cityname: city },
  });
});

eventEmitter.on("indexLoad", (res) => {
  app.use(express.static("./"));
  res.sendFile(__dirname + "/index.html");
});

eventEmitter.on("nextFiveHoursData", (res, req, messageName) => {
  // create a Child process using fork
  let temperature = fork(__dirname + "/child.js");
  temperature.on("message", (nextFiveHrs) => {
    res.json(nextFiveHrs);
  });
  temperature.send({
    messagename: messageName,
    messagebody: {
      cityDTN: req.body.city_Date_Time_Name,
      hours: req.body.hours,
      weatherData: lastForeCast,
    },
  });
});

// send all cities timeZone
app.get("/all-timezone-cities", function (req, res) {
  eventEmitter.emit("allTime", res, "GetData");
});

//send a city time to
app.get("/", function (req, res) {
  let city = req.query.city;
  if (city) {
    eventEmitter.emit("cityData", res, "GetcityInfo", city);
  } else if (req.url.endsWith("/")) {
    eventEmitter.emit("indexLoad", res);
  }
});

//send hourly forecast for one city
app.post("/hourly-forecast", function (req, res) {
  eventEmitter.emit("nextFiveHoursData", res, req, "GetTemperature");
});

const server = http.createServer(app);
const port = 8000;
server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
