export const doc_url = 'manuals/manual-en.html'

export const infopop = `
<div id="info-modal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">about developer</h4>
          </div>
          <div class="modal-body">
            $ whoami <br><br>
            lambda.catノ#L/CaT//Hsk <br><br><br>
            $ finger lambda.catノ <br><br> 
            As a normal user on drrr.com, apper on drrr.com around fall, 2017.<br>
            Email: lambdacat.tw@gmail.com <br>
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
        desc: `<p>Function: Perform the defined action regularly.</p><pre><code class="js hljs"><span class="hljs-symbol">Minutes</span>, <span class="hljs-string">"function"</span>, [<span class="hljs-string">"parameter"</span>, ...]
</code></pre><p>Function [“parameter”, …] Description:</p><ul>
<li><code>msg</code> <code>["message", "message", ...] </code><br>
Select a message to publish.</li>
<li><code>umsg</code> <code>["URL", "Message", ...] </code><br>
Publish the URL and a randomly selected message.</li>
<li><code>dm</code> <code>["username", "message", "message", ...] </code><br>
Select a message to dm the username.</li>
<li><code>udm</code> <code>["username", "URL", "message", ...] </code><br>
Private messaging users, with a URL and a randomly selected message.</li>
<li><code>kick</code> <code>["username"] </code><br>
Kick out the user.</li>
<li><code>ban</code> <code>["username"] </code><br>
Kick out and ban the user.</li>
<li><code>banrpt</code> <code>["username"] </code><br>
Kick out, ban and report the user.</li>
<li><code>plym</code> <code>["Song Keywords"] </code><br>
<code>plym</code> <code>["Song Keyword", "Number"] </code><br>
<code>plym</code> <code>["Song Keyword", "Sound Source"] </code><br>
<code>plym</code> <code>["Song Keyword", "Number", "Sound Source"] </code><br>
<code>plym</code> <code>["Song Keyword", "Sound Source", "Number"] </code><br>
play music.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Number”: Index of search results.</li>
<li>“Sound Source”: Sound source. Currently there are “千”, “易”, “我”, “狗” and “Ｙ” available.</li>
</ol>
</li>
<li><code>addm</code> <code>["Song Keywords"] </code><br>
<code>addm</code> <code>["Song Keywords", "Number"] </code><br>
<code>addm</code> <code>["Song Keyword", "Sound Source"] </code><br>
<code>addm</code> <code>["Song Keyword", "Number", "Sound Source"] </code><br>
<code>addm</code> <code>["Song Keyword", "Sound Source", "Number"] </code><br>
Add music to your playlist.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Number”: Index of search results.</li>
<li>“Sound Source”: Sound source. Currently there are “千”, “易”, “我”, “狗” and “Ｙ” available.</li>
</ol>
</li>
<li><code>delm</code> <code>["number"] </code><br>
Remove music (by index number) from the list.</li>
<li><code>lstm</code> <code>[] </code><br>
show the playlist.</li>
<li><code>nxtm</code> <code>[] </code><br>
Play the next song.</li>
<li><code>pndm</code> <code>[] </code><br>
<code>pndm</code> <code>["Song Keywords"] </code><br>
<code>pndm</code> <code>["song keyword", "number"] </code><br>
<code>pndm</code> <code>["Song Keyword", "Sound Source"] </code><br>
<code>pndm</code> <code>["song keyword", "number", "audio source"] </code><br>
<code>pndm</code> <code>["song keyword", "sound source", "number"] </code><br>
If there is no parameter, the list to be played is listed.<br>
If there is no music currently, play music.<br>
If there is music, add it to the list<br>
If the keyword is an empty string, list it for play.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Number”: Index of search results.</li>
<li>“Sound Source”: Sound source. Currently there are “千”, “易”, “我”, “狗” and “Ｙ” available.</li>
</ol>
</li>
<li><code>schm</code> <code>["Song Keyword"] </code><br>
<code>schm</code> <code>["Song Keyword", "Sound Source"] </code><br>
List search results.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Sound Source”: Sound source. Currently there are “千”, “易”, “我”, “狗” and “Ｙ” available.</li>
</ol>
</li>
<li><code>horm</code> <code>["username"] </code><br>
Transfer owner permissions to the user.</li>
<li><code>ocdr</code> <code>[] </code><br>
Leaving the room and entering the room again.</li>
<li><code>gofr</code> <code>["Room Name (RegExp)"] </code><br>
Go to the room that matches the room name. If it fails, return to the origin room.</li>
</ul><p>(<code>Me</code> can be achieved in msg with<code> / me + push message</code>) ~</p><p>You can use special time variables in parameters:</p><ul>
<li><code>%Y</code> year, four-digit year</li>
<li><code>%年</code> year, Chinese numerals</li>
<li><code>%M</code> month, one or two digits</li>
<li><code>%月</code> month, Chinese numerals (one to twelve)</li>
<li><code>%D</code> date, one or two digits</li>
<li><code>%日</code> date, Chinese numerals</li>
<li><code>%d</code> weekday, full English</li>
<li><code>%拜</code> week, Chinese</li>
<li>Number at <code>%H</code> (24 hour clock)</li>
<li>number at <code>%h</code> (12 hours)</li>
<li><code>%c</code> In the afternoon, English<code> a.m.</code> <code>p.m.</code></li>
<li><code>%m</code> minutes, numbers</li>
<li><code>%s</code> seconds, numbers</li>
<li><code>%%</code> escape character <code>%</code></li>
</ul><p>example:</p>`,
        def_conf:
`10, "msg", ["every 10 mins report once!"]
2, "msg", ["It's a Report Message", "Now is %H:%m!"]`,
    },
    [WELCOME]: {
        desc: `<p>Function: After someone enters the room, if the name matches <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#" target="_blank" rel="noopener">regular expression</a>, the greeting will be sent out automatically .<br>
