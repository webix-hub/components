webix.protoUI({
	name:"tinymce5-editor",
	defaults:{
		config:{ theme:"silver", statusbar:false },
		value:""
	},
	$init:function(){
		webix.html.addStyle(".tox-tinymce{ border:0px !important}");

		this._mce_id = "webix_mce_"+(this.config.id || webix.uid());
		this.$view.innerHTML = "<textarea id='"+this._mce_id+"' style='width:100%; height:100%'></textarea>";

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

		var cdn = c.cdn || "https://cloud.tinymce.com/5.0.3";

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
		};
		
		var editor_config = webix.copy(this.config.config || {});
		webix.extend(editor_config, {
			selector:"#"+this._mce_id,
			resize:false
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
		this._editor = event.target;

		this.setValue(this.config.value);
		this._set_inner_size();
		this._waitEditor.resolve(this._editor);
	},
	_set_inner_size:function(){
		if (this._editor){
			this.$view.querySelector(".tox-tinymce").style.height = this.$height+"px";
		}
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
			this._set_inner_size();
		};
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