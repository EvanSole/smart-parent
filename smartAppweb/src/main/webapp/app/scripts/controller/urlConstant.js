define(['app'], function (app) {
    "use strict";
    app.constant('url', {

            //根据当前登录用户获取菜单
            naviUrl: window.BASEPATH + '/index/menu',
            //根据当前登录用户获取按钮操作权限
            permUrl: window.BASEPATH + '/index/perm',

            systemTenantUrl: window.BASEPATH + '/tenant',
            systemWarehouseUrl: window.BASEPATH + '/warehouse',
            systemCodeHeaderUrl: window.BASEPATH + '/code/header',
            systemCodeDetailUrl: window.BASEPATH + '/code/detail',
            authorRoleUrl: window.BASEPATH + '/role',
            authorUserUrl: window.BASEPATH + '/user',
            authorModuleUrl: window.BASEPATH + '/module',





            //根据登录用户当前租户查询所有仓库
            getWarehouseUrl: window.BASEPATH + '/index/warehouse/combox',
            //选择设置当前仓库
            switchWarehouseUrl: window.BASEPATH + '/index/warehouse/current',
            dataWarehouseUrl: window.BASEPATH + '/warehouse',
            getSystemDataWarehouseUrl:window.BASEPATH + "/index/warehouse",




            systemTemplateListUrl: window.BASEPATH + '/report/template',

            inventoryCycleHeaderUrl: window.BASEPATH + '/inventory/check',
            inventoryFrozeHeaderUrl: window.BASEPATH + '/inventory/state',
            inventoryUnfrozeHeaderUrl: window.BASEPATH + '/inventory/unfroze',
            inventoryAdjustUrl: window.BASEPATH + '/inventory/adjust',
            inventoryStatusAdjustUrl: window.BASEPATH + '/inventory/adjust',
            inventoryTransferUrl: window.BASEPATH + '/inventory/transfer',
            inventoryReplenishUrl: window.BASEPATH + '/inventory/replenish',
            inventoryMoveUrl: window.BASEPATH + '/inventory/move',
            inventoryCountUrl: window.BASEPATH + '/inventoryCount',
            inventoryLogUrl: window.BASEPATH + '/inventory/log',
            transactionLogUrl: window.BASEPATH + '/transaction/log',
            locationAnalysisUrl: window.BASEPATH + '/inventory/locationAnalysis',

            strategyOutboundUrl: window.BASEPATH + '/strategy/outbound',
            strategyWaveUrl: window.BASEPATH + '/strategy/wave',
            strategyAllocationUrl: window.BASEPATH + '/strategy/allocation',
            strategyQcUrl: window.BASEPATH + '/strategy/qc',
            strategyQcItemUrl: window.BASEPATH + '/strategy/qcItem',
            strategyPutawayUrl: window.BASEPATH + "/stragegy/putaway",
            strategyLotUrl: window.BASEPATH + "/strategy/lot",
            strategyReceiptUrl: window.BASEPATH + "/strategy/receipt",
            strategyReplenishUrl: window.BASEPATH + "/strategy/replenish",




            dataSaveUserUrl: window.BASEPATH + '/warehouse/',
            dataShopUrl: window.BASEPATH + '/shop',
            dataStorerUrl: window.BASEPATH + '/storer',
            dataUserStorerUrl: window.BASEPATH + '/storer/userStorer',
            dataUserWhUrl: window.BASEPATH + '/userWh',
            dataGoodsUrl: window.BASEPATH + '/goods',
            dataGoodSkuBarcodesUrl: window.BASEPATH + '/goods/skuBarcodes',
            dataGoodSkuBarcodeUrl: window.BASEPATH + '/goods/skuBarcode',
            dataSupplierUrl: window.BASEPATH + '/supplier',
            dataCustomerUrl: window.BASEPATH + '/customer',
            dataCarrierUrl: window.BASEPATH + "/carrier",
            dataDistributorUrl: window.BASEPATH + '/distributor',
            dataLocationUrl: window.BASEPATH + "/location",
            dataImportLocationUrl: window.BASEPATH + "/location",
            dataZoneUrl: window.BASEPATH + "/zone",
            dataInventoryUrl: window.BASEPATH + '/inventory',
            dataExceptionLogUrl: window.BASEPATH + '/exceptionLog',
            dataEwaybillRecUrl: window.BASEPATH + '/ewaybillRec',
            dataCommodityTypeUrl: window.BASEPATH + '/commodityType',


            warehouseOutDeliverHeaderUrl: window.BASEPATH + "/dns",
            warehouseOutDeliverDetailUrl: window.BASEPATH + "/dns/details",
            warehouseOutShipmentUrl: window.BASEPATH + "/shipment",
            warehouseOutShipmentDetailUrl: window.BASEPATH + "/shipment/report/detail",
            warehouseOutShipmentCollectUrl: window.BASEPATH + "/shipment/report/collect",
            warehouseOutShipmentCartonUrl: window.BASEPATH + "/shipment/report/cartongroup",
            warehouseOutShipmentHeaderUrl: window.BASEPATH + "/shipment/report/delivered",
            warehouseOutShipmentBasicUrl: window.BASEPATH + "/shipment/basic",
            warehouseOutShipmentSummaryUrl: window.BASEPATH + "/shipment/summary",
            warehouseOutShipmentLogUrl: window.BASEPATH + "/operationlog",
            warehouseOutWaveUrl: window.BASEPATH + "/warehouse/out/wave",
            warehouseOutPoreturnUrl: window.BASEPATH + "/poreturn",
            warehouseOutPoreturnNoticeUrl: window.BASEPATH + "/poreturn/notice",

            warehouseInReceiptUrl: window.BASEPATH + "/receipt",
            reportInReceiptUrl: window.BASEPATH + "/receipt",
            reportReceiptSummaryUrl: window.BASEPATH + "/asns/inWarehouseSummary",
            qcReport: window.BASEPATH + "/qc/report",
            reportReceiptPerformanceUrl: window.BASEPATH + "/receipt/inWarehousePerformance",
            reportReceiptOperationUrl : window.BASEPATH + "/asns",
            reportEfficiencyControllerUrl : window.BASEPATH + "/efficiency",
            warehouseInSoreturnReceiptUrl: window.BASEPATH + "/soreturn/receipt",
            warehouseInQcUrl: window.BASEPATH + "/qc",
            ReturnPackageUrl : window.BASEPATH + "/returnPackage",


        });

});
