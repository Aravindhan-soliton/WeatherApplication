let cityObj;
let myInterval;
let footSectionObj;
let midSectionObj;
let dataList;
let displayList;
let blockList;
let timer;
let blockTimer;
let continentSwap = 0;
let temperatureSwap = 0;
const cityId = document.querySelector("#city0");
const blockId = document.querySelector("#block0");
document.getElementById("citychange").addEventListener("change", UpdateCity);
document
  .getElementById("filter0")
  .addEventListener("click", () => borderChange("filter0"));
document
  .getElementById("filter1")
  .addEventListener("click", () => borderChange("filter1"));
document
  .getElementById("filter2")
  .addEventListener("click", () => borderChange("filter2"));
document
  .getElementById("left-button")
  .addEventListener("click", () => midSectionScroll(-2.9));
document
  .getElementById("right-button")
  .addEventListener("click", () => midSectionScroll(2.9));
document
  .getElementById("number-box")
  .addEventListener("change", () => cardUpdate());
window.addEventListener("resize", updateScrollArrow);
document
  .getElementById("Continent-sort")
  .addEventListener("click", () => UpdateBlockSort(2));
document
  .getElementById("Temperature-sort")
  .addEventListener("click", () => UpdateBlockSort(1));
document
  .getElementById("Temperature-sort")
  .setAttribute(
    "style",
    "background-image: url('HTML & CSS/General Images & Icons/arrowUp.svg')"
  );
document
  .getElementById("Continent-sort")
  .setAttribute(
    "style",
    "background-image: url('HTML & CSS/General Images & Icons/arrowUp.svg')"
  );

let cityFunction = function () {};
// Set values operation performed for all the needed fieldscity
cityFunction.prototype.setCityName = function (cityName) {
  this.cityName = cityName;
};
cityFunction.prototype.setDateAndTime = function (dateAndTime) {
  this.dateAndTime = dateAndTime;
};
cityFunction.prototype.setTimeZone = function (timeZone) {
  this.timeZone = timeZone;
};
cityFunction.prototype.setTemperature = function (temperature) {
  this.temperature = temperature;
};
cityFunction.prototype.setHumidity = function (humidity) {
  this.humidity = humidity;
};
cityFunction.prototype.setPrecipitation = function (precipitation) {
  this.precipitation = precipitation;
};
cityFunction.prototype.setNextFiveHrs = function (nextFiveHrs) {
  this.nextFiveHrs = nextFiveHrs;
};
// Get values operation performed for all the needed fieldscity
cityFunction.prototype.getCityName = function () {
  return this.cityName;
};
cityFunction.prototype.getDateAndTime = function () {
  return this.dateAndTime;
};
cityFunction.prototype.getTimeZone = function () {
  return this.timeZone;
};
cityFunction.prototype.getTemperature = function () {
  return this.temperature;
};
cityFunction.prototype.getHumidity = function () {
  return this.humidity;
};
cityFunction.prototype.getPrecipitation = function () {
  return this.precipitation;
};
cityFunction.prototype.getNextFiveHrs = function (index) {
  return this.nextFiveHrs[index];
};
cityFunction.prototype.fetchTime = function (cityTimeZone) {
  return new Date().toLocaleString("en-US", { timeZone: cityTimeZone });
};
let midSection = function () {};
midSection.__proto__ = cityFunction;
/**
 *Updates Live time in displayed cards in mid section.
 * @param {object} city
 * @param {id} timeId
 * @return {*} time
 */
midSection.prototype.updateCardTime = function (city) {
  let dateTime = cityObj.fetchTime(city.timeZone);
  let hour = new Date(dateTime).getHours();
  let min = new Date(dateTime).getMinutes();
  const ampm = hour < 12 ? "AM" : "PM";
  hour = hour % 12;
  hour = hour == 0 ? 12 : hour;
  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  return hour + ":" + min + " " + ampm;
};
/**
 *shows err message if the given city is not available.
 */
