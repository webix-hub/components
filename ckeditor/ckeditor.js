webix.protoUI({
	name:"ckeditor",
	$init:function(config){
		this.$view.className += " webix_selectable";
		this._waitEditor = webix.promise.defer();

		const tid = config.textAreaID = "t"+webix.uid();
		this.$view.innerHTML = `<textarea id=${tid}>${config.value || ""}</textarea>`;

		this.$ready.push(this._init_ckeditor_once);
	},
	defaults:{
		language: "en",
		barHeight: 70,
		toolbar: [
			[ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink' ],
			[ 'FontSize', 'TextColor', 'BGColor' ]
		],
		editorConfig: {}
	},
	_init_ckeditor_once:function(){
		if (this.config.cdn === false){
			webix.delay( webix.bind( this._render_ckeditor, this) );
			return;
		};

		const cdn = this.config.cdn || "//cdn.ckeditor.com/4.22.1/standard/";

		window.CKEDITOR_BASEPATH = cdn;
		webix.require([cdn+"ckeditor.js"])
		.then( webix.bind(this._render_ckeditor, this) )
		.catch(function(e){
			console.log(e);
		});
	},
	_render_ckeditor:function(){
		let initMethod = "replace";
		if(this.config.editorType === "inline") {
			CKEDITOR.disableAutoInline = true;
			initMethod = "inline";
			this.$view.style["overflow-y"] = "auto";
		};

		const barHeight = this.config.barHeight; // toolbar + bottombar, as initial sizes are set to the editable area
		const config = webix.extend({
			toolbar: this.config.toolbar,
			language: this.config.language,
			width: this.$width,
			height: this.$height - barHeight,
			resize_enabled: false,
		}, this.config.editorConfig);

		this._editor = CKEDITOR[initMethod](this.config.textAreaID, config);
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
		}, this, [], 100);
	},
	getValue:function(){
		return this._editor ? this._editor.getData() : this.config.value;
	},
	focus:function(){
		this._focus_await = true;
		if (this._editor)
			this._editor.focus();
	},
	getEditor:function(waitEditor){
		return waitEditor ? this._waitEditor : this._editor;
	}
}, webix.ui.view);
