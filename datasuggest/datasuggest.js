webix.protoUI({
	name:"datasuggest",
	defaults:{
		type:"dataview",
		fitMaster:false,
		width:0,
		body:{
			xCount:3,
			autoheight:true,
		}
	}
}, webix.ui.suggest);