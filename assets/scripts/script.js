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
 * user enters text to search bar
 * user clicks search
 * 
 * program takes search bar text
 * validates text
 * sends request to api
 *  on errors    breaks from location search
 *  on success   gets back location data
 * 
 * program fixes data
 * passes data to request forecast
 *  on errors   
 *  on success
 *      update forecast display
 *      save data locally
 *      update search history
 * 
 * //! to minimize calls to API
 * when we call any search history item: use local data AS LONG AS first date matches today
 * 
 * I am reminded that making an array of the same object(same place in memory)
 * will just make an array all pointing to that memory and not new reference
 * 
 * 
 * Using free plan per <https://openweathermap.org/full-price#current>
 * Referring to API Doc <https://openweathermap.org/forecast5>
 * URL api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
 * Example of icon: https://openweathermap.org/img/wn/03d@2x.png
 * 
 * Limitations: query won't go higher than 40 searches
 *      Displaying todays and +5 is not feasible with current api calls
 *      Will have to drop last card and adjust spacing
 *
 * 
 * REFERENCES:
 * - tons of MDN articles
 * - tons of w3School articles
*/
// #endregion

//!start

//Debug Printer
function p(me){console.log(me);}


//#region Variable declaration
const apiKey = "&appid="  //TODO: how do I handle hidden API key
const pathGeocode="http://api.openweathermap.org/geo/1.0/direct";
const pathForecast="https://api.openweathermap.org/data/2.5/forecast";
const dateFormat = 'M/DD/YYYY';


class weatherObject {
    constructor(dt, temp, wSpd, hum, wethArr){
        this.date= dt;          //Expecting: day    -> Display: per const 'dateFormat'
        this.temperature= temp; //Expecting: number -> Default: Kelvin; Display: degFarenheit,
        this.wind = wSpd;       //Expecting: number -> Default: meter/second; Display: MPH,
        this.humidity= hum;     //Expecting: number -> Display with %
        this.weather= wethArr;  //Expecting: array
    }
}

let display = $("#display");
let cityString = "";
let locationObject = [];
let forecastObject={};
let forecastDataArr=[];

//#endregion 

//#region TestConstants
let testCity = [{"name":"San Diego","local_names":{"ko":"샌디에이고","ja":"サンディエゴ","en":"San Diego","pt":"São Diego","zh":"聖地牙哥","ar":"سان دييغو","oc":"San Diego","he":"סן דייגו","ru":"Сан-Диего","lt":"San Diegas","uk":"Сан-Дієго"},"lat":32.7174202,"lon":-117.1627728,"country":"US","state":"California"}]

