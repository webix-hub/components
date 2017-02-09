webix.protoUI({
	name:"ace-editor",
	defaults:{
		mode:"javascript",
		theme:"monokai"
	},
	$init:function(config){
		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._render_cm_editor);
	},
	_render_cm_editor:function(){
		webix.require([
			"ace/src-min-noconflict/ace.js"
		], this._render_when_ready, this);
	},

	_render_when_ready:function(){
        var basePath = webix.codebase+"ace/src-min-noconflict/";

        ace.config.set("basePath", basePath);
        ace.config.set("modePath", basePath);
        ace.config.set("workerPath", basePath);
        ace.config.set("themePath", basePath);

		this._editor = ace.edit(this.$view);
		

        this._editor.$blockScrolling = Infinity;
        this._editor.setOptions({
			fontFamily: "consolas,monospace",
			fontSize: "12pt"
		});

        if(this.config.theme)
            this._editor.setTheme("ace/theme/"+this.config.theme);
        if(this.config.mode)
            this._editor.getSession().setMode("ace/mode/"+this.config.mode);
        if(this.config.value)
            this.setValue(this.config.value);
		if (this._focus_await)
            this.focus();

        this._editor.navigateFileStart();
        this._waitEditor.resolve(this._editor);
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
		return this._editor ? this._editor.getValue() : this.config.value;
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