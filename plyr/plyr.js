webix.protoUI({
	name:"plyr-player",
	defaults:{
		config:{},
		source:{}
	},
	$init:function(){
		this.$view.innerHTML = '<div class="webix_player_parent"><audio></audio></div>';
		this._container = this.$view.firstChild.firstChild;
		// visibility of tooltips and popup menu
		this.$view.style.overflow = "visible";

		this._waitView = webix.promise.defer();
		this.$ready.push(this.render);
	},
	getPlayer:function(wait){
		return wait?this._waitView:this._player;
	},
	render:function(){
		if (this.config.cdn === false || window.Plyr){
			this._initPlyr();
			return;
		};

		var cdn = this.config.cdn ? this.config.cdn : "https://cdn.plyr.io/3.5.10";

		webix.require([
			cdn+"/plyr.js",
			cdn+"/plyr.css"
		])
		.then( webix.bind(this._initPlyr, this) )
		.catch(function(e){
			console.log(e);
		});
		
	},
	_initPlyr:function(){
		var options = webix.extend({}, this.config.config);
		this._player = new Plyr(this._container, options);
		this.$view.firstChild.firstChild.setAttribute("tabindex", "-1");
		this._waitView.resolve(this._player);

		this._player.on("canplay", webix.bind(function(){
			this._normalizeRatio();
		}, this));
		this._player.on("ready", webix.bind(function(){
			// allow width less than 200px
			this.$view.querySelector(".plyr--full-ui").style["min-width"] = "0px";
			this._normalizeRatio();
		}, this));
	},
	$setSize:function(x,y){
		this.$view.firstChild.style.width = x+"px";
		this.$view.firstChild.style.height = (y-2)+"px";
		if (this._player)
			this._normalizeRatio(x, y);
	},
	source_setter:function(value){
		this._waitView.then(function(player){
			if (value)
				player.source = value;
		});
	},
	getPlyr:function(wait){
		return wait ? this._waitView : this._player;
	},
	_gcdRatio:function(x, y){
		x = Math.abs(x);
		y = Math.abs(y);
		while(y) {
			var t = y;
			y = x % y;
			x = t;
		}
		return x;
	},
	_normalizeRatio:function(x, y){
		x = x || this.$view.clientWidth;
		y = y || this.$view.clientHeight;
		var div = this._gcdRatio(x, y),
			ratioX = (x/div).toString(),
			ratioY = (y/div).toString(),
			ratio = ratioX+":"+ratioY;
		
		this._player.ratio = ratio;
	}
}, webix.ui.view, webix.EventSystem);