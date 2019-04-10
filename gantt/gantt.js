webix.protoUI({
	name:"dhx-gantt",
	defaults:{
	},
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
		
		if (this.config.cdn === false){
			this._after_render_once();
			return;
		}

		var cdn = this.config.cdn || "https://cdn.dhtmlx.com/gantt/5.2";
		var skin = this.config.skin;
		var sources = [];
		
		sources.push(cdn+"/dhtmlxgantt.js");
		sources.push(cdn+(skin ? "/skins/dhtmlxgantt_"+skin+".css" : "/dhtmlxgantt.css"));

		webix.require(sources)
		.then( webix.bind(this._after_render_once, this) )
		.catch(function(e){
			console.log(e);
		});
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