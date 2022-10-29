// https://drrr.com/index.php?controller=admin
let event_me        = "me"
let event_music     = "music"
let event_leave     = "leave"
let event_timeout   = "timeout"
let event_join      = "join"
let event_newhost   = "new-host"
let event_msg       = "msg"
let event_dm        = "dm"
let event_dmto      = "dmto"
let event_newtab    = "newtab"
let event_exittab   = "exittab"
let event_exitalarm = "exitalarm"
let event_logout    = "logout"
let event_musicbeg  = "musicbeg"
let event_musicend  = "musicend"
let event_timer  = "timer"
let event_clock  = "clock"
let event_kick = "kick"
let event_ban = "ban"
let event_unban = "unban"
let event_roll = "roll"
let event_roomprofile = "room-profile"
let event_roomdesc = "new-description"
let event_lounge = 'lounge'

let event_events = [event_me      , event_music   , event_leave   , event_join    , event_newhost , event_msg     , event_dm      , event_dmto    ,/* event_logout  , */event_musicbeg , event_musicend, /*event_timer, event_clock, */event_kick, event_ban, event_unban, event_roll, event_roomprofile, event_roomdesc, event_lounge, event_newtab, "*"]

let action_name = "name"
let action_desc = "desc"
let action_msg = "msg"
let action_umsg = "umsg"
let action_dm  = "dm"
let action_udm  = "udm"
let action_mus = "mus"
let action_kick = "kick"
let action_unban = "unban"
let action_ban = "ban"
let action_banrpt = "banrpt"
let action_plym = "plym"
let action_addm = "addm"
let action_delm = "delm"
let action_lstm = "lstm"
let action_nxtm = "nxtm"
let action_pndm = "pndm"
let action_schm = "schm"
let action_pshm = "pshm"
let action_ashm = "ashm"
let action_horm = "horm"
let action_ocdr = "ocdr"
let action_gofr = "gofr"

let action_djmd = "djmd"
let action_plyr = "plyr"
let action_aliv = "aliv"

let action_swpm = "swpm"
let action_movm = "movm"
let action_repm = "repm"
let action_lopm = "lopm"
let action_sngm = "sngm"
let action_albm = "albm"
let action_shfm = "shfm"
let action_modm = "modm"
let action_srcm = "srcm"

let action_eval = "eval"
let action_evalbang = "eval!"
let action_call = "call"
let action_callbang = "call!"
let action_nop = "nop"

let action_actions = [action_name, action_desc, action_msg, action_umsg, action_dm, action_udm, action_mus, action_kick, action_unban, action_ban, action_banrpt, action_plym, action_addm, action_delm, action_lstm, action_nxtm, action_pndm, action_schm, action_pshm, action_ashm, action_horm, action_ocdr, action_gofr, action_djmd, action_plyr, action_aliv, action_call, action_callbang, action_eval, action_evalbang, action_nop, action_swpm, action_movm, action_repm, action_lopm, action_sngm, action_albm, action_shfm, action_modm, action_srcm]

let LABEL         = "label"
let SELECT        = "select"
let SWITCH        = "switch"
let BUTTON        = "button"
let PACK          = "pack"
let MODAL         = "modal"
let TEXTAREA      = "textarea"
let class_map     = {}
class_map[LABEL] = 'bs-label'
class_map[SWITCH] = 'bs-switch'
class_map[SELECT] = 'bs-select'
class_map[BUTTON] = 'bs-button'
class_map[PACK] = 'bs-pack'
class_map[MODAL] = 'bs-modal'
class_map[TEXTAREA] = 'bs-textarea'

let change_room_title = "change_room_title"
let change_room_descr = "change_room_descr"
let post_message = "post_message"
let publish_message = "publish_message"
let switch_me = "switch_me"
let on_dm_member = "on_dm_member"
let off_dm_member = "off_dm_member"
let dm_member = "dm_member"
let handover_room = "handover_room"
let kick_member = "kick_member"
let ban_member = "ban_member"
let unban_member = "unban_member"
let set_dj_mode = "set_dj_mode"
let set_player = "set_player"
let set_alive = "set_alive"
let ban_report_member = "ban_report_member"
let play_music = "play_music"
let get_members = "get_members"
let alert_user  = "alert_user"
let bind_alarms = "bind_alarms"
let rebind_alarms = "rebind_alarms"
let clear_alarms = "clear_alarms"
let is_playing = "is_playing"
let set_timeout = "set_timeout"
let leave_room = "leave_room"
let keep_room = "keep_room"
let cache_profile = "cache_profile"
let update_profile = "update_profile"
let scroll_to = "scroll_to"
let bg_effect = "bg_effect"
let change_bg_img_url = "change_bg_img_url"
let change_name_clr = "change_name_clr"
let change_name_bg_clr = "change_name_bg_clr"
let set_clock = "set_clock"
let show_prompt = "show_prompt"
let show_confirm = "show_confirm"
let call_wizard = "call_wizard"
let reload_room = "reload_room"

let WELCOME_SETTING = "welcome_setting"
let WELCOME_TERMS   = "welcome_terms"

let TIMER      = "Timer"
let WELCOME    = "Welcome"
let BANLIST = "banlist"
// deprecate?
let WHITELIST  = "WhiteList"
let BLACKLIST  = "BlackList"
let BANTYPE    = "bantype"

let KEEPER     = "RoomKeeper"
let HISTORY    = "ChatHistory"
let BANABUSE   = "BanAbuse"
let EVENTACT   = "EventAction"
let TGBOTCHATID    = "TgBotChatID"
let TGBOTTOKEN    = "TgBotToken"
let TGBOT      = "TgBot"
let NOTIF      = "NoTif"

let SWITCH_ME  = "switch_me"
let SWITCH_DM  = "switch_dm"
let SWITCH_HISTORY = "switch_history"

let SWITCH_KEEPER   = "switch_keeper"
let SWITCH_TGBOT   = "switch_tgbot"
let SWITCH_NOTIF      = "switch_notif"

let SWITCH_BANABUSE = "switch_banabuse"
let SWITCH_EVENTACT = "switch_eventaction"
let SWITCH_BANLIST = "switch_banlist"
let SWITCH_TIMER = "switch_timer"
let SWITCH_WELCOME = "switch_welcome"
// deprecated below
let SWITCH_WHITELIST = "switch_whitelist"
let SWITCH_BLACKLIST = "switch_blacklist"


