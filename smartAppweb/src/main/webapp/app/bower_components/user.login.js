/*
$(function(){
    $("#userName").keydown(function(event){
        if(event.keyCode==13){
            login();
            return;
        }
    });
    $("#password").keydown(function(event){
        if(event.keyCode==13){
            login();
            return;
        }
    });

    $("#validateCode").keydown(function(event){
        if(event.keyCode==13){
            login();
            return;
        }
    });

   //刷新验证码图片
    $('#validatePic').click(function (){
        $(this).attr('src', '/validate.jpg?' + Math.floor(Math.random()*100) );
    });

});

//登录
function login() {
    var errorMsg = "";
    var warehouseNo = $("#warehouseNo").val();
    var loginName = $("#userName").val();
    var password = $("#password").val();

    var validateCode = $("#validateCode").val();
    if (loginName === undefined ||loginName ==="" ) {
        //errorMsg += "&nbsp;&nbsp;用户名不能为空!";
        errorMsg += "&nbsp;&nbsp;Username is required!";
        $(".login_info").html(errorMsg);
        $(".login_info").addClass("alert-danger")
        $(".login_info").removeClass("alert-success");
        $(".login_info").show();
        return false;
    }
    if (password === undefined || password ==="") {
        //errorMsg += "&nbsp;&nbsp;密码不能为空!";
        errorMsg += "&nbsp;&nbsp;Password is required!";
        $(".login_info").html(errorMsg);
        $(".login_info").addClass("alert-danger")
        $(".login_info").removeClass("alert-success");
        $(".login_info").show();
        return false;
    }
    var displayProperty = $('#login_validate').css('display');
    if (displayProperty != 'none') {
        if (validateCode === undefined ||validateCode ==="" ) {
            //errorMsg += "&nbsp;&nbsp;请输入验证码!";
            errorMsg += "&nbsp;&nbsp; captcha is required!";
            $(".login_info").html(errorMsg);
            $(".login_info").addClass("alert-danger")
            $(".login_info").removeClass("alert-success");
            $(".login_info").show();
            return false;
        }
    }
    //验证通过
    $(".login_info").removeClass("alert-danger");
    $(".login_info").addClass("alert-success");
    $(".login_info").show();
    $(".login_info").html("&nbsp;&nbsp;正在登录中,请稍候...");
    var basePath = getBasePath();
    $.ajax({
        url: basePath +"login",
        type: "POST",
        data:{ userName:loginName,password:password,captcha:validateCode,
             warehouseNo:warehouseNo,rememberMe:true },
        dataType: 'json',
        success: function(result){
            if(result.suc == true) {
                $(".login_info").html("登录成功正在跳转...");
                top.location.href = basePath+"app/index.html";
            }else{
                errorMsg = "登录失败!"
                $(".login_info").html(errorMsg);
                $(".login_info").addClass("alert-danger")
                $(".login_info").removeClass("alert-success");
                $(".login_info").show();
            }
        }
    });
}

//获取当前服务地址
function getBasePath() {
    var port = window.location.port;
    if(port != 80){
       port = ":"+port+"/"
    }else{
       port = "/";
    }
    return  window.location.protocol+"//"+window.location.hostname+port;
}*/
