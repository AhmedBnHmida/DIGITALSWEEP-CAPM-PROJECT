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

            const url = "/odata/v4/auth/login";

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error.message || "Login failed"); });
                }
                return response.json();
            })
            .then(data => {
                MessageToast.show(data.message || "Login successful!");
                UIComponent.getRouterFor(this).navTo("RouteView1");
            })
            .catch(err => {
                MessageToast.show(err.message);
            });
        },

        onRegisterPress: function() {
            UIComponent.getRouterFor(this).navTo("register");
        }
    });
});
