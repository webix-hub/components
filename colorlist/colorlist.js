webix.protoUI({
    name:"colorlist",
    defaults:{
    	css:"wbx_colorlist",
		select:"multiselect",
        template:"<div class='wbx_colorbar' style='background:#color#;'>&nbsp;</div><div class='wbx_text'>#value#</div>",
        type:{
				height:35
			}
    },
    type:{
		templateStart:function(obj, common, markers){
			var start = "<div webix_l_id='"+obj.id+"' class='"+common.classname(obj, common, markers)+"' style='height:"+common.heightSize(obj, common)+";";
			if (markers && markers.webix_selected)
				start += "background: "+ obj.color +" !important; color: "+ obj.text_color +"!important;";
			return start + "'>";
		}
	},
    on_click:{
		webix_list_item:function(e,id){
			if (this.config.select){
				if (this.config.select=="multiselect"){
					this.select(id,true,e.shiftKey);
				}
				else
					this.select(id);
			}
		}
	}
}, webix.ui.list);
