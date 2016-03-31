/**
 * Created by yu.liu on 2016/1/29.
 */


var MainBoard = function() {
    var _pageData = null;
    var _basePath = '';

    // ****************************************************************************************************
    // 初始化系列方法
    // ****************************************************************************************************

    // init button
    var initButton=function(){
        $(".btn-dialog").on('click',function(e) {
            e.preventDefault();
            $(".js").fadeIn(500);
        })

        $(".closeDialog").on('click',function(e) {
            e.preventDefault();
            $(".js").fadeOut(500);
        })
    }

    // initDialog
    var initDialog=function(){
        var heightwindow=$(window).height();
        var widthtwindow=$(window).width();

        var jsbodyDlheight= $('.jsbody>dl').height();
        var jsbodyHeight=$('.jsbody').css('top');
        var allheight=jsbodyDlheight+parseInt(jsbodyHeight);
      //  console.log("jsbodyDlheight:"+jsbodyDlheight+"  ,  jsbodyHeight :"+jsbodyHeight+"    ,allheight:"+allheight+"  ,heightwindow:"+heightwindow);
        if(allheight>heightwindow){
            $('.jsbody').css('overflow','scroll');
            $('.jsbody').css('top','10%');
            $('.jsbody').css('bottom','10%');
        }
    }



    // ****************************************************************************************************
    // 暴露在外的方法
    // ****************************************************************************************************
    return {
        init: function(params) {
            initButton();
            initDialog();
        }
    };
} ();
