webix.protoUI({
	name:"google-map",
	$init:function(config){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;

		this.map = null;
		
		this.$ready.push(this.render);
	},
	render:function(){

        if(typeof google=="undefined"||typeof google.maps=="undefined"){
            var name = "webix_callback_"+webix.uid();
            window[name] = webix.bind(function(){
                 this._initMap.call(this,true);
            },this);

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//maps.google.com/maps/api/js?callback="+name;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        else
            this._initMap();
	},
    _initMap:function(define){
        var c = this.config;
        if(this.isVisible(c.id)){
			this.map = new google.maps.Map(this._contentobj, {
				zoom: c.zoom,
				center: new google.maps.LatLng(c.center[0], c.center[1]),
				mapTypeId: google.maps.MapTypeId[c.mapType]
			});
			webix._ldGMap = null;
        }
    },
	center_setter:function(config){
		if(this.map)
            this.map.setCenter(new google.maps.LatLng(config[0], config[1]));
        
		return config;
	},
	mapType_setter:function(config){
		/*ROADMAP,SATELLITE,HYBRID,TERRAIN*/
        if(this.map)
        	this.map.setMapTypeId(google.maps.MapTypeId[config]);

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
		mapType: "ROADMAP" 
	},
	$setSize:function(){
		webix.ui.view.prototype.$setSize.apply(this, arguments);
		if(this.map)
            google.maps.event.trigger(this.map, "resize");
	}
}, webix.ui.view);
