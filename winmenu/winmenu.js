webix.protoUI({
	name:"winmenu",
	$init:function(){
		this.$view.className += " webix_winmenu";
		this.attachEvent("onBeforeRender", function(data){
			this._defineCounts(data);
		});
	},
	_defineCounts:function(data){
		var first = data.getItem(data.getFirstId());
		
		if(!first.x||!first.y)
			var count = data.count();
		else{
			var count = 0;
			data.each(function(obj){
				//webix.assert(obj.x, "X  and Y should be set for each item");
				count+=obj.height*obj.width ||1;
			});
		}
		
		if(this.config.xCount && this.config.yCount){
			var xCount = this.config.xCount;
			var yCount = this.config.yCount;
		}
		else{
			var xCount = this.config.xCount = Math.round(Math.sqrt(2*count/3));
			var yCount = this.config.yCount = Math.ceil(count/this.config.xCount);
		}

		if(!first.x||!first.y){
			/*X and Y are counted as if each item takes one square, current width and height will be ignored and set to 1
			  if a person want's to use custom width || height > 1, x&y must as well be provided*/ 
			
			var message = false;  	
			var freeX = xCount-1;  // number of free squares to the right
			var freeY = yCount-1;  // number of free squares downwards

			data.each(function(obj){
				obj.x = xCount-freeX;
				obj.y = yCount-freeY; 
				if(obj.width>1||obj.height>1){
					message = true;
				}
				// something if x and y already exist
				obj.width = 1; 
				obj.height = 1;
				freeX--;
				if(freeX<0){
					freeX = xCount-1; 
					freeY--;
				}
				if(freeY<0)
					freeY = yCount-1;
			});

			//webix.assert(!message, "<b>Width</b> and <b>height</b> for some item(s) were changed to <b>1</b>! To avoid this, set X and Y parameters to each of your data items");
		}
	},
	defaults:{
		scroll:false,
		xCount : 4,
		yCount : 4,
		margin : 5
	},
	type:{
		template:function(obj){
			return "<img src='"+obj.img+"' align='center'><div>"+obj.value+"</div>";
		},
		classname:function(obj, common, marks){
			var css = "webix_winmenu_item";
			if (common.css) css +=common.css+" ";
			if (obj.$css) css +=obj.$css+" ";
			if (marks && marks.$css) css +=marks.$css+" ";
			
			return css;
		},
		sizeTemplate:function(obj, common){
			var left = common.lefts[obj.x-1];
			var top = common.tops[obj.y-1];

			var objwidth = (obj.width || 1)-1;
			var width = objwidth * common.margin;

			for (var i=-1; i<objwidth; i++)
				width += common.widths[obj.x+i];

			var objheight = (obj.height || 1)-1;
			var height = objheight * common.margin;			
			for (var i=-1; i<objheight; i++)
				height += common.heights[obj.y+i];
			
			return "left:"+left+"px; top:"+top+"px; width:"+width+"px; height:"+height+"px;";
		},
		templateStart:function(obj, common, marks){
			var style = common.sizeTemplate(obj, common);
			var css = common.classname(obj, common, marks);
			var color = "background-color:"+(obj.color||"#e2ffff")+";";
			return "<div webix_l_id='"+obj.id+"' class='"+css+"' style='overflow:hidden;"+style+color+"'>";
		},
		templateEnd:webix.template("</div>") 
	},
	render:function(){
		if (!this.type.lefts) return;
		return webix.ui.list.prototype.render.apply(this, arguments);
	},
	$getSize:function(dx, dy){
		return webix.ui.view.prototype.$getSize.call(this, dx, dy);		
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){

			var yCount = this.config.yCount;
			var xCount = this.config.xCount;

			var height = this.$height - (yCount - 1) * this.config.margin;
			var width = this.$width - (xCount - 1) * this.config.margin;

			this.type.heights = [];
			this.type.widths = [];
			this.type.lefts = [0];
			this.type.tops = [0];
			this.type.margin = this.config.margin;

			for (var i=0; i<xCount; i++){
				var dx = this.type.widths[i] = Math.round(width/(xCount - i));
				this.type.lefts[i+1] = this.type.lefts[i] + dx + this.config.margin;
				width -= dx;
			}

			for (var i=0; i<yCount; i++){
				var dy = this.type.heights[i] = Math.round(height/(yCount - i));
				this.type.tops[i+1] = this.type.tops[i] + this.type.heights[i] + this.config.margin;
				height -= dy;
			}

			this.render();
		}
	},
}, webix.ui.list);