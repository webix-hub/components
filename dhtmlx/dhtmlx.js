if (window.dhtmlx){

	if (!dhtmlx.attaches)
		dhtmlx.attaches = {};
		
	dhtmlx.attaches.attachWebix=function(conf){
		var obj = document.createElement("DIV");
		obj.id = "webix_"+webix.uid();
		obj.style.width = "100%";
		obj.style.height = "100%";
		obj.cmp = "grid";

		document.body.appendChild(obj);
		this.attachObject(obj.id);
		
		conf.container = obj.id;
		conf.borderless = true;
		
		var that = this.vs[this.av];
		that.grid = webix.ui(conf);
		
		that.gridId = obj.id;
		that.gridObj = obj;
			
		that.grid.setSizes = function(){
			if (this.resize) this.resize();
			else this.render();
		};
		
		var method_name="_viewRestore";
		return this.vs[this[method_name]()].grid;
	};

}