/* global window, parent, location */

// eslint-disable-next-line fiori-custom/sap-no-global-define
<<<<<<< HEAD
=======
	
>>>>>>> fba58ff (커밋)
window.suite = function() {
	"use strict";

	// eslint-disable-next-line
	var oSuite = new parent.jsUnitTestSuite(),
<<<<<<< HEAD
		sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

	oSuite.addTestPage(sContextPath + "unit/unitTests.qunit.html");
	oSuite.addTestPage(sContextPath + "integration/opaTests.qunit.html");
=======

	sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
	oSuite.addTestPage(sContextPath + 'unit/unitTests.qunit.html');
	oSuite.addTestPage(sContextPath + 'integration/opaTests.qunit.html');
>>>>>>> fba58ff (커밋)

	return oSuite;
};