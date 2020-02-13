webix.protoUI({
	name:"konva",
	$init:function(){
		this._waitStage = webix.promise.defer();
		this.$ready.push(this.render);
	},
	render:function(){

		if(this.config.cdn == false){
			webix.delay(this._initStage, this);
			return;
		}

		var cdn = this.config.cdn ? this.config.cdn : "https://unpkg.com/konva@4.0.13";
		webix.require([
			cdn+"/konva.min.js"
		])
		.then( webix.bind(this._initStage, this) )
		.catch(function(e){
			console.log(e)
		});
	},
	_initStage:function(){
		this._stage = new Konva.Stage({
			container: this.$view
		});
		this._waitStage.resolve(this._stage);

		if (this.config.ready)
			this.config.ready.call(this, this._stage);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x,y)){
			this._waitStage.then(function(stage){
				stage.size({ width:x, height:y });
			});
		}
	},
	getStage:function(waitStage){
		return waitStage?this._waitStage:this._stage;
	}
}, webix.ui.view);