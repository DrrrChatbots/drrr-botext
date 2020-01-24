
/* background.html below */

setting_cache = {};

istype = {
    number: (v) => typeof v === 'number',
    string: (v) => typeof v === 'string',
    strary: (v) => Array.isArray(v) && v.every(istype.string),
    regex: (v) => {
        try{
            new RegExp(v);        
        }
        catch(e){
            alert(String(e));
            return false;
        }
        return true;
    }
}

function rule_plain(rules){
    return rules.map((r) =>
        `"${r[0]}", "${r[1]}"`).join('\n');
}

function rule_store(text){
    return JSON.parse(
        "[" + text.split("\n").map(
            (r) => "[" + r + "]").join(",")
        + "]");
}

sid = (v) => `${v}-setting`
var settings = {
    [TIMER]: {
        desc: `<p>Report some messages once in a while</p>
<p>TimeSyntax: "60" means 60 second, "1m6s" means 1 min 6 secs, need add 'T' before time</p>
<p>ReportSyntax: a string to report something, need add 'R' before string</p>
<p>you can use <a href="http://blog.stevenlevithan.com/archives/date-time-format">time mask</a> in the ReportSyntax, but use 'D' as prefix</p>
<p></p>
        `,
        def_conf:
`"600", "every 10 mins report once!"
"300", ["It's a Report Message", "Now is HH:MM!"]
`,
        validate: (data) => {
            try {
                var d = rule_sotre(data);
                var b = d.map((v) => v[0]).every(istype.number)
                    && d.map((v) => v[1]).every(
                        (v) => istype.string(v) || istype.strary(v));
            } catch (e) {
                alert(e);
                return false;
            }
            return b;
        },
        plain: rule_plain,
        load: (d) => d,
        store: rule_store 
    },
    [WELCOME]: {
        desc: `<p>welcome a user with specific messages</p>`,
        def_conf:
`"lambda.*cat", "hello, master"
".*", "hello @user"`,
        validate: (data) => {
            try {
                var d = rule_store(data);
                var b = d.map((v) => v[0]).every(istype.string) 
                    && d.map((v) => v[0]).every(istype.regex) 
                    && d.map((v) => v[1]).every(
                        (v) => istype.string(v) || istype.strary(v))
            } catch (e) {
                alert(e);
                return false;
            }
            return b;
        },
        plain: rule_plain,
        load: (d) => d,
        store: rule_store 
    },
    [WHITELIST]: {
        desc: '<p>use regular expression to create whitelist</p>',
        def_conf:
`.*cat
lambda.*
神秘.*`,
        validate: (d) => d.split("\n").every(istype.regex),
        plain: (d) => d,
        load: (d) => d.split("\n"),
        store: (d) => d.replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [BLACKLIST]: {
        desc: '<p>use regular expression to create blacklist</p>',
        def_conf:
`otoko.*
.*机器人.*|.*機器人.*
小冰|小氷`,
        validate: (d) => d.split("\n").every(istype.regex),
        plain: (d) => d,
        load: (d) => d.split("\n"),
        store: (d) => d.replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [HISTORY]: {
        desc: 'chat history',
        def_conf:
`No History
Enable History Recording on Popup Window
To Record Some Chat History!!`,
        validate: (d) => true,
        plain: (d) => d,
        load: (d) => d,
        store: (d) => d.replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    }
}

function make_pills(ps){
    console.log(ps);
    return `<ul class="nav nav-pills">
                ${Object.keys(ps).map(
                    (idx) => `<li ${(Number(idx) === 0 ? `class="active"` : '')}>
                                <a data-toggle="pill" href="#menu${idx}">
                                    ${ps[idx]}
                                </a>
                              </li>`).join('')} 
            </ul>`;
}

function make_tabs(tabs){
    console.log(tabs);
    var keys = Object.keys(tabs);
    return `<div class="tab-content">
                ${Object.keys(keys).map(
                    (idx) =>
                    `<div id="menu${idx}" 
                      class="tab-pane fade ${Number(idx) === 0 ? `in active` : ''}"> 

                    <h3>${keys[idx]} Setting

                        <small>
                            <span class="btn-group" role="group">
                                <button type="button" class="btn btn-info btn-sm" 
                                    data-toggle="modal" data-target="#${keys[idx]}-modal">
                                         HELP
                                </button>
                                <button type="button" id="reset-${keys[idx]}"
                                class="btn btn-success btn-sm reset-button"
                                data="${keys[idx]}"
                                style="display:none;">
                                         RESET
                                </button>
                                <button type="button" id="save-${keys[idx]}"
                                class="btn btn-danger btn-sm save-button"
                                data="${keys[idx]}"
                                style="display:none;">
                                         SAVE!
                                </button>
                            </span>
                        </small>
                    </h3>
                    <div id="${keys[idx]}-modal" class="modal fade" role="dialog">
                        <div class="modal-dialog">
                        <!-- Modal content-->
                            <div class="modal-content">
                              <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">${keys[idx]} Configuration</h4>
                              </div>
                              <div class="modal-body">
                                ${settings[keys[idx]].desc}
                                <p>example: </p>
                                <textarea disabled rows="${settings[keys[idx]].def_conf.split('\n').length}" style="width:100%; height:100%">${settings[keys[idx]].def_conf}</textarea>
                              </div>
                              <div class="modal-footer">
                                <button type="button"
                                    class="btn btn-default" data-dismiss="modal">Close</button>
                              </div>
                            </div>
                        </div>
                    </div>
                <form>
                    <div class="form-group">
                      <textarea class="setting-input rounded-0"
                      id="${sid(keys[idx])}" data="${keys[idx]}"></textarea>
                    </div>
                </form>
             </div>`).join('')}
            </div>`
}


$(document).ready(()=>{
    $('#nav_pills').append(make_pills(Object.keys(settings)));
    $('#tab_conts').append(make_tabs(settings));

    /* enable tab */
    $(document).delegate('.setting-input', 'keydown', function(e) {
        setTimeout(()=>{
            if(setting_cache[$(this).attr('id')] === $(this).val()){
                $(`#save-${$(this).attr('data')}`).hide();
                $(`#reset-${$(this).attr('data')}`).hide();
            }
            else{
                $(`#save-${$(this).attr('data')}`).show();
                $(`#reset-${$(this).attr('data')}`).show();
            }
        }, 100);
        //if(setting_cache[$(this).attr('id')] === $(this).val())
        //    $(`#save-${$(this).attr('data')}`).hide();
        //else
        //    $(`#save-${$(this).attr('data')}`).show();

        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

            // put caret at right position again
            this.selectionStart =
                this.selectionEnd = start + 1;
        }
    });
    /* smart indent */
    var elts = Object.values(document.getElementsByClassName('setting-input'));
    for(e of elts){
        e.addEventListener('keyup', function(v){
            if(v.keyCode != 13 || v.shiftKey || v.ctrlKey || v.altKey || v.metaKey)
                return;
            var val = this.value, pos = this.selectionStart;
            var line = val.slice(val.lastIndexOf('\n', pos - 2) + 1, pos - 1);
            var indent = /^\s*/.exec(line)[0];
            if(!indent) return;
            var st = this.scrollTop;
            this.value = val.slice(0, pos) + indent + val.slice(this.selectionEnd);
            this.selectionStart = this.selectionEnd = pos + indent.length;
            this.scrollTop = st;
        }, false);
    }
    /* load or default for every field */
    chrome.storage.sync.get((res) => {
        for(e of Object.keys(settings)){
            $(`#${sid(e)}`).attr(
                'placeholder',
                settings[e].def_conf);
            if(res[`${sid(e)}`]){
                var val = settings[e].plain(res[`${sid(e)}`]);
                setting_cache[`${sid(e)}`] = val;
                $(`#${sid(e)}`).val(val);
                //$(`#save-${$(this).attr('data')}`).hide();
            }
            else{
                setting_cache[`${sid(e)}`] = '';
            }
        }
    });
    /* save function */
    $('.save-button').click(function(){
        var val = $(`#${sid($(this).attr('data'))}`).val();
        if(val.match(/^\s*$/)){
            $(this).hide();
            $(`#reset-${$(this).attr('data')}`).hide();
            chrome.storage.sync.remove(`${sid($(this).attr('data'))}`);
            setting_cache[`${sid($(this).attr('data'))}`] = val;
        }
        else if(settings[$(this).attr('data')].validate(val)){
            $(this).hide();
            $(`#reset-${$(this).attr('data')}`).hide();
            chrome.storage.sync.set({
                [`${sid($(this).attr('data'))}`]: 
                settings[$(this).attr('data')].store(val)
            });
            setting_cache[`${sid($(this).attr('data'))}`] = val;
        } else alert("invalid syntax");

    });
    /* reset function */
    $('.reset-button').click(function(){
        $(this).hide();
        $(`#save-${$(this).attr('data')}`).hide();
        $(`#${sid($(this).attr('data'))}`).val(setting_cache[`${sid($(this).attr('data'))}`]);
    });
});

/* popup.html below */

reg_table = {}

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
            this.content = content === undefined ? hname : content;

            for(name in childs) childs[name].bind(`${attrs.id}`, name);

            this.html = () => {
                //console.log(this.content);
                return template(
                    Object.keys(attrs).map(
                        (k) => `${k}="${attrs[k]}"`).join(' '),
                    this.content,
                    childs
                );
            }

            this.events = events === undefined ? {} : events; 
            this.bindEvents = ($, uis) => {
                for(name in this.events){
                    $(`#${attrs.id}`).on(name, null, {
                        $: $,
                        uis: uis
                    }, this.events[name]);
                }
                Object.values(childs).forEach(
                    (child) => child.bindEvents($, uis));
            }
            return this;
        }
    }
}