let DM_USERNAME = "dm_username"
let SCHLIST = "searchlist"
let PLAYLIST = "playlist"
let FAVLIST = "favlist"
let TRIPCODES   = "tripcodes"
let FRIENDS = "friends"
let HOMES   = "homes"
let MUSIC_MODE = 'music_mode'
let SINGLE_MODE = 'glyphicon-music'
let ALBUM_MODE = 'glyphicon-cd'
let SLOOP_MODE = 'glyphicon-repeat'
let ALOOP_MODE = 'glyphicon-refresh'
let MUSIC_DELAY = 'music_delay'
let RULE_NOTE_MUTE = "rule_notification_mute"
let EAGER_ASK = "eager_ask"

let ADMINS = ['L/CaT//Hsk', '8MN05FVq2M', 'UNZ/.jERuU']

var HtmlUtil = {
  htmlEncode:function (str){
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&/g,"&amp;");
    s = s.replace(/</g,"&lt;");
    s = s.replace(/>/g,"&gt;");
    s = s.replace(/ /g,"&nbsp;");
    s = s.replace(/\'/g,"&#39;");
      s = s.replace(/\"/g,"&quot;");
        return s;
      },
  htmlDecode:function (str){
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&amp;/g,"&");
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    s = s.replace(/&nbsp;/g," ");
    s = s.replace(/&#39;/g,"\'");
    s = s.replace(/&quot;/g,"\"");
    return s;
  }
};

function cache(config, callback, keys){
  if(config) callback(config);
  else if(keys) chrome.storage.sync.get(keys, (config) => {
    callback(config);
  });
  else chrome.storage.sync.get((config) => {
    callback(config);
  });
}

let DEFAULT_DELAY = 10;
function getDelay(config){
  if(!config) throw "need a config as paramemter";
  return config[MUSIC_DELAY] === undefined ? DEFAULT_DELAY : Number(config[MUSIC_DELAY]);
}

let is = {
  in: (array) => (v) => array.includes(v) || v.every && v.every((e)=>array.includes(e)),
  number: (v) => typeof v === 'number',
  string: (v) => typeof v === 'string',
  strary: (v) => Array.isArray(v) && v.every(is.string),
  array:  (v) => Array.isArray(v),
  regex: (v) => new RegExp(v),
  action: ([f, args]) => (
    (f === undefined && f === args) ||
    action_actions.includes(f) && Array.isArray(args) && args.every(is.string))
}

function info(guard, msg){
  return (v, idx, ary) => {
    if(!guard(v)) throw msg(v, idx, ary);
    return guard(v);
  }
}

function rule_plain(rules){
  return rules.map((rule) => rule.map((e) => JSON.stringify(e)).join(', ')).join('\n');
}

function dict_plain(dict){
  return Object.keys(dict).map((k)=>{ return JSON.stringify(k) + ": " + JSON.stringify(dict[k]); }).join('\n');
}

function rule_store(text){
  text.trim().split("\n").map((r)=>JSON.parse('[' + r + ']'));
  return JSON.parse(
    "[" + text.trim().split("\n").map(
      (r) => "[" + r + "]").join(",")
    + "]");
}

function dict_store(text){
  text.trim().split("\n").map((r)=>JSON.parse('{' + r + '}'));
  return JSON.parse("{" + text.trim().split("\n").join(",") + "}");
}

function close_switch(id, callback){
  return (type) => chrome.storage[type].get((config)=>{
    if(config[id]){
      chrome.storage[type].set(
        { [id]: false },
        ()=>{
          chrome.notifications.create({
            type: "basic",
            iconUrl: '/icon.png',
            title: `EMPTY SETTING, SWITCH OFF `,
            message: `switch off because empty setting`
          });
          callback && callback(type);
        }
      );
    }
  });
}

function start_switch(id, f2t_callback, t2t_callback){
  return (type)=> chrome.storage[type].get((config)=>{
    if(!config[id]){
      if(confirm('switch is not active, do you want to start?')){
        return chrome.storage[type].set(
          { [id]: true },
          ()=> f2t_callback && f2t_callback(type)
        );
      }
    }
    t2t_callback && t2t_callback(type)
  });
}

var setting_postfix = `-setting`
function sid(v, config){
  if(!config) return `${v}${setting_postfix}`;
  if(v === BANLIST)
    return (config[BANLIST] && sid(config[BANLIST])) || sid(BLACKLIST);
  else return `${v}${setting_postfix}`;
}

function unsid(s){
  return s.substring(0, s.length - setting_postfix.length);
}

var valid_evtact = (data) => {
  var d = rule_store(data);
  d.map((v) => v[0]).every(
    info(
      is.in(event_events),
      (v, idx) => `rule ${idx + 1}, cell[1]: "${v}" should in ${JSON.stringify(event_events)}`))
  d.map((v) => v[1]).every(is.regex)
  d.map((v) => v[2]).every(is.regex)
  d.map((v) => v[3]).every(
    info(is.in(action_actions), (v, idx) => `rule ${idx + 1}, cell[4]: "${v}" should in ${JSON.stringify(action_actions)}`))
  d.map((v) => v[4]).every(
    info(is.array, (v, idx) => v ? `rule ${idx + 1}, cell[5]: "${JSON.stringify(v)}" should be [...]` : `rule ${idx + 1}, cell[5]: you need a [...] as arguments`))
  d.map((v) => [v[5], v[6]]).every(
    info(is.action, ([f, args], idx) => `rule ${idx + 1}, cell[6] and [7] both left empty or "${f}" should be action function name, ${JSON.stringify(args)} be [...] as arguments`))

}

var fields = {
  select: function(options, multiple = false){
    this.options = options;
    this.check = function(){

    }
    this.toHTML = function(){
      let opts = this.options
        .map(o => `<option>${o}</option>`)
        .join("\n");
      return `<select>${opts}</select ${multiple ? 'multiple' : ''}>`;
    }
  },
  number: function(val, min, max, step){
    this.val = val;
    this.min = min;
    this.max = max;
    this.step = ste;
    this.check = function(){

    }
    this.toHTML = function(){
      return `<input type="number"
                     value="${this.val}"
                     min="${this.min}"
                     max="${this.max}"
                     step="${this.step}">`
    }
  },
  arglist: function(){
    this.check = function(){

    }
    this.toHTML = function(){
      return `<input type="text">`
    }
  },
  regexp: function(){
    this.check = function(){

    }
    this.toHTML = function(){
      return `<input type="text">`
    }
  },
  string: function(){
    this.check = function(){

    }
    this.toHTML = function(){
      return `<input type="text">`
    }
  }
}

var settings = {
  [TIMER]: {
    validate: (data) => {
      var d = rule_store(data);
      d.map((v) => v[0]).every(
        info((v) => is.number(v) && (v >= 0.1),
          (v, idx) => `rule ${idx + 1}, cell[1]: "${v}" should be a number and >= 0.1`));
      d.map((v) => v[1]).every(
        info(is.in(action_actions), (v, idx) => `rule ${idx + 1}, cell[4]: "${v}" should in ${JSON.stringify(action_actions)}`))
      d.map((v) => v[2]).every(
        info(is.array, (v, idx) => v ? `rule ${idx + 1}, cell[5]: "${v}" should be [...]` : `rule ${idx + 1}, cell[5]: you need a [...] as arguments`))
    },
    plain: rule_plain,
    load: (d) => d,
    store: rule_store,
    empty_cbk: close_switch(SWITCH_TIMER,
      (type)=> roomTabs((tabs) => {
        if(tabs.length){
          bcastTabs({ fn: clear_alarms, args: { type: type } });
          chrome.notifications.create({
            type: "basic",
            iconUrl: '/icon.png',
            title: 'STOP TIMER',
            message: 'Switch off, Timer will be disabled'
          });
        }
      })),
    save_cbk: start_switch(SWITCH_TIMER,
      (type) => sendTab(
        { fn: bind_alarms, args: { type: type } },
        undefined, undefined,
        ()=> chrome.notifications.create({
          type: "basic",
          iconUrl: '/icon.png',
          title: 'START TIMER',
          message: 'Switch on, Timer will be started'
        })
      ),
      (type) => roomTabs((tabs) => {
        if(tabs.length &&
          confirm('TIMER configuration changed, do you want to restart now?')){
          bcastTabs({ fn: rebind_alarms, args: { type: type } });
          chrome.notifications.create({
            type: "basic",
            iconUrl: '/icon.png',
            title: 'RESTART TIMER',
            message: 'Configuration changed, Timer restarted tab'
          });
        }
      })
    ),
  },
  [WELCOME]: {
    validate: (data) => {
      var d = rule_store(data);
      d.map((v) => v[0]).every(
        info(is.string, (v, idx) => `rule ${idx + 1}, cell[1]: "${v}" should be string`))
      d.map((v) => v[0]).every(is.regex)
      d.map((v) => v[1]).every(
        info((v) => is.string(v) || is.strary(v),
          (v, idx) => `rule ${idx + 1}, cell[2]: "${v}" should be string or [string, ...]`));

    },
    plain: rule_plain,
    load: (d) => d,
    store: rule_store,
    empty_cbk: close_switch(SWITCH_WELCOME),
    save_cbk: start_switch(SWITCH_WELCOME),
  },
  [WHITELIST]: {
    validate: (d) => d.split("\n").every(is.regex),
    plain: (d) => d,
    load: (d) => d.split("\n"),
    store: (d) => d.trim().replace(/^\s*[\r\n]|\n^\s*$/gm, ''),
    empty_cbk: (type)=>chrome.storage[type].get(BANLIST, (config)=>{ if(config[BANLIST] == WHITELIST) close_switch(SWITCH_BANLIST);}),
    save_cbk: start_switch(
      SWITCH_BANLIST,
      (type)=>chrome.storage[type].set({[BANLIST]:WHITELIST})),
  },
  [BLACKLIST]: {
    validate: (d) => d.split("\n").every(is.regex),
    plain: (d) => d,
    load: (d) => d.split("\n"),
    store: (d) => d.trim().replace(/^\s*[\r\n]|\n^\s*$/gm, ''),
    empty_cbk: (type)=>chrome.storage[type].get(BANLIST, (config)=>{ if(config[BANLIST] == BLACKLIST) close_switch(SWITCH_BANLIST);}),
    save_cbk: start_switch(
      SWITCH_BANLIST,
      (type)=>chrome.storage[type].set({[BANLIST]:BLACKLIST})),
  },
  [BANABUSE]: {
    validate: (d) => d.split("\n").every(is.regex),
    plain: (d) => d,
    load: (d) => d.split("\n"),
    store: (d) => d.trim().replace(/^\s*[\r\n]|\n^\s*$/gm, ''),
    empty_cbk: close_switch(SWITCH_BANABUSE),
    save_cbk: start_switch(SWITCH_BANABUSE),
  },
  [EVENTACT]: {
    validate: valid_evtact,
    plain: rule_plain,
    load: (d) => d,
    store: rule_store,
    empty_cbk: close_switch(SWITCH_EVENTACT),
    save_cbk: start_switch(SWITCH_EVENTACT),
  },
}

/* helper functions */
function roomTabs(f, url){
  chrome.tabs.query({
    url: url || 'https://drrr.com/room/*'
  }, (tabs) => f(tabs));
}

function sendTab(data, except, callback, after, url){
  roomTabs((tabs) => {
    if(tabs.length){
      chrome.tabs.sendMessage(tabs[0].id, data, callback);
      if(after) after();
    }
    else if(except) except();
  }, url);
}

function bcastTabs(data){
  roomTabs((tabs) =>
    tabs.forEach((tab) =>
      chrome.tabs.sendMessage(tab.id, data)));
}

function sendTabMessage(msg, url){
  let args = { msg };
  if(url) args.url = url;
  sendTab({ fn: publish_message, args })
}

function sendTabDM(user, msg, url){
  let args = { user, msg };
  if(url) args.url = url;
  sendTab({ fn: dm_member, args })
}

function push_value(entry, val, callback, pos){
  chrome.storage.sync.get((config)=>{
    var list = config[entry];
    if(!list) list = [];

    if(pos >= list.length) pos = -1;

    if(pos < 0) list.push(val);
    else list.splice(pos, 0, val);

    chrome.storage.sync.set(
      { [entry]: list },
      ()=> callback && callback(list)
    );
  });
}

function pop_value(conf_name, by, callback){
  chrome.storage.sync.get(conf_name, (config) => {
    var list = config[conf_name];
    if(list && list.length){
      var target = list.findIndex(by);
      console.log("delete:", list);
      if(target >= 0){
        list.splice(target, 1);
        return chrome.storage.sync.set(
          { [conf_name]: list },
          ()=> callback && callback(true, list)
        );
      }
    }
    callback && callback(false, list);
  });
}

function del_value(conf_name, idx, callback, not, pub, mute = false, publish = false){
  chrome.storage.sync.get(conf_name, (config) => {
    var list = config[conf_name];
    function onError(){
      if(!mute) chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `${conf_name.toUpperCase()} UPDATE FAILED`,
        message: `${conf_name} delete range out of bound`
      });
      if(callback) callback(false);
      if(publish){
        sendTab({
          fn: publish_message,
          args: { msg: `${conf_name.toUpperCase()} delete range out of bound` }
        })
      }
    }
    if(!list) return onError();
    try{
      var item = list.remove(idx);
      chrome.storage.sync.set(
        { [conf_name]: list },
        ()=>{
          if(!mute) not(conf_name, item);
          if(callback) callback(true);
          if(publish) pub(conf_name, item);
        }
      );
    }
    catch (e){ onError(); }
  });
}

