sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function(Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("customdgfiori.controller.Auth.Register", {

        onRegisterPress: function() {
            const oView = this.getView();
            const username = oView.byId("inputUsername").getValue();
            const email = oView.byId("inputEmail").getValue();
            const password = oView.byId("inputPassword").getValue();
            const confirmPassword = oView.byId("inputConfirmPassword").getValue();

            if (!username || !email || !password || !confirmPassword) {
                MessageToast.show("Please fill in all fields.");
                return;
            }

            if (password !== confirmPassword) {
                MessageToast.show("Passwords do not match.");
                return;
            }

            // Here you would call your backend registration service 
            // For demo, just show success message

            MessageToast.show("Registration successful! Please login.");

            // Navigate back to login page
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("login");
        },

        onLoginPress: function() {
            // Navigate back to login page
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("login");
        }
    });
});
