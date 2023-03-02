let cityObj;
let midSectionObj;
let footSectionObj;
let myInterval;
let weatherListInterval;
let weatherListInterval;
let dataList;
let displayList;
let blockList;
let timer;
let blockTimer;
let continentSwap = 0;
let temperatureSwap = 0;
let totalDetails;
let nextFiveHrs;
const cityId = document.querySelector("#city0");
const blockId = document.querySelector("#block0");
document.querySelector("#citychange").addEventListener("change", UpdateCity);
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
  .addEventListener("change", () => numberBoxUpdate());
window.addEventListener("resize", updateScrollArrow);
document
  .getElementById("Continent-sort")
  .addEventListener("click", () => UpdateBlockSort(2));
document
  .getElementById("Temperature-sort")
  .addEventListener("click", () => UpdateBlockSort(1));
document
  .getElementById("Temperature-sort")
  .setAttribute("style", "background-image: url('assets/arrowUp.svg')");
document
  .getElementById("Continent-sort")
  .setAttribute("style", "background-image: url('assets/arrowUp.svg')");
/**
 *prototype function for top section.
 */
class cityFunction {
  constructor(city) {
    this.cityName = city.cityName;
    this.dateAndTime = city.dateAndTime;
    this.timeZone = city.timeZone;
    this.temperature = city.temperature;
    this.humidity = city.humidity;
    this.precipitation = city.precipitation;
  }
  // Get values operation performed for all the needed fieldscity
  getCityName() {
    return this.cityName;
  }
  getDateAndTime() {
    return this.dateAndTime;
  }
  getTimeZone() {
    return this.timeZone;
  }
  getTemperature() {
    return this.temperature;
  }
  getHumidity() {
    return this.humidity;
  }
  getPrecipitation() {
    return this.precipitation;
  }
  getNextFiveHrs(index) {
    return nextFiveHrs[index];
  }
  fetchTime(cityTimeZone) {
    return new Date().toLocaleString("en-US", { timeZone: cityTimeZone });
  }
}

/**
 *prototype function for mid section.
 */
class midSection extends cityFunction {
  constructor(city) {
    super(city);
  }
  /**
   *Updates Live time in displayed cards in mid section.
   * @param {object} city
   * @param {id} timeId
   * @return {*} time
   */
  updateCardTime(city) {
    let dateTime = cityFunction.prototype.fetchTime(city.timeZone);
    let hour = new Date(dateTime).getHours();
    let min = new Date(dateTime).getMinutes();
    const ampm = hour < 12 ? "AM" : "PM";
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    return hour + ":" + min + " " + ampm;
  }
}

/**
 *prototype function for foot section.
 */
class footSection extends midSection {
  constructor(city) {
    super(city);
  }
}

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
    errTextArray[i].innerText = "NiL";
  }
  for (let i = 0; i < errImgArray.length; i++) {
    errImgArray[i].setAttribute(
      "style",
      "background-image: url('./assets/warning.svg')"
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
async function updateTopSection(city) {
  let temp = false;
  let cityIndex;
  for (let cit in dataList) {
    if (city.toLowerCase() === dataList[cit].cityName.toLowerCase()) {
        temp = true;
        cityIndex = cit;
        cityObj = new cityFunction(dataList[cityIndex]);
        cityObj = new cityFunction(dataList[cityIndex]);
        break;
    }
  }
  if (temp) {
    await getNextFiveHours(city);
    await getNextFiveHours(city);
    var citychange = document.getElementById("citychange");
    var errMessage = document.getElementById("err-message");
    citychange.setAttribute("style", "border-color: transparent");
    errMessage.innerText = " ";
    updateCityImg(cityObj);
    updateCityTime(cityObj);
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
      "background-image: url('./assets/" +
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
        .setAttribute("style", "background-image: url('./assets/amState.svg')");
    } else {
      document
        .getElementById("ampm")
        .setAttribute("style", "background-image: url('./assets/pmState.svg')");
    }
    hour %= 12;
    hour = hour === 0 ? 12 : hour;
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
      document.getElementById("Hour" + index).innerText = city
        .getNextFiveHrs(index - 1)
        .split("°C")[0];
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
  console.log("ddddddddd   ", hour);
  hour = hour + hourAdd;
  let ampm = hour < 12 ? "AM" : (hour < 24 ?  "PM": "AM");
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;
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
      "background-image: url('./assets/rainyIcon.svg')"
    );
  } else if (temp < 22 && val === 1) {
    img.setAttribute(
      "style",
      "background-image: url('./assets/windyIcon.svg')"
    );
  } else if (temp < 29 && val === 1) {
    img.setAttribute(
      "style",
      "background-image: url('./assets/cloudyIcon.svg')"
    );
  } else if (temp < 28) {
    img.setAttribute(
      "style",
      "background-image: url('./assets/snowflakeIcon.svg')"
    );
  } else {
    img.setAttribute(
      "style",
      "background-image: url('./assets/sunnyIcon.svg')"
    );
  }
}

/**
 *Sort the mid mection based on weather .
 * @param {*} filterId
 */
function borderChange(filterId) {
  for (let index = 0; index < 3; index++) {
    document
      .getElementById("filter" + index)
      .setAttribute("style", "border-bottom-style: none");
  }
  document
    .getElementById(filterId)
    .setAttribute("style", "border-bottom-style: solid");
  displayListUpdate(parseInt(filterId.substring(filterId.length - 1, filterId.length)));
  cardUpdate();
  clearInterval(timer);
  timer = setInterval(UpdateCardDateTime, 100);
}
function numberBoxUpdate() {
  cardUpdate();
  clearInterval(timer);
  timer = setInterval(UpdateCardDateTime, 100);
}

