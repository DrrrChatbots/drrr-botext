var ROOM_GUARD = "ROOM_GUARD"
var OBSERVE = "OBSERVE"
var ENEMY = "ENEMY"

var language = window.navigator.userLanguage || window.navigator.language;
var count_alert = (language == 'zh-CN' || language == 'zh-TW') ? '倒數 5 秒，請回覆不然就踢' : 'reply me in 5 secs, or I\'ll kick you'

var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `<p>歡迎使用房間守衛模組。<br>mode 0: 訪客如果進房後沒有任何動作，將在下次進房被 kick/ban。<br>mode 1: 時間內內沒說話，詢問是否 kick/ban。<br>mode 2: 時間內沒說話，倒數然後 kick/ban<br>mode 3: 時間內沒說話，直接 kick/ban</p>`:`<p>Welcome to room guard module.<br>mode 0: Uesr will be kick/ban next if leave room silently.<br>mode 1: Ask if kick/ban user if is silent in the period<br>mode 2: Count down then kick/ban if silent in the period<br>mode 3: Kick/ban the user if is silent in the period</p>`

export const ui = (config) => {
  return `
  ${intro}
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
  <select id="rgmode">
    <option value="0">mode 0</option>
    <option value="1">mode 1</option>
    <option value="2">mode 2</option>
    <option value="3">mode 3</option>
  </select>
  <select id="rgkmode">
    <option value="0">kick</option>
    <option value="1">ban</option>
    <option value="2">report</option>
  </select>
  <select id="rgktime">
    <option value="10000">10 secs</option>
    <option value="30000">30 secs</option>
    <option value="60000">1 min</option>
    <option value="120000">2 min</option>
    <option value="240000">4 min</option>
    <option value="480000">8 min</option>
    <option value="960000">12 min</option>
    <option value="1920000">24 min</option>
  </select>
  <hr>
  <div class="row" style="height:100%">
    <div class="col-md-4">
      <div class="list-group" style="margin-bottom: 0px;">
        <div id='observe_list_container'></div>
        <div id='enemy_list_container'></div>
      </div>
    </div>
  </div>`
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

  var mode = config['#rgmode'] || 0;
  var kmode = config['#rgkmode'] || 0;
  var ktime = config['#rgktime'] || 120000;
  $('#rgmode').val(mode);
  $('#rgmode').on('change', function() {
    chrome.storage.sync.set({'#rgmode': this.value});
    mode = this.value;
  });
  $('#rgkmode').val(kmode);
  $('#rgkmode').on('change', function() {
    chrome.storage.sync.set({'#rgkmode': this.value});
    kmode = this.value;
  });
  $('#rgktime').val(ktime);
  $('#rgktime').on('change', function() {
    chrome.storage.sync.set({'#rgktime': this.value});
    ktime = this.value;
  });

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

const kmodes = [kick_member, ban_member, ban_report_member];

export const event_action = (req, config) => {

  var type = req.type;
  var enemy = config[ENEMY] || [];
  var observe = config[OBSERVE] || [];
  var mode = config['#rgmode'] || 0;
  var kmode = config['#rgkmode'] || 0;
  var ktime = config['#rgktime'] || 120000;

  if(!req.host){
    if(observe.length || enemy.length)
      chrome.storage.sync.set({ [ENEMY]: [], [OBSERVE]: [] });
    return;
  }


  if(type == event_join){
    if(enemy && enemy.includes(req.user) && mode == 0){
      setTimeout(()=> sendTab({ fn: kmodes[kmode], args: { user: req.user } }), 200);
    }
    else{
      sendTab({fn: set_clock, args: {ms: Number(ktime), from: ROOM_GUARD, user: req.user}});
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
  else if(type == event_clock){
    if(req.args.from == ROOM_GUARD && observe.includes(req.args.user)){
      if(mode == 1){
        sendTab({fn: show_confirm, args: {text: `Do you want to kick ${req.args.user}? (y/y)`}}, undefined, function(yn){
          if(yn){
            setTimeout(()=> sendTab({ fn: kmodes[kmode], args: { user: req.args.user } }), 200);
          }
        });
      }
      else if(mode == 2){
        if(req.args.action === undefined){
          sendTab({ fn: dm_member, args: { msg: `@${req.args.user} ${count_alert}`, user: req.args.user} });
          setTimeout(()=>sendTab({fn: set_clock, args: {ms: 5000, from: ROOM_GUARD, user: req.args.user, action: "del"}}), 100);
        }
        else setTimeout(()=> sendTab({ fn: kmodes[kmode], args: { user: req.args.user } }), 200);
      }
      else if(mode == 3){
        setTimeout(()=> sendTab({ fn: kmodes[kmode], args: { user: req.args.user } }), 200);
      }
    }
  }
  else if([event_kick, event_ban, event_banrpt].includes(type)){
    if(observe.includes(req.user)){
      observe.splice(observe.indexOf(req.user), 1);
      chrome.storage.sync.set({ [OBSERVE]: observe });
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

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
