sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("customdgfiori.controller.Detail", {
  
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
      },
  
      _onObjectMatched: function (oEvent) {
        const sId = oEvent.getParameter("arguments").id;
        const oModel = this.getView().getModel();
  
        // Bind the view to the selected entity
        this.getView().bindElement("/Finance(No=" + sId + ",IsActiveEntity=true)");
      },
  
      onNavBack: function () {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("List"); // or your main route
      }
  
    });
  });
  