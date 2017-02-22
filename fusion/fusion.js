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
		webix.require("fusioncharts/fusioncharts.js", webix.bind(function() {
		
			// require additional js files
			var requires = [];
			for (var req in this.config.require) {
				if (this.config.require[req]) {
					requires.push("fusioncharts." + req + ".js");
				}
			}
			
			// require theme js files
			if (this.config.config.dataSource.chart.theme) {
				var themes = this.config.config.dataSource.chart.theme.split(",");
				for (var i in themes) {
					requires.push("themes/fusioncharts.theme." + themes[i].trim() + ".js");
				}
			}
			
			var loadrequires = (function() {
				if (requires.length === 0) {
					var config = this.config.config;
					config.renderAt = this.$view;
					config.width = this.$width;
					config.height = this.$height;
					config.dataSource.chart.showBorder = 0;

					this._chart = new FusionCharts(config);
					this._chart.render();

					this._waitChart.resolve(this._chart);
				} else {
					var nreq = requires.shift();
					webix.require("fusioncharts/" + nreq, webix.bind(loadrequires, this));
				}
			});
			
			loadrequires.call(this);
		}, this));
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