webix.protoUI({
	name:"d3-chart",
	defaults:{
		minified:true,
		version:"5"
	},
	$init:function(){
		this._waitContent = webix.promise.defer();
		webix.delay(this._render_once, this);
	},
	_render_once:function(){
				
		if (this.config.cdn === false){
			this._set_ready_awaits();
			return;
		};

		var cdn = this.config.cdn ? this.config.cdn : "https://d3js.org";
		// get the minified file by default
		var isMin = this.config.minified ? ".min" : "";
		var version = this.config.version.toString();

		var source = cdn+"/d3.v"+version+isMin+".js";
		
		webix.require([ source ])
		.then( webix.bind(this._finalize_init, this) )
		.catch(function(e){
			console.log(e);
		});
	},
	_finalize_init:function(){
		this._waitContent.resolve(d3.select(this.$view));
		if (this.config.init)
			this.config.init.call(this);
		this._data_ready();
	},
	_data_ready:function(){
		webix.promise.all([
			this._waitContent,
			this.waitData
		])
		.then( webix.bind(this.renderData, this) );
	},
	renderData:function(){
		if (this.config.ready){
			this.$view.innerHTML = "";
			this.config.ready.call(this, this.data);
		}
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this,x,y)){
			this._data_ready();
		}
	},
	getSelection:function(wait){
		return wait ? this._waitContent : d3.select(this.$view)
	}
}, webix.AtomDataLoader, webix.EventSystem, webix.ui.view );