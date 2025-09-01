sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], function (Controller, MessageBox) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Invoices.EditInvoice", {

    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("EditInvoice").attachPatternMatched(this._onObjectMatched, this);

      // Load dropdown data models
      this._loadDropdownModels();
    },

    _loadDropdownModels: function () {
      const oView = this.getView();

      // Status dropdown
      const oStatusModel = new sap.ui.model.json.JSONModel({
        statusList: [
          { Status: "Pending" },
          { Status: "Approved" },
          { Status: "Rejected" },
          { Status: "Paid" }
        ]
      });
      oView.setModel(oStatusModel, "statusModel");

      // Currency dropdown
      const oCurrencyModel = new sap.ui.model.json.JSONModel({
        currencies: [
          { key: "USD", text: "US Dollar" },
          { key: "EUR", text: "Euro" },
          { key: "GBP", text: "British Pound" },
          { key: "JPY", text: "Japanese Yen" },
          { key: "TND", text: "Tunisian Dinar" }
        ]
      });
      oView.setModel(oCurrencyModel, "currencyModel");

      // Segment dropdown
      const oSegmentModel = new sap.ui.model.json.JSONModel({
        segments: [
          { SegmentName: "cc" },
          { SegmentName: "Channel Partners" },
          { SegmentName: "Enterprise" },
          { SegmentName: "Government" },
          { SegmentName: "Midmarket" },
          { SegmentName: "Small Business" }
        ]
      });
      oView.setModel(oSegmentModel, "segmentModel");
    },

    _onObjectMatched: function (oEvent) {
      const sId = oEvent.getParameter("arguments").id;
      this.getView().bindElement({
        path: `/Invoices(InvoiceID='${sId}')`,
        parameters: { $$updateGroupId: "updateGroup" }
      });
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("ListInvoice");
    },

    onSavePress: function () {
      const oModel = this.getView().getModel();
      const oContext = this.getView().getBindingContext();

      if (!oContext) {
        MessageBox.error("Please load the invoice data first.");
        return;
      }

      if (!oContext.hasPendingChanges()) {
        return MessageBox.information("No changes to save");
      }

      // Validate required fields
      const requiredFields = ["CustomerName", "Country", "Amount", "Currency", "Status", "IssueDate", "DueDate", "RelatedSegment"];
      for (let field of requiredFields) {
        const value = oContext.getProperty(field);
        if (value === null || value === "" || value === undefined) {
          MessageBox.error(`Please fill in the required field: ${field}`);
          return;
        }
      }

      const amountValue = oContext.getProperty("Amount");
      if (isNaN(amountValue) || amountValue < 0) {
        MessageBox.error("Invalid number in field: Amount");
        return;
      }

      oModel.submitBatch("updateGroup").then(() => {
        MessageBox.success("Invoice updated successfully", {
          onClose: () => this.onNavBack()
        });
      }).catch((err) => {
        MessageBox.error("Update failed: " + err.message);
        console.error(err);
      });
    },

    onCancel: function () {
      this.onNavBack();
    }

  });
});
