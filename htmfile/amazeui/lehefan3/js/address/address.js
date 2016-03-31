var Address = function () {
    var _pageData = null;
    var _basePath = location.origin + '/lunch/api';
    var user_id = "";
    var _global = {};
    // ****************************************************************************************************
    // 初始化系列方法
    // ****************************************************************************************************

    // 获取用户ID
    var initUserId = function () {
        user_id = $.frontEngine.getUrlParameter("uid");//获取url中id(param);

    };
    // 初始化用户地址列表
    var initUserAddressList = function () {
        //console.log(user_id);
        var _UserAddressListData = null;
        var addressCount = 0;
        //var url="http://dev:8098/lunch/api";
        var url = "data/getUserAddressList.json";
        var jsonData = {
            'getDataIdent': 'Y',
            'apiNumber': '703_getUserAddressList',
            'params': '{"userId":"00066871e24640788596fc2bd66ee699"}'
        }
        //_basePath
        $.frontEngineAjax.executeAjax(url, "get", jsonData, function (result) {
                if (result.resultType == 0) {
                    return;
                }
                if (result.resultData.addressCount == 0) {
                    addressCount = 0;
                } else {
                    addressCount = result.resultData.addressCount;
                    _UserAddressListData = result.resultData.addressList;

                    var $UserAddressListDiv = $('#userAddressListUL');
                    var UserAddressListHtml = '';
                    for (var i = 0; i < addressCount; i++) {
                        UserAddressListHtml = UserAddressListHtml + '<li id=' + _UserAddressListData[i].Id + ' class="box-show am-g am-list-item-desced am-list-item-thumbed am-list-item-thumb-right pet_topci_list"><div class="groupSite bgWhite"><label class="am-radio">';

                        if (_UserAddressListData[i].isDefaul == "YES") {
                            UserAddressListHtml = UserAddressListHtml + '<input type="radio" name="radio1" value="" data-am-ucheck checked>我的送餐地址';
                        } else {
                            UserAddressListHtml = UserAddressListHtml + '<input type="radio" name="radio1" value="" data-am-ucheck>我的送餐地址';
                        }
                        UserAddressListHtml = UserAddressListHtml + '</label><a href="#"  class="deleteLink" addressIdli=' + _UserAddressListData[i].Id + ' >删除</a><a href="editAddress.html?uid=' + user_id + '&addressId=' + _UserAddressListData[i].Id + '" class="editLink">编辑</a><ul><li>配送站点：' + _UserAddressListData[i].counterPointName + '</li><li>送达地址：' + _UserAddressListData[i].floorName + _UserAddressListData[i].address + '</li></ul></div></li>';
                    }
                    $UserAddressListDiv.append(UserAddressListHtml);
                    //绑定事件
                    initClickAddress();
                }
            }, function () {
            }, "json", "false"
        );

    }

    //初始化事件
    var initClickAddress = function () {
        //deleteAddress
        $('.deleteLink').unbind('click').on('click', function (e) {
            //  preventDefault 当点击提交按钮时阻止对表单的提交。但此方法并不被ie支持
            e.preventDefault();
            var addressIdli = $(this).attr("addressIdli");
            $('#my-confirm').modal({
                onConfirm: function (options) {

                    //console.log(addressIdli);
                    $("#" + addressIdli).remove();
                    // var url="http://dev:8098/lunch/api";
                    var jsonData = {
                        'getDataIdent': 'Y',
                        'apiNumber': '703_delUserAddress',
                        'params': '{"addressId":"' + addressIdli + '"}'
                    }
                    // ajax
                    $.ajax({
                        url: _basePath,
                        type: 'get',
                        data: jsonData,
                        dataType: 'json',
                        async: "false",
                        success: function (data) {
                            // console.log(data);
                            $('#your-modal').modal('toggle');
                            $('#userAddressListUL').html("")
                            initUserAddressList();
                        },
                        error: function (e) {
                            //console.log(e);
                        }
                    });

                },
                // closeOnConfirm: false,
                onCancel: function () {

                }
            });


        });

        //radioAddress
        $('input[name="radio1"]').unbind('click').on('click', function () {
            var addressIdli = $(this).parent().parent().parent();
            addressIdli = $(addressIdli).attr("id");
            user_id = "00066871e24640788596fc2bd66ee699";
            $.ajax({
                url: _basePath + '?getDataIdent=Y&apiNumber=703_updateAddressStatus&params={"addressId":"' + addressIdli + '","userId":' + user_id + '}',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.resultType == 1) {
                        if (data.resultData.STATE == "SUCCESS") {
                            $('#your-modal').modal('toggle');
                            setTimeout(function () {
                                history.go(-1);
                            }, '1000')

                        }

                    }
                },
                error: function (e) {
                    $('#your-modal').modal('toggle');
                    setTimeout(function () {
                        history.go(-1);
                    }, '1000')
                }
            });


            /* var aaa={params:{"cartStr":[{"dishesId":"xxx","dishesCount":2},{"dishesId":"xxx","dishesCount":2}],"userId":"xxx"}};
             console.log(JSON.stringify(aaa));
             console.log(aaa);*/


        });


    }


    // ****************************************************************************************************
    // 暴露在外的方法
    // ****************************************************************************************************
    return {
        init: function (params) {
            initUserId();
            initUserAddressList();
            //initClickAddress();
        }
    };
}();
