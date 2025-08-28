sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("customdgfiori.controller.EditProfile", {

        onInit: function () {
            this.userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
            if (!this.userId) {
                MessageToast.show("No user logged in!");
                UIComponent.getRouterFor(this).navTo("login");
                return;
            }

            this._fetchUserData();
        },

        _fetchUserData: async function () {
            try {
                const response = await fetch(`/odata/v4/auth/Users/${this.userId}`);
                if (!response.ok) throw new Error("Failed to fetch user data");

                const user = await response.json();
                const oView = this.getView();
                oView.byId("usernameInput").setValue(user.username);
                oView.byId("passwordField").setValue("");
                oView.byId("confirmPasswordField").setValue("");
                oView.byId("createdAtText").setText(new Date(user.createdAt).toLocaleString());
                oView.byId("emailText").setText(user.email);
            } catch (err) {
                MessageToast.show(err.message);
            }
        },

        onSave: async function () {
            const oView = this.getView();
            const newUsername = oView.byId("usernameInput").getValue();
            const newPass = oView.byId("passwordField").getValue();
            const confirmPass = oView.byId("confirmPasswordField").getValue();

            if (newPass && newPass !== confirmPass) {
                MessageToast.show("Passwords do not match");
                return;
            }

            const updateData = { ID: this.userId, username: newUsername };
            if (newPass) updateData.password = newPass;

            try {
                const response = await fetch(`/odata/v4/auth/updateUser`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "Update failed");

                MessageToast.show(result.message);
                // ✅ Clear password fields after successful update
                const oView = this.getView();
                oView.byId("passwordField").setValue("");
                oView.byId("confirmPasswordField").setValue("");
            } catch (err) {
                MessageToast.show(err.message);
            }
        }
    });
});
