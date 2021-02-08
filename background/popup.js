/* backend for popup.html below */
/* require global.js utility.js */

mulval_attr = ["class", "style"]

function ui_object(type, template, def_attrs = {}){
  return function(events = {}, content, childs = [], attrs = {}){
    this.bind = (hname, idx) => {

      for(k in def_attrs){
        if(attrs[k] === undefined)
          attrs[k] = def_attrs[k]
        else if(mulval_attr.includes(k))
          attrs[k] +=  ` ${def_attrs[k]}`;
      }

      attrs.id = attrs.id || `${hname.replace(/ /g, '-')}-${String(idx)}`;
      attrs.class = (attrs.class || '') + ` ${class_map[type]}`;

      this.childs = childs;
      this.content = (config) => {
        var type = typeof content;
        if(type === 'undefined')
          return hname;
        else if(type === 'string')
          return content;
        else if(type === 'function')
          return content(config);
        else throw "Invalid type of UI content";
      }

      for(name in childs) childs[name].bind(`${attrs.id}`, name);

      this.html = function(config){
        return template(
          Object.keys(attrs).map(
            (k) => `${k}="${attrs[k]}"`).join(' '),
          this.content(config),
          childs, config
        );
      }

      this.events = events === undefined ? {} : events;
      this.bindEvents = function($, uis){
        for(name in this.events){
          $(((ename, events)=>function(){
            $(`#${attrs.id}`).on(ename, null, {
              $: $,
              uis: uis
            }, events[ename])
          })(name, this.events)); // note the side effect, use iffi
        }
        Object.values(childs).forEach(
          (child) => child.bindEvents($, uis));
      }
      return this;
    }
  }
}

function merge_ui(uis, config){
  return Object.values(uis).map((c)=>c.html(config)).join('');
}

var label_ui = ui_object(LABEL,
  (attrs, content, uis, config) => `<label ${attrs}">${content}${merge_ui(uis, config)}</label>`,
  {
    "class": "ui-unit"
  });

var switch_change = (callback) =>
  function(event, state){
    chrome.storage.sync.set(
      { [this.id]: state },
      () => callback && callback(state, event)
    );
  }

var switch_ui = ui_object(SWITCH,
  (attrs, content, uis, config) => `<input ${attrs}>`,
  {
    type: "checkbox",
    "class": "ui-unit",
    "data-size": "mini",
    "data-on-color": "success",
    "data-off-color": "default"
  });

var select_ui = ui_object(SELECT,
  (attrs, content, uis, config) => `<select ${attrs}>
                                 <!-- <option selected="selected"
                                     value="${content}">
                                     ${content}${merge_ui(uis, config)}
                                 </option> -->
                              </select>`,
  {
    'class': "ui-unit ${klass} form-control",
    style: `width: 90px;
              padding-left: 0px;
              padding-right: 0px;
              padding-bottom: 0px;
              padding-top: 0px;
              height: 22px;
              float: none;`
  });

var button_ui = ui_object(BUTTON,
  (attrs, content, uis, config) => `<button ${attrs}>${content}${merge_ui(uis, config)}</button>`,
  {
    type:"button",
    'class':"ui-unit btn btn-success btn-xs"
  });

var pack_ui = ui_object(PACK,
  (attrs, content, uis, config) => `<div ${attrs}>${content}${merge_ui(uis, config)}</div>`,
  {
    'class': "ui-pack input-group col-xs-10 form-inline",
    style: "width:225px;"

  });

var modal_ui = ui_object(MODAL,
  (attrs, content, uis, config) => `<div ${attrs}>
                          <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                              <div class="modal-header">
                                <button type="button" class="close"
                                        data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">${content}</h4>
                              </div>
                              <div class="modal-body">
                                ${uis.body.html(config)}
                                <p>Some text in the modal.</p>
                              </div>
                              <div class="modal-footer">
                                ${uis.footer.html(config)}
                              </div>
                            </div>

                          </div>
                        </div>`,
  {
    'class': "ui-unit modal fade",
    role: "dialog"
  });

