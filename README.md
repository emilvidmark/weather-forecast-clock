# Weather Forecast Clock

A simple, yet effectful, weather clock which shows the weather in Luleå/Sweden for the 12 upcoming hours.

The clock collects weather data from the Swedish Meteorological and Hydrological Institute (SMHI), more information about the api can be found here: <a>http://opendata.smhi.se/apidocs/metfcst/index.html</a>

As for now the GET request in watch.js needs to be edited to change location. What needs to be changed in the request is the longitude and latitude to match your citys limits.
Caution: The watch doesn't handle errors from the API, for example if you send a localization outside SMHI:s boundaries the API will throw an error.
