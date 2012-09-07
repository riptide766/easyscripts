if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	window.snippet.ScriptCompileHelper = function(list) {
		this.process = function(bean, type) {
			for each(var processor in list) {
				processor.process(type, bean)
			}
		}
	}

	window.snippet.Compiler = function() {}

	window.snippet.Compiler.prototype.cmd_sh = getpref("cmd_sh", "/bin/sh")

	window.snippet.Compiler.prototype.error_log = getpref("log_error", "")

	window.snippet.Compiler.prototype.checkExecutableFile = function(cmd) {
		file = getfile(cmd)
		if (file.exists() && file.isExecutable()) {
			return file
		}
		return null
	}

	window.snippet.Compiler.prototype.launch = function(cmd, args) {
		var processor = getcmd(this.cmd_sh)
		var args = ["-c", cmd]
		log("launch : cmdstring --> %1", args[1]);
		processor.run(true, args, args.length)
		return getfilecontent(getfile(this.error_log));
	}

	window.snippet.JsCompiler = function() {
		var cmd = getpref("cmd_js", "/usr/bin/js"),
		pattern_js = getpref("pattern_compile_js", "");

		this.process = function(key, bean) {
			if (key != "js" || getpref("disable_js_check", false)) {
				return
			}
			var rslt = this.launch(p(pattern_js, cmd, bean.path, this.error_log))
			new snippet.JsErrorParser(rslt).check();
		}

		if (!this.checkExecutableFile(cmd)) {
			err(new snippet.CommonErrorParser(cmd + "不是可执行文件"))
		}
	}

	window.snippet.CoffeeCompiler = function() {
		var cmd = getpref("cmd_coffee", "/usr/bin/coffee"),
		pattern_coffee = getpref("pattern_compile_coffee", "");

		this.process = function(key, bean) {
			if (key != "coffee" || getpref("disable_coffee_compile", false)) {
				return
			}
			var rslt = this.launch(p(pattern_coffee, cmd, bean.path, this.error_log))
			new snippet.CoffeeErrorParser(rslt).check();
		}

		if (!this.checkExecutableFile(cmd)) {
			err(new snippet.CommonErrorParser(cmd + "不是可执行文件"))
		}
	}

	extendclass(snippet.JsCompiler, snippet.Compiler);
	extendclass(snippet.CoffeeCompiler, snippet.Compiler);
}

