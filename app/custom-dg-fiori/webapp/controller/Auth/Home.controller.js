sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
    "use strict";

    return Controller.extend("customdgfiori.controller.Home", {

        onLoginPress: function() {
            UIComponent.getRouterFor(this).navTo("login");
        },

        onRegisterPress: function() {
            UIComponent.getRouterFor(this).navTo("register");
        }

    });
});
