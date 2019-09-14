webix.protoUI({
	name:"apexchart",
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

		var cdn = c.cdn || "https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.8.6";
		var sources = [];

		sources.push(cdn+"/apexcharts.js");

		webix.require(sources)
			.then(webix.bind( this._render, this ))
			.catch(function(e){
				this._waitChart.reject(e);
			});
	},
	_render:function(){
        try {
    		var config = this.config.settings;
    		this._chart = new ApexCharts(this.$view.firstChild, config);
            this._chart.render();
    		this._waitChart.resolve(this._chart);
        } catch(e) {
            console.log(e);
        }
	},
	getChart:function(wait){
		return wait ? this._waitChart : this._chart;
	}
}, webix.ui.view);
