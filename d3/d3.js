webix.protoUI({
	name:"d3-chart",
	defaults:{
		minified:true,
		version:"5"
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

		webix.delay(this._render_once, this);
	},
	_render_once:function(){
				
		if (this.config.cdn === false){
			this._set_ready_awaits();
			return;
		};

		var cdn = this.config.cdn ? this.config.cdn : "https://d3js.org";
		// get the minified file by default
		var isMin = this.config.minified ? ".min" : "";
		var version = this.config.version.toString();

		var source = cdn+"/d3.v"+version+isMin+".js";
		
		webix.require([ source ])
		.then( webix.bind(this._set_ready_awaits, this) )
		.catch(function(e){
			console.log(e);
		});	;
	},
	_set_ready_awaits:function(first_init){
		if (this.config.init)
			this.config.init.call(this);
		if (this._ready_awaits == 1 && this.config.ready){
			this.config.ready.call(this, this.data);
			this._ready_awaits = 3;
		} else 
			this._ready_awaits = 2;
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