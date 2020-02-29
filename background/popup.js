
/* backend for popup.html below */
/* require global.js utility.js */

function cond_assign(obj, attr, val){
    obj[attr] = obj[attr] === undefined ? val : obj[attr];
}

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

            cond_assign(attrs, 'id', `${hname.replace(/ /g, '-')}-${String(idx)}`);
            cond_assign(attrs, 'class', '');
            attrs['class'] += ` ${class_map[type]}`;

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
                //alert(JSON.stringify(config));
                //console.log(this.content);
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
        chrome.storage.sync.set({
            [this.id]: state
        });
        if(callback) callback(state, event);
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

function assoc(key, res, name){
    if(!res[sid(name)]) return false;
    var set = settings[name].load(res[sid(name)]);
    if(set.length && Array.isArray(set[0])){
        console.log('this... is rule: ', JSON.stringify(set));
        for(r of set){
            var [exp, terms] = r;
            console.log('matching...', exp)
            if(key.match(new RegExp(exp)))
                return terms;
        }
        return false;
    }
    else{
        console.log('this... is list: ', JSON.stringify(set));
        for(exp of set){
            console.log('matching...', exp)
            if(key.match(new RegExp(exp)))
                return true; 
        }
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
                chrome.extension.getURL('setting/index.html')
                + `#menu${Object.keys(settings).indexOf(setting_name)}`,
                {
                    type: "basic",
                    iconUrl: '/icon.png',
                    title: `EMPTY ${setting_name.toUpperCase()} RULE`,
                    message: `To enable ${setting_name.toLowerCase()}, make some rules`
                });

            chrome.tabs.create({url: chrome.extension.getURL('setting/index.html')
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
            return;
        }
        else if(callback) callback();
    });
    else if(callback) callback();
}

var BanListH = new Handler("banlist", 
    [
        new pack_ui({}, '', [
            new switch_ui({
                'switchChange.bootstrapSwitch': switch_change((state, event) =>
                    noteEmptySetting(state, event, SWITCH_BLACKLIST, BANLIST))
            }, '', [], {id: SWITCH_BLACKLIST}),
            new button_ui({
                'click': function(event, state){
                    chrome.storage.sync.get((config) => {
                        var list = config[BANLIST] && config[BANLIST] == BLACKLIST ? WHITELIST : BLACKLIST;
                        event.data.$('#banlist_type').text(list);
                        chrome.storage.sync.set({
                            [BANLIST]: list
                        });
                    });
                }
            }, ((config) => config[BANLIST] ? config[BANLIST] : BLACKLIST), [], {id:'banlist_type', style:"width:72px;"})
        ], {title: 'kick all the guests in the list (⚙ setting)'})
    ],
    {
        [event_join]: {
            precond: (config, uis) => config[SWITCH_BLACKLIST],
            onevent: (req, callback, config, uis) => {
                if(assoc(req.user, config, BLACKLIST)){
                    console.log("kick");
                    sendTab({
                        fn: kick_member,
                        args: { user: req.user }
                    })
                }
                /* white list */
                //if(!assoc(req.user, config, WHITELIST)){
                //    sendTab({
                //        fn: kick_member,
                //        args: { user: req.user }
                //    })
                //}
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
            onevent: (req, callback, config, uis, sender) => {
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
            onevent: (req, callback, config, uis, sender) => {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: '/icon.png',
                    title: 'STOP TIMER (LOGOUT)',
                    message: 'Logout, Timer will be disabled'
                });
            }
        },
        [event_exitalarm]: {
            precond: (config, uis) => config[SWITCH_TIMER],
            onevent: (req, callback, config, uis, sender) => { 
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
            onevent: (req, callback, config, uis) => {
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
            onevent: (req, callback, config, uis) => {
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
            onevent: (req, callback, config, uis) => {
                if(!assoc(req.user, config, BLACKLIST)){
                    ((wmsg) => {
                        if(wmsg){
                            if(Array.isArray(wmsg))
                                wmsg = wmsg[Math.floor(Math.random() * wmsg.length)]
                            sendTab({
                                fn: publish_message,
                                args: {
                                    msg: wmsg.replace(/(^|[^\$])\$user/g, `$1${req.user}`)
                                    .replace(/(^|[^\$])\$/g, `$1$`)
                                }
                            });
                        }
                    })(assoc(req.user, config, WELCOME));
                }
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
    {
        [event_join]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_join, config, req)
        },
        [event_leave]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_leave, config, req) 
        },
        [event_newhost]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_newhost, config, req) 
        },
        [event_me]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_me, config, req) 
        },
        [event_msg]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_msg, config, req) 
        },
        [event_dm]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_dm, config, req)
        },
        [event_dmto]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_dmto, config, req)
        },
        [event_submit]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_submit, config, req)
        },
        [event_music]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_music, config, req)
        },
        [event_musicend]: {
            precond: (config, uis) => config[SWITCH_EVENTACT] && config[sid(EVENTACT)],
            onevent: (req, callback, config, uis, sender) => event_action(event_musicend, config, req)
        }
    }
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
            precond: (config, uis) => true,
            onevent: (req, callback, config, uis) => {
                console.log("save the dm username");
                chrome.storage.sync.set({
                    [DM_USERNAME]: req.user
                }); 
            }
        },

        [event_submit]: {
            precond: (config, uis) => config[SWITCH_DM],
            onevent: (req, callback, config, uis) => {
                console.log("here you are");
                if(config[DM_USERNAME]){
                    console.log("there");

                    sendTab({
                        fn: on_dm_member,
                        args: { user: config[DM_USERNAME] }
                    })
                }
            }
        } 
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
            onevent: (req, callback, config, uis) => {
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

var switches = [AutoDMH, TimerH, BanListH, WelcomeH, BanAbuseH, AlwaysMeH, EventActionH, RoomKeeperH];

function unit_layout(units){
    return units.shift();
}

function pair_layout(units){
    return `<div class='two-side-container'>
                <div class="align-left">${units.shift()}</div>
                <div class="align-right">${units.shift()}</div>
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
chrome.runtime.onMessage.addListener((req, sender, callback) => { 
    if(sender.url === popupURL){
        console.log(req);
        if(callback) callback();
    }
});
