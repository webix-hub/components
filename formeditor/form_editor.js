webix.i18n.formEditor = {
	removeWarning: "You are going to remove this record. Are you sure?",
	ok:"OK",
	cancel:"Cancel"
};

webix.protoUI({
	name:"subform",
	defaults:{
		borderless:true,
		paddingX:20,
		paddingY:0
	},
	$init:function(){
		this.attachEvent("onChange", function(newv, oldv){
			if(!this.getParentView().getValue){
				var top =  webix.$$(this.config.$editor);
				top.callEvent("onChange", [top.getValues()]);
			}
		});
	},
	$setSize:function(x, y){
		//need only left padding for non-top views
		if(!this.config.scroll)
			x += this.config.paddingX;
		webix.ui.form.prototype.$setSize.call(this, x, y);
	},
	clear:function(){
		webix.ui.form.prototype.clear.call(this);
		for(var i in this.elements)
			if(this.elements[i].clear)
				this.elements[i].clear();
	},
	getValue:function(){
		return this.getValues();
	},
	setValue:function(values){
		this.setValues(values);
	},
}, webix.ui.form);

webix.protoUI({
	name:"subgrid",
	defaults:{ paddingY:2 },
	$init:function(){
		this.$ready.push(function(){
			var grid = this.getChildViews()[0];
			grid.data.attachEvent("onStoreUpdated", webix.bind(function(id, obj, operation){
				if(operation && operation !== "paint")
					this.callEvent("onChange", [arguments, grid]);
			}, this));
		});
	},
	clear:function(){
		this.getChildViews()[0].clearAll();
	},
	getValue:function(){
		return this.getChildViews()[0].serialize();
	},
	setValue:function(values){
		this.getChildViews()[0].parse(values);
	}
}, webix.ui.subform);

