EXPORT = [saveSelectedImage2,saveSelectedImage,openSelectionLinks]


this.__customMenus =
	"getShortUrl": "获取短链接"
	"copySimpleTxtToClipBoard": "复制简单文字"
	"getTitleAndUrl": "复制标题和链接"
	"getTitleAndUrl2HTML":"复制标题和链接(html)"
	"getTitleAndUrl2RST":"复制标题和链接(rst)"
	"getTitle": "复制标题"
	"showSelectionSource": "查看选中的代码"
	"saveSelectedTxt": "保存选中的文字"
	"openSelectionLinks": "打开选中链接"
	"openSelectionLinks2": "打开选中链接(正则)"
	"saveSelectedImage": "下载选中图片"
	"saveSelectedImage2": "下载选中图片(正则)"

google_shortener_api="https://www.googleapis.com/urlshortener/v1/url"



this.getShortUrl = ->
	xhrapp.postjson(google_shortener_api,
		{"Content-Type": "application/json"},
		{"longUrl": app.get_url()},
		(data)->
			clip.simple_copy(data.id)
			alert "#{data.id}\n已复制"
	)


this.getTitleAndUrl2HTML = ->
	clip.set_clipboard
		"text/unicode": "<a href='#{app.get_title()}'>#{app.get_url()}</a>"
		"text/html": "<a href='#{app.get_title()}'>#{app.get_url()}</a>"
	alert "done"


this.getTitleAndUrl2RST = ->
	clip.simple_copy  "`#{app.get_title()} - WIKI <#{app.get_url()}>`_"
	alert "done"

this.getTitle = ->
	clip.simple_copy app.get_title()
	alert "done"


this.getTitleAndUrl = ->
	clip.simple_copy  "#{app.get_title()}\n#{app.get_url()}"
	alert "done"

saveSelectedImage2 = ->
	 links = saveSelectedImage(true)

	 list = links.slice(0, 10).reduce((l, l2) ->  "#{l}\n#{l2}" )

	 if links.length > 0
		 re = prompt "部分数据供参考：\n #{list} \n输入正则..."
		 return if not re.trim()

	 re = new RegExp(re,"g")
	 links.forEach (link) -> re.test link && fileapp.save_image link

saveSelectedImage = (evalFlg) ->
	source = clip.get_selectionsource()
	data = source.match(/src=\"[^"]*(gif|ioc|jpg|png)\"/g)
	hostname = app.get_hostname()
	links = data.map (link) ->
		link = link.slice(5, - 1)
		if not /^http(|s)/.test(link)
			link = "http://" + hostname + "/" + link
		return link
	return links if evalFlg
	links.forEach (link) -> fileapp.save_image(link) if link

openSelectionLinks = (evalFlg) ->
	source = clip.get_selectionsource()
	data = source.match(/href=\"[^"]*\"/g)
	hostname = app.get_hostname()

	links = data.map (link) ->
		link = link.slice(6, - 1)
		return "" if (/^\#/.test(link))
		return "#{hostname}/#{link}" if not /^http(|s)/.test(link)
		return link

	return links if  evalFlg

	checked={}
	links.forEach (link) ->
		gBrowser.addTab link if link && not checked[link]
		checked[link]=1

this.openSelectionLinks2 = ->
	links = openSelectionLinks(true)

	list = links.slice(0, 10).reduce (l, l2) -> return "#{l}\n#{l2}"

	if links.length > 0
		re = prompt("部分数据供参考：\n #{list} \n输入正则...", "")
		return if not re.trim()

	re = new RegExp(re,"g")
	checked={}
	links.forEach (link)->
		re.test(link)  && !checked[link] && gBrowser.addTab(link)
		checked[link]=1


this.showSelectionSource = ->
	try
		alert clip.get_selectionsource()
	catch e
		alert "error : #{e}"

this.saveSelectedTxt = -> fileapp.saveas_text clip.get_selectedtxt()

this.copySimpleTxtToClipBoard = ->
	copytext = clip.get_selectedtxt()
	clip.set_clipboard
		"text/unicode": copytext
		"text/html": copytext

