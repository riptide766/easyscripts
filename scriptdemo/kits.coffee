EXPORT = [__customMenus]

__customMenus =
	"copyAgent": "复制Agent"
	"openProfileDirectory": "打开配置文件夹(thunar)"
	"restartBrowser": "重启"

this.copyAgent = ->
	clip.simple_copy app.get_agent()
	alert "#{app.get_agent()}\n 已复制"

this.restartBrowser = ->
	Services.appinfo.invalidateCachesOnRestart() || Application.restart()


# 对象的方式，需要实现process
this.openProfileDirectory = ->
	process: ->
		if app.get_os() == "Linux"
			currProfD = Services.dirsvc.get("ProfD", Ci.nsIFile)
			profileDir = currProfD.path
			cmd = app.getAFile("/usr/bin/thunar")
			app.executeCmd(cmd, [profileDir])
		else
			prop = app.ccs("nsIProperties")
			prop.get("ProfD", Ci.nsILocalFile).launch()
	
	


