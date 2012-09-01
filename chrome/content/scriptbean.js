if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	// 表示一个脚本文件
	window.snippet.ScriptBean = function ScriptBean(file) {


		this.parseExports = function() {
			return this.getExport().map(function(obj) {
				return "this.%1=%1;".replace(/\%1/g, obj.trim())
			}).join("\n");
		}

		this.getExport = function (){
			var exports =this.originalCode.match(/EXPORT\s*=\s*\[.*\]/);
			if(!exports || exports.length == 0){
				return []
			}

			// 取第一行的EXPORT,解析出数组的部分
			return exports[0].slice(exports[0].indexOf('[')+1,-1).split(",")
		}

		this.getScript = function() {
			return this.HEAD + this.getCode() + this.magicPart + this.END;
		}

		this.HEAD = "new function(){";
		this.END = "}";

		this.originalCode = getfilecontent(file);

		this.getCode = function(){
			var code = this.originalCode;
			var rslt=code.match(/^\/\/\sGenerated\sby\sCoffee.*\n\(function\(\)\s*\{/)
			if(rslt && rslt.length >0 ){
				code=code.slice(rslt[0].length,-15)
			}
			return code
		}

		this.path = file.path
		this.magicPart = this.parseExports();
		this.lastModifiedTime = file.lastModifiedTime;
		this.name = file.leafName.slice(0, file.leafName.indexOf('.'));

	}
}

