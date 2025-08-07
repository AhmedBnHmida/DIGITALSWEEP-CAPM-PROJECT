sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("customdgfiori.controller.CreateForm", {
/*
    onInit: function () {
      var oModel = this.getOwnerComponent().getModel();
    
      // Create empty entry structure
      var oContext = oModel.createEntry("/Finance");
    
      // Bind to the page or form
      this.getView().setBindingContext(oContext);
    },
    */

    onInit: function () {
      // Optional: attach empty model for the form
      var oModel = new JSONModel({
        No: null, // Integer, can be null or 0 if backend handles auto-increment
        Segment: "",
        Country: "",
        Product: "",
        Discount_Band: "",
        Units_Sold: null, // Null for numbers is important for empty input
        Manufacturing_Price: null,
        Sale_Price: null,
        Gross_Sales: null,
        Discounts: null,
        Sales: null,
        COGS: null,
        Profit: null,
        Date: null, // Date, can be null or initialized to a Date object
        Month_Number: null,
        Month_Name: "",
        Year: null  
      });
      this.getView().setModel(oModel);
    },

    onNavBack: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("List"); // change "List" to your list view route name
    },

    onCancelPress: function () {
      this.onNavBack();
    },
 

    onSavePress: function () {
      const oView = this.getView();
      const oODataModel = this.getOwnerComponent().getModel(); // OData V4 model
      const oJsonModel = oView.getModel(); // your JSON model with form data
      const oData = oJsonModel.getData();
    
      let bValid = true;
    
      // Helper to set Input state & message
      function validateInput(sFieldId, bCondition, sErrorMsg) {
        const oInput = oView.byId(sFieldId);
        if (!bCondition) {
          oInput.setValueState(sap.ui.core.ValueState.Error);
          oInput.setValueStateText(sErrorMsg);
          bValid = false;
        } else {
          oInput.setValueState(sap.ui.core.ValueState.None);
          oInput.setValueStateText("");
        }
      }
    
      // Validate mandatory fields example:
      validateInput("inputNo", oData.No && oData.No.toString().trim() !== "", "No is required");
      validateInput("inputSegment", oData.Segment && oData.Segment.trim() !== "", "Segment is required");
      validateInput("inputCountry", oData.Country && oData.Country.trim() !== "", "Country is required");
      validateInput("inputProduct", oData.Product && oData.Product.trim() !== "", "Product is required");
    
      // Validate Date
      const oDate = new Date(oData.Date);
      if (!(oDate instanceof Date) || isNaN(oDate)) {
        sap.m.MessageToast.show("Invalid date format.");
        bValid = false;
      }
    
      if (!bValid) {
        sap.m.MessageToast.show("Please correct errors before saving.");
        return;
      }
    
      // Format Date as yyyy-MM-dd string (if backend expects string)
      const yyyy = oDate.getFullYear();
      const mm = String(oDate.getMonth() + 1).padStart(2, "0");
      const dd = String(oDate.getDate()).padStart(2, "0");
      oData.Date = `${yyyy}-${mm}-${dd}`;
    
      // Convert numeric fields safely
      ["Units_Sold", "Manufacturing_Price", "Sale_Price", "Gross_Sales", "Discounts", "Sales", "COGS", "Profit", "Month_Number", "Year"].forEach(field => {
        oData[field] = Number(oData[field]) || 0;
      });
    
      // Create the new entity using OData V4 create, which immediately sends POST request
      // Create draft
      const oListBinding = oODataModel.bindList("/Finance");
      const oContext = oListBinding.create(oData);

      oContext.created()
        .then(() => {
          // After draft created, activate it to persist data
          return oContext.executeAction("DraftActivate");
        })
        .then(() => {
          sap.m.MessageToast.show("Finance entry created and saved successfully!");

          const sPath = oContext.getPath(); // e.g. /Finance(No='1010')
          const sKeyString = sPath.match(/\(([^)]+)\)/)[1];
          const oKeys = {};
          sKeyString.split(",").forEach(pair => {
            const [key, value] = pair.split("=");
            oKeys[key.trim()] = value.trim().replace(/'/g, "");
          });

          const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("Detail", {
            id: oKeys.No
          });
        })
        .catch((oError) => {
          sap.m.MessageToast.show("Creation failed: " + (oError.message || oError));
        });
    }
    
    
    
    
    
    
    
    
    
    
    
  });
});
