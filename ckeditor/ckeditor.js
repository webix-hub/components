webix.protoUI({
	name:"ckeditor",
	$init:function(config){
		this.$view.className += " webix_selectable";
		this._waitEditor = webix.promise.defer();

		var tid = config.textAreaID = "t"+webix.uid();
		this.$view.innerHTML = "<textarea id='"+tid+"'>"+config.value+"</textarea>";

		this.$ready.push(this._init_ckeditor_once);
	},
	defaults:{
		borderless:true,
		language:"en",
		toolbar: [
			[ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink' ],
			[ 'FontSize', 'TextColor', 'BGColor' ]
		]
	},
	_init_ckeditor_once:function(){		
		if (this.config.cdn === false){
			this._render_ckeditor();
			return;
		};

		var cdn = this.config.cdn || "//cdn.ckeditor.com/4.13.0/standard/";
	
		window.CKEDITOR_BASEPATH = cdn;			
		webix.require([cdn+"/ckeditor.js"])
		.then( webix.bind(this._render_ckeditor, this) )
		.catch(function(e){
			console.log(e);
		});	
	},
	_render_ckeditor:function(){
		var initMethod = "replace";
		if(this.config.editorType === "inline") {
			CKEDITOR.disableAutoInline = true;
			initMethod = "inline";
			this.$view.style["overflow-y"] = "auto";
		};

		var barHeight = 71; // toolbar + bottombar, as initial sizes are set to the editable area
		this._editor = CKEDITOR[initMethod]( this.config.textAreaID, {
			toolbar: this.config.toolbar,
			language: this.config.language,
			width:this.$width,
			height:this.$height-barHeight,
			resize_enabled:false
		});
		this._waitEditor.resolve(this._editor);
	},
	_set_inner_size:function(x, y){
		if (!this._editor || !this._editor.container || !this.$width || this.config.editorType === "inline") return;
		this._editor.resize(x, y);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){			
			this._set_inner_size(x,y);
		}
	},
	setValue:function(value){
		this.config.value = value;

		if (this._editor && this._editor.status === "ready")
			this._editor.setData(value);
		else webix.delay(function(){
			this.setValue(value);
		},this,[],100);
	},
	getValue:function(){
		return this._editor?this._editor.getData():this.config.value;
	},
	focus:function(){
		this._focus_await = true;
		if (this._editor)
			this._editor.focus();
	},
	getEditor:function(waitEditor){
		return waitEditor?this._waitEditor:this._editor;
	}
}, webix.ui.view);
