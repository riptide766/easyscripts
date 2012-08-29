// 显示界面

if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	window.snippet.Menus = function Menus(scopes) {
		var _scope = this;
		var content = ""
		init(function(rootItem) {
			for each(var scope in scopes) {
				for (var key in scope.__customMenus) {
					try {
						rootItem.create(scope.__customMenus[key], scope[key])
					} catch(e) {
						log(" Menu.init ===>%1", e)
					}
				}
			}
		});

		function init(customFn) {
			var rootItem = new MenuItem("选择操作，输入编号  (*号是菜单) ")
			if (customFn) {
				customFn.call(_scope, rootItem)
			}
			rootItem.process()
		}

		function MenuItem(desc) {
			Item.call(this, desc, promptProcessor)
			this.register = function(item) {
				this.setItem(item)
				return item;
			}
		}

		function Item(desc, processor) {
			this.items = [];
			this.processor = processor;
			this.setItem = function(item) {
				this.items.push(item)
			}

			this.getDesc = function() {
				return desc
			}

			this.process = function() {
				try {
					if (typeof this.processor == "function") {
						this.processor()
					} else if (typeof this.processor == "object") {
						this.processor.process.apply(this.processor)
					}
				} catch(e) {
					log(" Menu.init ===>%1", e)
				}
			}

			this.getLineString = function() {
				var status = this.items.length == 0 ? "": " * "
				return this.getDesc() + status;
			}

			this.getPrettyString = function() {
				var content = this.getDesc() + "\n\n";
				for (var i = 0; i <= this.items.length - 1; i++) {
					var str = this.items[i].getLineString();
					content += (i + 1 + " " + str + "\n")
				}
				return content;
			}

			this.indexOf = function(menu) {
				for (var i = 0; i <= this.items.length - 1; i++) {
					if (this.items[i].getDesc() == menu) {
						return i;
					}
				}
				return - 1
			}

			this.create = function(menuStr, processor) {
				var menus = menuStr.split('.'),
				endFlg = (menus.length == 1),
				menu = menus[0]

				if (endFlg == true) {
					this.setItem(new Item(menu, processor))
				} else {
					var index = this.indexOf(menu);
					if (index == - 1) {
						this.setItem(new MenuItem(menu))
						index = this.items.length - 1;
					}
					this.items[index].create(menus.slice(1).join('.'), processor)
				}
			}
		}

		function prompt2(arg) {
			window.openDialog('chrome://snippet/content/prompt.xul', '_blank', 'chrome, dialog, modal', arg).focus();
			return arg.cid
		}

		function promptProcessor() {
			var input = prompt2({
				list: this.getPrettyString(),
				cols: 3
			})
			input = input ? input.trim() : input;
			if (this.items[input - 1]) {
				this.items[input - 1].process();
			}
		}
	}
}