var textarea_ui = ui_object(TEXTAREA,
  (attrs, content, uis, config) => `<textarea ${attrs}>${content}</textarea>`,
  {
    'class': "form-control",
    //style: "width:225px;"
  });

function assoc(key, res, comp_name){
  if(!res[sid(comp_name)]) return false;
  var set = settings[comp_name].load(res[sid(comp_name)]);
  if(set.length && Array.isArray(set[0])){
    console.log('this... is rule: ', JSON.stringify(set));
    for(r of set){
      var [exp, terms] = r;
      console.log('matching...', exp)
      if(key.match(new RegExp(exp, 'i'))){
        console.log(exp, ' matched!')
        return terms;
      }
    }
    console.log(key, 'not matched!')
    return false;
  }
  else{
    console.log('this... is list: ', JSON.stringify(set));
    for(exp of set){
      console.log('matching...', exp)
      if(key.match(new RegExp(exp, 'i'))){
        console.log(exp, ' matched!')
        return true;
      }
    }
    console.log(key, 'not matched!')
    return false;
  }
}

function assocTrip(key, res, comp_name, trip){
  if(!res[sid(comp_name)]) return false;
  var set = settings[comp_name].load(res[sid(comp_name)]);
  if(set.length && Array.isArray(set[0])){
    console.log('this... is rule: ', JSON.stringify(set));
    for(r of set){
      var [name_trip, terms] = r;
      if(match_user(key, trip, name_trip)){
        console.log(key, ' matched!')
        return terms;
      }
    }
    console.log(key, 'not matched!')
    return false;
  }
  else{
    console.log('this... is list: ', JSON.stringify(set));
    for(name_trip of set){
      if(match_user(key, trip, name_trip)){
        console.log(key, ' matched!')
        return true;
      }
    }
    console.log(key, 'not matched!')
    return false;
  }
}

function noteEmptySetting(state, event, switch_id, func_name, callback){
  if(state) chrome.storage.sync.get((config) => {
    var the_sid = sid(func_name, config);
    if(!config[the_sid]){
      var setting_name = unsid(the_sid);
      event.data.$(`#${switch_id}`).bootstrapSwitch('state', false, true);
      chrome.notifications.create(
        chrome.extension.getURL('setting/sync/index.html')
        + `#menu${Object.keys(settings).indexOf(setting_name)}`,
        {
          type: "basic",
          iconUrl: '/icon.png',
          title: `EMPTY ${setting_name.toUpperCase()} RULE`,
          message: `To enable ${setting_name.toLowerCase()}, make some rules`
        });

      chrome.tabs.create({url: chrome.extension.getURL('setting/sync/index.html')
        + `#menu${Object.keys(settings).indexOf(setting_name)}`});

      chrome.notifications.onClicked.addListener(function(notificationId) {
        console.log(notificationId);
        if(notificationId.match(new RegExp('chrome-extension://')))
          chrome.tabs.create({url: notificationId});
        chrome.notifications.clear(notificationId);
      });
      chrome.storage.sync.set({
        [switch_id]: false
      });
    }
    else if(callback) callback();
  });
  else if(callback) callback();
}

function noteEmptyPrompt(state, event, switch_id, func_name, question, validate, callback){
  if(state) chrome.storage.sync.get((config) => {
    if(!config[func_name]){
      var answer = '';
      while(answer !== null && !answer){
        answer = prompt(question);
      }
      if(!validate){
        alert("Please Give The Validator");
        chrome.storage.sync.set({
          [switch_id]: false
        });
      }
      else{
        validate(answer, (v, code, desc)=>{
          if(v){
            event.data.$(`#${switch_id}`).bootstrapSwitch('state', true, true);
            return chrome.storage.sync.set({
              [func_name]: answer
            }, callback);
          }
          else{
            if(answer === null);
            else if(code == 88) alert(desc);
            else alert(`Invalid Value ${code}: ${desc}`);
            chrome.storage.sync.set({
              [switch_id]: false
            });
          }
        })
      }
    }
    else if(callback) callback();
  });
  else if(callback) callback();
  event.data.$(`#${switch_id}`).bootstrapSwitch('state', false, true);
}