/**
 *Create cards in mid section based on the cities in displaylist.
 */
function cardUpdate() {
  let index = 0;
  clearInterval(timer);
  document.getElementById("mid-container").replaceChildren();
  for (let city in displayList) {
    midSectionObj = new midSection(displayList[city]);
    let clone = cityId.cloneNode(true);
    clone.id = "city" + index;
    document.getElementById("mid-container").appendChild(clone);
    clone.querySelector("#city-name").innerText = midSectionObj.getCityName();
    clone
      .querySelector("#card-img")
      .setAttribute(
        "style",
        "background-image: url('./assets/" +
          midSectionObj.getCityName().toLowerCase() +
          ".svg')"
      );
    clone.querySelector("#card-humidity").innerText =
      midSectionObj.getHumidity();
    clone.querySelector("#card-precipitation").innerText =
      midSectionObj.getPrecipitation();
    clone.querySelector("#card-date").id = "card-date" + index;
    clone.querySelector("#card-time").id = "card-time" + index;
    updateCardDate(
      midSectionObj.getCityName().toLowerCase(),
      "card-date" + index
    );
    midSectionObj.updateCardTime(midSectionObj.getCityName().toLowerCase());
    let temperature = midSectionObj.getTemperature();
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
    if (i % temp === 0)
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
  if (sort === 2) {
    displayList = Object.values(dataList).filter(
      (city) => Number(city.temperature.split("°C")[0]) < 20
    );
    displayList.sort(
      (a, b) => a.humidity.split("%")[0] - b.humidity.split("%")[0]
    );
    displayList.reverse();
  } else if (sort === 1) {
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
      updateCardDate(displayList[city], "card-date" + index);
      document.getElementById("card-time" + index).innerText =
        midSectionObj.updateCardTime(displayList[city], "card-time" + index);
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
  let dateTime = midSectionObj.fetchTime(city.timeZone);
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

/**
 *Update bottom section by creating blocks based on the city list.
 */
function updateBlocks() {
  let index = 0;
  clearInterval(blockTimer);
  document.getElementById("blocks").replaceChildren();
  for (let city in blockList) {
    footSectionObj = new footSection(blockList[city]);
    let clone = blockId.cloneNode(true);
    clone.id = "block" + index;
    document.getElementById("blocks").appendChild(clone);
    let timeZone = footSectionObj.getTimeZone();
    clone.querySelector("#city-time").id = "city-time" + index;
    clone.querySelector("#continent-name").innerText = timeZone.substring(
      0,
      timeZone.indexOf("/")
    );
    clone.querySelector("#block-temp").innerText =
      footSectionObj.getTemperature();
    clone.querySelector("#block-humidity").innerText =
      footSectionObj.getHumidity();
    clone.querySelector("#city-name").innerText =
      footSectionObj.getCityName() + ",";
    document.getElementById("city-time" + index).innerText =
      footSectionObj.updateCardTime(blockList[city]);
    if (index === 11) break;
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
      footSectionObj.updateCardTime(blockList[city]);
    if (index === 11) break;
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
  if (val === 1) {
    if (temperatureSwap === 0) {
      document
        .getElementById("Temperature-sort")
        .setAttribute("style", "background-image: url('assets/arrowDown.svg')");
      temperatureSwap = 1;
    } else {
      document
        .getElementById("Temperature-sort")
        .setAttribute("style", "background-image: url('assets/arrowUp.svg')");
      temperatureSwap = 0;
    }
  } else if (val === 2) {
    if (continentSwap === 0) {
      document
        .getElementById("Continent-sort")
        .setAttribute("style", "background-image: url('assets/arrowDown.svg')");
      continentSwap = 1;
    } else {
      document
        .getElementById("Continent-sort")
        .setAttribute("style", "background-image: url('assets/arrowUp.svg')");
      continentSwap = 0;
    }
  }
  if (continentSwap === 1) {
    if (temperatureSwap === 0) {
      UpdateBlockSortTemperature();
      blockList.reverse();
    }
    UpdateBlockSortContinent();
    blockList.reverse();
  } else if (temperatureSwap === 1 && continentSwap === 0) {
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
  );
  updateBlocks();
}

/**
 *Async Await function to perform step by step operation
 */
const asyncAwait = async () => {
  await getTotalCityDetails();
  dataList = totalDetails;
  displayList = totalDetails;
  blockList = totalDetails;
  console.log(dataList);
  city.innerHTML = "";
  for (let cityDetails in dataList) {
    let option = document.createElement("OPTION");
    option.value = dataList[cityDetails].cityName;
    city.appendChild(option);
  }
  updateTopSection("London");
  borderChange("filter0");
  updateBlocks();
  UpdateBlockSort(0);
  clearInterval(blockTimer);
  blockTimer = setInterval(UpdateBlockTime, 500);
};

(function () {
  asyncAwait();
  clearInterval(weatherListInterval);
  weatherListInterval = setInterval(asyncAwait, 3600000);
  asyncAwait();
  clearInterval(weatherListInterval);
  weatherListInterval = setInterval(asyncAwait, 3600000);
})();
