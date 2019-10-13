sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("ZSHN.HW3_Node_js.controller.WorkList", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("WorkList").attachMatched(this._onRouteMatched, this);
			this.readOData();
		},

		_onRouteMatched: function (oEvent) {
			this.readOData();
		},

		readOData: function() {
			var xhr = new XMLHttpRequest();
			var OModel = new JSONModel();
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					var result = this.response;
					OModel.setData(JSON.parse(result));
					//console.log(result);
				}
			});
			xhr.open("GET", "https://odatahw3.herokuapp.com/accounts",true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
			xhr.send();
			this.getView().setModel(OModel, "accounts");
		},

		onItemPress: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oItem = oEvent.getSource();
			oRouter.navTo("Account", {
				id: oItem.getBindingContext("accounts").getProperty("_id")
			});
		},

		onAdd: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			console.log(oRouter);
		    oRouter.navTo("Add");
		}
	});
});