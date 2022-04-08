# Drrr Chat Bot Extension

## Install

#### Computer:

It's a chrome extension, so please use the google chrome browser, and goto [Google WebStore](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) to get the installation.

If your browser is Opera, you can try the [Opera Extension](https://addons.opera.com/zh-tw/extensions/details/install-chrome-extensions/) to **Install Chrome Extensions**.

#### Phone:

The extension on Chrome App is not available, but you can use Yandex browser([Android](https://play.google.com/store/apps/details?id=ru.yandex.searchplugin&hl=en_US), Yandex on iOS doesn't provide extension), the App uses chrome kernel, so you can goto [Google WebStore](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) to install the chatbot extension.

Kiwi browser can also run the extenson, but for some unknown bugs, I make a custmized version for it(the kiwi branch). You can install it via the .crx or install [the version from WebStore](https://chrome.google.com/webstore/detail/drrr-chatbot-extension-ki/ejklpmiadilgeabpklkickjghjegcblj)

#### Background:

[The background version](https://chrome.google.com/webstore/detail/drrr-chatbot-extension-ba/iafmncflgcckjejinbaneekanabjnodm) let you change the icon (i.e. Bot cog) on the site. But it may run in the background, which means it would cost more resources.

#### Incoming:

Firefox add-ons is still under reviewing, and it may be both available on PC and Android.

## Manual

Follow the [manual](https://hackmd.io/@nobodyzxc/SkoZau-Qd)

## Discord

Join our discord channel to have some discussion.

[![DrrrChat](https://discordapp.com/api/guilds/700216589190037515/widget.png?style=banner3)](https://discord.com/invite/cveZZTt)

## TODO

### dev

- detect protected music.168 source
- support room member variable (include self -> dm to self, roomOwner) in list
- add neteaseWorld support
- pokemon monster module
- netease playlist
- hidden room on drrr.chat (by peer.js)
- tripcode storage

### Haven't documented features

- abuse room hiding
- script binding on timer and event
- peer chat

### peer chat room login mechanism

Tripcode

input => output (peer id = output + [0-9])

validation: input sign, (public key need to be generated) validation


No Tripcode

privateKey, publicKey

peerID = {publicKey}[0-9]

validation = validate publicKey (sign privateKey (otherPeerID))

### Advanced Background Setting


```
[key], events, users, conts, func, params

key: string, [string], bool, [bool], [string, bool]
events: #string, [#string...]

// design: not self, neg
users: string, [string...]

// design: multiple keyword
conts: string, [string...]

func: #string

// design: consider more complex function params,
// qualified by conts matching
params: [string...]

"事件類型", "用戶匹配", "內容匹配", "函數", ["參數", ...]
["事件類型", ...], "用戶匹配", "內容匹配", "函數", ["參數", ...]
```

- add rule key, ["key", true]
- add rule key control function (toggle, enable, disable, new, delete)

- seq msg (use first argument as array)

- timer offset (done, not handle date yet)

- top to down stop or continue
- avoid self (rule or switcher), pattern list, false
- multiple user pattern
- multiple keyword pattern (<= advanced argument matching)

- multiple keyword intent matching, set([people, something]), seq(people, something, time)

- custom room input (add some special command, input, something...)
