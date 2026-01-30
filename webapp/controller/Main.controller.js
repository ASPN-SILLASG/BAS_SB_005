sap.ui.define([
    "z002sb005/controller/BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "z002sb005/controller/Config/ColumEngine",
    'z002sb005/controller/Config/VHDialog',
    "z002sb005/controller/Config/ExcelDownLoad",
    'sap/m/p13n/Engine',
    "sap/ui/core/date/UI5Date",
    "sap/ui/model/Sorter",

],  function (BaseController, ODataModel, JSONModel, Filter, FilterOperator, ColumEngine, VHDialog, ExcelDownLoad, Engine, UI5Date, Sorter) {
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

    return BaseController.extend("z002sb005.controller.Main", {
        onInit: function () {
                this.setInitPage();
            },

            setInitPage: function () {
                _isLoadingFileds = false;

                //Text속성 
                _i18n = this.getOwnerComponent().getModel('i18n').getResourceBundle();

                //메인 Model
                _oModelMain = new ODataModel("/sap/opu/odata/sap/Z002_SB_005_UI_01", {
                    defaultOperationMode: "Server"
                });
                this.getOwnerComponent().setModel(_oModelMain, "MainModel");
                _oModelMain.attachMetadataLoaded(_oModelMain, this.metaDataLoading, this);

                //화면 데이터를 단는 JsonModel
                _oDataModel = new JSONModel({ "items": [] });
                this.getView().setModel(_oDataModel, "DataModel");

                _oTable = this.getView().byId("idTable");

                //F4
                this.comDialog = new VHDialog(this);

                //컬럼엔진
                this.columEngine = new ColumEngine(this);
                this.columEngine.initEngine(_oTable);

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
                    if (entityList[i].name == "Z002_SB_005_R_01Result") {
                        _cdsFiledArray = entityList[i].property
                        break;
                    }
                }
            },

            //=========Dynamic Fields=========
            /**화면 필드 이릅 세팅 Request*/
            getDynamicFields: function (fnCallback) {
                _oModelMain.read("/TableSetting",{
                    urlParameters : { $top : 10000 }, 
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
            onSearch: function () {

                //if (!this.checkFBValue()) return;

                // var odatafilter = this._getFilterBarFilters(this.byId("idFilterBar"));
                // if (odatafilter.length > 1) {
                //     odatafilter = new Filter(odatafilter, true);
                // }

                var _oSmartFilterBar = this.getView().byId("mm0003.smartFilterBar");
                var aFilterItems = _oSmartFilterBar.getFilters();

                const oDateRangeSelection = this.byId("mm0003.dateRangeSelection");

                const sSspmon = oDateRangeSelection.getProperty("dateValue");
                const sEspmon = oDateRangeSelection.getProperty("secondDateValue");

                aFilterItems.push(
                    new sap.ui.model.Filter("Spmon", sap.ui.model.FilterOperator.BT, sSspmon, sEspmon)
                );

                if (!_isLoadingFileds) {
                    this.getDynamicFields(function (response) {
                        if (response == 'S') {
                            this.getData(aFilterItems);
                        }
                    }.bind(this));
                } else {
                    this.getData(aFilterItems);
                }
            },

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

            creatExtendFileds: function (oFiled) {

                for (let i = 13; i < _cdsFiledArray.length; i++) {

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
                    } else if(_tableColums[i].columsName.includes("수량")) {
                   //     template = new sap.m.Text({ wrapping: false, text: "{ path:'DataModel>" + _tableColums[i].value + "', formatter: '.formatDecimal'}" })
                        template = new sap.m.Text({ wrapping: false, 
                                                    text: { path: "DataModel>" + _tableColums[i].value, 
                                                            type: new sap.ui.model.type.Float({
                                                                groupingEnabled: true,      // 콤마
                                                                minFractionDigits: 3,       // 최소 소수 3자리
                                                                maxFractionDigits: 3        // 최대 소수 3자리
                                                            })
                                                        }
                                                });

                    }else {
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

            _registerForP13n: function () {
                this.oMetadataHelper = this.columEngine.getMetadataHelper(_i18n);
                this.columEngine.initEngine(_oTable);
            },

            /**
             * Excel 다운로드
             * @returns 
             */
            excelExport: function () {
                //if (!this.checkFBValue()) return;
                this.openLoading();
                // let filter = [];
                // if (_oTable.getBinding("rows").oCombinedFilter) {
                //     filter = _oTable.getBinding("rows").oCombinedFilter.getFilters();
                // }

                // var odatafilter = this._getFilterBarFilters(this.byId("idFilterBar"));
                
                const oDateRangeSelection = this.byId("mm0003.dateRangeSelection");

                const sSspmon = oDateRangeSelection.getProperty("dateValue");
                const sEspmon = oDateRangeSelection.getProperty("secondDateValue");

                var _oSmartFilterBar = this.getView().byId("mm0003.smartFilterBar");
                var aFilterItems = _oSmartFilterBar.getFilters();

                // let oSearchDate = this.getView().byId("idFBSpmon");
                var vMon = this.getYYYYMM(sSspmon) + "-" + this.getYYYYMM(sEspmon);
                this.excelDownLoad.downLoad(_oModelMain, "/Z002_SB_005_R_01(sspmon='" + this.getYYYYMM(sSspmon) + "',espmon='" + this.getYYYYMM(sEspmon) + "')/Results",
                             aFilterItems, function (code) {
                    this.closeLoading();
                }.bind(this), _oTable.getColumns(), vMon);
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

                const oDateRangeSelection = this.byId("mm0003.dateRangeSelection");

                const sSspmon = oDateRangeSelection.getProperty("dateValue");
                const sEspmon = oDateRangeSelection.getProperty("secondDateValue");
                
                //Json mModel 로 데이터를 일고 필드중 뒤이 a붙은 값을 합계침
                if (_aItemArray.length) {

                    for (let i = 0; i < _aItemArray.length; i++) {
                        let oData = _aItemArray[i];
                        oData["Tag"] = "Items";
                        if (!oSum.Waers) oSum["Waers"] = oData["Waers"]

                        for (let key in oData) {
                            oData.Spmon = this.getYYYYMM(sSspmon) + "-" + this.getYYYYMM(sEspmon);
                            
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
                    
                    for (const key in oSum) {
                        if (oSum.hasOwnProperty(key)) {
                            const value = oSum[key];

                            if (typeof value === "number") {
                                // 숫자면 소수점 셋째 자리까지 포맷
                                oSum[key] = Number(value.toFixed(3));
                            } 
                        }
                    }
                 
                    _aItemArray.push(oSum);
                    _oDataModel.setProperty("/items", _aItemArray);

                }

                this.closeLoading();
            },

            formatDecimal: function (value) {
                if (value == null || value === "") {
                    return "";
                }

                const num = Number(value);

                if (isNaN(num)) {
                    return value; // 숫자가 아니면 그대로 반환 (선택)
                }

                return num.toLocaleString("en-US", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                });
            },

            _requestDate: function () {
                // //필터 가져오기                
                var _oSmartFilterBar = this.getView().byId("mm0003.smartFilterBar");
                var aFilterItems = _oSmartFilterBar.getFilters();

                const oDateRangeSelection = this.byId("mm0003.dateRangeSelection");

                const sSspmon = oDateRangeSelection.getProperty("dateValue");
                const sEspmon = oDateRangeSelection.getProperty("secondDateValue");

                //데이터 호출
                _oModelMain.read("/Z002_SB_005_R_01(sspmon='" + this.getYYYYMM(sSspmon) + "',espmon='" + this.getYYYYMM(sEspmon) + "')/Results", {
                    filters: aFilterItems,
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
