webix.protoUI({
	name:"mercury-editor",
	$init:function(){
		var path = webix.codebase+"mercury/editor.html";
		this.$view.innerHTML="<iframe name='webix_mercury' style='width:100%; height:100%;' frameborder='0' src='"+path+"'></iframe>";
	},
	value_setter:function(value){
		this.setValue(value);
	},
	setValue:function(value){
		try {
			this._getContentDiv().innerHTML = value;
			this._getMercury().trigger('reinitialize');
			this._getContentDiv().focus();
			this._temp_value = null;
		} catch(e){
			this._temp_value = value;
			webix.delay(this.setValue, this, [value], 100);
		}
	},
	getValue:function(){
		return this._temp_value || this._getContentDiv().innerHTML;
	},
	focus:function(){	
	},
	_getMercury:function(){
		return this.$view.firstChild.contentWindow.Mercury;
	},
	_getContentDiv:function(){
		return this.$view.firstChild.contentWindow.frames[0].document.getElementById('webix_content');
	}
}, webix.ui.view);