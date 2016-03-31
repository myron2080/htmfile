/**
 * Created by myron on 2015/7/30.
 */

$(function(){
    $(".checked-no-choose").click(function(){

        $(".checked-no-choose").attr("style","display:none");
        $(".checked-choose").attr("style","display:inline-block");
    })

    $(".checked-choose").click(function(){

        $(".checked-choose").attr("style","display:none");
        $(".checked-no-choose").attr("style","display:inline-block");
    })

    $(".login-action").click(function(){
        // login-name
        var name=   $(".login-name").val();
        var password=    $(".login-password").val();
       if(name != '请输入你的用户名'&&password != '密码'){
           location.href="userinfo.html";
       }else{
           alert("请输入你的用户名或密码！")
       }


    })



})