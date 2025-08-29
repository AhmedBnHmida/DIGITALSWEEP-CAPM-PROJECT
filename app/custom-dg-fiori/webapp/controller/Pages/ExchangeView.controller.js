sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Pages.ExchangeView", {

    onInit: function() {
      // Sample list of currencies - extend as needed
      var oCurrencyModel = new JSONModel({
        Currencies: [
          { code: ""},
          { code: "USD" },
          { code: "EUR" },
          { code: "JPY" },
          { code: "GBP" },
          { code: "AUD" },
          { code: "CAD" },
          { code: "CHF" }
        ]
      });
      this.getView().setModel(oCurrencyModel);
    },

    
    onGetExchangeRate: function() {
      const oView = this.getView();
      const sBase = oView.byId("baseSelect").getSelectedKey();
      const sTarget = oView.byId("targetSelect").getSelectedKey();

      if (!sBase || !sTarget) {
        sap.m.MessageToast.show("Please select both base and target currencies.");
        return;
      }

     // const apiKey = "49f46424a282b4ce4c4258a860412e9d";
     // const url = `https://api.exchangerate.host/live?access_key=${apiKey}&base=${sBase}&symbols=${sTarget}`;

      const url = "/odata/v4/Financeservice/getExchangeRate";

      fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify({
              base: sBase,
              target: sTarget
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            const quoteKey = `${sBase}${sTarget}`;
            const rate = data.quotes[quoteKey];
            oView.byId("exchangeRateText").setText(`Exchange Rate (${sBase} to ${sTarget}): ${rate ?? "N/A"}`);
          } else {
            throw new Error("API call was not successful");
          }
        })
        .catch(() => {
          sap.m.MessageToast.show("Error fetching exchange rate.");
          oView.byId("exchangeRateText").setText("");
        });
    },

/*
    onGetExchangeRate: function() {
      const oView = this.getView();
      const sBase = oView.byId("baseSelect").getSelectedKey();
      const sTarget = oView.byId("targetSelect").getSelectedKey();

      if (!sBase || !sTarget) {
        MessageToast.show("Please select both base and target currencies.");
        return;
      }

      const oModel = oView.getModel();

      // Call CAP OData V4 function using callFunction()
      oModel.callFunction("/getExchangeRate", {
        method: "GET",
        urlParameters: {
          base: sBase,
          target: sTarget
        },
        success: (oData) => {
          oView.byId("exchangeRateText").setText(
            `Exchange Rate (${sBase} to ${sTarget}): ${oData.value}`
          );
        },
        error: () => {
          MessageToast.show("Error fetching exchange rate.");
          oView.byId("exchangeRateText").setText("");
        }
      });
    },
*/

    onBaseCurrencyChange: function(oEvent) {
      // Optional: handle base currency selection change
      const sKey = oEvent.getParameter("selectedItem").getKey();
      console.log("Base currency selected:", sKey);
    },

    onTargetCurrencyChange: function(oEvent) {
      // Optional: handle target currency selection change
      const sKey = oEvent.getParameter("selectedItem").getKey();
      console.log("Target currency selected:", sKey);
    }

  });
});
