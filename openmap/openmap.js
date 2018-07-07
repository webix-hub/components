webix.protoUI({
	name:"open-map",
	defaults:{
		zoom: 5,
		center:[ 39.5, -98.5 ],
		layer:"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
	},
	$init:function(){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;
		
		this._waitMap = webix.promise.defer();
		this.$ready.push(this.render);
	},
	getMap:function(waitMap){
		return waitMap?this._waitMap:this._map;
	},
	render:function(){
        if (this.config.cdn === false && (!window.L || !window.L.map)){        	
            this._initMap();
            return;
        };

        var cdn = this.config.cdn ? this.config.cdn : "https://unpkg.com/leaflet@1.3.1/dist";

        webix.require([
			cdn+"/leaflet.js",
			cdn+"/leaflet.css"
		])
		.then( webix.bind(this._initMap, this) )
		.catch(function(e){
			console.log(e);
		});
        
	},
    _initMap:function(define){
	    var c = this.config;

	    if(this.isVisible(c.id)){

	        this._map = L.map(this._contentobj);
	        this._map.setView(c.center, c.zoom);
	        L.tileLayer(c.layer, {
			    attribution: c.attribution
			}).addTo(this._map);

			this._waitMap.resolve(this._map);
		}
    },
	center_setter:function(config){
		if(this._map)
            this._map.panTo(config);
		return config;
	},
	mapType_setter:function(config){
		//yadex#map, yadex#satellite, yadex#hybrid, yadex#publicMap
		if(this._map)
        	this._map.setType(config);

		return config;
	},
	zoom_setter:function(config){
		if(this._map)
			 this._map.setZoom(config);

		return config;
	},
	$setSize:function(){
		webix.ui.view.prototype.$setSize.apply(this, arguments);
		if(this._map)
            this._map.invalidateSize();
	}
}, webix.ui.view, webix.EventSystem);
