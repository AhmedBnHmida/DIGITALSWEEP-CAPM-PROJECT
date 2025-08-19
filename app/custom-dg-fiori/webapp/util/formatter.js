sap.ui.define([], function () {
  "use strict";
  return {
    formatKelvinToCelsius: function (kelvin) {
      const k = parseFloat(kelvin);
      return isNaN(k) ? "N/A" : (k - 273.15).toFixed(1);
    },
  };
});
