Snippet.ns.prompt = {

	getArgs: function(key) {
		return window.arguments[0][key];
	},

	init: function() {
		this.initSnippetList();
		this.initShortKey();
		window.innerHeight = Snippet.lib.$("container").clientHeight
		window.innerWidth = Snippet.lib.$("container").clientWidth
	},

	handleEvent: function(e) {
		var tagName = e.target.tagName;
		var key = String.fromCharCode(e.keyCode);
		if (e.ctrlKey && e.keyCode == '68') {
			Snippet.lib.$("inputbox").focus();
		} else if (tagName == "button") {
			this.closeDialog(e.target.label.match(/^\d*\s/)[0].trim())

		} else if (tagName = "textbox" && e.keyCode == 13) {
			this.closeDialog(e.target.value)
		}
	},

	closeDialog: function(arg) {
		window.arguments[0].cid = arg
		window.close();
	},

	initShortKey: function(e) {
		window.addEventListener("keydown", this);
		window.addEventListener("click", this);
	},

	initSnippetList: function() {
		var colNums = this.getArgs("cols") || 2;
		var list = this.getArgs("list").split("\n")
		list = list.filter(function(cmd) {
			return /^\d*\s.*/.test(cmd)
		})

		var rows = Math.ceil(list.length / colNums)
		for (var i = 0; i <= colNums - 1; i++) {
			var box = this.addBox("vbox", "snippet_list");
			for (var j = i * rows; j < (i + 1) * rows; j++) {
				this.addButton(box, list[j])
			}
		}
	},

	addButton: function(box, label) {
		Snippet.lib.$("button", box, {
			label: label || "",
			disable: label == null
		})
	},

	addBox: function(type, id) {
		return Snippet.lib.$(type, id)
	}
}

