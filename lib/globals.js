
event_me        = "me"
event_music     = "music"
event_leave     = "leave"
event_join      = "join"
event_newhost   = "new-host"
event_msg       = "msg"
event_dm        = "dm"
event_dmto      = "dmto"
event_submit    = "submit"
event_newtab    = "newtab"
event_exittab   = "exittab"
event_exitalarm = "exitalarm"
event_logout    = "logout"
event_musicbeg  = "musicbeg"
event_musicend  = "musicend"

event_events = [event_me      , event_music   , event_leave   , event_join    , event_newhost , event_msg     , event_dm      , event_dmto    , event_submit  , event_newtab  , event_exittab , event_exitalarm , event_logout  , event_musicbeg , event_musicend]

action_msg = "msg"
action_dm  = "dm"
action_me  = "me"
action_kick = "kick"
action_plym = "plym"
action_addm = "addm"
action_delm = "delm"
action_lstm = "lstm"
action_nxtm = "nxtm"
action_pndm = "pndm"

action_actions = [action_msg , action_dm  , action_me  , action_kick , action_plym , action_addm , action_delm , action_lstm , action_nxtm, action_pndm]



LABEL         = "label"
SELECT        = "select"
SWITCH        = "switch"
BUTTON        = "button"
PACK          = "pack"
MODAL         = "modal"
TEXTAREA      = "textarea"
class_map     = {}
class_map[LABEL] = 'bs-label'
class_map[SWITCH] = 'bs-switch'
class_map[SELECT] = 'bs-select'
class_map[BUTTON] = 'bs-button'
class_map[PACK] = 'bs-pack'
class_map[MODAL] = 'bs-modal'
class_map[TEXTAREA] = 'bs-textarea'

post_message = "post_message"
publish_message = "publish_message"
switch_me = "switch_me"
on_dm_member = "on_dm_member"
off_dm_member = "off_dm_member"
dm_member = "dm_member"
kick_member = "kick_member"
ban_member = "ban_member"
ban_report_member = "ban_report_member"
play_music = "play_music"
get_members = "get_members"
alert_user  = "alert_user"
bind_alarms = "bind_alarms"
rebind_alarms = "rebind_alarms"
clear_alarms = "clear_alarms"
is_playing = "is_playing"

WELCOME_SETTING = "welcome_setting"
WELCOME_TERMS   = "welcome_terms"

TIMER      = "Timer"
WELCOME    = "Welcome"
WHITELIST  = "WhiteList"
BLACKLIST  = "BlackList"
HISTORY    = "ChatHistory"
BANABUSE   = "BanAbuse"
EVENTACT   = "EventAction"

SWITCH_ME  = "switch_me"
SWITCH_DM  = "switch_dm"
SWITCH_TIMER = "switch_timer"
SWITCH_WELCOME = "switch_welcome"
SWITCH_HISTORY = "switch_history"
SWITCH_WHITELIST = "switch_whitelist"
SWITCH_BLACKLIST = "switch_blacklist"
SWITCH_BANABUSE = "switch_banabuse"
SWITCH_EVENTACT = "switch_eventaction"
DM_USERNAME = "dm_username"
PLAYLIST = "playlist"
MUSIC_MODE = 'music_mode'
SINGLE_MODE = 'glyphicon-headphones'
ALBUM_MODE = 'glyphicon-cd'
MUSIC_DELAY = 'music_delay'

function getDelay(config){
    return config[MUSIC_DELAY] === undefined ? 34 : config[MUSIC_DELAY];
}

