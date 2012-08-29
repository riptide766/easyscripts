EXPORT = [__customMenus, switchRestartless, getAddonsList]

__customMenus =
	"switchRestartless": "Addons.切换RestartLess扩展开闭状态(输入序号如:1,2)",
	"getAddonsList": "Addons.复制扩展列表和简单统计",

getAddonsList = ->
	Components.utils.import "resource://gre/modules/AddonManager.jsm"
	AddonManager.getAllAddons (addons) ->
		rslt = ""
		cnt = 0
		cnt2 = 0
		for addon in addons
			if addon.type == "extension"
				if addon.isActive
					rslt += (addon.name + "\n")
					cnt++
				cnt2++
		
		rslt = "#{rslt}\n\n共安装各类扩展,插件,主题共#{addons.length}个;\n其中扩展#{cnt2} 个,启用扩展#{cnt}个"
		clip.simple_copy rslt
		alert "done"

switchRestartless = ->
	Components.utils.import("resource://gre/modules/AddonManager.jsm")
	rlAddons = {}
	content = ""
	indx = 1
	AddonManager.getAllAddons (aAddons) ->
		aAddons.sort((a) -> a.isActive)
		for aAddon ,index in aAddons
			if aAddon.hasResource and  aAddon.hasResource("bootstrap.js")
				rlAddons[indx] = index
				content += "#{indx++} #{aAddon.isActive} #{aAddon.name} \n"
			
		rslt = prompt(content).trim()

		for item in rslt.split(",")
			aAddon = aAddons[rlAddons[item]]
			aAddon.userDisabled = ! aAddon.userDisabled

