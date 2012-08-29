EXPORT = [easyscript_app,easyscript_fileapp]

easyscript_app =

	mapping:
		"mozIJSSubScriptLoader": "@mozilla.org/moz/jssubscript-loader;1"
		"nsIScriptableUnicodeConverter":"@mozilla.org/intl/scriptableunicodeconverter"
		"nsIProcess": "@mozilla.org/process/util;1"
		"nsIClipboardHelper": "@mozilla.org/widget/clipboardhelper;1"
		"nsILocalFile": "@mozilla.org/file/local;1"
		"nsITransferable": "@mozilla.org/widget/transferable;1"
		"nsISupportsString": "@mozilla.org/supports-string;1"
		"nsIClipboard": "@mozilla.org/widget/clipboard;1"
		"nsIProperties": "@mozilla.org/file/directory_service;1"

	ccc: (arg) ->
		return snippet.lib.ccc(easyscript_app.mapping[arg], arg)

	ccs: (arg) ->
		return snippet.lib.ccs(easyscript_app.mapping[arg], arg)

	log: (msg) ->
		Application.console.log(msg)

	get_title : -> document.title

	get_url : ->  content.document.location.href

	get_hostname : -> content.document.location.hostname

	get_os : -> Services.appinfo.OS

	get_agent : -> window.navigator.userAgent
	
	
easyscript_fileapp =
	saveas_text: (txt) ->
		filename = txt.slice(0, 10) + ".txt"
		txt = btoa(unescape(encodeURIComponent(txt)))
		saveImageURL("data:text/plain;charset=UTF-8;base64," + txt, filename)

	save_image: (url) -> saveImageURL(url, 0, 0, 0, 1)

