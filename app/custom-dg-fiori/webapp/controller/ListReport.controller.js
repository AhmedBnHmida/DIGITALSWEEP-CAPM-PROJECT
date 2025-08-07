sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("customdgfiori.controller.ListReport", {

        onInit: function () {
            // You can add initialization logic here
        },

        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
            }
        },

        onCreatePress: function () {
            // Navigate to the Create Form view
            this.getOwnerComponent().getRouter().navTo("CreateForm");
        },

        formatDate: function (sDate) {
            if (!sDate) return "";
            const oDate = new Date(sDate);
            return oDate.toLocaleDateString();
        },




        //////***************************** NAVIGATION LOGIC *********************************************///////

        onDetailPress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();
            const sId = oCtx.getProperty("No");
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", { id: sId });
        },

        onEditPress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();
            const sId = oCtx.getProperty("No");
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("EditForm", { id: sId });
        },

        onDeletePress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();
            const oModel = this.getView().getModel();

            oModel.remove(oCtx.getPath(), {
                success: () => {
                    sap.m.MessageToast.show("Entry deleted successfully");
                },
                error: (err) => {
                    sap.m.MessageToast.show("Delete failed: " + err.message);
                }
            });
        }
    });
});
