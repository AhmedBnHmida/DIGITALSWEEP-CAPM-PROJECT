sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Invoices.CreateInvoice", {

    onInit: function () {
      const oView = this.getView();

      // Main form data model
      const oFormModel = new JSONModel({
        InvoiceID: this._generateUUID(),
        CustomerName: "",
        Country: "",
        Amount: null,
        Currency: "", // will hold the currency key
        Status: "", // will hold the status key
        IssueDate: null,
        DueDate: null,
        RelatedSegment: "" // will hold the segment key
      });
      oView.setModel(oFormModel, "formModel");

      // Segment dropdown data
      const oSegmentModel = new JSONModel({
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

      // Status dropdown data
      const oStatusModel = new JSONModel({
        statusList: [
          { Status: "Pending" },
          { Status: "Approved" },
          { Status: "Rejected" },
          { Status: "Paid" }
        ]
      });
      oView.setModel(oStatusModel, "statusModel");

      // Currency dropdown data
      const oCurrencyModel = new JSONModel({
        currencies: [
          { key: "USD", text: "US Dollar" },
          { key: "EUR", text: "Euro" },
          { key: "GBP", text: "British Pound" },
          { key: "JPY", text: "Japanese Yen" },
          { key: "TND", text: "Tunisian Dinar" }
        ]
      });
      oView.setModel(oCurrencyModel, "currencyModel");
    },

    onNavBack: function () {
      sap.ui.core.UIComponent.getRouterFor(this).navTo("ListReport");
    },

    validateForm: function (oData) {
      const required = [
        "CustomerName", "Country", "Amount", "Currency", "Status",
        "IssueDate", "DueDate", "RelatedSegment"
      ];
      for (let f of required) {
        if (oData[f] === null || oData[f] === "" || oData[f] === undefined) {
          MessageBox.error("Please fill in the required field: " + f);
          return false;
        }
      }
      if (isNaN(oData.Amount) || oData.Amount < 0) {
        MessageBox.error("Invalid number in field: Amount");
        return false;
      }
      return true;
    },

    onSavePress: function () {
      const oView = this.getView();
      const oODataModel = this.getOwnerComponent().getModel();
      const oData = oView.getModel("formModel").getData();

      if (!this.validateForm(oData)) {
        return;
      }

      // Helper function to convert date string dd/MM/yyyy to yyyy-MM-dd
      function formatDateString(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length !== 3) return null;
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }

      // Format date fields correctly to yyyy-MM-dd
      ["IssueDate", "DueDate"].forEach(dateField => {
        let val = oData[dateField];
        if (val instanceof Date) {
          const yyyy = val.getFullYear();
          const mm = String(val.getMonth() + 1).padStart(2, "0");
          const dd = String(val.getDate()).padStart(2, "0");
          oData[dateField] = `${yyyy}-${mm}-${dd}`;
        } else if (typeof val === "string" && val.includes("/")) {
          oData[dateField] = formatDateString(val);
        }
      });

      // Ensure Amount is numeric
      oData.Amount = Number(oData.Amount);

      // Build payload exactly as CDS expects
      const oCreateData = {
        InvoiceID: oData.InvoiceID,
        CustomerName: oData.CustomerName,
        Country: oData.Country,
        Amount: oData.Amount,
        Currency: oData.Currency, // simple string
        Status: oData.Status, // simple string
        RelatedSegment: oData.RelatedSegment, // simple string
        IssueDate: oData.IssueDate,
        DueDate: oData.DueDate
      };

      // Display payload in console for debugging
      console.log("Payload before sending to OData service:", oCreateData);

      const oBindingList = oODataModel.bindList("/Invoices", undefined, undefined, undefined, {
        $$updateGroupId: "createGroup"
      });

      oBindingList.create(oCreateData);

      oODataModel.submitBatch("createGroup")
        .then(() => {
          MessageBox.success("Invoice created successfully", {
            onClose: () => {
              this.getOwnerComponent().getRouter().navTo("InvoiceDetail", {
                id: oData.InvoiceID
              });
            }
          });
        })
        .catch((err) => {
          MessageBox.error("Failed to create invoice: " + err.message);
          console.error("Create error:", err);
        });
    },

    _generateUUID: function () {
      if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
      } else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }

  });
});
