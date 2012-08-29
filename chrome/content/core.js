if (!window.snippet) {
	window.snippet = {}
}

/**
 *  Easyscript的主程序
 *
 * */

window.snippet.core = function(evt) {
	with(window.snippet.lib) {

		function startup() {

			// 设置全局对象
			initialized();

			// 检测脚本目录的状况（新增、修改、删除）
			// 标记到数据库
			// 并清除上一批的无效数据
			snippet.scriptHelper.refresh();

			var libs = snippet.scriptHelper.getLibScripts(),
			scripts = snippet.scriptHelper.getScripts();

			// 将工具对象导入到全局命名空间window下
			for each(var script in libs) {
				snippet.nsHelper.processGlobal(script, window)
			}

			// 将菜单脚本对象导入命名空间snippet.anonymousscopes下
			for each(var script in scripts) {
				snippet.nsHelper.processAnonym(script, snippet.anonymousscopes)
			}

			// 启动菜单界面
			new snippet.Menus(snippet.anonymousscopes)

		}

		function initialized() {
			if (!snippet.__init) {
				snippet.__init = true;
				snippet.scriptmnger = new snippet.ScriptManager(getScriptDir());
				snippet.scriptHelper = new snippet.ScriptHelper(snippet.scriptmnger);
				snippet.nsHelper = new snippet.NamespacesHelper(new snippet.NamespacesManager())
				snippet.anonymousscopes = {}
			}

		}

		function getScriptDir(){
			var dir = getpref("script_dir","Home,easyscripts").split(","),file;
			if(dir.length==1){
				file = getfile(dir[0])
			}
			if(dir.length>1){
				file = getfile(dir[0],dir.slice(1));
			}
			if (file.isDirectory()){
				return file
			}
			// TODO throw error
		
		}

		startup()
	}
}

