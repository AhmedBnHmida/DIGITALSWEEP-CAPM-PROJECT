sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function(Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("customdgfiori.controller.Auth.Login", {

        onLoginPress: function() {
            const oView = this.getView();
            const email = oView.byId("inputEmaill").getValue().trim();
            const password = oView.byId("inputPasswordl").getValue().trim();

            // ✅ Frontend validation
            if (!email && !password) {
                MessageToast.show("Please enter email and password.");
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

            // ✅ Backend call
            const url = "/odata/v4/auth/login";

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ email, password })
            })
            .then(async response => {
                if (!response.ok) {
                    let backendErr = { code: "00000", message: "Login failed" };
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
                            throw new Error(backendErr.message);  // invalid input
                        case "40101":
                            throw new Error("No account found with this email.");
                        case "40102":
                            throw new Error("Incorrect password. Please try again.");
                        default:
                            throw new Error(backendErr.message);
                    }
                }
                return response.json();
            })
            .then(data => {

                // Save only user ID
                if (data.userId) {
                    localStorage.setItem("userId", data.userId);
                    sessionStorage.setItem("userId", data.userId);
                }

                MessageToast.show(data.message || "Login successful!");
                UIComponent.getRouterFor(this).navTo("RouteView1");
            })
            .catch(err => {
                MessageToast.show(err.message);
            });
        },

        onRegisterPress: function() {
            UIComponent.getRouterFor(this).navTo("register");
        },

        onCancelPress: function() {
            UIComponent.getRouterFor(this).navTo("home");
        },

        onHomePress: function() {
            UIComponent.getRouterFor(this).navTo("home");
        }


    });
});
