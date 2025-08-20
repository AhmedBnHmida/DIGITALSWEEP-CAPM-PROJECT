const cds = require("@sap/cds");
const axios = require("axios");

module.exports = cds.service.impl(async function () {
  const { Finance } = this.entities;

  const apiKey = "49f46424a282b4ce4c4258a860412e9d"; // Your API key
  
  // Action to get exchange rate
  this.on("getExchangeRate", async (req) => {
    const { base, target } = req.data;
    console.log(">>> getExchangeRate called with", req.data);

    try {
      const response = await axios.get("https://api.exchangerate.host/live", {
        params: {
          access_key: "49f46424a282b4ce4c4258a860412e9d", // your API key
          base: base,
          symbols: target
        }
      });

      if (response.data.success) {
        // exchangerate.host returns quotes as an object with keys like "USDEUR"
        const quoteKey = `${base}${target}`;
        const rate = response.data.quotes[quoteKey];
        return { value: rate ?? 0 };
      } else {
        console.error("ExchangeRate API error:", response.data.error);
        return { value: 0 };
      }
    } catch (err) {
      console.error("Error fetching exchange rate:", err.message);
      return { value: 0 };
    }
  });


  // After READ, add USD -> EUR conversion
  this.after("READ", Finance, async (rows) => {
    let usdToEurRate = null;

    try {
      const response = await axios.get(
        `https://api.exchangerate.host/live?access_key=${apiKey}&source=USD&currencies=EUR`
      );
      if (response.data.success) {
        usdToEurRate = response.data.quotes["USDEUR"];
      }
    } catch (err) {
      console.error("Error fetching USD to EUR rate:", err.message);
    }

    for (let row of rows) {
      if (row.Currency === "USD") {
        row.ExchangeRateToEUR = usdToEurRate ?? null;
      }
    }
  });

  // Weather API remains unchanged
  this.on("getWeather", async (req) => {
    const { lat, lon } = req.data;
    const weatherApiKey = "1cddf9a813c095031459c988a73af6fc";

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&lang=en&units=metric`;
      const response = await axios.get(url);
      const data = response.data;

      return {
        dt_txt: new Date(data.dt * 1000).toISOString(),
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        weather_desc: data.weather?.[0]?.description || "",
      };
    } catch (err) {
      console.error("Weather API error:", err.message);
      return req.reject(500, "Could not fetch weather data");
    }
  });
});
