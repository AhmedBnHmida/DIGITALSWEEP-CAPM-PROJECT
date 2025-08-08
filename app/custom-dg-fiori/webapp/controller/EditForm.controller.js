sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], function (Controller, MessageBox) {
  "use strict";

  return Controller.extend("customdgfiori.controller.EditForm", {

    onInit: function () {
      const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("EditForm").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function (oEvent) {
      const sId = oEvent.getParameter("arguments").id;
      const sPath = `/Finances(No=${sId})`; // Update if key is string: `/Finances(No='${sId}')`
      this.getView().bindElement({
        path: sPath,
        parameters: {
          $$updateGroupId: "updateGroup"
        }
      });
    },

    onNavBack: function () {
      sap.ui.core.UIComponent.getRouterFor(this).navTo("ListReport");
    },

    onSavePress: function () {
      const oView = this.getView();
      const oODataModel = oView.getModel();

      if (!oView.getBindingContext().hasPendingChanges()) {
        MessageBox.information("No changes to save.");
        return;
      }

      oODataModel.submitBatch("updateGroup")
        .then(() => {
          MessageBox.success("Record updated successfully", {
            onClose: () => {
              this.onNavBack();
            }
          });
        })
        .catch((err) => {
          MessageBox.error("Update failed: " + err.message);
          console.error("Update Error", err);
        });
    }
  });
});
