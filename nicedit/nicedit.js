webix.protoUI({
	name:"nic-editor",
	defaults:{
		config:{ buttonList:['fontSize','bold','italic','underline','strikeThrough','subscript','superscript'] },
		value:""
	},
	$init:function(config){
		this.$view.innerHTML = "<div style='padding:10px'>Loading...</div>";
		this.$view.className += " webix_selectable";

		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._init_nic_editor);
	},
	_init_nic_editor:function(){

		if (this.config.cdn === false){
			this._render_nic_editor();
			return;
		};

		var sources = [];
		
		var cdn = this.config.cdn ? this.config.cdn : "https://cdnjs.cloudflare.com/ajax/libs/NicEdit/0.93";

		sources.push(cdn+"/nicEdit.js")

		webix.require(sources)
		.then(webix.bind(this._render_nic_editor, this))
		.catch(function(e){
			console.log(e);
		});
	},
	_render_nic_editor:function(){
		if (!this._editorCss){
			var style = ".nicEdit-panel{height:auto}\n";
			style += ".nicEdit-panelContain{border-top-width:0px !important;}\n";
			style += ".webix_selectable>div:nth-child(2){overflow-y:auto;}";
			webix.html.addStyle(style);
			this._editorCss = true;
		}
		
		if (this.config.cdn && !this.config.config.iconsPath)
			this.config.config.iconsPath = cdn+"/nicEditorIcons.gif";

		var nic = new nicEditor(this.config.config).panelInstance(this.$view.firstChild);
		this._3rd_editor = nic.nicInstances[nic.nicInstances.length-1];
		this._set_inner_size();

		this._waitEditor.resolve(this._3rd_editor);
		
		this.setValue(this.config.value);
		if (this._focus_await)
			this.focus();
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
	getEditor:function(waitEditor){
		return waitEditor?this._waitEditor:this._3rd_editor;
	}
}, webix.ui.view);