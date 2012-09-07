if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {

	// file
	// line number
	// message
	window.snippet.ErrorParser = function() {

	}

	window.snippet.ErrorParser.prototype.getFile = function() {
		return "file://" + this.file
	}
	window.snippet.ErrorParser.prototype.getMessage = function() {
		return this.message
	}

	window.snippet.ErrorParser.prototype.getLineNum = function() {
		return this.linenum
	}

	window.snippet.ErrorParser.prototype.msg_prefix = ""
	window.snippet.ErrorParser.prototype.error = Error

	window.snippet.ErrorParser.prototype.getError = function() {
		return new this.error(this.msg_prefix + this.getMessage(), this.getFile(), this.getLineNum())
	}

	window.snippet.ErrorParser.prototype.check = function() {
		return this.hasError && err(this)
	}

	window.snippet.JsErrorParser = function(error) {

		if (error.trim()) {
			var errors = error.split("\n")
			var errorinfos = errors[0].split(":")
			this.hasError = true
			this.file = errorinfos[0]
			this.linenum = errorinfos[1]
			this.message = error
			this.error = SyntaxError
		}
	}

	window.snippet.CoffeeErrorParser = function(error) {

		if (/Error/.test(error)) {
			this.hasError = true
			var error2 = substring2(error, "\n");
			this.linenum = error2.replace(/.*line\ (\d*).*/g, "$1");
			this.file = error2.replace(/.*In\ ([^,]*),.*/g, "$1");
			this.message = error
			this.error = SyntaxError
		}
	}

	window.snippet.CommonErrorParser = function(error) {
		if (error) {
			this.hasError = true;
			this.file = null
			this.linenum = null
			this.message = error
		}

		this.getFile = function() {
			return ""
		}

		this.msg_prefix = "easyscript: "
	}

	extendclass(snippet.JsErrorParser, snippet.ErrorParser);
	extendclass(snippet.CoffeeErrorParser, snippet.ErrorParser);
	extendclass(snippet.CommonErrorParser, snippet.ErrorParser);

}

