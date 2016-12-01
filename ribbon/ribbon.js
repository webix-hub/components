webix.protoUI({
	name:"ribbon",
	defaults:{
		type:"line"
	},
	$init:function(config){
		if(config.tabs && config.tabs.length) config.cols = [this._getTabview(config.tabs)];
		else if (config.items && config.items.length) webix.extend(config, this._getItems(config.items, "cols", true), true);

		this.$view.className += " webix_ribbon";
		this.$ready.push(this._setActions);
	},
	tabs_setter:function(value){},
	items_setter:function(value){},
	_setActions:function(){
		this.attachEvent("onItemClick", function(){
			var view = this.$eventSource;
			if(view.name == "button" || view.name == "icon")
				this.callEvent("onAction", [view.config.name, view.config.value]);
		});
		this.attachEvent("onChange", function(newv, oldv){
			var view  = this.$eventSource;
			this.callEvent("onAction", [view.config.name, newv, oldv]);
		});
	},
	_getTabview:function(tabs){
		var config = { view:"tabview", cells: [], tabbar:{optionWidth:100}, multiview:{fitBiggest:true} };
		for(var i = 0; i<tabs.length; i++){
			config.cells.push({
				header:tabs[i].header, body:this._getItems(tabs[i].items, "cols", true)
			});
		}
		return config;
	},
	_getItems:function(items, layout, spacer){
		var config = {}, elements = [];
		if(items && items.length){
			for(var i = 0; i<items.length; i++){
				var item;
				if(items[i].type ==="block"){
					item = { rows: [this._getItems(items[i].cols || items[i].rows, items[i].cols?"cols":"rows")],
						margin:5, padding:5, width:items[i].width || 0};

					var label = items[i].header?{ view:"label", label:items[i].header, height:20}:"";
					if(label){
						if(items[i].headerPosition=== "bottom"){
							item.rows.push({});
							item.rows.push(label);
						}
						else
							item.rows.unshift(label);
					}
				}
				else
					item = items[i];
				elements.push(item);
			}
			if(spacer) elements.push({css:"webix_ribbon_filler", borderless:false});
			config[layout] = elements;
			config.type="line";
			config.borderless = true;
		}
		return config;
	},
	showItem:function(name){ this.elements[name].show(name); },
	hideItem:function(name){ this.elements[name].hide(); },
	enableItem:function(name){ this.elements[name].enable(); },
	disableItem:function(name){ this.elements[name].disable(); }
}, webix.ui.toolbar);