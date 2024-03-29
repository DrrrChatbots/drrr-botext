
/* require global.js utility.js */

new Handler("music", [],
  {
    sync: {
      [event_musicend]: { /* handle config[MUSIC_MODE] be undefined slightly */
        precond: (config, uis) =>
          config[MUSIC_MODE] !== SINGLE_MODE
          && !empty_list(config, PLAYLIST),
        onevent: (req, config, uis, sender) => {
          function wake_check(){
            sendTab({
              fn: is_playing,
            }, undefined, ([active, after]) => {
              if(!active){
                if(after === undefined || after > getDelay(config) - 5)
                  play_next(config)
                else sendTab({
                  fn: set_timeout,
                  args: {
                    event: event_timeout,
                    duration: (getDelay(config) - after + 5) * 1000
                  }
                });
              }
            });
          }
          console.log("wait for delay", getDelay(config), 's');
          wake_check();
        }
      },
      [event_timeout]: {
        precond: (config, uis) =>
          config[MUSIC_MODE] !== SINGLE_MODE
          && !empty_list(config, PLAYLIST),
        onevent: (req, config, uis, sender) => {
          function wake_check(){
            sendTab({
              fn: is_playing,
            }, undefined, ([active, after]) => {
              if(!active){
                if(after === undefined || after > getDelay(config) - 5)
                  play_next(config)
                else sendTab({
                  fn: set_timeout,
                  args: {
                    event: event_timeout,
                    duration: (getDelay(config) - after + 5) * 1000
                  }
                });
              }
            });
          }
          console.log("re-wait for delay", getDelay(config), 's');
          wake_check();
        }
      }
    }
  }
);

function generate_notification(req){
  var func = () =>
    chrome.notifications.create(
      req.notification.url || req.notification.sel || undefined, {
        type: "basic",
        iconUrl: '/icon.png',
        title: req.notification.title,
        message: req.notification.msg
      }
    );

  if(req.notification.clear){
    chrome.notifications.getAll((notes)=>{
      for(n in notes)
        if(n.match(new RegExp(req.notification.pattern)))
          chrome.notifications.clear(n);
      func();
    })
  }
  else func();

  if(req.notification.url)
    chrome.notifications.onClicked.addListener(
      ((exit, url)=>
        function(toURL) {
          console.log(toURL);
          if(toURL !== url) return;
          if(exit){
            sendTab({ fn: leave_room, args: {jump: toURL} });
          }
          else if(toURL.includes('drrr_webpage')){
            chrome.tabs.create({
              active: false,
              pinned: false, // ture is interesting
              url: 'https://drrr.com/'
            });
          }
          else chrome.tabs.update({
            url: toURL
          });
          chrome.notifications.getAll((notes)=>{
            for(n in notes)
              if(n.startsWith('https://drrr.com/room/?id='))
                chrome.notifications.clear(n);
          });
        }
      )(req.notification.exit, req.notification.url));
  else if(req.notification.sel)
    chrome.notifications.onClicked.addListener(
      ((sel)=>
        function(toSel) {
          console.log(toSel);
          if(toSel !== sel) return;
          sendTab({ fn: scroll_to, args: {sel: sel}}, undefined, undefined, undefined, 'https://drrr.com/lounge/*');
        }
      )(req.notification.sel));
}

var error403 = 0;
chrome.runtime.onMessage.addListener((req, sender, callback) => {

  if(req && req.closeTab){
    chrome.tabs.remove(sender.tab.id, function() { });
  }
  else if(req && req.uninstallSelf){
    chrome.management.uninstallSelf().then(
          null, (error) => console.log(`Canceled: ${error}`));
  }

  if(isLockedUser){ return callback && callback(); }

  if(req && req.jumpto){
    if(sender.tab && sender.tab.id)
      chrome.tabs.update(sender.tab.id, { url: req.jumpto });
    else chrome.tabs.update({ url: req.jumpto });
  }
  else if(req && req.clearNotes){
    chrome.notifications.getAll((notes)=>{
      for(n in notes)
        if(n.match(new RegExp(req.pattern)))
          chrome.notifications.clear(n);
    })
  }
  else if(req && req.newTab){
    chrome.tabs.create({
      url: req.newTab
    });
  }
  else if(req && req.saveCookie){
    chrome.cookies.getAll({
      url : 'https://drrr.com'
    }, function(cookies){
      cookies = cookies.filter(c => c.name === "drrr-session-1")
      chrome.storage.sync.set({
        'profile': req.profile,
        'cookie':cookies
      }, ()=> callback && callback());
    });
    return; // callback finished
  }
  else if(req && req.setCookies){
    setCookies(req.cookies, callback);
    return; // callback finished
  }
  else if(req && req.notification){
    generate_notification(req);
  }
  else if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){
    if(req && req.info) drrr.setInfo(req.info);

    if(req.start){
      drrr.getProfile();
      drrr.getLoc();
      drrr.getLounge();
      return;
    }

    let get = drrr.profile ? f => f() : drrr.getProfile;

    get(()=>{

      // for some switch in sync storage
      chrome.storage.sync.get((sconfig) => {
        var reg_funcs = reg_table.sync[req.type] || [];
        for(let handle of reg_funcs){
          handle(req, sconfig, sender, sconfig)
        }

        // for some switch in local storage
        chrome.storage.local.get((lconfig) => {
          var reg_funcs = reg_table.local[req.type] || [];
          for(let handle of reg_funcs){
            handle(req, lconfig, sender, sconfig)
          }

          if(lconfig['select_module'])
            import(`/module/${module_mapping[lconfig['select_module']]}`).then(
              (module)=>{
                module.event_action &&
                  module.event_action(req, lconfig, sender, event_action);
              }
            )
          Object.keys(local_functions).forEach((x)=>{
            if(lconfig['switch_' + x]){
              import(`/setting/plugin/${local_functions[x].module_file}`).then(
                (module)=>{
                  module.event_action &&
                    module.event_action(req, lconfig, sender, event_action);
                }
              );
            }
          });
        });
      });
    })
  }
  else if(sender.url.match(new RegExp('https://drrr.com/lounge'))){
    if(req && req.start){
      drrr.getProfile();
      drrr.getLoc();
      drrr.getLounge();
    }
    getProfile(profile => {
      req.type = event_lounge;
      req.host = false;
      req.user = profile.name;
      req.trip = profile.tripcode;
      req.text = '';
      req.url = '';
      chrome.storage.sync.get((sconfig) => {
        var reg_funcs = reg_table.sync[req.type] || [];
        for(handle of reg_funcs)
          handle(req, sconfig, sender, sconfig)

        chrome.storage.local.get((lconfig) => {
          var reg_funcs = reg_table.local[req.type] || [];
          for(handle of reg_funcs)
            handle(req, lconfig, sender, sconfig)
        });
      });
    })
  }
  else if(sender.url.match(new RegExp('https://chat.openai.com/chat'))){
    sendTabMessage(req.text);
  }

  if(callback){
    //alert(JSON.stringify(req));
    //console.log(JSON.stringify(req))
    callback();
  }
})

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    //if(confirm("Do you want to have some default settings? (要加入預設設定嗎？)"))
    // think twice
    if(0) chrome.storage.sync.set({
      "EventAction-setting": [
        [ "msg", "", "^/play\\s+(\\D|\\d\\S)", "plym", [ "$args" ] ],
        [ "msg", "", "^/gif", "umsg", [ "$giphy($1)", "$1" ]]]
    });
  }
  else if(details.reason == "update"){
    var thisVersion = chrome.runtime.getManifest().version;
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});
