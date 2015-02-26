webix.protoUI({
    name:"konva",
    $init:function(){
        this.stage = webix.promise.defer().then(webix.bind(function(){
            var stage = new Konva.Stage({
                container: this.$view
            });

            if (this.config.ready)
                this.config.ready.call(this, stage);

            return stage;
        }, this));

        if (window.Konva) 
            this.stage.resolve();
        else
            webix.require("konva/konva.js", function(){ this.stage.resolve(); }, this);
    },
    $setSize:function(x,y){
        if (webix.ui.view.prototype.$setSize.call(this, x,y)){
            this.stage.then(function(stage){
                stage.size({ width:x, height:y });
            });
        }
    },
    getStage:function(){
        return this.stage;
    }
}, webix.ui.view);