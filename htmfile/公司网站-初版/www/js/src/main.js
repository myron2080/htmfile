define(function(require, exports, module) {
    $ = require("jquery");
    require("plugins")($);
    require("./common/feedback")($);
    require("./common/dropdown")($);
    require("./common/unslider")($);

    $(".mytip").on("mouseover", function(){
        $(this).children('ul').show();
    })
    $(".mytip").on("mouseout", function(){
        $(this).children('ul').hide();
    })
    
    $("#buy_ecshop").click(function(e){
       region_id = $("#region_center option:selected").attr("region_id");
       if(!(region_id == 1001 || region_id == 2001 || region_id == 1)){
           e.preventDefault();
           alert("请选择数据中心");
       }
       if($("#ecshop_license").prop("checked") == false){
            e.preventDefault();
            alert("请选择同意UCloud平台服务协议");
        }
    });

    href_base = $("#buy_ecshop").attr("href");
    $("#region_center").change(function(e){
        region_id = $(this).find("option:selected").attr("region_id");
        href = href_base +"?__r="+region_id;
        $("#buy_ecshop").attr("href", href);

    })


    $("li>a[href='<{{link}}>']").parent().addClass("active");
    $("ul>li>ul>li>a[href='<{{product_link}}>']").parent().addClass("active");
    $("td.faq-ask[tip]").click(function() {
        var $this = $(this);
        var answer = $("td.faq-answer[tip=" + $this.attr("tip") + "]");
        if (answer.css('display') == 'none') {
            $("td.faq-answer[tip=" + $this.attr("tip") + "]").show();
            $this.find('i').removeClass('support-plus');
            $this.find('i').addClass('support-minus');
        } else {
            $("td.faq-answer[tip=" + $this.attr("tip") + "]").hide();
            $this.find('i').removeClass('support-minus');
            $this.find('i').addClass('support-plus');
        }
    });

    $('.carousel').carousel();
    $('.carousel').click(function(e) {
        var $this = $(this),
            $target = $(e.target),
            i = 0,
            $parent,
            $el;
        if ($target.hasClass('carousel-control')){
            $this.carousel($target.data('slide'));
        } else if($target.hasClass('dot')){
            $parent = $target.parent();
            if($parent.hasClass('dots carousel-indicators')) {                  
                $el = $parent.find(":first-child");
                for(; $el; $el = $el.next()) {
                    if($el[0] === e.target){
                        $this.carousel(i);
                        break;
                    }
                    i++;
                }
            }
        }
    });

    var $banners = $(".banner");
    $banners.unslider({speed: 500,dots: true});
    $banners.each(function() {
        var $this = $(this),
            $ul = $this.children('ul'),
            $indicator,
            data;
        if ($ul && $ul.children('li').length < 2) {
            $indicator = $this.find('.dots');
            $indicator && $indicator.hide();
            data = $this.data($this.data('key'));
            data.stop();
            // ---- fix the blink bug on ie 8, 9 -----
            data.to = function() {};
            // --------------------------------------
        }
    });
    $(window).resize(function() {
        var bannerWidth = document.body.clientWidth;
        $('.ad').css('width',bannerWidth);
        $('.ad .banner').css('width',bannerWidth);
    });


    var tabs = $("#my-tab .tab");
    var tab_contents = $("#my-tab-content .tab-pane");
    tabs.find("a").click(function(e){
        e.preventDefault();
        var target = $(e.currentTarget);  
        var href = target.attr('href');
        tabs.removeClass('active');
        target.parents('.tab').addClass('active');
        tab_contents.removeClass('active');
        $(href).addClass('active');
    });

    $('.js-tab-hover').on('hover.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('.solu-nav a').hover(function(){
        var activeData = $(this).attr('active-data');
        $('.solu-nav li').removeClass('active');
        $('.solu-content .tab-pane').removeClass('active');
        $(this).parent('li').addClass('active');
        $('#'+activeData).addClass('active');
    });

    $(".prod").mouseenter(function(){
        var $target = $(this);
        $target.find(".prod-link").show(); 
        $target.find(".prod-description").hide(); 
    });

    $(".prod").mouseleave(function(){
        var $target = $(this);
        $target.find(".prod-description").show(); 
        $target.find(".prod-link").hide(); 
    });


    //bottom login register
    $('.try-infor').removeClass('loged').addClass('reg');
    $.ajax({
        url: "http://account.ucloud.cn/cas/check_login?callback=?",
        dataType: "jsonp",
        async: false,
        jsonpCallback: 'jsonCallback',
        success: function(json) {
            if(json && json.isLogin) {
                $('.try-infor').removeClass('reg').addClass('loged');
            }
        }
    });
    function checkUrl() {
        var str = 'ssd';
        var url = window.location.href;
        var url_position = url.indexOf('#') + 1;
        var control = url.substring(url_position);
        if(control == str){
            $('.nav-tabs li').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('#uhost-standard').removeClass('active');
            $('#uhost-ssd').addClass('active');
        }
    }
    checkUrl();

});
