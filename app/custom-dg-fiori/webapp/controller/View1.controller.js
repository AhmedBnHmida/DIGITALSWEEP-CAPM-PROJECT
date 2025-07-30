sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("customdgfiori.controller.View1", {
        onInit() {
        },
        onCollapseExpandPress() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},

		onHideShowWalkedPress() {
			const oNavListItem = this.byId("walked");
			oNavListItem.setVisible(!oNavListItem.getVisible());
		},

        onListPress: function() {
            this.getOwnerComponent().getRouter().navTo("ListReport");
          },
          
          onCreatePress: function() {
            this.getOwnerComponent().getRouter().navTo("CreateForm");
          }
              
    });
});