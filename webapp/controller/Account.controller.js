sap.ui.define([
"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text'
], function (Controller, JSONModel, Dialog, Button, Text) {
	"use strict";

	return Controller.extend("ZSHN.HW3_Node_js.controller.Account", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Account").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			var xhr = new XMLHttpRequest();
			var oArgs = oEvent.getParameter("arguments");
			var OModel = new JSONModel();
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					var result = JSON.parse(this.response);
					OModel.setData(result["0"]);
				}
			});
			xhr.open("GET", "https://odatahw3.herokuapp.com/accounts(" + oArgs.id + ')');
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send();
			this.getView().setModel(OModel, "account");
		},

		onDelete: function (oEvent) {
			var oModel = this.getView().getModel("account");
			var data = oModel.getJSON();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var xhr = new XMLHttpRequest();
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					oRouter.navTo("WorkList");
				}
			});
			var dialog = new Dialog({
				title: 'Confirm your action',
				type: 'Message',
				content: new Text({
					text: 'Are you sure you want to delete this account?'
				}),
				beginButton: new Button({
					text: 'Yes',
					press: function () {
						xhr.open("DELETE", "https://odatahw3.herokuapp.com/accounts('" + JSON.parse(data)._id +"')");
						xhr.setRequestHeader("Content-Type", "application/json");
						xhr.send();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onEdit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var id = this.getView().byId("accId").getProperty("text");
			oRouter.navTo("Edit", {
				id: id
			});
		},
		
		onNavigate: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("WorkList");
		}
	});

});