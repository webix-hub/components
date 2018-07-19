webix.protoUI({
	name:"here-map",
	defaults:{
		zoom: 5,
		center:[ 39.5, -98.5 ],
		mapType: {type:"normal", layer:"map"},
		modules:[]
	},
	$init:function(config){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;

		this._map = null;
		this._waitMap = webix.promise.defer();

		webix.delay(this.render, this); //let it paint
	},
	render:function(){

		if(window.H && window.H.map){
			this._initMap();
			return;
		};

		var cdn = "https://js.api.here.com/v3/3.0";
		var sources = [
			cdn+"/mapsjs-core.js",
			cdn+"/mapsjs-service.js"
		];

		var modules = this.config.modules;	
		for (var i=0; i<modules.length; i++){
			sources.push(cdn+"/mapsjs-"+modules[i]+".js");
			if (modules[i] == "ui")
				sources.push(cdn+"/mapsjs-"+modules[i]+".css");
		};

		webix.require(sources)
		.then( webix.bind(this._initMap, this) )
		.catch(function(e){ 
			console.log(e) 
		});
	},
	getMap:function(waitMap){
		return waitMap?this._waitMap:this._map;
	},
	getLayers:function(){
		return this._defaultLayers;
	},
	_initMap:function(){
		var c = this.config;

		if(!this._defaultLayers){
			var platform = new H.service.Platform(c.key);
			this._defaultLayers = platform.createDefaultLayers();
		};

		if(this.isVisible(c.id)){
			this._map = new H.Map( this._contentobj,
				this._defaultLayers[c.mapType.type][c.mapType.layer],
				{
					zoom: c.zoom,
					center: c.center
				}
			);
			this._waitMap.resolve(this._map);
		}
	},
	center_setter:function(config){
		config = { lat:config[0], lng:config[1]};
		
		if(this._map)
			this._map.setCenter(config);

		return config;
	},
	mapType_setter:function(config){
		/*{
			type:"normal", (normal, satellite, terrain)
			layer:"map" (map, traffic, panorama, base, tabels)
		};*/
		if(typeof config === "string")
			config = { type:config, layer:"map"};
		
		config.type = (config.type||"normal").toLowerCase();
		config.layer = (config.layer||"map").toLowerCase();
		
		if(this._map)
			this._map.setBaseLayer(this._defaultLayers[config.type][config.layer]);
		
		return config;
	},
	zoom_setter:function(config){
		if(this._map)
			this._map.setZoom(config);

		return config;
	}
}, webix.ui.view);
