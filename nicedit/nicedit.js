webix.protoUI({
	name:"nic-editor",
	defaults:{
		config:{ buttonList:['fontSize','bold','italic','underline','strikeThrough','subscript','superscript'] },
		value:""
	},
	$init:function(config){
		this.$view.innerHTML = "<div style='padding:10px'>123</div>";
		this.$view.className += " webix_selectable";
		this.$ready.push(this._render_nic_editor);
	},
	_render_nic_editor:function(){
		webix.require("nicedit/nicEdit.js", function(first_time){
			if (first_time){
				webix.html.addStyle(".nicEdit-panel{height:22px}\n.nicEdit-panelContain{border-top-width:0px !important;}");
			}
			
			this.config.config.iconsPath = webix.codebase+"nicedit/nicEditorIcons.gif";

			var nic = new nicEditor(this.config.config).panelInstance(this.$view.firstChild);
			this._3rd_editor = nic.nicInstances[nic.nicInstances.length-1];
			this._set_inner_size();

			this.setValue(this.config.value);
			if (this._focus_await)
				this.focus();
		}, this);
	},
	_set_inner_size:function(){
		if (!this._3rd_editor || !this.$width) return;

		var editor = this.$view.firstChild;
		editor.style.width = this.$width+"px";

		editor = editor.nextSibling;
		editor.style.width = this.$width-20+"px";	//2x10 - padding
		editor.style.height = this.$height-46+"px";	//2x10 padding + 26 - header with borders
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
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
			this._3rd_editor.elm.focus();
	},
	getEditor:function(){
		return this._3rd_editor;
	}
}, webix.ui.view);