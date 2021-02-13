var PEER_CALL = "PEER_CALL"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `歡迎使用點對點通話模組。`:`Welcome to Peer Call module.`

//Object.defineProperty(String.prototype, 'hashCode', {
//  value: function() {
//    var hash = 0, i, chr;
//    for (i = 0; i < this.length; i++) {
//      chr   = this.charCodeAt(i);
//      hash  = ((hash << 5) - hash) + chr;
//      hash |= 0; // Convert to 32bit integer
//    }
//    return hash;
//  }
//});

export const ui = (config) => {
  return `
  <div class="input-group">
     <span class="input-group-addon"><i class="glyphicon glyphicon-list"></i></span>
     <span class="input-group-addon form-control panel-footer text-center">${intro}</span>
     <div class="input-group-btn">
      <button id="call_ui" class="btn btn-default" type="button" title="Launch UI">
        <i class="glyphicon glyphicon-phone-alt"></i>
      </button>
     </div>
  </div>
  <!--
  <div class="input-group">
    <div class="input-group-btn">
        <button id="trpg_host" class="btn btn-default" type="button" title="become host">
            <i id="is_host" class="glyphicon glyphicon-user"></i>
        </button>
    </div>

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>

    <input id="trpg_bg_url" type="text" class="form-control" placeholder="SCENE URL">

    <div class="input-group-btn">
        <button id="set_trpg_bg" class="btn btn-default" type="button"
                                                               data-delayed-toggle="collapse" data-target=""
                                                                                              title="set scene">
            <i id="" class="glyphicon 	glyphicon-picture"></i>
        </button>
    </div>
  </div>
    -->
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
      url: chrome.extension.getURL(`/peerjs/audio-chat.html?host=${args.data.selfID}&wait=${args.data.id}`)
    });
  });
}

export const ui_event = (config) => {
  var data = {'peers': []};
  btn_funcbind[call_peer_btn] = bind_call_peer;
  getRoom((info) => {
    $('#call_ui').click(function(){
      var param = info.profile ? `?host=${info.profile.id}` : '';
      chrome.tabs.create({
        url: chrome.extension.getURL(`/peerjs/audio-chat.html${param}`)
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
    alert("Cannot get room list");
  })
}

export const event_action = (req, config) => {
  var type = req.type;
  //var enemy = config[ENEMY];
  //var observe = config[OBSERVE];
  //if(!observe) observe = [];
  //if(!enemy) enemy = [];
  //if(type == event_join){
  //  if(enemy && enemy.includes(req.user)){
  //    setTimeout(()=> sendTab({ fn: ban_member, args: { user: req.user } }), 200);
  //  }
  //  else{
  //    if(!observe.includes(req.user)){
  //      observe.push(req.user);
  //      chrome.storage.sync.set({ [OBSERVE]: observe });
  //      chrome.runtime.sendMessage({show_observe_list: true, config: config});
  //    }
  //  }
  //}
  //else if(type == event_leave && observe){
  //  if(observe.includes(req.user)){
  //    observe.splice(observe.indexOf(req.user), 1);
  //    enemy.push(req.user);
  //    chrome.storage.sync.set({
  //      [OBSERVE]: observe,
  //      [ENEMY]: enemy
  //    });
  //    chrome.runtime.sendMessage({show_observe_list: true, show_peer_list: true, config: config});
  //  }
  //}
  //else{
  //  if(observe && observe.includes(req.user)){
  //    observe.splice(observe.indexOf(req.user), 1);
  //    chrome.storage.sync.set({ [OBSERVE]: observe });
  //    chrome.runtime.sendMessage({show_observe_list: true, config: config});
  //  }
  //}
}

// module logic
//function show_observe_list(config){
//  show_configlist(
//    '#observe_list_container',
//    OBSERVE, ()=>{},
//    [],
//    'EMPTY OBERSERVATION LIST', {
//      title: (c, name) => `${name} is in observation`,
//      content: (c, name) => `${name}`,
//      data: (c, name) => `${name}`,
//      icon: 'glyphicon-list'
//    }, config);
//}

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
