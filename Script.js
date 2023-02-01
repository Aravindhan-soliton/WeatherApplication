let myInterval;
let dataList;
let displayList;
let blockList;
let timer;
let blockTimer;
let continentSwap = 0;
let temperatureSwap = 0;
const cityId = document.querySelector('#city0');
const blockId = document.querySelector('#block0');
document.getElementById("citychange").addEventListener("change", UpdateCity);
document.getElementById("citychange").addEventListener("change", UpdateCity);
document.getElementById("filter0").addEventListener("click",() => borderChange("filter0"));
document.getElementById("filter1").addEventListener("click", () => borderChange("filter1"));
document.getElementById("filter2").addEventListener("click", () => borderChange("filter2"));
document.getElementById("left-button").addEventListener("click", () => midSectionScroll(-2.9));
document.getElementById("right-button").addEventListener("click", () => midSectionScroll(2.9));
document.getElementById("number-box").addEventListener("change", () => cardUpdate());
window.addEventListener("resize", updateScrollArrow);
document.getElementById("Continent-sort").addEventListener("click",() => UpdateBlockSort(2));
document.getElementById("Temperature-sort").addEventListener("click",() => UpdateBlockSort(1));
document.getElementById("Temperature-sort").setAttribute("style","background-image: url('HTML & CSS/General Images & Icons/arrowUp.svg')");
document.getElementById("Continent-sort").setAttribute("style","background-image: url('HTML & CSS/General Images & Icons/arrowUp.svg')");
(function (){ 
    dataList = cityData;
    displayList = cityData;
    blockList = Object.values(dataList);
    var city=document.getElementById("city");
    for ( let cityDetails in dataList) {
        var option = document.createElement("OPTION");
        option.value = dataList[cityDetails].cityName;
        city.appendChild(option);}
    updateTopSection(document.getElementById("citychange").value); 
    borderChange("filter0");
    updateBlocks();
    UpdateBlockSort(0);
    clearInterval(blockTimer);
    blockTimer = setInterval(UpdateBlockTime, 500);
})();

/**
 *Update the City details in top section.
 */
function UpdateCity(){
  updateTopSection(document.getElementById("citychange").value);  
}

/**
 *Check for the entered city in the List and Load it,
 *else call error function to show error message.
 * @param {string} city
 */
function updateTopSection(city){
    var temp=false;
    let x = city.toLowerCase(); 
    for(let cit in dataList){
        if(x==cit)
        temp=true;
    }  
    if(temp){
        var citychange = document.getElementById("citychange");
        var errMessage = document.getElementById("err-message");
        citychange.setAttribute("style","border-color: transparent");
        errMessage.innerText=" ";
        updateCityTime(x);
        updateCityImg(x);
        updateTempVal(x);
        updateNextFiveHours(x);  
    }
    else{
        errFunction();
    }
}

/**
 *Update the city logo image in the top section.
 * @param {string} city
 */
function updateCityImg(city){
    document.getElementById('city-logo').setAttribute("style", "background-image: url('./HTML & CSS/Icons for cities/"+ city +".svg')");
}

/**
 *fetch date and time for given city.
 * @param {object} city
 * @return {VarDate} date and time.
 */
function fetchTime(city){
    return new Date().toLocaleString("en-US", {timeZone: city.timeZone});
}

/**
 *Update city time in the top section.
 * @param {string} city
 */
