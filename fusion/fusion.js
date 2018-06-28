webix.protoUI({
	name:"fusion-chart",
	defaults:{
		config:{},
		require: {
			charts: true,
			powercharts: false,
			widgets: false,
			gantt: false,
			maps: false
		}
	},
	$init:function(config){
		this._waitChart = webix.promise.defer();
		webix.delay(webix.bind(this._render_once, this));
	},
	_render_once: function(){

		if (this.config.cdn === false){
			this._render_chart();
			return;
		};

		var cdn = this.config.cdn;
		var check = cdn || window.FusionCharts;
		webix.assert(check, "No path to FusionChart sources");
		
		var sources = [];

		sources.push(cdn+"/fusioncharts.js");

		for (var req in this.config.require) {
			if (this.config.require[req]) {
				sources.push(cdn+"/fusioncharts." + req + ".js");
			}
		}
		
		// require theme js files
		if (this.config.config.dataSource.chart.theme) {
			var themes = this.config.config.dataSource.chart.theme.split(",");
			for (var i in themes) {
				sources.push(cdn+"/themes/fusioncharts.theme." + themes[i].trim() + ".js");
			}
		}

		webix.require(sources)
		.then( webix.bind(this._render_chart, this) )
		.catch(function(e){
			console.log(e);
		});
	},
	_render_chart:function(){
		var config = this.config.config;
		config.renderAt = this.$view;
		config.width = this.$width;
		config.height = this.$height;
		config.dataSource.chart.showBorder = 0;

		this._chart = new FusionCharts(config);
		this._chart.render();

		this._waitChart.resolve(this._chart);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this,x,y)){
			if (this._chart) {
				this._chart.resizeTo(this.$width, this.$height);
			}
		}
	},
	getChart:function(waitChart){
		return waitChart?this._waitChart:this._chart;
	}
}, webix.ui.view);