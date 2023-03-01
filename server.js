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

// send all cities timeZone
app.get("/all-timezone-cities",  function (req, res) {
  lastForeCast = allTimeZones()
  res.json(lastForeCast);
});

//send a city time to
app.get("/", function (req, res) {
  let city = req.query.city;
  if(city){
    res.json(timeForOneCity(city));
  }
  else if(req.url.endsWith("/")){
      app.use(express.static("./"));
      res.sendFile(__dirname + "/index.html");
  }
});

//send hourly forecast for one city
app.post( "/hourly-forecast", function (req, res) {
  res.json(nextNhoursWeather(req.body.city_Date_Time_Name , "6", lastForeCast));
})

const server = http.createServer(app);
const port = 8000;
server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
