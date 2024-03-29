/* setting.html */

doing = false;
queue = []
function renew_chatroom(){
  if(doing){
    queue.push(1)
  }
  else{
    doing = true;
    wait_again = function(){
      if(globalThis.show_chatroom){
        $('#iframe-container').append('<iframe class="drrr" src="https://drrr.com/"></iframe>');
        setTimeout(remove_until, 5000);
      }
    }
    remove_until = function(){
      if($('.drrr').length > 1){
        $('.drrr')[0].remove();
        setTimeout(remove_until, 5000);
      }
      else if(queue.length){
        queue.pop();
        wait_again();
      }
      else doing = false;
    }
    wait_again();
  }
}

function findUser(name, callback){
  if(drrr.info && drrr.info.room)
    for(let u of drrr.info.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  if(drrr.prevInfo && drrr.prevInfo.room){
    for(let u of drrr.prevInfo.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  }
}

function renew_callback(msg, to){
  if(to
    || !msg.startsWith
    || msg.startsWith('/roll')
    || msg.startsWith('/share')
    || msg.startsWith('/leave')
    || msg.startsWith('/me'))
    return undefined;
  return renew_chatroom;
}

function drrr_send(msg, url, to){

  callback = renew_callback(msg, to);

  cmd = {"message": String(msg)}
  chatcmd = { msg: String(msg) }

  if(url){
    cmd['url'] = url;
    chatcmd['url'] = url;
  }

  if(to){
    findUser(to, (u)=>{
      cmd['to'] = u.id;
      ctrlRoom(cmd, callback, callback);
    });
  }
  else{
    sendTab({ fn: publish_message, args: chatcmd },
      ()=>{ ctrlRoom(cmd, callback, callback) },
      callback);
  };
}

function reload_chatroom(){
  setTimeout(()=>{
    roomTabs((tabs)=>{
      if(tabs.length)
        chrome.tabs.reload(tabs[0].id);
    }, "https://drrr.com/*");
  }, 2000);
}

drrr_builtins = {
  '_prev_say_args': [],
  'repeat': function(msg){
    let [func, args] = drrr._prev_say_args;
    if(func) drrr[func](...args);
  },
  'title': function(msg){
    ctrlRoom({'room_name': String(msg)});
  },
  'descr': function(msg){
    ctrlRoom({'room_description': String(msg)});
  },
  'music': function(url, name){
    ctrlRoom({'music': 'music', 'name': name, 'url': url});
  },
  'dj': function(enable){
    ctrlRoom({'dj_mode': enable});
  },
  'print': function(msg, url){
    drrr._prev_say_args = ['print', arguments];
    drrr_send(msg, url);
  },
  'dm': function(user, msg, url){
    drrr._prev_say_args = ['dm', arguments];
    drrr_send(msg, url, user);
  },
  'chown': function(user){
    findUser(user, (u)=>{
      ctrlRoom({'new_host': u.id});
    })
  },
  'kick': function(user){
    findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'kick': u.id});
    })
  },
  'ban': function(user){
    findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'ban': u.id});
    })
  },
  'report': function(user){
    findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'report_and_ban_user': u.id});
    })
  },
  'unban': function(user){
    findUser(user, (u)=>{
      ctrlRoom({'unban': u.id, 'userName': u.name});
    })
  },
  'leave': function(succ, fail){
    ctrlRoom({'leave': 'leave'}, succ, fail);
  },
  'play': function(keyword, p1, p2, show){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    drrr.log(`play music[${source}][${idx}]: ${keyword}`);
    setTimeout(()=> play_search(
      get_music.bind(null, keyword, source, show),
      (msg) => drrr_send(msg), idx
    ), 1000);
  },
  'join': function(room_id){
    $.ajax({
      type: "GET",
      url: "https://drrr.com/room/?id=" + room_id,
      dataType: 'html',
      success: function(data){
        pprint("join successfully");
        renew_chatroom();
        reload_chatroom();
      },
      error: function(data){
        pprint("join failed");
      }
    });
  },
  'ctrl': ctrlRoom,
  'create': function(name, desc, limit, lang, music, adult, hidden, succ, fail){
    if(!name) name = "Lambda ChatRoom " + String(Math.floor(Math.random() * 100))
    if(!desc) desc = ''
    if(!limit) limit = 5;
    if(!lang) lang = profile.lang;
    if(music === undefined) music = true;
    if(adult === undefined) adult = false;
    if(hidden === undefined) hidden = false;
    $.ajax({
      type: "POST",
      url: "https://drrr.com/create_room/?",
      dataType: 'html',
      data: {
        name: name,
        description: desc,
        limit: limit,
        language: lang,
        music: music,
        adult: adult,
        conceal: hidden,
        submit: "Create+Room"
      },
      success: function(data){
        pprint("create successfully");
        renew_chatroom();
        reload_chatroom();
        if(succ) succ();
      },
      error: function(data){
        pprint("create failed");
        if(fail) fail();
      }
    });
  },
  // for werewolf room on drrr.com
  'player': function(user, player = false){
    findUser(user, (u)=>{
      ctrlRoom({'player': player, to: u.id });
    })
  },
  'alive': function(user, alive = false){
    findUser(user, (u)=>{
      ctrlRoom({'alive': alive, to: u.id });
    })
  },
  'log': function(){
    var logger = document.getElementById('log');
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] == 'object') {
        logger.innerHTML += (JSON && JSON.stringify ?
          JSON.stringify(arguments[i], getCircularReplacer(), 1)
              .replaceAll("\n", "<br>") : arguments[i]) + '&nbsp;';
      } else {
        logger.innerHTML += arguments[i] + '&nbsp;';
      }
    }
    logger.innerHTML += '<br />';
    jQuery( function(){
      var pre = jQuery("#log");
      pre.scrollTop( pre.prop("scrollHeight") );
    });
  },
  'clear': function () {
    var logger = document.getElementById('log');
    logger.innerHTML = "";
  }
}

