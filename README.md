# Drrr Chat Bot Extension

## Install

#### Computer:

It's a chrome extension, so please use the google chrome browser, and goto [Google WebStore](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) to get the installation.

If your browser is Opera, you can try the [Opera Extension](https://addons.opera.com/zh-tw/extensions/details/install-chrome-extensions/) to **Install Chrome Extensions**.

#### Phone:

The extension on Chrome App is not available, but you can use Yandex browser([Android](https://play.google.com/store/apps/details?id=ru.yandex.searchplugin&hl=en_US), Yandex on iOS doesn't provide extension), the App uses chrome kernel, so you can goto [Google WebStore](https://chrome.google.com/webstore/detail/drrr-chatbot-extension/fkmpnkcjocenkliehpdhlfbmdmdnokgm) to install the chatbot extension.

## Manual

Follow the [manual](https://nobodyzxc.github.io/drrr-botext-manual/)

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
