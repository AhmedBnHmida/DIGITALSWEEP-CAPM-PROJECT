const cds = require("@sap/cds");
const axios = require("axios");

module.exports = cds.service.impl(async function () {
  const { Finance } = this.entities;

  this.on("getExchangeRate", async (req) => {
    const { base, target } = req.data;
    try {
      const response = await axios.get(
        `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`
      );
      const rate = response.data.rates[target];
      return { value: rate ?? 0 };
    } catch (error) {
      return { value: 0 };
    }
  });

  this.after("READ", Finance, async (rows) => {
    for (let row of rows) {
      if (row.Currency === "USD") {
        try {
          const response = await axios.get(
            `https://api.exchangerate.host/latest?base=USD&symbols=EUR`
          );
          row.ExchangeRateToEUR = response.data.rates["EUR"];
        } catch (err) {
          row.ExchangeRateToEUR = null;
        }
      }
    }
  });
/*
  this.on("getWeather", async (lat, lon) => {
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
  });
*/
});
