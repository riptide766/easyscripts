// 实用工具
if (!window.snippet) {
	window.snippet = {}
}

window.snippet.lib = {
	CC: Components.classes,
	CI: Components.interfaces,
	PREF_PREFIX:"extensions.easyscripts.",

	ccc: function(contract, inter) {
		return this.CC[contract].createInstance(this.CI[inter]);
	},

	ccs: function ccs(contract, inter) {
		return this.CC[contract].getService(this.CI[inter]);
	},

	log: function log() {
		Application.console.log("easyscripts :: "+this.p.apply(null, arguments))
	},

	err: function err(error) {
		throw error.getError();
	},

	p: function p() {
		var pattern = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			pattern = pattern.replace("%" + i, arguments[i]);
		}
		return  pattern;
	},

	getfilecontent: function(file) {
		var fstream = this.ccc("@mozilla.org/network/file-input-stream;1", "nsIFileInputStream");
		var cstream = this.ccc("@mozilla.org/intl/converter-input-stream;1", "nsIConverterInputStream");
		fstream.init(file, - 1, 0, 0);
		cstream.init(fstream, "UTF-8", 0, 0);
		var str = {}
		var data = ""
		var read = 0;
		do {
			read = cstream.readString(0xffffffff, str);
			data += str.value;
		} while (read != 0);
		cstream.close();
		return data
	},

	getfile: function() {
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		if (arguments.length == 1) {
			file = new FileUtils.File(arguments[0]);
		} else if (arguments.length == 2) {
			file = FileUtils.getFile(arguments[0], arguments[1]);
		}
		return file
	},

	getcmd: function(cmd) {
		var process = this.ccc("@mozilla.org/process/util;1", "nsIProcess");
		process.init(this.getfile(cmd));
		return process

	},

	substring2: function(str, delimiter) {
		var indx = str.indexOf(delimiter)
		return str.substring(0, indx)
	},

	startwith:function(str,head){
		return str.substring(0,head.length)==head
	},

	getpref: function() {
		if (arguments.length == 2) {
			var name = arguments[0],
			value = arguments[1]
			return Application.prefs.getValue(this.PREF_PREFIX + name, value)
		}
	},

    extendclass : function(subCls,superCls) {  
        var sbp = subCls.prototype;  
        subCls.prototype = new superCls();  
        subCls.prototype.constructor = subCls;  
        for(var atr in sbp) {  
            subCls.prototype[atr] = sbp[atr];  
        }  
        subCls.supr = superCls;  
    },
	
}

