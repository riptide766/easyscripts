EXPORT = [saveSelectedImage2,saveSelectedImage,openSelectionLinks]


this.__customMenus =
	"google_translate": "google翻译"
	"appendTmpFile": "随手记(杂)"
	"appendFirefoxFile": "随手记(firefox)"
	"appendLinuxFile": "随手记(linux)"
	"appendSentenceFile": "随手记(en)"
	"getShortUrl": "获取短链接"
	"replaceSpace":"复制并替换半角空格(\\B\\ \\B)"
	"saveSelectedTxt": "保存选中的文字"
	"showSelectionSource": "查看选中的代码"
	"copyCodeNoLinenum": "复制没有行号的代码"
	"getTitleAndUrl": "标题和链接.复制标题和链接"
	"getTitleAndUrl2HTML":"标题和链接.复制标题和链接(html)"
	"getTitleAndUrl2RST":"标题和链接.复制标题和链接(rst)"
	"getTitle": "标题和链接.复制标题"
	"openSelectionLinks": "打开选中链接"
	"openSelectionLinks2": "打开选中链接(正则)"
	"saveSelectedImage": "下载选中图片"
	"saveSelectedImage2": "下载选中图片(正则)"

google_shortener_api="https://www.googleapis.com/urlshortener/v1/url"
google_translate_api="http://translate.google.cn/?hl=en#en/zh-CN/"

appendFile = ()->
	return if not clip.get_selectedtxt()
	content = "#{app.get_title()}\n#{app.get_url()}    #{new Date()}\n#{clip.get_selectedtxt()}\n\n\n"
	file = fileapp.get_file.apply(null,arguments)
	fileapp.append_txt(file, content)

this.appendSentenceFile = ->
	appendFile("Home",["sentence.txt"])

this.appendTmpFile = ->
	appendFile("Home",["tmp.txt"])

this.appendFirefoxFile = ->
	appendFile("Home",["firefox.txt"])

this.appendLinuxFile = ->
	appendFile("Home",["linux.txt"])

this.google_translate = ->
	browserapp.open_page_fg google_translate_api+clip.get_selectedtxt() if clip.get_selectedtxt()

this.copyCodeNoLinenum = ->
		lines = clip.get_selectedtxt().replace(/(^\s*\d*|\n\s*\d*)/gm,'\n')
		clip.simple_copy lines
		app.ok lines

this.replaceSpace = ->
	txt = clip.get_selectedtxt().replace(/\B\ \B/gm,"　")
	clip.simple_copy(txt)
	app.ok(txt)
	

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
	alert links.length
	fileapp.save_image(link) for link in links if links

openSelectionLinks = (evalFlg) ->
	source = clip.get_selectionsource()
	data = source.match(/href=\"[^"]*\"/g)
	hostname = app.get_hostname()

	links = data.map (link) ->
		link = link.slice(6, - 1)
		"/"+link if link[0] isnt "/"
		return "" if (/^\#/.test(link))
		return hostname + link if not /^http(|s)/.test(link)
		return link

	return links if  evalFlg

	checked={}
	links.forEach (link) ->
		browserapp.open_page_bg link if link && not checked[link]
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
		re.test(link)  && !checked[link] && browserapp.open_page_bg link
		checked[link]=1


this.showSelectionSource = ->
	try
		alert clip.get_selectionsource() if clip.get_selectedtxt()
	catch e
		alert "error : #{e}"

this.saveSelectedTxt = -> fileapp.saveas_text clip.get_selectedtxt()

