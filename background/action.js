
function exec_lambda_script(pure){
  return function(file){
    function exec(){
      envName = `env-${file}`
      let entries = ["bs-installed"]
      if(!pure) entries.push(envName)
      chrome.storage.local.get(entries, (config)=>{
        code = config["bs-installed"] && config["bs-installed"][file] && config["bs-installed"][file].code;
        if(typeof(code) != "string"){
          alert(`${file} not existed`);
          return;
        }
        if(pure) storage = {}
        else storage = config[envName] || {}
        try{
          storage["evt"] = this.event;
          machine = PS.Main.newMachine();
          machine.env = PS.BotScriptEnv.insert(machine.env)("env")(storage)
          machine = PS.Main.interact(machine)(code)();
          val = machine.val;
          console.log(`action script val => ${stringify(val)}`);
          if(!pure){
            config[envName] = storage;
            chrome.storage.local.set({
              [envName]: config[envName]
            });
          }
        }
        catch(err){
          alert(JSON.stringify(err));
          console.log("error", err);
        }
      })
    }
    if(!drrr.loc) drrr.getReady(exec);
    else exec();
  }
}

function eval_lambda_script(code){
  function exec(){
    if(typeof(code) != "string"){
      alert(`code is not a string`);
      return;
    }
    storage = {}
    try{
      storage["evt"] = this.event;
      machine = PS.Main.newMachine();
      machine.env = PS.BotScriptEnv.insert(machine.env)("env")(storage)
      machine = PS.Main.interact(machine)(code)();
      val = machine.val;
      console.log(`action script val => ${stringify(val)}`);
    }
    catch(err){
      alert(JSON.stringify(err));
      console.log("error", err);
    }
  }
  if(!drrr.loc) drrr.getReady(exec);
  else exec();
}

actions = {
  [action_name] : function(...names){
    setTimeout(
      () => sendTab({
        fn: change_room_title,
        args: { ctx: names[Math.floor(Math.random() * names.length)] }
      }), 500)
  },
  [action_desc] : function(...descs){
    setTimeout(
      () => sendTab({
        fn: change_room_descr,
        args: { ctx: descs[Math.floor(Math.random() * descs.length)] }
      }), 500)
  },
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
  [action_mus ] : function(url, title){
    if(url){
      setTimeout(
        () => sendTab({
          fn: play_music,
          args: {
            title: title || '',
            url: url
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
  [action_unban] : function(user){
    setTimeout(
      () => sendTab({
        fn: unban_member,
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
    setTimeout(()=>lstMusic(this.config), 1000);
  },
  [action_nxtm] : function(){
    setTimeout(()=> play_next(this.config, (msg) => sendTab({ fn: publish_message, args: { msg: msg } })), 1000);
  },
  [action_pndm] : function(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    setTimeout(()=>pndMusic(this.config, idx, keyword, source), 1000);
  },
  [action_schm] : function(keyword, source){
    setTimeout(()=>schMusic(this.config, keyword, source), 1000);
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
              toURL = `https://drrr.com/room/?id=${groups[Math.floor(Math.random() * groups.length)][0].roomId}`
              sendTab({
                fn: leave_room,
                args: {
                  jump: toURL
                }
              }, () => {
                chrome.storage.sync.get('jumpToRoom', conf => {
                  if(conf['jumpToRoom']) return;
                  roomTabs((tabs) => {
                    if(tabs.length){
                      chrome.storage.sync.set({
                        jumpToRoom: toURL
                      }, () => chrome.tabs.reload(tabs[0].id));
                      ;
                    }
                  }, 'https://drrr.com/lounge/*')
                })
              });
            }
            else{
              sendTab({ fn: leave_room, args: {ret: true} });
            }
          }
        );
      });
  },
  [action_eval] : eval_lambda_script,
  [action_func] : exec_lambda_script(true),
  [action_script] : exec_lambda_script(false),
  /* too quick leading play song failed in content script, so setTimeout */
}

function match_event(type, event){
  if(Array.isArray(type))
    return type.includes(event) || type.includes("*");
  else
    return type == event || type == "*";
}

function event_action(event, config, req){
  var rules = settings[EVENTACT].load(config[sid(EVENTACT)]);
  rules.map(([type, user_trip_regex, cont_regex, action, arglist])=> {
    if(match_event(type, event) && match_user(req.user, req.trip, user_trip_regex)
      && ((req.text === 'unknown' || req.text === undefined) || req.text.match(new RegExp(cont_regex)))){
      argfmt(arglist.map(timefmt), req.user, req.text, req.url, (args)=>{
        return actions[action].apply({
          event: {
            type: req.type,
            host: req.host,
            user: req.user,
            trip: req.trip,
            text: req.text,
            url: req.url
          },
          config: config
        }, args);
      });
    }
  });
}
