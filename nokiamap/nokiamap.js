	webix.protoUI({
	name:"nokia-map",
	$init:function(config){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;
		
		this._map = null;
		this.$ready.push(this.render);
	},
	render:function(){
		if (this._check_loading) return;
        this._initMap();
	},
	getMap:function(){
		return this._map;
	},
    _initMap:function(define){
	    var c = this.config;
        this._map = new nokia.maps.map.Display(this._contentobj, {
        	center:c.center,
        	zoomLevel:c.zoom,
        	baseMapType:nokia.maps.map.Display[c.mapType]
        });
    },
	center_setter:function(config){
		if(this._map)
            this._map.setCenter(nokia.maps.geo.Coordinate(config[0], config[1]));
        
		return config;
	},
	mapType_setter:function(config){
		//NORMAL, SATELLITE, TERRAIN
		if(this._map)
        	this._map.set("baseMapType", this._map[config]);

		return config;
	},
	zoom_setter:function(config){
		if(this._map)
			 this._map.setZoomLevel(config);

		return config;
	},
	defaults:{
		zoom: 5,
		center:[ 39.5, -98.5 ],
		mapType: "NORMAL" 
	}
}, webix.ui.view);
