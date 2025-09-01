sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], function (Controller, MessageBox) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Invoices.ListInvoice", {

    onInit: function () {
      this._oModel = this.getOwnerComponent().getModel();
      this.getView().setModel(this._oModel);
    },

    onCreate: function () {
      this.getOwnerComponent().getRouter().navTo("CreateInvoice");
    },

    onEdit: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      if (!oCtx) return MessageBox.error("Cannot edit: context missing");

      const sId = oCtx.getProperty("InvoiceID");
      if (!sId) return MessageBox.error("Cannot edit: ID missing");

      this.getOwnerComponent().getRouter().navTo("EditInvoice", { id: sId });
    },

    onDelete: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      if (!oCtx) return MessageBox.error("Cannot delete: context missing");

      const sId = oCtx.getProperty("InvoiceID");
      MessageBox.confirm(`Are you sure you want to delete Invoice ${sId}?`, {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.YES) {
            oCtx.delete().then(() => {
              MessageBox.success(`Invoice ${sId} deleted successfully.`);
            }).catch((err) => {
              MessageBox.error(`Failed to delete Invoice ${sId}: ${err.message}`);
            });
          }
        }
      });
    },

    onDetail: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      if (!oCtx) return MessageBox.error("Cannot show details: context missing");

      const sId = oCtx.getProperty("InvoiceID");
      this.getOwnerComponent().getRouter().navTo("InvoiceDetail", { id: sId });
    },
/*
    
    // Refreshes the table by refreshing the model or the aggregation binding
     
    _refreshTable: function () {
      const oTable = this.byId("invoiceTable"); // Assuming your table has id="invoiceTable"
      if (oTable) {
        const oBinding = oTable.getBinding("items");
        if (oBinding) {
          oBinding.refresh();
        }
      } else if (this._oModel) {
        // Fallback: refresh whole model to update list bindings
        this._oModel.refresh();
      }
    },
*/
    formatDate: function (sDate) {
      if (!sDate) {
        return "";
      }
      let oDate = sDate instanceof Date ? sDate : new Date(sDate);
      if (isNaN(oDate)) {
        return "";
      }
      return oDate.toISOString().slice(0, 10); // yyyy-MM-dd
    }

  });
});
