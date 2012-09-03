if (!window.snippet) {
	window.snippet = {}
}

/**
 *  Easyscript的主程序
 *
 * */

window.snippet.core = function(evt) {
	with(window.snippet.lib) {

		this.popup = function() {
			if (!snippet.__init) {
				return alert("还没有初始化完成")
			}
			
			initialize()

			// 启动菜单界面
			new snippet.Menus(snippet.anonymousscopes)

		}

		function initialize() {
			if (!snippet.__init) {
				var list = [new snippet.JsCompiler(), new snippet.CoffeeCompiler()]
				var compileHelper = new snippet.ScriptCompileHelper(list)

				snippet.scriptmnger = new snippet.ScriptManager(getScriptDir());
				snippet.scriptmnger.setCompiler(compileHelper)

				snippet.scriptHelper = new snippet.ScriptHelper(snippet.scriptmnger);
				snippet.nsHelper = new snippet.NamespacesHelper(new snippet.NamespacesManager("snippet.global."))

				snippet.global = {}
				snippet.anonymousscopes = {}

				snippet.main = this
				snippet.__init = true;
			}

			// 检测脚本目录的状况（新增、修改、删除）
			// 标记到数据库
			// 并清除上一批的无效数据
			snippet.scriptHelper.refresh();

			var libs = snippet.scriptHelper.getLibScripts(),
			scripts = snippet.scriptHelper.getScripts();

			// 将工具对象导入到全局命名空间window下
			for each(var script in libs) {
				snippet.nsHelper.processGlobalKey(script)
			}
			for each(var script in libs) {
				snippet.nsHelper.processGlobal(script, snippet.global)
			}

			// 将菜单脚本对象导入命名空间snippet.anonymousscopes下
			for each(var script in scripts) {
				snippet.nsHelper.processAnonym(script, snippet.anonymousscopes)
			}

		}

		function getScriptDir() {
			var dir, file;
			dir = getpref("script_dir", "Home,easyscripts").split(",")
			if (dir.length == 1) {
				file = getfile(dir[0])
			}
			if (dir.length > 1) {
				file = getfile(dir[0], dir.slice(1));
			}
			if (!file || file.isDirectory()) {
				return file
			}
			err(new snippet.CommonErrorParser("没有发现有效的脚本目录"))
		}

		initialize()
	}
}

(function() {
	var initializeprocess = {
		run: function() {
			new snippet.core()
		}
	}
	snippet.lib.background(initializeprocess)
} ())

