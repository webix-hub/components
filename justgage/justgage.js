webix.protoUI({
    name:'justgage-chart',
    $init:function(config){
        this._waitChart = webix.promise.defer();
        this.$ready.push(this._render_after_load);
    },
    defaults:{
        minHeight:100,
        minWidth:200
    },
    _render_after_load:function(){
        webix.require([
            "justgage/raphael.js",
            "justgage/justgage.js?1"
        ],function(){
                var temp_id = this.config.id+"_"+webix.uid();

                this.$view.innerHTML= "<div id='"+temp_id+"' style='width:100%; height:100%;'></div>";
                var gage_config = webix.extend({}, this.config);
                gage_config.id = temp_id;
                gage_config.relativeGaugeSize = true;

                this._chart = new JustGage(gage_config);
                this._waitChart.resolve(this._chart);
        },this);
    },
    setValue:function(value){
        this.config.value=value;
        this._chart.refresh(value,100);
    },
    getValue:function(){
        return this.config.value;
    },
    getChart:function(waitChart){
        return waitChart ? this._waitChart : this._chart;
    }
},webix.ui.view);