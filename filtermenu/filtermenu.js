webix.ui.datafilter.filterMenu = {
	getValue: function(node) {
		if (node.getValue) {
			return node.getValue();
		}
	},
	setValue: function(){},
	refresh: function(datatable, node, column){
		var menuConfig = column.menuConf;
		var menu = menuConfig.menu;

		datatable.registerFilter(menuConfig.filterInput, column, this);

		webix.event(node, 'change', function (e) {});
		webix.event(node, 'click', function (e) {
			var button = document.getElementById(menuConfig.buttonID);
			if (e.target === button || button.contains(e.target)) {
				if (menu.isVisible()) {
					menu.hide();
				}
				else {
					menu.show(button.id);
				}
			}
		});
	},
	render:function(datatable, column){
		var menuConfig = this.$init(datatable, column);
		var button = '<div id="'+menuConfig.buttonID+'" style="float: right; width: 20px; height: 100%; text-align: center;"><i class="fa fa-arrow-down"></i></div>';
		var label = '<div style="margin-right: 25px;">'+menuConfig.label+'</div>';
		var html = button + label;
		return html;
	},
	/*
	 * Sets default config values for column menu, and creates it.
	 * @param {Webix-object} datatable - datatable object
	 * @param {Webix-object} column - related column object
	 * @returns {Object} configuration of filterMenu
	 */
	$init: function (datatable, column) {
		var menuConfig = column.menuConf = column.menuConf || {};
		var menuData = column.commonFilterMenuData = datatable.commonFilterMenuData = datatable.commonFilterMenuData || {};
		menuConfig.label = menuConfig.label || column.text || column.columnId;
		if (!webix.isArray(menuConfig.sortingFuncs) || !menuConfig.sortingFuncs.length) {
			menuConfig.sortingFuncs = [{name: 'Sort alphabetically', algorithm: 'string'}];
		}
		menuConfig.buttonID = datatable.config.id+"_"+column.columnId+'_filterMenuBtn';
		menuData.icons = menuData.icons || {};
		menuData.icons.checked = menuData.icons.checked || "check-square-o";
		menuData.icons.unchecked = menuData.icons.unchecked || "square-o";
		if (!menuConfig.menu || typeof menuConfig.menu !== 'object') {
			this._createColumnMenu(datatable, column);
		}
		return menuConfig;
	},
	/*
	 * Creates columns context menu.
	 * @param {Webix-object} datatable - datatable for which the menu is created
	 * @param {Webix-object} column - column for which the menu is created
	 * @returns {Webix-object} - column menu
	 */
	 _createColumnMenu: function (datatable, column) {
	 	var menuConfig = column.menuConf;
	 	var inputID = datatable.config.id+"_"+column.columnId+'_filterMenuInput';
	 	var isListHidden;
	 	var sortingFuncs = this._parseSortFuncList(menuConfig.sortingFuncs);
	 	if (!sortingFuncs) {
	 		isListHidden = true;
	 	}
	 	menuConfig.menu = webix.ui({
	 		view:"popup",
	 		width: 400,
	 		body: {
	 			view: "toolbar",
	 			borderless: true,
	 			type: 'clean',
	 			rows:[
	 				{
	 					view: 'list',
	 					autoheight:true,
	 					hidden: isListHidden,
	 					css: 'header_menu_sortingList',
	 					data: sortingFuncs,
	 					template: function (item) {
	 						var directionIcons = {
	 							asc: '<i class="fa fa-arrow-up"></i>',
	 							desc: '<i class="fa fa-arrow-down"></i>',
	 						};
	 						return '<div style="float: right; width: 20px;">'+directionIcons[item.direction]+'</div><div style="margin-right: 20px;">'+item.name+'</div>';
	 					},
	 					on: {
	 						onItemClick: function (id, ev, node) {
	 							if (this.isSelected(id)) return;
	 							var sortingFunction = this.getItem(id);
	 							datatable.sort('#'+column.columnId+'#', sortingFunction.direction, sortingFunction.algorithm);
	 						},
	 					},
	 					ready: function () {
	 						var list = this;
	 						// When sorting function applied to datatable - select the appropriate menu item:
	 						datatable.attachEvent('onAfterSort', function (sortingColumn, sortingDir, sortingFunc) {
	 							list.unselectAll();
	 							if (sortingColumn !== column.columnId)
	 								return;
	 							var item = list.find(function (item) {
	 								if (item.direction === sortingDir && item.algorithm === sortingFunc) {
	 									return true;
	 								}
	 							})[0];
	 							if (item) {
	 								list.select(item.id);
	 							}
	 						});
	 					}
	 				},
	 				{
						view: "text",
						id: inputID,
						on: {
							onTimedKeyPress: function () {
								datatable.filterByAll();
							}
						},
					},
	 				{
	 					view: "menu",
	 					subMenuPos:"right",
	 					autoheight:true,
	 					layout:"y",
	 					type: {
	 						subsign: true
	 					},
	 					data: [
	 						{
	 							value: "Columns",
	 							submenu: this._getColumnsSubmenu(datatable),
	 						}
	 					],
	 				}
	 			]
	 		},
	 	});
	 	menuConfig.filterInput = $$(inputID);
	 	return menuConfig.menu;
	 },
	/*
	 * If submenu is already exists - returns it, else - creates new.
	 * @param {Webix-object} datatable - datatable
	 * @returns {Webix-object} - column submenu
	 */
	_getColumnsSubmenu: function (datatable) {
		var menuData = datatable.commonFilterMenuData;
		if (!menuData.columns_submenu) {
			var columnList = datatable.config.columns;
			var icon;
			var i;
			var len;
			var submenuData = [];
			for (i=0, len=columnList.length; i < len; i++) {
				icon = datatable.isColumnVisible(columnList[i].id) ? menuData.icons.checked : menuData.icons.unchecked;
				submenuData.push({
					'id': columnList[i].id,
					'value': columnList[i].id,
					'icon': icon,
				});
			}
			menuData.columns_submenu = webix.ui({
				view: 'submenu',
				data: submenuData,
		        on: {
					onItemClick: function (id) {
						if (datatable.isColumnVisible(id)) {
							datatable.hideColumn(id);
							this.getItem(id).icon = menuData.icons.unchecked;
						}
						else {
							datatable.showColumn(id);
							this.getItem(id).icon = menuData.icons.checked;
						}
					},
					onBeforeShow: function () {
						this.refresh();
					}
				}
			});
		}
		return menuData.columns_submenu;
	},
	/*
	 * Checks functions list for errors, parses it and adds missing options and items of list
	 * @param {Array} sortList - list of sorting functions
	 * @returns {Array|null} - modified list of sorting functions, or null if it isn't exists.
	 */
	_parseSortFuncList: function (sortList) {
		if (!webix.isArray(sortList) || !sortList.length) {
			return null;
		}
		var i, sortingFunction;
		for (i=0; i < sortList.length; i++) {
			sortingFunction = sortList[i];
			if (!sortingFunction.algorithm)
				throw new Error('undefined sorting algorithm method');
			if (!sortingFunction.name)
				throw new Error('undefined sorting algorithm name');
			// If direction property isn't specified - set it to 'asc',
			// dublicate sorting function and set it's direction as 'desc' (reversed)
			if (!sortingFunction.direction) {
				sortingFunction.direction = 'asc';
				sortList.splice(i+1, 0, {
					name: sortingFunction.name,
					algorithm: sortingFunction.algorithm,
					direction: 'desc',
				});
				i++;
			}
		}
		return sortList;
	}
};
