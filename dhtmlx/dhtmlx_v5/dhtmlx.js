if (typeof(window.dhtmlXCellObject) != "undefined") {

	dhtmlXCellObject.prototype.attachWebix = function(conf) {

	this.callEvent("_onBeforeContentAttach",["webix"]);

	var obj = document.createElement("DIV");
	var id = "webix_" + webix.uid();
	obj.id = id;
	obj.style.width = "100%";
	obj.style.height = "100%";
	obj.style.position = "relative";
	obj.style.overflow = "hidden";

	this._attachObject(obj);

	this.dataType = "grid";
	conf.container = id;
	this.dataObj = new webix.ui(conf);

	// fix layout cell for material
	if (this.conf.skin == "material" && typeof(window.dhtmlXLayoutCell) == "function" && this instanceof window.dhtmlXLayoutCell) {
	this.cell.childNodes[this.conf.idx.cont].style.overflow = "hidden";
	}

	obj = null;

	this.callEvent("_onContentAttach",[]);

	return this.dataObj;
	};
}