webix.protoUI({
	name:"yandex-map",
	defaults:{
		zoom: 5,
		center:[ 39.5, -98.5 ],
		mapType: "yandex#map",
		version:"2.1",
		lang:"en-US",
		load:["package.full"],
		apikey:false
	},
	$init:function(config){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;
		
		this._waitMap = webix.promise.defer();
		this.$ready.push(this.render);
	},
	getMap:function(waitMap){
		return waitMap?this._waitMap:this._map;
	},
	render:function(){

		if( typeof ymaps !== "undefined" || this.config.cdn === false ){
			this._initMap();
			return;
		};

		var cfg = this.config;
		var cdn = cfg.cdn ? cfg.cdn : "https://api-maps.yandex.ru/"
		
		// configuring request
		var requireMap = cdn + cfg.version + "/?lang=" + cfg.lang;
		requireMap += "&load=" + cfg.load.join(",");
		if (cfg.apikey)
			requireMap += "&apikey=" + cfg.apikey;

		webix.require([
			requireMap
		])
		.then( webix.bind(this._initMap, this) )
		.catch(function(e){
			console.log(e);
		});
	},
	_initMap:function(define){

		var c = this.config;

		ymaps.ready( 
			webix.bind(function(){
				this._map = new ymaps.Map(this._contentobj, {
					center:c.center,
					zoom:c.zoom,
					type:c.mapType
				});
				this._waitMap.resolve(this._map);
				webix._ldYMap = null;
			}, this)
		);
	},
	center_setter:function(config){
		if(this._map)
			this._map.setCenter(config);
		
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
	}
}, webix.ui.view);