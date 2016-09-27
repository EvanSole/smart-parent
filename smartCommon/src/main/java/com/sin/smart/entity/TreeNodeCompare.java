package com.sin.smart.entity;

import java.util.Comparator;

public class TreeNodeCompare implements Comparator {

    @Override
    public int compare(Object o1, Object o2) {
        TreeNode tn1 = (TreeNode)o1;
        TreeNode tn2 = (TreeNode)o2;
        if(tn1!= null && tn2!=null){
            return (int)(tn1.getSortindex()-tn2.getSortindex());
        }
        return 0;
    }
}
