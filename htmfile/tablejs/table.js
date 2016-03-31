//表格单元格内容对象
function Item(){
	//a、url、date、operator、seprator、format、checkbox、radio-checkbox、radio、index、label
	//页面规则转js对象形式
	Item.prototype.initialize = function(itemEl) {
		var item = $(itemEl);
	 	this.name = item.attr('name');
	 	this.type = item.attr('type');
	 	this.width = item.attr('width');
	 	this.height = item.attr('height');
	 	if(this.type=='a'){
	 		this.click = item.attr('click');
	 		this.key = item.attr('key'); // 唯一标识
	 	}else if(this.type=='url'){
	 	 	this.click = item.attr('click');
	 		this.key = item.attr('key'); // 唯一标识
	 	}else if(this.type=='date'){
	 		this.len = item.attr('len'); // 唯一标识
	 	}else if(this.type=='operator'){
	 		this.links = item.attr('links')||{};
	 		this.separator = item.attr('separator')||'&nbsp;' ;
	 	 }else if(this.type=='seprator'){
	 		this.keys = item.attr('keys')||{};
	 		this.separator = item.attr('separator')||'&nbsp;' ;
	 	 }else if(this.type=='format'){
	 	 	this.dataMap = item.attr('dataMap');
	 	 }
	};
	//js对象形式转页面代码
	Item.prototype.html = function(item,index,pNode){
		this.caption = item[this.name] ;
		var id = item[idname];
		var tempTd = $("<td>",{'id':this.name+'-'+id,'name':this.name+'-'+id,'realvalue':this.caption,'type':this.type,'width':this.width,'height':this.height}).appendTo(pNode);
		if(this.type=='checkbox'){
	    	$("<input>",{
				'type':'checkbox',
				'name':this.name,
				'class':'chkbox',
				'id':this.key,
				'value':this.caption,
				'checked':item.checked
			}).appendTo(tempTd);
		}else if(this.type=='radio-checkbox'){			
			$("<input>",{
				'type':'checkbox',
				'name':this.name,
				'class':'radio-chkbox',
				'id':this.key,
				'value':this.caption,
				'events':{
					'click':function(){
						var flag = $(this).get('checked');
						$(document.body).find('input[type="checkbox"].radio-chkbox').set('checked',false);
						$(this).set('checked',flag);
					}
				}
			}).appendTo(tempTd);
		}else if(this.type=='radio'){
			$("<input>",{
				'type':'checkbox',
				'name':this.name,
				'class':'radio-chkbox',
				'id':this.key,
				'value':this.caption
			}).appendTo(tempTd);
		}else if(this.type=='index'){
			$("<span>",{'html':(index+1),'realvalue':(index+1)}).appendTo(tempTd);
		}else if(this.type=='a'){
			var func=this.click;
			$("<a>",{
				'id':item[this.key],
				'html':this.caption,
				'href':'javascript:'+func+'('+item[this.key]+')'
			}).appendTo(tempTd);
		}else if(this.type=='url'){
			var func=this.click;
			$("<a>",{
				'id':item[this.key],
				'html':this.caption,
				'href':'javascript:'+func+'("'+item[this.key]+'")'
			}).appendTo(tempTd);
		}else if(this.type=='label'){
			$("<span>",{'html':this.caption}).appendTo(tempTd);
		}else if(this.type=='operator'){
			renderOperatorLinks(this,item,tempTd);// 生成操作链接
		}else if(this.type=='seprator'){
			renderSeprator(this,item,tempTd); //生成分隔数据
		}else if(this.type=='date'){
			var date_length=10;
			if(this.len != null && this.len != ''){
				date_length=this.len;
			}
			var caption = this.caption.toString();
			$("<span>",{'html':caption.substring(0,date_length)}).appendTo(tempTd);
		}else if(this.type=='format'){
			var dataoptions = $('#'+this.dataMap).attr('data-options');
			dataoptions = dataoptions.substring(dataoptions.indexOf("["),dataoptions.indexOf("]")+1);
			var jsonobj=eval('('+dataoptions+')');
			
			for ( var i = 0; i < jsonobj.length; i++) {
				var json = jsonobj[i];
				if(json.ID == this.caption){
					$("<span>",{'html':json.TEXT,'realvalue':this.caption}).appendTo(tempTd);
				}else if(json.id == this.caption){
					$("<span>",{'html':json.text,'realvalue':this.caption}).appendTo(tempTd);
				}
			}
		}
	};
};
//生成分隔列表
/*
	* obj-->单元格对象
	* data-->行数据对象
	* parentObject-->tr 对象
*/
function renderSeprator(obj,data,parentObject){
	var operator = obj ;
	if(!(typeof(operator)==undefined)){
		return ;
	}
	if(!(typeof(operator.keys)== undefined)){
		return ;
	}
	var keys = operator.keys.split(',');
	var separator = operator.separator ;
	for(var i=0;i<keys.length;i++){
		var key = keys[i] ;
		$("<span>",{
			'name':key,
			'text':data[key].value
		}).appendTo(parentObject);
		if(i < (keys.length-1)){
			$("<span>",{'html':separator}).appendTo(parentObject);
		}
	}
}
// 生成操作链接
function renderOperatorLinks(obj,data,parentObject){
	var operator = obj ;
	if(typeof(operator)== undefined){
		return ;
	}
	if(typeof(operator.links)== undefined){
		return ;
	}
	var links = eval('('+operator.links+')');
	var separator = operator.separator ;
	var keys = [];
	for(var key in links){
		keys.push(key);
	}
	for ( var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var event = links[key];
		$("<a>",{
			'id':data[idname],
			'text':key,
			'href':'javascript:'+event+'(\''+data[idname]+'\')'
		}).appendTo(parentObject);
		if(i < (keys.length-1)){
			$("<span>",{'html':separator}).appendTo(parentObject);
		}
	}
}