Format: Two formats, multiple welcome words (choose randomly and send out)</p><pre><code class="js hljs"><span class="hljs-string">"Username (regular expression)"</span>, <span class="hljs-string">"Welcome"</span>
<span class="hljs-string">"Username (regular expression)"</span>, [<span class="hljs-string">"Hola"</span>, <span class="hljs-string">"Hello"</span>, ...]
</code></pre><p>note:</p><ul>
<li>Match from top to bottom. If the match is successful, the following rule will not be matched.</li>
<li>The empty string <code>""</code> or the regular string <code>".*"</code> Can <strong>match all</strong>.</li>
</ul><p>Special variables:</p><ul>
<li><code>$user</code> The name of the member who entered the room.</li>
<li><code>$</code> escape character <code>$</code>.</li>
</ul><p>Example: Say <code>hello, kitty</code> to users who have lambda in their name followed by cat (possibly with some words in between), and <code>hello/HI!! </code>to others.</p>`,
        def_conf:
`"lambda.*cat", "hello, kitty"
".*", ["hello $user", "HI!! $user"]`,
    },
    [WHITELIST]: {
        desc: `<p>Function: Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#" target="_blank" rel="noopener">regular expressions</a> to automatically kick out specifics ** not in the list ** user.<br>
format:</p><pre><code class="js hljs"><span class="hljs-attribute">Username</span> (regular expression)
</code></pre><p>Example: Only users whose names end with <code>cat</code> or begin with <code>mysterious</code> are allowed.</p>`,
        def_conf:
`cat$
^mysterious`,
    },
    [BLACKLIST]: {
        desc: `<p>Function: Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#" target="_blank" rel="noopener">regular expressions</a> to automatically kick out specific uses in list.<br>
format:</p><pre><code class="js hljs"><span class="hljs-attribute">Username</span> (regular expression)
</code></pre><p>Example: kick out users who have <code>otoko</code> in their names and some qualified robots.</p>`,
        def_conf:
`otoko
.*Robot`,
    },
    [BANABUSE]: {
        desc: `<p>Function: use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#" target="_blank" rel="noopener">regular expressions</a> to filter the chat content and automatically kick out <strong>speak prohibited words</strong> users.<br>
