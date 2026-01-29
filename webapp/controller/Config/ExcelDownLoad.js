sap.ui.define(
    [
        "sap/ui/base/Object",
        "sap/ui/export/Spreadsheet"
    ],
    function (BaseObject, Spreadsheet) {

        var _cloums = [];

        var _aItemArray = [];
        var _vPage;
        var _downLoadCloums = [];
        var _oModel;
        var _vPath;
        var _filters;
        var _sMon;

        const pageSize = 5000;

        return BaseObject.extend("z002sb005.controller.Config.ExcelDownLoad", {

            constructor: function (control) {
                this.control = control;

            },

            downLoad: function (oModel, path, filters, callBack, aColumns, sMon) {
                _vPage = 0;
                _aItemArray = [];
                _oModel = oModel;
                _vPath = path;
                _filters = filters;
                _sMon = sMon;

                _downLoadCloums = this.getColoums(aColumns, _cloums);
                
                this._requestDate(_oModel, _vPath, _filters, callBack);
            },


            _callBackRequset: function (vCount, aResult, error, callBack) {
                _vPage = _vPage + 1;

                if (error) {
                    callBack("E")
                    return;
                }

                if (aResult.length) {
                    for (let i = 0; i < aResult.length; i++) {
                        _aItemArray.push(aResult[i])
                    }
                }

                if ((vCount / pageSize) > _vPage) {
                    this._requestDate(_oModel, _vPath, _filters, callBack);
                    return;
                }

                _aItemArray.forEach((items)=>{  
                    items.Spmon = _sMon;
                })

                var oConfiguration = {
                    context: {
                        sheetName: 'Custom metadata'
                    },
                    workbook: {
                        columns: _downLoadCloums
                    },
                    dataSource: _aItemArray,
                    fileName: "월 수불부" + ".xlsx"
                }

                var oExportConfiguration, oExportPromise, oSpreadsheet;

                oExportConfiguration = oConfiguration;
                oSpreadsheet = new Spreadsheet(oExportConfiguration);

                oExportPromise = oSpreadsheet.build();

                oExportPromise.then(function () {
                    callBack("S");
                });
            },

            _requestDate: function (oModel, vPath, aFilter, callBack) {

                //데이터 호출
                oModel.read(vPath, {
                    filters: aFilter,
                    urlParameters: { $skip: _vPage * pageSize, $top: pageSize, $inlinecount: "allpages" },  //백만건 초과하면 Error
                    success: function (oReturn) {
                        this._callBackRequset(oReturn["__count"], oReturn["results"], false, callBack);
                    }.bind(this),
                    error: function () {
                        this._callBackRequset(undefined, undefined, true, callBack)
                    }.bind(this)

                });
            },

            getColoums: function (aColumns, defaultArray) {
                let colums = [];
                if (aColumns) {

                    for (let i = 0; i < aColumns.length; i++) {
                        col = aColumns[i];

                        var sProperty = col.getTemplate().getBindingPath("text");
                        if (!sProperty) {
                            sProperty = col.getTemplate().getBindingPath("title");
                        }

                        var sText;
                        if (col.getLabel().mProperties.text) {
                            sText = col.getLabel().mProperties.text;
                        } else {
                            sText = "no Header";
                        }

                        var obj = {
                            label: sText,
                            property: sProperty
                        };

                        if (this.checkString(sProperty)) {
                            obj["type"] = sap.ui.export.EdmType.Number;
     
                        }

                        var bVisible = col.getVisible();
                        if (bVisible) {
                            colums.push(obj);
                        }
                    }

                } else {
                    colums = defaultArray;
                }

                return colums;
            },

            checkString: function (str) {

                if (str.charAt(0) === 'f' && (str.charAt(str.length - 1) === 'm' || str.charAt(str.length - 1) === 'a' || str.charAt(str.length - 1) === 'd')) {
                    return true;
                }
                return false;
 
            }

        })
    }
);
