webix.protoUI({
    name:"paper",
    $init:function(config){
        var elm = document.createElement('canvas');
        elm.id  = config.canvas;
        this._canvas = this.$view.appendChild(elm);

        webix.promise.defer().then(webix.bind(function(){
            paper.setup(this._canvas);
        }, this));

        if (!window.Paper)
            webix.require("paperjs/dist/paper-full.min.js");

    },
    $setSize:function(x,y){
        if (webix.ui.view.prototype.$setSize.call(this, x,y)){
            this._canvas.width = x;
            this._canvas.height = y;
        }
    }
}, webix.ui.view);