webix.protoUI({
	name:"vis-chart",
	$init:function(){		
		this._waitChart = webix.promise.defer();
		webix.delay(webix.bind(this._init_once, this));
	},
	_init_once:function(){

		if (this.config.cdn === false){
			this._render_once();
			return;
		};

		var cdn = this.config.cdn ? this.config.cdn : "https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0";

		var sources = [];

		sources.push(cdn + "/vis.min.js");
		sources.push(cdn + "/vis.min.css");

		webix.require(sources)
		.then(webix.bind(this._render_once, this))
		.catch(function(e){
			console.log(e);
		});
	},
	_render_once:function(){
		var g3 = this.config.graph3d;
		if (g3){
			this._get_chart_size(g3);
			var data = new vis.DataSet(this.config.data || []);
			this._chart = new vis.Graph3d(this.$view, data, g3);
		}

		var g2 = this.config.graph2d;
		if (g2){
			this._get_chart_size(g2);
			var data = new vis.DataSet(this.config.data || []);
			this._chart = new vis.Graph2d(this.$view, data, g2);
		}

		var tm = this.config.timeline;
		if (tm){
			this._get_chart_size(tm);
			var data = new vis.DataSet(this.config.data || []);
			this._chart = new vis.Timeline(this.$view, data, tm);
		}

		var nw = this.config.network;
		if (nw){
			var data = {
				nodes : new vis.DataSet(this.config.data.nodes || []),
				edges : new vis.DataSet(this.config.data.edges || [])
			};
			this._chart = new vis.Network(this.$view, data, nw);
		}

		if (this.config.ready){
			var res = this.config.ready.call(this);
			this._chart = this._chart || res;
		}

		this._waitChart.resolve(this._chart);
	},
	_get_chart_size:function(g3){
		g3.width = this.$width+"px";
		g3.height =  this.$height+"px";
		return g3;
	},
	$setSize:function(x,y){
		webix.ui.view.prototype.$setSize.call(this,x,y);
		if (this._chart){
			this._chart.setOptions(this._get_chart_size({}));
			this._chart.redraw();
		}
	},
	getChart:function(waitChart){
		return waitChart?this._waitChart:this._chart;
	}
}, webix.ui.view );