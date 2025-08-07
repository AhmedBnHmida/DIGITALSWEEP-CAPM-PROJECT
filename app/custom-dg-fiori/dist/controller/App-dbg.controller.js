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

    onHomePress() {
      this.getOwnerComponent().getRouter().navTo("RouteView1");
    },

    onListPress() {
      this.getOwnerComponent().getRouter().navTo("ListReport");
    },

    onCreatePress() {
      this.getOwnerComponent().getRouter().navTo("CreateForm");
    }
  });
});
