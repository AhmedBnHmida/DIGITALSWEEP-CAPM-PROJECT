sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Map", {

    onInit: function () {
      // Fixed coordinates for countries (longitude;latitude;0)
      this._countryCoordinates = {
        Canada: "-106.3468;56.1304;0",
        Germany: "10.4515;51.1657;0",
        Tunisia: "9.5375;33.8869;0",
        cc: "9.5375;33.8869;0",
        "United States of America": "-95.7129;37.0902;0",
        Mexico: "-102.5528;23.6345;0",
        France: "2.2137;46.2276;0"
      };
      this._loadAggregatedDataV4();
    },

    _loadAggregatedDataV4: function () {
      var oModel = this.getOwnerComponent().getModel(); // OData V4 Model

      var oListBinding = oModel.bindList("/Finances", undefined, [], [], {
        $apply: 'groupby((Country),aggregate(Sales with sum as SalesSum, Profit with sum as ProfitSum, No with countdistinct as SalesCount))'
      });

      oListBinding.requestContexts(0, 100).then(function (aContexts) {
        var aData = aContexts.map(function (oCtx) {
          return oCtx.getObject();
        });

        this._originalData = aData;

        var aCircles = aData.map(this._mapItemToCircle.bind(this));

        this.getView().setModel(new JSONModel({
          circlesData: aCircles
        }));

      }.bind(this)).catch(function () {
        MessageToast.show("Failed to load aggregated sales data.");
      });
    },

    _mapItemToCircle: function (item) {
      var pos = this._countryCoordinates[item.Country] || "0;0;0";
      var radius = Math.min(100, 10 + (item.SalesCount || 1) * 2);

      var tooltip =
        "Country: " + item.Country + "\n" +
        "Sales Sum: " + Number(item.SalesSum).toFixed(2) + "\n" +
        "Profit Sum: " + Number(item.ProfitSum).toFixed(2) + "\n" +
        "Sales Count: " + item.SalesCount;

      return {
        position: pos,
        radius: radius,
        tooltip: tooltip
      };
    },

    // Handle circle selection (click) event to show details
    onCircleSelect: function (oEvent) {
      var aSelectedCircles = oEvent.getParameter("selected");
      if (aSelectedCircles && aSelectedCircles.length > 0) {
        var oCircle = aSelectedCircles[0];
        var sTooltip = oCircle.getTooltip();
        MessageToast.show(sTooltip);
      }
    },
/*
    onCountryChange: function (oEvent) {
      var sSelected = oEvent.getParameter("selectedItem").getKey();
      if (!sSelected) return;

      var filtered = this._originalData.filter(function (item) {
        return item.Country === sSelected;
      });

      if (filtered.length === 0) {
        MessageToast.show("No data available for " + sSelected);
        this.getView().getModel().setData({ circlesData: [] });
        return;
      }

      var aCircles = filtered.map(this._mapItemToCircle.bind(this));
      this.getView().getModel().setData({ circlesData: aCircles });

      var pos = this._countryCoordinates[sSelected] || "0;0;0";
      this.byId("vbi").zoomToGeoPosition(pos, 5);
    },
*/
    onAfterRendering: function () {
      var oGeoMap = this.byId("vbi");

      var oMapConfig = {
        "MapProvider": [{
          "name": "OSM",
          "type": "",
          "description": "OpenStreetMap",
          "tileX": "256",
          "tileY": "256",
          "maxLOD": "19",
          "copyright": "© OpenStreetMap contributors",
          "Source": [{
            "id": "s1",
            "url": "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
          }, {
            "id": "s2",
            "url": "https://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
          }]
        }],
        "MapLayerStacks": [{
          "name": "DEFAULT",
          "MapLayer": {
            "name": "layer1",
            "refMapProvider": "OSM",
            "opacity": "1.0",
            "colBkgnd": "RGB(255,255,255)"
          }
        }]
      };

      oGeoMap.setMapConfiguration(oMapConfig);
      oGeoMap.setRefMapLayerStack("DEFAULT");

      oGeoMap.setInitialZoom(4);
      oGeoMap.setInitialPosition("10.0;50.0;0");
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("RouteView1");
    }

  });
});
