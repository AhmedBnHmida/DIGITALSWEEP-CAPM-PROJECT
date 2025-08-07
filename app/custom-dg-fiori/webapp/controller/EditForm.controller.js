sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
  ], function (Controller, MessageToast) {
    "use strict";
  
    return Controller.extend("customdgfiori.controller.EditForm", {
  
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("EditForm").attachPatternMatched(this._onObjectMatched, this);
      },
  
      _onObjectMatched: function (oEvent) {
        var sId = oEvent.getParameter("arguments").id;
        var oModel = this.getView().getModel();
  
        // Bind the view to the Finance entity with key No=sId
        this.getView().bindElement("/Finance(No=" + sId + ",IsActiveEntity=true)");
      },
  
      onNavBack: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("List");
      },
  
      onSavePress: function () {
        var oView = this.getView();
        var oModel = oView.getModel();
  
        if (!oModel.hasPendingChanges()) {
          MessageToast.show("No changes to save.");
          return;
        }
  
        // Submit batch changes (OData V4)
        oModel.submitBatch().then(function () {
          MessageToast.show("Changes saved successfully.");
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("List");
        }.bind(this)).catch(function (err) {
          MessageToast.show("Save failed: " + err.message);
        });
      }
  
    });
  });
  