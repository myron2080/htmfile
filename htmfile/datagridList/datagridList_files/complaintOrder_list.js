var List = function() {
	var pageData = null;
	var basePath = '';
	var $document = $(document);


	var initPageData = function() {
		pageData = $.frontEngine.initPageData({
			pageName: 'elder_list'
		});
		basePath = pageData.basePath;
	};

	// 初始化搜索框
	var initSearch = function() {

		// 根据不同listType显示不同列表
		$.frontEngine.initSearch({
			searchItems:
				[{field: 'customerName',title: '客户姓名',type:'input',data:'jack'},
					{field: 'mobilePhone',title: '客户手机',type:'input',data:'12345678911'},
					{field: 'userId',title: '受理坐席',type:'input',data:'aa'},
					{field: 'complainType',title: '投诉类型',type:'multiple',data:[{title:'家政服务',value:'1'},{title:'健康中心',value:'2'},{title:'视频连接',value:'3'},{title:'饮食',value:'4'}]},
					{field: 'complainClass',title: '投诉等级',type:'single',data:[{title:'level1',value:'1'},{title:'level2',value:'2'},{title:'level3',value:'3'}]},
					{field: 'startDate',title: '受理时间',type:'inputTime',data:'2010-05-11'},
					{field: 'ifVisit',title: '是否回访',type:'single',data:[{title:'是',value:'1'},{title:'否',value:'2'}]},
					{field: 'orderStatus',title: '状态',type:'single',data:[{title:'正常',value:'1'},{title:'停止',value:'2'},{title:'暂缓',value:'3'}]},
					{field: 'endtDate',title: '时间',type:'inputTime',data:'2010-05-22'},
					{field: 'ifValid',title: '是否有效',type:'single',data:[{title:'是',value:'1'},{title:'否',value:'2'}]}
				]
		});
	};
	
	


	return {
		init: function(params) {

			initSearch();
		}


	};
} ();
