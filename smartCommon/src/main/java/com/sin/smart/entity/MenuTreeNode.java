package com.sin.smart.entity;

import java.io.Serializable;
import java.util.List;

public class MenuTreeNode implements Serializable{
    private String id;
    private String name;
    private String parentId;
    private String path;
    private String code;
    private String icons;
    private List<MenuTreeNode> children;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getIcons() {
        return icons;
    }

    public void setIcons(String icons) {
        this.icons = icons;
    }

    public List<MenuTreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<MenuTreeNode> children) {
        this.children = children;
    }
}
