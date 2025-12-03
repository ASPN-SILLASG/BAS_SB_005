sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./NavigationJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
<<<<<<< HEAD
		viewNamespace: "com.dine.mm.zmm0003.view.",
=======
		viewNamespace: "z002sb005.view.",
>>>>>>> fba58ff (커밋)
		autoWait: true
	});
});