function swp_value(conf_name, here, there,
  callback, not, pub, mute = false, publish = false){
  chrome.storage.sync.get(conf_name, (config) => {
    var list = config[conf_name];
    function onError(){
      if(!mute) chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `${conf_name.toUpperCase()} UPDATE FAILED`,
        message: `${conf_name} swap range out of bound`
      });
      if(callback) callback(false);
      if(publish){
        sendTab({
          fn: publish_message,
          args: { msg: `${conf_name.toUpperCase()} swap range out of bound` }
        })
      }
    }

    if(!list) return onError();
    try{
      let [a, b] = list.swap(here, there);
      chrome.storage.sync.set(
        { [conf_name]: list },
        ()=>{
          if(!mute) not(conf_name, a, b);
          if(callback) callback(true);
          if(publish) pub(conf_name, a, b);
        }
      );
    }
    catch (e){ onError(); }
  });
}

function mov_value(conf_name, from, to,
  callback, not, pub, mute = false, publish = false){
  chrome.storage.sync.get(conf_name, (config) => {
    var list = config[conf_name];
    function onError(){
      if(!mute) chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `${conf_name.toUpperCase()} UPDATE FAILED`,
        message: `${conf_name} move range out of bound`
      });
      if(callback) callback(false);
      if(publish){
        sendTab({
          fn: publish_message,
          args: { msg: `${conf_name.toUpperCase()} move range out of bound` }
        })
      }
    }

    if(!list) return onError();
    try{
      let item = list.move(from, to);
      chrome.storage.sync.set(
        { [conf_name]: list },
        ()=>{
          if(!mute) not(conf_name, item);
          if(callback) callback(true);
          if(publish) pub(conf_name, item);
        }
      );
    }
    catch (e){ onError(); }
  });
}

