Snippet.ns.prompt = {

	number: "",

	timer: null,

	getArgs: function(key) {
		return window.arguments[0][key];
	},

	init: function() {
		this.initSnippetList();
		this.initShortKey();
		window.innerHeight = Snippet.lib.$("container").clientHeight
		window.innerWidth = Snippet.lib.$("container").clientWidth
	},

	Timer: function(fn, itv) {
		this.stop = function() {
			clearTimeout(this.tid)
		}
		this.start = function() {
			this.tid = setTimeout(fn, 500)
		}
		return this;
	},

	handleEvent: function(e) {
		var tagName = e.target.tagName;
		if (e.ctrlKey && e.keyCode == '68') {
			return Snippet.lib.$("inputbox").focus();
		}
		if (tagName == "button") {
			// 应该是取数字编号作为返回。但为什么呢？ 我已经忘记了，这就是为什么要写注释了!
			return this.closeDialog(e.target.label.match(/^\d*\s/)[0].trim())
		}
		if (tagName = "textbox" && e.keyCode == 13) {
			return this.closeDialog(e.target.value)
		}
		if (e.ctrlKey == false && e.altKey == false && e.shiftKey == false && e.keyCode <= 57 && e.keyCode >= 48) {
			this.number += String.fromCharCode(e.keyCode);
			if (this.timer != null) {
				this.timer.stop()
			}
			document.title = this.number;
			this.timer = new this.Timer((function(ref) {
				return function() {
					ref.closeDialog(ref.number)
				}
			} (this)))
			this.timer.start()
			return;
		}
		if (this.timer) {
			document.title = this.number = ""
			this.timer.stop()
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