var BanListH = new Handler("banlist",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state, event) =>
          noteEmptySetting(state, event, SWITCH_BANLIST, BANLIST))
      }, '', [], {id: SWITCH_BANLIST}),
      new button_ui({
        'click': function(event, state){
          chrome.storage.sync.get((config) => {
            var types = [BLACKLIST, WHITELIST];
            var list = config[BANLIST] || BLACKLIST;
            list = types[Math.abs(types.indexOf(list) - 1)];
            event.data.$('#banlist_type').text(list);
            chrome.storage.sync.set({
              [BANLIST]: list
            });
            if(config[SWITCH_BANLIST])
              noteEmptySetting(config[BANLIST], event, SWITCH_BANLIST, BANLIST);
          });
        }
      }, ((config) => config[BANLIST] || BLACKLIST), [], {id:'banlist_type', style:"width:72px;"}),
      new button_ui({
        'click': function(event, state){
          chrome.storage.sync.get((config) => {
            var types = [action_kick, action_ban, action_banrpt];
            var bt = config[BANTYPE] || action_kick;
            bt = types[(types.indexOf(bt) + 1) % 3];
            event.data.$('#ban_type').text(bt);
            chrome.storage.sync.set({
              [BANTYPE]: bt
            });
          });
        }
      }, ((config) => config[BANTYPE] || action_kick), [], {id:'ban_type', style:"width:50px;"}),
    ], {title: 'kick all the guests in the list (⚙ setting)'})
  ],
  {
    [event_join]: {
      precond: (config, uis) => config[SWITCH_BANLIST],
      onevent: (req, config, uis) => {
        var banm = {
          [action_kick]: kick_member,
          [action_ban]: ban_member,
          [action_banrpt]: ban_report_member
        }
        var ban_way = banm[config[BANTYPE] || action_kick];

        trip = undefined;
        for(e of req.info.room.users){
          if(e.name == req.user && 'tripcode' in e){
            trip = e.tripcode;
            break;
          }
        }
        if(config[BANLIST] === BLACKLIST){
          if(assocTrip(req.user, config, BLACKLIST, trip)){
            console.log("kick");
            sendTab({
              fn: ban_way,
              args: { user: req.user }
            })
          }
        }
        else if(config[BANLIST] === WHITELIST){
          if(!assocTrip(req.user, config, WHITELIST, trip)){
            sendTab({
              fn: ban_way,
              args: { user: req.user }
            })
          }
        }
      }
    }
  }
);


