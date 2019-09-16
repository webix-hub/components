webix.protoUI({
	name:'justgage-chart',
	$init:function(config){
		this._waitChart = webix.promise.defer();
		this.$ready.push(this._request_and_render);
	},
	defaults:{
		minHeight:100,
		minWidth:200,
		min:0,
		max:100
	},
	_request_and_render:function(){

		if (this.config.cdn === false){
			// justGage uses document.getElementById, so ensure the rendering is finished
			webix.delay(this._render_after_load, this);
			return;
		};

		var cdn = this.config.cdn ? this.config.cdn : "https://cdnjs.cloudflare.com/ajax/libs/justgage/1.2.9";

		var sources = [];

		sources.push(cdn+"/justgage.js");
		// raphael version included in the main justGage package is named differently
		// while cdnjs stores raphael in its own repo
		if (this.config.cdn)
			sources.push(cdn+"/raphael-2.1.4.min.js");
		else
			sources.push("https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.4/raphael-min.js");

		webix.require(sources)
		.then(webix.bind( this._render_after_load, this ))
		.catch(function(e){
			console.log(e);
		});
	},
	_render_after_load:function(){
		var temp_id = this.config.id+"_"+webix.uid();

		this.$view.innerHTML= "<div id='"+temp_id+"' style='width:100%; height:100%;'></div>";
		var gage_config = webix.extend({}, this.config);
		gage_config.id = temp_id;
		gage_config.relativeGaugeSize = true;

		this._chart = new JustGage(gage_config);

		this._waitChart.resolve(this._chart);
	},
	setValue:function(value){
		this.config.value=value;
		this._chart.refresh(value, this.config.max);
	},
	getValue:function(){
		return this.config.value;
	},
	getChart:function(waitChart){
		return waitChart ? this._waitChart : this._chart;
	}
},webix.ui.view);