// Import the neccessary moduleconst
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone.js");
/* The listener will receive a message from server.js(parent) and based on that* message a particular function is called and the resulted data is returned to server.js.*/
process.on("message", (message) => {
  let Data;
  if (message.messagename === "GetTemperature") {
    Data = nextNhoursWeather(
      message.messagebody.cityDTN,
      message.messagebody.hours,
      message.messagebody.weatherData
    );
  } else if (message.messagename === "GetcityInfo") {
    Data = timeForOneCity(message.messagebody.cityname);
  } else if (message.messagename === "GetData") {
    Data = allTimeZones();
  }
  process.send(Data);
  process.exit();
});