var TimerH = new Handler("timer",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state, event)=>{
          noteEmptySetting(state, event, SWITCH_TIMER, TIMER, () =>
            roomTabs((tabs)=>{
              if(tabs.length){
                if(state){
                  chrome.tabs.sendMessage(tabs[0].id, {
                    fn: bind_alarms
                  })
                  chrome.notifications.create({
                    type: "basic",
                    iconUrl: '/icon.png',
                    title: 'START TIMER',
                    message: 'Switch on, Timer will be started'
                  });
                }
                else{
                  bcastTabs({ fn: clear_alarms });
                  chrome.notifications.create({
                    type: "basic",
                    iconUrl: '/icon.png',
                    title: 'STOP TIMER',
                    message: 'Switch off, Timer will be disabled'
                  });
                }
              }
            })
          )
        })
      }, '', [], {id: SWITCH_TIMER}),
      new label_ui({}, 'Timer')
    ], {title: 'send some custom messages periodically (⚙ setting)'})
  ],
  {
    [event_newtab]: {
      precond: (config, uis) => config[SWITCH_TIMER],
      onevent: (req, config, uis, sender) => {
        //check the chrome.alarm.api
        roomTabs((tabs)=>{
          if(tabs.length == 1){
            chrome.tabs.sendMessage(tabs[0].id, {
              fn: bind_alarms
            })
            chrome.notifications.create({
              type: "basic",
              iconUrl: '/icon.png',
              title: 'START TIMER',
              message: 'Timer will be started on this tab'
            });
          }
        })
      }
    },
    [event_logout]: {
      precond: (config, uis) => config[SWITCH_TIMER],
      onevent: (req, config, uis, sender) => {
        chrome.notifications.create({
          type: "basic",
          iconUrl: '/icon.png',
          title: 'STOP TIMER (LOGOUT)',
          message: 'Logout, Timer will be disabled'
        });
      }
    },
    [event_timer]: {
      precond: (config, uis) => true,
      onevent: (req, config, uis, sender) => {
        argfmt(req.arglist, req.user, req.text, req.url, (args)=>{
          return actions[req.action].apply(config, args.map(timefmt));
        });
      }
    },
    [event_exitalarm]: {
      precond: (config, uis) => config[SWITCH_TIMER],
      onevent: (req, config, uis, sender) => {
        roomTabs((tabs)=>{
          if(tabs.length < 2){
            chrome.notifications.create({
              type: "basic",
              iconUrl: '/icon.png',
              title: 'WILL STOP TIMER (IF LAST TAB CLOSED)',
              message: 'If you close last tab, timer will be disabled'
            });
          }
          else{
            chrome.notifications.create({
              type: "basic",
              iconUrl: '/icon.png',
              title: 'TRANSFER TIMER',
              message: 'Active tab closed, Timer will be restart on other tab'
            });
            for(tab of tabs){
              if(tab.id !== sender.tab.id){
                chrome.tabs.sendMessage(tab.id, {
                  fn: bind_alarms
                })
                break;
              }
            }
          }
        })
      }
    },
  }
);

var BanAbuseH = new Handler("BanAbuse",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state, event) =>
          noteEmptySetting(state, event, SWITCH_BANABUSE, BANABUSE))
      }, '', [], {id: SWITCH_BANABUSE}),
      new label_ui({}, 'BanAbuse')
    ], {title: 'kick member who send some abuse terms in the list (⚙ setting)'})
  ],
  {
    [event_msg]: {
      precond: (config, uis) => config[SWITCH_BANABUSE],
      onevent: (req, config, uis) => {
        if(assoc(req.text, config, BANABUSE)){
          console.log("abuse kick");
          sendTab({
            fn: kick_member,
            args: { user: req.user }
          })
        }
      }
    },

    [event_me]: {
      precond: (config, uis) => config[SWITCH_BANABUSE],
      onevent: (req, config, uis) => {
        if(assoc(req.text, config, BANABUSE)){
          console.log("abuse kick");
          sendTab({
            fn: kick_member,
            args: { user: req.user }
          })
        }
      }
    },

    [event_dm]: {
      precond: (config, uis) => config[SWITCH_BANABUSE],
      onevent: (req, config, uis) => {
        if(assoc(req.text, config, BANABUSE)){
          console.log("abuse kick");
          sendTab({
            fn: kick_member,
            args: { user: req.user }
          })
        }
      }
    }
  }
);

var WelcomeH = new Handler("welcome",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state, event) =>
          noteEmptySetting(state, event, SWITCH_WELCOME, WELCOME))

      }, '', [], {id: SWITCH_WELCOME}),
      new label_ui({}, 'Welcome')
    ], {title: 'send some custom messages to welcome someone (⚙ setting)'})
  ],
  {
    [event_join]: {
      precond: (config, uis) => config[SWITCH_WELCOME],
      onevent: (req, config, uis) => {
        // avoid welcome banlist user
        trip = undefined;
        for(e of req.info.room.users){
          if(e.name == req.user && 'tripcode' in e){
            trip = e.tripcode;
            break;
          }
        }
        if(config[SWITCH_BANLIST]){
          if(config[BANLIST] === BLACKLIST){
            if(assocTrip(req.user, config, BLACKLIST, trip)){
              return;
            }
          }
          else if(config[BANLIST] === WHITELIST){
            if(!assocTrip(req.user, config, WHITELIST, trip)){
              return;
            }
          }
        }
        // welcome user
        ((wmsg) => {
          if(wmsg){
            if(Array.isArray(wmsg))
              wmsg = wmsg[Math.floor(Math.random() * wmsg.length)]
            sendTab({
              fn: publish_message,
              args: {
                msg: wmsg
                .replace(/(^|[^\$])\$user/g, `$1${req.user}`)
                .replace(/(^|[^\$])\$/g, `$1$`)
              }
            });
          }
        })(assocTrip(req.user, config, WELCOME, trip));
        //})(assoc(req.user, config, WELCOME));
      }
    }
  }
);

