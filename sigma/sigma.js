webix.protoUI({
	name:"sigma-chart",
	defaults:{
		graph:{
 	    	minNodeSize: 0.5,
    		maxNodeSize: 5
  		},
  		draw:{
  			defaultLabelColor: '#fff',
  			defaultEdgeType: 'curve'
  		}
	},
	$init:function(){
		this.$view.style.backgroundColor = "#222";
		webix.delay(webix.bind(this._render_once, this));
	},
	_render_once:function(){
		webix.require([
			"sigma/sigma.js",
			"sigma/plugins/sigma.parseGexf.js",
			"sigma/plugins/sigma.fisheye.js"
		],function(first_init){

			var sigInst = this._sigma = sigma.init(this.$view);
			if (this.config.draw)
				sigInst.drawingProperties(this.config.draw);
			if (this.config.graph)
				sigInst.graphProperties(this.config.graph);

	  		if (this.config.url)
				sigInst.parseGexf(this.config.url);

			if (this.config.ready)
				this.config.ready.call(this);

			sigInst.activateFishEye().draw();
  		}, this);
	},

	$setSize:function(x,y){
		webix.ui.view.prototype.$setSize.call(this,x,y);
	},

	getChart:function(){
		return this._sigma;
	}
}, webix.ui.view );