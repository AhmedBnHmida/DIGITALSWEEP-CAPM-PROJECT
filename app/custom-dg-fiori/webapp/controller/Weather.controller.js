sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "customdgfiori/util/formatter"
], function (Controller, JSONModel, formatter) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Weather", {
    formatter: formatter,

    onInit: function () {
      const oCityModel = new JSONModel();
      oCityModel.loadData("model/cityData.json");
      this.getView().setModel(oCityModel);

      oCityModel.attachRequestCompleted(() => {
        const aCities = oCityModel.getData().cities;
        if (aCities?.length > 0) {
          this.loadCurrentWeather(aCities[0].lat, aCities[0].lon);
        }
      });
    },

    onCityChange: function (oEvent) {
      const sKey = oEvent.getParameter("selectedItem").getKey();
      const [lat, lon] = sKey.split(",");
      this.loadCurrentWeather(lat, lon);
    },

    loadCurrentWeather: async function (lat, lon) {
      const apiKey = "1cddf9a813c095031459c988a73af6fc";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=en`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const row = {
          dt_txt: new Date(data.dt * 1000).toLocaleString("en-US"),
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          weather_desc: data.weather?.[0]?.description || "",
        };
        const oWeatherModel = new JSONModel({ Forecast: [row] });
        this.getView().setModel(oWeatherModel, "weatherModel");
      } catch (err) {
        console.error("Could not fetch current weather:", err);
      }
    },
  });
});
