/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZSHN/HW3_Node_js/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});