function shf_value(conf_name, callback,
  not, pub, mute = false, publish = false){
  chrome.storage.sync.get(conf_name, (config) => {
    var list = config[conf_name];
    function onError(){
      if(!mute) chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `${conf_name.toUpperCase()} UPDATE FAILED`,
        message: `${conf_name} move range out of bound`
      });
      if(callback) callback(false);
      if(publish){
        sendTab({
          fn: publish_message,
          args: { msg: `${conf_name.toUpperCase()} move range out of bound` }
        })
      }
    }

    if(!list) list = [];
    try{
      list.shuffle();
      chrome.storage.sync.set(
        { [conf_name]: list },
        ()=>{
          if(!mute) not(conf_name);
          if(callback) callback(true);
          if(publish) pub(conf_name);
        }
      );
    }
    catch (e){ onError(); }
  });
}

function loop_value(conf_name, callback, not, pub, mute = false, publish = false){
  chrome.storage.sync.get(conf_name, (config) => {
    var succ = true;
    var list = config[conf_name];
    if(list && list.length){
      var item = list[0];
      list.push(list.splice(0, 1)[0]);
      chrome.storage.sync.set(
        { [conf_name]: list },
        ()=>{
          if(!mute) not(conf_name, item);
          if(callback) callback(true);
          if(publish) pub(conf_name, item);
        }
      );
    }
    else{
      if(!mute) chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `${conf_name.toUpperCase()} LOOP FAILED`,
        message: `${conf_name} loop range out of bound`
      });
      if(callback) callback(false);
      if(publish){
        sendTab({
          fn: publish_message,
          args: { msg: `${conf_name.toUpperCase()} loop range out of bound` }
        })
      }
    }
  });
}

function empty_list(config, cname){
  return config[cname] === undefined || config[cname].length === 0;
}


var Profile = undefined;

function ajaxProfile(callback, flush, from){
  let self = this;
  let loadProfile = null;
  if(self.agent) loadProfile = next => next(self)
  else loadProfile = next => chrome.storage.sync.get(['profile'], next);

  loadProfile(
    (config) => {
      if(config['profile'] && !flush
        && config['profile'].name && config['profile'].id){
        Profile = config['profile'];
        if(callback) callback(Profile);
      }
      else $.ajax({
        type: "GET",
        url: 'https://drrr.com/profile?api=json',
        dataType: 'json',
        beforeSend : function(xhr) {
          if(self.agent){
            xhr.setRequestHeader('drrr-agent', self.agent);
            xhr.setRequestHeader('drrr-cookie', self.cookie);
          }
        },
        success: function(data){
          Profile = data.profile;
          if(from) Profile.loc = from;
          chrome.runtime.sendMessage({
            saveCookie: true,
            profile: Profile
          });
          callback && callback(Profile);
        },
        error: function(data){
          if(data.status == 503){
            console.log("wait 503 reload...")
            if(chrome.tabs){
              sendTab({ fn: reload_room, args: { } })
              setTimeout(() =>  ajaxProfile(callback, flush, from), 5 * 1000)
            }
            else setTimeout(() => window.location.replace(window.location.href), 8000);
            // if it's front end call
          }
          else{
            console.log(`cannot get profile ${data.status}`);
            callback && callback(undefined, data);
          }
        }
      });
    }
  );
}

function getRoom(succ, err){
  let self = this;
  $.ajax({
    type: "GET",
    url: 'https://drrr.com/room?api=json',
    dataType: 'json',
    beforeSend : function(xhr) {
      if(self.agent){
        xhr.setRequestHeader('drrr-agent', self.agent);
        xhr.setRequestHeader('drrr-cookie', self.cookie);
      }
    },
    success: succ,
    error: err
  });
}

//data={'leave': 'leave'}
//data={'message': msg}
//data={'message': msg, 'url': url}
//data={'message': msg, 'to': uid}
//data={'new_host': uid}
//data={'kick': uid}
//data={'ban': uid}
//data={'report_and_ban_user': uid}
//data={'unban': uid, 'userName': name}
//data={'music': 'music', 'name': name, 'url': url}
//data={'dj_mode': str(is_dj_mode).lower()}
//data={'room_name': str(name)}
//data={'room_description': str(name)}
var exec_ctrl = false;
var ctrl_queue = [];
function do_ctrl(){
  function _do_ctrl(){
    if(ctrl_queue.length){
      ctrl_queue.shift()(); // may use promise instead
      setTimeout(()=>{ // wait previous task complete
        if(ctrl_queue.length)
          _do_ctrl();
        else exec_ctrl = false;
      }, 1500); // time gap
    }
  }
  if(!exec_ctrl){ exec_ctrl = true; _do_ctrl(); }
}

