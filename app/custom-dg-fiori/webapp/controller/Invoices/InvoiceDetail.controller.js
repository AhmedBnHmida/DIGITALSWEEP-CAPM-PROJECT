sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Invoices.InvoiceDetail", {

    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("InvoiceDetail").attachPatternMatched(this._onObjectMatched, this);
    },

    formatDate: function (sDate) {
      if (!sDate) {
        return "";
      }
      let oDate = sDate instanceof Date ? sDate : new Date(sDate);
      if (isNaN(oDate)) {
        return "";
      }
      return oDate.toISOString().slice(0, 10); // yyyy-MM-dd
    },

    _onObjectMatched: function (oEvent) {
      const sId = oEvent.getParameter("arguments").id;
      this.getView().bindElement(`/Invoices(InvoiceID='${sId}')`);
    },


    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("ListInvoice");
    }

  });
});
