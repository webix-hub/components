webix.protoUI({
	name:"dhx-scheduler",
	defaults:{
		tabs:["day", "week", "month"]
	},
	getScheduler:function(){
		return this._scheduler;
	},
	$init:function(config){
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
	},
	_render_once:function(){
		webix.require("scheduler/dhtmlxscheduler.css");
		webix.require([
			"scheduler/dhtmlxscheduler.js"
		], function(){
			var scheduler = this._scheduler = window.Scheduler ? Scheduler.getSchedulerInstance() : window.scheduler;

			if (this.config.init)
				this.config.init.call(this);

			scheduler.init(this.$view.firstChild, (this.config.date||new Date()), (this.config.mode||"week"));
			if (this.config.ready)
				this.config.ready.call(this);

		}, this);
	}
}, webix.ui.view);