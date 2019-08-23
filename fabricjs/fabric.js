webix.protoUI({
	name: "fabric",
	$init: function() {
		this.getIframe().style.position = "absolute";
		this._waitCanvas = webix.promise.defer();
		this.$ready.push(this.render);
	},
	render: function() {
		if (this.config.cdn === false) {
			webix.delay(this._initCanvas, this);
			return;
		}
		var cdn = this.config.cdn ? this.config.cdn : "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/3.4.0";
		webix.require([cdn + "/fabric.min.js"])
			.then(webix.bind(this._initCanvas, this))
			.catch(function(e) {
				console.log(e);
			});
	},
	_initCanvas: function() {
		var elm = document.createElement("canvas");
		elm.id = this.config.canvas;
		this._canvas = this.$view.appendChild(elm);
		this._canvas = new fabric.Canvas(this._canvas, {
			renderOnAddRemove: false,
			selection: false,
			preserveObjectStacking: true
		});
		this._waitCanvas.resolve(this._canvas);
		if (this.config.ready) this.config.ready.call(this, this._canvas);
	},
	$setSize: function(x, y) {
		webix.ui.view.prototype.$setSize.call(this, x, y);
		this._waitCanvas.then(_ => {
			var de = this.getWindow().document.documentElement;
			this._canvas.setWidth(de.clientWidth);
			this._canvas.setHeight(de.clientHeight);
		});
	},
	getCanvas: function(waitCanvas) {
		return waitCanvas ? this._waitCanvas : this._canvas;
	}
}, webix.ui.iframe);
