
actions = {
  [action_msg ] : function(...msgs){
    if(!msgs.length) msgs = [''];
    setTimeout(
      () => sendTab({
        fn: publish_message,
        args: { msg: msgs[Math.floor(Math.random() * msgs.length)] }
      }), 1000);
  },
  [action_horm ] : function(user){
    setTimeout(
      () => sendTab({
        fn: handover_room,
        args: { user: user }
      })
      , 1000);

  },
  [action_umsg ] : function(url, ...msgs){
    if(url){
      if(!msgs.length) msgs = [''];
      setTimeout(
        () => sendTab({
          fn: publish_message,
          args: {
            url: url,
            msg: msgs[Math.floor(Math.random() * msgs.length)]
          }
        }), 1000);
    }
  },
  [action_dm  ] : function(user, ...msgs){
    if(!msgs.length) msgs = [''];
    setTimeout(
      () => sendTab({
        fn: dm_member,
        args: {
          user: user,
          msg: msgs[Math.floor(Math.random() * msgs.length)]
        }
      }), 1000);
  },
  [action_udm ] : function(user, url, ...msgs){
    if(url){
      if(!msgs.length) msgs = [''];
      setTimeout(
        () => sendTab({
          fn: dm_member,
          args: {
            user: user,
            url: url,
            msg: msgs[Math.floor(Math.random() * msgs.length)]
          }
        }), 1000);
    }
  },
  [action_kick] : function(user){
    setTimeout(
      () => sendTab({
        fn: kick_member,
        args: { user: user }
      }), 500)
  },
  [action_ban] : function(user){
    setTimeout(
      () => sendTab({
        fn: ban_member,
        args: { user: user }
      }), 500)
  },
  [action_banrpt] : function(user){
    setTimeout(
      () => sendTab({
        fn: ban_report_member,
        args: { user: user }
      }), 500)
  },
  [action_plym] : function(keyword, p1, p2){
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
  },
  [action_addm] : function(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    setTimeout(()=>add_search(get_music.bind(null, keyword, source), false, true, idx), 1000);
  },
  [action_delm] : function(idx){
    setTimeout(()=>del_song(PLAYLIST, idx, undefined, false, true), 1000);
  },
  [action_lstm] : function(){
    setTimeout(()=>lstMusic(this), 1000);
  },
  [action_nxtm] : function(){
    setTimeout(()=> play_next(this, (msg) => sendTab({ fn: publish_message, args: { msg: msg } })), 1000);
  },
  [action_pndm] : function(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    setTimeout(()=>pndMusic(this, idx, keyword, source), 1000);
  },
  [action_schm] : function(keyword, source){
    setTimeout(()=>schMusic(this, keyword, source), 1000);
  },
  [action_ocdr] : function(){
    sendTab({ fn: leave_room, args: {ret: true} });
  },
  [action_gofr] : function(roomRegex){
    ajaxRooms(
      function(data){
        lounge = data.rooms;
        var findRule = {'friend':true, 'home':true, 'tripcode':true, 'AVAIL': true};
        if(typeof roomRegex === 'string') findRule = {'room': [roomRegex], 'AVAIL': true};
        findAsList(
          findRule,
          lounge, undefined, (groups, config)=>{
            if(groups.length){
              sendTab({ fn: leave_room, args: {jump: `https://drrr.com/room/?id=${groups[Math.floor(Math.random() * groups.length)][0].roomId}`} });
            }
            else{
              sendTab({ fn: leave_room, args: {ret: true} });
            }
          }
        );
      });
  }
  /* too quick leading play song failed in content script, so setTimeout */
}

function event_action(event, config, req){
  var rules = settings[EVENTACT].load(config[sid(EVENTACT)]);
  rules.map(([type, user_trip_regex, cont_regex, action, arglist])=> {
    if(((Array.isArray(type) && type.includes(event)) || type == event)
      && match_user(req.user, req.trip, user_trip_regex)
      && ((req.text === 'unknown' || req.text === undefined) || req.text.match(new RegExp(cont_regex)))){
      argfmt(arglist.map(timefmt), req.user, req.text, req.url, (args)=>{
        return actions[action].apply(config, args);
      });
    }
  });
}
