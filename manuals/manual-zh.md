# DRRR 機器人插件設定手冊

## 安裝

### 電腦版
:::success
由於是 Chrome 插件，所以請使用 Chrome 瀏覽器，並至 [Google 線上應用程式商店](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) 安裝。


另外如果是用 Opera 的話，可以嘗試 Opera 這款 [Install Chrome Extensions](https://addons.opera.com/zh-tw/extensions/details/install-chrome-extensions/) 裝裝看。
:::

### 手機端
:::success
手機版的 Chrome 並不提供在手機上的插件安裝，不過你可以使用 Yandex 瀏覽器 ([Android](https://play.google.com/store/apps/details?id=ru.yandex.searchplugin&hl=en_US))，他用的是 Chrome 內核，所以一樣可以到 [Google 線上應用程式商店](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) 安裝。

註：iOS 的 Yandex 並不支援插件功能。

Kiwi browser 也可以運行此插件，不過因為某些未知的 bug，我做了一個定製版本（kiwi 分枝）給他。你可以用 .crx 檔案安裝他或者直接安裝[這個版本](https://chrome.google.com/webstore/detail/drrr-chatbot-extension-ki/ejklpmiadilgeabpklkickjghjegcblj)。
:::

### 背景版本

:::success
[背景版本](https://chrome.google.com/webstore/detail/drrr-chatbot-extension-ba/iafmncflgcckjejinbaneekanabjnodm)可以讓你在網站上更換圖示（例如機器人板手）。不過他必須常駐在背景執行，這可能會消耗更多的資源。
:::

### 即將上架

:::warning
火狐瀏覽器插件還在審核，他之後應該可以在 Android 和電腦上運行。
:::

## 前端控制

> 點選插件圖示，開啟彈出式視窗。

![](https://i.imgur.com/wGUTTot.png)

:::success
**功能鍵**
<i class="glyphicon glyphicon-question-sign"></i> 前往本說明頁面
<i class="fa fa-youtube-play"></i> YouTube 教學
<i class="glyphicon glyphicon-console"></i> 浪語開發界面
<i class="glyphicon glyphicon-cog"></i> 前往後台設定
:::

:::success
**開關 （<i class="glyphicon glyphicon-cog"></i> 表示須先設定才能開啟）**
- AutoDM
  發訊後自動鎖定上次私訊對象
- Timer <i class="glyphicon glyphicon-cog"></i>
  定時執行設定的動作
- Black/Whitelist <i class="glyphicon glyphicon-cog"></i>
  房間黑/白名單（自動踢出訪客）
- Welcome <i class="glyphicon glyphicon-cog"></i>
  訪客進房，自動送出歡迎詞
- BanAbuse <i class="glyphicon glyphicon-cog"></i>
  禁止用語名單，當用戶用語匹配到禁用詞，會被自動踢出/屏蔽/舉報
- Always/me
  自動加上 /me 指令
- EventAction <i class="glyphicon glyphicon-cog"></i>
  當事件發生，執行設定的動作
- RoomKeeper
  自動發訊息給自己，防止房間消失
- TgBotLogger <i class="glyphicon glyphicon-cog"></i>
  將聊天訊息透過 Telegram Bot 紀錄下來
- RoomNotification
  當瀏覽器頁面不在聊天室時，送出聊天內容通知
:::

### Bio

:::success
![](https://i.imgur.com/6nhuHtc.png)

#### 聊天訊息簡繁互轉
- Ｘ 不轉換
- 簡 轉成簡體
- 繁 轉成繁體

#### 功能鍵

<i class="glyphicon glyphicon glyphicon-text-color"></i> 改變聊天室人名顏色
<i class="glyphicon glyphicon glyphicon-text-background"></i> 改變聊天室人名背景顏色
（顏色採用[網頁顏色](https://zh.wikipedia.org/zh-tw/%E7%BD%91%E9%A1%B5%E9%A2%9C%E8%89%B2)，e.g. `black`, `#000000`）
<i class="glyphicon glyphicon glyphicon-picture"></i> 使用圖片鏈結當作背景
<i class="glyphicon glyphicon-transfer"></i> 切換選中的帳號
<i class="glyphicon glyphicon-floppy-save"></i> 儲存當前帳號
<i class="glyphicon glyphicon-floppy-remove"></i> 刪除選中的帳號

#### 帳號圖示
- 🔖 當前登入帳號
- 💾 已儲存的帳號

:::

### Local

:::success
![](https://i.imgur.com/QytKsjo.png)

#### 功能鍵
<i id="local-setting" class="glyphicon glyphicon-bookmark"></i> 前往本地設定
<i id="local-switch" class="fa fa-toggle-off"></i> 本地模組開關

#### 本地端訊息模組
- Hashtag ~~小周讚美功能~~ inspired by [@塵塵](https://drrr.wiki/index.php?title=@%E8%88%87%E5%85%89%E5%90%8C%E5%A1%B5&redirect=no)
  紀錄有 `#` 的訊息，在訊息欄以 `#` + tag 將會隨機選取紀錄過的訊息送出。
  ![](https://i.imgur.com/ayuUGAL.png)

- CahtLog
  紀錄聊天室訊息
:::

### Friends

:::success

![](https://i.imgur.com/BjCw2A4.png)

:::

:::warning
![](https://i.imgur.com/CDRuB6I.png)

#### 等房功能

定時查看房間是否有空位，如果有則跳轉該房。

匹配規則模式：
- <i class="glyphicon glyphicon-barcode"></i> 以房間 ID
- <i class="glyphicon glyphicon-lock"></i> 以 tripcode
- <i class="glyphicon glyphicon-user"></i> 以使用者名稱
- <i class="glyphicon glyphicon-home"></i> 以房間名稱

<i class="glyphicon glyphicon-tag"></i> 儲存規則

跳轉模式：
- <i class="glyphicon glyphicon-send"></i> 直接跳轉
- <i class="glyphicon glyphicon-comment"></i> 跳轉前詢問
:::

:::warning
![](https://i.imgur.com/Tffsixa.png)

#### 搜尋使用者/房間

搜尋模式：
- <i class="glyphicon glyphicon-lock"></i> 以 tripcode 搜尋
- <i class="glyphicon glyphicon-user"></i> 以使用者名稱搜尋
- <i class="glyphicon glyphicon-home"></i> 以房間名稱搜尋

<i class="glyphicon glyphicon-search"></i> 搜尋
<i class="glyphicon glyphicon-plus"></i> 加入至收藏
:::

:::warning
![](https://i.imgur.com/GqNW6b4.png)

#### 收藏通知/列表

<i class="glyphicon glyphicon-eye-close"></i> 隱藏符合名稱/tripcode的人名/房間
<i class="glyphicon glyphicon-volume-up"></i> 開啟收藏通知（有人上線或房間創立）
<i class="glyphicon glyphicon-list"></i> 顯示所有收藏規則
<i class="glyphicon glyphicon-lock"></i> 顯示線上所有符合的 tripcode 使用者
<i class="glyphicon glyphicon-user"></i> 顯示線上所有符合規則的使用者
<i class="glyphicon glyphicon-home"></i> 顯示線上所有符合規則的房間
<i class="glyphicon glyphicon-globe"></i> 顯示線上所有房間
:::

### Music

:::success
![](https://i.imgur.com/ZvV9Sun.png)


#### 播放模式（點擊切換）
- <i class="glyphicon glyphicon-music"></i> 單曲模式：播完即停
- <i class="glyphicon glyphicon-cd"></i> 唱片模式：歌曲結束後自動播放待播清單下一首
- <i class="glyphicon glyphicon-repeat"></i> 單曲循環：循環播放單曲
- <i class="glyphicon glyphicon-refresh"></i> 唱片循環：循環播放清單

#### 音源
- **易** 網易音樂
- **千** 千千音樂盒
- **Ｙ** YouTube
- **狗** 酷狗音樂
- **我** 酷我音樂

#### Search Keyword and Play（搜尋列）

輸入關鍵字配合功能鍵查詢。
輸入後直接：
- Enter 可以按下左功能鍵。
- Shift + Enter 可以按下中功能鍵。
- Ctrl + Enter 可以按下右功能鍵。

#### 其他功能鍵

<i class="glyphicon glyphicon-list"></i> 展開待播清單
<i class="glyphicon glyphicon-play"></i> 播放待播曲目
<i class="glyphicon glyphicon-heart"></i> 展開收藏清單
<i class="glyphicon glyphicon-link"></i> 設定其他 YouTube API server

你可以使用在本地架設 YouTube API server，請參考[此鏈結](https://github.com/DrrrChatbots/youtube-api)。
使用 python 運行後，會提示 `http://127.0.0.1:5000/`，
點選此按鍵，然後填入 `http://127.0.0.1:5000/`，之後照著提示操作即可。

:::

:::warning
<i class="glyphicon glyphicon-list"></i> 展開待播清單

![](https://i.imgur.com/yEwUeJX.png)

#### 功能鍵

<i class="glyphicon glyphicon-remove"></i> 從待播刪除 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-heart"></i> 收藏樂曲
:::

:::warning
<i class="glyphicon glyphicon-heart"></i> 展開收藏清單

![](https://i.imgur.com/CNAMolJ.png)

#### 功能鍵

<i class="glyphicon glyphicon-plus"></i> 加入待播 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-remove"></i> 從收藏刪除
:::

:::warning
當搜尋欄有關鍵字時

![](https://i.imgur.com/gJeqaLs.png)

#### 功能鍵

<i class="glyphicon glyphicon-search"></i> 展開搜尋結果 <i class="glyphicon glyphicon-play"></i> 播放最關聯搜尋結果 <i class="glyphicon glyphicon-plus"></i> 加入最關聯結果至待播清單
:::

:::warning
搜尋結果：剛好遇見你

![](https://i.imgur.com/W7iJG5s.png)

#### 功能鍵
<i class="glyphicon glyphicon-plus"></i> 加入待播 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-heart"></i> 收藏樂曲
:::

### Module

:::success
![](https://i.imgur.com/G5Vt5oC.png)

#### 功能鍵

<i id="game-tent" class="glyphicon glyphicon-tent"></i> Discord QA 群
<i class="glyphicon glyphicon-qrcode"></i> tripcode 探索器

<i class="fa fa-paw" aria-hidden="true"></i> 召喚寵物（預設白貓）
<i class="glyphicon glyphicon-resize-full"></i> 調整寵物邊框大小
<i class="glyphicon glyphicon-link"></i> 更換寵物（輸入[鏈結](https://drrr.wiki/%E6%B5%AA%E6%89%93%E8%81%8A%E5%A4%A9%E6%8F%92%E4%BB%B6)）

#### 目前已知的 Live2D 鏈結

:::spoiler 展開列表

- 白貓
`https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json`
- 黑貓
`https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json`
- 寶石研物語
`https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json`
- 初音
`https://unpkg.com/live2d-widget-model-miku@1.0.5/assets/miku.model.json`
- 碧海航線 z16
`https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json`
- Nito 二頭身
`https://unpkg.com/live2d-widget-model-nico@1.0.5/assets/nico.model.json`
`https://unpkg.com/live2d-widget-model-nipsilon@1.0.5/assets/nipsilon.model.json`
`https://unpkg.com/live2d-widget-model-nito@1.0.5/assets/nito.model.json`
`https://unpkg.com/live2d-widget-model-ni-j@1.0.5/assets/ni-j.model.json`
- 千歲
`https://unpkg.com/live2d-widget-model-chitose@1.0.5/assets/chitose.model.json`
- 小可愛(男) 春翔
`https://unpkg.com/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json`
- 小可愛(女) 小春
`https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json`
- 春傘 TSUMIKI
`https://unpkg.com/live2d-widget-model-tsumiki@1.0.5/assets/tsumiki.model.json`
- unity 醬
`https://unpkg.com/live2d-widget-model-unitychan@1.0.5/assets/unitychan.model.json`
- 碗中小年糕
`https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json`
- 嚮
`https://unpkg.com/live2d-widget-model-hibiki@1.0.5/assets/hibiki.model.json`
:::

:::warning
##### TRPG inspired by [@少女](https://drrr.wiki/@%E5%B0%91%E5%A5%B3)
![](https://i.imgur.com/oChwMqs.png)

更換角色：
- <i class="glyphicon glyphicon-bullhorn"></i> 主持人
- <i class="glyphicon glyphicon-user"></i> 一般玩家

主持人可以透過圖片 URL 更換所有玩家的背景圖

其他人可以使用 `1D20` 之類的 TRPG 骰子指令請求主持人擲骰


:::

:::warning
##### Room guard 門神
![](https://i.imgur.com/m8WiICd.png)

模式：
- mode 0: 訪客如果進房後沒有任何動作，將在下次進房被 kick/ban。
- mode 1: 時間內內沒說話，詢問是否 kick/ban。
- mode 2: 時間內沒說話，倒數然後 kick/ban
- mode 3: 時間內沒說話，直接 kick/ban
:::

:::warning
##### Background Effect 背景特效

刷新聊天室即可終止特效

模式：
- <i class="glyphicon glyphicon-cloud"></i>下雪
- <i class="glyphicon glyphicon-fire"></i>煙花
- <i class="glyphicon glyphicon-sort"></i>電梯



:::

:::warning
##### Guess the number 猜數字遊戲

![](https://i.imgur.com/p3aaoEu.png)

設定題目：
- 方法 1：直接用 `/start` 觸發，數字會隨機生成
- 方法 2：輸入四位數字並按下 <i id="list_type" class="glyphicon glyphicon glyphicon-pencil"></i> 完成設置，按下 <i class="glyphicon glyphicon-volume-up"></i> 宣佈遊戲開始

簡易規則：每次系統提示內容為 - NANB
A：數字正確且位置正確
B：數字正確但位置錯誤
例子：隨機數為 1658 ，聊天室輸入 2680，系統會顯示 2680：1A1B
:::

:::warning
##### Hidden Lounge 亞特蘭蒂斯

![](https://i.imgur.com/pJbRvVN.png)

<i id="" class="glyphicon glyphicon-log-in"></i> 進入隱藏房大廳
- 不填 sheet ID 直接用公用的隱藏房大廳
- 填 ID 後，按 <i id="" class="glyphicon glyphicon-pencil"></i> 使用私人大廳

![](https://i.imgur.com/WedLAo2.png)
進入大廳之後 可填入不同 ID 切換不同的大廳

注：[如何找到 google ID](http://hk.uwenku.com/question/p-kjrgjrcw-gn.html)
:::



:::warning
### 語音房

##### P2P CHAT 兩個人的語音房
![](https://i.imgur.com/7YWNfyA.png)



##### ROOM CHAT 一群人的語音房
![](https://i.imgur.com/4c63kyl.png)
###### 功能：
- 語音系統
- 屏幕分享
#####
- <i class="glyphicon glyphicon-phone-alt"></i> 開啟語音房（群聊房主限定）
- <i class="glyphicon glyphicon-earphone"></i> 加入語音房
     * host  房間code會自動生成
     * join  輸入房間code進入語音房
     * hall  壞掉了

###### 步驟：
1. 加入語音房
2. 設置麥克風/分享畫面
3. <i class="icon icon-phone"></i> 點擊加入會話
4. <i class="icon icon-list"></i> 點擊觀看分享
:::



### Sticker

:::success
![](https://i.imgur.com/jbrZK9G.png)

#### 功能鍵
<i class="glyphicon glyphicon-refresh"></i> 還原最初預設的十個貼圖
<i class="glyphicon glyphicon-plus"></i> 新增貼圖
<i class="glyphicon glyphicon-minus"></i> 刪除選中的貼圖
<i class="glyphicon glyphicon-shopping-cart"></i> 前往貼圖網站
:::

## 後台設定

根據設定儲存的位置，分作同步和本地。

同步設定的空間上限：8,192 bytes
（所以小心 event action 不要塞爆了）

本地設定的空間上限：5,242,880 bytes

同步的設定（包括你的 cookie）會同步，
所以可以同一個 Google 帳號在不同電腦之間共享同步設定。

### Sync 同步設定

:::success
![](https://i.imgur.com/qMorC1g.png)

#### 功能鍵

<i class="glyphicon glyphicon-question-sign"></i> 前往說明頁面
<i class="glyphicon glyphicon-info-sign"></i> 關於作者
<i class="glyphicon glyphicon-refresh"></i> 重製所有設定
<i class="glyphicon glyphicon-export"></i> 匯出設定
選擇檔案：匯入設定

點擊 `HELP` 可以開啟該設定的介紹頁面。

### Quick Regex Tester （快速正則表達式測試）

快速測試，便於設定規則

### Music Delay （樂曲延遲）

在連續播放模式中，歌曲和歌曲間隔。
（房間成員間有同步問題，有時歌曲會蓋到，所以設定延遲）
:::

:::warning
### Timer Configuration (定時器配置)

#### 功能

定時執行定義的動作。

#### 格式

```js
分鐘數, "函數", ["參數", ...]
```

#### 函數

提供的函數可以參考[函數說明](#函數說明)


#### 特殊變量

可以在參數裡面使用特殊時間變量：
- `%年` 年份，中文數字
- `%月` 月份，中文數字（一至十二）
- `%日` 日期，中文數字
- `%星` 星期幾，中文
- `%Y` 年份，四位數字西元年
- `%M` 月份，一至二位數字
- `%D` 日期，一至二位數字
- `%d` 星期幾，英文全寫
- `%H` 時，數字（24 時制）
- `%h` 時，數字（12 時制）
- `%c` 上下午，英文 `a.m.` `p.m.`
- `%m` 分，數字
- `%s` 秒，數字
- `%%` 轉義字符 `%`

#### 範例
```js
10, "msg", ["every 10 mins report once!"]
2, "msg", ["It's a Report Message", "Now is %H:%m!"]
```
:::

:::warning
### Welcome Configuration (歡迎詞配置)

#### 功能

有人進入房間後，如果名稱匹配[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)，則自動發出歡迎詞。

#### 格式

兩種格式，歡迎詞可以多個（隨機選擇並發出）
```js
"用戶名(正則表達式)", "歡迎詞"
"用戶名(正則表達式)", ["歡迎詞", "歡迎詞", ...]
```

#### 注意
- 記得要**加雙引號** `"`。
- 由上往下匹配，匹配成功則不繼續往下匹配規則。
- 空字串 `""` 或正則字串 `".*"` 可以**匹配全部**。


#### 特殊變量
- `$user` 進入房間的成員名稱。
- `$$` 轉義字符 `$`。

#### 範例

對名字裡面有 lambda 和其後跟著 cat （中間可能夾有一些字）的使用者說 `hello, kitty`，對其他人則說 `hello/HI!!` 加上 `使用者名稱`。

```js
"lambda.*cat", "hello, kitty"
".*", ["hello $user", "HI!! $user"]
```
:::

:::warning
### WhiteList Configuration (白名單配置)

#### 功能

使用[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)，自動踢出**不在名單內**的特定使用者。

#### 格式
```js
用戶名(正則表達式)
```

#### 注意
- 記得要**不加雙引號**（除非想匹配有雙引號的 ID）。


#### 範例

只允許以 `cat` **結尾**或是`神秘`**開頭**為名稱的使用者。

```
cat$
^神秘
```
:::

:::warning
### BlackList Configuration (黑名單配置)

#### 功能

使用[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)，自動踢出**名單內**的特定使用者。

#### 格式
```js
用戶名(正則表達式)
```

#### 注意
- 記得要**不加雙引號**（除非想匹配有雙引號的 ID）。


#### 範例
踢出名字含有 `otoko` 的使用者及一些符合條件的機器人。

```js
otoko
机器人|機器人
小冰|小氷|测试姬
```
:::

:::warning
### BanAbuse Configuration (禁止詞配置)

#### 功能
使用[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)過濾聊天內容，自動踢出**說出禁用詞**的使用者。

#### 格式
```js
禁用詞(正則表達式)
```

#### 注意
- 記得要**不加雙引號**（除非想匹配有雙引號的禁用詞）。


#### 範例
聊天內容含有說到 `狗` 或是 `阿姆斯特朗炮` 的成員會被踢出。
```js
狗
阿姆斯特朗炮
```
:::

:::warning
### EventAction Configuration (事件動作配置)

#### 功能

對於一些事件，這裡提供一些函數，可以訂一些相應的動作。
定義的動作只有在用戶**名稱**及用戶發送的**內容**符合[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions) (RegExp) 才會被觸發。
其實前面的功能：歡迎詞/白名單/黑名單/禁止詞，都可用此功能實作。

#### 格式
```js
"事件類型", "用戶匹配", "內容匹配", "函數", ["參數", ...]
["事件類型", ...], "用戶匹配", "內容匹配", "函數", ["參數", ...]
```

#### 事件類型

當...
- `new-host` 房主易位
- `room-profile` 房名改變
- `new-description` 房間敘述改變
- `join` 成員加入
- `leave` 成員離開
- `kick` 有人被踢出
- `ban` 有人被禁止進入
- `unban` 有人被解除禁止進入
- `dm` 私訊
- `msg` 普通訊息
- `me` 以 `/me` 發出的訊息（小字）
- `dmto` 自己私訊給別人
- `roll` 有人搖了一個人
- `music` 播放音樂（某人播放了音樂）
- `musicbeg` 音樂開始（進度條開始）
- `musicend` 音樂結束（進度條結束）

#### 用戶匹配

用戶匹配可以是一個人名的 RegExp 或是 Tripcode 的 RegExp，
如果兩個規則都有的話則都需要滿足。
```js
"浪打" <- 名字有 "浪打" 的人
"#.*cat" <- tc 有 cat 的人（忽略大小寫）
"浪打#.*cat" <- 名字有 "浪打" 且 tc 有 cat 的人
```

#### 內容匹配

內容匹配則是單純的一串 RegExp。

#### 函數

提供的函數可以參考[函數說明](#函數說明)

#### 特殊參數變量

- `%Y` 年份，四位數字西元年
- `%年` 年份，中文數字
- `%M` 月份，一至二位數字
- `%月` 月份，中文數字（一至十二）
- `%D` 日期，一至二位數字
- `%日` 日期，中文數字
- `%d` 星期幾，英文全寫
- `%星` 星期幾，中文
- `%H` 時，數字（24 時制）
- `%h` 時，數字（12 時制）
- `%c` 上下午，英文 `a.m.` `p.m.`
- `%m` 分，數字
- `%s` 秒，數字
- `%%` 轉義字符 `%`

* `$user` 發送訊息的使用者名稱
* `$cont` 使用者發送的內容
* `$args` 使用者發送內容第一個空格後的所有內容
   使用者發送：`play BUMP OF CHICKEN「Hello,world!」`
   `$args`：`BUMP OF CHICKEN「Hello,world!」`
* `$url` 使用者夾上的 URL
* `$$` 轉義字符 `$`

#### 特殊參數用法

這裡還有一些特殊用法。
對於收到的訊息，會以空格分開成參數列，而用引號可以避免分開。
而對分開的內容，可以用以下方法作為參數。

- `$N` N 為數字，以數字取第 N 個參數，從零開始。
- `$[N-M]` 取從 N 到 M 的參數。N 不給則從零開始，M 不給取到最後。

#### 特殊函數

- `$tenor(keyword)` 回傳 tenor 搜尋的 gif URL
- `$giphy(keyword)` 回傳 giphy 搜尋的 gif URL

#### 參數圖示

```
this is  a  message send from user
---- --  -  ------- ---- ---- ----
$0   $1  $2 $3      $4   $5   $6
----------------------------------
$cont

發送字串：
this is a "another message" send from 'another user'

引號會被拿掉，但裡面空格不會被切開：
this is a  another message  send from  another user
---- -- -  ---------------  ---- ----  ------------
$0   $1 $2 $3               $4   $5    $6
     ----------------------------------------------
     $args
---------  --------------------- ------------------
$[-2]      $[3-4]                $[5-]
---------------------------------------------------
$[-]
```

#### 範例

```
"msg", "", "^/tenor", "umsg", ["$tenor($args)", "$args"]
"msg", "", "^/giphy", "umsg", ["$giphy($args)", "$args"]
"msg", "", "^/play", "plym", ["$args"]
"leave", "", "", "msg", ["$user bye!"]
```

#### 調用

```
/tenor 貓
/giphy iron man
/play yellow
```
:::

#### 函數說明

:::warning
函數 [參數列] 說明：
- `name` `["名稱", "名稱", ...]`
  選擇一個名稱重新設定房間名稱。
- `desc` `["描述", "描述", ...]`
  選擇一個描述重新設定房間描述。
- `msg` `["訊息", "訊息", ...]`
  從訊息中選擇一個推送。
- `umsg` `["URL", "訊息", ...]`
  夾帶 URL 並隨機選擇一個訊息推送。
- `dm` `["使用者名稱", "訊息", "訊息", ...]`
  私訊使用者，選擇一個訊息私訊。
- `udm` `["使用者名稱", "URL", "訊息", ...]`
  私訊使用者，夾帶 URL 並隨機選擇一個訊息私訊。
- `kick` `["使用者名稱"]`
  踢出使用者。
- `ban` `["使用者名稱"]`
  踢出並屏蔽使用者。
- `banrpt` `["使用者名稱"]`
  踢出並屏蔽舉報使用者。
- `plym` `["歌曲關鍵字"]`
  `plym` `["歌曲關鍵字", "數字"]`
  `plym` `["歌曲關鍵字", "音源"]`
  `plym` `["歌曲關鍵字", "數字", "音源"]`
  `plym` `["歌曲關鍵字", "音源", "數字"]`
  播放音樂。
  1. "關鍵字"：歌曲關鍵字。
  2. "數字"：第 "數字" 個搜尋結果。
  3. "音源"：音源，目前有 "千" 和 "易", "狗", "我" 及 "Ｙ" 可以使用。
- `addm` `["歌曲關鍵字"]`
  `addm` `["歌曲關鍵字", "數字"]`
  `addm` `["歌曲關鍵字", "音源"]`
  `addm` `["歌曲關鍵字", "數字", "音源"]`
  `addm` `["歌曲關鍵字", "音源", "數字"]`
  加入音樂至待播清單。
  1. "關鍵字"：歌曲關鍵字。
  2. "數字"：第 "數字" 個搜尋結果。
  3. "音源"：音源，目前有 "千" 和 "易", "狗", "我" 及 "Ｙ" 可以使用。
- `delm` `["數字"]`
  從清單刪除音樂（依索引數字）。
- `lstm` `[]`
  列出待播清單。
- `nxtm` `[]`
  播放下一首曲子。
- `pndm` `[]`
  `pndm` `["歌曲關鍵字"]`
  `pndm` `["歌曲關鍵字", "數字"]`
  `pndm` `["歌曲關鍵字", "音源"]`
  `pndm` `["歌曲關鍵字", "數字", "音源"]`
  `pndm` `["歌曲關鍵字", "音源", "數字"]`
  無參數則列出待播清單。
  如當前沒音樂，播放音樂。
  如有音樂，將音樂加入清單
  如關鍵字為空字串，列出待播清單。
  1. "關鍵字"：歌曲關鍵字。
  2. "數字"：第 "數字" 個搜尋結果。
  3. "音源"：音源，目前有 "千" 和 "易", "狗", "我" 及 "Ｙ" 可以使用。
- `schm` `["歌曲關鍵字"]`
  `schm` `["歌曲關鍵字", "音源"]`
  列出搜尋結果。
  1. "關鍵字"：歌曲關鍵字。
  2. "音源"：音源，目前有 "千" 和 "易", "狗", "我" 及 "Ｙ" 可以使用。
- `horm` `["使用者名稱"]`
  轉移房主權限給該使用者。
- `ocdr` `[]`
  離開房間又進入房間。
- `gofr` `["房間名稱(RegExp)"]`
  前往符合房間名稱的房間。若失敗則回到原房間。
- `func` `["浪語腳本分類和名稱"]`
  純函數執行浪語腳本（執行存的變數沒有作用）
- `script` `["浪語腳本分類和名稱"]`
  提供 `env` 這個變數以執行浪語腳本。

> `me` 可以用 `/me + 推送訊息` 以 msg 達成。

> 浪語腳本綁定可以參考 bs-pkgs （浪語套件包）的 `action/wb.js`
:::

### Local 本地設定

:::success
![](https://i.imgur.com/NMY9ZAx.png)

#### 功能鍵

<i class="glyphicon glyphicon-question-sign"></i> 前往說明頁面
<i class="glyphicon glyphicon-info-sign"></i> 關於作者
<i class="glyphicon glyphicon-refresh"></i> 重製所有設定
<i class="glyphicon glyphicon-export"></i> 匯出設定
選擇檔案：匯入設定

#### 模組資料

你可以照著格式編輯他。
:::

### Script 浪語終端

:::success

對，你沒看錯，這插件內建了一個小小的程式語言。 ٩(๑>◡<๑)۶

![](https://i.imgur.com/bmRYjbn.png)

#### 側欄按鍵

- Package 套件管理器
- ToggleRoom 隱藏/顯示右側聊天室
- Sublime bindings 顯示編輯器快捷鍵
- 腳本運行相關按鍵
    - Introduction 浪語介紹
    - Save 儲存編輯器腳本
    - Clear 清除腳本運行結果
    - Pause 清除正在運行的腳本
    - Execute 運行編輯器的腳本

#### 編輯器和直譯終端

Save, Clear, Pause, Execute 等快捷鍵只有游標在編輯器裡面時才會生效。
運行一段腳本後，你可以用在直譯終端做測試，他會以運行後的環境執行。
`ctrl` + `enter` 執行直譯終端的腳本（游標要在終端裡面）。
:::

:::warning
#### 浪語

細節請參考 [語言介紹](./script-zh.html)。
:::

:::warning
#### 套件管理器
![](https://i.imgur.com/wPOJvM4.png)

選擇 mirror 後，點選 update 更新套件索引。
之後可以選擇分類和套件，可以把他載入到編輯器或是儲存到本地。

![](https://i.imgur.com/PpMOgh3.png)

本地的套件勾選後，可以選擇預載入，或是刪除。
重新開啟視窗，如果是有句選，就代表為預載入套件。

![](https://i.imgur.com/2BJoP6w.png)

確定預載入後，在編輯器以套件名作為函數調用。
（套件通常會提供這個函數，但具體還是要看套件內容定義）

![](https://i.imgur.com/qsuuL1q.png)

運行成功！

![](https://i.imgur.com/XbC57JG.png)

你也可以 fork 一份 [bs-pkgs](https://gitee.com/DrrrChatbots/bs-pkgs) 維護一個 mirror，
然後透過 `add_mirror(alias, repo)` 來添加你的 mirror。

![](https://i.imgur.com/XpQ4dcG.png)

或者直接呼叫也行
![](https://i.imgur.com/l7oYdK5.png)

要刪除的話就呼叫 `del_mirror(alias)`。

![](https://i.imgur.com/NV1iXRn.png)
:::


## 特別誌謝

### 個人

:::success
@LanCeLoT
~~這個人什麼都沒做~~ < 他自己寫的
~~說明書編寫上幫了很大的忙~~。 < 其實並沒有_(:з」∠)_
:::

:::success
@iijjoy
kiwi browser 的愛好者，貌似是句點君？
在 kiwi 上幫忙做了很多測試。
:::

### 部屋

:::success
**上帝酒屋**

酒屋客人們（[@独眼驁](https://drrr.wiki/@%E7%8B%AC%E7%9C%BC%E9%A9%81), [@鳄猫](https://drrr.wiki/@%E9%B3%84%E7%8C%AB), @codeine, @Lang, @天羽, [@大庭叶藏](https://drrr.wiki/@%E5%A4%A7%E5%BA%AD%E5%8F%B6%E8%97%8F), [@千秋](https://drrr.wiki/@%E5%8D%83%E7%A7%8B%E7%8B%90%E7%8B%B8), @Y ...) 幫忙測試狼人殺腳本

以及在編寫此文檔時偶遇的上帝酒屋客人兼使用者 @課長
:::

:::success
**休息室 || 限熟**
房主：@莉可
:::

:::success
**湖神的池子**
神：@湖神
湖神眾：@小光、@小周、@小草、@影子（、隱藏的@卡卡）
:::

:::success
**𝓯𝓪𝔂𝓮的忧鬱**
房主：[@faye](https://drrr.wiki/@faye)
:::

:::success
**窗边**
房主：[@玄黛](https://drrr.wiki/@%E7%8E%84%E9%BB%9B)
房客：[@smile](https://drrr.wiki/@smile)
:::

:::success
**雾之湖**
房主：[@琪露诺](https://drrr.wiki/User:%E7%AE%97%E6%95%B0%E5%A4%A9%E6%89%8D%E7%90%AA%E9%9C%B2%E8%AF%BA)
:::

:::success
**万人的死角**
房主：[@Kyon](https://drrr.wiki/@Kyon)
房客：[@CarpeDiem](https://drrr.wiki/@CarpeDiem)
:::

:::success
**掛**
房主：@音子
房客：[@北極](https://drrr.wiki/@%E5%8C%97%E6%A5%B5)（在草創期的大力宣傳者）、[@P](https://drrr.wiki/@P)、@小梁、@可賊、@澐
:::

:::success
**小挂屋**
房主：@周夢蝶#.MengDI//. aka 周總
房客：[@小柴](https://drrr.wiki/User:%E5%B0%8F%E6%9F%B4) aka 柴總、魚 aka 魚總
:::

:::success
**九十九的画室**
房主：[@九十九](https://drrr.wiki/%E4%B9%9D%E5%8D%81%E4%B9%9D)、@二號姬
:::

:::success
**[摘星塔](https://drrr.wiki/zh-hans/@%E6%91%98%E6%98%9F%E5%A1%94)**
房主：[@少女](https://drrr.wiki/@%E5%B0%91%E5%A5%B3)
:::

:::success
**自习区**
房主：[@A_Bot](https://drrr.wiki/@A_Bot)、[@机器人小绿](https://drrr.wiki/@%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%B0%8F%E7%BB%BF)
:::

:::success
**不计我故然**
房主：[@x](https://drrr.wiki/@x)
:::

## 相關鏈結

[浪打](https://drrr.wiki/@%E6%B5%AA%E6%89%93%E8%B2%93)
[DrrrWiKi](https://drrr.wiki/%E6%B5%AA%E6%89%93%E8%81%8A%E5%A4%A9%E6%8F%92%E4%BB%B6)
[QQ 討論群](https://jq.qq.com/?_wv=1027&k=7JjKVhV0)
[Discord QA 群](https://discord.com/invite/BBCw3UY)
[Gitee Organization](https://gitee.com/DrrrChatbots)
[GitHub Organization](https://github.com/DrrrChatbots)
