/* setting.html */

function renew_chatroom(){
  pre = $('#drrr');
  $('#iframe-container').after('<iframe id="drrr" src="https://drrr.com/"></iframe>');
  setTimeout(function(){
    pre.remove();
  }, 3000);
}

function findUser(name, callback, info){
  if(!info) info = roomInfo;
  if(info && info.room)
    for(u of info.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  if(prevRoomInfo && prevRoomInfo.room){
    for(u of prevRoomInfo.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  }
}

function renew_callback(msg, to){
  if(to || message.startsWith('/roll')
        || message.startsWith('/share')
        || message.startsWith('/leave'))
    return undefined;
  return renew_chatroom;
}

function drrr_send(msg, url, to){

  callback = renew_callback(msg, to);

  cmd = {"message": String(msg)}
  chatcmd = { msg: String(msg)} }

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
    sendTab({ fn: publish_message, chatcmd,
      ()=>{
        ctrlRoom(cmd, callback, callback)
      }, undefined, callback);
  }
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
  'leave': function(user, msg, url){
    drrr_send("/leave");
  },
  'play': function(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    console.log(`play music[${source}][${idx}]: ${keyword}`);
    setTimeout(()=> play_search(
      get_music.bind(null, keyword, source),
      (msg) => drrr_send(msg), idx
    ), 1000);
  }
}

globalThis.drrr = {}
for(key in drrr_builtins){
  globalThis.drrr[key] = drrr_builtins[key];
}

$(document).ready(()=>{
  getProfile((profile)=>{
    if(profile) globalThis.profile = profile;
  })
  getRoom((info)=>{
    if(info){
      globalThis.info = info;
      globalThis.profile = info.profile;
      globalThis.user = info.user;
      if(info.room){
        globalThis.room = info.room;
        globalThis.users = info.room.users;
      }
    }
  })
});

function event_action(event, config, req){
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

chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){
    globalThis.lastReq = req;
    event_action(req.type, {}, req);
    //console.log(req);
    //console.log(JSON.stringify(sender))
  }
  else if(sender.url.match(new RegExp('https://drrr.com/lounge'))){
    //console.log(req);
    //console.log(JSON.stringify(sender))
  }
  if(callback){
    //alert(JSON.stringify(req));
    //console.log(JSON.stringify(req))
    //callback();
  }
})
