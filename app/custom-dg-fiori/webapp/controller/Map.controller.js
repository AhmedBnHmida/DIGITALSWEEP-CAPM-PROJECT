sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Map", {
    onInit: function () {
      // nothing needed here for the map, map config will be done onAfterRendering
    },

    onAfterRendering: function () {
      var oGeoMap = this.byId("geoMap");
        
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

      // Optional: set initial view
      oGeoMap.setInitialZoom(4);
      oGeoMap.setInitialPosition("10.0;50.0;0"); // longitude;latitude;altitude
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("RouteView1"); // Adjust target as you wish
    }
  });
});

