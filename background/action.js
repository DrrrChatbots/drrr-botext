
window._actions = {
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
    let msg = msgs[Math.floor(Math.random() * msgs.length)];
    if (!(typeof msg === 'string' || msg instanceof String))
      msg = String(msg);
    setTimeout(
      () => sendTab({
        fn: publish_message,
        args: { msg: msg }
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
  [action_addm] : function(keyword, p1, p2, pos = -1){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    setTimeout(()=>add_search(
      get_music.bind(null, keyword, source),
      false, true, idx, pos), 1000);
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
  [action_pndm] : function(keyword, p1, p2, pos = -1){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    setTimeout(()=>pndMusicKeyword(
      this.config, idx, keyword, source, pos), 1000);
  },
  [action_schm] : function(keyword, source){
    setTimeout(
      ()=>schMusic(this.config, keyword, source,
        (keyw, src, data) => {
          chrome.storage.local.set({
            'MusicSearchHistory': {
              key: keyw,
              src: src,
              data: data,
            }
          });
        }), 1000);
  },
  [action_pshm] : function(idx){
    chrome.storage.local.get('MusicSearchHistory', (cfg) => {
      let publish = (msg) => sendTab({ fn: publish_message, args: { msg: msg } });
      if(cfg['MusicSearchHistory']){
        let {key, src, data} = cfg['MusicSearchHistory'];
        let songs = api[src].songs(data);
        if(idx === undefined || idx.length == 0){
          showSongs(songs, src, data);
        }
        else if(idx && songs.length <= idx)
          publish(`only ${api[src].songs(data).length} available`);
        else{
          let song = data2info(data, src, idx);
          playMusic(song_title(song), song.link, publish);
        }
      } else publish(`no search result, please search first`);
    });
  },
  [action_ashm] : function(idx, pos = -1, autoplay = true){
    chrome.storage.local.get('MusicSearchHistory', (cfg) => {
      let publish = (msg) => sendTab({ fn: publish_message, args: { msg: msg } });
      if(cfg['MusicSearchHistory']){
        let {key, src, data} = cfg['MusicSearchHistory'];
        let songs = api[src].songs(data);
        if(idx === undefined || idx.length == 0){
          showSongs(songs, src, data);
        }
        else if(idx && songs.length <= idx)
          publish(`only ${api[src].songs(data).length} available`);
        else{
          let song = data2info(data, src, idx);
          setTimeout(()=>pndMusic(this.config, song, true, pos, autoplay), 1000);
        }
      } else publish(`no search result, please search first`);
    });
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
  [action_eval] : window.run_lambda_code_purely,
  [action_evalbang] : window.run_lambda_code_impurely,
  [action_call] : window.run_lambda_script_purely,
  [action_callbang] : window.run_lambda_script_impurely,
  [action_nop] : function(){ } ,
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
    let cmat = null;
    if(match_event(type, event) && match_user(req.user, req.trip, user_trip_regex)
      && ((req.text === 'unknown' || req.text === undefined)
        || (cmat = req.text.match(new RegExp(cont_regex))))){
      argfmt(arglist.map(timefmt), req.user, req.text, req.url, (args)=>{
        return _actions[action].apply({
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
      }, cmat);
    }
  });
}

function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {})
}

function actions(stype, callback){
  chrome.storage[stype].get(cfg => {
    callback(objectMap(_actions, f => f.bind({config: cfg})))
  })
}

// utility functions for event action
window.pacts = _actions;
function sync_actions(callback){ actions('sync', callback); }
function sacts(callback){ actions('sync', callback); }
function mapact(name, array){
  actions('sync', acts => array.forEach((v, i) => {
    setTimeout(() => {
      if(Array.isArray(v))
        acts[name].apply(v);
      else{
        acts[name](v)
      }
    }, i * 3000);
  }));
}
