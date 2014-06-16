webix.protoUI({
	name:"datasuggest",
	defaults:{
		type:"dataview",
		fitMaster:false,
		width:0,
		body:{
			xCount:3,
			autoheight:true,
			select:true
		}
	},
	$init:function(){
		this.$ready.push(this._first_render)	
	},
	_first_render:function(){
		this.attachEvent('onValueSuggest', function(data){
           	webix.delay(function(){
                webix.callEvent("onEditEnd",[]);
            });
        });
	}
}, webix.ui.suggest);