is = {
    in: (array) => (v) => array.includes(v),
    number: (v) => typeof v === 'number',
    string: (v) => typeof v === 'string',
    strary: (v) => Array.isArray(v) && v.every(is.string),
    array:  (v) => Array.isArray(v),
    regex: (v) => new RegExp(v)
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

function rule_store(text){
    text.trim().split("\n").map((r)=>JSON.parse('[' + r + ']'));
    return JSON.parse(
        "[" + text.trim().split("\n").map(
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
`600, "every 10 mins report once!"
300, ["It's a Report Message", "Now is %H:%m!"]`,
        validate: (data) => {
            var d = rule_store(data);
            d.map((v) => v[0]).every(
                info(is.number,
                    (v, idx) => `rule ${idx + 1}, cell[1]: "${v}" should be a number`));
            d.map((v) => v[1]).every(
                info((v) => is.string(v) || is.strary(v),
                    (v, idx) => `rule ${idx + 1}, cell[2]: "${v}" should be a string or [string, ...]`));
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
        store: rule_store 
    },
    [WHITELIST]: {
        desc: '<p>use regular expression to create whitelist</p>',
        def_conf:
`.*cat
lambda.*
神秘.*`,
        validate: (d) => d.split("\n").every(is.regex),
        plain: (d) => d,
        load: (d) => d.split("\n"),
        store: (d) => d.trim().replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [BLACKLIST]: {
        desc: '<p>use regular expression to create blacklist</p>',
        def_conf:
`otoko.*
.*机器人.*|.*機器人.*
小冰|小氷|测试姬`,
        validate: (d) => d.split("\n").every(is.regex),
        plain: (d) => d,
        load: (d) => d.split("\n"),
        store: (d) => d.trim().replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [BANABUSE]: {
        desc: 'ban abuse',
        def_conf:
`Any word you consider as abuse`,
        validate: (d) => d.split("\n").every(is.regex),
        plain: (d) => d,
        load: (d) => d.split("\n"),
        store: (d) => d.trim().replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [EVENTACT]: {
        desc: `<p>custom your event actions</p>`,
        def_conf:
`"msg", "", "^/play", "plym", ["$args"]
"msg", "", "^/next", "nxtm", []
"msg", "", "^/add", "addm", ["$args"]
"msg", "", "^/del", "delm", ["$1"]
"msg", "", "^/list", "lstm", []
"msg", "", "^/pending", "pndm", ["$args"]`,
        validate: (data) => {
            var d = rule_store(data);
            d.map((v) => v[0]).every(
                info(is.in(event_events), (v, idx) => `rule ${idx + 1}, cell[1]: "${v}" should in ${JSON.stringify(event_events)}`))
            d.map((v) => v[1]).every(is.regex)
            d.map((v) => v[2]).every(is.regex)
            d.map((v) => v[3]).every(
                info(is.in(action_actions), (v, idx) => `rule ${idx + 1}, cell[4]: "${v}" should in ${JSON.stringify(action_actions)}`))
            d.map((v) => v[4]).every(
                info(is.array, (v, idx) => v ? `rule ${idx + 1}, cell[5]: "${v}" should be [...]` : `rule ${idx + 1}, cell[5]: you need a [...] as arguments`))
        },
        plain: rule_plain,
        load: (d) => d,
        store: rule_store 
    },
}

/* helper functions */
function roomTabs(f){
    chrome.tabs.query({
        url: 'https://drrr.com/room/*'
    }, (tabs) => f(tabs));
}

function sendTab(data, except, callback){
    roomTabs((tabs) => {
        if(tabs.length)
            chrome.tabs.sendMessage(tabs[0].id, data, callback);
        else if(except) except();
    });
}

function bcastTabs(data){
    roomTabs((tabs) => 
        tabs.forEach((tab) =>
            chrome.tabs.sendMessage(tab.id, data)));
}

function push_value(entry, val, callback){
    chrome.storage.sync.get((config)=>{
        var list = config[entry];
        if(!list) list = [];
        list.push(val);
        chrome.storage.sync.set({
            [entry]: list
        });
        if(callback) callback();
    });
}

function cache(config, callback){
    if(config) callback(config);
    else chrome.storage.sync.get((config) => {
        callback(config);
    });
}
