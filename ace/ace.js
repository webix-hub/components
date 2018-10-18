webix.protoUI({
	name:"ace-editor",
	defaults:{
		mode:"javascript",
		theme:"monokai",
	},
	$init:function(config){
		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._render_cm_editor);
	},
	_render_cm_editor:function(){
		if (this.config.cdn === false){
			this._render_when_ready();
			return;
		};

		var cdn = this.config.cdn || "https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.3";

		webix.require([
			cdn + "/ace.js"
		]).then( webix.bind(this._render_when_ready, this) ).catch(function(e){
		  console.log(e);
		});
	},
	_render_when_ready:function(){

		if (this.config.cdn){
			ace.config.set("basePath", this._cdn);
			ace.config.set("modePath", this._cdn);
			ace.config.set("workerPath", this._cdn);
			ace.config.set("themePath", this._cdn);
		};

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
		if(this.config.readOnly)
			this._editor.setReadOnly(this.config.readOnly);
		if(this.config.highlightActiveLine)
			this._editor.setHighlightActiveLine(this.config.highlightActiveLine);
		if(this.config.showInvisibles)
			this._editor.setShowInvisibles(this.config.showInvisibles);
		if(this.config.showPrintMargin)
			this._editor.setShowPrintMargin(this.config.showPrintMargin);

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
	},
	clearSelection:function(){
		if (this._editor)
			this._editor.clearSelection();
	},
	gotoLine:function(line){
		if (this._editor)
			this._editor.gotoLine(line);
	}
}, webix.ui.view);
