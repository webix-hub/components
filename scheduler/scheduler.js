webix.protoUI({
	name:"dhx-scheduler",
	$init:function(){
		this.$view.innerHTML = "<div class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div><div class='dhx_cal_tab dhx_cal_tab_first' name='day_tab' style='left:14px;'></div><div class='dhx_cal_tab' name='week_tab' style='left:75px;'></div><div class='dhx_cal_tab dhx_cal_tab_last' name='month_tab' style='left:136px;'></div></div><div class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>";
		//because we are not messing with resize model
		//if setSize will be implemented - below line can be replaced with webix.ready
		webix.delay(webix.bind(this._render_once, this));
	},
	_render_once:function(){
		webix.require("scheduler/dhtmlxscheduler.css");
		webix.require([
			"scheduler/dhtmlxscheduler.js"
		], function(){
			if (this.config.init)
				this.config.init.call(this);

			scheduler.init(this.$view.firstChild, (this.config.date||new Date()), (this.config.mode||"week"));
			if (this.config.ready)
				this.config.ready.call(this);

		}, this);
	}
}, webix.ui.view);