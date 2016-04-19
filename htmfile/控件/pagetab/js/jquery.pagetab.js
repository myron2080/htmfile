$.extend($.fn, {
    initPageTab: function(setting) {
        var opts = $.fn.extend({
            //the container of pagetab(is required,  a jQuery format selector String as '.container' or '#container')
            renderTo: null,
            //the unique id of pagetab(is required and unique, not null)
            uniqueId: null,
            //format your tab data like this: [{title:'',iconImg:'',closeable:true},{title:'',iconImg:'',closeable:true}]
            //it's an Array...
            tabs: [],
            //when the pagetab has been loaded, the tab you'ld like to display first(start at 0, and 0 as default)
            activeTabIndex: 0,
            //the style sheet of tab content
            contentCss: {
                'height': '500px'
            },
            //if you set this property as true, the data'll be loaded only at the first time when users click the tab
            //in other times pagetab only swich it's css(display property) from 'none' to 'block'
            loadOnce: true,
            //the tab width (150 as default)
            tabWidth: 110,
            //set an ajaxload effect, pagetab has provided two choices: 'usebg' | 'righttag'
            //'usebg': control if set a big loading gif in the contentholder
            //'righttag': this will set a small loading gif in the right top of contentholder
            loader: 'righttag',
            //两边滑块宽度
            slidersWidth: 19,
            //标题高度
            titleHeight: 26
        }, setting);
        //initialize the pagetab
        function createPageTab() {
            //make sure that a container and uniqueId were provided
            if (opts.renderTo == null) { alert('you must set the \'renderTo\' property\r\t--PageTab'); return; }
            if (opts.uniqueId == null) { alert('you must set the \'uniqueId\' property\r\t--PageTab'); return; }
            if ($('#' + opts.uniqueId).length > 0) { alert('you must set the \'uniqueId\' property as unique\r\t--PageTab'); return; }
            //the pagetab html tree:
            /* <div class="page_tab">
            <div class="tab_pages" >
            <div class="tabs">
            <ul /> ###tabpages here
            </div>
            </div>
            <div class="tab_content">
            <div id="pagetab_contentholder" class="content" /> ###tabcontents here
            </div>
            </div>
            */
            var pagetab = $('<div id="'+opts.uniqueId+'" class="page_tab"><div class="tab_pages" style="padding-top:5px;"><div class="tabs" ><ul class="nav nav-tabs" style="padding-left:10px;"></ul></div></div><div class="tab_content"><div id="pagetab_contentholder" class="content" /></div></div>')
                                            .appendTo($(opts.renderTo));
            
            //apply contentcss to the contentholder
            $('.tab_content>.content', pagetab).css(opts.contentCss);
            
            //fill data
            $.fn.pageTab = {
                master: pagetab,
                tabWidth: opts.tabWidth,
                tabPageWidth: $('.tab_pages', pagetab).width(),
                slidersWidth: opts.slidersWidth,
                loader: opts.loader,
                loadOnce: opts.loadOnce,
                tabpage: $('.tab_pages>.tabs>ul', pagetab),
                addTab: function(tabsetting) {
                    //set as the unique tab id and tabFirer tag
                    tagGuid = (typeof tagGuid == 'undefined' ? 0 : tagGuid + 1);
                    var curIndex = tagGuid;
                    //this function will be open to all users for them to add tab at any time
                    var ps = $.fn.extend({
                        //if there is a DOM that cause the tab to be added to tabpages,
                        //you should pass it to pagetab, in which way tab'll only be activated when
                        //user click the DOM next time
                        tabFirer: null,
                        title: '新增页签'+(curIndex+1),
                        //the dataType and dataLink were suited as:
                        //1.formtag:
                        //   dataType:'formtag', 
                        //                  --use the html tags in this page
                        //   dataLink:'#example' 
                        //                  --id of the tag you'ld like to display in this tab
                        //2.iframe:
                        //   dataType:'iframe', 
                        //                  --use the iframe to load another page
                        //   dataLink:''
                        //                  --such as 'iframetemplates/iframe.htm', set 
                        //                  --the relative url of the page u'ld like to display in this tab,
                        //                  --and pageTab will use an iframe to load it
                        //3.html:
                        //   dataType:'html',
                        //                  --load html tags from a url
                        //   dataLink:''
                        //                  --the relative url of your html page
                        //4.ajax:
                        //   dataType:'ajax',
                        //                  --use the ajax to load datas with asynchronous operations
                        //    dataLink:''
                        //                  --yes,u can write down your ajax handler url and pagetab'll make a callback,
                        //                  --so the responseText will be displayed in the content holder(u can use html tags in your server callback datas)
                        data: { dataType: '', dataLink: '' },
                        //set the tab icon of each(relative to...)
                        iconImg: '',
                        //whether this tab can be closed(ture as default)
                        closeable: true,
                        //this function will be fired after all data has been loaded
                        onLoadCompleted: null,
                        // the tab's name
                        name:''
                    }, tabsetting);
                    //window.console && console.log('%o', tabsetting);
                    //check whether the tabFirer exists or not, and that it has an attribute['pagetabindex'], then set the tab that tabFirer was connected activated
                    //otherwise attach the pagetabindex' attribute
                    if (ps.tabFirer != null) {
                        var pagetabindex = ps.tabFirer.attr('pagetabindex');
                        if (typeof pagetabindex != 'undefined' && $('#pagetab_' + pagetabindex).length > 0)
                            return $.fn.setTabActive(pagetabindex).adaptSlider().loadData();
                        ps.tabFirer.attr('pagetabindex', curIndex);
                    }
                    // set name
                    if(ps.name == ''){
                    	ps.name = ps.title;
                    }
                    //newTab html tree:
                    /*
                    <li>
                    <div class="tab_left" >
                    <div class="tab_icon" />
                    <div class="tab_text" >PageTab</div>
                    <div class="tab_close">
                    <a href="javascript:void(0)" title="Close">&nbsp;</a>
                    </div>
                    </div>
                    <div class="tab_right">&nbsp;</div>
                    </li>
                    */
                    /*var newTab = $('<li class="page_tabs tab_selected" style="width:0px"  id="pagetab_' + curIndex + '" dataType="' + ps.data.dataType + '" dataLink="' + ps.data.dataLink + '">' +
	                                    '<div class="tab_left"  style="width:' + (opts.tabWidth - 5) + 'px"  >' +
	                                        (ps.iconImg == '' ? '' : '<div class="tab_icon" style="' + 'background-image:url(' + ps.iconImg + ')' + '">&nbsp;</div>') +
	                                        '<div class="tab_text" title="' + ps.title + '"  style="width:' + (opts.tabWidth - 45 + (ps.iconImg == '' ? 25 : 0)) + 'px"  >' + ps.title.cut(opts.tabWidth / 10 - 1) + '</div>  ' +
	                                        '<div class="tab_close">' + (ps.closeable ? '<a href="javascript:" title="关闭">&nbsp;</a>' : '') + '</div>' +
	                                    '</div>' +
	                                    '<div class="tab_right">&nbsp;</div>' +
	                                '</li>')*/
                    var newTab = $('<li name="'+ps.name+'" class="page_tabs tab_selected" style="width:0px"  id="pagetab_' + curIndex + '" dataType="' + ps.data.dataType + '" dataLink="' + ps.data.dataLink + '">' +
                            '<div class="tab_left"  style="width:' + (opts.tabWidth - 5) + 'px"  >' +
                                (ps.iconImg == '' ? '' : '<div class="tab_icon" style="' + 'background-image:url(' + ps.iconImg + ')' + '">&nbsp;</div>') +
                                '<div class="tab_text" title="' + ps.title + '"  style="width:' + (opts.tabWidth - 45 + (ps.iconImg == '' ? 25 : 0)) + 'px"  >' + ps.title.cut(opts.tabWidth / 10 - 1) + '</div>  ' +
                                '<div class="tab_close">' + (ps.closeable ? '<a href="javascript:" style="line-height: 10px;font-size: 18px;" title="关闭">&times;</a>' : '') + '</div>' +
                            '</div>' +
                        '</li>').appendTo($.fn.pageTab.tabpage).css('opacity', '10').applyHover()
	                          .applyCloseEvent().animate({ 'height': '36px','padding-top': '4px', width: opts.tabWidth }, 100, function() {
	                    $.fn.setTabActive(curIndex);
	                });
                    //use an Array named "tabHash" to restore the tab information
                    tabHash = (typeof tabHash == 'undefined' ? [] : tabHash);
                    tabHash.push({
                        index: curIndex,
                        tabFirer: ps.tabFirer,
                        tabId: 'pagetab_' + curIndex,
                        holderId: 'pagetabholder_' + curIndex,
                        iframeId: 'pagetabiframe_' + curIndex,
                        onCompleted: ps.onLoadCompleted
                    });
                    return newTab.applySlider();
                },
                closeCurrentTab: function(tabsetting) {
                	$('.tab_selected .tab_close>a').click();
                    /*var ps = $.fn.extend({
                        name:'',
                        activeTabName:'',
                        isReaload: false
                    }, tabsetting);
                    
                    $.fn.pageTab.tabpage.children('li[name='+ps.name+']').remove();
                    
                    var isLoad = 0;
                    if(ps.activeTabName != ''){
                    	var lis = $.fn.pageTab.tabpage.children('li');
                    	for(var i=0;i<lis.size();i++){
                    		if(lis.eq(i).attr('name')==ps.activeTabName){
                    			$.fn.setTabActive(i).loadData(ps.isReaload);
                    			isLoad = 1;
                    			break;
                    		}
                    	}
                    }
                    if(isLoad==0){
                    	$.fn.setTabActive(0).loadData(ps.isReaload);
                    }*/
                    
                },
            };
            $.each(opts.tabs, function(i, n) {
                $.fn.pageTab.addTab(n);
            });
            try{
                if (tabHash.length == 0)
                    pagetab.css({ 'display': 'none' });
            }catch(e){ }
        }
        createPageTab();
        $.fn.setTabActive(opts.activeTabIndex).loadData();
        $.fn.pageTab.resize = function() {
        	$.fn.pageTab.tabPageWidth = $(".tab_pages", $.fn.pageTab.master).width() - (($(".page_slider").length > 0) ? ($.fn.pageTab.slidersWidth * 2) : 0);
            $(".tabs", $.fn.pageTab.master).width($.fn.pageTab.tabPageWidth).applySlider().adaptSlider();
            var fixHeight = -2;
            //if (Metronic.isIE8()){
            //	fixHeight = 25;
            //}
            $('#pagetab_contentholder').height($(opts.renderTo).height() - opts.titleHeight - 5 - fixHeight);
            $(".page_tab iframe").height($(".page_tab").parent().height() - opts.titleHeight - fixHeight);
        };
        $(window).resize(function() {
            $.fn.pageTab.resize();
        })
        //window.console && console.log('width :' + $.fn.pageTab.tabpage.width());
    },
    //activate the tag(orderkey is the tab order, start at 1)
    setTabActiveByOrder: function(orderKey) {
        var lastTab = $.fn.pageTab.tabpage.children('li').filter('.tab_selected');
        if (lastTab.length > 0) lastTab.swapTabEnable();
        return $('#page_tabs').filter(':nth-child(' + orderKey + ')').swapTabEnable();
    },
    //activate the tag(orderKey is the tagGuid of each tab)
    setTabActive: function(orderKey) {
        var lastTab = $.fn.pageTab.tabpage.children('li').filter('.tab_selected');
        if (lastTab.length > 0) lastTab.swapTabEnable();
        return $('#pagetab_' + orderKey).swapTabEnable();
    },
    addEvent: function(e, h) {
        var target = this.get(0);
        if (target.addEventListener) {
            target.addEventListener(e, h, false);
        } else if (target.attachEvent) {
            target.attachEvent('on' + e, h);
        }
    },
    //create an iframe in the contentholder to load pages
    buildIFrame: function(src) {
        return this.each(function() {
            var onComleted = null, pagetabiframe = '';
            for (var tab in tabHash) {
                if (tabHash[tab].holderId == $(this).attr('id')) {
                    onComleted = tabHash[tab].onCompleted;
                    pagetabiframe = tabHash[tab].iframeId;
                    break;
                }
            }
            src += (src.indexOf('?') == -1 ? '?' : '&') + 'tabPageId=' + pagetabiframe;
            var iframe = $('<iframe id="' + pagetabiframe + '" name="' + pagetabiframe + '" src="' + src + '" frameborder="0" scrolling="auto" />')
							.css({ width: '100%', height: $(this).parent().height(), border: 0 }).appendTo($(this));
            //add a listener to the load event
            $('#' + pagetabiframe).addEvent('load', function() {
                //if onComlete(Function) is not null, then release it
                !!onComleted ? onComleted(arguments[1]) : true;
                $.fn.removeLoader();
            });
        });
    },
    //load data from dataLink
    //use the following function after each tab was activated
    loadData: function(flag) {
        return this.each(function() {
        	//$('.page_tab .tab_selected').css('margin-bottom', '-1px');
            //show ajaxloader first
            $('#pagetab_contentholder').showLoader();
            var onComleted = null, holderId = '', tabId = '';
            //search information in tabHash
            for (var tab in tabHash) {
                if (tabHash[tab].tabId == $(this).attr('id')) {
                    onComleted = tabHash[tab].onCompleted;
                    holderId = '#' + tabHash[tab].holderId;
                    tabId = '#' + tabHash[tab].tabId;
                    break;
                }
            }
            var dataType = $(this).attr('dataType');
            var dataLink = $(this).attr('dataLink');
            //if dataType was undefined, nothing will be done
            if (typeof dataType == 'undefined' || dataType == '' || dataType == 'undefined') { removeLoading(); return; }
            //hide the rest contentholders
            $('#pagetab_contentholder').children('div[class=curholder]').attr('class', 'holder').css({ 'display': 'none' });
            var holder = $(holderId);
            if (holder.length == 0) {
                //if contentholder DOM hasn't been created, create it immediately
                holder = $('<div class="curholder" id="' + holderId.replace('#', '') + '" />').appendTo($('#pagetab_contentholder'));
                //load data into holder
                load(holder);
            }
            else {
                holder.attr('class', 'curholder').css({ 'display': 'block' });
                if ($.fn.pageTab.loadOnce && !flag){
                    removeLoading();
                } else {
                    holder.html('');
                    load(holder);
                }
            }

            function load(c) {
                switch (dataType) {
                    case 'formtag':
                        //clone html DOM elements in the page
                        $(dataLink).css('display', 'none');
                        var clone = $(dataLink).clone(true).appendTo(c).css('display', 'block');
                        removeLoading(holder);
                        break;
                    case 'html':
                        //load HTML from page
                        holder.load(dataLink + '?t=' + Math.floor(Math.random()), function() {
                            removeLoading(holder);
                        });
                        break;
                    case 'iframe':
                        //use iframe to load a website
                        holder.buildIFrame(dataLink, holder);
                        break;
                    case 'ajax':
                        //load a remote page using an HTTP request
                        $.ajax({
                            url: dataLink,
                            data: { t: Math.floor(Math.random()) },
                            error: function(r) {
                                holder.html('数据加载失败！');
                                removeLoading(holder);
                            },
                            success: function(r) {
                                holder.html(r);
                                removeLoading(holder);
                            }
                        });
                        break;
                }
            }
            function removeLoading(h) {
                !!onComleted ? onComleted(h) : true;
                $.fn.removeLoader();
            }
        });
    },
    //attach the slider event to every tab,
    //so users can slide the tabs when there are too much tabs
    attachSliderEvent: function() {
        return this.each(function() {
            var me = this;
            $(me).hover(function() {
                $(me).swapClass('page_slider' + $(me).attr('pos') + '_enable', 'page_slider' + $(me).attr('pos') + '_hover');
            }, function() {
                $(me).swapClass('page_slider' + $(me).attr('pos') + '_hover', 'page_slider' + $(me).attr('pos') + '_enable');
            }).mouseup(function() {
                //filter the sliders in order to prevent users from sliding`
                if ($(me).is('[slide=no]')) return;
                //get the css(left) of tabpage(ul elements)
                var offLeft = parseInt($.fn.pageTab.tabpage.css('left'));
                //the max css(left) of tabpage
                var maxLeft = tabHash.length * $.fn.pageTab.tabWidth - $.fn.pageTab.tabPageWidth + ($.fn.pageTab.slidersWidth * 2);
                switch ($(me).attr('pos')) {
                    case 'left':
                        //slide to the left side
                        if (offLeft + $.fn.pageTab.tabWidth < 0)
                            $.fn.pageTab.tabpage.animate({ left: offLeft + $.fn.pageTab.tabWidth }, 100);
                        else
                            $.fn.pageTab.tabpage.animate({ left: 0 }, 100, function() {
                                $(me).attr({ 'slide': 'no', 'class': 'page_sliders page_sliderleft_disable' });
                            });
                        $('.page_sliders[pos=right]').attr({ 'slide': 'yes', 'class': 'page_sliders page_sliderright_enable' });
                        break;
                    case 'right':
                        //slide to the right side
                        if (offLeft - $.fn.pageTab.tabWidth > -maxLeft)
                            $.fn.pageTab.tabpage.animate({ left: offLeft - $.fn.pageTab.tabWidth }, 100);
                        else
                            $.fn.pageTab.tabpage.animate({ left: -maxLeft }, 100, function() {
                                $(me).attr({ 'slide': 'no', 'class': 'page_sliders page_sliderright_disable' });
                            });
                        $('.page_sliders[pos=left]').attr({ 'slide': 'yes', 'class': 'page_sliders page_sliderleft_enable' });
                        break;
                }
            });
        });
    },
    //create or activate the slider to tabpage
    applySlider: function() {
        return this.each(function() {
            if (typeof tabHash == 'undefined' || tabHash.length == 0) return;
            //get the offwidth of tabpage
            var offWidth = tabHash.length * $.fn.pageTab.tabWidth - $.fn.pageTab.tabPageWidth + ($.fn.pageTab.slidersWidth * 2);
            if (tabHash.length > 0 && offWidth > 0) {
                //make sure that the parent Div of tabpage was fixed(position:relative)
                //so pagetab can control the display position of tabpage by using 'left'
                $.fn.pageTab.tabpage.parent().css({ width: $.fn.pageTab.tabPageWidth - ($.fn.pageTab.slidersWidth * 2) });
                //auto grow the tabpage(ul) width and reset 'left'
                $.fn.pageTab.tabpage.css({ width: offWidth + $.fn.pageTab.tabPageWidth - ($.fn.pageTab.slidersWidth * 2) })
                		.animate({ left: -offWidth }, 0, function() {
                    //append 'pagesliders' to the tabpageholder if 'pageslider' has't been added
                    if ($('.page_sliders').length <= 0) {
                    	var s = 'onclick="if(document.selection && document.selection.empty) {document.selection.empty();}else if(window.getSelection) {var sel = window.getSelection();sel.removeAllRanges();}"';
                        $.fn.pageTab.tabpage.parent()
                            .before($('<div class="page_sliders page_sliderleft_enable" slide="yes" pos="left" '+s+'></div>'));
                        $.fn.pageTab.tabpage.parent()
                            .after($('<div class="page_sliders page_sliderright_disable" pos="right" slide="yes" '+s+'></div>'));
                        $('.page_sliders').attachSliderEvent();
                    }
                    //$('.page_sliders').adaptSlider();
                });
            }
            else if (tabHash.length > 0 && offWidth <= 0) {
                //remove 'pagesliders' whether the tabs were not go beyond the capacity of tabpageholder
                $('.page_sliders').remove();
                $.fn.pageTab.tabpage.parent().css({ width: $.fn.pageTab.tabPageWidth });
                $.fn.pageTab.tabpage.css({ width: -offWidth + $.fn.pageTab.tabPageWidth })
                	.animate({ left: 0 }, 0);
            }
        });
    },
    //make sure that the slider will be adjusted quickly to the tabpage after tab 'clicking' or tab 'initializing'
    adaptSlider: function() {
        return this.each(function() {
            if ($('.page_sliders').length > 0) {
                var offLeft = parseInt($.fn.pageTab.tabpage.css('left'));
                var curtag = '#', index = 0;
                for (var t in tabHash) {
                    if (tabHash[t].tabId == $(this).attr('id')) {
                        curtag += tabHash[t].tabId;
                        index = parseInt(t);
                        break;
                    }
                }
                //set the tabpage width
                var tabWidth = $.fn.pageTab.tabPageWidth - ($.fn.pageTab.slidersWidth * 2);
                //calculate the distance from the left side of tabpage
                var space_l = $.fn.pageTab.tabWidth * index + offLeft;
                //calculate the distance from the right side of tabpage
                var space_r = $.fn.pageTab.tabWidth * (index + 1) + offLeft;
                //window.console && console.log(space_l + '||' + space_r);
                function setSlider(pos, enable) {
                    $('.page_sliders[pos=' + pos + ']').attr({ 'slide': (enable ? 'yes' : 'no'), 'class': 'page_sliders page_slider' + pos + '_' + (enable ? 'enable' : 'disable') });
                }
                //slider to right to check whether it's a tab nearby left slider
                if ((space_l < 0 && space_l > -$.fn.pageTab.tabWidth) && (space_r > 0 && space_r < $.fn.pageTab.tabWidth)) {
                    //left
                    $.fn.pageTab.tabpage.animate({ left: -$.fn.pageTab.tabWidth * index }, 0, function() {
                        if (index == 0) setSlider('left', false);
                        else setSlider('left', true);
                        setSlider('right', true);
                    });
                }
                //slider to left to check whether it's a tab nearby right slider
                if ((space_l < tabWidth && space_l > tabWidth - $.fn.pageTab.tabWidth) && (space_r > tabWidth && space_r < tabWidth + $.fn.pageTab.tabWidth)) {
                    //right
                    $.fn.pageTab.tabpage.animate({ left: -$.fn.pageTab.tabWidth * (index + 1) + tabWidth }, 0, function() {
                        if (index == tabHash.length - 1) setSlider('right', false);
                        else setSlider('left', true);
                        setSlider('left', true);
                    });
                }
            }
        });
    },
    //apply event to the close anchor
    applyCloseEvent: function() {
        return this.each(function() {
            var me = this;
            $('.tab_close>a', this).click(function(e) {
                //prevents further propagation of the current event. 
                e.stopPropagation();
                if ($(this).length == 0) return;
                //remove tab from tabpageholder
                $(me).animate({ 'opacity': '0', width: '0px' }, 100, function() {
                    //make the previous tab selected whether the removed tab was selected
                    var lastTab = $.fn.pageTab.tabpage.children('li').filter('.tab_selected');
                    if (lastTab.attr('id') == $(this).attr('id')) {
                    	if($(this).prev().text() != ''){
                            $(this).prev().swapTabEnable().loadData();
                    	}else{
                    		$(this).next().swapTabEnable().loadData();
                    	}
                    }
                    //clear the information of the removed tab from tabHash
                    for (var t in tabHash) {
                        if (tabHash[t].tabId == $(me).attr('id')) {
                            if (tabHash[t].tabFirer != null)
                                tabHash[t].tabFirer.removeAttr('pagetabindex');
                            tabHash.splice(t, 1);
                        }
                    }
                    //adapt slider
                    $(me).applySlider().remove();
                    //remove contentholder
                    $('#pagetabholder_' + $(me).attr('id').replace('pagetab_', '')).remove();
                })
            });
            $(this).RightMenu('pagetabmenu',{menuList:[
                {menuName:"刷新当前",clickEvent:"$('.tab_selected').loadData(true);"},
                {menuName:"关闭其它",clickEvent:"$('.tab_unselect .tab_close>a').click();"
                	+"setTimeout('$.fn.pageTab.resize();setTimeout(\\\'$.fn.pageTab.resize();"
                	+"setTimeout(\\\\\\'$.fn.pageTab.resize();\\\\\\',1000);\\\',500);',500);"}
        	]});
        });
    },
    //apply the "hover" effect and "onSelect" event
    applyHover: function() {
        return this.each(function() {
            $(this).hover(function() {
                if ($(this).hasClass('tab_unselect')) $(this).addClass('tab_unselect_h');
            }, function() {
                if ($(this).hasClass('tab_unselect_h')) $(this).removeClass('tab_unselect_h');
            }).mouseup(function() {
                if ($(this).hasClass('tab_selected')) return;
                //select this tab and hide the last selected tab
                var lastTab = $.fn.pageTab.tabpage.children('li').filter('.tab_selected');
                lastTab.attr('class', 'page_tabs tab_unselect');
                $('#pagetabholder_' + lastTab.attr('id').replace('pagetab_', '')).css({ 'display': 'none' });
                $(this).attr('class', 'page_tabs tab_selected').loadData().adaptSlider();
            });
        });
    },
    //switch the tab between the selected mode and the unselected mode, or v.v...
    swapTabEnable: function() {
        return this.each(function() {
            if ($(this).hasClass('tab_selected'))
                $(this).swapClass('tab_selected', 'tab_unselect');
            else if ($(this).hasClass('tab_unselect'))
                $(this).swapClass('tab_unselect', 'tab_selected');
        });
    },
    //change class from css1 to css2 of DOM
    swapClass: function(css1, css2) {
        return this.each(function() {
            $(this).removeClass(css1).addClass(css2);
        })
    },
    //if it takes a long time to load the data, show a loader to ui
    showLoader: function() {
        return this.each(function() {
            switch ($.fn.pageTab.loader) {
                case 'usebg':
                    //add a circular loading gif picture to the background of contentholder
                    $(this).addClass('loading');
                    break;
                case 'righttag':
                    //add a small loading gif picture and a banner to the right top corner of contentholder
                    if ($('#pagetab_contentholder>.righttag').length == 0)
                        $('<div class="righttag">正在加载...</div>').appendTo($(this));
                    else
                        $('#pagetab_contentholder>.righttag').css({ display: 'block' });
                    break;
            }
        });
    },
    //remove the loader
    removeLoader: function() {
        switch ($.fn.pageTab.loader) {
            case 'usebg':
                $('#pagetab_contentholder').removeClass('loading');
                break;
            case 'righttag':
                $('#pagetab_contentholder>.righttag').css({ display: 'none' });
                break;
        }
    }
});
//})(jQuery);

