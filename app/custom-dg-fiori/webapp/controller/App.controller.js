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
      const aNoHeaderViews = ["login", "register","home"];

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
    },
    oneditProfilePress: function() {
      this.getOwnerComponent().getRouter().navTo("editProfile");
    },

    onAvatarPress: function (oEvent) {
      const oButton = oEvent.getSource();

      // Create menu lazily (only once)
      if (!this._oAvatarMenu) {
          this._oAvatarMenu = new sap.m.Menu({
              items: [
                  new sap.m.MenuItem({
                      text: "Settings",
                      icon: "sap-icon://action-settings",
                      press: function () {
                          //sap.m.MessageToast.show("Settings clicked");
                          this.getOwnerComponent().getRouter().navTo("editProfile");
                      }.bind(this)
                  }),
                  new sap.m.MenuItem({
                      text: "Logout",
                      icon: "sap-icon://log",
                      press: function () {
                          // logout
                          //sap.m.MessageToast.show("Logout clicked");
                          //this.getOwnerComponent().getRouter().navTo("login");

                          // logout logic
                          sessionStorage.clear();
                          localStorage.clear();
                          this.getOwnerComponent().getRouter().navTo("login");
                          
                      }.bind(this)
                  })
              ]
          });
      }

      // Open menu relative to Avatar
      this._oAvatarMenu.openBy(oButton);
    }


  });
});
