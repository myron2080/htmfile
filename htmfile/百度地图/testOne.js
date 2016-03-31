var pageContact = function() {

    var initMenu = function() {
        var PointPath;
        var pointStr;
        var markerArr ;

        var params2={
            "id":"dituContent",
            "url1":"113.94246|22.529588",
            "content":"��ַ",
            "title":"����"
        };
        initMap(params2);
        //�����ͳ�ʼ����ͼ������
        function initMap(params){
            //alert(params);
            PointPath=params.url1.split("|");

            pointStr=PointPath[0]+"|"+PointPath[1];
            //��ע������
            markerArr = [{title:params.title,content:params.content,point:pointStr,isOpen:0,icon:{w:23,h:25,l:46,t:21,x:9,lb:12}}];
            createMap(params);//������ͼ
            setMapEvent();//���õ�ͼ�¼�
            addMapControl();//���ͼ��ӿؼ�
            addMarker();//���ͼ�����marker
        }

        //������ͼ������
        function createMap(params){
            var map = new BMap.Map(params.id);//�ڰٶȵ�ͼ�����д���һ����ͼ
            var point = new BMap.Point(PointPath[0],PointPath[1]);//����һ�����ĵ�����
            map.centerAndZoom(point,17);//�趨��ͼ�����ĵ�����겢����ͼ��ʾ�ڵ�ͼ������
            window.map = map;//��map�����洢��ȫ��
        }

        //��ͼ�¼����ú�����
        function setMapEvent(){
            map.enableDragging();//���õ�ͼ��ק�¼���Ĭ������(�ɲ�д)
            map.enableScrollWheelZoom();//���õ�ͼ���ַŴ���С
            map.enableDoubleClickZoom();//�������˫���Ŵ�Ĭ������(�ɲ�д)
            map.enableKeyboard();//���ü����������Ҽ��ƶ���ͼ
        }

        //��ͼ�ؼ���Ӻ�����
        function addMapControl(){
            //���ͼ��������ſؼ�
            var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
            map.addControl(ctrl_nav);
            //���ͼ���������ͼ�ؼ�
            var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
            map.addControl(ctrl_ove);
            //���ͼ����ӱ����߿ؼ�
            var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
            map.addControl(ctrl_sca);
        }

        //����marker
        function addMarker(){
            for(var i=0;i<markerArr.length;i++){
                var json = markerArr[i];
                var p0 = json.point.split("|")[0];
                var p1 = json.point.split("|")[1];
                var point = new BMap.Point(p0,p1);
                var iconImg = createIcon(json.icon);
                var marker = new BMap.Marker(point,{icon:iconImg});
                var iw = createInfoWindow(i);
                var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
                marker.setLabel(label);
                map.addOverlay(marker);
                label.setStyle({
                    borderColor:"#808080",
                    color:"#333",
                    cursor:"pointer"
                });

                (function(){
                    var index = i;
                    var _iw = createInfoWindow(i);
                    var _marker = marker;
                    _marker.addEventListener("click",function(){
                        this.openInfoWindow(_iw);
                    });
                    _iw.addEventListener("open",function(){
                        _marker.getLabel().hide();
                    })
                    _iw.addEventListener("close",function(){
                        _marker.getLabel().show();
                    })
                    label.addEventListener("click",function(){
                        _marker.openInfoWindow(_iw);
                    })
                    if(!!json.isOpen){
                        label.hide();
                        _marker.openInfoWindow(_iw);
                    }
                })()
            }
        }
        //����InfoWindow
        function createInfoWindow(i){
            var json = markerArr[i];
            var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
            return iw;
        }
        //����һ��Icon
        function createIcon(json){
            var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
            return icon;
        }

    }


    // ****************************************************************************************************
    // ��¶����ķ���
    // ****************************************************************************************************
    return {
        init: function(params) {
            initMenu(params);
        }
    };
} ();