const testData= {"cod":"200","message":0,"cnt":40,"list":[{"dt":1683536400,"main":{"temp":294.73,"feels_like":293.44,"temp_min":294.73,"temp_max":296.89,"pressure":1010,"sea_level":1010,"grnd_level":973,"humidity":19,"temp_kf":-2.16},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.52,"deg":261,"gust":1.89},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-08 09:00:00"},{"dt":1683547200,"main":{"temp":294.91,"feels_like":293.64,"temp_min":294.91,"temp_max":295.28,"pressure":1010,"sea_level":1010,"grnd_level":974,"humidity":19,"temp_kf":-0.37},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":0.82,"deg":278,"gust":1.32},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-08 12:00:00"},{"dt":1683558000,"main":{"temp":296.61,"feels_like":295.46,"temp_min":296.61,"temp_max":297.55,"pressure":1012,"sea_level":1012,"grnd_level":975,"humidity":17,"temp_kf":-0.94},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":0.77,"deg":76,"gust":1},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-08 15:00:00"},{"dt":1683568800,"main":{"temp":301.12,"feels_like":299.75,"temp_min":301.12,"temp_max":301.12,"pressure":1012,"sea_level":1012,"grnd_level":975,"humidity":13,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":0.89,"deg":156,"gust":2.16},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-08 18:00:00"},{"dt":1683579600,"main":{"temp":304.12,"feels_like":302.07,"temp_min":304.12,"temp_max":304.12,"pressure":1009,"sea_level":1009,"grnd_level":973,"humidity":10,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":0.8,"deg":303,"gust":3.24},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-08 21:00:00"},{"dt":1683590400,"main":{"temp":305.81,"feels_like":303.49,"temp_min":305.81,"temp_max":305.81,"pressure":1007,"sea_level":1007,"grnd_level":970,"humidity":8,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":3.24,"deg":283,"gust":4.85},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 00:00:00"},{"dt":1683601200,"main":{"temp":302.84,"feels_like":301.04,"temp_min":302.84,"temp_max":302.84,"pressure":1007,"sea_level":1007,"grnd_level":971,"humidity":11,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":5.55,"deg":266,"gust":6.24},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 03:00:00"},{"dt":1683612000,"main":{"temp":299.71,"feels_like":299.71,"temp_min":299.71,"temp_max":299.71,"pressure":1009,"sea_level":1009,"grnd_level":971,"humidity":15,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":3.99,"deg":260,"gust":7.09},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 06:00:00"},{"dt":1683622800,"main":{"temp":297.55,"feels_like":296.44,"temp_min":297.55,"temp_max":297.55,"pressure":1008,"sea_level":1008,"grnd_level":971,"humidity":15,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.16,"deg":244,"gust":3.17},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 09:00:00"},{"dt":1683633600,"main":{"temp":295.88,"feels_like":294.7,"temp_min":295.88,"temp_max":295.88,"pressure":1009,"sea_level":1009,"grnd_level":972,"humidity":19,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.45,"deg":190,"gust":2.24},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 12:00:00"},{"dt":1683644400,"main":{"temp":297.77,"feels_like":296.76,"temp_min":297.77,"temp_max":297.77,"pressure":1011,"sea_level":1011,"grnd_level":974,"humidity":18,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":1},"wind":{"speed":0.93,"deg":129,"gust":1.93},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 15:00:00"},{"dt":1683655200,"main":{"temp":301.59,"feels_like":300.1,"temp_min":301.59,"temp_max":301.59,"pressure":1010,"sea_level":1010,"grnd_level":973,"humidity":14,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":1},"wind":{"speed":1.91,"deg":214,"gust":3.24},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 18:00:00"},{"dt":1683666000,"main":{"temp":304.72,"feels_like":302.56,"temp_min":304.72,"temp_max":304.72,"pressure":1007,"sea_level":1007,"grnd_level":971,"humidity":10,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":25},"wind":{"speed":2.27,"deg":260,"gust":4.87},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 21:00:00"},{"dt":1683676800,"main":{"temp":306.05,"feels_like":303.67,"temp_min":306.05,"temp_max":306.05,"pressure":1005,"sea_level":1005,"grnd_level":968,"humidity":9,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":17},"wind":{"speed":6.71,"deg":255,"gust":7.2},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-10 00:00:00"},{"dt":1683687600,"main":{"temp":302.15,"feels_like":300.51,"temp_min":302.15,"temp_max":302.15,"pressure":1005,"sea_level":1005,"grnd_level":969,"humidity":11,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":7.38,"deg":250,"gust":9.51},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-10 03:00:00"},{"dt":1683698400,"main":{"temp":298.61,"feels_like":297.55,"temp_min":298.61,"temp_max":298.61,"pressure":1007,"sea_level":1007,"grnd_level":969,"humidity":13,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":1},"wind":{"speed":5.41,"deg":233,"gust":9.99},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-10 06:00:00"},{"dt":1683709200,"main":{"temp":294.19,"feels_like":292.87,"temp_min":294.19,"temp_max":294.19,"pressure":1007,"sea_level":1007,"grnd_level":969,"humidity":20,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":2},"wind":{"speed":4.78,"deg":225,"gust":8.05},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-10 09:00:00"},{"dt":1683720000,"main":{"temp":291.73,"feels_like":290.24,"temp_min":291.73,"temp_max":291.73,"pressure":1008,"sea_level":1008,"grnd_level":970,"humidity":23,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":1},"wind":{"speed":4.52,"deg":222,"gust":6.75},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-10 12:00:00"},{"dt":1683730800,"main":{"temp":291.21,"feels_like":289.85,"temp_min":291.21,"temp_max":291.21,"pressure":1011,"sea_level":1011,"grnd_level":973,"humidity":30,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":9},"wind":{"speed":3.63,"deg":248,"gust":3.52},"visibility":10000,"pop":0.34,"rain":{"3h":0.1},"sys":{"pod":"d"},"dt_txt":"2023-05-10 15:00:00"},{"dt":1683741600,"main":{"temp":294.75,"feels_like":293.59,"temp_min":294.75,"temp_max":294.75,"pressure":1012,"sea_level":1012,"grnd_level":974,"humidity":24,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":16},"wind":{"speed":4.01,"deg":243,"gust":4.13},"visibility":10000,"pop":0.07,"sys":{"pod":"d"},"dt_txt":"2023-05-10 18:00:00"},{"dt":1683752400,"main":{"temp":298.77,"feels_like":297.81,"temp_min":298.77,"temp_max":298.77,"pressure":1010,"sea_level":1010,"grnd_level":972,"humidity":16,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":1},"wind":{"speed":4.45,"deg":252,"gust":4.77},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-10 21:00:00"},{"dt":1683763200,"main":{"temp":299.89,"feels_like":298.89,"temp_min":299.89,"temp_max":299.89,"pressure":1008,"sea_level":1008,"grnd_level":971,"humidity":13,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":1},"wind":{"speed":4.18,"deg":257,"gust":5.01},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 00:00:00"},{"dt":1683774000,"main":{"temp":298.42,"feels_like":297.42,"temp_min":298.42,"temp_max":298.42,"pressure":1009,"sea_level":1009,"grnd_level":972,"humidity":16,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":4.89,"deg":233,"gust":6.65},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 03:00:00"},{"dt":1683784800,"main":{"temp":295.49,"feels_like":294.3,"temp_min":295.49,"temp_max":295.49,"pressure":1011,"sea_level":1011,"grnd_level":973,"humidity":20,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":5.29,"deg":252,"gust":8.77},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 06:00:00"},{"dt":1683795600,"main":{"temp":293.95,"feels_like":292.66,"temp_min":293.95,"temp_max":293.95,"pressure":1011,"sea_level":1011,"grnd_level":973,"humidity":22,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":3.3,"deg":269,"gust":5.43},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 09:00:00"},{"dt":1683806400,"main":{"temp":292.53,"feels_like":291.18,"temp_min":292.53,"temp_max":292.53,"pressure":1012,"sea_level":1012,"grnd_level":974,"humidity":25,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.18,"deg":242,"gust":2.83},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 12:00:00"},{"dt":1683817200,"main":{"temp":294.69,"feels_like":293.5,"temp_min":294.69,"temp_max":294.69,"pressure":1013,"sea_level":1013,"grnd_level":975,"humidity":23,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":0.79,"deg":229,"gust":1.05},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 15:00:00"},{"dt":1683828000,"main":{"temp":298.51,"feels_like":297.57,"temp_min":298.51,"temp_max":298.51,"pressure":1012,"sea_level":1012,"grnd_level":974,"humidity":18,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":1.54,"deg":237,"gust":1.85},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 18:00:00"},{"dt":1683838800,"main":{"temp":301.67,"feels_like":300.16,"temp_min":301.67,"temp_max":301.67,"pressure":1009,"sea_level":1009,"grnd_level":972,"humidity":14,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":1.75,"deg":297,"gust":2.06},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 21:00:00"},{"dt":1683849600,"main":{"temp":303.23,"feels_like":301.34,"temp_min":303.23,"temp_max":303.23,"pressure":1007,"sea_level":1007,"grnd_level":970,"humidity":12,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":2.38,"deg":288,"gust":2.74},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-12 00:00:00"},{"dt":1683860400,"main":{"temp":301.45,"feels_like":299.99,"temp_min":301.45,"temp_max":301.45,"pressure":1008,"sea_level":1008,"grnd_level":971,"humidity":12,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":3.85,"deg":255,"gust":3.9},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 03:00:00"},{"dt":1683871200,"main":{"temp":299.09,"feels_like":298.08,"temp_min":299.09,"temp_max":299.09,"pressure":1009,"sea_level":1009,"grnd_level":971,"humidity":13,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":3.16,"deg":282,"gust":4.91},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 06:00:00"},{"dt":1683882000,"main":{"temp":297.16,"feels_like":296.01,"temp_min":297.16,"temp_max":297.16,"pressure":1008,"sea_level":1008,"grnd_level":971,"humidity":15,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.08,"deg":287,"gust":1.78},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 09:00:00"},{"dt":1683892800,"main":{"temp":295.77,"feels_like":294.53,"temp_min":295.77,"temp_max":295.77,"pressure":1009,"sea_level":1009,"grnd_level":971,"humidity":17,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":0.58,"deg":277,"gust":0.99},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 12:00:00"},{"dt":1683903600,"main":{"temp":298.17,"feels_like":297.12,"temp_min":298.17,"temp_max":298.17,"pressure":1010,"sea_level":1010,"grnd_level":973,"humidity":15,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":2},"wind":{"speed":0.4,"deg":82,"gust":0.71},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-12 15:00:00"},{"dt":1683914400,"main":{"temp":302.09,"feels_like":300.46,"temp_min":302.09,"temp_max":302.09,"pressure":1010,"sea_level":1010,"grnd_level":973,"humidity":12,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":1},"wind":{"speed":1.09,"deg":258,"gust":1.07},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-12 18:00:00"},{"dt":1683925200,"main":{"temp":305.73,"feels_like":303.4,"temp_min":305.73,"temp_max":305.73,"pressure":1007,"sea_level":1007,"grnd_level":971,"humidity":10,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":1.75,"deg":300,"gust":1.94},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-12 21:00:00"},{"dt":1683936000,"main":{"temp":307.5,"feels_like":304.9,"temp_min":307.5,"temp_max":307.5,"pressure":1005,"sea_level":1005,"grnd_level":969,"humidity":9,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":2.05,"deg":289,"gust":2.64},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-13 00:00:00"},{"dt":1683946800,"main":{"temp":305.45,"feels_like":303.16,"temp_min":305.45,"temp_max":305.45,"pressure":1005,"sea_level":1005,"grnd_level":969,"humidity":10,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.66,"deg":235,"gust":3.48},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-13 03:00:00"},{"dt":1683957600,"main":{"temp":302.95,"feels_like":301.13,"temp_min":302.95,"temp_max":302.95,"pressure":1006,"sea_level":1006,"grnd_level":969,"humidity":12,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.51,"deg":237,"gust":4.95},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-13 06:00:00"}],"city":{"id":5308655,"name":"Phoenix","coord":{"lat":33.44,"lon":-112.07},"country":"US","population":1445632,"timezone":-25200,"sunrise":1683549219,"sunset":1683598554}}

//#endregion

//#region Basic/General Functions
function parseCoordinate(degreeNum){
    return Math.trunc((degreeNum*100))/100;
}// preserves 2 significant digits past the decimal

function saveData(key,value){ localStorage.setItem(key,value); }
function loadData(key){ localStorage.geyItem(key); }
//#endregion


//#region Search //TODO(5)
function reset(){
    cityString = "";
    locationObject = [];
    forecastObject={};
    forecastDataArr=[];
}
function getInput(){
    reset();
    let input = $("#search-box").val().trim();
    if (input){
        p(`user put in ${input}`);
        $("#search-box").val(""); //clear
        return input;
    }
} //clears trimmed input and passes value if exists  //TODO: validate input

$("#search-button").on("click", function(e){
    e.preventDefault();
    cityString= getInput();
    if (cityString){
        p("Getting location data...");
        getDirectGeocode();
        //!Do NOT put any critical function after fetch...delay cause issue
        
        p("Clearing search...")
        cityString=""; 
    }
});//Listener for button click

function getDirectGeocode(){
    let queryGeocode = `?q=${cityString}`;
    let URL = encodeURI(pathGeocode+queryGeocode+apiKey);
    p(`Attempting to connect to ${URL}`)

    fetch(URL)
        .then(function(response){
            if(response.ok){
                p(`SUCCESS - CODE ${response.status}: Returning with location data...`)
                return response.json();
            }
            else if(response.status === 401){console.error(`ERROR ${response.status}: Invalid API key; Check API key`)}
            else if(response.status === 404){console.error(`ERROR ${response.status}: Invalid location`)}
            else if(response.status === 429){console.error(`ERROR ${response.status}: API calls exceeded limit(60 apm); Try again later`)}
            else{console.error(`ERROR ${response.status}: Indeterminant anomaly; Contact support`)}
        })//Refer to https://openweathermap.org/faq#api-errors
        .then(function(data){
            locationObject = data;
        })
        .then(function(){
            console.log(locationObject);

            p("Getting forecast data for next 5 days...");
            getWeatherForecast();
        });
    //end of fetch
}// waits for API call and then assigns location object 

//! Push this to new line for testing: locationObject=testCity;
p(locationObject)

function getWeatherForecast(){
    let longitude = parseCoordinate(locationObject[0].lon);
    let latitude = parseCoordinate(locationObject[0].lat);
    p("Passing coordinates - lon:"+longitude+", lat:"+latitude);
    
    let queryForecast = `?lat=${latitude}&lon=${longitude}`;
    let queryCount="&cnt=48"
    let URL = encodeURI(pathForecast+queryForecast+queryCount+apiKey); p(URL);

    fetch(URL)
    .then(function(response){
        if(response.ok){
            p(`SUCCESS - CODE ${response.status}: Returning with forecast data...`)
            return response.json();
        }
        else if(response.status === 401){console.error(`ERROR ${response.status}: Invalid API key; Check API key`)}
        else if(response.status === 404){console.error(`ERROR ${response.status}: Invalid location`)}
        else if(response.status === 429){console.error(`ERROR ${response.status}: API calls exceeded limit(60 apm); Try again later`)}
        else{console.error(`ERROR ${response.status}: Indeterminant anomaly; Contact support`)}
    })
    .then(function(data){
        forecastObject = data;
    })
    .then(function(){
        copyData()
        saveData(locationObject[0].name, JSON.stringify(forecastDataArr))
        updateForecast(forecastDataArr);
    });
} //waits for API call and then saves and displays called data

//! Push this to new line for testing: forecastObject=testData;
p(forecastObject)

function copyData(){
    forecastDataArr=[]; //reset
    let rawDataArr = forecastObject.list;

    // data pts are given at every 3hr interval
    // this program will only use
    for (i=0;i<5;i++){
        let date = dayjs.unix(rawDataArr[i*8].dt).format(dateFormat);
        let temp = rawDataArr[i*8].main.temp;
        let wind = rawDataArr[i*8].wind.speed;
        let humidity= rawDataArr[i*8].main.humidity;
        let weather = rawDataArr[i*8].weather;
        let tempObj = new weatherObject(date, temp, wind, humidity, weather);
        forecastDataArr.push(tempObj);
    }//data from arr is given at every 3hr interval; thus why we call every 8th obj in the array to get the next days
    console.log(forecastDataArr);
}



//TODO: search history


//#endregion

//#region Display //TODO(2)

function updateCardData(cardObj, dataObj){
    let cardDataList = cardObj.children(); 
    cardDataList.eq(0).text(dataObj.date);
    cardDataList.eq(1).text(dataObj.temperature);
    cardDataList.eq(2).text(dataObj.wind);
    cardDataList.eq(3).text(dataObj.humidity);
}

function updateForecast(newDataArr){
    let currentCard ="";
    for (i=0; i<= 5; i++){
        currentCard = display.children().eq(i);
        //p(currentCard);
        updateCardData(currentCard, newDataArr[i]); 
    }
}


//copyData();
//updateForecast(forecastDataArr);

//TODO: updateCity
//TODO pass location.name -> before date on first child


//#endregion

// !end of File
