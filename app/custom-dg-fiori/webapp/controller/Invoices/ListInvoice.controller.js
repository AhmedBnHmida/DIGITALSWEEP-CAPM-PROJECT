sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, MessageBox, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("customdgfiori.controller.Invoices.ListInvoice", {

    onInit: function () {
      this._oModel = this.getOwnerComponent().getModel();
      this.getView().setModel(this._oModel);
    },

    onCreate: function () {
      this.getOwnerComponent().getRouter().navTo("CreateInvoice");
    },

    onEdit: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      if (!oCtx) return MessageBox.error("Cannot edit: context missing");

      const sId = oCtx.getProperty("InvoiceID");
      if (!sId) return MessageBox.error("Cannot edit: ID missing");

      this.getOwnerComponent().getRouter().navTo("EditInvoice", { id: sId });
    },

    onDelete: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      if (!oCtx) return MessageBox.error("Cannot delete: context missing");

      const sId = oCtx.getProperty("InvoiceID");
      MessageBox.confirm(`Are you sure you want to delete Invoice ${sId}?`, {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.YES) {
            oCtx.delete().then(() => {
              MessageBox.success(`Invoice ${sId} deleted successfully.`);
            }).catch((err) => {
              MessageBox.error(`Failed to delete Invoice ${sId}: ${err.message}`);
            });
          }
        }
      });
    },

    onDetail: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      if (!oCtx) return MessageBox.error("Cannot show details: context missing");

      const sId = oCtx.getProperty("InvoiceID");
      this.getOwnerComponent().getRouter().navTo("InvoiceDetail", { id: sId });
    },


    formatDate: function (sDate) {
      if (!sDate) return "";
      let oDate = sDate instanceof Date ? sDate : new Date(sDate);
      if (isNaN(oDate)) return "";
      return oDate.toISOString().slice(0, 10); // yyyy-MM-dd
    },

    onStatusChange: function(oEvent) {
      const oSelectedItem = oEvent.getSource();
      const sNewStatus = oSelectedItem.getSelectedKey();
      const oCtx = oSelectedItem.getBindingContext();

      if (!oCtx) return MessageBox.error("Cannot update status: context missing");

      oCtx.setProperty("Status", sNewStatus);
      this._oModel.update(oCtx.getPath(), oCtx.getObject(), {
        success: () => MessageBox.success(`Status updated to ${sNewStatus}`),
        error: (err) => MessageBox.error(`Failed to update status: ${err.message}`)
      });
    },

    // Consolidated filter function for all filters including global search
    onFilterChange: function() {
    const oView = this.getView();
    const oTable = this.byId("invoiceTable");
    const oBinding = oTable.getBinding("items");

    let aFilters = [];

    // Customer Name
    const sCustomer = oView.byId("customerSearch").getValue();
    if (sCustomer) aFilters.push(new Filter("CustomerName", FilterOperator.Contains, sCustomer));

    // Country
    const sCountry = oView.byId("countrySearch").getValue();
    if (sCountry) aFilters.push(new Filter("Country", FilterOperator.Contains, sCountry));

    // Amount
    const sAmount = oView.byId("amountSearch").getValue();
    if (sAmount && !isNaN(sAmount)) aFilters.push(new Filter("Amount", FilterOperator.EQ, parseFloat(sAmount)));

    // Currency
    const sCurrency = oView.byId("currencySearch").getSelectedKey();
    if (sCurrency) aFilters.push(new Filter("Currency", FilterOperator.EQ, sCurrency));

    // Status
    const sStatus = oView.byId("statusSearch").getSelectedKey();
    if (sStatus) aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));

    // Issue Date range filter
    const oIssueDate = oView.byId("issueDateSearch").getDateValue();
    if (oIssueDate) {
      const sIssueDate = this.formatDate(oIssueDate);
      const oNextIssueDate = new Date(oIssueDate);
      oNextIssueDate.setDate(oNextIssueDate.getDate() + 1);
      const sNextIssueDate = this.formatDate(oNextIssueDate);

      const oFilterIssueFrom = new Filter("IssueDate", FilterOperator.GE, sIssueDate);
      const oFilterIssueTo = new Filter("IssueDate", FilterOperator.LT, sNextIssueDate);
      aFilters.push(new Filter([oFilterIssueFrom, oFilterIssueTo], true));
    }

    // Due Date range filter
    const oDueDate = oView.byId("dueDateSearch").getDateValue();
    if (oDueDate) {
      const sDueDate = this.formatDate(oDueDate);
      const oNextDueDate = new Date(oDueDate);
      oNextDueDate.setDate(oNextDueDate.getDate() + 1);
      const sNextDueDate = this.formatDate(oNextDueDate);

      const oFilterDueFrom = new Filter("DueDate", FilterOperator.GE, sDueDate);
      const oFilterDueTo = new Filter("DueDate", FilterOperator.LT, sNextDueDate);
      aFilters.push(new Filter([oFilterDueFrom, oFilterDueTo], true));
    }

    // Related Segment
    const sSegment = oView.byId("segmentSearch").getSelectedKey();
    if (sSegment) aFilters.push(new Filter("RelatedSegment", FilterOperator.EQ, sSegment));

    // Global Search filters applied as OR group combined with other filters
    const sGlobalQuery = oView.byId("globalSearch").getValue();
    if (sGlobalQuery) {
      let aGlobalFilters = [
        new Filter("CustomerName", FilterOperator.Contains, sGlobalQuery),
        new Filter("Country", FilterOperator.Contains, sGlobalQuery),
        !isNaN(sGlobalQuery) ? new Filter("Amount", FilterOperator.EQ, parseFloat(sGlobalQuery)) : null,
        new Filter("Currency", FilterOperator.Contains, sGlobalQuery),
        new Filter("Status", FilterOperator.Contains, sGlobalQuery),
        new Filter("IssueDate", FilterOperator.Contains, sGlobalQuery),
        new Filter("DueDate", FilterOperator.Contains, sGlobalQuery),
        new Filter("RelatedSegment", FilterOperator.Contains, sGlobalQuery)
      ].filter(f => f !== null);

      aFilters.push(new Filter(aGlobalFilters, false)); // OR combination inside AND
    }

    // Apply combined filters (AND)
    oBinding.filter(aFilters.length ? new Filter(aFilters, true) : []);
  },


    // For individual search inputs, just call onFilterChange to avoid overwriting
    onSearchCustomer: function() { this.onFilterChange(); },
    onSearchCountry: function() { this.onFilterChange(); },
    onSearchAmount: function() { this.onFilterChange(); },
    onSearchCurrency: function() { this.onFilterChange(); },
    onSearchStatus: function() { this.onFilterChange(); },
    onSearchIssueDate: function() { this.onFilterChange(); },
    onSearchDueDate: function() { this.onFilterChange(); },
    onSearchSegment: function() { this.onFilterChange(); },
    onGlobalSearch: function() { this.onFilterChange(); }

  });
});
