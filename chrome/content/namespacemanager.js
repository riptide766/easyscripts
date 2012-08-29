if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	// 脚本导入到命名空间
	window.snippet.NamespacesManager = function NamespacesManager(flg) {
		var cache = {}

		this.loadScript = function(aScript, scope, charset) {
			try {
				log("loadScript ---> %1", aScript.path)
				var tmpObj = this.evalScript(aScript);
				for (var key in tmpObj) {
					scope[key] = tmpObj[key]
					cache[key] = key
				}
			} catch(e) {
				log(" NamespacesManager.loadScript ===>%1", e)
			}
		}

		this.loadAnonymScript = function(aScript, scope, charset) {
			try {
				log("loadAnonymScript ---> %1", aScript.path)
				scope[aScript.name] = this.evalScript(aScript, true)
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
				log("unloadScript ---> %1", aScript.path)
				var tmpObj = this.evalScript(aScript);
				for (var key in tmpObj) {
					delete scope[key]
					cache = {}
					log("unloadScript:scope ---> %1", key)
				}
			} catch(e) {
				log(" NamespacesManager.unloadScript ===>%1", e)
			}
		}

		this.extKeyword = function(code) {
			for (var key in cache) {
				if (/easyscripts\_.*/.test(key)) {
					var shortKey = key.split("_")[1]
					var re = new RegExp("([^[0-9a-zA-Z\s\_])" + shortKey + "([^0-9a-zA-Z\s\_])", "g")
					code = code.replace(re, "$1" + key + "$2")
				}
			}
			return code
		}

		this.evalScript = function(bean, extFlg) {
			try {
				var code = bean.getScript();
				if (extFlg) {
					code = this.extKeyword(code)
				}
				return eval(code);
			} catch(e) {
				log(" NamespacesManager.evalScrnsmngeript ===>%1", e)
			}
		}

		this.getCache = function() {
			return cache
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

		this.printCacheKeys = function() {
			alert(Object.keys(manager.getCache()))
		}

	}

}

