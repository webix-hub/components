webix.protoUI({
	name:"raphael-chart",
	defaults:{
	},
	$init:function(){
		this._ready_awaits = 0;
		this._waitChart = webix.promise.defer();

		this.attachEvent("onAfterLoad",function(){
			if (this._ready_awaits == 2){
				if (this.config.ready){
					this.config.ready.call(this, this.data);
					this._ready_awaits = 3;
				}
			} else this._ready_awaits = 1;
		});

		webix.delay(webix.bind(this._render_once, this));
	},
	_render_once:function(){
		webix.require("raphael/raphael.js",function(first_init){
			this._chart = Raphael(this.$view, this.$width, this.$height);
			
			if (this.config.init)
				this.config.init.call(this);
			if (this._ready_awaits == 1 && this.config.ready){
				this.config.ready.call(this, this.data);
				this._ready_awaits = 3;
			} else
				this._ready_awaits = 2;

			this._waitChart.resolve(this._chart);
		}, this);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this,x,y)){
			if (this._ready_awaits == 3 && this.config.resize){
				if (this._chart) {
					this._chart.setSize(this.$width, this.$height);
					this._chart.clear();
				}
				this.config.ready.call(this, this.data);
			}
		}
	},
	getChart:function(waitChart){
		return waitChart?this._waitChart:this._chart;
	}
}, webix.AtomDataLoader, webix.EventSystem, webix.ui.view );