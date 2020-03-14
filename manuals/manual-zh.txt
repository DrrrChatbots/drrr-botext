# DRRR 機器人插件設定手冊

## 安裝

電腦版：

由於是 Chrome 插件，所以請使用 Chrome 瀏覽器，並至 [Google 線上應用程式商店](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) 安裝。

另外如果是用 Opera 的話，可以嘗試 Opera 這款 [Install Chrome Extensions](https://addons.opera.com/zh-tw/extensions/details/install-chrome-extensions/) 裝裝看。

手機端：

手機版的 Chrome 並不提供在手機上的插件安裝，不過你可以使用 Yandex 瀏覽器([Android](https://play.google.com/store/apps/details?id=ru.yandex.searchplugin&hl=en_US), [iOS](https://apps.apple.com/tw/app/yandex-browser/id483693909))，他用的是 Chrome 內核，所以一樣可以到 [Google 線上應用程式商店](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) 安裝。


## 使用界面


<i class="glyphicon glyphicon-question-sign"></i> 前往本說明頁面 <i class="glyphicon glyphicon-cog"></i> 前往後台設定

![](https://i.imgur.com/hxIuCTT.png)


### 功能開關（<i class="glyphicon glyphicon-cog"></i> 表示須先設定才能開啟）

![](https://i.imgur.com/dQb3byt.png)

- AutoDM 
  發訊後自動鎖定上次私訊對象
- Timer <i class="glyphicon glyphicon-cog"></i>
  定時執行設定的動作
- Black/Whitelist <i class="glyphicon glyphicon-cog"></i>
  房間黑/白名單（自動踢出訪客）
- Welcome <i class="glyphicon glyphicon-cog"></i>
  訪客進房，自動送出歡迎詞
- BanAbuse <i class="glyphicon glyphicon-cog"></i>
  禁止用語名單，當用戶用語匹配到禁用詞，會被自動踢出
- Always/me 
  自動加上 /me 指令
- EventAction
  當事件發生，執行設定的動作
- RoomKeeper
  自動發訊息給自己，防止房間消失
- TgBotLogger
  將聊天訊息透過 Telegram Bot 紀錄下來
- RoomNotification
  當瀏覽器頁面不在聊天室時，送出聊天內容通知

### 功能頁籤

#### Bio

![](https://i.imgur.com/hW9d7oS.png)

🔖 當前登入帳號
💾 已儲存的帳號
<i class="glyphicon glyphicon-transfer"></i> 切換選中的帳號
<i class="glyphicon glyphicon-floppy-save"></i> 儲存當前帳號
<i class="glyphicon glyphicon-floppy-remove"></i> 刪除選中的帳號
<i class="glyphicon glyphicon-qrcode"></i> tripcode 探索器

#### Friends

![](https://i.imgur.com/myrXucu.png)

##### 等房功能

定時查看房間是否有空位，如果有則跳轉該房。

匹配規則模式：
- <i class="glyphicon glyphicon-barcode"></i> 以房間 ID
- <i class="glyphicon glyphicon-lock"></i> 以 tripcode
- <i class="glyphicon glyphicon-user"></i> 以使用者名稱
- <i class="glyphicon glyphicon-home"></i> 以房間名稱

<i class="glyphicon glyphicon-tag"></i> 儲存規則

- <i class="glyphicon glyphicon-send"></i> 直接跳轉
- <i class="glyphicon glyphicon-comment"></i> 跳轉前詢問

##### 搜尋使用者/房間

搜尋模式：
- <i class="glyphicon glyphicon-lock"></i> 以 tripcode 搜尋
- <i class="glyphicon glyphicon-user"></i> 以使用者名稱搜尋
- <i class="glyphicon glyphicon-home"></i> 以房間名稱搜尋

<i class="glyphicon glyphicon-search"></i> 搜尋
<i class="glyphicon glyphicon-plus"></i> 加入至收藏

##### 收藏通知/列表

<i class="glyphicon glyphicon-volume-up"></i> 開啟收藏通知（有人上線或房間創立）
<i class="glyphicon glyphicon-list"></i> 顯示所有收藏規則
<i class="glyphicon glyphicon-lock"></i> 顯示線上所有符合的 tripcode 使用者
<i class="glyphicon glyphicon-user"></i> 顯示線上所有符合規則的使用者
<i class="glyphicon glyphicon-home"></i> 顯示線上所有符合規則的房間
<i class="glyphicon glyphicon-globe"></i> 顯示線上所有房間

#### Music


![](https://i.imgur.com/w60X55P.png)


##### 播放模式（點擊切換）
- <i class="glyphicon glyphicon-cd"></i>清單模式-歌曲結束後自動播放待播清單下一首 
- <i class="glyphicon glyphicon-music"></i>單曲模式-播完即停

##### 音源
- **易** 網易音樂
- **千** 千千音樂盒
- **Ｙ** YouTube

##### Search Keyword and Play（搜尋列）

輸入關鍵字配合功能鍵查詢。
輸入後直接：
- Enter 可以按下左功能鍵。
- Shift + Enter 可以按下中功能鍵。
- Ctrl + Enter 可以按下右功能鍵。

### 功能鍵（無關鍵字）：

![](https://i.imgur.com/lUoXg90.png)

<i class="glyphicon glyphicon-list"></i> 展開待播清單 <i class="glyphicon glyphicon-play"></i> 播放待播曲目 <i class="glyphicon glyphicon-heart"></i> 展開收藏清單

---

![](https://i.imgur.com/BaeZgDK.png)

<i class="glyphicon glyphicon-remove"></i> 從待播刪除 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-heart"></i> 收藏樂曲

---

![](https://i.imgur.com/G2MhLFm.png)

<i class="glyphicon glyphicon-plus"></i> 加入待播 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-remove"></i> 從收藏刪除

---



### 功能鍵（有關鍵字）

![](https://i.imgur.com/zqXoPW8.png)

<i class="glyphicon glyphicon-search"></i> 展開搜尋結果 <i class="glyphicon glyphicon-play"></i> 播放最關聯搜尋結果 <i class="glyphicon glyphicon-plus"></i> 加入最關聯結果至待播清單

---

![](https://i.imgur.com/dp0X0a8.png)

<i class="glyphicon glyphicon-plus"></i> 加入待播 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-heart"></i> 收藏樂曲

---



#### GamePanel

![](https://i.imgur.com/nMHidhk.png)

選擇遊戲，只有被選中時，才會開啟該遊戲。

#### LineSticker

![](https://i.imgur.com/fcQCFBW.png)

<i class="glyphicon glyphicon-refresh"></i> 還原最初預設的十個貼圖
<i class="glyphicon glyphicon-plus"></i> 新增貼圖
<i class="glyphicon glyphicon-minus"></i> 刪除選中的貼圖
<i class="glyphicon glyphicon-shopping-cart"></i> 前往貼圖網站

## 後台設定

<i class="glyphicon glyphicon-question-sign"></i> 前往說明頁面 <i class="glyphicon glyphicon-info-sign"></i> 關於作者 <i class="glyphicon glyphicon-refresh"></i> 重製所有設定
點擊 HELP 可以開啟該設定的介紹頁面。

![](https://i.imgur.com/JllLXvZ.png)


### Quick Regex Tester （快速正則表達式測試）

快速測試，便於設定規則

### Music Delay （樂曲延遲）

在連續播放模式中，歌曲和歌曲間隔。
（房間成員間有同步問題，有時歌曲會蓋到，所以設定延遲）

### Timer Configuration (定時器配置)

功能：定時執行定義的動作。
格式：兩種格式，推播字串可以多個（隨機選擇並發出），URL 可加可不加


```js
分鐘數, "函數", ["參數", ...]
```

函數 [參數列] 說明：

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
- `plym` `["歌曲關鍵字"]` 
  `plym` `["歌曲關鍵字", "數字"]`
  `plym` `["歌曲關鍵字", "音源"]`
  `plym` `["歌曲關鍵字", "數字", "音源"]`
  `plym` `["歌曲關鍵字", "音源", "數字"]`
  播放音樂。
  1. "關鍵字"：歌曲關鍵字。
  2. "數字"：第 "數字" 個搜尋結果。
  3. "音源"：音源，目前有 "千" 和 "易" 及 "Ｙ" 可以使用。
- `addm` `["歌曲關鍵字"]` 
  `addm` `["歌曲關鍵字", "數字"]`
  `addm` `["歌曲關鍵字", "音源"]`
  `addm` `["歌曲關鍵字", "數字", "音源"]`
  `addm` `["歌曲關鍵字", "音源", "數字"]`
  加入音樂至待播清單。
  1. "關鍵字"：歌曲關鍵字。
  2. "數字"：第 "數字" 個搜尋結果。
  3. "音源"：音源，目前有 "千" 和 "易" 及 "Ｙ" 可以使用。
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
  3. "音源"：音源，目前有 "千" 和 "易" 可以使用。
- `schm` `["歌曲關鍵字"]` 
  `schm` `["歌曲關鍵字", "音源"]`
  列出搜尋結果。
  1. "關鍵字"：歌曲關鍵字。
  2. "音源"：音源，目前有 "千" 和 "易" 可以使用。
- `horm` `["使用者名稱"]`
  轉移房主權限給該使用者。
- `ocdr` `[]`
  離開房間又進入房間。
- `gofr` `["房間名稱(RegExp)"]`
  前往符合房間名稱的房間。若失敗則回到源房間。
  
（`me` 可以用 `/me + 推送訊息` 以 msg 達成。） ～

可以在參數裡面使用特殊時間變量：

- `%Y` 年份，四位數字西元年
- `%年` 年份，中文數字
- `%M` 月份，一至二位數字
- `%月` 月份，中文數字（一至十二）
- `%D` 日期，一至二位數字
- `%日` 日期，中文數字
- `%d` 禮拜幾，英文全寫
- `%拜` 禮拜幾，中文
- `%H` 時，數字（24 時制）
- `%h` 時，數字（12 時制）
- `%c` 上下午，英文 `a.m.` `p.m.`
- `%m` 分，數字
- `%s` 秒，數字
- `%%` 轉義字符 `%`



範例：
```js
10, "msg", ["every 10 mins report once!"]
2, "msg", ["It's a Report Message", "Now is %H:%m!"]
```
### Welcome Configuration (歡迎詞配置)

功能：有人進入房間後，如果名稱匹配[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)，則自動發出歡迎詞。
格式： 兩種格式，歡迎詞可以多個（隨機選擇並發出）
```js
"用戶名(正則表達式)", "歡迎詞"
"用戶名(正則表達式)", ["歡迎詞", "歡迎詞", ...]
```

注意：
- 記得要**加雙引號** `"`。
- 由上往下匹配，匹配成功則不繼續往下匹配規則。
- 空字串 `""` 或正則字串 `".*"` 可以**匹配全部**。


特殊變量：
- `$user` 進入房間的成員名稱。
- `$$` 轉義字符 `$`。

範例：對名字裡面有 lambda 和其後跟著 cat （中間可能夾有一些字）的使用者說 `hello, kitty`，對其他人則說 `hello/HI!!` 加上 `使用者名稱`。

```js
"lambda.*cat", "hello, kitty"
".*", ["hello $user", "HI!! $user"]
```

### WhiteList Configuration (白名單配置)

功能：使用[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)，自動踢出**不在名單內**的特定使用者。
格式：
```js
用戶名(正則表達式)
```

注意：
- 記得要**不加雙引號**（除非想匹配有雙引號的 ID）。


範例：只允許以 `cat` **結尾**或是`神秘`**開頭**為名稱的使用者。

```js
cat$
^神秘
```

### BlackList Configuration (黑名單配置)

功能：使用[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)，自動踢出**名單內**的特定使用者。
格式：
```js
用戶名(正則表達式)
```

注意：
- 記得要**不加雙引號**（除非想匹配有雙引號的 ID）。


範例：踢出名字含有 `otoko` 的使用者及一些符合條件的機器人。

```js
otoko
机器人|機器人
小冰|小氷|测试姬
```

### BanAbuse Configuration (禁止詞配置)

功能：使用[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)過濾聊天內容，自動踢出**說出禁用詞**的使用者。
格式：
```js
禁用詞(正則表達式)
```

注意：
- 記得要**不加雙引號**（除非想匹配有雙引號的禁用詞）。


範例：聊天內容含有說到 `狗` 或是 `真香` 的成員會被踢出。
```js
狗
真香
```

### EventAction Configuration (事件動作配置)

功能：對於一些事件，這裡提供一些函數，可以訂一些相應的動作。
定義的動作只有在用戶**名稱**及用戶發送的**內容**符合[正則表達式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions)才會被觸發。
其實前面的功能：歡迎詞/白名單/黑名單/禁止詞，都可用此功能實作。

格式：
```js
"事件類型", "用戶名(正則表達式)", "內容匹配(正則表達式)", "函數", ["參數", ...]
["事件類型", ...], "用戶名(正則表達式)", "內容匹配(正則表達式)", "函數", ["參數", ...]
```

事件類型：

- `me` 以 `/me` 發出的訊息
- `music` 播放音樂
- `leave` 成員離開
- `join` 成員加入
- `msg` 普通訊息
- `dm` 私訊
- `musicend` 音樂結束

函數 [參數列] 說明：

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
- `plym` `["歌曲關鍵字"]` 
  `plym` `["歌曲關鍵字", "數字"]`
  `plym` `["歌曲關鍵字", "音源"]`
  `plym` `["歌曲關鍵字", "數字", "音源"]`
  `plym` `["歌曲關鍵字", "音源", "數字"]`
  播放音樂。
  1. "關鍵字"：歌曲關鍵字。
  2. "數字"：第 "數字" 個搜尋結果。
  3. "音源"：音源，目前有 "千" 和 "易" 及 "Ｙ" 可以使用。
- `addm` `["歌曲關鍵字"]` 
  `addm` `["歌曲關鍵字", "數字"]`
  `addm` `["歌曲關鍵字", "音源"]`
  `addm` `["歌曲關鍵字", "數字", "音源"]`
  `addm` `["歌曲關鍵字", "音源", "數字"]`
  加入音樂至待播清單。
  1. "關鍵字"：歌曲關鍵字。
  2. "數字"：第 "數字" 個搜尋結果。
  3. "音源"：音源，目前有 "千" 和 "易" 及 "Ｙ" 可以使用。
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
  3. "音源"：音源，目前有 "千" 和 "易" 可以使用。
- `schm` `["歌曲關鍵字"]` 
  `schm` `["歌曲關鍵字", "音源"]`
  列出搜尋結果。
  1. "關鍵字"：歌曲關鍵字。
  2. "音源"：音源，目前有 "千" 和 "易" 可以使用。
- `horm` `["使用者名稱"]`
  轉移房主權限給該使用者。
- `ocdr` `[]`
  離開房間又進入房間。
- `gofr` `["房間名稱(RegExp)"]`
  前往符合房間名稱的房間。若失敗則回到源房間。

特殊參數變量：

- `%Y` 年份，四位數字西元年
- `%年` 年份，中文數字
- `%M` 月份，一至二位數字
- `%月` 月份，中文數字（一至十二）
- `%D` 日期，一至二位數字
- `%日` 日期，中文數字
- `%d` 禮拜幾，英文全寫
- `%拜` 禮拜幾，中文
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

這裡還有一些特殊用法。
對於收到的訊息，會以空格分開成參數列，而用引號可以避免分開。
而對分開的內容，可以用以下方法作為參數。

- `$N` N 為數字，以數字取第 N 個參數，從零開始。
- `$[N-M]` 取從 N 到 M 的參數。N 不給則從零開始，M 不給取到最後。

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


範例：接上點歌功能。

```js
"msg", "", "^/play\\\\s+(\\\\D|\\\\d\\\\S)", "plym", ["$args"]
"msg", "", "^/play\\\\s+\\\\d\\\\s+\\\\S+", "plym", ["$[2-]", "$1"]
"msg", "", "^/playsrc\\\\s+[千易]\\\\s+(\\\\D|\\\\d\\\\S)", "plym", ["$[2-]"]
"msg", "", "^/playsrc\\\\s+[千易]\\\\s+\\\\d\\\\s+\\\\S+", "plym", ["$[3-]", "$1", "$2"]
"msg", "", "^/add\\\\s+(\\\\D|\\\\d\\\\S)", "addm", ["$args"]
"msg", "", "^/add\\\\s+\\\\d\\\\s+\\\\S+", "addm", ["$[2-]", "$1"]
"msg", "", "^/addsrc\\\\s+[千易]\\\\s+(\\\\D|\\\\d\\\\S)", "addm", ["$[2-]", "$1"]
"msg", "", "^/addsrc\\\\s+[千易]\\\\s+\\\\d\\\\s+\\\\S+", "addm", ["$[3-]", "$1", "$2"]
"msg", "", "^/list", "lstm", []
"msg", "", "^/next", "nxtm", []
"msg", "", "^/del\\\\s+\\\\d+", "delm", ["$1"]
"msg", "", "^/pending\\\\s*$", "pndm", []
"msg", "", "^/pending\\\\s+(\\\\D|\\\\d\\\\S)", "pndm", ["$args"]
"msg", "", "^/pending\\\\s+\\\\d\\\\s+\\\\S+", "pndm", ["$[2-]", "$1"]
"msg", "", "^/pendsrc\\\\s+[千易]\\\\s+(\\\\D|\\\\d\\\\S)", "pndm", ["$[2-]", "$1"]
"msg", "", "^/pendsrc\\\\s+[千易]\\\\s+\\\\d\\\\s+\\\\S+", "pndm", ["$[3-]", "$1", "$2"]
"msg", "", "^/sc\\\\s+([千易]\\\\S+|[^千易])", "schm", ["$args"]
"msg", "", "^/sc\\\\s+[千易]\\\\s+\\\\S+", "schm", ["$[2-]", "$1"]
```

使用者發送以下字串可以觸發設定好的功能：

```
/play 剛好遇見你
/play 2 剛好遇見你
/playsrc 千 剛好遇見你
/play 易 2 剛好遇見你
/add  山丘
/add  2 山丘
/addsrc 千 山丘
/addsrc 易 2 山丘
/pending
/pending 平凡之路
/pending 2 平凡之路
/pendsrc 千 平凡之路
/pendsrc 易 2 平凡之路
/del  1
/list
/next
/sc 花心
/sc 千 花心
```
