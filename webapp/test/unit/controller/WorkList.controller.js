/*global QUnit*/

sap.ui.define([
	"ZSHN/HW3_Node_js/controller/WorkList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("WorkList Controller");

	QUnit.test("I should test the WorkList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});