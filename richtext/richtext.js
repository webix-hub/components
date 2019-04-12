webix.protoUI({
	name:"dhx-richtext",
	defaults:{ },
	$init:function(config){
		var elm = webix.html.create("div", {
			// overflow-x for minimum width limitation in Richtext 1.1
			style:"height:100%;overflow-x:auto;"
		});
		this.$view.appendChild(elm);
		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._require_richtext);
	},
	_require_richtext:function(){
		if (this.config.cdn === false){
			this._init_richtext();
			return;
		};

		var cdn = this.config.cdn || "https://cdn.dhtmlx.com/richtext/1.1";

		webix.require([			
			cdn+"/richtext.js",
			cdn+"/richtext.css"
		]).then(webix.bind(this._init_richtext, this)).catch(function(e){
			console.log(e);
		});
	},
	_init_richtext:function(){			
		var config = this.config.config ? webix.copy(this.config.config) : {};

		this._editor = new dhx.Richtext(this.$view.firstChild, config);
		this._waitEditor.resolve(this._editor);
	},
	getEditor:function(wait){
		if(wait)
			return this._waitEditor;
		else
			return this._editor;
	},
	value_setter:function(value){
			this.setValue(value)
	},
	setValue:function(value, mode){
		this._waitEditor.then(function(editor){
			editor.setValue(value, mode)
		})
	},
	getValue:function(mode){
		return this._waitEditor.then(function(editor){
			return editor.getValue(mode)
		})
	}
}, webix.ui.view);