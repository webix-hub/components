webix.protoUI({
	name:"slidebutton",
	defaults:{
		template:function (config, common) {
			var id = config.name || "x"+webix.uid();
			var rightlabel = "";
			
			if (config.labelRight){
				rightlabel = "<label class='webix_label_right'>"+config.labelRight+"</label>";
				if (config.labelWidth)
					config.label = config.label || "&nbsp;";
			}
			
			var checked = (config.checkValue == config.value);
			var margin = 3;
				
			var className = "webix_inp_checkbox_border webix_el_group webix_checkbox_"+(checked?"1":"0");
			var ch = '<div class="cmn-toggle-box">' +
				'<input  id="cmn-toggle-'+id+'" class="cmn-toggle cmn-toggle-round" type="checkbox" '+(checked?"checked":"")+'>' +
				'<label  for="cmn-toggle-'+id+'"></label>' +
				' </div>';
			
			var html = "<div style='line-height:"+common.config.cheight+"px' class='"+className+"'>"+ch+rightlabel+"</div>";
			return common.$renderInput(config, html, id);
		}
	},
	on_click:{
		"cmn-toggle":function(e, obj, node){
			this.toggle();
		}
	}
}, webix.ui.checkbox);