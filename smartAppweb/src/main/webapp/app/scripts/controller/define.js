/**
 * Created by xiagn on 15/3/31.
 */
define([
    './data/shopController',
    './data/warehouseController',
    './data/storerController',
    './data/goodsController',
    './data/supplierController',
    './data/customerController',
    './data/distributorController',
    './data/carrierController',
    './data/locationController',
    './data/locationListController',
    './data/zoneController',
    './data/commodityTypeController',


    './system/codeController',
    './system/tenantController',
    './system/versionController',
    './system/problemTicklingController',
    './system/templateController',

    './author/moduleController',
    './author/roleController',
    './author/userController',
/************库存相关*****************/
    './inventory/cycleController',
    './inventory/transferController',
    './inventory/countController',
    './inventory/generateCountController',
    './inventory/frozeController',
    './inventory/unFrozeController',
    './inventory/adjustController',
    './inventory/adjustStatusController',
    './inventory/replenishController',
    './inventory/moveController',
    './report/inventoryLogController',
    './report/invSummaryController',
    './report/transactionLogController',
    './report/reportAssociateController',
    './report/reportPickController',
    './report/exceptionLogController',
    './report/ewaybillRecController',

/************库存相关*****************/
    './strategy/outboundController',
    './strategy/waveController',
    './strategy/putawayController',
    './strategy/lotController',
    './strategy/receiptController',
    './strategy/allocationController',
    './strategy/replenishController',
    './strategy/qcController',
    './strategy/qcItemController',
    './warehouse/out/waveController',
    './warehouse/out/deliverController',
    './warehouse/out/packageController',
    './warehouse/out/shipmentController',
    './warehouse/out/shipmentWaveController',
    './warehouse/out/worksController',
    './warehouse/out/recheckController',
    './warehouse/out/associateController',
    './warehouse/out/poreturnController',
    './warehouse/out/poreturnNoticeController',
    './warehouse/out/weightController',
    './warehouse/out/scanController',
    './warehouse/out/consumableController',
    './warehouse/in/asnController',
    './warehouse/in/receiptController',
    './warehouse/in/soreturnReceiptController',
    './warehouse/in/soreturnAsnController',
    './warehouse/in/qcController',
    './warehouse/in/returnPackageController',

    './popup/invAllocateController',
    './popup/skuController',
    './popup/shipmentHeaderController',
    './popup/vendorController',
    './popup/userController',
    './popup/userWhController',
    './popup/asnHeaderController',
    './popup/receiptController',
    './popup/qcController',
    './popup/carrierController',
    './popup/locationController',
    './report/inventoryController',
    './report/reportShipmentDetailController',
    './report/reportShipmentCollectController',
    './report/reportShipmentCartonController',
    './report/shipmentDeliveredController',
    './report/receiptController',
    './report/ediLogController',
    './report/operateLogController',
    './report/receiptOperationController',
    './report/receiptDetailController',
    './report/receiptSummaryController',
    './report/qcReportController',
    './report/receiptPerformanceController',
    './report/efficiencyController',
    './report/locationAnalysisController',
    './report/inventoryHistoryController',
    './report/storerDailyAccountController',
    './report/onlineUserController',
    './monitor/mq/clusterController',
    './monitor/mq/consumeProgressController'
], function () {
});
