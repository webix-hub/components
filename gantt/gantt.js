webix.protoUI({
	name:"dhx-gantt",
	$init:function(){
		webix.delay(webix.bind(this._render_once, this));
	},
	$setSize: function(x,y){
		if(webix.ui.view.prototype.$setSize.call(this,x,y)){
			if(window.gantt)
				gantt.render();
		}
	},
	_render_once:function(){
		webix.require("gantt/dhtmlxgantt.css");
		webix.require("gantt/dhtmlxgantt.js", function(){
			if (this.config.init)
				this.config.init.call(this);

			gantt.init(this.$view);
			if (this.config.ready)
				this.config.ready.call(this);

		}, this);
	}
}, webix.ui.view);