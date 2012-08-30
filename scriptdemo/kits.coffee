this.__customMenus =
	"copyAgent": "复制Agent"
	"openProfileDirectory": "打开配置文件夹(thunar)"
	"restartBrowser": "重启"

this.copyAgent = ->
	clip.simple_copy app.get_agent()
	alert "#{app.get_agent()}\n 已复制"

this.restartBrowser = ->
	Services.appinfo.invalidateCachesOnRestart() || Application.restart()


this.openProfileDirectory = ->
		currProfD = Services.dirsvc.get("ProfD", Ci.nsIFile)
		profileDir = currProfD.path
		fileapp.exec_cmd("/usr/bin/thunar", [profileDir])




