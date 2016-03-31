/**
 * Created by myron on 2015/7/30.
 */

$(function(){
    $(".refuse").click(function(){
       // refuseInfo
        $(".action-buttom").attr("style","display:none");
        $(".refuseInfo").attr("style","display:inline-block");
    })

    $(".action-buttom-cancel").click(function(){
        // refuseInfo
        $(".refuseInfo").attr("style","display:none");
        $(".action-buttom").attr("style","display:inline-block");
    })

    //allocate-personnel
    $(".allocate-personnel").click(function(){
        location.href="select.html";
    })
})