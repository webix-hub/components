webix.protoUI({
    name:"paper",
    $init:function(config){
        var elm = document.createElement("canvas");
        elm.id  = config.canvas;
        // elm.resize = true;
        this._canvas = this.$view.appendChild(elm);

        if (this.config.cdn === false)
            return;

        var cdn = this.config.cdn ? this.config.cdn : "https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.11.5"
        webix.require([cdn + "/paper-full.js"])
        .then(webix.bind(function(){            
            paper.setup(this._canvas);
            // paper.install(window)
        }, this))
        .catch(function(e){
            console.log(e);
        });
    },
    getView:function(){

    },
    $setSize:function(x,y){
        if (webix.ui.view.prototype.$setSize.call(this, x,y)){
            this._canvas.width = x;
            this._canvas.height = y;
            if (window.paper){
                // we need to update Paper View according to new canvas size
                // paper.project.getView(this._canvas.id).viewSize = {width:x, height:y};
                // paper.project.getView(this._canvas.id).draw();
            }
        }
    }
}, webix.ui.view);