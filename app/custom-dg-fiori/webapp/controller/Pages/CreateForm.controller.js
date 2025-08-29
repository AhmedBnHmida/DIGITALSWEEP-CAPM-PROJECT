sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Pages.CreateForm", {

    onInit: function () {
      const oFormModel = new JSONModel({
        No: null, Segment: "", Country: "", Product: "", Discount_Band: "",
        Units_Sold: null, Manufacturing_Price: null, Sale_Price: null,
        Gross_Sales: null, Discounts: null, Sales: null, COGS: null,
        Profit: null, Date: null, Month_Number: null, Month_Name: "", Year: null
      });
      this.getView().setModel(oFormModel);
    },

    onNavBack: function () {
      sap.ui.core.UIComponent.getRouterFor(this).navTo("ListReport");
    },

    validateForm: function (oData) {
      const required = [
        "No", "Segment", "Country", "Product", "Units_Sold", "Manufacturing_Price",
        "Sale_Price", "Gross_Sales", "Discounts", "Sales", "COGS", "Profit",
        "Date", "Month_Number", "Year"
      ];
      for (let f of required) {
        if (oData[f] === null || oData[f] === "" || oData[f] === undefined) {
          MessageBox.error("Please fill in the required field: " + f);
          return false;
        }
      }

      const numbers = [
        "Units_Sold", "Manufacturing_Price", "Sale_Price", "Gross_Sales",
        "Discounts", "Sales", "COGS", "Profit", "Month_Number", "Year"
      ];
      for (let f of numbers) {
        if (isNaN(oData[f]) || oData[f] < 0) {
          MessageBox.error("Invalid number in field: " + f);
          return false;
        }
      }
      return true;
    },

    onSavePress: function () {
      const oView = this.getView();
      const oODataModel = this.getOwnerComponent().getModel(); // OData V4
      const oData = oView.getModel().getData();

      if (!this.validateForm(oData)) {
        return;
      }

      // ✅ Format date correctly for OData V4 (yyyy-MM-dd)
      if (oData.Date instanceof Date) {
        const yyyy = oData.Date.getFullYear();
        const mm = String(oData.Date.getMonth() + 1).padStart(2, '0');
        const dd = String(oData.Date.getDate()).padStart(2, '0');
        oData.Date = `${yyyy}-${mm}-${dd}`; // "2025-08-08"
      }

      const oBindingList = oODataModel.bindList("/Finances", undefined, undefined, undefined, {
        $$updateGroupId: "createGroup"
      });

      const oContext = oBindingList.create(oData);

      oODataModel.submitBatch("createGroup")
        .then(() => {
          const sCreatedNo = oContext.getProperty("No");
          MessageBox.success("Finance record created successfully", {
            onClose: () => {
              //this.getOwnerComponent().getRouter().navTo("ListReport");
              // Navigate to Detail route with the created key
              this.getOwnerComponent().getRouter().navTo("Detail", {
                id: sCreatedNo
              });
            }
          });
        })
        .catch((err) => {
          MessageBox.error("Failed to create record: " + err.message);
          console.error("Create error:", err);
        });
    },

    // Optional: avoid console warnings for missing handlers
    onLiveChangeNo: function () {}, onLiveChangeSegment: function () {},
    onLiveChangeCountry: function () {}, onLiveChangeProduct: function () {},
    onLiveChangeUnitsSold: function () {}, onLiveChangeManufacturingPrice: function () {},
    onLiveChangeSalePrice: function () {}, onLiveChangeGrossSales: function () {},
    onLiveChangeDiscounts: function () {}, onLiveChangeSales: function () {},
    onLiveChangeCOGS: function () {}, onLiveChangeProfit: function () {},
    onLiveChangeMonthNumber: function () {}, onLiveChangeYear: function () {}

  });
});
