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
				if (requires.length == 0) {
					var config = this.config.config;
					config.renderAt = this.$view;
					config.width = this.$width;
					config.height = this.$height;
					config.dataSource.chart.showBorder = 0;
			        
					this.fusion = new FusionCharts(config);
					this.fusion.render();
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
			if (this.fusion) {
				this.fusion.resizeTo(this.$width, this.$height);
			}
		}
	},
	getChart:function(){
		return this.fusion;
	},
}, webix.EventSystem, webix.ui.view );