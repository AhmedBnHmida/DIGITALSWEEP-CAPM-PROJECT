sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function(Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("customdgfiori.controller.Auth.Register", {

        onRegisterPress: function() {
            const oView = this.getView();
            const username = oView.byId("inputUsername").getValue().trim();
            const email = oView.byId("inputEmail").getValue().trim();
            const password = oView.byId("inputPassword").getValue().trim();
            const confirmPassword = oView.byId("inputConfirmPassword").getValue().trim();

            // ✅ Frontend validation
            if (!username) {
                MessageToast.show("Username is required.");
                return;
            }
            if (!email) {
                MessageToast.show("Email is required.");
                return;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                MessageToast.show("Invalid email format.");
                return;
            }
            if (!password) {
                MessageToast.show("Password is required.");
                return;
            }
            if (password.length < 6) {
                MessageToast.show("Password must be at least 6 characters.");
                return;
            }
            if (!confirmPassword) {
                MessageToast.show("Please confirm your password.");
                return;
            }
            if (password !== confirmPassword) {
                MessageToast.show("Passwords do not match.");
                return;
            }

            // ✅ Backend call
            const url = "/odata/v4/auth/register";

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ username, email, password })
            })
            .then(async response => {
                if (!response.ok) {
                    let backendErr = { code: "00000", message: "Registration failed" };
                    try {
                        const err = await response.json();
                        backendErr.code = err.error?.code || backendErr.code;
                        backendErr.message = err.error?.message || backendErr.message;
                    } catch (e) {
                        backendErr.message = response.statusText || backendErr.message;
                    }

                    // ✅ Map backend codes to toast messages
                    switch (backendErr.code) {
                        case "40001":
                        case "40002":
                        case "40003":
                        case "40004": // email already registered
                        case "40005": // username taken
                            throw new Error(backendErr.message);
                        default:
                            throw new Error(backendErr.message);
                    }
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
        },

        onCancelPress: function() {
            UIComponent.getRouterFor(this).navTo("home");
        },

        onHomePress: function() {
            UIComponent.getRouterFor(this).navTo("home");
        }


    });
});
