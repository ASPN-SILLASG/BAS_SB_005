sap.ui.define(
    [
        "sap/ui/base/Object",
        'sap/m/p13n/MetadataHelper',
        'sap/m/p13n/Engine',
        'sap/m/p13n/SelectionController',
        'sap/m/p13n/SortController',
        'sap/m/p13n/GroupController',
        'sap/m/table/ColumnWidthController',
        'sap/ui/core/library',
        "sap/ui/model/Sorter",

    ],
    function (BaseObject, MetadataHelper, Engine, SelectionController, SortController, GroupController, ColumnWidthController, CoreLibrary, Sorter) {

        var _oTable;
<<<<<<< HEAD
        return BaseObject.extend("com.dine.mm.zmm0003.controller.Config.ColumEngine", {
=======
        return BaseObject.extend("z002sb005.controller.Config.ColumEngine", {
>>>>>>> fba58ff (커밋)



            constructor: function (control) {
                this.control = control;
            },

            initEngine: function (table) {
                _oTable = table;

                Engine.getInstance().register(table, {
                    helper: this.getMetadataHelper(),
                    controller: {
                        Columns: new SelectionController({
                            targetAggregation: "columns",
                            control: table
                        }),
                        Sorter: new SortController({
                            control: table
                        }),
                        Groups: new GroupController({
                            control: table
                        }),
                        ColumnWidth: new ColumnWidthController({
                            control: table
                        })
                    }
                });

                Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
            },

            getMetadataHelper: function (i18n) {

                if (!this.oMetadataHelper) {

                    this.oMetadataHelper = new MetadataHelper([
<<<<<<< HEAD
                        {
                            key: "idColSpmon",
                            label: i18n.getText("DateSelect"),
                            path: "Spmon"
                        }, {
                            key: "idColBwkey",
                            label: i18n.getText("Bwkey"),
                            path: "Bwkey"
                        },
                        {
                            key: "idColBklas",
                            label: i18n.getText("Bklas"),
                            path: "Bklas"
                        },
                        {
                            key: "idColBklast",
                            label: i18n.getText("Bklast"),
                            path: "Bklast"
                        },
                        {
                            key: "idColMatnr",
                            label: i18n.getText("ProductNo"),
                            path: "Matnr"
                        },
                        { key: "idColmaktx", label: "자재명", path: "maktx" },
                        {
                            key: "idColMatkl",
                            label: i18n.getText("Matkl"),
                            path: "Matkl"
                        },
                        {
                            key: "idColMatklt",
                            label: i18n.getText("Matklt"),
                            path: "Matklt"
                        },
                        {
                            key: "idColExtwg",
                            label: i18n.getText("Extwg"),
                            path: "Extwg"
                        },
                        {
                            key: "idColExtwgt",
                            label: i18n.getText("Extwgt"),
                            path: "Extwgt"
                        },
                        {
                            key: "idColMaker",
                            label: i18n.getText("Maker"),
                            path: "Maker"
                        },
                        {
                            key: "idColYY1MAKER",
                            label: i18n.getText("YY1_MAT_MAKER_PRDT"),
                            path: "YY1_MAT_MAKER_PRDT"
                        },
                        {
                            key: "idColPrange",
                            label: i18n.getText("Prange"),
                            path: "Prange"
                        },
                        {
                            key: "idColYY1RANGE",
                            label: i18n.getText("YY1_PROD_RANGE_PRDT"),
                            path: "YY1_PROD_RANGE_PRDT"
                        },
                        {
                            key: "idColMat_JJ",
                            label: i18n.getText("Mat_JJ"),
                            path: "Mat_JJ"
                        },
                        {
                            key: "idColPNP",
                            label: i18n.getText("PNP"),
                            path: "PNP"
                        },
                        {
                            key: "idColMeins",
                            label: i18n.getText("Meins"),
                            path: "Meins"
                        },
                        {
                            key: "idColWaers",
                            label: i18n.getText("Waers"),
                            path: "Waers"
                        }
=======
                        // {
                        //     key: "idColBwkey",
                        //     label: i18n.getText("Bwkey"),
                        //     path: "Bwkey"
                        // },
                        // {
                        //     key: "idColBklas",
                        //     label: i18n.getText("Bklas"),
                        //     path: "Bklas"
                        // },
                        // {
                        //     key: "idColBklast",
                        //     label: i18n.getText("Bklast"),
                        //     path: "Bklast"
                        // },
                        // {
                        //     key: "idColMatnr",
                        //     label: i18n.getText("ProductNo"),
                        //     path: "Matnr"
                        // },
                        // { key: "idColmaktx", label: "자재명", path: "maktx" },
                        // {
                        //     key: "idColMatkl",
                        //     label: i18n.getText("Matkl"),
                        //     path: "Matkl"
                        // },
                        // {
                        //     key: "idColMatklt",
                        //     label: i18n.getText("Matklt"),
                        //     path: "Matklt"
                        // },
                        // {
                        //     key: "idColExtwg",
                        //     label: i18n.getText("Extwg"),
                        //     path: "Extwg"
                        // },
                        // {
                        //     key: "idColExtwgt",
                        //     label: i18n.getText("Extwgt"),
                        //     path: "Extwgt"
                        // },
                        // {
                        //     key: "idColMaker",
                        //     label: i18n.getText("Maker"),
                        //     path: "Maker"
                        // },
                        // {
                        //     key: "idColYY1MAKER",
                        //     label: i18n.getText("YY1_MAT_MAKER_PRDT"),
                        //     path: "YY1_MAT_MAKER_PRDT"
                        // },
                        // {
                        //     key: "idColPrange",
                        //     label: i18n.getText("Prange"),
                        //     path: "Prange"
                        // },
                        // {
                        //     key: "idColYY1RANGE",
                        //     label: i18n.getText("YY1_PROD_RANGE_PRDT"),
                        //     path: "YY1_PROD_RANGE_PRDT"
                        // },
                        // {
                        //     key: "idColMat_JJ",
                        //     label: i18n.getText("Mat_JJ"),
                        //     path: "Mat_JJ"
                        // },
                        // {
                        //     key: "idColPNP",
                        //     label: i18n.getText("PNP"),
                        //     path: "PNP"
                        // },
                        // {
                        //     key: "idColMeins",
                        //     label: i18n.getText("Meins"),
                        //     path: "Meins"
                        // },
                        // {
                        //     key: "idColWaers",
                        //     label: i18n.getText("Waers"),
                        //     path: "Waers"
                        // }
>>>>>>> fba58ff (커밋)

                    ]);

                }
                return this.oMetadataHelper;
            },

            addHelper: function (i18n, aColums) {

<<<<<<< HEAD
                let aArray = [{
                    key: "idColSpmon",
                    label: i18n.getText("DateSelect"),
                    path: "Spmon"
                }, {
                    key: "idColBwkey",
                    label: i18n.getText("Bwkey"),
                    path: "Bwkey"
                },
                {
                    key: "idColBklas",
                    label: i18n.getText("Bklas"),
                    path: "Bklas"
                },
                {
                    key: "idColBklast",
                    label: i18n.getText("Bklast"),
                    path: "Bklast"
                },
                {
                    key: "idColMatnr",
                    label: i18n.getText("ProductNo"),
                    path: "Matnr"
                },
                { key: "idColmaktx", label: "자재명", path: "maktx" },
                {
                    key: "idColMatkl",
                    label: i18n.getText("Matkl"),
                    path: "Matkl"
                },
                {
                    key: "idColMatklt",
                    label: i18n.getText("Matklt"),
                    path: "Matklt"
                },
                {
                    key: "idColExtwg",
                    label: i18n.getText("Extwg"),
                    path: "Extwg"
                },
                {
                    key: "idColExtwgt",
                    label: i18n.getText("Extwgt"),
                    path: "Extwgt"
                },
                {
                    key: "idColMaker",
                    label: i18n.getText("Maker"),
                    path: "Maker"
                },
                {
                    key: "idColYY1MAKER",
                    label: i18n.getText("YY1_MAT_MAKER_PRDT"),
                    path: "YY1_MAT_MAKER_PRDT"
                },
                {
                    key: "idColPrange",
                    label: i18n.getText("Prange"),
                    path: "Prange"
                },
                {
                    key: "idColYY1RANGE",
                    label: i18n.getText("YY1_PROD_RANGE_PRDT"),
                    path: "YY1_PROD_RANGE_PRDT"
                },
                {
                    key: "idColMat_JJ",
                    label: i18n.getText("Mat_JJ"),
                    path: "Mat_JJ"
                },
                {
                    key: "idColPNP",
                    label: i18n.getText("PNP"),
                    path: "PNP"
                },
                {
                    key: "idColMeins",
                    label: i18n.getText("Meins"),
                    path: "Meins"
                },
                {
                    key: "idColWaers",
                    label: i18n.getText("Waers"),
                    path: "Waers"
                }]
=======
                let aArray = [
                    {
                        key: "idColBwkey",
                        label: "플랜트",
                        path: "Bwkey"
                    },
                    {
                        key: "idColBklast",
                        label: "평가클래스명",
                        path: "Bklast"
                    },
                    {
                        key: "idColmaktx",
                        label: "자재명",
                        path: "maktx"
                    },
                    {
                        key: "idColMatnr",
                        label: "자재번호",
                        path: "Matnr"
                    },
                    {
                        key: "idColExtwg",
                        label: "분류1",
                        path: "Extwg"
                    },
                    {
                        key: "idColExtwgt",
                        label: "분류1명",
                        path: "Extwgt"
                    },
                    {
                        key: "idColMatkl",
                        label: "분류2",
                        path: "Matkl"
                    },
                    {
                        key: "idColMatklt",
                        label: "분류2명",
                        path: "Matklt"
                    },
                    {
                        key: "idColSpmon",
                        label: "조회년월",
                        path: "Spmon"
                    },
                    {
                        key: "idColBklas",
                        label: "평가클래스",
                        path: "Bklas"
                    },
                    {
                        key: "idColMeins",
                        label: "단위",
                        path: "Meins"
                    },
                    {
                        key: "idColWaers",
                        label: "통화",
                        path: "Waers"
                    }
                ]
>>>>>>> fba58ff (커밋)

                for (let i = 0; i < aColums.length; i++) {
                    aArray.push({
                        key: aColums[i].id,
                        label: aColums[i].columsName,
                        path: aColums[i].Spmon,
                    })
                }


                this.oMetadataHelper = new MetadataHelper(aArray);
                this.initEngine(_oTable);
            },

            _getKey: function (oControl) {
                return this.control.getView().getLocalId(oControl.getId());
            },

            onColumnResize: function (oEvt, oTable) {
                const oColumn = oEvt.getParameter("column");
                const sWidth = oEvt.getParameter("width");

                const oColumnState = {};
                oColumnState[this._getKey(oColumn)] = sWidth;

                Engine.getInstance().applyState(oTable, {
                    ColumnWidth: oColumnState
                });

            },

            onColumnMove: function (oEvt, oTable) {

                const oAffectedColumn = oEvt.getParameter("column");
                const iNewPos = oEvt.getParameter("newPos");
                const sKey = this._getKey(oAffectedColumn);
                oEvt.preventDefault();

                Engine.getInstance().retrieveState(oTable).then(function (oState) {

                    const oCol = oState.Columns.find(function (oColumn) {
                        return oColumn.key === sKey;
                    }) || {
                        key: sKey
                    };
                    oCol.position = iNewPos;

                    Engine.getInstance().applyState(oTable, {
                        Columns: [oCol]
                    });
                });
            },

            handleStateChange: function (oEvt) {

                const oState = oEvt.getParameter("state");

                if (!oState) {
                    return;
                }

                for (let i = 0; i < _oTable.getColumns().length; i++) {
                    var oColumn = _oTable.getColumns()[i];
                    var sKey = this._getKey(oColumn);

                    var sColumnWidth = oState.ColumnWidth[sKey];

                    oColumn.setWidth(sColumnWidth || "150px");

                    oColumn.setVisible(false);
                    oColumn.setSortOrder(CoreLibrary.SortOrder.None);
                }

                oState.Columns.forEach(function (oProp, iIndex) {
                    const oCol = this.control.getView().byId(oProp.key);

                    if (oCol) {
                        oCol.setVisible(true);
                        _oTable.removeColumn(oCol);
                        _oTable.insertColumn(oCol, iIndex);
                    }


                }.bind(this));

                const aSorter = [];
                oState.Sorter.forEach(function (oSorter) {
                    const oColumn = this.control.byId(oSorter.key);
                    /** @deprecated As of version 1.120 */
                    oColumn.setSorted(true);
                    oColumn.setSortOrder(oSorter.descending ? CoreLibrary.SortOrder.Descending : CoreLibrary.SortOrder.Ascending);
                    aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
                }.bind(this));


                if (_oTable.getBinding("rows")) {
                    _oTable.getBinding("rows").sort(aSorter);
                }


            },




        })
    }
);
