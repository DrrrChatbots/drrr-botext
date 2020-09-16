var ROOM_GUARD = "ROOM_GUARD"
var OBSERVE = "OBSERVE"
var ENEMY = "ENEMY"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `<p>歡迎使用房間守衛模組</p>`:`<p>Welcome to room guard module</p>`

export const ui = (config) => {
  return `
  <div class="input-group">
    <!--
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
    -->
  </div>
  <div class="row" style="height:100%">
    <div class="col-md-4">
      <div class="list-group" style="margin-bottom: 0px;">
        <hr>
        <div id='observe_list_container'></div>
      </div>
    </div>
  </div>
  <div class="row" style="height:100%">
    <div class="col-md-4">
      <div class="list-group" style="margin-bottom: 0px;">
        <hr>
        <div id='enemy_list_container'></div>
      </div>
    </div>
  </div>
  <br>${intro}`
}

var del_enemy_btn = (args) =>
  `<button class="btn btn-default del-enemy" type="submit"
         data="${args.data}"   title="remove the user from enemy list">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

function bind_del_enemy(args){
  $(`.del-enemy[data="${args.data}"]`).click(function(){
    chrome.storage.sync.get([ENEMY], (config) =>{
      var enemy = config[ENEMY]
      enemy.splice(enemy.indexOf($(this).attr('data')), 1);
      chrome.storage.sync.set({ [ENEMY]: enemy });
      show_enemy_list(config);
    });
  });
}

export const ui_event = (config) => {
  btn_funcbind[del_enemy_btn] = bind_del_enemy;
  show_observe_list(config);
  show_enemy_list(config);

  chrome.runtime.onMessage.addListener((req, sender, callback) => {
    if(req){
      if(req.show_observe_list) show_observe_list(req.config);
      if(req.show_enemy_list) show_enemy_list(req.config);
    }
    if(callback) callback();
  });
}

export const event_action = (req, config) => {
  var type = req.type;
  var enemy = config[ENEMY];
  var observe = config[OBSERVE];
  if(!observe) observe = [];
  if(!enemy) enemy = [];
  if(type == event_join){
    if(enemy && enemy.includes(req.user)){
      setTimeout(()=> sendTab({ fn: ban_member, args: { user: req.user } }), 200);
    }
    else{
      if(!observe.includes(req.user)){
        observe.push(req.user);
        chrome.storage.sync.set({ [OBSERVE]: observe });
        chrome.runtime.sendMessage({show_observe_list: true, config: config});
      }
    }
  }
  else if(type == event_leave && observe){
    if(observe.includes(req.user)){
      observe.splice(observe.indexOf(req.user), 1);
      enemy.push(req.user);
      chrome.storage.sync.set({
        [OBSERVE]: observe,
        [ENEMY]: enemy
      });
      chrome.runtime.sendMessage({show_observe_list: true, show_enemy_list: true, config: config});
    }
  }
  else{
    if(observe && observe.includes(req.user)){
      observe.splice(observe.indexOf(req.user), 1);
      chrome.storage.sync.set({ [OBSERVE]: observe });
      chrome.runtime.sendMessage({show_observe_list: true, config: config});
    }
  }
}

// module logic
function show_observe_list(config){
  show_configlist(
    '#observe_list_container',
    OBSERVE, ()=>{},
    [],
    'EMPTY OBERSERVATION LIST', {
      title: (c, name) => `${name} is in observation`,
      content: (c, name) => `${name}`,
      data: (c, name) => `${name}`,
      icon: 'glyphicon-list'
    }, config);
}

function show_enemy_list(config){
  show_configlist(
    '#enemy_list_container',
    ENEMY, ()=>{},
    [del_enemy_btn],
    'EMPTY ENEMY LIST', {
      title: (c, name) => `delete ${name} from enemy list`,
      content: (c, name) => `${name}`,
      data: (c, name) => `${name}`,
      icon: 'glyphicon-list'
    }, config);
}
