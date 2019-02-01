webix.protoUI({
	name:"dhx-scheduler",
	defaults:{
		tabs:["day", "week", "month"],
		skin:"terrace",
		ext:[]
	},
	getScheduler:function(waitScheduler){
		return waitScheduler ? this._waitScheduler : this._scheduler;
	},
	$init:function(config){
		this._waitScheduler = webix.promise.defer();

		this.$ready.push(function(){
			var tabs = this.config.tabs;
			var html = ["<div class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div>"];
			if (tabs)
				for (var i=0; i<tabs.length; i++)
					html.push("<div class='dhx_cal_tab" +
						((i===0)?" dhx_cal_tab_first":"") +
						((i==tabs.length-1)?" dhx_cal_tab_last":"") +
						"' name='"+tabs[i]+"_tab' ></div>");
			html.push("</div><div class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>");

			this.$view.innerHTML = html.join("");

			//because we are not messing with resize model
			//if setSize will be implemented - below line can be replaced with webix.ready
			webix.delay(webix.bind(this._render_once, this));
		});

		this.attachEvent("onDestruct", function(){
			var sch = this.getScheduler();
			if (sch)
				scheduler.cancel_lightbox();
		});
	},
	$setSize: function(x,y){
		if(webix.ui.view.prototype.$setSize.call(this,x,y)){
			if(this._scheduler)
				this._scheduler.setCurrentView();
		}
	},
	_render_once:function(){		
		this._cdn = this.config.cdn;
		
		// if 'false', do not try to load anything (assuming all sources were included to the page)
		if (this._cdn === false){
			this._after_render_once();
			return;
		};

		// otherwise, use CDN
		this._cdn = this._cdn || "https://cdn.dhtmlx.com/scheduler/5.0";

		var cdn = this._cdn;
		var skin = this.config.skin;
		if (skin === "terrace"){
			skin = "";
		} else {
			skin = "_"+skin;
		};
		// main js/css files
		var sources = [
			cdn+"/dhtmlxscheduler"+skin+".css",
			cdn+"/dhtmlxscheduler.js"			
		];
		// modules from 'ext' folder of the package
		var ext = this.config.ext;
		if (ext && Array.isArray(ext) && ext.length){
			var ext_to_load = ext.map(function(name){
				return cdn+"/ext/dhtmlxscheduler_"+name+".js"
			})
			sources = sources.concat(ext_to_load);
		};

		webix.require(sources).then( webix.bind(this._after_render_once, this) ).catch(function(e){
			console.log(e);
		});
	},
	_after_render_once:function(){
		var scheduler = this._scheduler = window.Scheduler ? Scheduler.getSchedulerInstance() : window.scheduler;
		scheduler.skin = this.config.skin;

		if (this.config.init)
			this.config.init.call(this);

		scheduler.init(this.$view.firstChild, (this.config.date||new Date()), (this.config.mode||"week"));
		if (this.config.ready)
			this.config.ready.call(this);

		this._waitScheduler.resolve(scheduler);

	}
}, webix.EventSystem, webix.ui.view);