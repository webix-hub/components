webix.protoUI({
	name:"dhx-scheduler",
	defaults:{
		tabs:["day", "week", "month"]
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
		var cdn = this.config.cdn;
		var skin = this.config.skin || "flat";
		if (skin === "terrace"){
			skin = "";
		} else {
			skin = "_"+skin;
		}

		if (cdn === false){
			this._after_render_once();
			return;
		}

		cdn = cdn || "https://cdn.webix.com/components/scheduler/";
		webix.require(cdn+"scheduler/dhtmlxscheduler"+skin+".css");
		webix.require([
			cdn+"scheduler/dhtmlxscheduler.js"
		], this._after_render_once, this);
	},
	_after_render_once:function(){
		var scheduler = this._scheduler = window.Scheduler ? Scheduler.getSchedulerInstance() : window.scheduler;

		if (this.config.init)
			this.config.init.call(this, scheduler);

		scheduler.init(this.$view.firstChild, (this.config.date||new Date()), (this.config.mode||"week"));
		if (this.config.ready)
			this.config.ready.call(this, scheduler);

		this._waitScheduler.resolve(scheduler);

	}
}, webix.EventSystem, webix.ui.view);