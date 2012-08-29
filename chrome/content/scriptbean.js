if (!window.snippet) {
	window.snippet = {}
}

with(window.snippet.lib) {
	// 表示一个脚本文件
	window.snippet.ScriptBean = function ScriptBean(file) {


		this.parseExports = function(code) {
			
			// 取第一行的EXPORT,解析出数组的部分
			var exports =code.match(/EXPORT\s*=\s*\[.*\]/);
			if(exports.length>0){
				exports=exports[0].slice(exports[0].indexOf('[')+1,-1)
			}else{
				// TODO throw error
			}
			
			// 将数组中的变量foo转换成this.foo=foo的形式
			var data = exports.split(',').map(function(obj) {
				return "this.%1=%1;".replace(/\%1/g, obj.trim())
			}).join("\n");
			return data
		}

		this.parseExports4Coffee = function(code){
			
		
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
		this.magicPart = this.parseExports(this.originalCode);
		this.lastModifiedTime = file.lastModifiedTime;
		this.name = file.leafName.slice(0, file.leafName.indexOf('.'));

	}
}

