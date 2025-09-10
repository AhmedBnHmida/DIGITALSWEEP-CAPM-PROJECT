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
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, History, MessageBox, Text, HBox, Button, Dialog, Label, CheckBox, VBox, ButtonType, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("customdgfiori.controller.Pages.ListReport", {
        onInit: function () {
            // Columns config with visibility flags
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
                { key: "Date", label: "Date", visible: true },
                // Added new attributes
                { key: "Month_Number", label: "Month Number", visible: false },
                { key: "Month_Name", label: "Month Name", visible: false },
                { key: "Year", label: "Year", visible: false },
                { key: "ExchangeRateToEUR", label: "Exchange Rate to EUR", visible: false }
            ];

            var oColumnsModel = new JSONModel({ columns: aColumnsConfig });
            this.getView().setModel(oColumnsModel, "columnsModel");

            this._buildTable();
        },

        _buildTable: function () {
            var oTable = this.byId("financeTable");
            oTable.removeAllColumns();

            var aColumns = this.getView().getModel("columnsModel").getProperty("/columns");
            this._visibleColumns = aColumns.filter(col => col.visible);

            // Add dynamic columns
            this._visibleColumns.forEach(col => {
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Label({ text: col.label })
                }));
            });

            // Add actions column
            oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Actions" }),
                width: "12rem"
            }));

            // Bind items with dynamic cells and action buttons
            oTable.bindItems({
                path: "/Finances",
                template: new sap.m.ColumnListItem({
                    cells: this._visibleColumns.map(col => {
                        return new sap.m.Text({
                            text: {
                                path: col.key,
                                formatter: col.key === "Date" ? this.formatDate : undefined
                            }
                        });
                    }).concat(
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
            var oModel = this.getView().getModel("columnsModel");
            var aColumns = oModel.getProperty("/columns");

            var oVBox = new VBox();
            aColumns.forEach(function (col, idx) {
                var oCheckBox = new CheckBox({
                    text: col.label,
                    selected: col.visible,
                    select: function (oEvent) {
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
                        this._buildTable();
                        oDialog.close();
                    }.bind(this)
                }),
                endButton: new Button({
                    text: "Cancel", press: function () { oDialog.close(); }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            this.getView().addDependent(oDialog);
            oDialog.open();
        },

        onFilterChange: function () {
            var oView = this.getView();
            var oTable = this.byId("financeTable");
            var oBinding = oTable.getBinding("items");

            var aFilters = [];

            // Global Search: OR filter on important columns
            var sGlobalQuery = oView.byId("globalSearch1").getValue();
            if (sGlobalQuery) {
                var aGlobalFilters = [
                    new Filter("Segment", FilterOperator.Contains, sGlobalQuery),
                    new Filter("Country", FilterOperator.Contains, sGlobalQuery),
                    new Filter("Product", FilterOperator.Contains, sGlobalQuery)
                ];
                aFilters.push(new Filter(aGlobalFilters, false)); // OR group
            }

            // Country MultiComboBox: OR filter for selected countries
            var aSelectedCountries = oView.byId("countrySearch1").getSelectedKeys();
            if (aSelectedCountries.length > 0) {
                var countryFilters = aSelectedCountries.map(c => new Filter("Country", FilterOperator.EQ, c));
                aFilters.push(new Filter(countryFilters, false)); // OR between selected countries
            }

            // Segment MultiComboBox: OR filter for selected segments (changed from Select to MultiComboBox)
            var aSelectedSegments = oView.byId("segmentSearch1").getSelectedKeys();
            if (aSelectedSegments.length > 0) {
                var segmentFilters = aSelectedSegments.map(s => new Filter("Segment", FilterOperator.EQ, s));
                aFilters.push(new Filter(segmentFilters, false)); // OR between selected segments
            }

            // Date picker: EQ filter on date string formatted to yyyy-MM-dd
            var oDate = oView.byId("dateSearch1").getDateValue();
            if (oDate) {
                var sDateStr = this.formatDate(oDate);
                aFilters.push(new Filter("Date", FilterOperator.EQ, sDateStr));
            }

            // Apply combined filters with AND logic
            oBinding.filter(aFilters.length ? new Filter(aFilters, true) : []);
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
            var oDate = new Date(sDate);
            var yyyy = oDate.getFullYear();
            var mm = String(oDate.getMonth() + 1).padStart(2, "0");
            var dd = String(oDate.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        }
    });
});
