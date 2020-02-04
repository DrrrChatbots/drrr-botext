# DRRR 機器人插件設定手冊

## 安裝

請至 [Google 線上應用程式商店](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) 安裝。

## 使用界面

當有關鍵字時，操作界面會有細微差別（右下三個功能鍵）。

![](https://i.imgur.com/TXD47AE.png)

![](https://i.imgur.com/KCXmcRM.png)


### 圖示說明

#### 設定：
<i class="glyphicon glyphicon-refresh"></i> 重製所有設定
<i class="glyphicon glyphicon-cog"></i> 前往後台設定

#### 播放模式（點擊切換）：
- <i class="glyphicon glyphicon-cd"></i>清單模式-歌曲結束後自動播放待播清單下一首 
- <i class="glyphicon glyphicon-music"></i>單曲模式-播完即停

#### 音源：
- **易** 網易音樂
- **千** 千千音樂盒

#### Search Keyword and Play（搜尋列）：
輸入關鍵字配合功能按查詢。
輸入後直接：
- Enter 可以按下左功能鍵。
- Shift + Enter 可以按下中功能鍵。
- Ctrl + Enter 可以按下右功能鍵。

#### 功能鍵（無關鍵字）：
- <i class="glyphicon glyphicon-list"></i> 展開待播清單
  - <i class="glyphicon glyphicon-remove"></i> 從待播刪除 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-heart"></i> 收藏樂曲
![](https://i.imgur.com/sxquWLj.png)
- <i class="glyphicon glyphicon-play"></i> 播放待播曲目
- <i class="glyphicon glyphicon-heart"></i> 展開收藏清單
  - <i class="glyphicon glyphicon-plus"></i> 加入待播 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-remove"></i> 從收藏刪除
![](https://i.imgur.com/DU68G8m.png)



#### 功能鍵（有關鍵字）：
- <i class="glyphicon glyphicon-search"></i> 展開搜尋結果
  - <i class="glyphicon glyphicon-plus"></i> 加入待播 <i class="glyphicon glyphicon-play"></i> 立即播放 <i class="glyphicon glyphicon-heart"></i> 收藏樂曲
![](https://i.imgur.com/5zpO2Tc.png)
- <i class="glyphicon glyphicon-play"></i> 播放最關聯搜尋結果
- <i class="glyphicon glyphicon-plus"></i> 加入最關聯結果至待播清單



### 功能說明

- Timer <i class="glyphicon glyphicon-cog"></i>
  定時發訊息
- Welcome <i class="glyphicon glyphicon-cog"></i>
  自動送出歡迎詞
- Whitelist <i class="glyphicon glyphicon-cog"></i>
  房間白名單
- Blacklist <i class="glyphicon glyphicon-cog"></i>
  房間黑名單
- BanAbuse <i class="glyphicon glyphicon-cog"></i>
  禁止用語名單
- AutoDM 
  發訊後自動鎖定上次私訊對象
- Always/me 
  自動加上 /me 指令

## 後台設定

![](https://i.imgur.com/MPb087T.png)



### Quick Regex Tester （快速正則表達式測試）

快速測試，便於設定規則

### Music Delay （樂曲延遲）

在連續播放模式中，歌曲和歌曲間隔。
（房間成員間有同步問題，有時歌曲會蓋到，所以設定延遲）

### Timer Configuration (定時器配置)

功能：定時推播訊息。
格式：兩種格式，推播字串可以多個（隨機選擇並發出）
```js
分鐘數, "字串"
分鐘數, ["推播字串", "推播字串", ...]
```

注意：字串記得要**加雙引號** `"`。

特殊時間變量：

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
10, "every 10 mins report once!"
2, ["It's a Report Message", "Now is %H:%M!"]
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

函數[參數]：

- `msg` 推送訊息 `["要推送的訊息"]`
- `dm` 私訊 `["使用者名稱", "訊息"]`
- `kick` 踢出 `["使用者名稱"]`
- `plym` 播放音樂 `["歌曲關鍵字"]`
- `addm` 加入音樂至清單 `["歌曲關鍵字"]`
- `delm` 從清單刪除音樂（依索引數字） `["數字"]`
- `lstm` 列出播放清單 `[]`
- `nxtm` 播放下一首曲子
- `pndm` 將音樂加入清單或列出清單 `["歌曲關鍵字"]`

（`me` 可以用 `/me + 推送訊息` 以 msg 達成。） 
（`pndm` 的 `"歌曲關鍵字"` 如果是空字串，則列出清單）

特殊參數變量：

- `$user` 發送訊息的使用者名稱
- `$cont` 使用者發送的內容
- `$args` 使用者發送內容第一個空格後的所有內容
   使用者發送：`play BUMP OF CHICKEN「Hello,world!」`
   `$args`：`BUMP OF CHICKEN「Hello,world!」`
- `$url` 使用者夾上的 URL
- `$$` 轉義字符 `$`

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
"msg", "", "^/play", "plym", ["$args"]
"msg", "", "^/next", "nxtm", []
"msg", "", "^/add", "addm", ["$args"]
"msg", "", "^/del", "delm", ["$1"]
"msg", "", "^/list", "lstm", []
"msg", "", "^/pending", "pndm", ["$args"]
```

使用者發送以下字串可以觸發設定好的功能：

```
/play 剛好遇見你
/add  山丘
/pending 平凡之路
/pending
/del  1
/list
/next
```

