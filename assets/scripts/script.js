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


//#region Variable declaration
let weatherObj = {
    "date": "",
    "temperature": "",  //def: Kelvin; metric: C; imp: F
    "wind": "",         //def: metre/sec; metric: metre/sec; imp: miles/hour //.wind_speed
    "humidity": "",     //display as %
    "icon": "",         //weather.icon
}
let cityString = "";
let forecastArr=[]
const dateFormat = 'M/DD/YYYY';
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

//#region Search //TODO(2)



function getInput(){
    let input = $("#search-box").val().trim();
    if (input){
        p(`user put in ${input}`);
        $("#search-box").val(""); //clear
        return input;
    }
} //clears trimmed input and passes value if exists



$("#search-button").on("click", function(e){
    e.preventDefault();
    cityString= getInput();


});//search button


const pathGeocode="http://api.openweathermap.org/geo/1.0/direct?q="
let queryGeocode="SanDiego"
let apiKey = "&appid="
//hidden api key

function getDirectGeocode(){
    let URL = pathGeocode+queryGeocode+apiKey;
    p(`Attempting to connect to ${URL}`)

    fetch(URL)
        .then(function(response){
            if(response.ok){
                return response.json();
            }
            else if(response.status === 401){console.error(`ERROR ${response.status}: Invalid API key; Check API key`)} //refer to https://openweathermap.org/faq#error401
            else if(response.status === 404){console.error(`ERROR ${response.status}: Invalid location`)}
            else if(response.status === 429){console.error(`ERROR ${response.status}: API calls exceeded limit(60 apm); Try again later`)}
            else{console.error(`ERROR ${response.status}: Indeterminant anomaly; Contact support`)}
            
        })
        .then(function(data){
            return data;
        });
    //end of fetch
}

locationObject=getDirectGeocode();
p(locationObject)

let testCity = [{"name":"San Diego","local_names":{"ko":"샌디에이고","ja":"サンディエゴ","en":"San Diego","pt":"São Diego","zh":"聖地牙哥","ar":"سان دييغو","oc":"San Diego","he":"סן דייגו","ru":"Сан-Диего","lt":"San Diegas","uk":"Сан-Дієго"},"lat":32.7174202,"lon":-117.1627728,"country":"US","state":"California"}]
p(testCity[0].name)
p(testCity[0].lat+"," + testCity[0].lon)

const privateAPI="";//do not share here
const baseURL="https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon={lon}&exclude={part}&appid={API key}"



//search history



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
}

function updateForecast(){
    let currentCard ="";
    for (i=0; i<= 5; i++){
        currentCard = display.children().eq(i);
        p(currentCard);
        updateCardData(currentCard, testerArr[i]); 
    }
} //TODO: change from testerArr to actual

updateForecast();




//TODO:updateCity



//#endregion

// !end of File
