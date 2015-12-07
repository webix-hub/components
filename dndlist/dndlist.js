/*
 * Webix Component "dndlist"
 * Version 1.0 
 * By Muhammad Lukman Nasaruddin (https://github.com/MLukman/webix-components) 
 *
 * Requires Webix >= 3.1.1 
 */  
webix.protoUI({
	name: "dndlist",
	defaults: {
		label: "",
		labelWidth: 80,
		height: 200,
		choicesHeader: "Choices",
		valueHeader: "Selected",
		choices: [],
		value: [],
		swap: false
	},
	$formElement: true,
	$init: function (cfg) {
		var dnd = this;
		config = webix.extend(this.defaults, cfg, true);
		var dtCommon = {view: "datatable", scrollX: false, drag: true};
		var value = [];
		for (var i = 0; i < config.value.length; i++) {
			value.push({value: config.value[i]});
		}
		var choicesDt = webix.extend(webix.copy(dtCommon), {
			id: 'choices',
			columns: [
				{
					id: "value",
					header: {
						text: config.choicesHeader,
						colspan: 2
					},
					fillspace: true
				},
				{
					id: "_actions",
					header: "&nbsp;",
					width: 35,
					template: function (row) {
						return "<span  style=' cursor:pointer;' class='webix_icon fa-plus-square'></span>";
					}
				}
			],
			onClick: {
				'fa-plus-square': function (e, i) {
					var row = this.getItem(i.row);
					dnd.addValue(row.value);
				}
			},
			on: {
				onItemDblClick: function (id) {
					dnd.addValue(this.getItem(id).value);
				}
			}
		}, true);
		var valueDt = webix.extend(webix.copy(dtCommon), {
			id: 'value',
			columns: [
				{
					id: "value",
					header: {
						text: config.valueHeader,
						colspan: 2
					},
					fillspace: true
				},
				{
					id: "_actions",
					header: "&nbsp;",
					width: 35,
					template: function (row) {
						return "<span  style=' cursor:pointer;' class='webix_icon fa-minus-square'></span>";
					}
				}
			],
			onClick: {
				'fa-minus-square': function (e, i) {
					var row = this.getItem(i.row);
					dnd.removeValue(row.value);
				}
			},
			on: {
				onItemDblClick: function (id) {
					dnd.removeValue(this.getItem(id).value);
				}
			}
		}, true);

		var spacer = {view: 'spacer', width: 10};
		var cols = {cols: (config.swap ? [valueDt, spacer, choicesDt] : [choicesDt, spacer, valueDt])};
		var label = (config.label != "" ?
				{id: 'label', view: 'label', label: config.label, width: config.labelWidth, align: config.labelAlign} :
				{width: 1, height: 1});
		if (config.labelPosition === 'top') {
			config.rows = [
				label,
				cols
			];
		} else {
			label.css = {padding: "1px 7.5px 0px 0px"};
			config.cols = [
				{
					rows: [label]
				},
				cols
			];
		}

		this.$ready.push(function () {
			this.setValue(config.value);
			this.setChoices(config.choices);
		});
	},
	setChoices: function (choices) {
		var choicesDt = this.$$('choices');
		choicesDt.clearAll();
		var values = this.getValue();
		for (var i = 0; i < choices.length; i++) {
			if (values.indexOf(choices[i]) === -1) {
				choicesDt.add({value: choices[i]});
			}
		}
	},
	setValue: function (values) {
		var existVal = this.getValue();
		for (var i = 0; i < existVal.length; i++) {
			if (values.indexOf(existVal[i]) === -1) {
				this.removeValue(existVal[i]);
			}
		}
		for (var j = 0; j < values.length; j++) {
			this.addValue(values[j]);
		}
	},
	getValue: function () {
		var value = [];
		var valueDt = this.$$('value');
		valueDt.eachRow(function (row) {
			value.push(valueDt.getItem(row).value);
		}, true);
		return value;
	},
	addValue: function (value) {
		var valueDt = this.$$('value');
		var choicesDt = this.$$('choices');
		var rowFinder = (function (row) {
			return row.value === value;
		});
		if (valueDt.find(rowFinder, true) == false) {
			valueDt.add({value: value});
		}
		var choices = choicesDt.find(rowFinder);
		for (var i = 0; i < choices.length; i++) {
			choicesDt.remove(choices[i].id);
		}
	},
	removeValue: function (val) {
		var valueDt = this.$$('value');
		var choicesDt = this.$$('choices');
		var rowFinder = (function (row) {
			return row.value === val;
		});
		var value = valueDt.find(rowFinder);
		if (value.length === 0) {
			return;
		}
		for (var i = 0; i < value.length; i++) {
			valueDt.remove(value[i].id);
		}
		if (choicesDt.find(rowFinder, true) == false) {
			choicesDt.add({value: val});
		}
	}
}, webix.IdSpace, webix.ui.layout);
