webix.protoUI({
	name:"highchart",
	defaults:{		
		modules:[]	
	},
	$init:function(){
		this.uid = "chart"+webix.uid();
		this.$view.innerHTML = "<div id='"+this.uid+"' style='width:100%;height:100%'></div>";
		
		this._chart = null;
		this._waitChart = webix.promise.defer();
		this.$ready.push(this._request_sources);
	},
	_request_sources:function(){
		var c = this.config;
		if (c.cdn === false){
			webix.delay(this._render, this);
			return;
		};

		var cdn = c.cdn || "https://code.highcharts.com/11.3.0";		

		var sources = [];
			
		sources.push(cdn+"/highcharts.js");

		// get theme
		var styledMode = c.settings && c.settings.chart && c.settings.chart.styledMode;
		if (styledMode){
			sources.push(cdn + "/css/highcharts.css");
		};
		if (c.theme){
			var theme_url = cdn;
			if (styledMode){
				theme_url += "/css/themes/" + c.theme + ".css";
			} else {
				theme_url += "/themes/" + c.theme + ".js";
			}
			sources.push(theme_url);
		};

		// get highcharts-more and 3D
		if (c.more)
			sources.push(cdn+"/highcharts-more.js");
		var expect3d = c.settings && c.settings.chart && c.settings.chart.options3d;
		if (c.enable3d || expect3d)
			sources.push(cdn+"/highcharts-3d.js");

		// get modules
		var mod = c.modules;
		for (var i = 0; i < mod.length; i++){
			sources.push(cdn + "/modules/" + mod[i] + ".js");
		};

		webix.require(sources)
			.then(webix.bind( this._render, this ))
			.catch(function(e){
				this._waitChart.reject(e);
			});		 
	},
	_render:function(){
		var config = this.config.settings;
		this._chart = Highcharts.chart(this.$view.firstChild, config);
		this._waitChart.resolve(this._chart);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this,x,y)){
			if (this._chart) {
				this._chart.setSize(this.$width, this.$height, false);
			}
		}
	},
	getChart:function(wait){
		return wait ? this._waitChart : this._chart;
	}
}, webix.ui.view);