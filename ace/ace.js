webix.protoUI({
	name:"ace-editor",
	defaults:{
		mode:"javascript",
		theme:"monokai"
	},
	$init:function(config){
		this.$ready.push(this._render_cm_editor);
	},

	_render_cm_editor:function(){
		webix.require([
			"ace/src-min-noconflict/ace.js"
		], this._render_when_ready, this);
	},

	_render_when_ready:function(){
        var basePath = ace.config.get("basePath");

        ace.config.set("basePath", basePath + "/ace/src-min-noconflict");
        ace.config.set("modePath", basePath + "/ace/src-min-noconflict");
        ace.config.set("workerPath", basePath + "/ace/src-min-noconflict");
        ace.config.set("themePath", basePath + "/ace/src-min-noconflict");

		this.editor = ace.edit(this.getNode());

        this.editor.$blockScrolling = 'Infinity';

        if(this.config.theme)
            this.editor.setTheme("ace/theme/"+this.config.theme);
        if(this.config.mode)
            this.editor.getSession().setMode("ace/mode/javascript");
        if(this.config.value)
            this.setValue(this.config.value);
		if (this._focus_await)
            this.focus();

        this.editor.navigateFileStart();
	},

	setValue:function(value){
		if(!value && value !== 0)
			value = "";

		this.config.value = value;
		if(this.editor){
			this.editor.setValue(value);
		}
	},

	getValue:function(){
		return this.editor ? this.editor.getValue() : this.config.value;
	},

	focus:function(){
		this._focus_await = true;
		if (this.editor)
			this.editor.focus();
	},

	getEditor:function(){
		return this.editor;
	}

}, webix.ui.view);