webix.protoUI({
    name:"graph3d",
    defaults:{
        style: 'surface',
        steps: 50,
        axisMax: 300,
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5
    },
    $init:function(config){
        this.graph3d = null;
        this.$ready.push(this._render_cm_editor);
    },

    _render_cm_editor:function(){
        webix.require([
            "graph3d/dist/vis.min.js"
        ], this._render_when_ready, this);
    },

    _render_when_ready:function(){
        var data = new vis.DataSet();

        if(typeof this.config.data === 'function'){
            var axisStep = this.config.axisMax / this.config.steps;
            for (var x = 0; x < this.config.axisMax; x+=axisStep) {
                for (var y = 0; y < this.config.axisMax; y+=axisStep) {
                    var value = this.config.data(x, y);
                    data.add({
                        x: x,
                        y: y,
                        z: value,
                        style: value
                    });
                }
            }
        } else if(typeof this.config.data === 'object'){
            data.add(this.config.data);
        }

        this.graph3d = new vis.Graph3d(this.getNode(), data, this.config);
    },

    getGraph:function(){
        return this.graph3d;
    }

}, webix.ui.view);