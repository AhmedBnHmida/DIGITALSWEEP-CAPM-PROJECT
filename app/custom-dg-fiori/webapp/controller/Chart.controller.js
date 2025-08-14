sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(Controller) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Chart", {

    onAfterRendering: function() {
      var oVizFrame = this.byId("idPieChart");
      if (oVizFrame) {
        oVizFrame.setVizProperties({
          title: {
            text: "Sales and Profit by Segment and Country"
          },
          plotArea: {
            drawingEffect: "glossy",
            dataLabel: {
              visible: true,
              formatString: "#,##0.00",
              type: "percentage"
            }
          },
          legend: {
            visible: true,
            position: "right"
          }
        });
      }
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("RouteView1");
    }

  });
});
