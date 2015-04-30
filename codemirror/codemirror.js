webix.protoUI({
	name:"codemirror-editor",
	defaults:{
		mode:"javascript",
		lineNumbers:true,
		matchBrackets:true,
		theme:"default"
	},
	$init:function(config){
		this.$view.innerHTML = "<textarea style='width:100%;height:100%;'></textarea>";
		this.$ready.push(this._render_cm_editor);
	},
	_render_cm_editor:function(){
		webix.require("codemirror/lib/codemirror.css");
		var deps = [
			"codemirror/lib/codemirror.js"
		];

		if (this.config.mode == "htmlmixed"){
			deps.push("codemirror/mode/xml/xml.js");
			deps.push("codemirror/mode/css/css.js");
			deps.push("codemirror/mode/javascript/javascript.js");
		}

		deps.push("codemirror/mode/"+this.config.mode+"/"+this.config.mode+".js");
		webix.require(deps, this._render_when_ready, this);
	},

	_render_when_ready:function(){
		this.editor = CodeMirror.fromTextArea(this.$view.firstChild, {
			mode: this.config.mode,
			lineNumbers: this.config.lineNumbers,
			matchBrackets: this.config.matchBrackets,
			theme: this.config.theme
		});

		this.setValue(this.config.value);
		if (this._focus_await)
			this.focus();
	},

	_set_inner_size:function(){
		if (!this.editor || !this.$width) return;

		this._updateScrollSize();
		this.editor.scrollTo(0,0); //force repaint, mandatory for IE
	},
	_updateScrollSize:function(){
		var box = this.editor.getWrapperElement();
		var height = (this.$height || 0) + "px";

		box.style.height = height;
		box.style.width = (this.$width || 0) + "px";

		var scroll = this.editor.getScrollerElement();
		if (scroll.style.height != height){
			scroll.style.height = height;
			this.editor.refresh();
		}
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
			this._set_inner_size();
		}
	},

	setValue:function(value){
		if(!value && value !== 0)
			value = "";

		this.config.value = value;
		if(this.editor){
			this.editor.setValue(value);
			//by default - clear editor's undo history when setting new value
			if(!this.config.preserveUndoHistory)
				this.editor.clearHistory();
			this._updateScrollSize();
		}
	},

	getValue:function(){
		return this.editor?this.editor.getValue():this.config.value;
	},

	focus:function(){
		this._focus_await = true;
		if (this.editor)
			this.editor.focus();
	},

	getEditor:function(){
		return this.editor;
	},


	//undo, redo, etc
	undo:function(){
		this.editor.undo();
	},
	redo:function(){
		this.editor.redo();
	},
	undoLength:function(){
		return this.editor.historySize().undo;
	}
}, webix.ui.view);