globalThis.drrr = {}
for(let key in drrr_builtins){
  globalThis.drrr[key] = drrr_builtins[key];
}

drrr.setInfo = function(info){
  if(info){
    globalThis.drrr.prevInfo = globalThis.drrr.info;
    globalThis.drrr.info = info;
    if(info.prfile)
      globalThis.drrr.profile = info.profile;
    if(info.user)
      globalThis.drrr.user = info.user;
    if(info.room){
      globalThis.drrr.room = info.room;
      globalThis.drrr.users = info.room.users;
    }
  }
  if(info && info.redirect) globalThis.drrr.loc = info.redirect;
  else globalThis.drrr.loc = "room";
}

drrr.getLounge = function(callback){
  ajaxRooms((data)=>{
    globalThis.drrr.lounge = data.lounge;
    globalThis.drrr.rooms = data.rooms;
    if(callback) callback(data);
  })
}

drrr.getProfile = function(callback){
  getProfile((profile)=>{
    Profile = profile;
    if(profile) globalThis.drrr.profile = profile;
    if(callback) callback(profile);
  })
}


drrr.getLoc = function(callback){
  getRoom((info)=>{
    drrr.setInfo(info);
    if(callback) callback(info);
  }, (jxhr) => {
    if(jxhr.status == 503){
      sendTab({ fn: reload_room, args: { } })
      setTimeout(() =>  drrr.getLoc(callback), 5 * 1000);
    }
  })
}

drrr.getReady = function(callback){
  drrr.getProfile(() => {
    drrr.getLoc(() => {
      drrr.getLounge(() => {
        callback && callback();
      });
    });
  });
}

function lambdascript_event_action(event, config, req){
  if(!globalThis.machine) return;

  var rules = globalThis.machine.events[""] || []

  if(globalThis.machine.cur.length)
    rules = rules.concat(globalThis.machine.events[globalThis.machine.cur] || [])

  rules.map(([type, action])=> {
    if((Array.isArray(type) && type.includes(event)) || type == event){
      action(req.user, req.text, req.trip, req.url, req);
    }
  });
}
