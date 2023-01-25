let myInterval;
let dataList;
let displayList;
const cityId = document.querySelector('#city0');
document.getElementById("citychange").addEventListener("change", UpdateCity);
document.getElementById("filter0").addEventListener("click",() => borderChange("filter0"));
document.getElementById("filter1").addEventListener("click", () => borderChange("filter1"));
document.getElementById("filter2").addEventListener("click", () => borderChange("filter2"));
document.getElementById("left-button").addEventListener("click", () => midSectionScroll(-285));
document.getElementById("right-button").addEventListener("click", () => midSectionScroll(285));
document.getElementById("number-box").addEventListener("change", () => cardUpdate());
(function (){ 
    dataList = cityData;
    console.log(dataList);
    var city=document.getElementById("city");
    for ( let cityDetails in dataList) {
        var option = document.createElement("OPTION");
        option.value = dataList[cityDetails].cityName;
        city.appendChild(option);}
    updateTopSection(document.getElementById("citychange").value); 
    borderChange("filter0");
    cardUpdate(); 
})();
function UpdateCity(){
  updateTopSection(document.getElementById("citychange").value);  
}
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
function updateCityImg(city){
    document.getElementById('city-logo').setAttribute("style", "background-image: url('./HTML & CSS/Icons for cities/"+ city +".svg')");
}
function fetchTime(city){
    return new Date().toLocaleString("en-US", {timeZone: dataList[city].timeZone});
}
function updateCityTime(city){
    myClock();
    clearInterval(myInterval);
    myInterval = setInterval(myClock, 1000);
    function myClock() {      
        let dateId = document.getElementById("date");
        let timeId = document.getElementById("time");
        let secId = document.getElementById("sec");
        const dateTime = fetchTime(city);
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
function myStopFunction() {
    clearInterval(myInterval);
}
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
function updateTempImg(img, temp, val){
    if(temp<18){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/rainyIcon.svg')");
    }
    else if(temp<22 && val==1){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/windyIcon.svg')");
    }
    else if(temp<29 && val==1){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/cloudyIcon.svg')");
    }
    else if(temp<20){
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/snowflakeIcon.svg')");
    }
    else{
        img.setAttribute("style", "background-image: url('./HTML & CSS/Weather Icons/sunnyIcon.svg')");
    }
}
function errFunction(){
    myStopFunction();
    var errMessage = document.getElementById("err-message");
    var citychange = document.getElementById("citychange");
    var errImgArray = document.getElementsByClassName("err-img");
    var errTextArray = document.getElementsByClassName("err-text");
    citychange.setAttribute("style","border-color: red");
    errMessage.innerText = "***Invalid City***";
    errMessage.setAttribute("style","color: red");
    for (var i = 0; i < errTextArray.length; i++) {
        errTextArray[i].innerText="NaN";
    }
    for (var i = 0; i < errImgArray.length; i++) {
    errImgArray[i].setAttribute("style", "background-image: url('./HTML & CSS/General Images & Icons/warning.svg')");
    }
}
function borderChange(filterId){
    for(let index=0; index<3; index++){
        document.getElementById("filter"+index).setAttribute("style","border-bottom-style: none");
    }
    document.getElementById(filterId).setAttribute("style","border-bottom-style: solid")
    displayListUpdate(filterId.substring(filterId.length-1,filterId.length));
    cardUpdate();
}
function cardUpdate(){
    let index = 0;
    document.getElementById("midContainer").replaceChildren();
    for(let city in dataList){
            let clone = cityId.cloneNode(true);
            clone.id='city'+index;
            document.getElementById("midContainer").appendChild(clone);
            clone.querySelector("#city-name").innerText=dataList[city].cityName;
            clone.querySelector("#card-img").setAttribute("style","background-image: url('./HTML & CSS/Icons for cities/"+ city +".svg')");
            clone.querySelector("#card-humidity").innerText=dataList[city].humidity;
            clone.querySelector("#card-precipitation").innerText=dataList[city].precipitation;
            let temperature = dataList[city].temperature;
            clone.querySelector("#card-temp").innerText=temperature;
            let tempImg = clone.querySelector("#card-temp-img");
            temperature = temperature.substring(0,temperature.length-2);
            updateTempImg(tempImg, temperature, 0);
        index++;
        if(index>document.getElementById("number-box").value-1){
            break;
        }
    }
}
function midSectionScroll(val){
    document.getElementById('midContainer').scrollLeft += val;
}

function displayListUpdate(sort){

}
