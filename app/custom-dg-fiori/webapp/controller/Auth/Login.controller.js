sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function(Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("customdgfiori.controller.Auth.Login", {
        
        onLoginPress: function() {
            const oView = this.getView();
            const username = oView.byId("inputUsernamel").getValue();
            const password = oView.byId("inputPasswordl").getValue();

            if (!username || !password) {
                MessageToast.show("Please enter username and password.");
                return;
            }

            // Simple dummy login validation example:
            if (username === "user" && password === "user") {
                MessageToast.show("Login successful!");

                // Navigate to main app or home page
                //const oRouter = UIComponent.getRouterFor(this);
                //oRouter.navTo("RouteView1");
                this.getOwnerComponent().getRouter().navTo("RouteView1");
                MessageToast.show("Navigating to RouteView1");
            } else {
                MessageToast.show("Invalid username or password.");
            }
        },
        
        onRegisterPress: function() {
            // Navigate to register page
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("register");
        }
    });
});
