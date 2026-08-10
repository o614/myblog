---
title: "如何切换 App Store 账户？适配 iOS 26.4"
author: "不要艾特我"
pubDatetime: 2026-06-15T14:56:35.000Z
modDatetime: 2026-08-10T00:00:00.000Z
slug: "how-to-switch-app-store-account"
featured: false
draft: false
tags: ["Apple ID", "App Store", "账户切换", "iOS 26"]
description: "最近推送的 iOS 26.4 砍掉了直接在 App Store 切换账户的功能，这篇文章介绍最新的账户切换方法。"
---

> **同步知乎文章：** [查看知乎原文](https://www.zhihu.com/tardis/jm/art/2020194112008136084)

> 最近推送的 iOS 26.4 砍掉了直接在 App Store 切换账户的功能，导致很多更新了系统的朋友不知道咋切换账户了。

今天就给大家分享一下**最新的 App Store 切换账户**的方法，此教程除了适配最新的 iOS 26.4 系统也包含 iOS 18 系统的切换方法，旨在帮助大家更好的使用和管理自己的 Apple ID。

Ps：如果你还没有自己的 Apple ID，可以参考下方教程注册一个，此教程兼容外区 Apple ID 和国区 Apple ID 的注册方法。

[别再用老方法了！Apple ID 注册规则又双叒叕改了！](https://www.zhihu.com/tardis/jm/art/2001668824802534136)

## 先说最新的 iOS 26.4 系统，因为它直接砍掉了在 App Store 切换的功能。以下教程前提是“App Store”和“设置”App 均已登录账户。

**一、普通切换**

1、退出现有账户

打开“设置”App，轻点顶部“Apple 账户”，轻点“媒体与购买项目”，轻点“退出登录”，再次轻点“退出登录”。

![在设置中打开 Apple 账户和媒体与购买项目，然后退出登录](/images/posts/switch-app-store-account-1.webp)

2、登录新账户

轻点“媒体与购买项目”，轻点“不是 XXX”，输入新的账户和密码完成登录。

![在媒体与购买项目中选择其他 Apple 账户登录](/images/posts/switch-app-store-account-2.webp)

**二、进阶切换**

1、安装“商店 ID 切换”快捷指令，轻点直达“退出登录”界面。

[商店 ID 切换（快捷指令）](https://www.icloud.com/shortcuts/b9f4c2019f30454bbd6ef126dd0306a9)

注意，此快捷指令**仅对 iOS 26 系统有效！**iOS 18 及以后的旧版系统不支持

![使用商店 ID 切换快捷指令进入媒体与购买项目](/images/posts/switch-app-store-account-3.webp)

2、轻点“媒体与购买项目”，轻点“不是 XXX”，输入新的账户和密码完成登录。

![在媒体与购买项目中选择其他 Apple 账户登录](/images/posts/switch-app-store-account-2.webp)

## 再说 iOS 26.3 及 iOS 18、iOS 17... 旧版系统

1、退出现有账户

打开“App Store”App，轻点右上角“头像”，在“账户”界面划到最底部，轻点“退出登录”，点击右上角“完成”或“X”。

![在旧版本 iOS 的 App Store 账户页面退出登录](/images/posts/switch-app-store-account-4.webp)

2、登录新账户

轻点右上角“头像”，轻点顶部“通过 Apple 账户登录”，轻点“不是 XXX”，输入新的账户和密码完成登录。

![在旧版本 iOS 的 App Store 中登录其他 Apple 账户](/images/posts/switch-app-store-account-5.webp)

## 为啥要切换“App Store”App 内的账户，不直接切换“设置”App 内的账户？

在“设置”App 中登录外区 Apple ID 存在极高安全风险，核心问题在于混淆了「系统设置」与「App Store」的账户管理机制。若从系统设置登录外区 Apple ID，如果账户被封禁，可能导致设备被锁定从而无法退出账户，需联系苹果客服且成功率极低。

---

**最后补一句，新注册的外区 Apple ID 首次登录前记得先去切换一下对应的 App Store 地区再去登录，不然有很大概率直接送回国区！**

**切换 App Store 方法如下**（演示的是美国 Apple ID 切换 App Store 的方法）

在**已登录微信**的状态下，把**切换链接**复制到 **Safari 浏览器**打开即可自动完成切换。

![通过微信获取 App Store 地区切换链接](/images/posts/switch-app-store-account-6.webp)

如果是新设备或是备用机，**没有登录微信**，可以点击**展示二维码**，使用设备自带的**相机摄像头**进行扫描。

itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/resetAndRedirect?dsf=143462&cc=jp (二维码自动识别)

**如果觉得文章对您有帮助，欢迎点赞评论！如果对此文章有疑问或更好的方法，欢迎留言分享~**
