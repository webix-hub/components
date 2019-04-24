webix.protoUI({
	name:"ckeditor",
	$init:function(config){
		var tid = config.textAreaID = "t"+webix.uid();
		
		this.$view.className += " webix_selectable";
		this.$view.innerHTML = "<textarea id='"+tid+"'>"+config.value+"</textarea>";

		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._init_ckeditor_once);
	},
	defaults:{
		language:"en",
		toolbar: [
			[ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink' ],
			[ 'FontSize', 'TextColor', 'BGColor' ]
		]
	},
	_init_ckeditor_once:function(){		
		if (this.config.cdn === false){
			this._render_ckeditor;
			return;
		};

		var cdn = this.config.cdn || "//cdn.ckeditor.com/4.11.4/standard/";
	
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
		};

		this._editor = CKEDITOR[initMethod]( this.config.textAreaID, {
			toolbar: this.config.toolbar,
			language: this.config.language,
			resize_enabled:false
		});
		
		this._editor.on("contentDom", webix.bind(function(){
			this._waitEditor.resolve(this._editor);
			this._set_inner_size();
		}, this));
	},
	_set_inner_size:function(){
		if (this._editor){
			// tofix: inline mode does not map events correctly / spoils UI resize
			this._editor.resize(this.$width, this.$height, false);
		}
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
			this._set_inner_size();
		}
	},
	setValue:function(value){
		this.config.value = value;
		this._waitEditor.then(function(editor){
			editor.setData(value);
		});
	},
	getValue:function(){
		return this._editor?this._editor.getData():this.config.value;
	},
	focus:function(){
		this._waitEditor.then(function(editor){
			editor.focus();
		});
	},
	getEditor:function(wait){
		return wait?this._waitEditor:this._editor;
	}
}, webix.ui.view);