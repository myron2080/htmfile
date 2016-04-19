
    /**
     * 验证封装
     * id   设定from表单唯一标识。
     */
	  function executeValidateFrom(fid,getfunct) {
		    $("#"+fid).validate({
	   	       submitHandler: function(form) {
		   	    	 var isTrue=true;
		   	    	if(getfunct==null || getfunct=="" || typeof(getfunct)=="undefined"){
		   	    		
		   	    	}else{
		   	    		var fn=eval(getfunct);
		   	    		isTrue=fn();
		   	    	}
	   	    	   if(isTrue){
	   	    		   //提交表单  
			   	    	var url=$('#'+fid).attr('action');
			   	    	var type=$('#'+fid).attr('method');
			   	    	common_doSave(url,type,fid);
	   	    	   }
			     }
		    });
		 };

			
	
		 
		
	
	




