var P2P_CHAT = "P2P_CHAT"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `歡迎使用點對點聊天模組。`:`Welcome to P2P CHAT module.`

export const ui = (config) => {
  return `
  <div class="input-group">
     <span class="input-group-addon"><i class="glyphicon glyphicon-list"></i></span>
     <span class="input-group-addon form-control panel-footer text-center" title="call the peer">${intro}</span>
     <div class="input-group-btn">
      <button id="call_ui" class="btn btn-default" type="button" title="Launch UI">
        <i class="glyphicon glyphicon-phone-alt"></i>
      </button>
     </div>
  </div>
  <hr>
  <div class="row" style="height:100%">
    <div class="col-md-4">
      <div class="list-group" style="margin-bottom: 0px;">
        <div id='peer_list_container'></div>
      </div>
    </div>
  </div>`
}

var call_peer_btn = (args) =>
  `<button class="btn btn-default call-peer" type="submit"
         data="${args.data.id}"   title="call the peer user">
     <i class="glyphicon glyphicon-earphone"></i>
  </button>`

function bind_call_peer(args){
  $(`.call-peer[data="${args.data.id}"]`).click(function(){
    chrome.tabs.create({
      url: chrome.extension.getURL(`/peerjs/p2p-chat.html?uid=${args.data.selfID}&wait=${args.data.id}`)
    });
  });
}

export const ui_event = (config) => {
  var data = {'peers': []};
  btn_funcbind[call_peer_btn] = bind_call_peer;
  getRoom((info) => {
    $('#call_ui').click(function(){
      var param = info.profile ? `?uid=${info.profile.id}` : '';
      chrome.tabs.create({
        url: chrome.extension.getURL(`/peerjs/p2p-chat.html${param}`)
      });
    });
    if(info.room)
      info.room.users.forEach(u => {
        if(info.profile.name !== u.name)
          data.peers.push({
            name: `${u.name}`,
            id: u.id,
            selfID: info.profile.id
          });
      })
    show_peer_list(data);
  }, (err) => {
    // alert("Cannot get room list");
    // https://alertifyjs.com/
  })
}

export const event_action = (req, config) => {
  var type = req.type;
}

function show_peer_list(config){
  show_configlist(
    '#peer_list_container',
    'peers', ()=>{},
    [call_peer_btn],
    'EMPTY PEER USER LIST', {
      title: (c, e) => `call the peer`,
      content: (c, e) => `${e.name}`,
      data: (c, e) => ({id: e.id, selfID: e.selfID}),
      icon: 'glyphicon-list'
    }, config);
}
