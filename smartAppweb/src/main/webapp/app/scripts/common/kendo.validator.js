/**
 * Created by MLS on 15/4/22.
 */
define(['kendo','jquery'], function (kendo, $) {
    "use strict";
    kendo.ui.validator.rules = {
//        required: function(input, params) {
//          if ($.trim(input.val()) === "") {
//            return false;
//          }
//          return true;
//        },
        date: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[date]')) return true;

            var value = input.val(),
                longValue;
            try{
                var a=value.split(" ");
                var d=a[0].split("/");

                if (a.length>1) {
                  var t=a[1].split(":");
                  longValue= new Date(d[0],(d[1]-1),d[2],t[0],t[1]);
                } else {
                  longValue= new Date(d[0],(d[1]-1),d[2]);
                }
                if (isNaN(longValue)) {
                  return false;
                }
              } catch(exception) {
                return false;
              }
          return true;
        },
        email: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[email]')) return true;

            //var pattern=new RegExp("/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i");
            //var pattern=new RegExp("^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$");
            var pattern=new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            return pattern.test(input.val());
        },
        telephone: function (input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[telephone]')) return true;

            var pattern=new RegExp("^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$");

            return pattern.test(input.val());
        },
        fax: function (input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[fax]')) return true;

            var pattern=new RegExp("^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$");

            return pattern.test(input.val());
        },
        mobilephone: function (input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[mobilephone]')) return true;

            var pattern=new RegExp("^0?[1][358][0-9]{9}$");

            return pattern.test(input.val());

        },
        ip: function (input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[ip]')) return true;

            var pattern=new RegExp("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");

            return pattern.test(input.val());

        },
        chinese: function (input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[chinese]')) return true;

            var pattern=new RegExp("^[\u4e00-\u9fa5]+$");

            return pattern.test(input.val());

        },
        zipcode: function (input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[zipcode]')) return true;

            var pattern=new RegExp("^[1-9]\\d{5}$");

            return pattern.test(input.val());

        },
        qq: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[qq]')) return true;

            var pattern=new RegExp("^[1-9]\\d{4,9}$");

            return pattern.test(input.val());
        },
        onlyNumber: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[onlyNumber]')) return true;

            var pattern=new RegExp("^[0-9]+$");

            return pattern.test(input.val());
        },
        onlyNumberWide: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[onlyNumberWide]')) return true;

            var pattern=new RegExp("^[-]?\\d+(\\.\\d{1,4})?$");

            return pattern.test(input.val());
        },
        onlyDecimal: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[onlyDecimal]')) return true;

            var pattern=new RegExp("^[-]?\\d+(\\.\\d{1,4})$");

            return pattern.test(input.val());
        },
        illegalLetter: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[illegalLetter]')) return true;

            var pattern=new RegExp("^[^\`\{\}\[!\(\+~@#%\^&\*\)\|\\\\:;\'\"><\?/=_]+$");

            return pattern.test(input.val());
        },
        onlyLetter: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[illegalLetter]')) return true;

            var pattern=new RegExp("^[a-zA-Z]+$");

            return pattern.test(input.val());
        },
        noSpecialCaracters: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[noSpecialCaracters]')) return true;

            var pattern=new RegExp("^[0-9a-zA-Z]+$");

            return pattern.test(input.val());
        },
        onlyImage: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[onlyImage]')) return true;

            var pattern=new RegExp("^.*?\.(jpg|jpeg|bmp|gif|png|JPG|JPEG|BMP|GIF|PNG)$");

            return pattern.test(input.val());
        },
        onlyPositiveNumberWide: function(input, params) {
            if ($.trim(input.val()) === "") return true;
            if (!input.is('[onlyPositiveNumberWide]')) return true;

            var pattern=new RegExp("^\\d+(\\.\\d{1,4})?$");

            return pattern.test(input.val());
        },
        matches: function(input) {
            if (!input.is('[data-matches]')) return true;
            var matches = input.data('matches');
            var match = $("#"+matches);
            if ( $.trim(input.val()) === $.trim(match.val()) )  {
                return true;
            } else {
                return false;
            }
            return true;
        },
        requireInput: function(input) {
            if (!input.is('[data-requireinput]')) return true;
            var requireInputStr = input.data('requireinput');
            var requireInput = $("#"+requireInputStr);
            if ($.trim(requireInput.val()) !== "" && $.trim(input.val()) === "")  {
                return false;
            } else {
                return true;
            }
        },
        minQty: function (input) {
            if (!input.is('[data-minqty]')) return true;
            if ($.trim(input.val()) === "") return true;
            var minStr = input.data('minqty');
            if ($.trim(input.val()) >= minStr) {
                return true;
            } else {
                return false;
            }
        },
        maxQty: function (input) {
            if (!input.is('[data-maxqty]')) return true;
            if ($.trim(input.val()) === "") return true;
            var maxStr = input.data('maxqty');
            if ($.trim(input.val()) <= maxStr) {
                return true;
            } else {
                return false;
            }
        }
    };
    kendo.ui.validator.messages = {
//        max: "不能输入大于 {1}的数量",
//        min: "不能输入小于 {1}的数量",
//        date: "请按照[2015/01/01 12:00]的格式输入日期",
//        email: "请输入正确的邮箱",
        pattern: "是非法的格式",
        required: "必须输入",
        step: "是非法的",
        url: "请输入正确的路径",
        //以下自定义
        date: "请按照[2015/01/01]的格式输入日期",
        email: "请输入正确的邮箱",
        telephone: "请输入有效的电话号码,如:010-29292929",
        fax: "请输入有效的传真号码,如:010-29292929",
        mobilephone: "请输入有效的手机号码",
        phone: "请输入有效的电话或手机号码",
        chinese: "请输入中文",
        zipcode: "请输入有效的邮政编码",
        qq: "请输入有效的QQ号码",
        onlyNumber: "请输入整数数字",
        onlyNumberWide: "请输入整数或小数（正负均可）",
        onlyDecimal: "请输入4位以内的小数（正负均可）",
        illegalLetter: "含有非法字符,请检查",
        onlyLetter: "请输入英文字母",
        noSpecialCaracters: "请输入英文字母或数字",
        onlyImage: "上传文件必须是常用图片类型",
        onlyPositiveNumberWide: "请输入正整数或小数",
        matches: function(input) {
            return input.data("matchesMsg");
        },
        requireInput: function(input) {
            return input.data("requireInputMsg");
        },
        minQty: function(input) {
            return "不能输入小于" + input.data("minqty") + "得数量";
        },
        maxQty: function(input) {
            return "不能输入大于" + input.data("maxqty") + "得数量";
        }
    };
});
