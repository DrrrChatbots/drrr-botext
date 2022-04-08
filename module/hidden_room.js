var HIDDEN_ROOM = "HIDDEN_ROOM"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `<p>歡迎使用隱藏房間模組。</p>`:`<p>Welcome to hidden room module.</p>`

Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});

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
  <hr>
  <div class="row" style="height:100%">
    <div class="col-md-4">
      <div class="list-group" style="margin-bottom: 0px;">
        <div id='hidden_list_container'></div>
      </div>
    </div>
  </div>`
}

var goto_hidden_btn = (args) =>
  `<button class="btn btn-default goto-hidden" type="submit"
         data="${args.data}"   title="go to the hidden room">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

function bind_del_enemy(args){
  $(`.goto-hidden[data="${args.data}"]`).click(function(){
    alert("gogogo");
    //chrome.storage.local.get([ENEMY], (config) =>{
    //  var enemy = config[ENEMY]
    //  enemy.splice(enemy.indexOf($(this).attr('data')), 1);
    //  chrome.storage.local.set({ [ENEMY]: enemy });
    //  show_hidden_list(config);
    //});
  });
}

export const ui_event = (config) => {

  var doors = {'hidden_door': []};
  //Whisperd, check new room
  btn_funcbind[goto_hidden_btn] = bind_del_enemy;
  $.ajax({
    type: "GET",
    url: `https://drrr.chat/d/1324-hidden-room-dispatcher/10000`,
    dataType: 'html',
    success: function(data){
      var nodes = data.match(new RegExp(/<\s*noscript\s*id="flarum-content"\s*[^>]*>((.|\n)*?)<\s*\/\s*noscript>/g));
      for(var u of $($.parseHTML(nodes[0])).find('h3')){
        console.log(u.textContent, u.nextElementSibling.textContent.trim());
        const str = u.nextElementSibling.textContent.trim();
        const regexp = /feature:<(.*)> encoded:<(.*)>/g;
        const matches = [...str.matchAll(regexp)];
        if(matches[0]){
          console.log(matches);
          var [_, salt, encoded, ..._] = matches[0];
          console.log(salt, encoded);
          doors.hidden_door.push({user: u.textContent, salt: salt, id: encoded});
        }
      }
      show_hidden_list(doors);
    },
    error: function(data){
      if(data.status == 401){
        alert("you need login drrr.chat first");
        chrome.tabs.create({url: 'https://drrr.chat'});
      }
      else alert("fetch failed" + JSON.stringify(data));
    }
  });
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
  //      chrome.storage.local.set({ [OBSERVE]: observe });
  //      chrome.runtime.sendMessage({show_observe_list: true, config: config});
  //    }
  //  }
  //}
  //else if(type == event_leave && observe){
  //  if(observe.includes(req.user)){
  //    observe.splice(observe.indexOf(req.user), 1);
  //    enemy.push(req.user);
  //    chrome.storage.local.set({
  //      [OBSERVE]: observe,
  //      [ENEMY]: enemy
  //    });
  //    chrome.runtime.sendMessage({show_observe_list: true, show_hidden_list: true, config: config});
  //  }
  //}
  //else{
  //  if(observe && observe.includes(req.user)){
  //    observe.splice(observe.indexOf(req.user), 1);
  //    chrome.storage.local.set({ [OBSERVE]: observe });
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

function show_hidden_list(config){
  show_configlist(
    '#hidden_list_container',
    'hidden_door', ()=>{},
    [goto_hidden_btn],
    'EMPTY HIDDEN ROOM LIST', {
      title: (c, e) => `try the hidden room - ${e.id} `,
      content: (c, e) => `${e.user + ": " + e.id}`,
      data: (c, e) => `${e.id}`,
      icon: 'glyphicon-list'
    }, config);
}