var eltMap = {}; //存储所有元素
var eltKeys = []; //存储所有元素name
var idname;

//初始化数据
function initTable(data,pagnation){
	var trs = data.list;
	var dataTable = getDataTable();
	if(typeof(dataTable) == undefined){
		return ;
	}
	// 如果没有数据，则显示无数据img
	if(trs.length==0){
		toggleDataEmpty(dataTable,1);
		return ;
	}else{
		toggleDataEmpty(dataTable,0);
	}

	var dataTbody = dataTable.children('tbody') ;
	if(typeof(dataTbody)== undefined){
		dataTbody.empty();
	}else{
		dataTbody = $("<tbody>",{'class':'data-table-tbody'}).appendTo(dataTable);
	}

	// get show properties of talbe(Bean)
	var cols = dataTable.find('tr.data-table-title').find('th[name][type]') ;
	for(var i=0;i<cols.length;i++){
		var col = new Item();
		col.initialize(cols[i]);
		eltMap[$(cols[i]).attr('name')] = col;
		if($(cols[i]).attr('key')=="id"){
			idname = $(cols[i]).attr('name');
		}
	}
	var step = data.firstResult ;
	for(var i=0;i<trs.length;i++){
		$(trs[i]).each(function(index,item){
			var myTr = $("<tr>").appendTo(dataTbody);
			for(var key in eltMap){
				eltMap[key].html(item,(index+step),myTr);
			}
		});
	}
	dataTable.children('tr:odd').addClass('data-table-tr-odd');

	// set pagination links
	if(!(typeof(pagnation)== undefined) && pagnation){
		initPagnation(data.pageNo,data.totalPage,data.totalCount,data.pageSize);
	}
	if(typeof(initAfter)== undefined&&initAfter){
		initAfter();
	}
	initFormat();
	initEdit();
}
function initPagnation(cpage,pages,totals,size){
	$('div.pagination span.current').html(cpage);
	$('div.pagination span.pages').html(pages);
	$('div.pagination span.total').html(totals);
	var myLinks = $('div.pagination div.links')[0];
	$(myLinks).html('');

	cpage=parseInt(cpage);
	var start;
	var end;
	
	if(pages<=6){
		start=1;
		end=pages;
	}else{
		start=cpage-3;
		end=cpage+3;
		if(start<1){
			start=1;
			end=6;
		}
		if(end>pages){
			start=pages-6;
			end=pages;
		}
	}
	 if(pages>=1){
		 insertSpan(myLinks,1,1,cpage,size);
	 }
	 for(var i=start; i<= end ;i++){
			var view=i;
			if(i==1 || i==pages){
				continue;
			}
			if(i==start || i==end){
				view='...';
			}
			insertSpan(myLinks,view,i,cpage,size);
	 }
	 
	 if(pages>=2){
		 insertSpan(myLinks,pages,pages,cpage,size);
	 }
}

