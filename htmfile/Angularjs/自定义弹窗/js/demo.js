	
	//回调弹窗
	function autoAlert(option){
		var that = this;
		var atitle = option.atitle || "温馨提示";
		var alertWord = option.alertWord || "";   //提示的内容
		var confirmWord = option.confirmWord || "确定";  //第一个按钮钮内容
		var cancelWord = option.cancelWord || "取消";  //第二个按钮内容	
		var cancelShow = option.cancelShow || false; //  是否显示第二个按钮，true就显示
		var hideclose = option.hideclose || false;   //是否显示按钮
		var confirm = option.confirm || "";		//点击右边的按钮回调
		var cancel = option.cancel || "";		//点击左边的按钮回调
		var unclose = option.unclose || false; 	//禁止关闭
		
		var html = "";
		html = '<div class="windows alert_windows on"><div class="windows_box"><div class="alert_result"><div class="result_top">'+ atitle +'<a href="javascript:void(0);" class="ico_cha cha_reg"></a></div><div class="alert_word">'+ alertWord +'</div><div class="alert_btnbox"><a href="javascript:void(0);" class="btn_cancel btn_alert">'+ cancelWord +'</a><a href="javascript:void(0);" class="btn_confirm btn_alert">'+ confirmWord +'</a></div></div></div></div>';
		$("body").append(html)

		that.winLen = $(document).find(".alert_windows").length;
		if( cancelShow == true ){
			$(".btn_cancel").addClass("show");
		}
		if( hideclose == true ){
			$(".ico_cha").addClass("hide");
		}

			
 		//关闭叉
 		$(".ico_cha").on('click',function(){
			$(this).parents(".windows").remove();
		})
 		//第一个按钮点击
		$(".btn_confirm").on('click',function(){
			if(confirm && typeof(confirm) === "function"){
	 			option.confirm();
	 		}
	 		if(unclose != true){
	 			$(this).parents(".windows").remove();
	 		}
		})
		//第二个按钮点击
		$(".btn_cancel").on('click',function(){
			if(cancel && typeof(cancel) === "function"){
	 			option.cancel();
	 		}
	 		$(this).parents(".windows").remove();
		})

		// 直接调用关闭
		close = function(){
			$(".alert_windows").eq(that.winLen - 1).remove();
		}  
	}