function ctrlRoom(cmd, succ, fail){
  ctrl_queue.push(
    ((_c, _s, _f) =>
      () => _ctrlRoom(_c, _s, _f)
    )(cmd, succ, fail)
  );
  do_ctrl();
}

function _ctrlRoom(cmd, succ, fail){
  //console.log(`cmd is ${JSON.stringify(cmd)}`)
  let self = this;
  $.ajax({
    type: "POST",
    url: `https://drrr.com/room/?ajax=1&api=json`,
    data: cmd,
    //dataType: 'json',
    beforeSend : function(xhr) {
      if(self.agent){
        xhr.setRequestHeader('drrr-agent', self.agent);
        xhr.setRequestHeader('drrr-cookie', self.cookie);
      }
    },
    success: function(data){
      //console.log('cmd succ');
      if(succ) succ(data);
    },
    error: function(jxhr){
      if(jxhr.status == 503){
        console.log("wait 503 reload...")
        if(chrome.tabs){
          sendTab({ fn: reload_room, args: { } })
          setTimeout(() =>  ctrlRoom(cmd, succ, fail), 5 * 1000)
        }
        else setTimeout(() => window.location.replace(window.location.href), 8000);
      }
      else console.log(jxhr);
      //console.log('cmd error');
      if(fail) fail(jxhr);
    }
  });
}

function getProfile(callback){
  if(this.agent && this.profile) callback(this.profile);
  else if(!this.agent && Profile) callback(Profile)
  else {
    var tabExist = {}
    var roomURL = 'https://drrr.com/room/*';
    var loungeURL = 'https://drrr.com/lounge/*';

    function reqTab(nextLv, cb, url){
      sendTab(
        {fn: cache_profile},
        () => {
          tabExist[url] = false;
          // console.log('not exist', url);
          nextLv(cb)
        },
        (p) => {
          tabExist[url] = true;
          if(p){
            Profile = p;
            cb(p);
          } else nextLv(cb)
        },
        undefined, url
      );
    }

    function ajaxProfileCache(cb){
      ajaxProfile((p)=>{
        Profile = p;
        cb(p);
        //console.log('exists: ', tabExist);
        [loungeURL, roomURL].forEach(url => {
          if(tabExist[url])
            sendTab({
              fn: update_profile,
              args: {profile: p}
            }, undefined, undefined, undefined, url)
        });
      }, undefined, 'UnknownCache');
    }

    function cacheLounge(cb){
      reqTab(ajaxProfileCache, cb, loungeURL);
    }

    function cacheRoom(cb){
      reqTab(cacheLounge, cb, roomURL);
    }

    if(this.agent)
      this.ajaxProfile(callback);
    else
      cacheRoom(callback);
  }
}


var LoungeState = [], check_count = 0;

var substraction = (a, b) => (a.filter(n => !b.includes(n)))

// need update profile first
var roomUsers = (room, users, config) => {
  return room.users.map(u => {
    var icon = '';
    if(Profile && u.name == Profile.name)
      icon = '🐈';
    else if(isFriends(u, config))
      icon = room.host && room.host.name == u.name ? '🐱' : '🐾';
    else
      icon = room.host && room.host.name == u.name ? '👤' : '👣';
    return `${icon} ${u.name}${u.tripcode ? `#${u.tripcode}` : ''}`
  }).join('\n');
};

var roomState = (room) => `(${room.total}/${String(room.limit).substring(0, 4)})`;

var roomTitle = (room, users, config) =>
  HtmlUtil.htmlEncode(`${room.language} ${room.name} ${roomState(room)}\n${room.description}\n${roomUsers(room, users, config)}`);

