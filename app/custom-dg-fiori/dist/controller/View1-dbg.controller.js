sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("customdgfiori.controller.View1", {
        onInit: function () {
            // Optional: any View1-specific logic
            console.log("*******************************************************************");
            console.log("ListReport loaded!");
            console.log("Dashboard view loaded");
            console.log("*******************************************************************");
        }
    });
});
