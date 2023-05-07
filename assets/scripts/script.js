// #region METACODE
// Author: Dustin Bonilla
// Project Name: 
// Acitve APIs: https://openweathermap.org/forecast5

/*      USER STORY
 *_______________________________________________________________________________
 * :: A traveler
 * 
 * I WANT TO
 * - to see the weather outlook for multiple cities
 * SO THAT
 * - I can plan a trip accordingly
 *  
*/

/*      ACCEPTANCE CRITERIA
 *_______________________________________________________________________________
 * .: a weather dashboard with form inputs
 * 
 * @ search for a city //TODO(2)
 *  >  presented w/ current and future conditions for that city
 *  >  that city is added to the search history
 * 
 * @ view CURRENT weather conditions for that city //TODO(1)
 *  >  presented w/
 *  >>  city name
 *  >>  date
 *  >>  icon representation of weather conditions
 *  >>  temperature
 *  >>  humidity
 *  >>  wind speed
 * 
 * @ view !FUTURE weather conditions for that city //TODO(1)
 *  >  presented w/ a 5-day forecast that displays 
 *  >>  date
 *  >>  icon representation of weather conditions
 *  >>  temperature
 *  >> wind speed
 *  >>  humidity
 *
 * @ click on a city in the search history //TODO(1)
 *  >  again presented w/ current and future conditions for that city
 * 
*/

/*      MOCK UP NOTES
 *_______________________________________________________________________________
 * 
 * 
*/

/*      OTHER NOTES
 *      GENERAL FLOW OF SITES
 *_______________________________________________________________________________
 * 
 * 
*/
// #endregion

//!start

//Debug Printer
function p(me){console.log(me);}

p(typeof(dayjs().format('M/DD/YYYY')))

//#region Variable declaration
let weatherObj = {
    "date": "",
    "temperature": "",  //def: Kelvin; metric: C; imp: F
    "wind": "",         //def: metre/sec; metric: metre/sec; imp: miles/hour //.wind_speed
    "humidity": "",     //display as %
    "icon": "",         //weather.icon
}
let cityStr = "";
let forecastArr=[]

//#endregion 

//#region Placeholder
let testObj = {
    "date": dayjs().format('M/DD/YYYY'),
    "temperature": 282.21,
    "wind": 8.75,
    "humidity": 65,
    "icon": "03d", //https://openweathermap.org/img/wn/03d@2x.png
}
let testerArr=[];
for (i=0;i<=5;i++){
    testerArr.push(testObj);
}
//#endregion


//#region General HTML functions

//#endregion

//#region Search //TODO(2)

// recieve input from user
    // geting city
    // what kind of metric used
// check api for valid




//! ready document before call api

//#endregion

//#region Display //TODO(1)
let display = $("#display");p(display);
//let currentCard= display.children().eq(0)

function updateCardData(cardObj, dataObj){
    let cardDataList = cardObj.children();  // 
    cardDataList.eq(0).text(dataObj.date);
    cardDataList.eq(1).text(dataObj.temperature);
    cardDataList.eq(2).text(dataObj.wind);
    cardDataList.eq(3).text(dataObj.humidity);
    p(cardDataList);
} // 

function updateForecast(){
    let currentCard ="";
    for (i=0; i<= 5; i++){
        currentCard = display.children().eq(i);
        p(currentCard);
        updateCardData(currentCard, testerArr[i]); 
    }
} //TODO: change from testerArr to actual


updateForecast();

//updateData(currentCard,testObj);


//updateCity




//function get(){}



//#endregion

// !end of File
