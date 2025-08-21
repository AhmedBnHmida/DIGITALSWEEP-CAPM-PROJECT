sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("customdgfiori.controller.App", {
    onInit: function() {
    const oRouter = this.getOwnerComponent().getRouter();
      
      // Attach pattern matched handler on all routes
      oRouter.attachRouteMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function(oEvent) {
      const sRouteName = oEvent.getParameter("name");
      const oView = this.getView();

      // Views where you want to hide header and sidebar
      const aNoHeaderViews = ["login", "register"];

      const bHide = aNoHeaderViews.includes(sRouteName);

      // Assuming these are your controls IDs for header and sidebar:
      const oHeader = oView.byId("shellLikeToolHeader");
      const oSideNav = oView.byId("sideNavigation");

      if (oHeader) {
        oHeader.setVisible(!bHide);
      }
      if (oSideNav) {
        oSideNav.setVisible(!bHide);
      }
    },


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
    },
    onWeatherPress: function() {
      this.getOwnerComponent().getRouter().navTo("weather");
    },
    onExchangePress: function() {
      this.getOwnerComponent().getRouter().navTo("exchange");
    }



  });
});
