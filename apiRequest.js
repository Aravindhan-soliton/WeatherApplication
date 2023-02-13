let cityTimeData;

/**
 *return all cities timezone

 */
const getTotalCityDetails = async () => {
    await fetch("https://soliton.glitch.me/all-timezone-cities")
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        totalDetails = responseData;
      });
  };

  var requestOptions1 = {
    method: 'GET',
    redirect: 'follow'
  };

/**
 *gives raw value body
 * @param {string} city
 */
const getNextFiveHoursCity = async (city) => {
  await fetch("https://soliton.glitch.me?city="+city, requestOptions1)
    .then(response => response.json())
    .then(result => {cityTimeData = result;
        console.log(cityTimeData);
    })
    .catch(error => console.log('error', error));
}

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
    hours: 6
    };
  raw.city_Date_Time_Name = cityTimeData.city_Date_Time_Name;
  raw = JSON.stringify(raw);
  console.log(raw);
  var requestOptions2 = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  await fetch("https://soliton.glitch.me/hourly-forecast", requestOptions2)
    .then(response => response.json())
    .then(result => {
        console.log(requestOptions2.body);
        nextFiveHrs = result;
    })
    .catch(error => console.log('error', error));
}