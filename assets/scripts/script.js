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
 * 
 * 
 * 
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

//#region Placeholder
let testObj = {
    "date": dayjs().format('M/DD/YYYY'),
    "temperature": 282.21,
    "wind": 8.75,
    "humidity": 65,
    "icon": "03d", 
}
let testerArr=[];
for (i=0;i<=5;i++){
    testerArr.push(testObj);
}
//#endregion

//#region TestConstants
let testCity = [{"name":"San Diego","local_names":{"ko":"샌디에이고","ja":"サンディエゴ","en":"San Diego","pt":"São Diego","zh":"聖地牙哥","ar":"سان دييغو","oc":"San Diego","he":"סן דייגו","ru":"Сан-Диего","lt":"San Diegas","uk":"Сан-Дієго"},"lat":32.7174202,"lon":-117.1627728,"country":"US","state":"California"}]

const testData= {"cod":"200","message":0,"cnt":40,"list":[{"dt":1683493200,"main":{"temp":293.66,"feels_like":293.25,"temp_min":291.72,"temp_max":293.66,"pressure":1019,"sea_level":1019,"grnd_level":1017,"humidity":57,"temp_kf":1.94},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":20},"wind":{"speed":5.58,"deg":289,"gust":5.27},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-07 21:00:00"},{"dt":1683504000,"main":{"temp":292.86,"feels_like":292.45,"temp_min":291.26,"temp_max":292.86,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":60,"temp_kf":1.6},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":18},"wind":{"speed":5.47,"deg":295,"gust":5.41},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-08 00:00:00"},{"dt":1683514800,"main":{"temp":291.1,"feels_like":290.7,"temp_min":289.82,"temp_max":291.1,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":67,"temp_kf":1.28},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":7},"wind":{"speed":3.75,"deg":313,"gust":4.27},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-08 03:00:00"},{"dt":1683525600,"main":{"temp":289.18,"feels_like":288.72,"temp_min":289.18,"temp_max":289.18,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":72,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":3.15,"deg":324,"gust":3.54},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-08 06:00:00"},{"dt":1683536400,"main":{"temp":288.57,"feels_like":288.07,"temp_min":288.57,"temp_max":288.57,"pressure":1017,"sea_level":1017,"grnd_level":1016,"humidity":73,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.22,"deg":314,"gust":2.54},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-08 09:00:00"},{"dt":1683547200,"main":{"temp":288.02,"feels_like":287.6,"temp_min":288.02,"temp_max":288.02,"pressure":1017,"sea_level":1017,"grnd_level":1016,"humidity":78,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.94,"deg":314,"gust":2.17},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-08 12:00:00"},{"dt":1683558000,"main":{"temp":288.73,"feels_like":288.28,"temp_min":288.73,"temp_max":288.73,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":74,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":10},"wind":{"speed":2.32,"deg":296,"gust":2.07},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-08 15:00:00"},{"dt":1683568800,"main":{"temp":290.52,"feels_like":289.98,"temp_min":290.52,"temp_max":290.52,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":64,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":12},"wind":{"speed":3.56,"deg":249,"gust":2.72},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-08 18:00:00"},{"dt":1683579600,"main":{"temp":291.63,"feels_like":291.18,"temp_min":291.63,"temp_max":291.63,"pressure":1016,"sea_level":1016,"grnd_level":1016,"humidity":63,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":2},"wind":{"speed":4.25,"deg":254,"gust":3.48},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-08 21:00:00"},{"dt":1683590400,"main":{"temp":291.22,"feels_like":290.83,"temp_min":291.22,"temp_max":291.22,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":67,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":6},"wind":{"speed":4.58,"deg":279,"gust":4.6},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 00:00:00"},{"dt":1683601200,"main":{"temp":289.73,"feels_like":289.3,"temp_min":289.73,"temp_max":289.73,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":71,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":4},"wind":{"speed":3.28,"deg":292,"gust":3.28},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 03:00:00"},{"dt":1683612000,"main":{"temp":288.93,"feels_like":288.52,"temp_min":288.93,"temp_max":288.93,"pressure":1016,"sea_level":1016,"grnd_level":1016,"humidity":75,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":2},"wind":{"speed":2.95,"deg":291,"gust":3.16},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 06:00:00"},{"dt":1683622800,"main":{"temp":288.3,"feels_like":287.93,"temp_min":288.3,"temp_max":288.3,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":79,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.43,"deg":277,"gust":3.05},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 09:00:00"},{"dt":1683633600,"main":{"temp":287.76,"feels_like":287.39,"temp_min":287.76,"temp_max":287.76,"pressure":1015,"sea_level":1015,"grnd_level":1015,"humidity":81,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":7},"wind":{"speed":2.15,"deg":295,"gust":2.72},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-09 12:00:00"},{"dt":1683644400,"main":{"temp":288.59,"feels_like":288.07,"temp_min":288.59,"temp_max":288.59,"pressure":1017,"sea_level":1017,"grnd_level":1016,"humidity":72,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":36},"wind":{"speed":2.76,"deg":260,"gust":3.14},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 15:00:00"},{"dt":1683655200,"main":{"temp":290.37,"feels_like":289.71,"temp_min":290.37,"temp_max":290.37,"pressure":1017,"sea_level":1017,"grnd_level":1016,"humidity":60,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":23},"wind":{"speed":4.31,"deg":260,"gust":4.22},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 18:00:00"},{"dt":1683666000,"main":{"temp":290.74,"feels_like":290.04,"temp_min":290.74,"temp_max":290.74,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":57,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":27},"wind":{"speed":5.55,"deg":269,"gust":5.32},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-09 21:00:00"},{"dt":1683676800,"main":{"temp":289.88,"feels_like":289.18,"temp_min":289.88,"temp_max":289.88,"pressure":1015,"sea_level":1015,"grnd_level":1014,"humidity":60,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":19},"wind":{"speed":5.7,"deg":278,"gust":5.71},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-10 00:00:00"},{"dt":1683687600,"main":{"temp":288.4,"feels_like":287.7,"temp_min":288.4,"temp_max":288.4,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":66,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":4},"wind":{"speed":4.93,"deg":288,"gust":5.96},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-10 03:00:00"},{"dt":1683698400,"main":{"temp":287.86,"feels_like":287.16,"temp_min":287.86,"temp_max":287.86,"pressure":1016,"sea_level":1016,"grnd_level":1016,"humidity":68,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":17},"wind":{"speed":5.31,"deg":274,"gust":5.96},"visibility":10000,"pop":0.2,"rain":{"3h":0.13},"sys":{"pod":"n"},"dt_txt":"2023-05-10 06:00:00"},{"dt":1683709200,"main":{"temp":287.67,"feels_like":286.77,"temp_min":287.67,"temp_max":287.67,"pressure":1015,"sea_level":1015,"grnd_level":1015,"humidity":61,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":98},"wind":{"speed":5.41,"deg":279,"gust":6.04},"visibility":10000,"pop":0.31,"rain":{"3h":0.15},"sys":{"pod":"n"},"dt_txt":"2023-05-10 09:00:00"},{"dt":1683720000,"main":{"temp":287.38,"feels_like":286.58,"temp_min":287.38,"temp_max":287.38,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":66,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":97},"wind":{"speed":4.6,"deg":277,"gust":5.3},"visibility":10000,"pop":0.24,"rain":{"3h":0.14},"sys":{"pod":"n"},"dt_txt":"2023-05-10 12:00:00"},{"dt":1683730800,"main":{"temp":287.4,"feels_like":286.81,"temp_min":287.4,"temp_max":287.4,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":74,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":3.4,"deg":262,"gust":4.01},"visibility":10000,"pop":0.4,"rain":{"3h":0.26},"sys":{"pod":"d"},"dt_txt":"2023-05-10 15:00:00"},{"dt":1683741600,"main":{"temp":288.64,"feels_like":288.05,"temp_min":288.64,"temp_max":288.64,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":69,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":4.28,"deg":261,"gust":4.31},"visibility":10000,"pop":0.2,"rain":{"3h":0.22},"sys":{"pod":"d"},"dt_txt":"2023-05-10 18:00:00"},{"dt":1683752400,"main":{"temp":290.03,"feels_like":289.39,"temp_min":290.03,"temp_max":290.03,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":62,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":52},"wind":{"speed":5.41,"deg":266,"gust":5.05},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-10 21:00:00"},{"dt":1683763200,"main":{"temp":289.77,"feels_like":289.11,"temp_min":289.77,"temp_max":289.77,"pressure":1017,"sea_level":1017,"grnd_level":1016,"humidity":62,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":43},"wind":{"speed":4.81,"deg":276,"gust":5.02},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 00:00:00"},{"dt":1683774000,"main":{"temp":288.51,"feels_like":287.88,"temp_min":288.51,"temp_max":288.51,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":68,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":24},"wind":{"speed":4.06,"deg":284,"gust":4.16},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 03:00:00"},{"dt":1683784800,"main":{"temp":288.36,"feels_like":287.69,"temp_min":288.36,"temp_max":288.36,"pressure":1018,"sea_level":1018,"grnd_level":1017,"humidity":67,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":54},"wind":{"speed":3.12,"deg":291,"gust":3.26},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 06:00:00"},{"dt":1683795600,"main":{"temp":288.23,"feels_like":287.49,"temp_min":288.23,"temp_max":288.23,"pressure":1017,"sea_level":1017,"grnd_level":1016,"humidity":65,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":2.27,"deg":304,"gust":2.3},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 09:00:00"},{"dt":1683806400,"main":{"temp":287.73,"feels_like":286.97,"temp_min":287.73,"temp_max":287.73,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":66,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":86},"wind":{"speed":1.74,"deg":294,"gust":1.72},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-11 12:00:00"},{"dt":1683817200,"main":{"temp":288.09,"feels_like":287.34,"temp_min":288.09,"temp_max":288.09,"pressure":1017,"sea_level":1017,"grnd_level":1016,"humidity":65,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":43},"wind":{"speed":1.41,"deg":246,"gust":1.24},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 15:00:00"},{"dt":1683828000,"main":{"temp":290.32,"feels_like":289.63,"temp_min":290.32,"temp_max":290.32,"pressure":1016,"sea_level":1016,"grnd_level":1015,"humidity":59,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":35},"wind":{"speed":3,"deg":240,"gust":1.85},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 18:00:00"},{"dt":1683838800,"main":{"temp":291.37,"feels_like":290.76,"temp_min":291.37,"temp_max":291.37,"pressure":1015,"sea_level":1015,"grnd_level":1014,"humidity":58,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":4.17,"deg":243,"gust":2.76},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-11 21:00:00"},{"dt":1683849600,"main":{"temp":290.86,"feels_like":290.33,"temp_min":290.86,"temp_max":290.86,"pressure":1014,"sea_level":1014,"grnd_level":1013,"humidity":63,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":1},"wind":{"speed":3.45,"deg":243,"gust":2.7},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-12 00:00:00"},{"dt":1683860400,"main":{"temp":289.68,"feels_like":289.19,"temp_min":289.68,"temp_max":289.68,"pressure":1014,"sea_level":1014,"grnd_level":1013,"humidity":69,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":1},"wind":{"speed":2.57,"deg":293,"gust":2.56},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 03:00:00"},{"dt":1683871200,"main":{"temp":289.45,"feels_like":288.94,"temp_min":289.45,"temp_max":289.45,"pressure":1014,"sea_level":1014,"grnd_level":1013,"humidity":69,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.86,"deg":319,"gust":2.03},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 06:00:00"},{"dt":1683882000,"main":{"temp":289.11,"feels_like":288.62,"temp_min":289.11,"temp_max":289.11,"pressure":1013,"sea_level":1013,"grnd_level":1012,"humidity":71,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.53,"deg":302,"gust":1.67},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 09:00:00"},{"dt":1683892800,"main":{"temp":288.71,"feels_like":288.28,"temp_min":288.71,"temp_max":288.71,"pressure":1012,"sea_level":1012,"grnd_level":1011,"humidity":75,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.46,"deg":315,"gust":1.58},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-05-12 12:00:00"},{"dt":1683903600,"main":{"temp":289.75,"feels_like":289.35,"temp_min":289.75,"temp_max":289.75,"pressure":1013,"sea_level":1013,"grnd_level":1012,"humidity":72,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":1.56,"deg":302,"gust":1.38},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-12 15:00:00"},{"dt":1683914400,"main":{"temp":292.74,"feels_like":292.35,"temp_min":292.74,"temp_max":292.74,"pressure":1013,"sea_level":1013,"grnd_level":1012,"humidity":61,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":3.04,"deg":269,"gust":1.93},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-05-12 18:00:00"}],"city":{"id":5391811,"name":"San Diego","coord":{"lat":32.71,"lon":-117.16},"country":"US","population":1307402,"timezone":-25200,"sunrise":1683464171,"sunset":1683513250}}

//#endregion

//#region Basic/General Functions
function parseCoordinate(degreeNum){
    return Math.trunc((degreeNum*100))/100;
}// preserves 2 significant digits past the decimal

function saveData(key,value){ localStorage.setItem(key,value); }
function loadData(key){ localStorage.geyItem(key); }
//#endregion


//#region Search //TODO(5)

function getInput(){
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
        locationObject = getDirectGeocode();
    
    
    
        //p("Getting forecast data for next 5 days...");
        //getWeatherForecast();
        //p(forecastObject);
        
        //copyData()
    
        cityString=""; p("Cleared cityString")
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
            getWeatherForecast();
        });
    //end of fetch
}// Returns location (ARRAY of OBJECT) based on user input for city (STRING)


//! Push this to new line for testing: locationObject=testCity;
p(locationObject)


function getWeatherForecast(){
    console.log(locationObject[0].lon)
    let longitude = parseCoordinate(locationObject[0].lon);
    let latitude = parseCoordinate(locationObject[0].lat);
    p("lon:"+longitude+", lat:"+latitude);

    let queryForecast = `?lat=${latitude}&lon=${longitude}`;
    let URL = encodeURI(pathForecast+queryForecast+apiKey); p(URL);

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
    });
} //TODO: can we request count 48 instead? 1 day more? Mock-up shows one more day!

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
    p(forecastDataArr)
    saveData(locationObject[0].name, JSON.stringify(forecastDataArr))
}



//TODO: search history


//#endregion

//#region Display //TODO(2)
//TODO pass location.name -> before date on first child
function updateCardData(cardObj, dataObj){
    let cardDataList = cardObj.children(); 
    cardDataList.eq(0).text(dataObj.date);
    cardDataList.eq(1).text(dataObj.temperature);
    cardDataList.eq(2).text(dataObj.wind);
    cardDataList.eq(3).text(dataObj.humidity);
}

function updateForecast(){
    let currentCard ="";
    for (i=0; i<= 5; i++){
        currentCard = display.children().eq(i);
        //p(currentCard);
        updateCardData(currentCard, testerArr[i]); 
    }
} //TODO: change from testerArr to actual

updateForecast();




//TODO: updateCity



//#endregion

// !end of File
