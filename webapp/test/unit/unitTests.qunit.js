/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
<<<<<<< HEAD
		"comdinemm/zmm0003/test/unit/AllTests"
=======
		"z002sb005/test/unit/AllTests"
>>>>>>> fba58ff (커밋)
	], function () {
		QUnit.start();
	});
});
