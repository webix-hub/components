webix.protoUI({
	name:"dhx-gantt",
	$init:function(){
		this._waitGantt = webix.promise.defer();
		webix.delay(webix.bind(this._render_once, this));
	},
	getGantt:function(waitGantt){
		return waitGantt ? this._waitGantt : this._gantt;
	},
	$setSize: function(x,y){
		if(webix.ui.view.prototype.$setSize.call(this,x,y)){
			if(this._gantt)
				this._gantt.render();
		}
	},
	_render_once:function(){
		var cdn = this.config.cdn;
		var skin = this.config.skin || "material";
		
		if (cdn === false){
			this._after_render_once();
			return;
		}

		cdn = cdn || "https://cdn.webix.com/components/gantt/";
		webix.require(cdn + "gantt/skins/dhtmlxgantt"+skin+".css");
		webix.require([
			cdn + "gantt/dhtmlxgantt.js"
		], this._after_render_once, this);
	},
	_after_render_once:function(){
		var gantt = this._gantt = window.Gantt ? Gantt.getGanttInstance() : window.gantt;

		if (this.config.init)
			this.config.init.call(this, gantt);

		gantt.init(this.$view);
		if (this.config.ready)
			this.config.ready.call(this, gantt);

		this._waitGantt.resolve(gantt);
	}
}, webix.ui.view);