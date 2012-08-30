EXPORT = [easyscript_app,easyscript_fileapp,easyscript_xhrapp,easyscript_testapp]

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

	ccc: (arg) -> snippet.lib.ccc(easyscript_app.mapping[arg], arg)

	ccs: (arg) -> snippet.lib.ccs(easyscript_app.mapping[arg], arg)

	log: (msg) -> Application.console.log(msg)

	get_title : -> document.title

	get_url : ->  content.document.location.href

	get_hostname : -> content.document.location.hostname

	get_os : -> Services.appinfo.OS

	get_agent : -> window.navigator.userAgent

	ok : (content, msg="操作完成") -> alert "#{content}\n\n#{msg}"

easyscript_fileapp =
	saveas_text: (txt) ->
		filename = txt.slice(0, 10) + ".txt"
		txt = btoa(unescape(encodeURIComponent(txt)))
		saveImageURL("data:text/plain;charset=UTF-8;base64," + txt, filename)

	save_image: (url) -> saveImageURL(url, 0, 0, 0, 1)


	get_file: (path) ->
		localFile = easyscript_app.ccc("nsILocalFile")
		localFile.initWithPath(path)
		localFile

	exec_cmd: (cmd, args) ->
		processor = easyscript_app.ccc("nsIProcess")
		if typeof cmd == "string"
			cmd = easyscript_fileapp.get_file(cmd)
		processor.init(cmd)
		processor.run(false, args, args.length)

easyscript_xhrapp =
	send: (url, headers, handler={}, args, method="get", body,jsonflg=false)->
		req = new XMLHttpRequest()
		req.open(method, url, true)
		for key , value of headers
			req.setRequestHeader(key,value)
		req.onreadystatechange = (evt) ->
			if req.readyState == 4
				if req.status == 200 or req.status == 201
					responseText = if jsonflg then JSON.parse req.responseText else req.responseText
					handler(responseText, args) if typeof handler  == "function"
				else
					easyscript_app.log "network : #{req.responseText}"
		req.send(body)

	postjson : (url,headers,body,handler,args) ->
		try
			@send(url,headers,handler,args,"POST",JSON.stringify(body),true)
		catch e
			alert e

easyscript_testapp =
	test: -> alert easyscript_app.get_os()

