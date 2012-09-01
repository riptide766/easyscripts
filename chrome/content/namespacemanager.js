if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	// 脚本导入到命名空间
	window.snippet.NamespacesManager = function NamespacesManager(pos) {
		var cache = {},
		pos = pos ? pos: "";

		this.loadScript = function(aScript, scope, charset) {
			try {
				var sid = aScript.path
				var tmpObj = this.evalScript(aScript, "Global");
				log("loadScript ---> %1", sid)
				for (var key in tmpObj) {
					scope[key] = tmpObj[key]
				}
			} catch(e) {
				log(" NamespacesManager.loadScript ===>%1", e)
			}
		}

		this.loadGlobalKeyScript = function(aScript) {
			var sid = aScript.path
			if (!cache[sid]) {
				cache[sid] = {}
			}
			for each(var key in aScript.getExport()) {
				cache[sid][key] = key
			}
		}

		this.unloadGlobalKeyScript = function(aScript) {
			var sid = aScript.path
			delete cache[sid]
		}

		this.loadAnonymScript = function(aScript, scope, charset) {
			try {
				log("loadAnonymScript ---> %1", aScript.path)
				scope[aScript.name] = this.evalScript(aScript, "Anonym")
			} catch(e) {
				log(" NamespacesManager.loadAnonymScript ===>%1", e)
			}
		}

		this.unloadAnonymScript = function(aScript, scope, charset) {
			try {
				log("unloadAnonymScript ---> %1", aScript.path)
				delete scope[aScript.name]
			} catch(e) {
				log(" NamespacesManager.loadAnonymScript ===>%1", e)
			}
		}

		this.unloadScript = function(aScript, scope, charset) {
			try {
				var tmpObj = this.evalScript(aScript);
				var sid = aScript.path
				log("unloadScript ---> %1", sid)
				for (var key in tmpObj) {
					delete scope[key]
					log("unloadScript:scope ---> %1", key)
				}
			} catch(e) {
				log(" NamespacesManager.unloadScript ===>%1", e)
			}
		}

		this.extAnonym = function(code) {
			for each(var subcache in cache) {
				for (var key in subcache) {
					if (/easyscript\_.*/.test(key)) {
						var shortKey = key.split("_")[1]
						var re = new RegExp("([^[0-9a-zA-Z\s\_])" + shortKey + "([^0-9a-zA-Z\s\_])", "g")
						code = code.replace(re, "$1" + pos + key + "$2")
					}
				}
			}
			return code
		}

		this.extGlobal = function(code) {
			for each(var subcache in cache) {
				for (var key in subcache) {
					key = key.trim()
					var re = new RegExp("([^0-9a-zA-Z\_])" + key + "([\.\[])", "gm")
					code = code.replace(re, "$1" + pos + key + "$2")
				}
			}
			return code
		}

		this.evalScript = function(bean, type) {
			try {
				var code = bean.getScript();
				if (type) {
					code = this["ext" + type](code)
				}
				return eval(code);
			} catch(e) {
				log(" NamespacesManager.evalScrnsmngeript ===>%1", e)
			}
		}

		this.getCache = function() {
			return cache
		}

		this.clearCache = function() {
			cache = {}
		}
	}

	window.snippet.NamespacesHelper = function(manager) {

		function process(type, aScriptWapper, scope, charset) {
			var method_load = "load" + type + "Script",
			method_unload = "unload" + type + "Script";

			switch (aScriptWapper.status) {
			case 0:
				break;
			case 1:
				manager[method_load](aScriptWapper.bean, scope, charset)
				break;
			case 2:
				manager[method_unload](aScriptWapper.bean, scope, charset)
				manager[method_load](aScriptWapper.bean, scope, charset)
				break;
			case - 1: manager[method_unload](aScriptWapper.bean, scope, charset)
				break;
			}
		}
		this.processGlobal = function(aScriptWapper, scope, charset) {
			process("", aScriptWapper, scope, charset)
		}

		this.processAnonym = function(aScriptWapper, scope, charset) {
			process("Anonym", aScriptWapper, scope, charset)
		}

		this.processGlobalKey = function(aScriptWapper, scope, charset) {
			process("GlobalKey", aScriptWapper, scope, charset)
		}

	}
}