function updateCityTime(city){
    myClock();
    myStopFunction();
    myInterval = setInterval(myClock, 1000);
    function myClock() {      
        let dateId = document.getElementById("date");
        let timeId = document.getElementById("time");
        let secId = document.getElementById("sec");
        const dateTime = fetchTime(dataList[city]);
        const date = new Date(dateTime).getDate();
        let hour = (new Date(dateTime).getHours());
        const min = new Date(dateTime).getMinutes();
        const fullDate = (date<10 ? "0"+date : date) +"-"+ new Date().toLocaleString("en-US",{month:'short'}, {timeZone: dateTime})+"-"+new Date(dateTime).getFullYear();
        if(hour<12){
            document.getElementById('ampm').setAttribute("style", "background-image: url('./HTML & CSS/General Images & Icons/amState.svg')");
          }
          else{
            document.getElementById('ampm').setAttribute("style", "background-image: url('./HTML & CSS/General Images & Icons/pmState.svg')");
          }  
        hour %= 12;
        hour = hour==0 ? 12 : hour;
        const time = (hour<10 ? "0"+hour : hour) + ":" + (min<10 ? "0"+min : min) + ":";
        let sec =new Date(dateTime).getSeconds();
        sec = (sec<10 ? "0"+sec : sec);
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
function updateTempVal(city){
    let tempC = document.getElementById("tempC");
    let tempF = document.getElementById("tempF");
    let humidity = document.getElementById("humidity");
    let precipitation = document.getElementById("precipitation");
    let cIndex = dataList[city].temperature.indexOf("C");
    let cVal = dataList[city].temperature.substring(0,cIndex-1);
    tempC.innerText =  cVal + " C";
    let fVal =  ( cVal * 9 / 5) + 32 ;
    tempF.innerText = Math.round(fVal) + " F";
    humidity.innerText = dataList[city].humidity.substring(0, dataList[city].humidity.length-1);
    precipitation.innerText = dataList[city].precipitation.substring(0, dataList[city].precipitation.length-1); 
}

/**
 *Update Next five hours weather details in the top section.
 * @param {string} city
 */
function updateNextFiveHours(city){
    document.getElementById("now").innerText="Now";
    document.getElementById("Hour0").innerText = dataList[city].temperature.substring(0, dataList[city].temperature.length-2);
    for(let index=1; index<=6; index++)
    {
        if(index<6){
            updateTime(document.getElementById("Time"+index), city, index);
        }
        if(index<5){
        document.getElementById("Hour"+(index)).innerText = dataList[city].nextFiveHrs[index-1].substring(0, dataList[city].nextFiveHrs[index-1].length-2);
        }
        else{
            document.getElementById("Hour5").innerText = document.getElementById("Hour4").innerText;
        }
        updateTempImg(document.getElementById('Img'+(index-1)), document.getElementById("Hour"+(index-1)).innerText, 1);
    }
}

/**
 *Update Next five hours hour values.
 * @param {id} timeUpdate
 * @param {object} city
 * @param {int} hourAdd
 */
function updateTime(timeUpdate, city, hourAdd){
    const time = fetchTime(city);
    let hour = (new Date(time).getHours());
    const ampm = (hour<12) ? "AM" : "PM";
    hour = hour + hourAdd
    hour = hour % 12;
    hour = hour==0 ? 12 : hour;
    hour = hour<10 ? "0"+hour : hour; 
    timeUpdate.innerText = hour+ampm;
}

/**
 *Update Next five hours images.
 * @param {string} img
 * @param {int} temp
 * @param {int} val
 */
function updateTempImg(img, temp, val){
    if(temp<19){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/rainyIcon.svg')");
    }
    else if(temp<22 && val==1){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/windyIcon.svg')");
    }
    else if(temp<29 && val==1){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/cloudyIcon.svg')");
    }
    else if(temp<28){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/snowflakeIcon.svg')");
    }
    else{
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/sunnyIcon.svg')");
    }
}

/**
 *shows err message if the given city is not available.
 */
function errFunction(){
    myStopFunction();
    let errMessage = document.getElementById("err-message");
    let citychange = document.getElementById("citychange");
    let errImgArray = document.getElementsByClassName("err-img");
    let errTextArray = document.getElementsByClassName("err-text");
    citychange.setAttribute("style","border-color: red");
    errMessage.innerText = "***Invalid City***";
    errMessage.setAttribute("style","color: red");
    for (let i = 0; i < errTextArray.length; i++) {
        errTextArray[i].innerText="NaN";
    }
    for (let i = 0; i < errImgArray.length; i++) {
    errImgArray[i].setAttribute("style", "background-image: url('./HTML & CSS/General Images & Icons/warning.svg')");
    }
}

/**
 *Sort the mid mection based on weather .
 * @param {*} filterId
 */
function borderChange(filterId){
    for(let index=0; index<3; index++){
        document.getElementById("filter"+index).setAttribute("style","border-bottom-style: none");
    }
    document.getElementById(filterId).setAttribute("style","border-bottom-style: solid")
    displayListUpdate(filterId.substring(filterId.length-1,filterId.length));
    cardUpdate();
    clearInterval(timer);
    timer = setInterval(UpdateCardDateTime, 500);
}

/**
 *Create cards in mid section based on the cities in displaylist.
 */
function cardUpdate(){
    let index = 0;
    clearInterval(timer);
    document.getElementById("mid-container").replaceChildren();
    for(let city in displayList){
            let clone = cityId.cloneNode(true);
            clone.id='city'+index;
            document.getElementById("mid-container").appendChild(clone);
            clone.querySelector("#city-name").innerText=displayList[city].cityName;
            clone.querySelector("#card-img").setAttribute("style","background-image: url('./HTML & CSS/Icons for cities/"+ displayList[city].cityName.toLowerCase() +".svg')");
            clone.querySelector("#card-humidity").innerText=displayList[city].humidity;
            clone.querySelector("#card-precipitation").innerText=displayList[city].precipitation;
            clone.querySelector("#card-date").id="card-date"+index;
            clone.querySelector("#card-time").id="card-time"+index;
            updateCardDate(displayList[city].cityName.toLowerCase(),"card-date"+index);
            updateCardTime(displayList[city].cityName.toLowerCase(),"card-time"+index);
            let temperature = displayList[city].temperature;
            clone.querySelector("#card-temp").innerText=temperature;
            let tempImg = clone.querySelector("#card-temp-img");
            temperature = temperature.substring(0,temperature.length-2);
            updateTempImg(tempImg, temperature, 0);
        index++;
        if(index>document.getElementById("number-box").value-1){
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 *function to control smooth scroll in mid section.
 * @param {*} val
 */
async function midSectionScroll(val){
    let temp=7;
    if(val<0)
    temp=1;
    for(let i=0; i<100; i++){
        await sleep(4);
        if(i%temp==0)
        document.getElementById('mid-container').scrollLeft += val; 
        else
        document.getElementById('mid-container').scrollLeft += (val>0)?val+0.1:-1; 
    }
}


/**
 *Update displayList based on the weather Selected in mid section.
 * @param {int} sort
 */
function displayListUpdate(sort){
    if(sort==2){
        displayList = Object.values(dataList).filter(
            (city) =>
            Number(city.temperature.split("°C")[0]) < 20
            );
            displayList.sort(
            (a, b) => a.humidity.split("%")[0] - b.humidity.split("%")[0]
            );
            displayList.reverse();
    }
    else if(sort == 1){
        displayList = Object.values(dataList).filter(
            (city) =>
            Number(city.temperature.split("°C")[0]) > 19 &&
            Number(city.temperature.split("°C")[0]) < 28
            );
            displayList.sort(
            (a, b) => a.precipitation.split("%")[0] - b.precipitation.split("%")[0]
            );
            displayList.reverse();
    }
    else{
        displayList = Object.values(dataList).filter(
            (city) =>
            Number(city.temperature.split("°C")[0]) > 29  
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
function UpdateCardDateTime(){
    let numBoxValue = document.getElementById("number-box").value;
    let index = 0;
    for(let city in displayList){
        try{
        updateCardDate(displayList[city], "card-date"+index);
        document.getElementById("card-time"+index).innerText=   updateCardTime(displayList[city], "card-time"+index);
        }
        catch{          
        }
        if(index>=parseInt(numBoxValue)-1)
        break;
        index++;
    }
}

/**
 *Updates Live time in displayed cards in mid section.
 * @param {object} city
 * @param {id} timeId
 * @return {*} time
 */

function updateCardTime(city){
    let dateTime = fetchTime(city);
    let hour = (new Date(dateTime).getHours());
    let min = new Date(dateTime).getMinutes();
    const ampm = (hour<12) ? "AM" : "PM";
    hour = hour % 12;
    hour = hour==0 ? 12 : hour;
    hour = hour<10 ? "0"+hour : hour; 
    min = min<10 ? "0"+min : min; 
    return hour+":"+min+" "+ampm;
}

/**
 *Updates Live date in displayed cards in mid section.
 * @param {object} city
 * @param {id} dateId
 */
function updateCardDate(city, dateId){
    let dateTime = fetchTime(city);
    const date = new Date(dateTime).getDate();
    document.getElementById(dateId).innerText=(date<10 ? "0"+date : date) +"-"+ new Date().toLocaleString( "en-US",{month:'short'}, {timeZone: dateTime})+ "-"+new Date(dateTime).getFullYear();
}

/**
 *Updates Visibility of scroll arrows and alignment of cards in mid section.
 */
function updateScrollArrow(){
    let divWidth = document.getElementById("card-div").clientWidth;
    let displayCount = displayList.length;
    let numberBoxCount = document.getElementById("number-box").value;
    let count = displayCount<numberBoxCount? displayCount:numberBoxCount;
    if(divWidth < count*280+20){
        document.getElementById("mid-container").setAttribute("style","justify-content: none");
        document.getElementById("arrow-div1").setAttribute("style","display:flex");
        document.getElementById("arrow-div2").setAttribute("style","display:flex");
    }
    else{
        document.getElementById("mid-container").setAttribute("style","justify-content: center");
        document.getElementById("arrow-div1").setAttribute("style","display:none");
        document.getElementById("arrow-div2").setAttribute("style","display:none");
    }
}

/**
 *Update bottom section by creating blocks based on the city list.
 */
function updateBlocks(){
    let index = 0;
    clearInterval(blockTimer);
    document.getElementById("blocks").replaceChildren();
    for(let city in blockList){
        let clone = blockId.cloneNode(true);
        clone.id='block'+index;
        document.getElementById("blocks").appendChild(clone);
        let timeZone = blockList[city].timeZone;
        clone.querySelector("#city-time").id="city-time"+index;
        clone.querySelector("#continent-name").innerText=timeZone.substring(0,timeZone.indexOf('/'));
        clone.querySelector("#block-temp").innerText=blockList[city].temperature;
        clone.querySelector("#block-humidity").innerText=blockList[city].humidity;
        document.getElementById("city-time"+index).innerText=blockList[city].cityName+", "+updateCardTime(blockList[city]);
        if(index==11)
            break;
        index++;
    }
}
/**
 *Update block time for every minute.
 */
 function UpdateBlockTime(){
    let index = 0;
    for(let city in blockList){
        document.getElementById("city-time"+index).innerText=blockList[city].cityName+", "+updateCardTime(blockList[city]);
        if(index==11)
            break;
        index++;
    }
}
