webix.protoUI({
	name:"ckeditor5",
	$init:function(config){
		this.$view.innerHTML = "<div class='toolbar'></div><div class='body'></div>";
		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._require_ckeditor);
	},
	defaults:{
		config:{}
	},
	_require_ckeditor:function(){
		
		if (this.config.cdn === false){
			this._render_ckeditor;
			return;
		};

		// we use DecoupledEditor only
		var cdn = this.config.cdn || "https://cdn.ckeditor.com/ckeditor5/12.0.0/decoupled-document";
	
		webix.require([cdn+"/ckeditor.js"])
			.then( webix.bind(this._render_ckeditor, this) )
			.catch(function(e){
				console.log(e);
			});		
	},
	_render_ckeditor:function(){
		this._editor_container = this.$view.querySelector(".body");
		var config = this.config.config;		
		DecoupledEditor.create(this._editor_container, config)
			.then(webix.bind(this._finalize_init, this))
			.catch(function(e){
				console.error(e);
			});					
	},
	_finalize_init:function(editor){
		this._tools_container = this.$view.querySelector(".toolbar");
		this._tools_container.appendChild(editor.ui.view.toolbar.element);

		// correct height on focus/blur
		editor.ui.focusTracker.on("change:isFocused", webix.bind(function(){
		    this._set_height(this.$height);
		}, this));

		this._editor = editor;		
		this._waitEditor.resolve(this._editor);
		this._set_height(this.$height);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y) && this._editor && this._editor_container)
			this._set_height(y);
	},
	_set_height:function(y){
		var toolbar = this._tools_container,
			toolH = toolbar ? toolbar.clientHeight+2 : 2;	// 2px for borders
		var height = (y-toolH)+"px";
		// set height as container `style`
		this._editor_container.style.height = height;
	},
	getEditor:function(wait){
		return wait ? this._waitEditor : this._editor;
	},
	setValue:function(value){
		this.getEditor(true).then(function(editor){
			editor.setData(value);
		});
	},
	getValue:function(value){
		return this._editor ? this._editor.getData() : "";
	}
}, webix.ui.view);