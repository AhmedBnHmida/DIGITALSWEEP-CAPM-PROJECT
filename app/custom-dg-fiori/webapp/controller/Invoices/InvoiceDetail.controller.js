sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, Fragment, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Invoices.InvoiceDetail", {
    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("InvoiceDetail").attachPatternMatched(this._onObjectMatched, this);
    },

    formatDate: function (sDate) {
      if (!sDate) return "";
      let oDate = sDate instanceof Date ? sDate : new Date(sDate);
      return isNaN(oDate) ? "" : oDate.toISOString().slice(0, 10);
    },

    _onObjectMatched: function (oEvent) {
      const sId = oEvent.getParameter("arguments").id;
      this.getView().bindElement(`/Invoices(InvoiceID='${sId}')`);
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("ListInvoice");
    },

    onEdit: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      if (!oCtx) return MessageBox.error("Cannot edit: context missing");
      const sId = oCtx.getProperty("InvoiceID");
      if (!sId) return MessageBox.error("Cannot edit: ID missing");
      this.getOwnerComponent().getRouter().navTo("EditInvoice", { id: sId });
    },

    // === New Functions for Status Change ===
    onOpenStatusDialog: function () {
      if (!this._pDialog) {
        this._pDialog = Fragment.load({
          id: this.getView().getId(),
          name: "customdgfiori.view.fragments.ChangeStatusDialog",
          controller: this
        }).then(function (oDialog) {
          this.getView().addDependent(oDialog);
          return oDialog;
        }.bind(this));
      }
      this._pDialog.then(function (oDialog) {
        oDialog.open();
      });
    },

    onCloseStatusDialog: function () {
          this.byId("changeStatusDialog").close();
        },

onConfirmStatusChange: function () {
    const oDialog = this.byId("changeStatusDialog");
    const sNewStatus = this.byId("statusSelect").getSelectedKey();
    const oModel = this.getView().getModel();
    const oContext = this.getView().getBindingContext();

    if (!oContext) {
        MessageBox.error("Cannot update status: context missing");
        return;
    }

    // Update the property locally on the context
    oContext.setProperty("Status", sNewStatus);

    // Submit the batch for the update group (ensure your model and bindings use this same group)
    oModel.submitBatch("updateGroup").then(() => {
        MessageToast.show(`Status updated to ${sNewStatus}`);
        oDialog.close();
    }).catch((err) => {
        MessageBox.error(`Failed to update status: ${err.message || err}`);
    });
}




  });
});
