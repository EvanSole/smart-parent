$(function(){
//    //居中
//    $('.login_main').center();
    document.getElementById("username").focus();
    $("#username").keydown(function(event){
        if(event.keyCode==13){
            login()
        }
    })
    $("#password").keydown(function(event){
        if(event.keyCode==13){
            login()
        }
    })

    $("#validateCode").keydown(function(event){
        if(event.keyCode==13){
            login()
        }
    })

});

//刷新验证码图片
$(function(){
    $('#validatePic').click(function (){
        $(this).attr('src', '/validate.jpg?' + Math.floor(Math.random()*100) );
    })
});

//登录
function login(isForceLogin) {
    var errorMsg = "";
    var tenantNo = document.getElementById("tenantNo");
    var loginName = document.getElementById("username");
    var password = document.getElementById("password");
    var tenantNo = document.getElementById("tenantNo");

    if(isForceLogin === undefined){
        isForceLogin = false;
    }
    var validateCode = document.getElementById("validateCode");
    if (!loginName.value) {
        errorMsg += "&nbsp;&nbsp;用户名不能为空!";
    }
    if (!password.value) {
        errorMsg += "&nbsp;&nbsp;密码不能为空!";
    }
//    if (!tenantNo.value) {
//        errorMsg += "&nbsp;&nbsp;租户不能为空!";
//    }
    var displayProperty = $('#login_validate').css('display');
    if (displayProperty != 'none') {
        if (!validateCode.value) {
            errorMsg += "&nbsp;&nbsp;请输入验证码!";
        }
    }
    if (errorMsg !== "") {
        $(".login_info").html(errorMsg);
        $(".login_info").show();
    }
    else {
        $(".login_info").show();
        $(".login_info").html("&nbsp;&nbsp;正在登录中...");
        $.ajax({
            url:basePath+"login",
            type: "POST",
            data:{uname:loginName.value,pwd:password.value,validateCode:validateCode.value,
                tenantNo:tenantNo.value,isForceLogin:isForceLogin},
            dataType: 'json',
            success: function(result){
                if(result.suc==true) {
                    $(".login_info").html("登录成功正在跳转...");
                    top.location.href = basePath+"app/index.html";
                }else{
                    if(result.code == 'E00141'){
                        $(".login_info").html("");
                        $.when(kendo.ui.ExtOkCancelDialog.show({
                                title: "重要提示",
                                message: result.message,
                                width:600,
                                icon: "k-ext-warning" })
                        ).done(function (response) {

                                if(response.button == 'OK'){
                                    login(true);
                                }else{
                                    return;
                                }
                        });

                    }else{
                        if(result.code != 'E00142'){
                            $("#login_validate").show(500);
                        }

                        $(".login_info").html(result.message);
                    }




                }
            }
        });
    }
}