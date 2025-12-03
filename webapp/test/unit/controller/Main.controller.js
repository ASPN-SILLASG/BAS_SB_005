/*global QUnit*/

sap.ui.define([
<<<<<<< HEAD
	"comdinemm/zmm0003/controller/Main.controller"
=======
	"z002sb005/controller/Main.controller"
>>>>>>> fba58ff (커밋)
], function (Controller) {
	"use strict";

	QUnit.module("Main Controller");

	QUnit.test("I should test the Main controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
