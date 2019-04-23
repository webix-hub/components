webix.protoUI({
	name:"monaco-editor",
	defaults:{
		language:"javascript"
	},
	$init:function(config){
		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._render_editor);
	},
	_render_editor:function(){

		if (this.config.cdn === false){
			this._render_when_ready();
			return;
		};

		var cdn = this.config.cdn || "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.16.2/min/";

		webix.require(cdn + "vs/loader.js")
		.then(webix.bind(function(){
			require.config({ paths: { 'vs': cdn+"vs/" }});
			window.MonacoEnvironment = {
				getWorkerUrl: function(workerId, label) {
				  return "data:text/javascript;charset=utf-8,"+
				  encodeURIComponent("self.MonacoEnvironment = { baseUrl: '"+cdn+"' }; importScripts('"+cdn+"/vs/base/worker/workerMain.js');");
				}
			};

			this._render_when_ready();
		}, this))
		.catch(console.log);
	},
	_render_when_ready:function(){
		require(["vs/editor/editor.main"], webix.bind(function () {
			var config = webix.copy(this.config);
			this._editor = monaco.editor.create(this.$view, config);

			this._waitEditor.resolve(this._editor);
		}, this));
		
		if (this._focus_await)
			this._editor.focus();
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y) && this._editor){
			this._editor.layout()
		}
	},
	setValue:function(value){
		if(!value && value !== 0)
			value = "";

		this.config.value = value;
		if(this._editor){
			this._editor.setValue(value);
		}
	},
	getValue:function(){
		return this._editor?this._editor.getValue():this.config.value;
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