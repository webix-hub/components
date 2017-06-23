webix.protoUI({
    name:"konva",
    $init:function(){
        this._waitStage = webix.promise.defer();
        this.$ready.push(this.render);
    },
    render:function(){
        if(!window.Konva)
            webix.require("konva/konva.js", this._initStage, this);
        else
            this._initStage();
    },
    _initStage:function(){
        this._stage = new Konva.Stage({
            container: this.$view
        });
        this._waitStage.resolve(this._stage);

        if (this.config.ready)
            this.config.ready.call(this, this._stage);
    },
    $setSize:function(x,y){
        if (webix.ui.view.prototype.$setSize.call(this, x,y)){
            this._waitStage.then(function(stage){
                stage.size({ width:x, height:y });
            });
        }
    },
    getStage:function(waitStage){
        return waitStage?this._waitStage:this._stage;
    }
}, webix.ui.view);