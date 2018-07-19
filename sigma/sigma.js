webix.protoUI({
	name:"sigma-chart",
	defaults:{
		plugins:[],
		config:{}
	},
	$init:function(){		
		this._waitChart = webix.promise.defer();
		webix.delay(webix.bind(this._init_once, this));
	},
	_init_once:function(){

		if (this.config.cdn === false){
			this._render_once();
			return;
		};

		var cdn = this.config.cdn ? this.config.cdn : "https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.1"

		var sources = [];

		sources.push(cdn + "/sigma.min.js");

		var plugins = this.config.plugins;
		if (plugins.length){
			for (var i = 0; i < plugins.length; i++){
				sources.push(cdn + "/plugins/" + plugins[i] + ".min.js");
			};
		};

		webix.require(sources)
		.then(webix.bind(this._render_once, this))
		.catch(function(e){
			console.log(e);
		});
	},
	_render_once:function(){
		var obligatory_config = { container:this.$view };
		var config = webix.extend(this.config.config, obligatory_config, true);

		this._chart = new sigma(config);

		if (this.config.ready)
			this.config.ready.call(this);

		this._waitChart.resolve(this._chart);
	},
	$setSize:function(x,y){
		webix.ui.view.prototype.$setSize.call(this,x,y);
	},
	getChart:function(waitChart){
		return waitChart?this._waitChart:this._chart;
	}
}, webix.ui.view );