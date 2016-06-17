webix.protoUI({
	name:"open-map",
	$init:function(){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;
		
		this.map = null;
		this.$ready.push(this.render);
	},
	render:function(){
        if(!window.L || !window.L.map){
        	webix.require([
				"leaflet/leaflet.js",
				"leaflet/leaflet.css"
			], this._initMap, this);
        }
        else
            this._initMap();
	},
    _initMap:function(define){
	    var c = this.config;

	    if(this.isVisible(c.id)){

	        this.map = L.map(this._contentobj);
	        this.map.setView(c.center, c.zoom);
	        L.tileLayer(c.layer, {
			    attribution: c.attribution
			}).addTo(this.map);
		}	
		
		this.attachEvent("onViewResize", function(){
		    this.map.invalidateSize();	
		});
    },
	center_setter:function(config){
		if(this.map)
            this.map.setCenter(config);
        
		return config;
	},
	mapType_setter:function(config){
		//yadex#map, yadex#satellite, yadex#hybrid, yadex#publicMap
		if(this.map)
        	this.map.setType(config);

		return config;
	},
	zoom_setter:function(config){
		if(this.map)
			 this.map.setZoom(config);

		return config;
	},
	defaults:{
		zoom: 5,
		center:[ 39.5, -98.5 ],
		layer:"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
	}
}, webix.ui.view, webix.EventSystem);
