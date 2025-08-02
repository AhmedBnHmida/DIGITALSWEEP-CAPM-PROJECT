sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";
  return Controller.extend("dgfiori.ext.controller.ChartButton", {
    onGoToChart: function () {
      const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("FinanceChart");
    }
  });
});
