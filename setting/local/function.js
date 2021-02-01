const nothing = ()=>{};

function close_switch(id, callback){
  return () => chrome.storage.local.get((config)=>{
    if(config[id]){
      chrome.storage.local.set(
        { [id]: false },
        ()=>{
          chrome.notifications.create({
            type: "basic",
            iconUrl: '/icon.png',
            title: `EMPTY SETTING, SWITCH OFF `,
            message: `switch off because empty setting`
          });
          callback && callback();
        }
      );
    }
  });
}

function start_switch(id, f2t_callback, t2t_callback){
  return ()=> chrome.storage.local.get((config)=>{
    if(!config[id]){
      if(confirm('switch is not active, do you want to start?')){
        return chrome.storage.local.set(
          { [id]: true },
          ()=> f2t_callback && f2t_callback()
        );
      }
    }
    t2t_callback && t2t_callback()
  });
}


var local_functions = {
  "Hashtag": {
    validate: (data) => { return true; },
    plain: dict_plain,
    load: (d) => d,
    store: dict_store,
    empty_cbk: nothing,
    save_cbk: nothing,
    module_file: 'hashtag.js'
  },
  "ChatLog": {
    validate: (data) => { return true; },
    plain: rule_plain,
    load: (d) => d,
    store: rule_store,
    empty_cbk: nothing,
    save_cbk: nothing,
    module_file: 'chatlog.js'
  },
  "EventAction": {
    validate: valid_evtact,
    plain: rule_plain,
    load: (d) => d,
    store: rule_store,
    empty_cbk: close_switch("switch_EventAction"),
    save_cbk: start_switch("switch_EventAction"),
    module_file: 'eventaction.js'
  },
};
