# Weather Dashboard

## Description

The objective of this project is to produce an online dashboard in one week from scratch.
The webapp will utilize the OpenWeather API to display a 5-day weather forecast at a any given city.

## Lessons Learned

- API keys are hard to handle with out a backend to store; but we should treat it as sensitive passwords
- Calling APIs can take some time to figure out
- It's important to take breaks even though you think you should push through


## Installation

This webapp utilizes your web browser already. No installation neccessary.


## Usage

Navigate to this URL in your preferred browser: https://19dbo91.github.io/challenge6-weather-dashboard/

![Home Page, displaying San Diego weather](assets\images\homeSanDiego.png)
Click on the "<i>Type in a City</i>" above the Search bar and enter the City you wish to find the 5-day forecast.

![Home Page, entering New York City and the API key, not real, for serach](assets\images\searchNYC.png)
Then, click on the "<i>API Key</i>" below the Search bar and enter the API key provided in the submissions page.
Alternatively, you can sign up for you own API key at: <https://openweathermap.org/>

Warning: I designed this site to have API key not stored in local and the API Key does NOT clear on search.
Where as the Search box does clear. This was to allow for more entries to be attempted.

![Home Page, entering New York City and the API key, not real, for serach](assets\images\searchHistory.png)

The site also tracks your recent searches on this session. Below the API key, you will see the cities you looked up underneath. Click on one to reload them back onto the page. This will NOT send another API fetch as it was saved locally.

![Home Page, displaying Tokyo in mobile layout](assets\images\mobileLayoutTokyo.png)

You can view this on your phone as well.

## Credits

- OpenWeather: <https://openweathermap.org/forecast5>
- jQuery: <https://jquery.com/>
- Tailwind CSS: <https://tailwindcss.com/>
- DayJS: <https://day.js.org/>
- Google Font - Roboto Mono: <https://fonts.google.com/specimen/Roboto+Mono?preview.text=Weather%20Dashboard&preview.size=48&preview.layout=row&preview.text_type=custom&query=robo>
- Prompt provided by UCI Bootcamp
  
## Features

- Real live data of 5-day weather
- Weather-dependent color-coded cards
- Responsive design for mobile and desktop
  