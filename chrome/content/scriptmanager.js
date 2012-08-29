if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	// 读取文件目录的工具类
	window.snippet.ScriptManager = function() {

		var cache = {},
		baseDir, appDir,
		compiler = new snippet.ScriptCompiler();

		 this.checkFolder=function(aDir, fileExt) {
			aDir = aDir? getSubFolder(aDir) : baseDir

			if (aDir.exists() == false) {
				return null;
			}

			if (!fileExt) {
				fileExt = "js"
			}

			var entries = aDir.directoryEntries,
			re = new RegExp("\." + fileExt + "$"),
			array = [];

			while (entries.hasMoreElements()) {
				var entry = entries.getNext();
				entry.QueryInterface(Components.interfaces.nsIFile);
				if (entry.isFile() && re.test(entry.path)) {
					array.push(new snippet.ScriptBean(entry));
				}
			}
			return array;
		}

		this.cleanData = function() {
			for each(var script in cache) {
				if (script.status == - 1) {
					var bid = script.bean.path
					delete cache[bid]
					log("clean %1 ...", bid)
				}
			}
		}

		this.outDate = function() {
			for each(var script in cache) {
				script.status = - 1
			}
		}

		// status==1 新增，需要load
		// status==2 有修改，需要unload和load
		// status==0 没有变化
		// status==-1 删除，需要unload
		this.update = function(beans, type, ext) {
			for each(var bean in beans) {
				var bid = bean.path
				if (!cache[bid]) {
					log("new ---> %1", bean.path)
					compiler.process(bean, ext)
					// create  cache entry
					cache[bid] = {}
					cache[bid].bean = bean
					cache[bid].ext = ext
					cache[bid].type = type
					cache[bid].stamp = bean.lastModifiedTime
					cache[bid].status = 1
					continue
				}
				if (cache[bid].stamp < bean.lastModifiedTime) {
					log("update ---> %1", bean.path)
					compiler.process(bean, ext)
					// update cache entry
					cache[bid].stamp = bean.lastModifiedTime
					cache[bid].bean = bean
					cache[bid].status = 2
					continue
				}
				if (cache[bid].stamp == bean.lastModifiedTime) {
					// no modified
					cache[bid].status = 0
				}

			}
		}

		function getSubFolder(dirname) {
			var folder = baseDir.clone();
			folder.append(dirname)
			return folder
		}


		this.getCache = function() {
			return cache
		}

		baseDir = arguments[0];

	}

	window.snippet.ScriptHelper = function(manager) {

		function getScripts(pattern) {
			var rslt = []
			for each(var elm in manager.getCache()) {
				if (elm.type == pattern && elm.ext == "js") {
					rslt.push(elm)
				}
			}
			return rslt
		}

		this.refresh = function() {
			manager.cleanData()
			manager.outDate()
			var libs = [],
			scripts = [];
			// 编译
			libs = manager.checkFolder("global", "coffee");
			scripts = manager.checkFolder("", "coffee");
			manager.update(libs, "lib", "coffee")
			manager.update(scripts, "script", "coffee")
			// 检查语法
			libs = manager.checkFolder("global", "js");
			scripts = manager.checkFolder("", "js");
			manager.update(libs, "lib", "js")
			manager.update(scripts, "script", "js")
		}

		this.getLibScripts = function() {
			return getScripts("lib")
		}

		this.getScripts = function() {
			return getScripts("script")
		}
	}

}