function AnalysisRooms(rooms, exit = false, roomId){

  findAsList({'home':true, 'friend':true, 'tripcode': true},
    rooms, roomId, (update, config, allRooms) => {
    if(config[RULE_NOTE_MUTE]) return;
    var preRooms = Object.keys(LoungeState);
    var curRooms = update.map(v=>v[0].name);
    var newRooms = substraction(curRooms, preRooms);
    var delRooms = substraction(preRooms, allRooms.map(v=>v.name));

    // console.log('LoungeState:', LoungeState);
    // console.log('update:', update);

    //console.log('pre LoungeState', LoungeState);
    //console.log('update', update);
    //console.log('curRoom', curRooms);
    //console.log('preRoom', preRooms);
    //console.log('newRoom', newRooms);
    //console.log('delRoom', delRooms);

    update.forEach(([room, users], idx, ary)=>{

      var curUsers = room.users.map(u=>u.name);
      var curGuests = users.map(u=>u.name);
      var curGuestsT = users.map(u=>isTripcodes(u, config) ? `${u.name}#${u.tripcode}` : u.name)
      var sel = room.total < room.limit ? undefined : `button[value="${room.roomId}"]`;
      var url = room.total < room.limit ? 'https://drrr.com/room/?id=' + room.roomId : undefined;
      var msg = room.total < room.limit ?
        chrome.i18n.getMessage('goto_room', [`${room.name} ${roomState(room)}`]):
        chrome.i18n.getMessage('full_room', [`${room.name} ${roomState(room)}`]);

      if(newRooms.includes(room.name)){
        var title = '';
        var names = `"${curGuestsT.join('\", \"')}"`;
        if(check_count){
          if(isHome(room, config))
            title = chrome.i18n.getMessage('open_room', [room.name])
              + (users.length &&
                chrome.i18n.getMessage('show_user', [names]) || '');
          else //friend online
            title = chrome.i18n.getMessage('show_wild_user', [names]);
        }
        else{
          if(isHome(room, config))
            title = `${chrome.i18n.getMessage('opened_room', [room.name])}${users.length && `${chrome.i18n.getMessage('in_room', [names])}` || ''}`;
          else //friend online
            title = chrome.i18n.getMessage('onlined_user', [names]);
        }
        if(title.length && (!roomId || preRooms.length))
          chrome.runtime.sendMessage({
            notification: {
              sel: sel,
              url: url,
              title: title,
              msg: msg,
              exit: exit
            }
          })
      }
      else{
        // people come or leave
        var title = '';
        var preU = LoungeState[room.name];
        var preUsers = LoungeState[room.name].map(u=>u.name);
        var preFriends = (getFriends({users: preU}, config)||[]).map(u=>u.name);
        var preTripcodes = (getTripcodes({users: preU}, config)||[]).map(u=>u.name)
        var preGuests = preFriends.concat(preTripcodes).uniqued();
        var newUsers = substraction(curUsers, preUsers);
        var delUsers = substraction(preUsers, curUsers);
        var newGuests = substraction(curGuests, preGuests);
        var delGuests = substraction(preGuests, curGuests);
        var newStranger = substraction(substraction(newUsers, preUsers), newGuests);
        var delStranger = substraction(delUsers, delGuests);
        sinfo = (newStranger.length + delStranger.length) ?
          ((newStranger.length ? `+${newStranger.join(' +')} ` : '') +
            (delStranger.length ? `-${delStranger.join(` -`)}` : '')) : '';


        if(newGuests.length && !delGuests.length){
          console.log('new Guests', newGuests)
          console.log('pre Guests', preGuests)
          console.log('pre FRIENDS', preFriends)
          console.log('pre trip', getTripcodes({users: preU}, config))
          console.log('pre users', preUsers)
          var cur_names = `"${curGuestsT.join('\", \"')}"`;
          title = chrome.i18n.getMessage('show_wild_user', [cur_names]);
        }
        else if(!newGuests.length && delGuests.length){
          title = chrome.i18n.getMessage('leave_user',
            [delGuests.join(`, `), room.name]);
        }
        else if(newGuests.length && delGuests.length){
          title = chrome.i18n.getMessage('new_user',
            [newGuests.join('\", \"'), delGuests.join(`, `), room.name]);
        }
        else if(!newGuests.length && !delGuests.length && sinfo.length){
          title = chrome.i18n.getMessage('change_room',
            [`${room.name} ${roomState(room)}`]);
          msg = sinfo;
        }

        if((title.length || sinfo.length) && (!roomId || preRooms.length))
          chrome.runtime.sendMessage({
            notification: {
              sel: sel,
              url: url,
              title: title,
              msg: msg,
              exit: exit
            }
          })
      }
    });

    delRooms.forEach(roomName => {
      console.log('curRoom:', curRooms);
      console.log('preRoom:', preRooms);
      console.log('delRoom:', delRooms);
      var preUsers = LoungeState[roomName].map(u=>u.name);
      chrome.runtime.sendMessage({
        notification: {
          title: chrome.i18n.getMessage("collapsed_room", [roomName]),
          msg: chrome.i18n.getMessage("gone_user", [preUsers.join(", ")]),
        }
      });
    })

    LoungeState = {}
    update.forEach(([room, users], idx, ary)=>{
      LoungeState[room.name] = room.users;
    });
    check_count++;
  }, true);
}

function ajaxRooms(succ, err){
  let self = this;
  $.ajax({
    type: "GET",
    url: 'https://drrr.com/lounge?api=json',
    dataType: 'json',
    beforeSend : function(xhr) {
      if(self.agent){
        xhr.setRequestHeader('drrr-agent', self.agent);
        xhr.setRequestHeader('drrr-cookie', self.cookie);
      }
    },
    success: function(data){
      if(Profile && data && data.profile && Profile.id === data.profile.id){
        succ(data);
      }
      else ajaxProfile((p)=>{
        if(p.id !== data.profile.id){
          ajaxProfile(()=>succ(data), true, 'ajaxRoom');
        }
        else succ(data);
      }, undefined, 'AjaxRoom');
    },
    error: function(data){
      if(data.status == 503){
        console.log("wait 503 reload...")
        if(chrome.tabs){
          sendTab({ fn: reload_room, args: { } })
          setTimeout(() =>  ajaxRooms(succ, err), 5 * 1000)
        }
        else setTimeout(() => window.location.replace(window.location.href), 8000);
      }
      else if(err) err(data)
      //else alert(`Error on getting lounge info: ${JSON.stringify(data)}`);
    }
  })
}

function monitRooms(exit, selfRoomId){

  let entries = [FRIENDS, HOMES, TRIPCODES, RULE_NOTE_MUTE];
  entries = entries.concat(['eager-type', 'eager-input', EAGER_ASK]);

  chrome.storage.sync.get(entries, (config)=>{
    let anyrule = [FRIENDS, HOMES, TRIPCODES].filter(
                    k => config[k] && config[k].length).length;
    if((!config[RULE_NOTE_MUTE] && anyrule) || config['eager-input']){
      ajaxRooms(
        function(data){
          console.log('monit lounge once');
          Profile = data.profile;
          AnalysisRooms(data.rooms, exit, selfRoomId);
          if(!selfRoomId && data.redirect == "room")
            location.reload();
        }
      );
    }
    else console.log("skip monit");
  });
}

function inRegExps(regexs, name, m = 'ui'){
  for(regex of regexs)
    if(name.match(new RegExp(regex, m)))
      return true;
  return false;
}

function isRoom(list, room){
  return inRegExps(list, room.name);
}

function isHome(room, config){
  return config[HOMES] ? isRoom(config[HOMES], room) : false;
}

function getUsersBy(list, room, by){
  var users = [];
  for(user of room.users)
    if(by(user) && inRegExps(list, by(user)))
      users.push(user);
  return users.length ? users : false;
}

function getUsers(list, room){
  return getUsersBy(list, room, (u)=>u.name);
}

function getFriends(room, config){
  return config[FRIENDS] ? getUsers(config[FRIENDS], room) : false;
}

function getTrips(list, room){
  return getUsersBy(list, room, (u)=>u.tripcode);
}

function getTripcodes(room, config){
  return config[TRIPCODES] ? getTrips(config[TRIPCODES], room) : false;
}

function isTripcodes(u, config){
  return u.tripcode && config[TRIPCODES] ? inRegExps(config[TRIPCODES], u.tripcode) : false;
}

function isFriends(u, config){
  return config[FRIENDS] ? inRegExps(config[FRIENDS], u.name) : false;
}

function checkAvail(room){
  return room.total < Math.ceil(room.limit);
}

function checkTagHook(type, input, room){
  if(!checkAvail(room)) return false;
  if(type == 0) return room.roomId == input && input;
  else if(type == 1)
    return room.users.map(u=>u.tripcode).find(t=>t && t.match(new RegExp(input, 'i')));
  else if(type == 2)
    return room.users.map(u=>u.name).find(n=>n && n.match(new RegExp(input, 'i')));
  else if(type == 3)
    return room.name.match(new RegExp(input, 'i')) && room.name;
}

