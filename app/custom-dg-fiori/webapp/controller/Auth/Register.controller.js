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

            const url = "/odata/v4/auth/register";

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error.message || "Registration failed"); });
                }
                return response.json();
            })
            .then(data => {
                MessageToast.show(data.message || "Registration successful!");
                UIComponent.getRouterFor(this).navTo("login");
            })
            .catch(err => {
                MessageToast.show(err.message);
            });
        },

        onLoginPress: function() {
            UIComponent.getRouterFor(this).navTo("login");
        }
    });
});
