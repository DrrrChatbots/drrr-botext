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
  if(info && info.room)
    for(u of info.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  if(prevInfo && prevInfo.room){
    for(u of prevInfo.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  }
}

function renew_callback(msg, to){
  if(to || msg.startsWith('/roll')
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
  'title': function(msg){
    ctrlRoom({'room_name': String(msg)});
  },
  'descr': function(msg){
    ctrlRoom({'room_description': String(msg)});
  },
  'print': function(msg, url){
    drrr_send(msg, url);
  },
  'dm': function(user, msg, url){
    drrr_send(msg, url, user);
  },
  'chown': function(user){
    findUser(user, (u)=>{
      ctrlRoom({'new_host': u.id});
    })
  },
  'kick': function(user){
    findUser(user, (u)=>{
      if(u.tripcode === 'L/CaT//Hsk')
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'kick': u.id});
    })
  },
  'ban': function(user){
    findUser(user, (u)=>{
      if(u.tripcode === 'L/CaT//Hsk')
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'ban': u.id});
    })
  },
  'report': function(user){
    findUser(user, (u)=>{
      if(u.tripcode === 'L/CaT//Hsk')
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'report_and_ban_user': u.id});
    })
  },
  'unban': function(user){
    findUser(user, (u)=>{
      ctrlRoom({'unban': u.id});
    })
  },
  'leave': function(user, msg, url){
    ctrlRoom({'leave': 'leave'});
  },
  'play': function(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    log(`play music[${source}][${idx}]: ${keyword}`);
    setTimeout(()=> play_search(
      get_music.bind(null, keyword, source),
      (msg) => drrr_send(msg), idx
    ), 1000);
  },
  'join': function(room_id){
    $.ajax({
      type: "GET",
      url: `https://drrr.com/room/?id=${room_id}`,
      dataType: 'html',
      success: function(data){
        console.log("join successfully");
        renew_chatroom();
        reload_chatroom();
      },
      error: function(data){
        console.log("join failed");
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
      url: `https://drrr.com/create_room/?`,
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
        console.log("create successfully");
        renew_chatroom();
        reload_chatroom();
        if(succ) succ();
      },
      error: function(data){
        console.log("create failed");
        if(fail) fail();
      }
    });
  }
}

globalThis.drrr = {}
for(key in drrr_builtins){
  globalThis.drrr[key] = drrr_builtins[key];
}

function updateInfo(info){
  if(info){
    globalThis.prevInfo = globalThis.info;
    globalThis.info = info;
    if(info.prfile)
      globalThis.profile = info.profile;
    if(info.user)
      globalThis.user = info.user;
    if(info.room){
      globalThis.room = info.room;
      globalThis.users = info.room.users;
    }
  }
  if(info && info.redirect) globalThis.loc = info.redirect;
  else globalThis.loc = "room";
}

function updateLounge(callback){
  ajaxRooms((data)=>{
    globalThis.lounge = data.lounge;
    globalThis.rooms = data.rooms;
    if(callback) callback(data);
  })
}

function updateProfile(callback){
  getProfile((profile)=>{
    if(profile) globalThis.profile = profile;
    if(callback) callback(profile);
  })
}

function updateLoc(callback){
  getRoom((info)=>{
    updateInfo(info);
    if(callback) callback();
  })
}

$(document).ready(()=>{
  updateProfile();
  updateLoc();
  updateLounge();
});

function botscript_event_action(event, config, req){
  var rules = PS.DrrrBot.events[""] || []

  if(PS.DrrrBot.cur.length)
    rules = rules.concat(PS.DrrrBot.events[PS.DrrrBot.cur] || [])

  rules.map(([type, user_trip_regex, cont_regex, action])=> {
    if((Array.isArray(type) && type.includes(event)) || type == event){
      log("event matched!");
      if(match_user(req.user, req.trip, user_trip_regex)){
        log("user matched!");
        if((req.text === 'unknown' || req.text === undefined)
          || req.text.match(new RegExp(cont_regex))){
          log("context matched!");
          action(req.user, req.text, req.url, req.trip, req);
          //argfmt(arglist, req.user, req.text, req.url, (args)=>{
          //  return actions[action].apply(config, args);
          //});
        } else log('content unmatched', req.text, cont_regex);
      } else log('user unmatched', req.user, user_trip_regex);
    } else log('event unmatched', event);
  });
}