var EventActionH = new Handler("event action",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state, event) =>
          noteEmptySetting(state, event, SWITCH_EVENTACT, EVENTACT))

      }, '', [], {id: SWITCH_EVENTACT}),
      new label_ui({}, 'EventAction')
    ], {title: 'custom your actions on specific events (⚙ setting)'})
  ],
  event_events.reduce(function(obj, x){
    obj[x] = {
      precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
      onevent: (req, config, uis, sender) => event_action(x, config, req)
    };
    return obj;
  }, {})
);

function log2note(type, e){
  //type, user, text, url
  if(type === event_msg)
    return [`[PUBLIC]`, `${e.user}: ${e.text}${URL_TYPE(e.url)}`]
  if(type === event_me)
    return [`[MOTION]`, `${e.user}: /me ${e.text}${URL_TYPE(e.url)}`]
  if(type === event_dm)
    return [`[DIRECT]`, `${e.user}... ${e.text}${URL_TYPE(e.url)}`]
  if(type === event_join)
    return [`[ JOIN ]`, `${e.user} join the room`]
  if(type === event_leave)
    return [`[ WENT ]`, `${e.user} leave the room`]
  if(type === event_newhost)
    return [`[ HOST ]`, `${e.user} become the room owner`]
}

function isImageURL(url) {
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function URL_TYPE(url){
  return url ? (isImageURL(url) ? ' [IMAGE]' : ' [URL]') : '';
}

function sendNoti(config, type, e){
  [title, content] = log2note(type, e);
  chrome.notifications.create(
    e.url ? `URL${e.url}` : undefined,
    {
      type: "basic",
      iconUrl: '/icon.png',
      title: `ROOM ${title}`,
      message: content
    });
  if(e.url){
    chrome.notifications.onClicked.addListener(function(notificationId) {
      if(notificationId.startsWith('URL')){
        chrome.tabs.create({url: notificationId.substring(3)});
        chrome.notifications.clear(notificationId);
      }
    });
  }
}

function NotiEvents(){
  var ts = [event_msg, event_me, event_dm, event_join, event_leave, event_newhost];
  var es = {}
  ts.forEach((t)=>{
    es[t] = {
      precond: (config, uis) => config[SWITCH_NOTIF],
      onevent: (et => (req, config, uis) => {
        chrome.tabs.query({active:true, url: 'https://drrr.com/room/*'}, (tabs) => {
          if(!tabs.length)
            return sendNoti(config, et, req);
        });
      })(t)
    }
  })
  return es;
}

var NotifH = new Handler("notfi",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change()
      }, '', [], {id: SWITCH_NOTIF}),
      new label_ui({}, 'RoomNotification')
    ], {title: 'custom your actions on specific events (⚙ setting)'})
  ], NotiEvents()

);


var AlwaysMeH = new Handler("always me",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change(
          (state) => {
            chrome.tabs.query({
              url: 'https://drrr.com/room/*'
            }, (tabs) => {
              console.log("switch function handling");
              for(tab of tabs){
                chrome.tabs.sendMessage(tab.id, {
                  fn: switch_me,
                  args: { state: state }
                });
              }
            });
          }),
      }, '', [], {id: SWITCH_ME}),
      new label_ui({}, 'Always/me')
    ], {title: 'add /me automatically after sending message'})
  ],
  {

  }
);

