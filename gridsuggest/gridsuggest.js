webix.protoUI({
	name:"gridsuggest",
	defaults:{
		type:"datatable",
		fitMaster:false,
		width:0,
		body:{
			navigation:true,
			autoheight:true,
			autowidth:true,
			select:true
		},
		filter:function(item, value){
			var text = this.config.template(item);
			if (text.toString().toLowerCase().indexOf(value.toLowerCase())===0) return true;
				return false;
		}
	},
	$init:function(obj){
		if (!obj.body.columns)
			obj.body.autoConfig = true;
		if (!obj.template)
			obj.template = webix.bind(this._getText, this);

		this.attachEvent('onValueSuggest', function(){
           	webix.delay(function(){
                webix.callEvent("onEditEnd",[]);
            });
        });
	},

	_getText:function(item, common){
		var grid = this.getBody();
		var value = this.config.textValue || grid.config.columns[0].id;
		return grid.getText(item.id, value);
	}
}, webix.ui.suggest);