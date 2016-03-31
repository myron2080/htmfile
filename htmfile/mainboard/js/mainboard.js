var mainMenu = [];
var ElderList = function() {
	
	var pageData = null;
	var basePath = location.origin + '/takecare';

	// ****************************************************************************************************
	// 初始化系列方法
	// ****************************************************************************************************
	// 初始化页面数据缓存
	var initPageData = function(params) {};
	
	// 初始化菜单
	var initMenu = function() {
		
		//添加菜单栏
		$.ajax({
			type: "post",
			async: false,
			url: "mainMenu.json",
		/*	data: {
				regionId: regionId,
				sex: selectedSex
			},*/
			dataType: "json",
			success: function(resultJson) {
				mainMenu=resultJson;
				
			}
		});


		//根据不同的选项生产创建不同的详细信息
		var addObject;
			addObject=$("<li><img src='img/user_ffffff_68.png'></li><li>Jack</li>" +
				"<li >用户信息设置<div></div></li>" +
				"<li >修改密码<div></div></li>" +
				"<li>更换用户<div></div></li>" +
				"<li  >退出系统<div></div></li>");
			$(".left-nvgInfo ul[name='menu01']").append(addObject);

		function getMainMenuInfoAction(){
				for (var i = 0; i < mainMenu.length; i++) {
					var nvgObject=$("<li  id='"+mainMenu[i].id+"' class='left-nvg-li'></li>");
					nvgObject.html("<img src='img/"+mainMenu[i].icon+".png' alt="+mainMenu[i].name+">"+mainMenu[i].name);
					$(".left-nvg-ui").append(nvgObject);


					$('.left-nvgInfo').append("<ul name=menu"+mainMenu[i].id+"></ul>");
					//第二层判断
					if(mainMenu[i].submenu.length!=0){
						var addObject2;
						for (var j = 0; j < mainMenu[i].submenu.length; j++) {

							addObject2=$("<li id='"+mainMenu[i].submenu[j].id+"'></li>");
							addObject2.html(mainMenu[i].submenu[j].name);
							$(".left-nvgInfo ul[name='menu"+mainMenu[i].id+"']").append(addObject2);
							//第三层判断
							if(mainMenu[i].submenu[j].submenu.length!=0){

								//	var X= $(this).position().top;
								//	var Y = $(this).position().left;
									var stringPath="";
									for (var k = 0; k < mainMenu[i].submenu[j].submenu.length; k++) {
										stringPath+="<li id='"+mainMenu[i].submenu[j].submenu[k].id+"'  src='"+mainMenu[i].submenu[j].submenu[k].url+"' >"+mainMenu[i].submenu[j].submenu[k].name+"</li>";
									}
									var zombieObject=$("<div name='menu"+ mainMenu[i].submenu[j].id+"' class='left-nvg-three''></div>");
								//	zombieObject.css("position","absolute");			//设置为绝对定位
									zombieObject.css("width","100px");
									//zombieObject.css("border","solid 1px");
									zombieObject.css("display","none");
									//zombieObject.css("height","200px");
									//zombieObject.css("left","15%");		//X轴坐标
								//	zombieObject.css("top",X+"px");			//y轴坐标
									zombieObject.html("<ul>"+stringPath+"</ul>");
									$(".page-left-content-right").append(zombieObject);


							}
						}

					}else{
						addObject2=$("<li>暂无</li>");
						$(".left-nvgInfo ul[name='menu"+mainMenu[i].id+"']").append(addObject2);

					}



				}
			}
		
	
		getMainMenuInfoAction();
		
		
	};
	
	// 初始化列表
	var initTable = function() {};
	
	// 初始化报表
	// 这个方法写得很简单，就纯粹为了直接用6213,0这样的初始化参数。
	var initCharts = function() {};
	
	
	
	// ****************************************************************************************************
	// 绑定元素事件
	// ****************************************************************************************************
	var bindEvent = function() {
		
		// 确定按钮点击事件
		// 等价于页面中写 onclick="check()"
		/*$('.left-nvg-ui li').unbind('click').on('click', function(e) {});*/
		
		// 确定获取焦点
		$('.left-nvg-ui li').unbind('mousemove').on('mousemove', function(e) {
			e.preventDefault();
			$(".left-nvg-three").attr('style','display:none');
			$("#page-left-content-right").attr("onmousemove","");
			$('.left-nvg-ui li').attr('style','background:#C4C4C4');
			$(this).attr('style','background:#9AC0CD');
			$('.left-nvgInfo ul').attr('style','display:none');
			//alert($(this).attr("id"));
			$(".left-nvgInfo ul[name='menu"+$(this).attr('id')+"']").attr('style','display:inline');


		});

		//第二级:鼠标指针获得时触发
		$(".left-nvgInfo ul li").unbind('mouseenter').on('mouseenter', function(e) {

			$('.left-nvgInfo ul li').attr('style','background:#C4C4C4');
			$(this).attr('style','background:#9AC0CD');

			var X= $(this).position().top;
			$(".left-nvg-three").attr('style',"display:none;");
			//y轴坐标
			$(".left-nvg-three[name='menu"+this.id+"']").attr('style',"position:absolute; display:inline; top:"+X+"px;");

			//$("#page-left-content-right").attr("onmousemove","leftonmouseleaveInfo(event)");


	});
		//第二级:鼠标指针离开时触发
		$(".left-nvgInfo ul li").unbind('mouseleave').on('mouseleave', function(e) {



		});


		//第三级:鼠标指针离开时触发
		$(".left-nvg-three").unbind('mouseleave').on('mouseleave', function(e) {
		// onmouseleave='leftonmouseleaveInfoAction(this)
			$(".left-nvg-three").attr('style','display:none');
			$("#page-left-content-right").attr("onmousemove","");
		});

		$(".left-nvg-three ul li").unbind('click').on('click', function(e) {
			//onclick='nvgThreeClick(this)'
			//console.log(this.id);
			if(this.id=="10-01-01"){
				$("#contentChangeIframe").attr("src","tableList.jsp");
				//$("#contentChangeIframe").attr("src","pages/mainboard/tableList.jsp");
			}else{
				$("#contentChangeIframe").attr("src","positioningPages_file/positioningPages.html");
			}
			$('.left-nvg-three ul li').attr('style','background:#C4C4C4');
			$("#"+this.id).attr('style','background:#9AC0CD');

		});



		
	}
	
	
	
	
	// ****************************************************************************************************
	// 作用域内部方法
	// ****************************************************************************************************
	// 刷新列表
	var _refreshTable = function(regionId, selectedSex) {};
	
	// 刷新报表
	var _refreshChart = function(regionId, selectedSex) {};
	
	// ****************************************************************************************************
	// 暴露在外的方法
	// ****************************************************************************************************
	return {
		init: function(params) {
			//initPageData(params);
			initMenu();
			//initTable();
			//initCharts();
			bindEvent();
		}
	};
} ();


	//***********************************************************************************************
	//第三级菜单单击时间
	

	//鼠标指针离开时触发
/*	var leftonmouseleaveInfo =function(even){
	
			var nvgthree=$(".left-nvg-three");
			var ny= nvgthree.position().top;
			var nx = nvgthree.position().left+100;
			var cx=even.clientX;
			var cy=even.clientY;
			console.log(nx+" nx,ny "+ny+" . cx"+cx+" ,cy "+cy);
			if(ny>cy){
				$(".left-nvg-three").attr('style','display:none');
				$("#page-left-content-right").attr("onmousemove","");
			}
		};*/
	/*console.log(even.id);*/
