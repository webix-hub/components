webix.protoUI({
	name:"paper",
	$init:function(config){
		var elm = document.createElement("canvas");
		elm.id  = config.canvas;
		// elm.resize = true;
		this._canvas = this.$view.appendChild(elm);

		if (this.config.cdn === false)
			return;

		var cdn = this.config.cdn ? this.config.cdn : "https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.11.5"
		webix.require([cdn + "/paper-full.js"])
		.then(webix.bind(this._init_paper, this))
		.catch(function(e){
			console.log(e);
		});
	},
	_init_paper:function(){			
		paper.install(window);
		paper.setup(this._canvas);
		this.config.ready.call(this);
	},
	getView:function(){
		return paper.project.getView(this._canvas.id);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x,y)){
			this._canvas.width = x;
			this._canvas.height = y;
			if (window.paper){
				this.getView().setViewSize(x,y);
			};			
		}
	}
}, webix.ui.view, webix.EventSystem);