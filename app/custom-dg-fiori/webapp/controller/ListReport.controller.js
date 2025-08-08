sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function (Controller, History, MessageBox) {
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
/*
        formatDate: function (sDate) {
            if (!sDate) return "";
            const oDate = new Date(sDate);
            return oDate.toLocaleDateString();
        },
*/



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

        onDeletePresss: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var RowId = oContext.getProperty("No");
        
            MessageBox.confirm(
                "Are you sure you want to delete this Row with ID: " + RowId + "?",
                {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            oContext.delete("$direct")
                                .then(function () {
                                    MessageBox.success("Row ID: " + RowId + " deleted successfully.");
                                })
                                .catch(function (oError) {
                                    MessageBox.error("Error deleting Row ID: " + RowId + ". " + oError + " Please try again later.");
                                });
                        }
                    }
                }
            );
        }
    });
});
