sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(Controller) {
  "use strict";

  return Controller.extend("customdgfiori.controller.ChartDefault", {
    onInit: function() {
      // You can add custom initialization logic here if needed
    },
    onNavBack: function() {
      this.getOwnerComponent().getRouter().navTo("RouteView1");
    }
  });
});
