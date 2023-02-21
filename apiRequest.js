let cityTimeData;

/**
 *return all cities timezone
 */
const getTotalCityDetails = async () => {
  await fetch("http://127.0.0.1:8000/all-timezone-cities")
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      totalDetails = responseData;
    })
    .catch((error) => {
      if(confirm("Error while fetching data, click ok to reload the page... ", error) == true)
       location.reload();
    });
};

var requestOptions1 = {
  method: "GET",
  redirect: "follow",
};

/**
 *gives raw value body
 * @param {string} city
 */
const getNextFiveHoursCity = async (city) => {
  await fetch("http://127.0.0.1:8000?city=" + city, requestOptions1)
    .then((response) => response.json())
    .then((result) => {
      cityTimeData = result;
    })
    .catch((error) => {
      if(confirm("Error while fetching data, click ok to reload the page... ", error) == true)
      location.reload();
    });
};

/**
 *gives city's next five hour weather
 * @param {string} city
 */
const getNextFiveHours = async (city) => {
  await getNextFiveHoursCity(city);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = {
    city_Date_Time_Name: "7/19/2021, 3:48:49 AM, Nome",
    hours: 6,
  };
  raw.city_Date_Time_Name = cityTimeData.city_Date_Time_Name;
  raw = JSON.stringify(raw);
  var requestOptions2 = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  await fetch("http://127.0.0.1:8000/hourly-forecast", requestOptions2)
    .then((response) => response.json())
    .then((result) => {
      nextFiveHrs = result.temperature;
    })
    .catch((error) => {
      if(confirm("Error while fetching data, click ok to reload the page... ", error) == true)
      location.reload();
      nextFiveHrs = ["nil","nil","nil","nil","nil"];
    });
};
