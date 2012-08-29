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

	window.snippet.ErrorParser.prototype.getError = function() {
		return new Error(this.getMessage(), this.getFile(), this.getLineNum())
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
		}
	}

	window.snippet.CoffeeErrorParser = function(error) {

		if (startwith(error, "Error")) {
			this.hasError = true
			var error2 = substring2(error, "\n");
			this.linenum = error2.replace(/.*line\ (\d*).*/g, "$1");
			this.file = error2.replace(/.*In\ ([^,]*),.*/g, "$1");
			this.message = error
		}
	}

	window.snippet.CommonErrorParser = function(error) {
		if(error){
			this.hasError = true;
			this.file=null
			this.linenum=null
			this.message=error
		}
	}
	
	extendclass(snippet.JsErrorParser, snippet.ErrorParser);
	extendclass(snippet.CoffeeErrorParser, snippet.ErrorParser);

}

