sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("customdgfiori.controller.App", {
    onInit() {},

    onCollapseExpandPress() {
      const oSideNav = this.byId("sideNavigation");
      oSideNav.setExpanded(!oSideNav.getExpanded());
    },

    onHomePress: function() {
      this.getOwnerComponent().getRouter().navTo("RouteView1");
    },

    onListPress: function() {
      this.getOwnerComponent().getRouter().navTo("ListReport");
    },

    onCreatePress: function() {
      this.getOwnerComponent().getRouter().navTo("CreateForm");
    },
    onChartPress: function() {
        this.getOwnerComponent().getRouter().navTo("Chart");
    },
    onChartDefaultPress: function() {
        this.getOwnerComponent().getRouter().navTo("ChartDefault");
    },
    onMapPress: function () {
      this.getOwnerComponent().getRouter().navTo("Map");
    }
  });
});