var AutoDMH = new Handler("AutoDM",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state) =>
          {
            if(state){
              chrome.storage.sync.get((config) => {
                if(config[DM_USERNAME]){
                  bcastTabs({
                    fn: on_dm_member,
                    args: { user: config[DM_USERNAME] }
                  });
                }
              })
            } else bcastTabs({ fn: off_dm_member });
          }
        )
      }, '', [], {id: SWITCH_DM}),
      new label_ui({}, 'AutoDM', [], {id: DM_USERNAME}),
    ], {title: 'change to direct message automatically after sending message'})
  ],
  {
    [event_dmto]: {
      precond: (config, uis) => config[SWITCH_DM],
      onevent: (req, config, uis) => {
        console.log("save the dm username");
        chrome.storage.sync.set({
          [DM_USERNAME]: req.user
        });
        if(config[DM_USERNAME]){
          console.log("there");

          sendTab({
            fn: on_dm_member,
            args: { user: config[DM_USERNAME] }
          })
        }
      }
    },
  }
);

var RoomKeeperH = new Handler("RoomKeeper",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state, event) =>
          {
            sendTab({
              fn: keep_room,
              args: { state: state  }
            });
          })
      }, '', [], {id: SWITCH_KEEPER}),
      new label_ui({}, 'RoomKeeper')
    ], {title: 'keep the room automatically'})
  ],
  {
    [event_newtab]: {
      precond: (config, uis) => config[SWITCH_KEEPER],
      onevent: (req, config, uis) => {
        roomTabs((tabs)=>{
          if(tabs.length == 1){
            sendTab({
              fn: keep_room,
              args: { state: true  }
            });
          }
        })
      }
    }
  }
);

function validateTgToken(token, callback){
  $.ajax({
    type: "GET",
    url: `https://api.telegram.org/bot${token}/getUpdates`,
    dataType: 'json',
    success: function(data){
      if(data.ok){
        function df(v){ return v ? v : ''; }
        function descOf(type, chat){
          var fj = (...a)=>a.filter(x=>x).join(' ');
          var uname = (chat.username && `@${chat.username}`) || '';
          var name = fj((chat.first_name || ''), ((chat.last_name && ` ${chat.last_name}` || '')));
          var title = chat.title || '';
          var desc = chat.description || '';
          var link = chat.invite_link || '';
          return ({
            'private': `${fj(uname, name)}`,
            'group': `${fj(title, desc, link)}`,
            'supergroup': `${fj(uname, title, desc, link)}`,
            'channel': `${fj(uname, title, desc, link)}`
          })[type]
        }

        var options = {};
        data.result.forEach(o=>{
          try{
            v = options[o.message.chat.id]
            if(!v) options[o.message.chat.id] = o.message.chat;
          }
          catch(e){ console.log('error on validate Tg token:', e); }
        });
        var ids = Object.keys(options);
        if(ids.length){
          var display = ids.map(key=>{
            var chat = options[key];
            return `ChatID ${chat.id}: [${chat.type}] ${descOf(chat.type, chat)}`
          }).join('\n');

          var id = '';
          while(!id){
            id = prompt(`Select a ChatID below and Input:\n\n${display}`, ids[0]);
            if(id === null) return callback(false, 88, 'Cancel the Setting Process');
          }
          if(options[id]){
            chrome.storage.sync.set({
              [TGBOTCHATID]: id
            }, ()=>callback(data.ok, 200, 'done'));
          }
          else callback(false, 500, `Invalid ChatID "${id}", Must be "${ids.join('" or "')}""`)
        }
        else callback(false, 404, 'No Available Update Get, send Meesage to your bot first')
      }
      else{
        callback(data.ok, data.error_code, data.description)
      }
    },
    error: function(err){
      data = err.responseJSON;
      callback && callback(data.ok, data.error_code, data.description)
    }
  });
}

