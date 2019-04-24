webix.protoUI({
	name:"tinymce-editor",
	defaults:{
		config:{ theme:"modern", statusbar:false },
		value:""
	},
	$init:function(){		
		this._mce_id = "webix_mce_"+(this.config.id || webix.uid());
		this.$view.innerHTML = "<textarea id='"+this._mce_id+"' style='width:100%; height:100%'></textarea>";
		this.$view.className += " webix_selectable";

		this._waitEditor = webix.promise.defer();		
		
		this.$ready.push(this._require_tinymce_once);
	},
	render:function(){
		this._set_inner_size();
	},	
	_require_tinymce_once:function(){
		var c = this.config;
	
		if (c.cdn === false || window.tinymce){
			this._init_tinymce_once();
			return;
		};
		var cdn = c.cdn || "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.4";

		//path to tinymce codebase
		window.tinyMCEPreInit = { 
			query:"", 
			base: cdn, 
			suffix:".min" 
		};

		var apiKey = c.apiKey ? "?apiKey="+c.apiKey : "";
		webix.require([
			cdn+"/tinymce.min.js" + apiKey
		])
			.then( webix.bind(this._init_tinymce_once, this) )
			.catch(function(e){
				console.log(e);
			});
	},
	_init_tinymce_once:function(){	
		if (!tinymce.dom.Event.domLoaded){
			// woraround event logic in tinymce
			tinymce.dom.Event.domLoaded = true;			
			webix.html.addStyle(".mce-tinymce.mce-container{ border-width:0px !important}");
		};
		
		var editor_config = webix.copy(this.config.config || {});

		webix.extend(editor_config, {
			selector:"#"+this._mce_id,
			resize:false,
			mode:"exact"
		}, true);

		var custom_setup = editor_config.setup;

		editor_config.setup = webix.bind(function(editor){			
			if (custom_setup) 
				custom_setup(editor);
			editor.on("init", webix.bind(this._mce_editor_ready, this), true);			
		}, this);
		
		webix.delay(function(){
			tinymce.init(editor_config)
		}, this);		
	},
	_mce_editor_ready:function(event){
		if (!this._editor)
			this._editor = event.target;
		this._waitEditor.resolve(this._editor);

		this.setValue(this.config.value);
		this._set_inner_size();	
	},
	_set_inner_size:function(){
		if (this._editor){
			this._editor.theme.resizeTo(this.$width-2, this.$height - this._get_bar_height());
		}
	},
	_get_bar_height:function(){
		var bars = this.$view.querySelectorAll(".mce-toolbar, .mce-statusbar, .mce-menubar");
		var height = 5;
		for (var i = 0; i < bars.length; i++){
			height += bars[i].clientHeight;
		};
		return height;
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
			this._set_inner_size();		
		}	
	},
	setValue:function(value){
		this.config.value = value;
		this._waitEditor.then(function(editor){
			editor.setContent(value);
		});
	},
	getValue:function(){
		return this._editor?this._editor.getContent():this.config.value;
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