function errFunction() {
  myStopFunction();
  let errMessage = document.getElementById("err-message");
  let citychange = document.getElementById("citychange");
  let errImgArray = document.getElementsByClassName("err-img");
  let errTextArray = document.getElementsByClassName("err-text");
  citychange.setAttribute("style", "border-color: red");
  errMessage.innerText = "***Invalid City***";
  errMessage.setAttribute("style", "color: red");
  for (let i = 0; i < errTextArray.length; i++) {
    errTextArray[i].innerText = "NaN";
  }
  for (let i = 0; i < errImgArray.length; i++) {
    errImgArray[i].setAttribute(
      "style",
      "background-image: url('./HTML & CSS/General Images & Icons/warning.svg')"
    );
  }
}

/**
 *Update the City details in top section.
 */
function UpdateCity() {
  updateTopSection(this.value);
}

/**
 *Check for the entered city in the List and Load it,
 *else call error function to show error message.es
 * @param {string} city
 */
function updateTopSection(city) {
  var temp = false;
  let cityX = city.toLowerCase();
  for (let cit in dataList) {
    if (cityX == cit) temp = true;
  }
  if (temp) {
    cityObj = new cityFunction();
    cityObj.setCityName(dataList[cityX].cityName);
    cityObj.setDateAndTime(dataList[cityX].dateAndTime);
    cityObj.setTemperature(dataList[cityX].temperature);
    cityObj.setHumidity(dataList[cityX].humidity);
    cityObj.setNextFiveHrs(dataList[cityX].nextFiveHrs);
    cityObj.setTimeZone(dataList[cityX].timeZone);
    cityObj.setPrecipitation(dataList[cityX].precipitation);
    var citychange = document.getElementById("citychange");
    var errMessage = document.getElementById("err-message");
    citychange.setAttribute("style", "border-color: transparent");
    errMessage.innerText = " ";
    updateCityTime(cityObj);
    updateCityImg(cityObj);
    updateTempVal(cityObj);
    updateNextFiveHours(cityObj);
  } else {
    errFunction();
  }
}

/**
 *Update the city logo image in the top section.
 * @param {string} city
 */
function updateCityImg(city) {
  document
    .getElementById("city-logo")
    .setAttribute(
      "style",
      "background-image: url('./HTML & CSS/Icons for cities/" +
        city.getCityName().toLowerCase() +
        ".svg')"
    );
}

/**
 *Update city time in the top section.
 * @param {string} city
 */
function updateCityTime(city) {
  myClock();
  myStopFunction();
  myInterval = setInterval(myClock, 1000);
  function myClock() {
    let dateId = document.getElementById("date");
    let timeId = document.getElementById("time");
    let secId = document.getElementById("sec");
    const dateTime = city.fetchTime(city.getTimeZone());
    const date = new Date(dateTime).getDate();
    let hour = new Date(dateTime).getHours();
    const min = new Date(dateTime).getMinutes();
    const fullDate =
      (date < 10 ? "0" + date : date) +
      "-" +
      new Date().toLocaleString(
        "en-US",
        { month: "short" },
        { timeZone: dateTime }
      ) +
      "-" +
      new Date(dateTime).getFullYear();
    if (hour < 12) {
      document
        .getElementById("ampm")
        .setAttribute(
          "style",
          "background-image: url('./HTML & CSS/General Images & Icons/amState.svg')"
        );
    } else {
      document
        .getElementById("ampm")
        .setAttribute(
          "style",
          "background-image: url('./HTML & CSS/General Images & Icons/pmState.svg')"
        );
    }
    hour %= 12;
    hour = hour == 0 ? 12 : hour;
    const time =
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (min < 10 ? "0" + min : min) +
      ":";
    let sec = new Date(dateTime).getSeconds();
    sec = sec < 10 ? "0" + sec : sec;
    timeId.innerText = time;
    dateId.innerText = fullDate;
    secId.innerText = sec;
    myStopFunction();
    myInterval = setInterval(myClock, 1000);
  }
}

/**
 *function to stop intervals.
 */
function myStopFunction() {
  clearInterval(myInterval);
}

/**
 *Update temparatures, humidity, precipitation values in the top section.
 * @param {string} city
 */
function updateTempVal(city) {
  let tempC = document.getElementById("tempC");
  let tempF = document.getElementById("tempF");
  let humidity = document.getElementById("humidity");
  let precipitation = document.getElementById("precipitation");
  let cVal = city.getTemperature().split("°C")[0];
  tempC.innerText = cVal + " C";
  let fVal = (cVal * 9) / 5 + 32;
  tempF.innerText = Math.round(fVal) + " F";
  humidity.innerText = city.getHumidity().split("%")[0];
  precipitation.innerText = city.getPrecipitation().split("%")[0];
}

