sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text'
], function (Controller, JSONModel, Dialog, Button, Text) {
	"use strict";

	var Mode, id, oRouter;

	return Controller.extend("ZSHN.HW3_Node_js.controller.AddAccount", {

		onInit: function () {
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Add").attachMatched(this._onAddMatched, this);
			oRouter.getRoute("Edit").attachMatched(this._onEditMatched, this);
		},

		_onAddMatched: function (oEvent) {
			var oView = this.getView();
			oView.byId("pin").setVisible(false);
			console.log(oView.byId("pin"));
			var OModel = new JSONModel();
			this.getView().setModel(OModel, "account");

			Mode = 'A';
		},

		_onEditMatched: function (oEvent) {
			var oView = this.getView();
			oView.byId("pin").setVisible(true);
			var xhr = new XMLHttpRequest();
			var oArgs = oEvent.getParameter("arguments");
			id = oArgs.id;
			var OModel = new JSONModel();
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					var result = JSON.parse(this.response);
					result = result["0"];
					result.typeUser === "Saving" ? result.typeUser = true : result.typeUser = false;
					OModel.setData(result);
				}
			});
			xhr.open("GET", "https://odatahw3.herokuapp.com/accounts(" + id + ')');
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send();
			this.getView().setModel(OModel, "account");

			Mode = 'E';
		},

		onCancel: function (oEvent) {
			var dialog = new Dialog({
				title: 'Confirm your action',
				type: 'Message',
				content: new Text({
					text: 'Are you sure you want to cancel this window?'
				}),
				beginButton: new Button({
					text: 'Yes',
					press: function () {
						//dialog.close();
						if (Mode === 'A') {
							oRouter.navTo("WorkList");
						} else {
							oRouter.navTo("Account", {
								id: id
							});
						}
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

		onNavigate: function () {
			if (Mode === 'A') {
				oRouter.navTo("WorkList");
			} else {
				oRouter.navTo("Account", {
					id: id
				});
			}
		},

		onSave: function () {
			var oModel = this.getView().getModel("account");
			var data = JSON.parse(oModel.getJSON());

			if (Mode === 'A') {
				var xhr = new XMLHttpRequest();
				data.pin = String(Math.floor(Math.random() * (10000 - 1000) + 1000));
				data.dateCreate = String(new Date().toLocaleDateString());
				data.typeUser = data.typeUser ? data.typeUser = "Saving" : data.typeUser = "Current";
				xhr.addEventListener("readystatechange", function () {
					if (this.readyState === 4) {
						oRouter.navTo("WorkList");
					}
				});
				xhr.open('POST', "https://odatahw3.herokuapp.com/accounts");
				xhr.setRequestHeader('Content-Type', "application/json");
				xhr.send(JSON.stringify(data));
			} else {
				var xhr = new XMLHttpRequest();
				console.log(data.typeUser);
				data.typeUser === true ? data.typeUser = "Saving" : data.typeUser = "Current";

				xhr.addEventListener("readystatechange", function () {
					if (this.readyState === 4) {
						oRouter.navTo("Account", {
							id: id
						});
					}
				});
				xhr.open('PATCH', "https://odatahw3.herokuapp.com/accounts('" + id + "')");
				xhr.setRequestHeader('Content-Type', "application/json");
				xhr.send(JSON.stringify(data));
			}
		}
	});
});