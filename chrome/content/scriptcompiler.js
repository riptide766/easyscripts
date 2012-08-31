if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	window.snippet.ScriptCompiler = function() {
		var cmd_sh = getpref("cmd_sh", "/bin/sh"),
		cmd_js = getpref("cmd_js", "/usr/bin/js"),
		cmd_coffee = getpref("cmd_coffee", "/usr/bin/coffee"),
		error_log = getpref("log_error", ""),
		pattern_js = getpref("pattern_compile_js", "");
		pattern_coffee = getpref("pattern_compile_coffee", "");

		this.compileCoffee = function(path) {
			var rslt = this.launch(p(pattern_coffee, cmd_coffee, path, error_log))
			new snippet.CoffeeErrorParser(rslt).check();
		}

		this.process = function(bean, type) {
			if (type == "js" && !getpref("disable_js_check",false)) {
				this.checkSyntax(bean.path)
			} else if (type == "coffee" && !getpref("disable_coffee_compile",false)) {
				this.compileCoffee(bean.path)
			}
		}

		this.launch = function(cmd) {
			var processor = getcmd(cmd_sh)
			var args = ["-c", cmd]
			log("launch : cmdstring --> %1", args[1]);
			processor.run(true, args, args.length)
			return getfilecontent(getfile(error_log));
		}

		this.checkSyntax = function(path) {
			var rslt = this.launch(p(pattern_js, cmd_js, path, error_log))
			new snippet.JsErrorParser(rslt).check();
		}
	}

}