webix.protoUI({
	name:"form-editor",
	_resizeMaster:function(view){
		webix.delay(function(){
			if(view.getMasterView){
				var master = view.getMasterView();
				if(master){
					master.data.each(function(obj){
						if(obj.$subopen) master.resizeSubView(obj.id);
					});
					this._resizeMaster(master);
				}
			}
			else if(view.getParentView())
				this._resizeMaster(view.getParentView());
			else
				this.callEvent("onMasterResize", []);
		}, this);
	},
	_resizeSub:function(){
		for(var i=0; i<this._subStorage.length; i++)
			this._subStorage[i].resize();
	},
	_bindSubView:function(view, item){
		var master = view.getMasterView();
		var views = view.getChildViews();
		var self = this;

		for(var i=0; i<views.length; i++){
			var data = item[views[i].config.name] || [];
			if(views[i].setValue){
				views[i].clear();
				views[i].setValue(data);
				views[i].attachEvent("onChange", function(id, obj, operation){
					item[this.config.name] = this.getValue();
					if(operation !=="update")
						self._resizeMaster(this);
				});
				views[i].resize();
			}
		}

		this._subStorage.push(view);
	},
	_getSubView:function(config, subview){
		var self = this;
		
		config.columns[0].template = function(obj, common){
			return common.subrow(obj, common)+ (obj[config.columns[0].id] || "");
		};
		config.subview = { rows:subview, paddingX:20, paddingY:10 };

		config.on = {
			onSubViewCreate:webix.bind(self._bindSubView, this),
			onSubViewOpen:function(){ self._resizeMaster(this); },
			onSubViewClose:function(){ self._resizeMaster(this);},
			onBeforeEditStop:function(obj, config){
				if(config.column ==="id" && obj.old != obj.value){
					this.data.changeId(obj.old, obj.value);
					self._tempItemId = obj.value;
				}
			},
			//changeId needs to be painted first
			onBeforeEditStart:function(obj){
				if(this.getEditor()){
					webix.delay(function(){
						var row = this.getIndexById(obj.row)===-1?self._tempItemId:obj.row;
						this.editCell(row, obj.column);
					}, this);
					return false;
				}
			}
		};
	},
	_getGrid:function(data, name){
		var self = this;
		var grid = { view:"datatable", editable:true, headerRowHeight:34, columns:[], footer:true, scrollX:false, data:data };
		var subview = [];

		for(var i in data[0]){
			if(typeof data[0][i] === "object" ){
				subview.push(this._getTemplate(i));

				if(webix.isArray(data[0][i]))
					subview.push(this._getGrid(data[0][i], i));
				else
					subview.push(this._getForm(data[0][i], i));
			}
			else
				grid.columns.push({ id:i, header:this._getLabel(i), editor:"text", fillspace:1 });
		}

		grid.columns.push({ id:"del", header:"", template:"{common.trashIcon()}", width:35 });
		grid.columns[0].footer = { text:"<span class='webix_icon fa-plus-circle'></span>", colspan:grid.columns.length };

		grid.onClick = {
			"fa-trash":function(e, id){
				webix.confirm({
					text:webix.i18n.formEditor.removeWarning,
					ok:webix.i18n.formEditor.ok,
					cancel:webix.i18n.formEditor.cancel,
					callback:webix.bind(function(res){
						if(res) this.remove(id.row);
					}, this)
				});
			},
			"fa-plus-circle":function(){
				var id = this.add({});
				if(self._isSubView(this))
					self._delayEdit = {view:this, id:id};
				else this.editCell(id);
			}
		};
			
		if(subview.length) this._getSubView(grid, subview);

		var config = { view:"subgrid", rows:[grid], $editor:this.config.id };
		if(name){
			config.name = name;
			config.rows[0].autoheight = true;
		}
		else config.paddingX = 0;

		return config;
	},
	_isSubView:function(view){
		var parent = view.getParentView();
		if(parent && parent.getMasterView)
			return true;
		if(parent) 
			return this._isSubView(parent);
		return false;
	},
	_getForm:function(data, name){
		var config = { view:"subform", elements:[], $editor:this.config.id};
		if(name) config.name = name;
		else {
			config.scroll = true;
			config.paddingX = config.paddingY = 7;
		}
		
		for(var i in data){
			if(typeof data[i] === "object" ){
				config.elements.push(this._getTemplate(i));
				if(webix.isArray(data[i]))
					el = this._getGrid(data[i], i);
				else
					el = this._getForm(data[i], i);
			}
			else
				el = { view:"text", name:i, label:this._getLabel(i), value:data[i] };

			config.elements.push(el);
		}
		return config;
	},
	_getTemplate:function(name){
		return { css:"group_header", autoheight:true, template:this._getLabel(name)};
	},
	_getLabel:function(label){
		return label.charAt(0).toUpperCase() + label.slice(1);
	},
	_getConfig:function(data){
		var config = {};

		if(data && typeof data == "object"){
			if(!webix.isArray(data))
				config = this._getForm(data, null);
			else
				config = this._getGrid(data);
		}

		config.css = "webix_editor_top";
		return config;
	},
	_afterInit:function(){
		this.attachEvent("onMasterResize", function(){
			if(this._delayEdit){
				this._delayEdit.view.editCell(this._delayEdit.id);
				this._delayEdit = null;
			}
		});
	},
	_clean:function(obj){
		var clean;
		if(webix.isArray(obj)){
			for(var i=0; i<obj.length; i++)
				obj[i] = this._clean(obj[i]);
			clean = obj;
		}
		else{
			clean = {};
			for(var i in obj){
				if(i.indexOf("$")===-1){
					if(typeof obj[i] === "object")
						obj[i] = this._clean(obj[i]);
					clean[i] = obj[i];
				}
			}
		}
		return clean;
	},
	$onLoad:function(data, driver){
		this.setValues(data);
		return true;
	},
	$init:function(config){
		this.$view.className += " webix_form_editor";
		this.config.id = config.id;
		config.rows = [{template:"&nbsp;"}];

		this._subStorage = [];
		this.$ready.push(this._afterInit);
	},
	
	getValues:function(){
		return this._clean(this.getChildViews()[0].getValue());
	},
	setValues:function(values){
		webix.ui([this._getConfig(values)], this);
	},
	clear:function(){
		this.getChildViews()[0].clear();
	}
}, webix.AtomDataLoader, webix.ui.layout);