format:</p><pre><code class="js hljs"><span class="hljs-keyword">Stop</span> word (regular expression)
</code></pre><p>Example: Chats containing members who say <code>dog</code> or<code> foobar</code> will be kicked out.</p>`,
        def_conf:
`dog
foobar`,
    },
    [EVENTACT]: {
        desc: `<p>Function: For some events, here are some functions that can order some corresponding actions.<br>
The defined actions will be performed only when the <strong>username</strong> and the <strong>contents sent by the user</strong> match the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#" target="_blank" rel="noopener">regular expression</a>.<br>
In fact, the previous functions: welcome words / whitelist / blacklist / banned words can be implemented with this function.</p><p>format:</p><pre><code class="js hljs"><span class="hljs-string">"Event type"</span>, <span class="hljs-string">"User name (regular expression)"</span>, <span class="hljs-string">"Content matching (regular expression)"</span>, <span class="hljs-string">"Function"</span>, [<span class="hljs-string">"Arguments"</span>, ...]
[<span class="hljs-string">"Event type"</span>, ...], <span class="hljs-string">"User name (regular expression)"</span>, <span class="hljs-string">"Content matching (regular expression)"</span>, <span class="hljs-string">"Function"</span>, [<span class="hljs-string">"Arguments"</span>, ...]
</code></pre><p>Event type:</p><ul>
<li><code>me</code> as<code> /me</code></li>
<li><code>music</code> play music</li>
<li><code>leave</code> members leave</li>
<li><code>join</code> members join</li>
<li><code>msg</code> general message</li>
<li><code>dm</code> Private Message</li>
<li><code>musicend</code> music ends</li>
</ul><p>Function [“parameter”, …] Description:</p><ul>
<li><code>msg</code> <code>["message", "message", ...] </code><br>
Select a message to publish.</li>
<li><code>umsg</code> <code>["URL", "Message", ...] </code><br>
Publish the URL and a randomly selected message.</li>
<li><code>dm</code> <code>["username", "message", "message", ...] </code><br>
Select a message to dm the username.</li>
<li><code>udm</code> <code>["username", "URL", "message", ...] </code><br>
Private messaging users, with a URL and a randomly selected message.</li>
<li><code>kick</code> <code>["username"] </code><br>
Kick out the user.</li>
<li><code>ban</code> <code>["username"] </code><br>
Kick out and ban the user.</li>
<li><code>banrpt</code> <code>["username"] </code><br>
Kick out, ban and report the user.</li>
<li><code>plym</code> <code>["Song Keywords"] </code><br>
<code>plym</code> <code>["Song Keyword", "Number"] </code><br>
<code>plym</code> <code>["Song Keyword", "Sound Source"] </code><br>
<code>plym</code> <code>["Song Keyword", "Number", "Sound Source"] </code><br>
<code>plym</code> <code>["Song Keyword", "Sound Source", "Number"] </code><br>
play music.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Number”: Index of search results.</li>
<li>“Sound Source”: There are currently “Thousand”, “Yi” and “Ｙ” available.</li>
</ol>
</li>
<li><code>addm</code> <code>["Song Keywords"] </code><br>
<code>addm</code> <code>["Song Keywords", "Number"] </code><br>
<code>addm</code> <code>["Song Keyword", "Sound Source"] </code><br>
<code>addm</code> <code>["Song Keyword", "Number", "Sound Source"] </code><br>
<code>addm</code> <code>["Song Keyword", "Sound Source", "Number"] </code><br>
Add music to your playlist.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Number”: Index of search results.</li>
<li>“Sound Source”: Sound source. Currently there are “千”, “易”, “我”, “狗” and “Ｙ” available.</li>
</ol>
</li>
<li><code>delm</code> <code>["number"] </code><br>
Remove music (by index number) from the list.</li>
<li><code>lstm</code> <code>[] </code><br>
show the playlist.</li>
<li><code>nxtm</code> <code>[] </code><br>
Play the next song.</li>
<li><code>pndm</code> <code>[] </code><br>
<code>pndm</code> <code>["Song Keywords"] </code><br>
<code>pndm</code> <code>["song keyword", "number"] </code><br>
<code>pndm</code> <code>["Song Keyword", "Sound Source"] </code><br>
<code>pndm</code> <code>["song keyword", "number", "audio source"] </code><br>
<code>pndm</code> <code>["song keyword", "sound source", "number"] </code><br>
If there is no parameter, the list to be played is listed.<br>
If there is no music currently, play music.<br>
If there is music, add it to the list<br>
If the keyword is an empty string, list it for play.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Number”: Index of search results.</li>
<li>“Sound Source”: Sound source. Currently there are “千”, “易”, “我”, “狗” and “Ｙ” available.</li>
</ol>
</li>
<li><code>schm</code> <code>["Song Keyword"] </code><br>
<code>schm</code> <code>["Song Keyword", "Sound Source"] </code><br>
List search results.
<ol>
<li>“Keywords”: Song keywords.</li>
<li>“Sound Source”: Sound source. Currently there are “千”, “易”, “我”, “狗” and “Ｙ” available.</li>
</ol>
</li>
<li><code>horm</code> <code>["username"] </code><br>
Transfer owner permissions to the user.</li>
<li><code>ocdr</code> <code>[] </code><br>
Leaving the room and entering the room again.</li>
<li><code>gofr</code> <code>["Room Name (RegExp)"] </code><br>
Go to the room that matches the room name. If it fails, return to the origin room.</li>
</ul><p>Special parameter variables:</p><ul>
<li><code>$user</code> username for sending message</li>
<li><code>$cont</code> content sent by the user</li>
<li><code>$args</code> User sends everything after the first space<br>
User sends: <code>play BUMP OF CHICKEN「 Hello, world! 」</code><br>
<code>$args</code>:<code>BUMP OF CHICKEN "Hello, world!"</code></li>
<li><code>$url</code> URL on user folder</li>
<li><code>$</code> escape character <code>$</code></li>
</ul><p>There are some special uses here.<br>
For received messages, the parameters are separated by spaces, and quotation marks are used to avoid separation.<br>
For separate content, the following methods can be used as parameters.</p><ul>
<li><code>$N</code> N is a number. Take the Nth parameter from the number, starting from zero.</li>
<li><code>$[N-M]</code> takes parameters from N to M. If N does not give, it will start from zero, and if M does not give, it will take to the end.</li>
</ul><pre><code>this is  a  message send from user
---- --  -  ------- ---- ---- ----
$0   $1  $2 $3      $4   $5   $6
----------------------------------
$cont

Send string:
this is a "another message" send from 'another user'

The quotes will be removed, but the spaces inside will not be cut:
this is a  another message  send from  another user
---- -- -  ---------------  ---- ----  ------------
$0   $1 $2 $3               $4   $5    $6
     ----------------------------------------------
     $args
---------  --------------------- ------------------
$[-2]      $[3-4]                $[5-]
---------------------------------------------------                     
$[-]

</code></pre><p>Example: Bind the song function.</p>

<p>The user sends the following strings to trigger the set function:</p><pre><code>/play yellow
/play 2 yellow
/playsrc 千 yellow
/play 易 2 yellow
/add  21Guns
/add  2 21Guns
/addsrc 千 21Guns
/addsrc 易 2 21Guns
/pending
/pending 21Guns
/pending 2 21Guns
/pendsrc 千 21Guns
/pendsrc 易 2 21Guns
/del  1
/list
/next
/sc 21Guns
/sc 千 21Guns
</code></pre><p>Example：For the commands above, you can consider the following configurations.</p>`,
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
