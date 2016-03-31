var apiObj = {
	baseData:{"resultMsg":"接口调用失败，ajax error！","resultType":0},
	bltjNumber:"BLTJ",//保利天街number
	yjdhNumber:"YJDH",//一键导航
	yytsNumber:"YYTS",//运营特色
	qwjzNumber:"QWJZ",//区位价值	
	zsfwNumber:"ZSFW",//招商范围
	ytghNumber:"YTGH",//业态规划
	zldNumber:"ZLD",//主力店
	zsrxNumber:"ZSRX",//招商热线
	xmgkNumber:"XMGK",//项目概况
	gnfqNumber:"GNFQ",//功能分区
	xmtjNumber:"XMTJ",//项目图集
	baseUrl:"http://192.168.1.42:8080/web/apiAjax",
	A017_findMainPage:"017_findMainPage",//宝利天街首页获取
	A017_findCatelog:"017_findCatelog",//报利天街子栏目获取
	A017_findCatelogData:"017_findCatelogData",//保利天街栏目数据获取
	/*
	*调用服务端接口
	@params callBackFn 回调函数
	@params jsonData :data数据
	*/
	ajaxRequest:function (callBackFn,jsonData) {
		 $.ajax({
         url:apiObj.baseUrl,
         crossDomain:true,
         dataType:'jsonp',
         type:'post',
         data:jsonData,
         jsonpCallback:'jsonFn',
		 success:function(res){
			callBackFn(res);
		 },
		 error:function(res){
			callBackFn(apiObj.baseData)
		}
      });
	} 	
}
	
/*
首页获取
fn：回调函数
*/
function findMainPage(fn){
	var jsonData = {
		'apiNumber':apiObj.A017_findMainPage
	}
	apiObj.ajaxRequest(fn,jsonData);
}

/*
报利天街子栏目获取
@param id：父栏目id
@param fn 回调函数
*/
function findCatelog(id,fn){
	var jsonData = {
		'apiNumber':apiObj.A017_findCatelog,
		'params':"{'id':\""+id+"\"}"
	}
	apiObj.ajaxRequest(fn,jsonData);
}

/*
保利天街栏目数据获取 --根据ID获取数据
@param id：栏目id
@param fn 回调函数

*/
function findCatelogData(id,fn){
	var jsonData = {
		'apiNumber':apiObj.A017_findCatelogData,
		'params':"{'id':\""+id+"\"}"
	}
	apiObj.ajaxRequest(fn,jsonData);
}
/*
保利天街栏目数据获取 --根据编码获取数据
@param number 
*/
function findCatelogDataByNumber(number,fn){
	var jsonData = {
		'apiNumber':apiObj.A017_findCatelogData,
		'params':"{'number':\""+number+"\"}"
	}
	apiObj.ajaxRequest(fn,jsonData);
}

/*demo*/
findCatelogDataByNumber('YTGH',function (data){
	console.log(data);
});