/**
 *Update Next five hours weather details in the top section.
 * @param {string} city
 */
function updateNextFiveHours(city) {
  document.getElementById("now").innerText = "Now";
  document.getElementById("Hour0").innerText = city
    .getTemperature()
    .split("°C")[0];
  for (let index = 1; index <= 6; index++) {
    if (index < 6) {
      updateTime(document.getElementById("Time" + index), city, index);
    }
    if (index < 5) {
      document.getElementById("Hour" + index).innerText = city
        .getNextFiveHrs(index - 1)
        .split("°C")[0];
    } else {
      document.getElementById("Hour5").innerText =
        document.getElementById("Hour4").innerText;
    }
    updateTempImg(
      document.getElementById("Img" + (index - 1)),
      document.getElementById("Hour" + (index - 1)).innerText,
      1
    );
  }
}

/**
 *Update Next five hours hour values.
 * @param {id} timeUpdate
 * @param {object} city
 * @param {int} hourAdd
 */
function updateTime(timeUpdate, city, hourAdd) {
  const time = city.fetchTime(city.getTimeZone());
  let hour = new Date(time).getHours();
  const ampm = hour < 12 ? "AM" : "PM";
  hour = hour + hourAdd;
  hour = hour % 12;
  hour = hour == 0 ? 12 : hour;
  timeUpdate.innerText = hour + ampm;
}

/**
 *Update Next five hours images.
 * @param {string} img
 * @param {int} temp
 * @param {int} val
 */
function updateTempImg(img, temp, val) {
  if (temp < 19) {
    img.setAttribute(
      "style",
      "background-image: url('./HTML & CSS/Weather Icons/rainyIcon.svg')"
    );
  } else if (temp < 22 && val == 1) {
    img.setAttribute(
      "style",
      "background-image: url('./HTML & CSS/Weather Icons/windyIcon.svg')"
    );
  } else if (temp < 29 && val == 1) {
    img.setAttribute(
      "style",
      "background-image: url('./HTML & CSS/Weather Icons/cloudyIcon.svg')"
    );
  } else if (temp < 28) {
    img.setAttribute(
      "style",
      "background-image: url('./HTML & CSS/Weather Icons/snowflakeIcon.svg')"
    );
  } else {
    img.setAttribute(
      "style",
      "background-image: url('./HTML & CSS/Weather Icons/sunnyIcon.svg')"
    );
  }
}

/**
 *Sort the mid mection based on weather .
 * @param {*} filterId
 */
function borderChange(filterId) {
  midSectionObj = new midSection();
  console.log(midSectionObj);
  for (let index = 0; index < 3; index++) {
    document
      .getElementById("filter" + index)
      .setAttribute("style", "border-bottom-style: none");
  }
  document
    .getElementById(filterId)
    .setAttribute("style", "border-bottom-style: solid");
  displayListUpdate(filterId.substring(filterId.length - 1, filterId.length));
  cardUpdate();
  clearInterval(timer);
  timer = setInterval(UpdateCardDateTime, 500);
}

/**
 *Create cards in mid section based on the cities in displaylist.
 */
function cardUpdate() {
  let index = 0;
  clearInterval(timer);
  document.getElementById("mid-container").replaceChildren();
  for (let city in displayList) {
    let clone = cityId.cloneNode(true);
    clone.id = "city" + index;
    document.getElementById("mid-container").appendChild(clone);
    clone.querySelector("#city-name").innerText = displayList[city].cityName;
    clone
      .querySelector("#card-img")
      .setAttribute(
        "style",
        "background-image: url('./HTML & CSS/Icons for cities/" +
          displayList[city].cityName.toLowerCase() +
          ".svg')"
      );
    clone.querySelector("#card-humidity").innerText =
      displayList[city].humidity;
    clone.querySelector("#card-precipitation").innerText =
      displayList[city].precipitation;
    clone.querySelector("#card-date").id = "card-date" + index;
    clone.querySelector("#card-time").id = "card-time" + index;
    updateCardDate(
      displayList[city].cityName.toLowerCase(),
      "card-date" + index
    );
    midSectionObj.updateCardTime(displayList[city].cityName.toLowerCase());
    let temperature = displayList[city].temperature;
    clone.querySelector("#card-temp").innerText = temperature;
    let tempImg = clone.querySelector("#card-temp-img");
    temperature = temperature.substring(0, temperature.length - 2);
    updateTempImg(tempImg, temperature, 0);
    index++;
    if (index > document.getElementById("number-box").value - 1) {
      break;
    }
  }
  updateScrollArrow();
}

