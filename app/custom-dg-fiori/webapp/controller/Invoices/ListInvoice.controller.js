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

    /**
     * Format a Date or a date-like string into "yyyy-MM-dd" using LOCAL date parts
     * (avoids timezone-shift issues caused by toISOString()).
     *
     * Accepts:
     *  - Date object
     *  - "yyyy-MM-dd" string
     *  - any string that can be parsed into a Date (best-effort)
     */
    formatDate: function (sDate) {
      if (!sDate && sDate !== 0) return "";
      let oDate = null;

      if (sDate instanceof Date) {
        oDate = sDate;
      } else if (typeof sDate === "string") {
        // Prefer explicit YYYY-MM-DD or DD/MM/YYYY parsing to avoid UTC parsing surprises.
        let m;
        if ((m = sDate.match(/^(\d{4})-(\d{2})-(\d{2})$/))) {
          // "YYYY-MM-DD" -> local date
          oDate = new Date(+m[1], +m[2] - 1, +m[3]);
        } else if ((m = sDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/))) {
          // "DD/MM/YYYY" -> local date
          oDate = new Date(+m[3], +m[2] - 1, +m[1]);
        } else {
          // fallback: try to parse then normalize to local Y/M/D
          const parsed = new Date(sDate);
          if (!isNaN(parsed)) {
            oDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
          }
        }
      } else {
        // other input -> try to construct
        const parsed = new Date(sDate);
        if (!isNaN(parsed)) {
          oDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
        }
      }

      if (!oDate || isNaN(oDate)) return "";

      const yyyy = oDate.getFullYear();
      const mm = String(oDate.getMonth() + 1).padStart(2, "0");
      const dd = String(oDate.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },

    /**
     * Parse a user-entered date string into a local Date object.
     * Supports:
     *   - "YYYY-MM-DD"
     *   - "DD/MM/YYYY"
     *   - other parseable formats (best-effort)
     *
     * Returns null if parsing fails.
     */
    _parseDateInput: function (s) {
      if (!s || typeof s !== "string") return null;
      const str = s.trim();
      let m;
      if ((m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) {
        return new Date(+m[1], +m[2] - 1, +m[3]);
      }
      if ((m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) {
        // dd/mm/yyyy
        return new Date(+m[3], +m[2] - 1, +m[1]);
      }
      // fallback: parse and normalize to local date
      const parsed = new Date(str);
      if (!isNaN(parsed)) {
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      }
      return null;
    },
/*
    onStatusChange: function (oEvent) {
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
*/
    // Consolidated filter function
    onFilterChange: function () {
      const oView = this.getView();
      const oTable = this.byId("invoiceTable");
      const oBinding = oTable.getBinding("items");

      let aFilters = [];

      /* Customer Name
      const sCustomer = oView.byId("customerSearch").getValue();
      if (sCustomer) aFilters.push(new Filter("CustomerName", FilterOperator.Contains, sCustomer));
      */

      /* Country
      const sCountry = oView.byId("countrySearch").getValue();
      if (sCountry) aFilters.push(new Filter("Country", FilterOperator.Contains, sCountry));
      */
     
      // Country (multi-select)
      const aSelectedCountries = oView.byId("countrySearch").getSelectedKeys();
      if (aSelectedCountries.length > 0) {
        const aCountryFilters = aSelectedCountries.map(c => new Filter("Country", FilterOperator.EQ, c));
        aFilters.push(new Filter(aCountryFilters, false)); // OR between selected countries
      }


      /* Amount
      const sAmount = oView.byId("amountSearch").getValue();
      if (sAmount && !isNaN(sAmount)) aFilters.push(new Filter("Amount", FilterOperator.EQ, parseFloat(sAmount)));
      */

      // Currency
      const sCurrency = oView.byId("currencySearch").getSelectedKey();
      if (sCurrency) aFilters.push(new Filter("Currency", FilterOperator.EQ, sCurrency));

      // Status
      const sStatus = oView.byId("statusSearch").getSelectedKey();
      if (sStatus) aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));

      // Issue Date (single date match — uses local yyyy-MM-dd)
      const oIssueDate = oView.byId("issueDateSearch").getDateValue();
      if (oIssueDate) {
        const sIssueDate = this.formatDate(oIssueDate);
        aFilters.push(new Filter("IssueDate", FilterOperator.EQ, sIssueDate));
      }

      // Due Date (single date match — uses local yyyy-MM-dd)
      const oDueDate = oView.byId("dueDateSearch").getDateValue();
      if (oDueDate) {
        const sDueDate = this.formatDate(oDueDate);
        aFilters.push(new Filter("DueDate", FilterOperator.EQ, sDueDate));
      }

      // Related Segment
      const sSegment = oView.byId("segmentSearch").getSelectedKey();
      if (sSegment) aFilters.push(new Filter("RelatedSegment", FilterOperator.EQ, sSegment));

      // Global Search
      const sGlobalQuery = oView.byId("globalSearch").getValue();
      if (sGlobalQuery) {
        let aGlobalFilters = [
          //new Filter("CustomerName", FilterOperator.Contains, sGlobalQuery),
          new Filter("Country", FilterOperator.Contains, sGlobalQuery),
          //!isNaN(sGlobalQuery) ? new Filter("Amount", FilterOperator.EQ, parseFloat(sGlobalQuery)) : null,
          new Filter("Currency", FilterOperator.Contains, sGlobalQuery),
          new Filter("Status", FilterOperator.Contains, sGlobalQuery),
          new Filter("RelatedSegment", FilterOperator.Contains, sGlobalQuery)
        ];

        // Try parse as a date (local)
        const oParsedDate = this._parseDateInput(sGlobalQuery);
        if (oParsedDate) {
          const sDateStr = this.formatDate(oParsedDate);
          aGlobalFilters.push(new Filter("IssueDate", FilterOperator.EQ, sDateStr));
          aGlobalFilters.push(new Filter("DueDate", FilterOperator.EQ, sDateStr));
        }

        aGlobalFilters = aGlobalFilters.filter(f => f !== null);
        aFilters.push(new Filter(aGlobalFilters, false)); // OR group
      }

      // Apply combined filters (AND between the groups)
      oBinding.filter(aFilters.length ? new Filter(aFilters, true) : []);
    },

    // Individual search handlers just call central filter function
    //onSearchCustomer: function () { this.onFilterChange(); },
    onSearchCountry: function () { this.onFilterChange(); },
    //onSearchAmount: function () { this.onFilterChange(); },
    onSearchCurrency: function () { this.onFilterChange(); },
    onSearchStatus: function () { this.onFilterChange(); },
    onSearchIssueDate: function () { this.onFilterChange(); },
    onSearchDueDate: function () { this.onFilterChange(); },
    onSearchSegment: function () { this.onFilterChange(); },
    onGlobalSearch: function () { this.onFilterChange(); }

  });
});
