	webix.protoUI({
	name:"nokia-map",
	$init:function(config){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;
		
		this.map = null;
		this.$ready.push(this.render);
	},
	render:function(){
		if (this._check_loading) return;
        this._initMap();
	},
    _initMap:function(define){
	    var c = this.config;
        this.map = new nokia.maps.map.Display(this._contentobj, {
        	center:c.center,
        	zoomLevel:c.zoom,
        	baseMapType:nokia.maps.map.Display[c.mapType]
        });
    },
	center_setter:function(config){
		if(this.map)
            this.map.setCenter(nokia.maps.geo.Coordinate(config[0], config[1]));
        
		return config;
	},
	mapType_setter:function(config){
		//NORMAL, SATELLITE, TERRAIN
		if(this.map)
        	this.map.set("baseMapType", this.map[config]);

		return config;
	},
	zoom_setter:function(config){
		if(this.map)
			 this.map.setZoomLevel(config);

		return config;
	},
	defaults:{
		zoom: 5,
		center:[ 39.5, -98.5 ],
		mapType: "NORMAL" 
	}
}, webix.ui.view);