String.prototype.cut = function(len) {
    var position = 0;
    var result = [];
    var tale = '';
    for (var i = 0; i < this.length; i++) {
        if (position >= len) {
            tale = '...';
            break;
        }
        if (this.charCodeAt(i) > 255) {
            position += 2;
            result.push(this.substr(i, 1));
        }
        else {
            position++;
            result.push(this.substr(i, 1));
        }
    }
    return result.join("") + tale;
}

/*
 * 右键菜单，示例：$(this).RightMenu('myMenu2',{menuList:[{menuName:"菜单1",menuclass:"1",clickEvent:"divClick(1)"}]});
 */
$(function(){
	document.oncontextmenu=function(){return false;}//屏蔽右键
	document.onmousemove=mouseMove;//记录鼠标位置
});
var mx=0,my=0;
function mouseMove(ev){Ev=ev||window.event;var mousePos=mouseCoords(Ev);mx=mousePos.x;my=mousePos.y;} 
function mouseCoords(ev){
	if(ev.pageX||ev.pageY){return{x:ev.pageX,y:ev.pageY};}
	return{x:ev.clientX,y:ev.clientY+$(document).scrollTop()};
}
$.fn.extend({RightMenu: function(id,options){
	options = $.extend({menuList:[]},options);
	var menuCount=options.menuList.length;
	if (!$("#"+id)[0]){
		var divMenuList="<div id=\""+id+"\" class=\"div_RightMenu\"><div><ul class='ico'>";
		for(var i=0;i<menuCount;i++){
			divMenuList+="<li class=\""+options.menuList[i].menuclass+"\" onclick=\""+options.menuList[i].clickEvent+"\">"+options.menuList[i].menuName+"</li>";
		}
		divMenuList += "</ul></div><div>";
		$("body").append(divMenuList).find("#"+id).hide().find("li")
				.bind("mouseover",function(){$(this).addClass("RM_mouseover");})
				.bind("mouseout",function(){$(this).removeClass("RM_mouseover");});
		$(document).click(function(){$("#"+id).hide();});
	}
	return this.each(function(){
		this.oncontextmenu=function(){
			var mw=$('body').width(),mhh=$('html').height(),mbh=$('body').height(),
				w=$('#'+id).width(),h=$('#'+id).height(),
				mh=(mhh>mbh)?mhh:mbh;//最大高度 比较html与body的高度
			if(mh<h+my){my=mh-h;}//超 高
			if(mw<w+mx){mx=mw-w;}//超 宽
			$("#"+id).hide().css({top:my,left:mx}).show();
			$.fn.pageTab.resize(); // 修正弹出菜单时tab滚动被挤下去的问题
		}
	});
}});