function tagHook(config, room){
  var type = config['eager-type'];
  var input = config['eager-input'];
  console.log("hook");
  var result = checkTagHook(type, input, room);
  if(result){
    var toURL = 'https://drrr.com/room/?id=' + room.roomId;
    var ans = !config[EAGER_ASK] || confirm(`Tag Room Rule "${input}" matched with "${result}", do you want go there?`);
    ans && chrome.storage.sync.set(
      {'jumpToRoom': toURL, 'eager-input': '' },
      ()=> {
        if(window.location.href.match(new RegExp('https://drrr.com/room/.*')))
          leaveRoom({jump: toURL}, undefined, true);
        else if(window.location.href.match(new RegExp('https://drrr.com/lounge')))
          window.location.href = toURL;
        else chrome.tabs.update({ url: toURL });
      }
    );
    return ans;
  }
  return false;
}

var attrsp = {
  'home': (room, users, list, config) => isHome(room, config),
  'room': (room, users, list) => isRoom(list, room),
  'trip': (room, users, list) => getTrips(list, room),
  'tripcode': (room, users, list, config) => getTripcodes(room, config),
  'user': (room, users, list) => getUsers(list, room),
  'friend': (room, users, list, config) => getFriends(room, config),
  'all': (room, users, list, config) => true,
  'avail': (room) => checkAvail(room)
};

var attrs = Object.keys(attrsp);
var ATTRS = attrs.map(s=>s.toUpperCase());

function findAsList(mode, rooms, roomId, callback, hookTag){
  attrs.forEach(attr => {
    if(!(attr in mode)) mode[attr] = false;
    var ATTR = attr.toUpperCase();
    if(!(ATTR in mode)) mode[ATTR] = false;
  })

  var entries = [FRIENDS, HOMES, TRIPCODES, RULE_NOTE_MUTE];
  if(hookTag) entries = entries.concat(['eager-type', 'eager-input', EAGER_ASK]);

  chrome.storage.sync.get(entries, (config)=>{
    var groups = [];
    for(room of Object.values(rooms)){
      if(room.roomId === roomId) continue;

      var attr_result = attrs.filter((attr)=>mode[attr])
                             .map((attr)=>attrsp[attr](
                               room, users, mode[attr], config));
      var ATTR_RESULT = ATTRS.filter((ATTR)=>mode[ATTR])
                             .map((ATTR)=>attrsp[ATTR.toLowerCase()](
                               room, users, mode[ATTR], config));

      if(ATTR_RESULT.some(x=>!x)) continue;

      if(!attr_result.length || attr_result.some(x=>x)){
        var cc = (ary, init) => ary.reduce((acc, v)=> Array.isArray(v) ? acc.concat(v) : acc, init)
        var users = cc(ATTR_RESULT, cc(attr_result, [])).uniqued();
        groups.push([room, users]);
      }
    }
    callback(groups, config, Object.values(rooms));

    if(hookTag && config["eager-input"])
      for(room of Object.values(rooms)){
        if(room.roomId === roomId) continue;
        if(tagHook(config, room)) return;
      }
  });
}

function planeArrive(invert){
  var plane = `<img id="plane" src="${chrome.runtime.getURL('/images/planeRB.png')}" style="position:fixed; left:-50%; top:-25%; z-index:999; ${invert ? 'filter: invert(100%); -webkit-filter: invert(100%);' : ''} overflow:hidden;">`
  $('body').append(plane);
  $('body').css('overflow-x', 'hidden');
  $("#plane").animate({ left:"+=175%", top:"+=165%" }, 4000);
}

function planeGo(invert, time = 4000){
  var plane = `<img id="plane" src="${chrome.runtime.getURL('/images/planeRT.png')}" style="position:fixed; left:-50%; top:75%; z-index:999;${invert ? 'filter: invert(100%); -webkit-filter: invert(100%);' : '' }">`
  $('body').append(plane);
  $('body').css('overflow-x', 'hidden');
  $("#plane").animate({ left:"+=175%", top:"-=100%" }, time);
}

function setCookies(cookies, callback){
  function recursive(list, cb){
    if(list.length){
      c = list[0];
      c['url'] = 'https://drrr.com';
      delete c.hostOnly;
      delete c.session;
      chrome.cookies.set(c, ()=>recursive(list.slice(1), cb));
    } else {
      sendTab({cookieDone: true}, undefined, undefined, undefined, 'https://drrr.com/*');
      cb();
    }
  }
  recursive(cookies, callback);
}