function log2mkd(type, e){
  //type, user, text, url
  console.log('log data', e);
  if(type === event_msg)
    return `*${e.user}*: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === event_me)
    return `_${e.user}_: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === event_dm)
    return `${e.user}: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === event_join)
    return `${e.user} join the room`
  if(type === event_leave)
    return `${e.user} leave the room`
  if(type === event_newhost)
    return `${e.user} become the room owner`
}

function sendTg(config, type, e){
  let data = {
    chat_id: config[TGBOTCHATID],
    text: log2mkd(type, e),
    parse_mode: "Markdown",
    disable_web_page_preview: false,
  }

  $.ajax({
    type: "POST",
    url: `https://api.telegram.org/bot${config[TGBOTTOKEN]}/sendMessage`,
    dataType: 'json',
    data: data,
    success: function(data){
      console.log('logged:', data);
    },
    error: function(data){
      console.log('failed:', data);
    }
  });

}

function TgEvents(){
  var ts = [event_msg, event_me, event_dm, event_join, event_leave, event_newhost];
  var es = {}
  ts.forEach((t)=>{
    es[t] = {
      precond: (config, uis) => config[SWITCH_TGBOT] && config[TGBOTTOKEN] && config[TGBOTCHATID],
      onevent: (et => (req, config, uis) => { sendTg(config, et, req); })(t)
    }
  })
  return es;
}

var TgBotH = new Handler("TgBot",
  [
    new pack_ui({}, '', [
      new switch_ui({
        'switchChange.bootstrapSwitch': switch_change((state, event) =>
          noteEmptyPrompt(state, event, SWITCH_TGBOT, TGBOTTOKEN, 'please input the telegram bot ID:', validateTgToken))
      }, '', [], {id: SWITCH_TGBOT}),
      new button_ui({
        'click': function(event, state){
          chrome.storage.sync.get([TGBOTTOKEN], (config)=>{
            if(config[TGBOTTOKEN] && confirm('clear exist bot settings?')){
              event.data.$(`#${SWITCH_TGBOT}`).bootstrapSwitch('state', false, true);
              chrome.storage.sync.remove([TGBOTTOKEN, TGBOTCHATID]);
            }
          });
        }
      }, 'TgBotLogger', [], {id:'tgbot-setting', title:"clear exist bot setting"})
    ], {title: 'store the log by telegram bot'})
  ], TgEvents()
);

var switches = [AutoDMH, TimerH, BanListH, WelcomeH, BanAbuseH, AlwaysMeH, EventActionH, RoomKeeperH, TgBotH, NotifH];

function unit_layout(units){
  return `<div class='one-side-container'>
                <div class="align-left">${units.shift()}</div>
            </div>`;
}

function pair_layout(units){
  return `<div class='two-side-container'>
                ${units.length ? `<div class="align-left">${units.shift()}</div>`: ''}
                ${units.length ? `<div class="align-right">${units.shift()}</div>`: ''}
            </div>`;
}

function init_switches($, defaults, config){
  var state = {};
  Object.assign(state, JSON.parse(JSON.stringify(
    !Object.keys(config).length ? defaults : config)));
  $(`.${class_map[SWITCH]}`).each(function(){
    $(this).bootstrapSwitch('state', state[this.id], true);
  })
}

function template_setting($){
  var template = {}
  $(`.${class_map[SWITCH]}`).each(function(){
    template[this.id] = $(this).prop('checked');
  });
  return template;
}

switches_layout = [
  pair_layout,
  pair_layout,
  pair_layout,
  pair_layout,
  pair_layout,
]

function make_switch_panel($, panel_id){
  chrome.storage.sync.get((config) => {
    switches.ui = switches.map((h) => h.ui(config));
    $(panel_id).append(
      switches_layout.map((set) =>
        set(switches.ui)).join(''));
    $(`.${class_map[SWITCH]}`).bootstrapSwitch('size', 'mini');
    defaults = template_setting($);
    init_switches($, defaults, config);
    switches.map((h)=>h.bindEvents($));
  });
}

var popupURL = chrome.extension.getURL('popup/index.html');
