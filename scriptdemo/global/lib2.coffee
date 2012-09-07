EXPORT = [easyscript_clip]

###
easyscript_ + name 样式的变量名
在普通脚本可以通过name直接访问。例如：
clip.simple_copy(clip.get_selectedtxt())
###

easyscript_clip =

	simple_copy: (txt) ->
		easyscript_app.ccc("nsIClipboardHelper").copyString(txt)
	
	get_selectedtxt: ->
		elm = easyscript_app.get_active_elm()
		localname = if elm then elm.localName else""
		if ['textarea', 'input'].indexOf(localname) >= 0
			rslt = elm.value.substring(elm.selectionStart, elm.selectionEnd)
		else if ['html','body'].indexOf(localname) >= 0
			rslt = content.getSelection().toString()
		return rslt


	set_clipboard: (data) ->
		trans = easyscript_app.ccc("nsITransferable")
		return false if not trans

		for  flavor of data
			copytext = new String(data[flavor])
			str = easyscript_app.ccc("nsISupportsString")
			return false if not str
			str.data = copytext
			trans.addDataFlavor(flavor)
			trans.setTransferData(flavor, str, copytext.length * 2)

		clipid = Components.interfaces.nsIClipboard
		clip = easyscript_app.ccs("nsIClipboard")
		return false if  not clip

		clip.setData(trans, null, clipid.kGlobalClipboard)
		return
	

	get_selectionsource:  ->
		rslt = ""
		ranges = content.getSelection()
		for i in [0..ranges.rangeCount-1]
			range = ranges.getRangeAt(i)
			continue if range.collapsed
			
			startContainer = range.startContainer
			spanNode = startContainer.ownerDocument.createElement("layer")
			docfrag = range.cloneContents()
			spanNode.appendChild(docfrag)
			rslt += spanNode.innerHTML
		
		return rslt
	
