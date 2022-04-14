# DRRR ChatBot Extension Setting Manual

## Installation

### PC version
:::success
Since it is a Chrome extension,
please use the Chrome browser and install it from the [Google Web Store](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm).

In addition, you can try to [Install Chrome Extensions](https://addons.opera.com/zh-tw/extensions/details/install-chrome-extensions/) if you use Opera.
:::

### Mobile version
:::success
The mobile version of Chrome does not provide plugin installation on the phone, but you can use the Yandex browser ([Android](https://play.google.com/store/apps/details?id=ru.yandex.searchplugin&hlen_US), it uses Chrome kernel, so it can also get the installation from [Google Web App Store](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm).

Note: Yandex on iOS is not supported.

Kiwi browser can also run the extenson, but for some unknown bugs, I make a custmized version for it(the kiwi branch). You can install it via the .crx or install [the version from WebStore](https://chrome.google.com/webstore/detail/drrr-chatbot-extension-ki/ejklpmiadilgeabpklkickjghjegcblj).
:::

### Background version

:::success
[The background version](https://chrome.google.com/webstore/detail/drrr-chatbot-extension-ba/iafmncflgcckjejinbaneekanabjnodm) let you change the icon (i.e. Bot cog) on the site. But it may run in the background, which means it would cost more resources.
:::

### ~~Incoming version~~(The review is hard to pass \_(:3)

:::warning
~~Firefox add-ons is still under reviewing, and it may be both available on PC and Android.~~
:::

## FrontEnd Control

> Click the extension icon to open the popup window.

![](https://i.imgur.com/8PhiP0a.png)

:::success
**Button**
<i class="glyphicon glyphicon-question-sign"></i> Go to this manual page
<i class="fa fa-youtube-play"></i> YouTube Tutorial
<i class="fa fa-cloud"></i>/<i class="fa fa-hdd-o"></i> Select storage type
<i class="glyphicon glyphicon-console"></i> Script Console
<i class="fa fa-plug"></i> Go to plugin settings
<i class="glyphicon glyphicon-cog"></i> Go to background settings
:::

:::success
**switch （<i class="glyphicon glyphicon-cog"></i> means you must do some settings before turning it on）**
- AutoDM
  Automatically lock the last dm user after sending a message
- Timer <i class="glyphicon glyphicon-cog"></i>
  Scheduled execution of set actions
- Black / Whitelist <i class="glyphicon glyphicon-cog"></i>
  Room black / white list (auto kick out/ban/report visitors)
- Welcome <i class="glyphicon glyphicon-cog"></i>
  Automatically send out a greeting on visitors entering the room
- BanAbuse <i class="glyphicon glyphicon-cog"></i>
  List of banned words. When the user's words match the forbidden words, they will be kicked out automatically.
- Always/me
  Add the /me command automatically
- EventAction <i class="glyphicon glyphicon-cog"></i>
  When the event occurs, perform the set action
- RoomKeeper
  Automatically send messages to yourself to prevent the room from disappearing
- TgBotForwarder (TgBotLogger) <i class="glyphicon glyphicon-cog"></i>
  Record chat messages via Telegram Bot
- RoomStatus (RoomNotification)
  Send chat notification when browser tab is not on chatroom page
:::

### Bio

:::success
![](https://i.imgur.com/fE3T04X.png)

#### Button
<i class="glyphicon glyphicon-transfer"></i> Switch to selected account
<i class="glyphicon glyphicon-floppy-save"></i> Save the current account
<i class="glyphicon glyphicon-floppy-remove"></i> Delete the selected account
<i class="glyphicon glyphicon-import"></i> Import session cookie
<i class="glyphicon glyphicon-export"></i> Export session cookie
<i class="glyphicon glyphicon-send"></i> Send message

#### Account Icon
- 🔖 Current login account
- 💾 Saved account
:::

### Friends

:::success
![](https://i.imgur.com/Ewb1tH1.png)

:::

:::warning
![](https://i.imgur.com/CDRuB6I.png)

#### Room waiting function

Check whether the room is available at regular intervals, and if so, jump to that room.

Match rule pattern:
- <i class="glyphicon glyphicon-barcode"></i> by room ID
- <i class="glyphicon glyphicon-lock"></i> with tripcode
- <i class="glyphicon glyphicon-user"></i> by username
- <i class="glyphicon glyphicon-home"></i> by room name
- <i class="glyphicon glyphicon-tag"></i> Store rules

Jump mode：
- <i class="glyphicon glyphicon-send"></i> Jump directly
- <i class="glyphicon glyphicon-comment"></i> Ask before jumping
:::

:::warning
![](https://i.imgur.com/Tffsixa.png)

#### Searching for users / rooms

Search mode:
- <i class="glyphicon glyphicon-lock"></i>  by tripcode
- <i class="glyphicon glyphicon-user"></i>  by username
- <i class="glyphicon glyphicon-home"></i>  by room name

<i class="glyphicon glyphicon-search"></i> Search
<i class="glyphicon glyphicon-plus"></i> Add to favorites
:::

:::warning
![](https://i.imgur.com/GqNW6b4.png)


#### Favorites notification / list

<i class="glyphicon glyphicon-eye-close"></i> Annoying room/user hiding
<i class="glyphicon glyphicon-volume-up"></i> Open favorites notice (someone goes online or creates a room)
<i class="glyphicon glyphicon-list"></i> Show all favorites rules
<i class="glyphicon glyphicon-lock"></i> Show all matching tripcode users online
<i class="glyphicon glyphicon-user"></i> Show all users who meet the rules online
<i class="glyphicon glyphicon-home"></i> Show all rooms that meet the rules on the line
<i class="glyphicon glyphicon-globe"></i> Show all rooms online
:::

### Music

:::success
![](https://i.imgur.com/KK4lyqW.png)

#### Play mode (click to switch)
- <i class="glyphicon glyphicon-music"></i> Single song mode: Stop after every song
- <i class="glyphicon glyphicon-cd"></i> Album mode: After the song ends, the song in the playlist is automatically played
- <i class="glyphicon glyphicon-repeat"></i> SLoop mode: Loop the song
- <i class="glyphicon glyphicon-refresh"></i> ALoop mode: Loop the playlist

#### Sound source
- **Q** QQ Music
- **網** Netease Music (banned by GFW)
- **易** Netease Music (not work for chatroom now)
- **千** Baidu Music Boxes
- **Y** YouTube (banned by GFW)
- **狗** Kugou
- ~~**我** Kuwo~~

#### Search Keyword and Play

Enter keywords and function keys to query.
Directly after input:
- Enter to press the left function key.
- Shift + Enter to press the middle function key.
- Ctrl + Enter to press the right function key.

#### Other button

<i class="glyphicon glyphicon-list"></i> Expand the list to play
<i class="glyphicon glyphicon-play"></i> Play the first song in playlist
<i class="glyphicon glyphicon-heart"></i> Expand favorites list
<i class="glyphicon glyphicon-link"></i> Set other YouTube API server

You can lunch your YouTube API server locally, please refer to [this link](https://github.com/DrrrChatbots/youtube-api).
Run it with python will show `http://127.0.0.1:5000/`,
Click the button and stuff `http://127.0.0.1:5000/`, and follow the prompt.

:::

:::warning
<i class="glyphicon glyphicon-list"></i> Expand the list to play

![](https://i.imgur.com/yEwUeJX.png)

#### Button

<i class="glyphicon glyphicon-remove"></i> Remove from playlist <i class="glyphicon glyphicon-play"></i> Play the song <i class="glyphicon glyphicon-heart"></i> Add to favorites
:::

:::warning
<i class="glyphicon glyphicon-heart"></i> Expand the favorites

![](https://i.imgur.com/CNAMolJ.png)

#### Button

<i class="glyphicon glyphicon-plus"></i> Add to playlist <i class="glyphicon glyphicon-play"></i> Play now <i class="glyphicon glyphicon-remove"></i> Remove from favorites
:::

:::warning
When there are some keywords in search field

![](https://i.imgur.com/uDyoabR.png)

#### Button

<i class="glyphicon glyphicon-search"></i> Expand results <i class="glyphicon glyphicon-play"></i> Play the most relevant song <i class="glyphicon glyphicon-plus"></i> Add the most relevant song to playlist
:::

:::warning
Search result：剛好遇見你

![](https://i.imgur.com/W7iJG5s.png)

#### Button
<i class="glyphicon glyphicon-plus"></i> Add to playlist <i class="glyphicon glyphicon-play"></i> Play now <i class="glyphicon glyphicon-heart"></i> Add to favorites
:::

### Room

:::success
![](https://i.imgur.com/mqkGRJK.png)


#### ChatMessage Chinese simplified-traditional converter
- Ｘ no convert
- 簡 to simpilifed
- 繁 to traditional

#### Button

<i class="glyphicon glyphicon glyphicon-text-color"></i> Change character color
<i class="glyphicon glyphicon glyphicon-text-background"></i> Change bkg-color
（the [color format](https://en.wikipedia.org/wiki/Web_colors), e.g. `black`, `#000000`）
<i class="glyphicon glyphicon glyphicon-picture"></i> Use image URL as background

---

<i class="fa fa-refresh"></i> reset default script
<i class="fa fa-minus"></i> delete script
<i class="fa fa-plus"></i> add script
<i class="fa fa-pencil"></i> edit script
<i class="fa fa-toggle-off"></i> on/off script
:::

### Plugin

:::success
![](https://i.imgur.com/yVbU8l2.png)



#### Button

<i id="local-switch" class="glyphicon glyphicon-cloud-upload"></i> Upload image

<i id="local-switch" class="fa fa-toggle-off"></i> Local module switch
<i id="local-setting" class="fa fa-plug"></i> Goto plugin setting
<i class="glyphicon glyphicon-qrcode"></i> Tripcode explorer

---

<i id="game-tent" class="glyphicon glyphicon-tent"></i> Discord QA group


<i class="fa fa-paw" aria-hidden="true"></i> Live2d(defualt: tororo)
<i class="glyphicon glyphicon-resize-full"></i> Adjust the showcase size
<i class="glyphicon glyphicon-link"></i> Change to another figure（input the [link](https://drrr.wiki/%E6%B5%AA%E6%89%93%E8%81%8A%E5%A4%A9%E6%8F%92%E4%BB%B6)）

---


#### Local message module
- Hashtag ~~Chou praising tool~~ inspired by [@Dust](https://drrr.wiki/index.php?title=@%E8%88%87%E5%85%89%E5%90%8C%E5%A1%B5&redirect=no)
  Record message contains `#`, if your message start with `#` + tag, the extension will send recorded message randomly.
  ![](https://i.imgur.com/ayuUGAL.png)

- CahtLog
  Record chatroom message

---


####  Live2D links

:::spoiler Expand list

- Tororo
`https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json`
- Hijiki
`https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json`
- Shizuku
`https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json`
- Miku
`https://unpkg.com/live2d-widget-model-miku@1.0.5/assets/miku.model.json`
- z16
`https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json`
- Nito 
`https://unpkg.com/live2d-widget-model-nico@1.0.5/assets/nico.model.json`
`https://unpkg.com/live2d-widget-model-nipsilon@1.0.5/assets/nipsilon.model.json`
`https://unpkg.com/live2d-widget-model-nito@1.0.5/assets/nito.model.json`
`https://unpkg.com/live2d-widget-model-ni-j@1.0.5/assets/ni-j.model.json`
- Chitose
`https://unpkg.com/live2d-widget-model-chitose@1.0.5/assets/chitose.model.json`
- Haruto
`https://unpkg.com/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json`
- Koharu
`https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json`
- Tsumiki
`https://unpkg.com/live2d-widget-model-tsumiki@1.0.5/assets/tsumiki.model.json`
- Unity chan
`https://unpkg.com/live2d-widget-model-unitychan@1.0.5/assets/unitychan.model.json`
- Wanko
`https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json`
- Hibiki
`https://unpkg.com/live2d-widget-model-hibiki@1.0.5/assets/hibiki.model.json`
:::

:::warning
##### TRPG inspired by [@少女](https://drrr.wiki/@%E5%B0%91%E5%A5%B3)
![](https://i.imgur.com/oChwMqs.png)

Characters：
- <i class="glyphicon glyphicon-bullhorn"></i> Host
- <i class="glyphicon glyphicon-user"></i> Player

Host can change all the players' background by input the URL
Players can ask for dice by `1D20` 


:::

:::warning
##### Room guard
![](https://i.imgur.com/m8WiICd.png)

Mode：
- mode 0: Uesr will be kick/ban next if leave room silently.
- mode 1: Ask if kick/ban user if is silent in the period
- mode 2: Count down then kick/ban if silent in the period
- mode 3: Kick/ban the user if is silent in the period
:::

:::warning
##### Background Effect

Reload the chatroom can stop effect

Mode：
- <i class="glyphicon glyphicon-cloud"></i> Snow
- <i class="glyphicon glyphicon-fire"></i> Firework
- <i class="glyphicon glyphicon-sort"></i> Elevator

:::

:::warning
##### Guess the number

![](https://i.imgur.com/p3aaoEu.png)

Set Number：
- Method 1：trigger by `/start`, a random number will be generated.
- Method 2：input four digits and click <i id="list_type" class="glyphicon glyphicon glyphicon-pencil"></i> to setup number. click <i class="glyphicon glyphicon-volume-up"></i> to announce game start.

Quick Start：System will hint - NANB
A：The digit is correct and position is right
B：The digit is correct but posistion is wrong
Exmaple: The number is 1658 , if you send 2680, system will show 2680：1A1B
:::

:::warning
##### Hidden Lounge 亞特蘭蒂斯

![](https://i.imgur.com/BtJomuX.png)

<i id="" class="glyphicon glyphicon-log-in"></i> Enter hidden lounge
- Use public hidden lounge if no sheet ID
- After entering the ID, click <i id="" class="glyphicon glyphicon-pencil"></i> to use private lounge

![](https://i.imgur.com/WedLAo2.png)
You can stuff different ID to switch different lounge

注：[How to get the google ID](http://hk.uwenku.com/question/p-kjrgjrcw-gn.html)
:::



:::warning
### Audio room

##### P2P CHAT Double audio room
![](https://i.imgur.com/7YWNfyA.png)



##### ROOM CHAT Group audio room
![](https://i.imgur.com/4c63kyl.png)
###### function:
- Audio system
- Screen sharing
##### 
- <i class="glyphicon glyphicon-phone-alt"></i> Crete the audio room (group host only)
- <i class="glyphicon glyphicon-earphone"></i> Join the audio room
     * host  Room code would be generated automatically
     * join  Enter the room code to enter audio room
     * hall  Broken know
     
###### steps:
1. Join audio room
2. Mic/Screen Sharing setup
3. <i class="icon icon-phone"></i> Click to join session
4. <i class="icon icon-list"></i> Click to watch sharing
:::



### Sticker

:::success
![](https://i.imgur.com/OZ8nM2k.png)

#### Button
<i class="glyphicon glyphicon-refresh"></i> Restore the ten preset stickers
<i class="glyphicon glyphicon-plus"></i> Add stickers
<i class="glyphicon glyphicon-minus"></i> Delete the selected texture
<i class="glyphicon glyphicon-shopping-cart"></i> Go to the sticker website
:::

## Background settings

According the storage, we can categorize them to sync and local.

The memory quote for sync setting: 8,192 bytes
(note the size limit of event action rule)

The memory quote for local setting:5,242,880 bytes

Sync setting (including your cookie) is syncronized.
The settings would be syncronized, so you can use same Google account to login different PCs to share the sync settings.

### Sync <i class="fa fa-cloud"></i> / Local <i class="fa fa-hdd-o"></i>

:::success
![](https://i.imgur.com/hEozM1t.png)


![](https://i.imgur.com/rE3MU5e.png)

#### Button

<i class="glyphicon glyphicon-question-sign"></i> Manual
<i class="glyphicon glyphicon-info-sign"></i> About me
<i class="glyphicon glyphicon-refresh"></i> reset default settings
<i class="glyphicon glyphicon-floppy-remove"></i> reset all environment variables
<i class="glyphicon glyphicon-export"></i> Export settings
choose file：import settings

`HELP` Open the manual for the current page

### Quick Regex Tester (Quick Regular Expression Test)

Quick test for easy rule setting

### Music Delay

In continuous playback mode, songs and songs are spaced.
(There is a synchronization problem between room members, sometimes songs will be covered, so the delay is set)
:::


:::warning
### Timer Configuration

#### Function

Perform the defined action regularly.

#### Format

```js
Minutes, "function", ["parameter", ...]
```
#### Functions
Please refer to [Function Manual](#Function-Manual)

#### Variable
You can use special time variables in parameters:

- `%Y` year, four-digit year
- `%M` month, one or two digits
- `%MM` month, two digits (pad with 0)
- `%MMM` month, abbreviation in English
- `%MMMM` month, full English
- `%D` date, one or two digits
- `%DD` date, two digits (pad with 0)
- `%d` weekday, abbreviation in English
- `%dd` weekday, full English
- `%H` hour, (24 hour clock)
- `%HH` hour, (24 hour clock, pad with 0)
- `%h` hour, (12 hours)
- `%hh` hour, (12 hours, pad with 0)
- `%n` before/after midday, `a.m.`, `p.m.`
- `%m` minutes, numbers
- `%mm` minutes, numbers (pad with 0)
- `%s` seconds, numbers
- `%ss` seconds, numbers (pad with 0)
- `%%` escape character `%`
- `%年` year, Chinese numerals
- `%月` month, Chinese numerals (one to twelve)
- `%日` date, Chinese numerals
- `%星` week, Chinese
- `%午` before/after midday, `上午`, `下午`

(you can specify the timezone for hour relative format, such as `%+8hh` for UTC+8, `%-1H` for UTC-1, `%3n` for UTC+3, but not support date currently)

#### Example
```js
10, "msg", ["every 10 mins report once!"]
2, "msg", ["It's a Report Message", "Now is%H:%m!"]
```

:::

:::warning
### Welcome Configuration

#### Function

After someone enters the room, if the name matches [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#), the greeting will be sent out automatically .

#### Format

Two formats, multiple welcome words (choose randomly and send out)
```js
"Usermatching", "Welcome"
"Usermatching", ["Hola", "Hello", ...]
```

#### Note
- Don't forget the double quotation `"`.
- Match from top to bottom. If the match is successful, the following rule will not be matched.
- The empty string `""` or the regular string `".*"` Can **match all**.


#### Special variables
- `$user` The name of the member who entered the room.
- `$$` escape character `$`.

#### Example

Say `hello, kitty` to users who have lambda in their name followed by cat (possibly with some words in between), and `hello/HI!! `to others.

```js
"lambda.*cat", "hello, kitty"
".*", ["hello $user", "HI !! $user"]
```
:::

:::warning
### WhiteList Configuration

#### Function

Use [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#) to automatically kick out specifics ** not in the list ** user.

#### Format
```js
Usermatching
```

#### Note
- **No** double quote (or you want to match username with double quote)

#### Example

Only users whose names end with `cat` or begin with `mysterious` are allowed.

```js
cat$
^mysterious
```
:::

:::warning
### BlackList Configuration

#### Function
Use [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#) to automatically kick out specific uses in list.

#### Format
```js
Usermatching
```

#### Note
- **No double quote** (or you want to match username with double quote)

#### Example
kick out users who have `otoko` in their names and some qualified robots.

```js
otoko
.*Robot
```

:::

:::warning
### BanAbuse Configuration

#### Function
use [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#) to filter the chat content and automatically kick out **speak prohibited words** users.

#### Format
```js
Stop word (regular expression)
```

#### Note
- **No** double quote (or you want to match abuse term with double quote)

#### Example

Chats containing members who say `dog` or` foobar` will be kicked out.
```js
dog
foobar
```
:::

:::warning
### EventAction Configuration

#### Function

For some events, here are some functions that can order some corresponding actions.
The defined actions will be performed only when the **username** and the **contents sent by the user** match the [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#).
In fact, the previous functions: welcome words / whitelist / blacklist / banned words can be implemented with this function.

#### Format
```js
"Event type", "User matching", "Content matching", "Function", ["Arguments", ...]
["Event type", ...], "User matching", "Content matching", "Function", ["Arguments", ...]
```

#### Event type

when...
- `new-host` change host
- `room-profile` change room name
- `new-description` change room description
- `join` join new member
- `leave` member left
- `kick` someone be kicked
- `ban` someone be banned
- `unban` someone be unbanned
- `dm` private message
- `msg` normal message
- `me` as `/me`
- `dmto` you send private message to other
- `roll` someone roll
- `music` play music(someone play it)
- `musicbeg` music begins（progress bar beg）
- `musicend` music ends（progress bar end）

#### User matching

User matching would be a username RegExp or Tripcode RegExp,
if both rule existed, then both must be satisfied.
```js
"lambda" <- name contains "lambda"
"#.*cat" <- tc with cat （ignore case）
"lambda#.*cat" <- name contains "lambda" and tc with cat
```

#### Content matching

Content matching is simply a RegExp.

#### Functions
Please refer to [Function Manual](#Function-Manual)

#### Special parameter variables

- `%Y` year, four-digit year
- `%M` month, one or two digits
- `%MM` month, two digits (pad with 0)
- `%MMM` month, abbreviation in English
- `%MMMM` month, full English
- `%D` date, one or two digits
- `%DD` date, two digits (pad with 0)
- `%d` weekday, abbreviation in English
- `%dd` weekday, full English
- `%H` hour, (24 hour clock)
- `%HH` hour, (24 hour clock, pad with 0)
- `%h` hour, (12 hours)
- `%hh` hour, (12 hours, pad with 0)
- `%n` before/after midday, `a.m.`, `p.m.`
- `%m` minutes, numbers
- `%mm` minutes, numbers (pad with 0)
- `%s` seconds, numbers
- `%ss` seconds, numbers (pad with 0)
- `%%` escape character `%`
- `%年` year, Chinese numerals
- `%月` month, Chinese numerals (one to twelve)
- `%日` date, Chinese numerals
- `%星` week, Chinese
- `%午` before/after midday, `上午`, `下午`

(you can specify the timezone for hour relative format, such as `%+8hh` for UTC+8, `%-1H` for UTC-1, `%3n` for UTC+3, but not support date currently)

* `$user` username for sending message
* `$cont` content sent by the user
* `$args` User sends everything after the first space
   User sends: `play BUMP OF CHICKEN「 Hello, world! 」`
   `$args`:` BUMP OF CHICKEN "Hello, world!" `
* `$url` URL on user folder
* `$$` escape character `$`

#### Special parameter usage

There are some special uses here.
For received messages, the parameters are separated by spaces, and quotation marks are used to avoid separation.
For separate content, the following methods can be used as parameters.

- `$N` N is a number. Take the Nth parameter from the number, starting from zero.
- `$[N-M]` takes parameters from N to M. If N does not give, it will start from zero, and if M does not give, it will take to the end.

#### Special function

- `$tenor(keyword)` return gif URL tenor searched
- `$giphy(keyword)` retrun gif URL giphy searched

#### Figure for parameter

```
this is  a  message send from user
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
```

#### Example

```
"msg", "", "^/tenor", "umsg", ["$tenor($args)", "$args"]
"msg", "", "^/giphy", "umsg", ["$giphy($args)", "$args"]
"msg", "", "^/play", "plym", ["$args"]
"leave", "", "", "msg", ["$user bye!"]
```

#### Call

```
/tenor cat
/giphy iron man
/play yellow
```

:::spoiler More Examples

#### Example

```
"msg", "", "^/play\\s+(\\D|\\d\\S)", "plym", ["$args"]
"msg", "", "^/play\\s+\\d\\s+\\S+", "plym", ["$[2-]", "$1"]
"msg", "", "^/playsrc\\s+[千易]\\s+(\\D|\\d\\S)", "plym", ["$[2-]"]
"msg", "", "^/playsrc\\s+[千易]\\s+\\d\\s+\\S+", "plym", ["$[3-]", "$1", "$2"]
"msg", "", "^/add\\s+(\\D|\\d\\S)", "addm", ["$args"]
"msg", "", "^/add\\s+\\d\\s+\\S+", "addm", ["$[2-]", "$1"]
"msg", "", "^/addsrc\\s+[千易]\\s+(\\D|\\d\\S)", "addm", ["$[2-]", "$1"]
"msg", "", "^/addsrc\\s+[千易]\\s+\\d\\s+\\S+", "addm", ["$[3-]", "$1", "$2"]
"msg", "", "^/list", "lstm", []
"msg", "", "^/next", "nxtm", []
"msg", "", "^/del\\s+\\d+", "delm", ["$1"]
"msg", "", "^/pending\\s*$", "pndm", []
"msg", "", "^/pending\\s+(\\D|\\d\\S)", "pndm", ["$args"]
"msg", "", "^/pending\\s+\\d\\s+\\S+", "pndm", ["$[2-]", "$1"]
"msg", "", "^/pendsrc\\s+[千易]\\s+(\\D|\\d\\S)", "pndm", ["$[2-]", "$1"]
"msg", "", "^/pendsrc\\s+[千易]\\s+\\d\\s+\\S+", "pndm", ["$[3-]", "$1", "$2"]
"msg", "", "^/sc\\s+([千易]\\S+|[^千易])", "schm", ["$args"]
"msg", "", "^/sc\\s+[千易]\\s+\\S+", "schm", ["$[2-]", "$1"]
```

### Call
```
/play yellow
/play 2 yellow
/playsrc 千 yellow
/play 易 2 yellow
/add  yellow
/add  2 yellow
/addsrc 千 yellow
/addsrc 易 2 yellow
/pending
/pending yellow
/pending 2 yellow
/pendsrc 千 yellow
/pendsrc 易 2 yellow
/del  1
/list
/next
/sc yellow
/sc 千 yellow
```
:::

#### Function Manual

:::warning

Function ["parameter", ...] Description:
- `name` `["room name", "room name", ...]`
  Select a name as new room name.
- `desc` `["room description", "room description", ...]`
  Select a description as new room description.
- `msg` `["message", "message", ...] `
  Select a message to publish.
- `umsg` `["URL", "Message", ...] `
  Publish the URL and a randomly selected message.
- `dm` `["username", "message", "message", ...] `
  Select a message to dm the username.
- `udm` `["username", "URL", "message", ...] `
  Private messaging users, with a URL and a randomly selected message.
- `mus` `["URL", "song title"]`
  Play the song by URL.
- `kick` `["username"] `
  Kick out the user.
- `ban` `["username"] `
  Kick out and ban the user.
- `banrpt` `["username"] `
  Kick out, ban and report the user.
- `plym` `["Song Keywords"] `
  `plym` `["Song Keyword", "Number"] `
  `plym` `["Song Keyword", "Sound Source"] `
  `plym` `["Song Keyword", "Number", "Sound Source"] `
  `plym` `["Song Keyword", "Sound Source", "Number"] `
  play music.
  1. "Keywords": Song keywords.
  2. "Number": Index of search results.
  3. "Sound Source": Sound source. Currently there are "千", "網", "易", "Q", ~~"我"~~, "狗" and "Y" available.
- `addm` `["Song Keywords"] `
  `addm` `["Song Keywords", "Number"] `
  `addm` `["Song Keyword", "Sound Source"] `
  `addm` `["Song Keyword", "Number", "Sound Source"] `
  `addm` `["Song Keyword", "Sound Source", "Number"] `
  Add music to your playlist.
  1. "Keywords": Song keywords.
  2. "Number": Index of search results.
  3. "Sound Source": Sound source. Currently there are "千", "網", "易", "Q", ~~"我"~~, "狗" and "Y" available.
- `delm` `["number"] `
  Remove music (by index number) from the list.
- `lstm` `[] `
  show the playlist.
- `nxtm` `[] `
  Play the next song.
- `pndm` `[] `
  `pndm` `["Song Keywords"] `
  `pndm` `["song keyword", "number"] `
  `pndm` `["Song Keyword", "Sound Source"] `
  `pndm` `["song keyword", "number", "audio source"] `
  `pndm` `["song keyword", "sound source", "number"] `
  If there is no parameter, the list to be played is listed.
  If there is no music currently, play music.
  If there is music, add it to the list
  If the keyword is an empty string, list it for play.
  1. "Keywords": Song keywords.
  2. "Number": Index of search results.
  3. "Sound Source": Sound source. Currently there are "千", "網", "易", "Q", ~~"我"~~, "狗" and "Y" available.
- `schm` `["Song Keyword"] `
  `schm` `["Song Keyword", "Sound Source"] `
  List search results.
  1. "Keywords": Song keywords.
  2. "Sound Source": There are currently "千", "網", "易", "Q", ~~"我"~~, "狗" and "Y" available.
- `horm` `["username"] `
  Transfer owner permissions to the user.
- `ocdr` `[] `
  Leaving the room and entering the room again.
- `gofr` `["Room Name (RegExp)"] `
  Go to the room that matches the room name. If it fails, return to the origin room.
- `eval` `["lambda script code"]`
  execute lambda script code purely (you cannot store variable)
- `exec` `["lambda script code"]`
  provide the variable`env` for lambda script code execution.
- `func` `["lambda script category and name"]`
  execute lambda script purely (you cannot store variable)
- `script` `["lambda script category and name"]`
  provide the variable`env` for lambda script execution.

> If you want to send `me` message, you can apply msg function with `/me + message` .

> For lambda script binding,
you can refer the `action/wb.js` in bs-pkgs(lambda script packages).
:::

### Plugin <i class="fa fa-plug"></i>

:::success
![](https://i.imgur.com/P1gv1su.png)



#### Button

<i class="glyphicon glyphicon-question-sign"></i> Manual
<i class="glyphicon glyphicon-info-sign"></i> About me
<i class="glyphicon glyphicon-refresh"></i> reset default setting
<i class="glyphicon glyphicon-floppy-remove"></i> reset all environment variables
<i class="glyphicon glyphicon-export"></i> Export settings
choose file：import settings

#### Module Data

You can edit them according the format.
:::

### Script Console <i class="fa fa-terminal"></i>

:::success

Yes, you are right, the extension have a built-in langauge! ٩(๑>◡<๑)۶ 

![](https://i.imgur.com/AMWa4d2.png)


#### Side bar button

- Package (manager)
- ToggleRoom (show/hide)
- Sublime bindings (show editor shortcut)
- Buttons about script
    - Introduction about the language
    - Save script in editor
    - Clear running result
    - Pause the running script (will clear the environment)
    - Execute the script in editor

#### Editor and REPL

Save, Clear, Pause, Execute shortcut would be effective only when your mouse focus editor.
After running script, you can test it in the REPL with current environment.
`ctrl` + `enter` to Execute script in REPL (your mouse must focus the textarea)
:::

:::warning
#### The LambdaScript

More detail please refer the [language introduction](./script-en.html).
:::

:::warning
#### Package Manager
![](https://i.imgur.com/wPOJvM4.png)

After selecting the mirror, click `update` to update index.
Then you can select category and package, you can load it to editor or install it to local.

![](https://i.imgur.com/PpMOgh3.png)

After checking the local package, you can preload or delete it.
Re-open the package window, it would be preload package if it's checked.

![](https://i.imgur.com/2BJoP6w.png)

Ensure it's preload package, you can call the package name as function.
(package would provide the function normally, but you may check the function definition in the package sometimes)

![](https://i.imgur.com/qsuuL1q.png)

Done!

![](https://i.imgur.com/XbC57JG.png)

You can also fork [bs-pkgs](https://gitee.com/DrrrChatbots/bs-pkgs) to maintain a mirror,
then use `add_mirror(alias, repo)` to add your mirror.

![](https://i.imgur.com/XpQ4dcG.png)

or call the function directly.
![](https://i.imgur.com/l7oYdK5.png)

call `del_mirror(alias)` if you want to delete the mirror.

![](https://i.imgur.com/NV1iXRn.png)
:::


## Special Thanks

:::success
@Dolftexic
Thanks the guy give me a lot of advice via e-mail.
:::

:::success
@Transfusion & @Nick
The other two bot developer, who's work help me a lot to design the extension.
:::

:::success
@shishiawase
Advise me add tripcode matching in user pattern.
:::

:::success
@Dawkin & @danding
Active extension user on Discord.
:::

## Related Links

[The Developer](https://drrr.wiki/@%E6%B5%AA%E6%89%93%E8%B2%93)
[DrrrWiKi](https://drrr.wiki/%E6%B5%AA%E6%89%93%E8%81%8A%E5%A4%A9%E6%8F%92%E4%BB%B6)
[QQ Group](https://jq.qq.com/?_wv=1027&k=7JjKVhV0)
[Discord QA Group](https://discord.com/invite/BBCw3UY)
[Gitee Organization](https://gitee.com/DrrrChatbots)
[GitHub Organization](https://github.com/DrrrChatbots)
