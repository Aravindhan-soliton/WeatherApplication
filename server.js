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

// send all cities timeZone
app.get("/all-timezone-cities", function (req, res) {
  // create a Child process using fork
  let allTimezon = fork(__dirname + "/child.js");
  allTimezon.on("message", (weatherinfo) => {
    lastForeCast = weatherinfo;
    res.json(weatherinfo);
  });
  allTimezon.send({ messagename: "GetData", messagebody: {} });
});

//send a city time to
app.get("/", function (req, res) {
  let city = req.query.city;
  if (city) {
    // create a Child process using fork
    let cityInfo = fork(__dirname + "/child.js");
    cityInfo.on("message", (cityData) => {
      res.json(cityData);
    });
    cityInfo.send({
      messagename: "GetcityInfo",
      messagebody: { cityname: city },
    });
  } else if (req.url.endsWith("/")) {
    app.use(express.static("./"));
    res.sendFile(__dirname + "/index.html");
  }
});

//send hourly forecast for one city
app.post("/hourly-forecast", function (req, res) {
  // create a Child process using fork
  let temperature = fork(__dirname + "/child.js");
  temperature.on("message", (nextFiveHrs) => {
    res.json(nextFiveHrs);
  });
  temperature.send({
    messagename: "GetTemperature",
    messagebody: {
      cityDTN: req.body.city_Date_Time_Name,
      hours: "6",
      weatherData: lastForeCast,
    },
  });
});

const server = http.createServer(app);
const port = 8000;
server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
