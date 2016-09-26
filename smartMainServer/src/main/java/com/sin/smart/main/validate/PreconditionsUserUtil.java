package com.sin.smart.main.validate;

import com.google.common.base.Preconditions;
import com.sin.smart.dto.SmartUserDTO;

public class PreconditionsUserUtil {

    public static void createUserValidate(SmartUserDTO smartUserDTO) {
        Preconditions.checkNotNull(smartUserDTO, "参数不合法!");
        Preconditions.checkArgument(null != smartUserDTO.getUserName(), "用户名不能为空!");
        Preconditions.checkArgument(null != smartUserDTO.getPassword(), "密码不能为空!");
        Preconditions.checkArgument(smartUserDTO.getTenantId() > 0, "租户不能为空!");
    }

}
