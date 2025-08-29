sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/format/NumberFormat"
], function (Controller, MessageToast, JSONModel, NumberFormat) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Pages.View1", {

    onInit: function () {
      this._loadData();
    },

    _loadData: function () {
      var oODataModel = this.getOwnerComponent().getModel();
      if (!(oODataModel instanceof sap.ui.model.odata.v4.ODataModel)) {
        MessageToast.show("Error: Default model is not OData V4.");
        return;
      }

      var oListBinding = oODataModel.bindList("/Finances");

      oListBinding.requestContexts(0, Infinity).then(function (aContexts) {
        var aResults = aContexts.map(function (oContext) {
          return oContext.getObject();
        });

        var countrySet = new Set();
        var segmentSet = new Set();
        var totalUnitsSold = 0;
        var totalSales = 0;
        var globalProfit = 0;
        var financesByCountry = {};
        var profitByYear = {};

        var oCurrencyFormat = NumberFormat.getCurrencyInstance({ currencyCode: false });

        aResults.forEach(function (entry) {
          if (entry.Country) {
            countrySet.add(entry.Country);
            if (!financesByCountry[entry.Country]) {
              financesByCountry[entry.Country] = { 
                Country: entry.Country, 
                Sales: 0, 
                Profit: 0 
              };
            }
            financesByCountry[entry.Country].Sales += parseFloat(entry.Sales) || 0;
            financesByCountry[entry.Country].Profit += parseFloat(entry.Profit) || 0;
          }

          if (entry.Segment) {
            segmentSet.add(entry.Segment);
          }

          totalUnitsSold += parseFloat(entry.Units_Sold) || 0;
          totalSales += parseFloat(entry.Sales) || 0;
          globalProfit += parseFloat(entry.Profit) || 0;

          if (entry.Year) {
            if (!profitByYear[entry.Year]) {
              profitByYear[entry.Year] = { Year: entry.Year, Profit: 0 };
            }
            profitByYear[entry.Year].Profit += parseFloat(entry.Profit) || 0;
          }
        });

        var oDashboardModel = new JSONModel({
          countryCount: countrySet.size,
          segmentCount: segmentSet.size,
          totalUnitsSold: totalUnitsSold,
          totalSales: oCurrencyFormat.format(totalSales, "USD"),
          globalProfit: oCurrencyFormat.format(globalProfit, "USD"),
          financesByCountry: Object.values(financesByCountry).map(function(item){
            return {
              Country: item.Country,
              Sales: oCurrencyFormat.format(item.Sales, "USD"),
              Profit: oCurrencyFormat.format(item.Profit, "USD")
            };
          }),
          profitByYear: Object.values(profitByYear)
        });

        this.getView().setModel(oDashboardModel);

      }.bind(this)).catch(function (err) {
        console.error("Error loading Finance data:", err);
        MessageToast.show("Failed to load finance data");
      });
    }

  });
});