function short_url(url, cb){
  $.ajax({
    type: "GET",
    url: `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
    dataType: 'html',
    success: function(data){
      console.log(data);
      cb && cb(data);
    },
    error: function(data){
      console.log(data);
    }
  });
}

function name_trip_split(expr){
  if(expr.includes('##')){
    let e = expr.split('##');
    na = e[0]
    tr = (e.length > 1 ? e[e.length - 1] : undefined);
    return [na, tr, 'i']
  }
  else{
    let e = expr.split('#');
    na = e[0]
    tr = (e.length > 1 ? e[e.length - 1] : undefined);
    return [na, tr, undefined]
  }
}

function match_user(name, trip, nameTripRegex){
  var [nameRegex, tripRegex, ignoreCase] = name_trip_split(nameTripRegex);
  //console.log('matching...', nameRegex, tripRegex);
  if(name === undefined) name = "";
  if(trip === undefined) trip = "";
  if(nameTripRegex.includes('#'))
    return name.match(new RegExp(nameRegex, 'i'))
      && trip.match(new RegExp(tripRegex, ignoreCase));
  else
    return name.match(new RegExp(nameRegex, 'i'));
}

if(typeof OpenCC !== 'undefined'){
  // insure if openCC included
  globalThis.Simplized = OpenCC.Converter({ from: 'tw', to: 'cn' });
  globalThis.Traditionalized = OpenCC.Converter({ from: 'cn', to: 'tw' });
}

function zh_conv(callback){
  chrome.storage.sync.get(['zh_conv'], (config) => {
    var cvt = (x) => x;
    if(config['zh_conv']){
      cvt = {
        'Ｘ': (x) => x,
        '简': Simplized,
        '繁': Traditionalized,
      }[config['zh_conv']];
    }
    callback(cvt);
  });
}

function quote_used(type, cbk){
  chrome.storage[type].get(
    (s)=>cbk(
      Object.keys(s).map(s=>s.length).reduce((a, b) => a + b)
      + Object.values(s).map(x => JSON.stringify(x).length).reduce((a, b) => a + b))
  );
}

function plugTag(type, attr){
  var tag = document.createElement(type);
  for(at in attr)
    tag[at] = attr[at];
  document.getElementsByTagName('body')[0].appendChild(tag);
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  dummy.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function run_lambda_script(pure){
  return function(file){
    function exec(){
      envName = `env-${file}`
      let entries = ["bs-installed"]
      if(!pure) entries.push(envName)
      chrome.storage.local.get(entries, (config)=>{
        code = config["bs-installed"] && config["bs-installed"][file] && config["bs-installed"][file].code;
        if(typeof(code) != "string"){
          return alert(`${file} not existed`);
        }
        if(pure) storage = {}
        else storage = config[envName] || {}
        try{
          storage["evt"] = this.event;

          let machine = new RL.Machine('',
            (...args) => {
              console.log(...args);
            }
          );

          machine.env = RL.insert(machine.env, "env", storage)
          let [ok, val] = RL.interact(machine, code);
          console.log(`[${ok}] ${typeof val} => `, val);

          if(!pure){
            config[envName] = storage;
            chrome.storage.local.set({
              [envName]: config[envName]
            });
          }
        }
        catch(err){
          alert(err.message);
          console.log("error", err);
        }
      })
    }
    if(!drrr.loc) drrr.getReady(exec);
    else exec();
  }
}

function run_lambda_code(pure){
  return function(code, callback){
    function exec(){
      envName = `inline-env`
      let entries = []
      if(!pure) entries.push(envName)

      do_exec = (config)=>{
        if(typeof(code) != "string"){
          return alert(`code is not a string`);
        }
        if(pure) storage = {}
        else storage = config[envName] || {}
        try{
          storage["evt"] = this.event;

          let machine = new RL.Machine('',
            (...args) => {
              console.log(...args);
            }
          );

          machine.env = RL.insert(machine.env, "env", storage)
          let [ok, val] = RL.interact(machine, code);
          console.log(`[${ok}] ${typeof val} => `, val);

          if(!pure){
            config[envName] = storage;
            chrome.storage.local.set({
              [envName]: config[envName]
            }, callback && callback(val));
            return !callback && val;
          }
          else {
            return callback ? callback(val) : val;
          }
        }
        catch(err){
          alert(`====> ${err.message}`);
          console.log("error", err);
        }
      }

      if(!callback) return do_exec({});
      else chrome.storage.local.get(entries, do_exec);
    }

    if(!callback) return exec();
    else if(!drrr.loc) drrr.getReady(exec);
    else return exec();
  }
}

function c2sess(cookies){
  let session = '';
  if(cookies && cookies.forEach){
   cookies.forEach(c => {
     if(c.name == 'drrr-session-1'){
       session = c.value;
     }
   })
  }
  return session;
}

function get_session(callback){
  chrome.storage.sync.get('cookie', config => {
    let s = c2sess(config['cookie']);
    console.log(s)
    callback(s);
  })
}

if(typeof chrome !== 'undefined' && chrome.tabs){
  window.run_lambda_code_purely = run_lambda_code(true);
  window.run_lambda_code_impurely = run_lambda_code(false);
  window.run_lambda_script_purely = run_lambda_script(true);
  window.run_lambda_script_impurely = run_lambda_script(false);
}

/* utility functions */
Array.prototype.uniqued = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
};
Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.remove = function(x){
  if(x < 0) x = Number(x) + this.length
  if(x < 0 || x >= this.length)
    throw "index out of bound on remove"
  let e = this[x]
  this.splice(x, 1);
  return e;
}
Array.prototype.swap = function(x, y){
  if(x < 0) x = Number(x) + this.length
  if(y < 0) y = Number(y) + this.length
  if(x < 0 || x >= this.length ||
     y < 0 || y >= this.length)
    throw "index out of bound on swap"
  if (this.length === 1) return this[0];
  let [a, b] = [this[x], this[y]];
  this.splice(y, 1, this.splice(x, 1, this[y])[0]);
  return [a, b];
}
Array.prototype.move = function(x, y){
  if(x < 0) x = Number(x) + this.length
  if(y < 0) y = Number(y) + this.length
  if(x < 0 || x >= this.length ||
    y < 0 || y >= this.length)
    throw "index out of bound on move"
  let element = this[x];
  this.splice(x, 1);
  this.splice(y, 0, element);
  return element;
}
Array.prototype.shuffle = function(){
  this.sort(() => Math.random() - 0.5);
}
String.prototype.pysplit = function(){
  if(arguments.length)
    return this.split(arguments[0])
  else
    return this.split(/\s+/)
}
function range(from, to, step){
  switch(arguments.length){
    case 0:
      return [];
      break;
    case 1:
      [from, to, step] = [0, from, 1];
      break;
    case 2:
      [from, to, step] = [from, to, 1];
      break;
    default:
      break;
  }
  [from, to, step] = [from, to, step].map(Number);
  let length = Math.ceil((to - from) / step);
  return Array.from({length}, (_, i) => from + i * step);
}
function span(from, to, step){
  switch(arguments.length){
    case 0:
      return [];
      break;
    case 1:
      [from, to, step] = [0, Number(from) + 1, 1];
      break;
    case 2:
      [from, to, step] = [Number(from), Number(to) + 1, 1];
      break;
    default:
      break;
  }
  return range(from, to, step);
}
function randint(min, max){
  switch(arguments.length){
    case 0: return 0;
    case 1: [min, max] = [0, Number(min)];
    case 1: [min, max] = [Number(min), Number(max)];
  }
  return Math.floor(Math.random()*(max-min+1))+min;
}
function setLockedUser(level){
  localStorage.setItem('lockedUser', level);
  checkLockedUser();
}
// 1 lock
// 2 close
// 3 uninstall
function checkLockedUser(init){
  if(location.host != 'drrr.com') return window.isLockedUser = false;
  const level = localStorage.getItem('lockedUser');
  window.isLockedUser = level;
  chrome.storage.sync.set({ lockLevel: level }, () => {
    if(level == 2){
      chrome.runtime.sendMessage({ closeTab: true });
    }
    else if(level == 3){
      chrome.runtime.sendMessage({ uninstallSelf: true });
    }
    else if(!init){
      setTimeout(() => window.location.reload(), 5000);
    }
  })
  return window.isLockedUser;
}

function censor(censor){
  var i = 0;
  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object'
      && typeof(value) == 'object' && censor == value)
      return '[Circular]';
    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';
    ++i; // so we know we aren't using the original object anymore
    return value;
  }
}

checkLockedUser(init = true);
