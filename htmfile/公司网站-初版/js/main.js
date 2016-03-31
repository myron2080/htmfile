/**
 * Created by Administrator on 2015-7-18.
 */

    //  页面头部图片点击切换事件
$(".carousel-indicators li").unbind('click').on('click', function(e) {
    e.preventDefault();
    $(".carousel-indicators li").removeClass("active");
    $(this).addClass("active");
    var index= $(this).index();
    var $bannerli= $(".banner>ul li");
    $bannerli.attr("style","opacity: 0; display: list-item; float: none; position: absolute; z-index: -1; width: 100%;");
    $($bannerli[index]).attr("style","opacity: 1; display: list-item; float: none; position: absolute; z-index: -1; width: 100%;");

});

//解决方案鼠标移入事件
$(".solu-nav li a").unbind('mouseenter').on('mouseenter', function(e) {
    e.preventDefault();
    var getactivedata=  $(this).attr("active-data");

    $(".tab-pane").removeClass("active")
    $("#"+getactivedata).addClass("active")
});