var merge_ui = (uis) => Object.values(uis).map((c)=>c.html()).join('');

var label_ui = ui_object(LABEL,
    (attrs, content, uis) => `<label ${attrs}">${content}${merge_ui(uis)}</label>`,
    {
        "class": "ui-unit"
    });

var switch_change = (callback) =>
    function(event, state){
        chrome.storage.sync.set({
            [this.id]: state
        });
        if(callback) callback(state);
    }

var switch_ui = ui_object(SWITCH,
    (attrs, content, uis) => `<input ${attrs}>`,
    {
        type: "checkbox",
        "class": "ui-unit",
        "data-size": "mini",
        "data-on-color": "success",
        "data-off-color": "default"
    });

var select_ui = ui_object(SELECT,
    (attrs, content, uis) => `<select ${attrs}> 
                                 <!-- <option selected="selected"
                                     value="${content}">
                                     ${content}${merge_ui(uis)}
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
    (attrs, content, uis) => `<button ${attrs}>${content}${merge_ui(uis)}</button>`,
    {
        type:"button",
        'class':"ui-unit btn btn-success btn-xs"
    });

var pack_ui = ui_object(PACK,
    (attrs, content, uis) => `<div ${attrs}>${content}${merge_ui(uis)}</div>`,
    {
        'class': "ui-pack input-group col-xs-10 form-inline",
        style: "width:225px;"

    });

var modal_ui = ui_object(MODAL,
    (attrs, content, uis) => `<div ${attrs}>
                          <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                              <div class="modal-header">
                                <button type="button" class="close"
                                        data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">${content}</h4>
                              </div>
                              <div class="modal-body">
                                ${uis.body.html()}
                                <p>Some text in the modal.</p>
                              </div>
                              <div class="modal-footer">
                                ${uis.footer.html()} 
                              </div>
                            </div>

                          </div>
                        </div>`,
    {
        'class': "ui-unit modal fade",
        role: "dialog"
    });

var textarea_ui = ui_object(TEXTAREA,
    (attrs, content, uis) => `<textarea ${attrs}>${content}</textarea>`,
    {
        'class': "form-control",
        //style: "width:225px;"
    });

function Handler(hname, uis, events){
    for(k in uis) uis[k].bind(hname, k);
    for(k in events){
        var e = events[k];
        console.log("making", k);
        /* use IIFE avoid fucking side effect !! */
        var lift = (function(event_name, event_func){
            return function(req, callback, config){
                if(event_func.precond(config, uis)){
                    console.log(`handling ${hname} ${event_name}`);
                    event_func.onevent(req, callback, config, uis);
                } else console.log(`pass ${hname}`);
            }
        })(k, e);
        if(k in reg_table) reg_table[k].push(lift);
        else reg_table[k] = [lift];
    }
    this.bindEvents = ($) =>{ for(ui of uis) ui.bindEvents($, uis); }
    this.ui = () => uis.map((ui)=>ui.html()).join('');
}

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

function roomTabs(f){
    chrome.tabs.query({
        url: 'https://drrr.com/room/*'
    }, (tabs) => f(tabs));
}

function sendTab(data){
    roomTabs((tabs) => chrome.tabs.sendMessage(tabs[0].id, data));
}

function bcastTabs(data){
    roomTabs((tabs) => 
        tabs.forEach((tab) =>
            chrome.tabs.sendMessage(tab.id, data)));
}

var switches = [

    new Handler("timer", 
        [
            new pack_ui({}, '', [
                new switch_ui({
                    'switchChange.bootstrapSwitch': switch_change() 
                }, '', [], {id: SWITCH_TIMER}),
                new label_ui({}, 'timer')
            ])
        ], 
        {

        }
    ),

    new Handler("welcome", 
        [
            new pack_ui({}, '', [
                new switch_ui({
                    'switchChange.bootstrapSwitch': switch_change() 
                }, '', [], {id: SWITCH_WELCOME}),
                new label_ui({}, 'welcome')
            ])
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
                                    args: { msg: wmsg.replace(/@user/g, req.user) }
                                });
                            }
                        })(assoc(req.user, config, WELCOME));
                    }
                }
            }
        }
    ),


    new Handler("whitelist", 
        [
            new pack_ui({}, '', [
                new switch_ui({
                    'switchChange.bootstrapSwitch': switch_change() 
                }, '', [], {id: SWITCH_WHITELIST}),
                new label_ui({}, 'whitelist')
            ])
        ],
        {
            [event_join]: {
                precond: (config, uis) => config[SWITCH_WHITELIST],
                onevent: (req, callback, config, uis) => {
                    if(!assoc(req.user, config, WHITELIST)){
                        sendTab({
                            fn: kick_member,
                            args: { user: req.user }
                        })
                    }
                }
            }
        }
    ),



    new Handler("blacklist", 
        [
            new pack_ui({}, '', [
                new switch_ui({
                    'switchChange.bootstrapSwitch': switch_change() 
                }, '', [], {id: SWITCH_BLACKLIST}),
                new label_ui({}, 'blacklist')
            ])
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
                }
            }
        }
    ),


    new Handler("AutoDM",
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
                //new select_ui({
                //    'change': function(){
                //        chrome.storage.sync.set({
                //            [DM_USERNAME]: 
                //            this.options[this.selectedIndex].text
                //        });
                //        sendTab({ fn: off_dm_member });
                //    }
                //}, 'username', [], {id: DM_USERNAME})
            ])
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
    ),


    new Handler("always me",
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
                new label_ui({}, 'always me')
            ])
        ],
        {

        }
    ),


    new Handler("record chat",
        [
            new pack_ui({}, '', [
                new switch_ui({
                    'switchChange.bootstrapSwitch': switch_change() 
                }, '', [], {id: SWITCH_HISTORY}), 
                new label_ui({}, 'record chat')
            ])
        ],
        {

        }
    ),


    new Handler("accept music request",
        [
            new pack_ui({}, '', [
                new switch_ui({
                    'switchChange.bootstrapSwitch': switch_change() 
                }),
                new label_ui({}, 'accept 🎶 request')
            ])
        ],
        {

        }
    ),
];

function unit_layout(units){
    return units.shift();
}

function pair_layout(units){
    return `<div class='two-side-container'>
                <div class="align-left">${units.shift()}</div>
                <div class="align-right">${units.shift()}</div>
            </div>`;
}

function init_switches($, defaults){
    chrome.storage.sync.get((res) => {
        var state = {};
        Object.assign(state, JSON.parse(JSON.stringify(
            !Object.keys(res).length ? defaults : res)));
        $(`.${class_map[SWITCH]}`).each(function(){
            $(this).bootstrapSwitch('state', state[this.id]);
        })
        $(`.${class_map[SELECT]}`).each(function(){
            var dm_user = state[this.id];
            $(`#${this.id} option[value="${dm_user}"]`).html();
        });

        roomTabs((tabs) => {
            if(tabs.length){
                chrome.tabs.sendMessage(tabs[0].id, {
                    fn: get_members,
                }, (members) => {
                    if(members){
                        members.forEach((m) =>
                            $(`.${class_map[SELECT]}`).append(
                                `<option value="${m}">
                                     ${m}
                                 </option>`)
                        );
                    }
                })
            }
        });

        function sendTab(data){
            roomTabs((tabs) => chrome.tabs.sendMessage(tabs[0].id, data));
        }



    });
}

function template_setting($){
    var template = {}
    $(`.${class_map[SWITCH]}`).each(function(){
        template[this.id] = $(this).prop('checked');
    });
    $(`.${class_map[SELECT]}`).each(function(){
        template[this.id] = $(`#${this.id} :selected`).val();
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
    switches.ui = switches.map((h) => h.ui());
    $(panel_id).append(
        switches_layout.map((set) => 
            set(switches.ui)).join(''));
    $(`.${class_map[SWITCH]}`).bootstrapSwitch('size', 'mini');
    defaults = template_setting($); 
    init_switches($, defaults);
    switches.map((h)=>h.bindEvents($));
}

var popupURL = chrome.extension.getURL('popup/index.html');

chrome.runtime.onMessage.addListener((req, sender, callback) => {
    if(sender.url === popupURL){
        if(callback) callback();
    }
    else if(sender.url === 'https://drrr.com/room/'){
        console.log(req);
        chrome.storage.sync.get((config) => {
            var reg_funcs = reg_table[req.type] || [];
            for(handle of reg_funcs)
                handle(req, callback, config)
            if(callback) callback("done.");
        });   
    }
})
