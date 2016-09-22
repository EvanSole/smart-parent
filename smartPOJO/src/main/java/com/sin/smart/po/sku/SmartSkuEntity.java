package com.sin.smart.po.sku;

import com.sin.smart.entity.po.AutoBasePO;
import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_smart_sku")
public class SmartSkuEntity extends AutoBasePO {

    private Long storerId;
    private Long warehouseId;
    private Long tenantId;
    private String sku;
    private String upc;
    private String barcode;
    private String itemName;
    private Byte isActive;
    private Byte isDel;
    private String datasourceCode;

    @Basic
    @javax.persistence.Column(name = "warehouse_id")
    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    @Basic
    @javax.persistence.Column(name = "tenant_id")
    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }

    @Basic
    @javax.persistence.Column(name = "storer_id")
    public Long getStorerId() {
        return storerId;
    }

    public void setStorerId(Long storerId) {
        this.storerId = storerId;
    }

    @Basic
    @javax.persistence.Column(name = "sku")
    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    @Basic
    @javax.persistence.Column(name = "upc")
    public String getUpc() {
        return upc;
    }

    public void setUpc(String upc) {
        this.upc = upc;
    }

    @Basic
    @javax.persistence.Column(name = "barcode")
    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    @Basic
    @javax.persistence.Column(name = "item_name")
    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    @Basic
    @javax.persistence.Column(name = "is_active", nullable = false)
    public Byte getIsActive() {
        return isActive;
    }

    public void setIsActive(Byte isActive) {
        this.isActive = isActive;
    }

    @Basic
    @javax.persistence.Column(name = "is_del", nullable = false)
    public Byte getIsDel() {
        return isDel;
    }

    public void setIsDel(Byte isDel) {
        this.isDel = isDel;
    }

    @Basic
    @javax.persistence.Column(name = "datasource_code", nullable = false)
    public String getDatasourceCode() {
        return datasourceCode;
    }

    public void setDatasourceCode(String datasourceCode) {
        this.datasourceCode = datasourceCode;
    }

}