/**
 *Timeout function to sleep the control.
 * @param {int} ms
 * @return {*}  closes the function.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *function to control smooth scroll in mid section.
 * @param {*} val
 */
async function midSectionScroll(val) {
  let temp = 7;
  if (val < 0) temp = 1;
  for (let i = 0; i < 100; i++) {
    await sleep(4);
    if (i % temp == 0)
      document.getElementById("mid-container").scrollLeft += val;
    else
      document.getElementById("mid-container").scrollLeft +=
        val > 0 ? val + 0.1 : -1;
  }
}

/**
 *Update displayList based on the weather Selected in mid section.
 * @param {int} sort
 */
function displayListUpdate(sort) {
  if (sort == 2) {
    displayList = Object.values(dataList).filter(
      (city) => Number(city.temperature.split("°C")[0]) < 20
    );
    displayList.sort(
      (a, b) => a.humidity.split("%")[0] - b.humidity.split("%")[0]
    );
    displayList.reverse();
  } else if (sort == 1) {
    displayList = Object.values(dataList).filter(
      (city) =>
        Number(city.temperature.split("°C")[0]) > 19 &&
        Number(city.temperature.split("°C")[0]) < 28
    );
    displayList.sort(
      (a, b) => a.precipitation.split("%")[0] - b.precipitation.split("%")[0]
    );
    displayList.reverse();
  } else {
    displayList = Object.values(dataList).filter(
      (city) => Number(city.temperature.split("°C")[0]) > 29
    );
    displayList.sort(
      (a, b) => a.temperature.split("°C")[0] - b.temperature.split("°C")[0]
    );
    displayList.reverse();
  }
}

/**
 *function calls functions to Updates Live date and time in displayed cards in mid section.
 */
function UpdateCardDateTime() {
  let numBoxValue = document.getElementById("number-box").value;
  let index = 0;
  for (let city in displayList) {
    try {
      updateCardDate(displayList[city], "card-date" + index);
      document.getElementById("card-time" + index).innerText =
        midSectionObj.updateCardTime(displayList[city], "card-time" + index);
    } catch {}
    if (index >= parseInt(numBoxValue) - 1) break;
    index++;
  }
}

/**
 *Updates Live date in displayed cards in mid section.
 * @param {object} city
 * @param {id} dateId
 */
function updateCardDate(city, dateId) {
  let dateTime = cityObj.fetchTime(city.timeZone);
  const date = new Date(dateTime).getDate();
  document.getElementById(dateId).innerText =
    (date < 10 ? "0" + date : date) +
    "-" +
    new Date().toLocaleString(
      "en-US",
      { month: "short" },
      { timeZone: dateTime }
    ) +
    "-" +
    new Date(dateTime).getFullYear();
}

/**
 *Updates Visibility of scroll arrows and alignment of cards in mid section.
 */
function updateScrollArrow() {
  let divWidth = document.getElementById("card-div").clientWidth;
  let displayCount = displayList.length;
  let numberBoxCount = document.getElementById("number-box").value;
  let count = displayCount < numberBoxCount ? displayCount : numberBoxCount;
  if (divWidth < count * 280) {
    document
      .getElementById("mid-container")
      .setAttribute("style", "justify-content: none");
    document.getElementById("arrow-div1").setAttribute("style", "display:flex");
    document.getElementById("arrow-div2").setAttribute("style", "display:flex");
  } else {
    document
      .getElementById("mid-container")
      .setAttribute("style", "justify-content: center");
    document.getElementById("arrow-div1").setAttribute("style", "display:none");
    document.getElementById("arrow-div2").setAttribute("style", "display:none");
  }
}

