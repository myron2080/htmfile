/**
 * ***************************************************************************
 * 前端页面js引擎
 * @创建日期 : 2015.12.29
 *      ***************************************************************************
 */
// TODO 格式还需进一步修改，采用strict方式。
(function($) {

	/**
	 * 通用保持方法
	 */
	var common_doSave = function(url,changeUrl,type,id,data) {
		type = (type==null || type=="" || typeof(type)=="undefined")? "post" : type;
		var getdata = (id==null || id=="" || typeof(id)=="undefined")? data : $('#'+id).serialize();
		//alert(getdata);

		$.ajax({
			url:url,
			type:type,
			dataType: 'json',
			data: getdata,
			async:false,
			success: function(result) {
				$('#your-modal').modal('toggle');
				setTimeout(function(){
					window.location=changeUrl;
				},'1000')

			},
			error: function(e){
				//console.log(e);
			}
		});
		/*$.frontEngineAjax.executeAjax(
			url,
			type,
			getdata,
			function(data){
				console.log(data);
				alert(data);
			},
			function(){
				alert("error");
			}
		);*/
	};

	var getUrlParameter=function(name){
		var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");//正则表达式取得url中的参数
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]); return null;
	}



	// ****************************************************************************************************
	// $.frontEngine.methodName形式调用
	// ****************************************************************************************************
	$.extend({
		frontEngine: {
			common_doSave: function(url,changeUrl,type,id,data) {
				return common_doSave(url,changeUrl,type,id,data);
			},
			getUrlParameter: function(name) {
				return getUrlParameter(name);
			}
		}
	});


}) (jQuery);