sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/Text",
    "sap/m/HBox",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/CheckBox",
    "sap/m/VBox",
    "sap/m/ButtonType",
    "sap/ui/model/json/JSONModel"
], function (Controller, History, MessageBox, Text, HBox, Button, Dialog, Label, CheckBox, VBox, ButtonType, JSONModel) {
    "use strict";

    return Controller.extend("customdgfiori.controller.Pages.ListReport", {
        onInit: function () {
            var aColumnsConfig = [
                { key: "Segment", label: "Segment", visible: true },
                { key: "Country", label: "Country", visible: true },
                { key: "Product", label: "Product", visible: true },
                { key: "Discount_Band", label: "Discount Band", visible: false },
                { key: "Units_Sold", label: "Units Sold", visible: false },
                { key: "Manufacturing_Price", label: "Manufacturing Price", visible: false },
                { key: "Sale_Price", label: "Sale Price", visible: false },
                { key: "Gross_Sales", label: "Gross Sales", visible: false },
                { key: "Discounts", label: "Discounts", visible: false },
                { key: "Sales", label: "Sales", visible: true },
                { key: "COGS", label: "COGS", visible: false },
                { key: "Profit", label: "Profit", visible: true },
                { key: "Date", label: "Date", visible: true }
                // Add other columns as needed...
            ];

            var oColumnsModel = new JSONModel({ columns: aColumnsConfig });
            this.getView().setModel(oColumnsModel, "columnsModel");

            this._buildTable();
        },

        _buildTable: function () {
            var oTable = this.byId("financeTable");
            oTable.removeAllColumns();

            var aColumns = this.getView().getModel("columnsModel").getProperty("/columns");
            this._visibleColumns = aColumns.filter(function (col) { return col.visible; });

            // Create columns dynamically based on visibility
            this._visibleColumns.forEach(function (col) {
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Label({ text: col.label })
                }));
            });

            // Add an "Actions" column (always visible)
            oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Actions" }),
                width: "12rem"
            }));

            // Bind items with factory template dynamically creating cells + action buttons
            oTable.bindItems({
                path: "/Finances",
                template: new sap.m.ColumnListItem({
                    cells: this._visibleColumns.map(function (col) {
                        return new sap.m.Text({
                            text: {
                                path: col.key,
                                formatter: col.key === "Date" ? this.formatDate : undefined
                            }
                        });
                    }, this).concat(
                        new HBox({
                            justifyContent: "Center",
                            items: [
                                new Button({ icon: "sap-icon://edit", type: ButtonType.Transparent, tooltip: "Edit", press: this.onEditPress.bind(this) }),
                                new Button({ icon: "sap-icon://delete", type: ButtonType.Transparent, tooltip: "Delete", press: this.onDeletePresss.bind(this) }),
                                new Button({ icon: "sap-icon://inspect", type: ButtonType.Transparent, tooltip: "Detail", press: this.onDetailPress.bind(this) })
                            ]
                        })
                    )
                })
            });
        },

        onShowColumnSelection: function () {
            // Create a Dialog with checkboxes to select visible columns
            var oModel = this.getView().getModel("columnsModel");
            var aColumns = oModel.getProperty("/columns");

            var oVBox = new VBox();
            aColumns.forEach(function (col, idx) {
                var oCheckBox = new CheckBox({
                    text: col.label,
                    selected: col.visible,
                    select: function(oEvent) {
                        aColumns[idx].visible = oEvent.getParameter("selected");
                    }
                });
                oVBox.addItem(oCheckBox);
            });

            var oDialog = new Dialog({
                title: "Select Columns to Display",
                content: oVBox,
                beginButton: new Button({
                    text: "Apply",
                    press: function () {
                        oModel.setProperty("/columns", aColumns);
                        this._buildTable(); // rebuild table with updated visibility
                        oDialog.close();
                    }.bind(this)
                }),
                endButton: new Button({
                    text: "Cancel", press: function () { oDialog.close(); }
                }),
                afterClose: function () { oDialog.destroy(); }
            });

            this.getView().addDependent(oDialog);
            oDialog.open();
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
            }
        },

        onCreatePress: function () {
            this.getOwnerComponent().getRouter().navTo("CreateForm");
        },

        onDetailPress: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext();
            var sId = oCtx.getProperty("No");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", { id: sId });
        },

        onEditPress: function (oEvent) {
            var oCtx = oEvent.getSource().getParent().getBindingContext();
            var sId = oCtx.getProperty("No");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("EditForm", { id: sId });
        },

        onDeletePresss: function (oEvent) {
            var oContext = oEvent.getSource().getParent().getBindingContext();
            var RowId = oContext.getProperty("No");
            MessageBox.confirm(
                "Are you sure you want to delete this Row with ID: " + RowId + "?",
                {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            oContext.delete("$direct")
                                .then(function () {
                                    MessageBox.success("Row ID: " + RowId + " deleted successfully.");
                                })
                                .catch(function (oError) {
                                    MessageBox.error("Error deleting Row ID: " + RowId + ". " + oError + " Please try again later.");
                                });
                        }
                    }
                }
            );
        },

        formatDate: function (sDate) {
            if (!sDate) return "";
            return new Date(sDate).toLocaleDateString();
        }
    });
});