function footSection() {}
/**
 *Update bottom section by creating blocks based on the city list.
 */
function updateBlocks() {
  let index = 0;
  footSection.prototype = new cityFunction();
  footSectionObj = new footSection();
  clearInterval(blockTimer);
  document.getElementById("blocks").replaceChildren();
  for (let city in blockList) {
    let clone = blockId.cloneNode(true);
    clone.id = "block" + index;
    document.getElementById("blocks").appendChild(clone);
    let timeZone = blockList[city].timeZone;
    clone.querySelector("#city-time").id = "city-time" + index;
    clone.querySelector("#continent-name").innerText = timeZone.substring(
      0,
      timeZone.indexOf("/")
    );
    clone.querySelector("#block-temp").innerText = blockList[city].temperature;
    clone.querySelector("#block-humidity").innerText = blockList[city].humidity;
    document.getElementById("city-time" + index).innerText =
      blockList[city].cityName +
      ", " +
      midSectionObj.updateCardTime(blockList[city]);
    if (index == 11) break;
    index++;
  }
}

/**
 *Update block time for every minute.
 */
function UpdateBlockTime() {
  let index = 0;
  for (let city in blockList) {
    document.getElementById("city-time" + index).innerText =
      blockList[city].cityName +
      ", " +
      midSectionObj.updateCardTime(blockList[city]);
    if (index == 11) break;
    index++;
  }
}

/**
 *Update bottom section blocks based on continent and temperature filters.
 * @param {int} val
 */
function UpdateBlockSort(val) {
  UpdateBlockSortTemperature();
  UpdateBlockSortContinent();
  if (val == 1) {
    if (temperatureSwap == 0) {
      document
        .getElementById("Temperature-sort")
        .setAttribute(
          "style",
          "background-image: url('HTML & CSS/General Images & Icons/arrowDown.svg')"
        );
      temperatureSwap = 1;
    } else {
      document
        .getElementById("Temperature-sort")
        .setAttribute(
          "style",
          "background-image: url('HTML & CSS/General Images & Icons/arrowUp.svg')"
        );
      temperatureSwap = 0;
    }
  } else if (val == 2) {
    if (continentSwap == 0) {
      document
        .getElementById("Continent-sort")
        .setAttribute(
          "style",
          "background-image: url('HTML & CSS/General Images & Icons/arrowDown.svg')"
        );
      continentSwap = 1;
    } else {
      document
        .getElementById("Continent-sort")
        .setAttribute(
          "style",
          "background-image: url('HTML & CSS/General Images & Icons/arrowUp.svg')"
        );
      continentSwap = 0;
    }
  }
  if (continentSwap == 1) {
    if (temperatureSwap == 0) {
      UpdateBlockSortTemperature();
      blockList.reverse();
    }
    UpdateBlockSortContinent();
    blockList.reverse();
  } else if (temperatureSwap == 1 && continentSwap == 0) {
    blockList.reverse();
    UpdateBlockSortContinent();
  }
  updateBlocks();
  blockTimer = setInterval(UpdateBlockTime, 500);
}

/**
 *Sort the block list based on continents
 */
function UpdateBlockSortContinent() {
  blockList.sort(function (a, b) {
    if (a.timeZone.split("/")[0] < b.timeZone.split("/")[0]) {
      return -1;
    }
    if (a.timeZone.split("/")[0] > b.timeZone.split("/")[0]) {
      return 1;
    }
    return 0;
  });
  updateBlocks();
}

/**
 *Sort the block list based on Temperature.
 */
function UpdateBlockSortTemperature() {
  blockList.sort(
    (a, b) => a.temperature.split("°C")[0] - b.temperature.split("°C")[0]
  );
  updateBlocks();
}
(function () {
  dataList = cityData;
  displayList = cityData;
  blockList = Object.values(dataList);
  let city = document.getElementById("city");
  for (let cityDetails in dataList) {
    let option = document.createElement("OPTION");
    option.value = dataList[cityDetails].cityName;
    city.appendChild(option);
  }
  updateTopSection(document.getElementById("citychange").value);
  borderChange("filter0");
  updateBlocks();
  UpdateBlockSort(0);
  clearInterval(blockTimer);
  blockTimer = setInterval(UpdateBlockTime, 500);
})();
