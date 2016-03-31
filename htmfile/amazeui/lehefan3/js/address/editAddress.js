var EditAddress = function() {
    var _pageData = null;
    var _basePath = location.origin + '/lunch/api';
    var address_id='';
    var _global = { };
    // ****************************************************************************************************
    // 初始化系列方法
    // ****************************************************************************************************



    // 获取ID
    var initIds = function() {
        address_id =$.frontEngine.getUrlParameter("addressId");//获取url中id(param);

    };


    // 初始化站点选择菜单和子菜单
    var initPointList=function(){
        var _pointListNavData=null;
        //var url="http://dev:8098/lunch/api";
        //ar url="data/getCounterPointFloorList.json";

        var jsonData = {
            'getDataIdent':'Y',
            'apiNumber':'703_getCounterPointFloorList',
            'params':'{"page":1,"pageSize":10}'
        }
        $.ajax({
            url:_basePath,
            type:"get",
            dataType: 'json',
            data: jsonData,
            async:false,
            success: function(result) {
                _pointListNavData = result.resultData.item;
            }
        });

        var $pointListNavUl = $('#pointListNavUl'); /*站点选择菜单*/
        var $pointListInfoDiv = $('#pointListInfo');/*站点选择子菜单*/

        var pointListNavUlHtml='';
        var pointListInfoDivHtml='';

        if(_pointListNavData==null || _pointListNavData=="" || typeof(_pointListNavData)=="undefined"){
            return;
        }
        if(_pointListNavData.length==0){return;}

        for(var i = 0, i_len = _pointListNavData.length; i < i_len; i++) {
            pointListNavUlHtml  =pointListNavUlHtml+ '<li><a href="#'+_pointListNavData[i].id+'">'+_pointListNavData[i].name+'</a></li>';
            pointListInfoDivHtml=pointListInfoDivHtml+'<div class="am-tab-panel" id="'+_pointListNavData[i].id+'"><ul>';
            if(_pointListNavData[i].floors.length!=0){

                for(var j = 0, j_len = _pointListNavData[i].floors.length; j < j_len; j++) {
                    var pointListInfoData=_pointListNavData[i].floors;
                    pointListInfoDivHtml  =pointListInfoDivHtml+ '<li id="'+pointListInfoData[j].id+'" >'+pointListInfoData[j].name+'</li>';
                }
            }
            pointListInfoDivHtml=pointListInfoDivHtml+' </ul></div>';
        }

        $pointListNavUl.append(pointListNavUlHtml);
        $pointListInfoDiv.append(pointListInfoDivHtml);
        $('#pointListNavUl li:first').addClass("am-active");
        $('#pointListInfo div:first').addClass("am-active");
    }


    // 初始化点击事件
    var initClick=function(){
        $("#pointListInfo li").unbind('click').on('click', function() {
            $("#getZhandian").val(this.innerText);
            $("#getZhandian").attr("floorId",$(this).attr("id"));
            var $p_vid=  $(this).parent().parent();
            $("#getZhandian").attr("counterPointId",$($p_vid).attr("id"));
            $("#getZhandian").focus();
        });




    }


    // 初始化修改页面时的信息
    var initEditAddressDetail=function(){
        //测试数据路径
        //var url='data/getAddressDetail.json';
        //var url="http://dev:8098/lunch/api";
        var jsonData = {
            'getDataIdent':'Y',
            'apiNumber':'703_getAddressDetail',
            'params':'{"addressId":"'+address_id+'"}'
        }
        if(address_id==null || address_id=="" || typeof(address_id)=="undefined"){
            return;
        }
        var _addressDetailData=null;
        $.ajax({
            url:_basePath,
            type:"get",
            dataType: 'json',
            data: jsonData,
            async:false,
            success: function(result) {
                _addressDetailData = result.resultData;
            }
        });

        if(_addressDetailData.length==0){return;}

        $("#getZhandian").val(_addressDetailData.floorName);
        $("#getZhandian").attr("counterPointId",_addressDetailData.counterPointId);
        $("#getZhandian").attr("floorId",_addressDetailData.counterpointfloorId);
        $("#inputFloor").val(_addressDetailData.layer);
        $("#inputBuilding").val(_addressDetailData.number);
        $("#inputCompanyName").val(_addressDetailData.companyName);
      /*  var $pointListNavUl = $('#pointListNavUl'); /!*站点选择菜单*!/
        var $pointListInfoDiv = $('#pointListInfo');/!*站点选择子菜单*!/
        $('#pointListNavUl li:first').addClass("am-active");
        $('#pointListInfo div:first').addClass("am-active");*/
    }


    // ****************************************************************************************************
    // 暴露在外的方法
    // ****************************************************************************************************
    return {
        init: function(params) {
            initIds();
            initPointList();
            initClick();
            initEditAddressDetail();
        }
    };
} ();
