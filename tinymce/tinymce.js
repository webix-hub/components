webix.protoUI({
	name:"tinymce-editor",
	defaults:{
		config:{ theme:"simple" },
		value:""
	},
	$init:function(config){
		this.$view.className += " webix_selectable";
		this.$ready.push(this.render);
	},
	render:function(){
		this._set_inner_size();
	},
	_init_tinymce_once:function(){
		//set id for future usage
		this._mce_id = "webix_mce_"+this.config.id;
		this.$view.innerHTML = "<textarea id='"+this._mce_id+"' style='width:1px; height:1px'></textarea>";

		//path to tinymce codebase
		tinyMCEPreInit = { suffix:"", query:"", base: webix.codebase+"tinymce/" };
		webix.require("tinymce/tiny_mce.js", function(first_time){
			if (first_time){
				//woraround event logic in tinymce
				tinymce.dom.Event.domLoaded = true;
				webix.html.addStyle(".mceLayout{ border-width:0px !important}\n.mceLayout tr.mceFirst td {border-top:none !important;}");
			}
			
			var config = this.config.config;
			config.mode = "exact";
			config.height = 300;
			config.oninit = webix.bind(this._mce_editor_ready, this);
			config.elements = [this._mce_id];
			config.id = this._mce_id;
			tinyMCE.init(config);

		}, this);

		this._init_tinymce_once = function(){};
	},
	_mce_editor_ready:function(editor){
		this._3rd_editor = tinyMCE.get(this._mce_id);
		this._set_inner_size();
		this.setValue(this.config.value);
		if (this._focus_await)
			this.focus();
	},
	_set_inner_size:function(){
		if (!this._3rd_editor || !this.$width) return;
		var height_fix = 11;
		var editor = document.getElementById(this._mce_id+"_tbl");
		if (!editor){
			editor = this.$view.childNodes[1].firstChild;
			height_fix = 5;
		}
		var iframe = document.getElementById(this._mce_id+"_ifr");

		if (!this._mce_delta)
			this._mce_delta = parseInt(editor.style.height,10) - parseInt(iframe.style.height,10)+height_fix;

		editor.style.width = this.$width + "px";
		editor.style.height = this.$height + "px";
		iframe.style.height = this.$height - this._mce_delta + "px";
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
			this._init_tinymce_once();
			this._set_inner_size();
		}
	},





	setValue:function(value){
		this.config.value = value;
		if (this._3rd_editor)
			this._3rd_editor.setContent(value);
	},
	getValue:function(){
		return this._3rd_editor?this._3rd_editor.getContent():this.config.value;
	},
	focus:function(){
		this._focus_await = true;
		if (this._3rd_editor)
			this._3rd_editor.focus();
	},
	getEditor:function(){
		return this._3rd_editor;
	}
}, webix.ui.view);