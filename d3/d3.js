webix.protoUI({
	name:"d3-chart",
	defaults:{
	},
	$init:function(){
		this._ready_awaits = 0;

		this.attachEvent("onAfterLoad", function(){
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
		webix.require("d3/d3.v3.min.js",function(first_init){

			if (this.config.init)
				this.config.init.call(this);
			if (this._ready_awaits == 1 && this.config.ready){
				this.config.ready.call(this, this.data);
				this._ready_awaits = 3;
			} else 
				this._ready_awaits = 2;


  		}, this);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this,x,y)){
			if (this._ready_awaits == 3 && this.config.resize){
				this.$view.innerHTML = "";
				this.config.ready.call(this, this.data);
			}
		}
	}
}, webix.AtomDataLoader, webix.EventSystem, webix.ui.view );