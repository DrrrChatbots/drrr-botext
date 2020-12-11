export const doc_url = 'manuals/manual-zh.html'

export const infopop = `
<div id="info-modal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">關於開發者</h4>
          </div>
          <div class="modal-body">
<pre>
$ whoami
lambda.catノ#L/CaT//Hsk <br>a.k.a 浪打貓ノ，也有人叫我蘭達</pre><br>
<pre>
$ finger lambda.catノ
drrr.com 上的一般用戶，約於 2017 秋開始出沒於 drrr.com。</pre><br>
            Email 為 lambdacat.tw@gmail.com <br>
          </div>
          <div class="modal-footer">
            <button type="button"
                class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
    </div>
</div>
`


export const manual = {
  [TIMER]: {
    desc: `<p>功能：定時執行定義的動作。<br>
格式：兩種格式，推播字串可以多個（隨機選擇並發出），URL 可加可不加</p><pre><code class="js hljs">分鐘數, <span class="hljs-string">"函數"</span>, [<span class="hljs-string">"參數"</span>, ...]
</code></pre><p>函數 [參數列] 說明：</p><ul>
<li><code>msg</code> <code>["訊息", "訊息", ...]</code><br>
從訊息中選擇一個推送。</li>
<li><code>umsg</code> <code>["URL", "訊息", ...]</code><br>
夾帶 URL 並隨機選擇一個訊息推送。</li>
<li><code>dm</code> <code>["使用者名稱", "訊息", "訊息", ...]</code><br>
私訊使用者，選擇一個訊息私訊。</li>
<li><code>udm</code> <code>["使用者名稱", "URL", "訊息", ...]</code><br>
私訊使用者，夾帶 URL 並隨機選擇一個訊息私訊。</li>
<li><code>kick</code> <code>["使用者名稱"]</code><br>
踢出使用者。</li>
<li><code>ban</code> <code>["使用者名稱"]</code><br>
踢出並屏蔽使用者。</li>
<li><code>banrpt</code> <code>["使用者名稱"]</code><br>
踢出並屏蔽舉報使用者。</li>
<li><code>plym</code> <code>["歌曲關鍵字"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "數字"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "音源"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "數字", "音源"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "音源", "數字"]</code><br>
播放音樂。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“數字”：第 “數字” 個搜尋結果。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>addm</code> <code>["歌曲關鍵字"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "數字"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "音源"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "數字", "音源"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "音源", "數字"]</code><br>
加入音樂至待播清單。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“數字”：第 “數字” 個搜尋結果。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>delm</code> <code>["數字"]</code><br>
從清單刪除音樂（依索引數字）。</li>
<li><code>lstm</code> <code>[]</code><br>
列出待播清單。</li>
<li><code>nxtm</code> <code>[]</code><br>
播放下一首曲子。</li>
<li><code>pndm</code> <code>[]</code><br>
<code>pndm</code> <code>["歌曲關鍵字"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "數字"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "音源"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "數字", "音源"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "音源", "數字"]</code><br>
無參數則列出待播清單。<br>
如當前沒音樂，播放音樂。<br>
如有音樂，將音樂加入清單<br>
如關鍵字為空字串，列出待播清單。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“數字”：第 “數字” 個搜尋結果。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>schm</code> <code>["歌曲關鍵字"]</code><br>
<code>schm</code> <code>["歌曲關鍵字", "音源"]</code><br>
列出搜尋結果。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>horm</code> <code>["使用者名稱"]</code><br>
轉移房主權限給該使用者。</li>
<li><code>ocdr</code> <code>[]</code><br>
離開房間又進入房間。</li>
<li><code>gofr</code> <code>["房間名稱(RegExp)"]</code><br>
前往符合房間名稱的房間。若失敗則回到原房間。</li>
</ul><p>（<code>me</code> 可以用 <code>/me + 推送訊息</code> 以 msg 達成。） ～</p><p>可以在參數裡面使用特殊時間變量：</p><ul>
<li><code>%Y</code> 年份，四位數字西元年</li>
<li><code>%年</code> 年份，中文數字</li>
<li><code>%M</code> 月份，一至二位數字</li>
<li><code>%月</code> 月份，中文數字（一至十二）</li>
<li><code>%D</code> 日期，一至二位數字</li>
<li><code>%日</code> 日期，中文數字</li>
<li><code>%d</code> 禮拜幾，英文全寫</li>
<li><code>%拜</code> 禮拜幾，中文</li>
<li><code>%H</code> 時，數字（24 時制）</li>
<li><code>%h</code> 時，數字（12 時制）</li>
<li><code>%c</code> 上下午，英文 <code>a.m.</code> <code>p.m.</code></li>
<li><code>%m</code> 分，數字</li>
<li><code>%s</code> 秒，數字</li>
<li><code>%%</code> 轉義字符 <code>%</code></li>
</ul><p>範例：</p>`,
    def_conf:
`10, "msg", ["every 10 mins report once!"]
2, "msg", ["It's a Report Message", "Now is %H:%m!"]`,
  },
  [WELCOME]: {
    desc: `<p>功能：有人進入房間後，如果名稱匹配<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions" target="_blank" rel="noopener">正則表達式</a>，則自動發出歡迎詞。<br>
格式： 兩種格式，歡迎詞可以多個（隨機選擇並發出）</p><pre><code class="js hljs"><span class="hljs-string">"用戶名(正則表達式)"</span>, <span class="hljs-string">"歡迎詞"</span>
<span class="hljs-string">"用戶名(正則表達式)"</span>, [<span class="hljs-string">"歡迎詞"</span>, <span class="hljs-string">"歡迎詞"</span>, ...]
</code></pre><p>注意：</p><ul>
<li>記得要<strong>加雙引號</strong> <code>"</code>。</li>
<li>由上往下匹配，匹配成功則不繼續往下匹配規則。</li>
<li>空字串 <code>""</code> 或正則字串 <code>".*"</code> 可以<strong>匹配全部</strong>。</li>
</ul><p>特殊變量：</p><ul>
<li><code>$user</code> 進入房間的成員名稱。</li>
<li><code>$</code> 轉義字符 <code>$</code>。</li>
</ul><p>範例：對名字裡面有 lambda 和其後跟著 cat （中間可能夾有一些字）的使用者說 <code>hello, kitty</code>，對其他人則說 <code>hello/HI!!</code> 加上 <code>使用者名稱</code>。</p>`,
    def_conf:
`"lambda.*cat", "hello, kitty"
".*", ["hello $user", "HI!! $user"]`,
  },
  [WHITELIST]: {
    desc: `<p>功能：使用<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions" target="_blank" rel="noopener">正則表達式</a>，自動踢出<strong>不在名單內</strong>的特定使用者。<br>
格式：</p><pre><code class="js hljs">用戶名(正則表達式)
</code></pre><p>注意：</p><ul>
<li>記得要<strong>不加雙引號</strong>（除非想匹配有雙引號的 ID）。</li>
</ul><p>範例：只允許以 <code>cat</code> <strong>結尾</strong>或是<code>神秘</code><strong>開頭</strong>為名稱的使用者。</p>`,
    def_conf:
`cat$
^神秘`,
  },
  [BLACKLIST]: {
    desc: `<p>功能：使用<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions" target="_blank" rel="noopener">正則表達式</a>，自動踢出<strong>名單內</strong>的特定使用者。<br>
格式：</p><pre><code class="js hljs">用戶名(正則表達式)
</code></pre><p>注意：</p><ul>
<li>記得要<strong>不加雙引號</strong>（除非想匹配有雙引號的 ID）。</li>
</ul><p>範例：只允許以 <code>cat</code> <strong>結尾</strong>或是<code>神秘</code><strong>開頭</strong>為名稱的使用者。</p>`,
    def_conf:
`otoko
机器人|機器人
小冰|小氷|测试姬`,
  },
  [BANABUSE]: {
    desc: `<p>功能：使用<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions" target="_blank" rel="noopener">正則表達式</a>過濾聊天內容，自動踢出<strong>說出禁用詞</strong>的使用者。<br>
格式：</p><pre><code class="js hljs">禁用詞(正則表達式)
</code></pre><p>注意：</p><ul>
<li>記得要<strong>不加雙引號</strong>（除非想匹配有雙引號的禁用詞）。</li>
</ul><p>範例：聊天內容含有說到 <code>狗</code> 或是 <code>真香</code> 的成員會被踢出。</p>`,
    def_conf:
`狗
真香`,
  },
  [EVENTACT]: {
    desc: `<p>功能：對於一些事件，這裡提供一些函數，可以訂一些相應的動作。<br>
定義的動作只有在用戶<strong>名稱</strong>及用戶發送的<strong>內容</strong>符合<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions" target="_blank" rel="noopener">正則表達式</a>才會被觸發。<br>
其實前面的功能：歡迎詞/白名單/黑名單/禁止詞，都可用此功能實作。</p><p>格式：</p><pre><code class="js hljs"><span class="hljs-string">"事件類型"</span>, <span class="hljs-string">"用戶名(正則表達式)"</span>, <span class="hljs-string">"內容匹配(正則表達式)"</span>, <span class="hljs-string">"函數"</span>, [<span class="hljs-string">"參數"</span>, ...]
[<span class="hljs-string">"事件類型"</span>, ...], <span class="hljs-string">"用戶名(正則表達式)"</span>, <span class="hljs-string">"內容匹配(正則表達式)"</span>, <span class="hljs-string">"函數"</span>, [<span class="hljs-string">"參數"</span>, ...]
</code></pre><p>事件類型：</p><ul>
<li><code>me</code> 以 <code>/me</code> 發出的訊息</li>
<li><code>music</code> 播放音樂</li>
<li><code>leave</code> 成員離開</li>
<li><code>join</code> 成員加入</li>
<li><code>msg</code> 普通訊息</li>
<li><code>dm</code> 私訊</li>
<li><code>musicend</code> 音樂結束</li>
</ul><p>函數 [參數列] 說明：</p><ul>
<li><code>msg</code> <code>["訊息", "訊息", ...]</code><br>
從訊息中選擇一個推送。</li>
<li><code>umsg</code> <code>["URL", "訊息", ...]</code><br>
夾帶 URL 並隨機選擇一個訊息推送。</li>
<li><code>dm</code> <code>["使用者名稱", "訊息", "訊息", ...]</code><br>
私訊使用者，選擇一個訊息私訊。</li>
<li><code>udm</code> <code>["使用者名稱", "URL", "訊息", ...]</code><br>
私訊使用者，夾帶 URL 並隨機選擇一個訊息私訊。</li>
<li><code>kick</code> <code>["使用者名稱"]</code><br>
踢出使用者。</li>
<li><code>ban</code> <code>["使用者名稱"]</code><br>
踢出並屏蔽使用者。</li>
<li><code>banrpt</code> <code>["使用者名稱"]</code><br>
踢出並屏蔽舉報使用者。</li>
<li><code>plym</code> <code>["歌曲關鍵字"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "數字"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "音源"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "數字", "音源"]</code><br>
<code>plym</code> <code>["歌曲關鍵字", "音源", "數字"]</code><br>
播放音樂。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“數字”：第 “數字” 個搜尋結果。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>addm</code> <code>["歌曲關鍵字"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "數字"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "音源"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "數字", "音源"]</code><br>
<code>addm</code> <code>["歌曲關鍵字", "音源", "數字"]</code><br>
加入音樂至待播清單。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“數字”：第 “數字” 個搜尋結果。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>delm</code> <code>["數字"]</code><br>
從清單刪除音樂（依索引數字）。</li>
<li><code>lstm</code> <code>[]</code><br>
列出待播清單。</li>
<li><code>nxtm</code> <code>[]</code><br>
播放下一首曲子。</li>
<li><code>pndm</code> <code>[]</code><br>
<code>pndm</code> <code>["歌曲關鍵字"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "數字"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "音源"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "數字", "音源"]</code><br>
<code>pndm</code> <code>["歌曲關鍵字", "音源", "數字"]</code><br>
無參數則列出待播清單。<br>
如當前沒音樂，播放音樂。<br>
如有音樂，將音樂加入清單<br>
如關鍵字為空字串，列出待播清單。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“數字”：第 “數字” 個搜尋結果。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>schm</code> <code>["歌曲關鍵字"]</code><br>
<code>schm</code> <code>["歌曲關鍵字", "音源"]</code><br>
列出搜尋結果。
<ol>
<li>“關鍵字”：歌曲關鍵字。</li>
<li>“音源”：音源，目前有 “千” 和 “易”, “狗”, “我” 及 “Ｙ” 可以使用。</li>
</ol>
</li>
<li><code>horm</code> <code>["使用者名稱"]</code><br>
轉移房主權限給該使用者。</li>
<li><code>ocdr</code> <code>[]</code><br>
離開房間又進入房間。</li>
<li><code>gofr</code> <code>["房間名稱(RegExp)"]</code><br>
前往符合房間名稱的房間。若失敗則回到原房間。</li>
</ul><p>特殊參數變量：</p><ul>
<li><code>%Y</code> 年份，四位數字西元年</li>
<li><code>%年</code> 年份，中文數字</li>
<li><code>%M</code> 月份，一至二位數字</li>
<li><code>%月</code> 月份，中文數字（一至十二）</li>
<li><code>%D</code> 日期，一至二位數字</li>
<li><code>%日</code> 日期，中文數字</li>
<li><code>%d</code> 禮拜幾，英文全寫</li>
<li><code>%拜</code> 禮拜幾，中文</li>
<li><code>%H</code> 時，數字（24 時制）</li>
<li><code>%h</code> 時，數字（12 時制）</li>
<li><code>%c</code> 上下午，英文 <code>a.m.</code> <code>p.m.</code></li>
<li><code>%m</code> 分，數字</li>
<li><code>%s</code> 秒，數字</li>
<li><code>%%</code> 轉義字符 <code>%</code></li>
</ul><ul>
<li><code>$user</code> 發送訊息的使用者名稱</li>
<li><code>$cont</code> 使用者發送的內容</li>
<li><code>$args</code> 使用者發送內容第一個空格後的所有內容<br>
使用者發送：<code>play BUMP OF CHICKEN「Hello,world!」</code><br>
<code>$args</code>：<code>BUMP OF CHICKEN「Hello,world!」</code></li>
<li><code>$url</code> 使用者夾上的 URL</li>
<li><code>$</code> 轉義字符 <code>$</code></li>
</ul><p>這裡還有一些特殊用法。<br>
對於收到的訊息，會以空格分開成參數列，而用引號可以避免分開。<br>
而對分開的內容，可以用以下方法作為參數。</p><ul>
<li><code>$N</code> N 為數字，以數字取第 N 個參數，從零開始。</li>
<li><code>$[N-M]</code> 取從 N 到 M 的參數。N 不給則從零開始，M 不給取到最後。</li>
</ul><pre><code>this is  a  message send from user
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

</code></pre><p>範例：接上點歌功能。</p><pre><code class="js hljs"><span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/play\\\\s+(\\\\D|\\\\d\\\\S)"</span>, <span class="hljs-string">"plym"</span>, [<span class="hljs-string">"$args"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/play\\\\s+\\\\d\\\\s+\\\\S+"</span>, <span class="hljs-string">"plym"</span>, [<span class="hljs-string">"$[2-]"</span>, <span class="hljs-string">"$1"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/playsrc\\\\s+[千易]\\\\s+(\\\\D|\\\\d\\\\S)"</span>, <span class="hljs-string">"plym"</span>, [<span class="hljs-string">"$[2-]"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/playsrc\\\\s+[千易]\\\\s+\\\\d\\\\s+\\\\S+"</span>, <span class="hljs-string">"plym"</span>, [<span class="hljs-string">"$[3-]"</span>, <span class="hljs-string">"$1"</span>, <span class="hljs-string">"$2"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/add\\\\s+(\\\\D|\\\\d\\\\S)"</span>, <span class="hljs-string">"addm"</span>, [<span class="hljs-string">"$args"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/add\\\\s+\\\\d\\\\s+\\\\S+"</span>, <span class="hljs-string">"addm"</span>, [<span class="hljs-string">"$[2-]"</span>, <span class="hljs-string">"$1"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/addsrc\\\\s+[千易]\\\\s+(\\\\D|\\\\d\\\\S)"</span>, <span class="hljs-string">"addm"</span>, [<span class="hljs-string">"$[2-]"</span>, <span class="hljs-string">"$1"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/addsrc\\\\s+[千易]\\\\s+\\\\d\\\\s+\\\\S+"</span>, <span class="hljs-string">"addm"</span>, [<span class="hljs-string">"$[3-]"</span>, <span class="hljs-string">"$1"</span>, <span class="hljs-string">"$2"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/list"</span>, <span class="hljs-string">"lstm"</span>, []
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/next"</span>, <span class="hljs-string">"nxtm"</span>, []
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/del\\\\s+\\\\d+"</span>, <span class="hljs-string">"delm"</span>, [<span class="hljs-string">"$1"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/pending\\\\s*$"</span>, <span class="hljs-string">"pndm"</span>, []
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/pending\\\\s+(\\\\D|\\\\d\\\\S)"</span>, <span class="hljs-string">"pndm"</span>, [<span class="hljs-string">"$args"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/pending\\\\s+\\\\d\\\\s+\\\\S+"</span>, <span class="hljs-string">"pndm"</span>, [<span class="hljs-string">"$[2-]"</span>, <span class="hljs-string">"$1"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/pendsrc\\\\s+[千易]\\\\s+(\\\\D|\\\\d\\\\S)"</span>, <span class="hljs-string">"pndm"</span>, [<span class="hljs-string">"$[2-]"</span>, <span class="hljs-string">"$1"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/pendsrc\\\\s+[千易]\\\\s+\\\\d\\\\s+\\\\S+"</span>, <span class="hljs-string">"pndm"</span>, [<span class="hljs-string">"$[3-]"</span>, <span class="hljs-string">"$1"</span>, <span class="hljs-string">"$2"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/sc\\\\s+([千易]\\\\S+|[^千易])"</span>, <span class="hljs-string">"schm"</span>, [<span class="hljs-string">"$args"</span>]
<span class="hljs-string">"msg"</span>, <span class="hljs-string">""</span>, <span class="hljs-string">"^/sc\\\\s+[千易]\\\\s+\\\\S+"</span>, <span class="hljs-string">"schm"</span>, [<span class="hljs-string">"$[2-]"</span>, <span class="hljs-string">"$1"</span>]
</code></pre><p>使用者發送以下字串可以觸發設定好的功能：</p><pre><code>/play 剛好遇見你
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

</code></pre><p>範例：對於上面的指令，可以參考以下配置。</p>`,
    def_conf:
`"msg", "", "^/play\\\\s+(\\\\D|\\\\d\\\\S)", "plym", ["$args"]
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
`,
  },
}
