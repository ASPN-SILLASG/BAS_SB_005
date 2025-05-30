sap.ui.define([
    "com/dine/mm/zmm0003/controller/BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/dine/mm/zmm0003/controller/Config/ColumEngine",
    'com/dine/mm/zmm0003/controller/Config/VHDialog',
    "com/dine/mm/zmm0003/controller/Config/ExcelDownLoad",
    'sap/m/p13n/Engine',
    "sap/ui/core/date/UI5Date",
    "sap/ui/model/Sorter",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, ODataModel, JSONModel, Filter, FilterOperator, ColumEngine, VHDialog, ExcelDownLoad, Engine, UI5Date, Sorter) {
        "use strict";

        var _oModelMain;
        var _oDataModel;
        var _aItemArray = [];
        var _tableColums = [];
        var _oTable;
        var _isLoadingFileds;
        var _i18n;
        var _cdsFiledArray;

        var _vPage;
        const pageSize = 5000;

        return BaseController.extend("com.dine.mm.zmm0003.controller.Main", {
            onInit: function () {

                this.setInitPage();

            },

            onBeforeRebindTable(oEvent) {
                const sBindingPath = `/ZSB_R_0005(sspmon='${this.sSspmon}',espmon='${this.sEspmon}')/Results`;
                
                return new Promise((resolve) => {
                    oEvent.getSource().mProperties.tableBindingPath = sBindingPath;
                    resolve();
                });
            },

            onSearch() {
                const oDateRangeSelection = this.byId("mm0003.dateRangeSelection");

                const sSspmon = oDateRangeSelection.getProperty("dateValue");
                const sEspmon = oDateRangeSelection.getProperty("secondDateValue");

                function formatToYYYYMM(dDate) {
                    const sYear = dDate.getFullYear();
                    const sMonth = String(dDate.getMonth() + 1).padStart(2, "0");

                    return `${sYear}${sMonth}`;
                }
                  
                  this.sSspmon = formatToYYYYMM(sSspmon);
                  this.sEspmon = formatToYYYYMM(sEspmon);
            },

            setInitPage: function () {
                _isLoadingFileds = false;

                //Text속성 
                _i18n = this.getOwnerComponent().getModel('i18n').getResourceBundle();


                //메인 Model
                _oModelMain = new ODataModel("/sap/opu/odata/sap/ZUI_SUBUL_0000_O2", {
                    defaultOperationMode: "Server"
                });
                this.getOwnerComponent().setModel(_oModelMain, "MainModel");
                _oModelMain.attachMetadataLoaded(_oModelMain, this.metaDataLoading, this);

                //화면 데이터를 단는 JsonModel
                _oDataModel = new JSONModel({ "items": [] });
                this.getView().setModel(_oDataModel, "DataModel");

                _oTable = this.getView().byId("mm0003.smartTable");
                this.initTableColums();
                //디폴트로 나와야 할값들

                //F4
                this.comDialog = new VHDialog(this);

                //컬럼엔진
                this.columEngine = new ColumEngine(this);

                //테이블 Excel 다운로드 
                this.excelDownLoad = new ExcelDownLoad(this);
                
                this._registerForP13n();
            },

            //===========Odata MeataDataPassing=========
            metaDataLoading: function (response) {

                if (!response.getParameters().metadata.oMetadata.dataServices) return;

                //CDS 모든 필드들 가져 오기
                let entityList = response.getParameters().metadata.oMetadata.dataServices.schema[0].entityType;
                for (let i = 0; i < entityList.length; i++) {
                    if (entityList[i].name == "ZSB_R_0005Results") {
                        _cdsFiledArray = entityList[i].property
                        break;
                    }
                }
            },

            //=========Dynamic Fields=========
            /**화면 필드 이릅 세팅 Request*/
            getDynamicFields: function (fnCallback) {

                _oModelMain.read("/TableSetting", {
                    success: function (response) {
                        let aArray = response.results;

                        let oFiled = {};

                        for (let i = 0; i < aArray.length; i++) {
                            oFiled[aArray[i].Zsfld.toLowerCase() + "m"] = aArray[i].Fieldname + "수량";
                            oFiled[aArray[i].Zsfld.toLowerCase() + "a"] = aArray[i].Fieldname + "금액";
                            oFiled[aArray[i].Zsfld.toLowerCase() + "d"] = aArray[i].Fieldname + "단가";
                        }

                        this.creatExtendFileds(oFiled);

                        fnCallback("S");
                        _isLoadingFileds = true;

                    }.bind(this),

                    error: function (response) {
                        fnCallback("E");
                        _isLoadingFileds = false;

                    }.bind(this)

                });
            },

            //=================Action=============
            // onSearch: function () {

            //     if (!this.checkFBValue()) return;

            //     var odatafilter = this._getFilterBarFilters(this.byId("idFilterBar"));
            //     if (odatafilter.length > 1) {
            //         odatafilter = new Filter(odatafilter, true);
            //     }

            //     if (!_isLoadingFileds) {
            //         this.getDynamicFields(function (response) {
            //             if (response == 'S') {
            //                 this.getData(odatafilter);
            //             }
            //         }.bind(this));
            //     } else {
            //         this.getData(odatafilter);
            //     }
            // },

            openPersoDialog: function (oEvt) {
                Engine.getInstance().show(_oTable, ["Columns"], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oEvt.getSource()
                });
            },
            onColumnResize: function (oEvt) {
                this.columEngine.onColumnResize(oEvt, _oTable);
            },
            onColumnMove:function(oEvt) {
                this.columEngine.onColumnMove(oEvt, _oTable);
            },

            //==============Process=============
            initTableColums: function () {

                _tableColums.push({ id: "idColSpmon", columsName: "조회년월", value: "Spmon" });
                _tableColums.push({ id: "idColBwkey", columsName: "플랜트", value: "Bwkey" });
                _tableColums.push({ id: "idColBklas", columsName: "평가클래스", value: "Bklas" });
                _tableColums.push({ id: "idColBklast", columsName: "평가클래스명", value: "Bklast" });
                _tableColums.push({ id: "idColMatnr", columsName: "자재번호", value: "Matnr" });
                _tableColums.push({ id: "idColmaktx", columsName: "자재명", value: "maktx" });
                _tableColums.push({ id: "idColMatkl", columsName: "분류2", value: "Matkl" });
                _tableColums.push({ id: "idColMatklt", columsName: "분류2명", value: "Matklt" });
                _tableColums.push({ id: "idColExtwg", columsName: "분류1", value: "Extwg" });
                _tableColums.push({ id: "idColExtwgt", columsName: "분류1명", value: "Extwgt" });
                _tableColums.push({ id: "idColMaker", columsName: "브랜드/메이커", value: "Maker" });
                _tableColums.push({ id: "idColYY1MAKER", columsName: "브랜드/메이커명", value: "YY1_MAT_MAKER_PRDT" });
                _tableColums.push({ id: "idColPrange", columsName: "제품군", value: "Prange" });
                _tableColums.push({ id: "idColYY1RANGE", columsName: "제품군명", value: "YY1_PROD_RANGE_PRDT" });
                _tableColums.push({ id: "idColMat_JJ", columsName: "재종", value: "Mat_JJ" });
                _tableColums.push({ id: "idColPNP", columsName: "P/NP", value: "PNP" });
                _tableColums.push({ id: "idColMeins", columsName: "단위", value: "Meins" });
                _tableColums.push({ id: "idColWaers", columsName: "통화", value: "Waers" });
                //this.settingTable();

                _tableColums = [];
            },

            /**
             * 테이블 세팅 기준으로 
            */
            creatExtendFileds: function (oFiled) {

                for (let i = 20; i < _cdsFiledArray.length; i++) {

                    if (oFiled[_cdsFiledArray[i].name]) {

                        if (_cdsFiledArray[i].name.endsWith("m")) {
                            _tableColums.push({
                                id: "idCol" + _cdsFiledArray[i].name + i,
                                columsName: oFiled[_cdsFiledArray[i].name],
                                value: _cdsFiledArray[i].name,
                                addtion: true
                            });
                        } else {
                            _tableColums.push({
                                id: "idCol" + _cdsFiledArray[i].name + i,
                                columsName: oFiled[_cdsFiledArray[i].name],
                                value: _cdsFiledArray[i].name,
                                currency: true,
                                addtion: true
                            });
                        }

                    } else {
                        _tableColums.push({ id: "idCol" + _cdsFiledArray[i].name + i, columsName: _cdsFiledArray[i].name, value: _cdsFiledArray[i].name });
                    }

                }

                this.settingTable();
                this.columEngine.addHelper(_i18n, _tableColums);
                _tableColums = [];
            },

            settingTable: function () {

                if (_isLoadingFileds) return;

                let oId = this.getOwnerComponent().getId() + "---Main--";

                for (let i = 0; i < _tableColums.length; i++) {

                    let template;
                    if (_tableColums[i].currency) {
                        template = new sap.m.Text({ wrapping: false, text: "{ parts:['DataModel>" + _tableColums[i].value + "','DataModel>Waers'] , type:'sap.ui.model.type.Currency'}" })
                    } else {
                        template = new sap.m.Text({
                            wrapping: false,
                            text: "{DataModel>" + _tableColums[i].value + "}"
                        })
                    }

                    let colum = new sap.ui.table.Column(oId + _tableColums[i].id, {
                        label: new sap.m.Label({ text: _tableColums[i].columsName }),
                        width: '150px',
                        hAlign: "End",
                        template: template,
                        headerMenu: "menu",
                        // sortProperty: _tableColums[i].value,
                    });

                    // if (!_tableColums[i].addtion) {
                    //     colum.setFilterProperty(_tableColums[i].value);
                    // }
                    _oTable.addColumn(colum);
                }
            },

            //검색필드들 체크
            checkFBValue: function () {

                if (!this.getView().byId("idFBSpmon").getValue()) {
                    this._showToast(_i18n.getText("MSG_INPUT_DATASELET"))
                    return false;
                }

                if (!this.getView().byId("idFBPlant").getValue() && this.getView().byId("idFBPlant").getTokens().length == 0) {
                    this._showToast(_i18n.getText("MSG_INPUT_PLANT"))
                    return false;
                }

                if (!this.getView().byId("idFBVClass").getValue() && this.getView().byId("idFBVClass").getTokens().length == 0) {
                    this._showToast(_i18n.getText("MSG_INPUT_VCLASS"))
                    return false;
                }

                return true;
            },
            onClearFilter: function () {
                this._clearFilters(this.byId("idFilterBar"));
            },
            onSort: function (oEvent) {

            },

            //==========================F4================================
            onValueHelpCancelPress: function () {
                this.comDialog.close();
            },

            onValueHelpAfterClose: function () {
                this.comDialog.destroy();
            },
            onVHPlant: function (oEvent) {
                this.comDialog.open("PlantVH", this.getView().getModel("MainModel"), "MainModel", false);
            },

            onVHProduct: function (oEvent) {
                this.comDialog.open("ProductVH", this.getView().getModel("MainModel"), "MainModel", false);
            },

            onVHVClass: function (oEvent) {
                this.comDialog.open("VClassVH", this.getView().getModel("MainModel"), "MainModel", false);
            },
            //F4=====확인 리턴
            onValueHelpOkReturn: function (oEvent, vReturnKey) {
                var aTokens = oEvent.getParameter("tokens");
                var key = aTokens[0].getProperty("key");

                if (vReturnKey == "PLANT") {
                    this.getView().byId("idFBPlant").setTokens(aTokens);
                } else if (vReturnKey == "PRODUCT") {
                    this.getView().byId("idFBProduct").setTokens(aTokens);
                } else if (vReturnKey == "VCLASS") {
                    this.getView().byId("idFBVClass").setTokens(aTokens);
                }

                this.comDialog.close();;
            },

            //================F4 화면에서 필드 검색들 
            onFilterBarSearch: function (oEvent) {

                // var sSearchQuery = this._oBasicSearchField.getValue();
                var sSearchQuery = this.comDialog.getSearchValue();
                var aSelectionSet = oEvent.getParameter("selectionSet");

                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new Filter({
                            path: oControl.getName(),
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }
                    return aResult;
                }, []);

                var sPath1, sPath2;
                if (this.comDialog.getKey() === "ValuationClass") {
                    sPath1 = "ValuationClass";
                    sPath2 = "Description";
                } else if (this.comDialog.getKey() === "Product") {
                    sPath1 = "Product";
                    sPath2 = "ProductDescription";
                }

                if (sSearchQuery != '') {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: sPath1, operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: sPath2, operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }

                this.comDialog.filter(new Filter({
                    filters: aFilters,
                    and: true
                }));

            },

            _registerForP13n: function () {
                this.oMetadataHelper = this.columEngine.getMetadataHelper(_i18n);
                this.columEngine.initEngine(_oTable);
            },

            /**
             * Excel 다운로드
             * @returns 
             */
            excelExport: function () {
                if (!this.checkFBValue()) return;
                this.openLoading();
                // let filter = [];
                // if (_oTable.getBinding("rows").oCombinedFilter) {
                //     filter = _oTable.getBinding("rows").oCombinedFilter.getFilters();
                // }

                var odatafilter = this._getFilterBarFilters(this.byId("idFilterBar"));
                let oSearchDate = this.getView().byId("idFBSpmon");
                this.excelDownLoad.downLoad(_oModelMain, "/ZSB_R_0005(sspmon='" + this.getYYYYMM(oSearchDate.getDateValue()) + "',espmon='" + this.getYYYYMM(oSearchDate.getSecondDateValue()) + "')/Set", odatafilter, function (code) {
                    this.closeLoading();
                }.bind(this), _oTable.getColumns());
            },

            getData: function () {
                this.openLoading();
                _vPage = 0;
                _aItemArray = [];

                _oDataModel.setProperty("/items", []);

                this._requestDate();


            },

            
            _callBackRequset: function (vCount, aResult, error) {
                console.log("Page ->" + _vPage);
                _vPage = _vPage + 1;

                if (error) {
                    this.closeLoading();
                    return;
                }

                if (aResult.length) {
                    for (let i = 0; i < aResult.length; i++) {
                        _aItemArray.push(aResult[i])
                    }
                }

                if ((vCount / pageSize) > _vPage) {
                    this._requestDate();
                    return;
                }

                let oSum = { "Tag": "Sum" };

                //Json mModel 로 데이터를 일고 필드중 뒤이 a붙은 값을 합계침
                if (_aItemArray.length) {

                    for (let i = 0; i < _aItemArray.length; i++) {
                        let oData = _aItemArray[i];
                        oData["Tag"] = "Items";
                        if (!oSum.Waers) oSum["Waers"] = oData["Waers"]

                        for (let key in oData) {

                            if (oData.hasOwnProperty(key)) { // key확인
                                if ((key.endsWith("a") && key.startsWith("f")) || (key.endsWith("m") && key.startsWith("f")) ) {
                                    if (!oSum[key]) {
                                        oSum[key] = oData[key];
                                    } else {
                                        oSum[key] = parseFloat(oSum[key]) + parseFloat(oData[key]);
                                    }
                                }
                            }
                        }
                    }
                    _aItemArray.push(oSum);
                    _oDataModel.setProperty("/items", _aItemArray);

                }

                this.closeLoading();
            },

            _requestDate: function () {
                //필터 가져오기
                var odatafilter = this._getFilterBarFilters(this.byId("idFilterBar"));
                let oSearchDate = this.getView().byId("idFBSpmon");

                //데이터 호출
                _oModelMain.read("/ZSB_R_0005(sspmon='" + this.getYYYYMM(oSearchDate.getDateValue()) + "',espmon='" + this.getYYYYMM(oSearchDate.getSecondDateValue()) + "')/Set", {
                    filters: odatafilter,
                    sorters: [
                        new Sorter("Matnr", true),
                        new Sorter("Bklas", true)
                    ],
                    // urlParameters : { $top : 1000000 },  //백만건 초과하면 Error
                    urlParameters: { $skip : _vPage * pageSize, $top: pageSize, $inlinecount: "allpages" },  //백만건 초과하면 Error
                    success: function (oReturn) {
                        this._callBackRequset(oReturn["__count"], oReturn["results"], false);
                  
                    }.bind(this),
                    error: function () {
                        this.closeLoading();
                    }.bind(this)

                });
            },

            getYYYYMM: function (vSpmons) {
                let date = UI5Date.getInstance(vSpmons);

                let yyyy = String(date.getFullYear());
                let mm = String(date.getMonth() + 1).padStart(2, '0')

                return yyyy + mm;
            },

            //TABLE 색상 칠하기 
            onRowsUpdated: function () {
                let aRows = this.byId("idTable").getRows();

                if (!_oDataModel) return;
                if (_oDataModel.getData().length == 0) return;

                if (aRows.length > 0) {

                    aRows.forEach(oRow => {

                        if (oRow.getBindingContext("DataModel")) {
                            if (_oDataModel.getProperty(oRow.getBindingContext("DataModel").sPath + "/Tag") == "Sum") {
                                oRow.addStyleClass("totalClass");
                                if (oRow.getCells()[0].getText() == '') {
                                    oRow.getCells()[0].setText("합계:")
                                }
                            } else {
                                oRow.removeStyleClass("totalClass")
                            }
                        }

                    })
                }
            },

        });
    });
