/* setting.html */

drrr_builtins = {
  'title': function(msg){
    sendTab({ fn: publish_message, args: { msg: String(msg)} });
  },
  'descr': function(msg){
    sendTab({ fn: publish_message, args: { msg: String(msg)} });
  },
  'print': function(msg){
    sendTab({ fn: publish_message, args: { msg: String(msg)} });
  },
  'order': function(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    console.log(`play music[${source}][${idx}]: ${keyword}`);
    setTimeout(()=> play_search(
      get_music.bind(null, keyword, source),
      (msg) => sendTab({
        fn: publish_message,
        args: { msg: msg }
      }), idx
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