/**
  * view : html
  *
  **/
function insertSpan(myLinks,view,index,cpage,size){
	size = size ||10 ;
	var tempSpan = $("<span>",{}).appendTo(myLinks);
 	if(cpage==index){
	 	tempSpan.addClass('current_page') ;
	}
	$("<a>",{
		'html':view,
		'cpage':index,
		'href':'javascript:void(0)'
	}).click(function(){
		$('div.pagnation div.links span').removeClass('current_page');
		$(this).parent().addClass('current_page');
		pageQuery($(this).attr('cpage'),size);
	}).appendTo(tempSpan);
}

function getCpage(){
	var cpage = $('#page_input').val() ;
	if(!cpage){
		return 'null';
	}
	return parseInt(cpage);
}
function getPages(){
	var pages = $('div.pagination span.pages').html();
	return pages;
}
function getPageSize(){
	return 10;
}
function loadPage(){
	var cpage = getCpage();
	var pages = getPages();
	var pageSize = getPageSize();
	if(cpage=='null'){
		return;
	}else if(cpage>=1 && cpage<= pages){
		pageQuery(cpage,pageSize);
	}else{
		alert('无效的页号，页号介于[1....'+pages+' ]之间!');
		$('#page_input').select();
	}
}
//format data
function initFormat(){
	var elts = $(document.body).find('[class*="label-format"][dataMap][realvalue]');
	$(elts).each(function(index,item){
		item.set('text',eval(item.get('dataMap')+'["'+item.get('realvalue')+'"]'));
	});
	//format date
	elts = $(document.body).find('[class*="label-date"][realvalue]');
	$(elts).each(function(index,item){
		item.get('pattern')||'yyyy-MM-dd';
		//call format util
		//todo implements it !
		item.set('text',item.get('realvalue').substring(0,10));
	});
}

//init on edit
function initEdit(){
	var form = $('form-bean')||$(document.body).find('form[name="form-bean"]');
	if(!(typeof(form)==undefined)){
		return ;
	}
	var idElement = form.find('input[name="id"]')||form.find('input[id="id"]');
	if(!(typeof(idElement==undefined))){
		return ;
	}
	if(!(typeof(idElement.get('value'))==undefined)){
		return; 
	}
	var elts = form.find('[name][class*="label-readonly"]');
	$(elts).each(function(index,item){
		if(item.get('tag')=='input'){
			var v = item.get('value');
			if(item.get('type')=='password' && item.get('showPwd')!='true'){
				v = '******';
			}
			//item.set('type','hidden');
			item.setStyle('display','none');
			$("<span>",{'html':v}).appendTo(item.getParent());
		}else{//select el
			var selOption = item.find('option[selected]');
			var tempInput = $("<input>",{'type':'hidden','name':item.get('name')||item.get('id'),'value':selOption.get('value'),'caption':selOption.get('text')}).appendTo(item.getParent());
			$("<span>",{'html':tempInput.get('caption')}).appendTo(item.getParent());
			item.dispose();
		}
		
	});
}
function initAfter(){

}
function getDataTable(){
	var dataTable = $('#data-table');
	if(typeof(dataTable) == undefined){
		return null;
	}
	return dataTable ;	
}
var domain = '/' ;

