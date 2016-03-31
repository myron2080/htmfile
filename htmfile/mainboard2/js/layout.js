 var historyPanel = null;
        var realTimePanel = null;
        var locationPanel = null;
        var reportPanel = null;
        var managePanel = null;
        var settingPanel = null;
        var chartPanel = null;
        var interestPanel = null;
        var geoPanel = null;
        var measurePanel = null;
        var isExpanded = false;
        var settingWin = null;
        var currentMap = null;
        var isHistoryPanelExpand = false;
        var isGeoZone = false;
        var isGeoZoneClick = false;
        var isGeoZoneCount = 0;
        function getSpace(num){
        	var s = "&nbsp;";
        	for(var i =0 ; i < num; i++){
        		s +="&nbsp;";
        	}
        	return s;
        }
        
        function showPanel(type){
        	switch(type){
	        	case 'realtime':
	        		realTimePanel.expand();
	        		break;
	        	case 'settings':
	        		settingPanel.expand();
	        		break;
	        	case 'geo':
	        		geoPanel.expand();
	        		break;
	        	case 'history':
	        		historyPanel.expand();
	        		break;
	        	case 'report':
	        		reportPanel.expand();
	        		break;
	        	case 'map':
	        		locationPanel.expand();
	        		break;
	        	case 'distance':
	        		measurePanel.expand();
	        		break;
	        	case 'chart':
	        		chartPanel.expand();
	        		break;
	        	case 'manage':
	        		managePanel.expand();
	        		break;
        	}
        }
        
		function afterLayoutHandler(){
			Ext.get('locationControl').setStyle("display",'');
			Ext.get('realtimeMapDiv').setStyle("display",'');
			initializeRealtime();
			currentMap = g_map;
		}
        
        Ext.onReady(function() {
        	var expandedPanel = null;
        	var space = '&nbsp;&nbsp;&nbsp;&nbsp;';// &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        	var centerSpace = '&nbsp;&nbsp;&nbsp;&nbsp;';
        	var settingSpace = '';
        	settingSpace = settingSpace + settingSpace+ settingSpace;
        	settingSpace = "";
        	if(locale=="pt"){
        		space='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        	}
        	locationPanel = new Ext.Panel({
                title: space +'<img src="images/map2.png"/>'+centerSpace+ locationTitle,
                //html: '&lt;empty panel&gt;',
                contentEl: 'locationControl',
                cls:'empty'//,
                //headerCfg:{tag: 'div', cls: 'panelHeader',html:''}
            });

        	locationPanel.on("expand",function(){
        		Ext.get('realtimeMapDiv').setStyle("display",'none');
        		Ext.get('historyMapDiv').setStyle("display",'none');
        		Ext.get('locationMapDiv').setStyle("display",'');
        		Ext.get('settingsDiv').setStyle("display",'none');
        		isHistoryPanelExpand = false;
                if(location_map == null){
                	initializeLocationMap(geomapCountry);
                }else{
                	location_map.checkResize();
                	if(gps_map && gps_map[g_seluin] && gps_map[g_seluin].lat){
                		var d = new GPS_LatLng(parseFloat(gps_map[g_seluin].lat), parseFloat(gps_map[g_seluin].lng));
                		location_map.panTo(d);
                		location_map.setZoom(focusLevel);
                		setLocationLabelForTracker(gps_map[g_seluin].lat, gps_map[g_seluin].lng);
                	}
                }
                expandedPanel = locationPanel;
                currentMap = location_map;
            });
        	
        	Ext.get('realtimePanel').setStyle('display','');
        	realTimePanel = new Ext.Panel({
                title: space +'<img src="images/realtrack.png"/>'+centerSpace+trackingList,
                contentEl: 'realtimePanel',
                cls:'empty'
            });
        	expandedPanel = realTimePanel;
        	realTimePanel.on("expand",function(panel){
        		Ext.get('realtimeMapDiv').setStyle("display",'');
        		Ext.get('historyMapDiv').setStyle("display",'none');
        		Ext.get('locationMapDiv').setStyle("display",'none');
        		Ext.get('settingsDiv').setStyle("display",'none');
        		isHistoryPanelExpand = false;
        		g_map.checkResize();
        		expandedPanel = realTimePanel;
        		currentMap = g_map;
        		
            });
        	
        	realTimePanel.on("collapse",function(panel){
        		
        		if(isGeoZoneClick&&isGeoZone){
        			realTimePanel.expand();
        		}
        		if(isGeoZone){
        			isGeoZoneClick = true;
        			isGeoZoneCount++;
        		}else{
        			isGeoZoneCount = 0;
        			isGeoZoneClick = false;
        		}
        		if(isGeoZoneCount==2&&isGeoZoneClick){
        			isGeoZoneCount = 0;
        			isGeoZoneClick = false;
        		}
    			Ext.get('realtimeMapDiv').setStyle("display",'none');
        		Ext.get('historyMapDiv').setStyle("display",'none');
        		Ext.get('locationMapDiv').setStyle("display",'none');
        		Ext.get('settingsDiv').setStyle("display",'');
        		
            });
        	
        	realTimePanel.on("bodyresize",function(cmp, aw, ah, rw , rh){
        		if(trackersGrid)
        			trackersGrid.setHeight(ah - 0);
        		else
        			gridHeight = ah - 0;
        	});
        	
        	
        	settingPanel = new Ext.Panel({
                title: space +'<img src="images/setting.png"/>'+centerSpace + settingTitle,
                html: '',
                cls:'empty',
                maskDisabled:false,
                hideCollapseTool:true
                //disabled:true
            });
        	settingPanel.on("beforeexpand",function(){
        		isExpanded = !expandedPanel.collapsed;
            });
        	settingPanel.on("expand",function(){
        		if(!isSelectTracker()){
	        		if(isExpanded)
	        			expandedPanel.expand();
	        		else
	        			settingPanel.collapse();
	        		return;
        		}
        		Ext.get('realtimeMapDiv').setStyle("display",'none');
        		Ext.get('historyMapDiv').setStyle("display",'none');
        		Ext.get('locationMapDiv').setStyle("display",'none');
        		Ext.get('settingsDiv').setStyle("display",'');
        		document.getElementById('settingsDiv').innerHTML=Ext.get('centerInnerHtml').dom.innerHTML;
        		if(gpstracker_map[selectedTrackers[0]].carModelId == '' ||
        				gpstracker_map[selectedTrackers[0]].carModelId == '7'){// EV02
        			document.getElementById('content_frame').src='./controls/parameters.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		}else if(gpstracker_map[selectedTrackers[0]].carModelId == '10'){// EV06
        			document.getElementById('content_frame').src='./controls/parameters3.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		}
        		else if(gpstracker_map[selectedTrackers[0]].carModelId == '11'){// xuyun new
        			document.getElementById('content_frame').src='./controls/parameters4.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		}else if(gpstracker_map[selectedTrackers[0]].carModelId == '12'){// EW03
        			document.getElementById('content_frame').src='./controls/parameters5.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		}else if(gpstracker_map[selectedTrackers[0]].carModelId == '13'){// EW05
        			document.getElementById('content_frame').src='./controls/parameters6.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		}else if(gpstracker_map[selectedTrackers[0]].carModelId == '14'){// EW07
        			document.getElementById('content_frame').src='./controls/parameters7.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		}else{
        			// 第三方的设置
        			document.getElementById('content_frame').src='./controls/parameters2.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		}
        		
        		
            });
        	
        	
        	interestPanel = new Ext.Panel({
                title: space +'<img src="images/point-of-interest.png"/>'+centerSpace+ interestPoint,
                html: '',
                cls:'empty',
                maskDisabled:false,
                hideCollapseTool:true
                //disabled:true
            });
        	interestPanel.on("beforeexpand",function(){
        		isExpanded = !expandedPanel.collapsed;
            });
        	
        	interestPanel.on("expand",function(){
        		if(isExpanded)
        			expandedPanel.expand();
        		else
        			interestPanel.collapse();
        		addPoint();
            });
        	
        	geoPanel = new Ext.Panel({
                title: space +'<img src="images/geo2.png"/>'+centerSpace+ geoTitle,
                html: '',
                cls:'empty',
                collapsible:false,
                hideCollapseTool:true
            });

        	geoPanel.on("beforeexpand",function(){
        		isExpanded = !expandedPanel.collapsed;
            });
        	
        	geoPanel.on("expand",function(){
        		if(isExpanded)
        			expandedPanel.expand();
        		else
        			geoPanel.collapse();
        		
        		if(!isSelectTracker()){
	        		return;
        		}
        		Ext.get('realtimeMapDiv').setStyle("display",'none');
        		Ext.get('historyMapDiv').setStyle("display",'none');
        		Ext.get('locationMapDiv').setStyle("display",'none');
        		Ext.get('settingsDiv').setStyle("display",'');
        		/*document.getElementById('settingsDiv').innerHTML=Ext.get('centerInnerHtml').dom.innerHTML;
        		document.getElementById('content_frame').src='./controls/sysgeofence_edit.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		*/
        		
        		/*createSettingWin();
        		settingWin.setWidth(750);
        		if(locale=="pt"){
        			settingWin.setTitle(geoTitle+spaceForVersion+getSpace(22)+gpstracker_map[selectedTrackers[0]].trackerName+' - '+gpstracker_map[selectedTrackers[0]].userName);
        		}else{
        			settingWin.setTitle(geoTitle+spaceForVersion+gpstracker_map[selectedTrackers[0]].trackerName+' - '+gpstracker_map[selectedTrackers[0]].userName);
        		}
        		
        		if(settingWin.getEl().select('iframe').item(0).dom.contentWindow.showWaiting)
        			settingWin.getEl().select('iframe').item(0).dom.contentWindow.showWaiting();
        		settingWin.getEl().select('iframe').item(0).set({src:'./controls/sysgeofence.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId});
        		settingWin.show();*/
            });
        	
        	measurePanel = new Ext.Panel({
                title: space +'<img src="images/distance3.png"/>'+centerSpace+ measureTitle,
                html: '',
                cls:'empty',
                collapsible:false,
                hideCollapseTool:true
            });

        	measurePanel.on("beforeexpand",function(){
        		isExpanded = !expandedPanel.collapsed;
            });
        	measurePanel.on("expand",function(){
        		if(isExpanded&&isHistoryPanelExpand){
        			measurePanel.collapse();
        		}else if(isExpanded)
        			expandedPanel.expand();
        		else
        			measurePanel.collapse();
        		beginMeasure();
            });
        	
        	Ext.get('historyPanel').setStyle('display','');
        	historyPanel = new Ext.Panel({
                title: space +'<img src="images/historys.png"/>'+centerSpace+ historyTitle,
                //html: '&lt;empty panel&gt;',
                contentEl:'historyPanel',
                cls:'empty'
            });
        	historyPanel.on("beforeexpand",function(){
        		isExpanded = !expandedPanel.collapsed;
            });
        	historyPanel.on("expand",function(){
        		if(!isSelectTracker()){
	        		if(isExpanded)
	        			expandedPanel.expand();
	        		else
	        			historyPanel.collapse();
	        		return;
        		}
        		isHistoryPanelExpand = true;
        		Ext.get('realtimeMapDiv').setStyle("display",'none');
        		Ext.get('historyMapDiv').setStyle("display",'');
        		Ext.get('locationMapDiv').setStyle("display",'none');
        		Ext.get('settingsDiv').setStyle("display",'none');
                if(history_map == null){
                	initHistoryMap();
                }else{
                	history_map.checkResize();
                	if(gps_map && gps_map[g_seluin] && gps_map[g_seluin].lat){
                		var d = new GPS_LatLng(parseFloat(gps_map[g_seluin].lat), parseFloat(gps_map[g_seluin].lng));
                		history_map.panTo(d);
                		history_map.setZoom(focusLevel);
                	}
                }
                expandedPanel = historyPanel;
                currentMap = history_map;
            });
        	
        	historyPanel.on("bodyresize",function(cmp, aw, ah, rw , rh){
        		//console.log(ah);
        		if(ah == undefined)
        			ah = cmp.getHeight();
        		if(ah < 120){
        			return;
        		}
        		Ext.get('search_result').setStyle('height', (ah - 135)+'px');
        	});

        	reportPanel = new Ext.Panel({
                title: space +'<img src="images/reports2.png"/>'+centerSpace+ reportTitle,
                html: '',
                cls:'empty',
                maskDisabled:false,
                hideCollapseTool:true
            });

        	managePanel = new Ext.Panel({
                title: space +'<img src="images/manage2.png"/>'+centerSpace + mamaneTitle,
                //html: '&lt;empty panel&gt;',
                contentEl:'manageMenu',
                cls:'empty'
            });
        	
        	chartPanel = new Ext.Panel({
                title: space +'<img src="images/chart-search-icon.png"/>'+centerSpace + chartTitle,
                html: '',
                cls:'empty',
                collapsible:false,
                hideCollapseTool:true
            });
        	chartPanel.on("beforeexpand",function(){
        		isExpanded = !expandedPanel.collapsed;
            });
        	chartPanel.on("expand",function(){
        		if(isExpanded)
        			expandedPanel.expand();
        		else
        			chartPanel.collapse();
        		if(!isSelectTracker()){
	        		return;
        		}
        		Ext.get('realtimeMapDiv').setStyle("display",'none');
        		Ext.get('historyMapDiv').setStyle("display",'none');
        		Ext.get('locationMapDiv').setStyle("display",'none');
        		Ext.get('settingsDiv').setStyle("display",'');
        		document.getElementById('settingsDiv').innerHTML=Ext.get('centerInnerHtml').dom.innerHTML;
        		document.getElementById('content_frame').src='./chart.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        		
        		/*createSettingWin();
        		settingWin.setWidth(750);
        		settingWin.setTitle(chartTitle + spaceForVersion + gpstracker_map[selectedTrackers[0]].trackerName+' - '+gpstracker_map[selectedTrackers[0]].userName);
        		if(settingWin.getEl().select('iframe').item(0).dom.contentWindow.showWaiting)
        			settingWin.getEl().select('iframe').item(0).dom.contentWindow.showWaiting();
        		settingWin.getEl().select('iframe').item(0).set({src:'./chart.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId});
        		settingWin.show();*/
            });
        	
        	reportPanel.on("beforeexpand",function(){
        		isExpanded = !expandedPanel.collapsed;
            });
            reportPanel.on("expand",function(){
            	if(!isSelectTracker()){
            		if(isExpanded)
            			expandedPanel.expand();
            		else
            			reportPanel.collapse();
	        		return;
        		}
            	Ext.get('realtimeMapDiv').setStyle("display",'none');
        		Ext.get('historyMapDiv').setStyle("display",'none');
        		Ext.get('locationMapDiv').setStyle("display",'none');
        		Ext.get('settingsDiv').setStyle("display",'');
        		document.getElementById('settingsDiv').innerHTML=Ext.get('centerInnerHtml').dom.innerHTML;
        		document.getElementById('content_frame').src='./gps_report_top.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId+'&trackerName='+gpstracker_map[selectedTrackers[0]].trackerName;
            });

            managePanel.on("expand",function(){
            	expandedPanel = managePanel;
            });
            Ext.get('manageMenu').setStyle('display','');

            var items = [];
            items.push(realTimePanel);
            if(isAdmin)
            items.push(settingPanel);
            //items.push(interestPanel);
            //items.push(geoPanel);
            //if(isAdmin)
            //	items.push(managePanel);
            items.push(historyPanel);
            items.push(reportPanel);
           
            items.push(locationPanel);
            //items.push(measurePanel);
            items.push(chartPanel);
            items.push(managePanel);
            
            var accordion = new Ext.Panel({
                region:'west',
                margins:'0 0 5 5',
                collapsible: true,
                collapseMode:'mini',
                split:true,
                width: 240,
                layout:'accordion',
                items: items
            });
            
            var mapPanel = new Ext.Panel({
            	region:'center',
                html: '<div id="locationMapDiv" style="height:100%;width:100%;margin:0px 0px 0px 0px;display:none">Loading Map...</div>'+
                '<div id="realtimeMapDiv" style="height:100%;width:100%;margin:0px 0px 0px 0px;display:none">Loading Map...</div>'+
                '<div id="settingsDiv" style="height:100%;width:100%;margin:0px 0px 0px 0px;display:none"></div>'+
                '<div id="historyMapDiv" style="height:100%;width:100%;margin:0px 0px 0px 0px;display:none">Loading Map...</div>',
                cls:'fullstyle'
            });
            
            var gisinfoPanel = new Ext.Panel({
            	region:'south',
                contentEl: '',
                cls:'fullstyle',
                style:{width:'100%',height:'120px'}
            });
            var bodywith= document.body.clientWidth - 242;
            var tabs= new Ext.TabPanel({
                renderTo:document.body,
                height:100,
                width:bodywith
            });
            tabs.add({title:page1,html:Ext.get('gisInfo').dom.innerHTML});
            tabs.add({
                id:Ext.id(),//Ext自定义的随机id
                title:page2,
                html:Ext.get('gisInfo08').dom.innerHTML
                //closable:true//是否带关闭按钮
            });
            tabs.activate(0);
            gisinfoPanel.add(tabs);
            var center = new Ext.Panel({
                region:'center',
                margins:'0 5 5 0',
                //collapsible: true,
                //collapseMode:'mini',
                split:true,
                width: '100%',
                height:'100%',
                layout:'border',
                defaults: {frame:false, width:'100%', height:'100%'},
            	layoutConfig: {columns:1, rows:2,tableAttrs: {
                    style: {
                    width: '100%',height:'100%'
                	}
            	}},
                items: [mapPanel,gisinfoPanel]
            });
            var top_style='topbg';
            if(window.location.host.indexOf("gktracking.com") > -1){
            	top_style = 'india_topbg';
            }else if(window.location.host.indexOf("nortesatrastreamento") > -1){}
            var viewport = new Ext.Viewport({
                layout:'border',
                items:[
					{
				        region: 'north',
				        html: '<div class="gps_main_top"  style="height:50px;text-align:left;" >'+Ext.get('loginInfo').dom.innerHTML+'</div>'+
				        '<div class="topbg1" style="height:2px; width:100%;text-align:left" >'+
				        '<div class="topbg3" style="height:2px; width:30%;float:left;" ></div>'+
				        '<div class="topbg2" style="height:2px; width:20%;float:left;" ></div>'+
				        '<div class="topbg4" style="height:2px; width:10%;float:left;" ></div>'+
				        '<div class="topbg5" style="height:2px; width:20%;float:left;" ></div>'+
				        '<div class="topbg6" style="height:2px; width:20%;float:left;" ></div></div>'+
				        '<div class="x-border-layout-ct '+top_style+'" style="height:50px;text-align:left;" >'+
				        //'<div class="gps_main_top">Menu Section:</div>'+
				        '<div  class="gps_main_top2">'+Ext.get('loginSeach').dom.innerHTML+'</div>'+
				        //'<div style="float:left;width:50%">'+Ext.get('loginInfo').dom.innerHTML+'</div>'+
				        '</div>',
				        split: false,
				        height:102,
				        collapsible: false,
				       // collapseMode:'mini',
				        border: false,
				        margins: '0 0 0 0' 
				    },
                    accordion,
                    center]
            });

            gisinfoPanel.on('move', function(adjWidth, adjHeight, rawWidth, rawHeight){
            	setOnlineStatsOriginalPosition22(gisinfoPanel.getPosition(false));});
            
            //setGisInfoGrid();
            
            //setGisInfoGrid2();
            
            afterLayoutHandler();
            //measurePanel.suspendEvents();
            createSearchGrid();
            
            accordion.on('collapse', function(){
            	gis_info_grid.setWidth(center.getWidth());
            });
            accordion.on('expand', function(){
            	gis_info_grid.setWidth(center.getWidth());
            });
            //create online tracker DIV
            createOnlineStats(gisinfoPanel.getPosition(false));
            //createOnlineStats2(gisinfoPanel.getPosition(false));
            
            function isSelectTracker(){
            	if (selectedTrackers[0] == null || selectedTrackers[0] == "") {
        	        //Ext.Msg.alert('', g_str_select_tracker_search);
        	    	Ext.MessageBox.show({
        	            title: '',
        	            msg: g_str_select_tracker_search,
        	            buttons: Ext.MessageBox.OK,
        	            icon: Ext.MessageBox.WARNING
        	        });
        	    	return false;
        	    }
            	return true;
            };
            
            function createSettingWin(){
	            if(!settingWin){
	            	settingWin = new Ext.Window({
	                    renderTo:Ext.getBody(),
	                    layout:'fit',
	                    width:760,
	                    height:400,
	                    closeAction:'hide',
	                    plain: false,
	                    modal:true,
	                    header:true,
	                    html:'<iframe width="100%" height="100%" frameborder="0" src=""></iframe>'
	                });
	            }
            }
            createSettingWin();
            window.setTimeout(function(){
            	accordion.doLayout(true);
            }, 5000);
            
        });
        
        
        function getCurrentTrackerId(){
        	try{
        		return gpstracker_map[selectedTrackers[0]].trackerId;
        	}catch(e){
        		return "";
        	}
        }
        function ajustMeasure(title, width, height, lines){
        	var settingSpace = '';
        	if(!lines) lines = 12;
        	
        	if(lines){
        		for(var i = 0; i < lines; i++){
        			settingSpace = settingSpace + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        		}
        	}
        	if(title=='setting'){
        		title=gpstracker_map[selectedTrackers[0]].trackerName+' - '+gpstracker_map[selectedTrackers[0]].userName;
        	}
        	settingWin.setTitle(settingTitle+settingSpace+title);
        	if(width) settingWin.setWidth(width);
        	if(height) settingWin.setHeight(height);
        	settingWin.center();
        }
        
        function useTool(value){
        	if(value!=null){
        		isGeoZone = false;
	        	if(value=='interest'){
	        		realTimePanel.expand();
	            	Ext.get('realtimeMapDiv').setStyle("display",'');
	        		Ext.get('historyMapDiv').setStyle("display",'none');
	        		Ext.get('locationMapDiv').setStyle("display",'none');
	        		Ext.get('settingsDiv').setStyle("display",'none');
	        		addPoint();
	        	}else if(value=='measure'){
	        		realTimePanel.expand();
	            	Ext.get('realtimeMapDiv').setStyle("display",'');
	        		Ext.get('historyMapDiv').setStyle("display",'none');
	        		Ext.get('locationMapDiv').setStyle("display",'none');
	        		Ext.get('settingsDiv').setStyle("display",'none');
	        		beginMeasure();
	        	}else if(value=='alarms'){
	        		var value='all';
	        		showAlarms(value);
	        	}
        	}
        }
        function gotoHomePage(){
        	realTimePanel.expand();
        	isGeoZone = false;
        	Ext.get('realtimeMapDiv').setStyle("display",'');
    		Ext.get('historyMapDiv').setStyle("display",'none');
    		Ext.get('locationMapDiv').setStyle("display",'none');
    		Ext.get('settingsDiv').setStyle("display",'none');
    		//document.getElementById('centerInnerHtml').display='none';
        }
        function modifyTracker(){
        	if(!isSelectTracker2()){
        		return;
    		}
        	isGeoZone = false;
        	Ext.get('realtimeMapDiv').setStyle("display",'none');
    		Ext.get('historyMapDiv').setStyle("display",'none');
    		Ext.get('locationMapDiv').setStyle("display",'none');
    		Ext.get('settingsDiv').setStyle("display",'');
    		document.getElementById('settingsDiv').innerHTML=Ext.get('centerInnerHtml').dom.innerHTML;
    		document.getElementById('content_frame').src='./gps_editproduct.jsp?trackerid='+gpstracker_map[selectedTrackers[0]].trackerId;
        }
        
        function addZoon(){
        	if(!isSelectTracker2()){
        		return;
    		}
        	isGeoZone  = true;
        	//realTimePanel.collapse();
        	Ext.get('realtimeMapDiv').setStyle("display",'none');
    		Ext.get('historyMapDiv').setStyle("display",'none');
    		Ext.get('locationMapDiv').setStyle("display",'none');
    		Ext.get('settingsDiv').setStyle("display",'');
    		document.getElementById('settingsDiv').innerHTML=Ext.get('centerInnerHtml').dom.innerHTML;
    		document.getElementById('content_frame').src='./controls/sysgeofence.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId;
        }
        
        function isSelectTracker2(){
        	if (selectedTrackers[0] == null || selectedTrackers[0] == "") {
    	        //Ext.Msg.alert('', g_str_select_tracker_search);
    	    	Ext.MessageBox.show({
    	            title: '',
    	            msg: g_str_select_tracker_search,
    	            buttons: Ext.MessageBox.OK,
    	            icon: Ext.MessageBox.WARNING
    	        });
    	    	return false;
    	    }
        	return true;
        };
        
        function showAlarms(value){
        	Ext.get('realtimeMapDiv').setStyle("display",'none');
    		Ext.get('historyMapDiv').setStyle("display",'none');
    		Ext.get('locationMapDiv').setStyle("display",'none');
    		Ext.get('settingsDiv').setStyle("display",'');
    		isGeoZone = false;
    		document.getElementById('settingsDiv').innerHTML=Ext.get('centerInnerHtml').dom.innerHTML;
    		if(value=='all'){
    			document.getElementById('content_frame').src='./gps_alarm.jsp?action='+value;
    		}else{
    			if(!isSelectTracker2()){
            		return;
        		}
    			document.getElementById('content_frame').src='./gps_alarm.jsp?trackerId='+gpstracker_map[selectedTrackers[0]].trackerId+'&trackerName='+gpstracker_map[selectedTrackers[0]].trackerName;
    		}
        }
        