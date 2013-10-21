webix.protoUI({
    name:'justgage-chart',
    $init:function(config){
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

                this.config.gage=new JustGage(gage_config);
        },this);
    },
    setValue:function(value){
        this.config.value=value;
        this.config.gage.refresh(value,100);
    },
    getValue:function(){
        return this.config.value;
    }
},webix.ui.view);