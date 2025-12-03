sap.ui.define(
  [],
  function () {
    //=============================Table Stander===========================
    const MainTableConfig = {
      Engine: {}
    }

    //==============================Excel DownLoad======================================




    //==============================F4=======================================
    const VHDialog = {
      "PlantVH": {
<<<<<<< HEAD
        "viewName": "com/dine/mm/zmm0003/view/fragment/PlantVH",
=======
        "viewName": "z002sb005/view/fragment/PlantVH",
>>>>>>> fba58ff (커밋)
        "path": "Plant",
        "label": "PlantName",
        "key": "Plant",
        "type": "string",
        "searchBar": false,
        "fields": [
          { "title": "플랜트", "value": "Plant" },
          { "title": "플랜트명", "value": "PlantName" },
        ],
        "defaultValue": []
      },
      "ProductVH": {
<<<<<<< HEAD
        "viewName": "com/dine/mm/zmm0003/view/fragment/ProductVH",
=======
        "viewName": "z002sb005/view/fragment/ProductVH",
>>>>>>> fba58ff (커밋)
        "path": "Product",
        "label": "ProductDescription",
        "key": "Product",
        "type": "string",
        "searchBar": true,
        "fields": [
          { "title": "자재", "value": "Product" },
          { "title": "자재 명", "value": "ProductDescription" }
        ],
        "defaultValue": []
      },
      "VClassVH": {
<<<<<<< HEAD
        "viewName": "com/dine/mm/zmm0003/view/fragment/VClass",
=======
        "viewName": "z002sb005/view/fragment/VClass",
>>>>>>> fba58ff (커밋)
        "path": "VClass",
        "label": "Description",
        "key": "ValuationClass",
        "type": "string",
        "searchBar": true,
        "fields": [
          { "title": "평가클래스", "value": "ValuationClass" },
          { "title": "평가클래스 명", "value": "Description" }
        ],
        "defaultValue": []
      }
    }


    return {
      VHDialog: VHDialog,
      TableConfig: MainTableConfig,

    }
  }
);