function showTbodyLoading(){
	var dataTable = getDataTable();
	if(typeof(dataTable) == undefined){
		return ;
	}
	var tempTbody = dataTable.children('tbody');
	if(!(typeof(tempTbody)== undefined)){
		tempTbody.remove();
	}
	tempTbody = $("<tbody>",{'class':'data-table-tbody'}).appendTo(dataTable);
	var tempTr = $("<tr>",{'class':'data-table-loading'}).appendTo(tempTbody);
	var tempTd = $("<td>",{'colspan':dataTable.find('tr.data-table-title').find('th[name][type]').length}).appendTo(tempTr);
	var tempDiv = $("<div>",{'styles':{'text-align':'center'}}).appendTo(tempTd);
	$("<div>",{'id':'divid','class':'empty-data-div-loading'}).appendTo(tempDiv);
	
	var dataPaginationDiv = $('#data-pagination');
	if(typeof($(dataPaginationDiv))== undefined){
		dataPaginationDiv.setStyles({'display':'none'});
	}
}

function toggleDataEmpty(dataTable,flag){
	var dataEmptyDivId = 'data-empty';
	var dataPagination = 'data-pagination';
	
	var dataTable = getDataTable();
	if(typeof(dataTable) == undefined){
		return ;
	}
		
	var dataEmptyDiv = $(dataEmptyDivId);
	var dataPaginationDiv = $(dataPagination);

	if(flag==1){//show
		if(typeof(dataEmptyDiv)== undefined){
			 dataEmptyDiv.empty();
		}else{
			$("<div>",{'id':dataEmptyDivId,'styles':{'display':'block','text-align':'center'}}).appendTo(dataTable.getParent(),'top');
		}
		$("<div>",{'class':'empty-data-div-null'}).appendTo(dataEmptyDiv);
		//hidden dataTable		
		dataTable.setStyles({'visibility':'hidden'});
		dataTable.find('Tbody').destroy();
		//hidden pagination
		if(type(dataPaginationDiv)== undefined){
			dataPaginationDiv.setStyle('display','none');
		}
		
	}else{ //hidden
		if(typeof(dataEmptyDiv)== undefined){
			dataEmptyDiv.empty();
		}
		//show dataTable
		if(dataTable.attr('visibility')=='hidden'){
			dataTable.attr('visibility','visible');
		}		
		//show pagination
		if(typeof($(dataPaginationDiv))== undefined){
				if(dataPaginationDiv.getStyle('display')=='none'){
					dataPaginationDiv.setStyles({'display':'block'});
				}
		}
		
	}
}

/*
* set Or cancel checkbox checked status!
*/
function toggerSelectAll(obj){
	var checked = $(obj).get('checked');
	$(document.body).find('input[type=checkbox].chkbox').attr('checked',checked) ;
}

function getAllchecked(){
	var ids = [] ;
	var objs = $(document.body).find('input[type=checkbox][class*=chkbox]:checked');
	$each(objs,function(item,index){
		ids.include($(item).get('value'));
	});
	return ids ;
}
/*
* check any be checked
*/
function isAnyChecked(){
	return getAllchecked().length > 0 ;
}

//query
function query(){
	var elts = getQueryForm().find('[name][class*="query"]');
	if(elts.length>0){
		$each(elts,function(item,index){
			$(item).set('original',$(item).value);
		});
	}
	pageQuery(1,pageSize);
}


function getQueryForm(){
	return $('#form-query')||$(document.body).find('form[name="form-query"]');
}

//请求表格数据
function getTableData(url,cpage,size){
	showTbodyLoading();
	var queryparams = $('#form-query').serializeObject();
	queryparams['pageNo'] = cpage;
	queryparams['pageSize'] = size;
	queryparams['r'] = Math.random();
	$.ajax({
		cache: false,
		type: "POST",
		url:url,
		dataType:"json",
		contentType:"application/json",
		data:JSON.stringify(queryparams),
		async: false,
	    success: function(data) {
	    	//alert(JSON.stringify(data));
	    	initTable(data,true);
	    }
	});
}
function checkAll(ca){
	if($(ca).attr("checked") == "checked"){
		$(".chkbox").each(function (){
			$(this).attr('checked',true);
		});
	}else{
		$(".chkbox").each(function (){
			$(this).attr('checked',false);
		});
	}
}