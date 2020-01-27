event_me      = "me"
event_music   = "music"
event_leave   = "leave"
event_join    = "join"
event_newhost = "new-host"
event_msg     = "msg"
event_dm      = "dm"
event_dmto    = "dmto"
event_submit  = "submit"
event_newtab  = "newtab"
event_exittab = "exittab"
event_exitalarm = "exitalarm"
event_logout  = "logout"


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
kick_member = "kick_member"
ban_member = "ban_member"
ban_report_member = "ban_report_member"
play_music = "play_music"
get_members = "get_members"
alert_user  = "alert_user"
bind_alarms = "bind_alarms"
rebind_alarms = "rebind_alarms"
clear_alarms = "clear_alarms"

WELCOME_SETTING = "welcome_setting"
WELCOME_TERMS   = "welcome_terms"

TIMER      = "Timer"
WELCOME    = "Welcome"
WHITELIST  = "WhiteList"
BLACKLIST  = "BlackList"
HISTORY    = "ChatHistory"
BANABUSE   = "BanAbuse"
MSGEVENTS   = "MsgEvents"

SWITCH_ME  = "switch_me"
SWITCH_DM  = "switch_dm"
SWITCH_TIMER = "switch_timer"
SWITCH_WELCOME = "switch_welcome"
SWITCH_HISTORY = "switch_history"
SWITCH_WHITELIST = "switch_whitelist"
SWITCH_BLACKLIST = "switch_blacklist"
SWITCH_BANABUSE = "switch_banabuse"
SWITCH_MSGEVENTS = "switch_msgevents"
DM_USERNAME = "dm_username"
PLAYLIST = "playlist"
SINGLE_MODE = 'glyphicon-headphones'
ALBUM_MODE = 'glyphicon-cd'


is = {
    number: (v) => typeof v === 'number',
    string: (v) => typeof v === 'string',
    strary: (v) => Array.isArray(v) && v.every(is.string),
    regex: (v) => new RegExp(v)
}

function info(guard, msg){
    return (v) => {
        if(!guard(v)) throw msg(v);
    }
}

function rule_plain(rules){
    return rules.map((r) =>
        `${JSON.stringify(r[0])}, ${JSON.stringify(r[1])}`).join('\n');
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
`100000, "every 10 mins report once!"
50000, ["It's a Report Message", "Now is HH:MM!"]
`,
        validate: (data) => {
            var d = rule_store(data);
            d.map((v) => v[0]).every(
                info(is.number,
                    (v) => `"${v}" should be a number`));
            d.map((v) => v[1]).every(
                info((v) => is.string(v) || is.strary(v),
                    (v) => `"${v}" should be a string or [string, ...]`));
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
                info(is.string, (v) => `"${v}" should be string`))
            d.map((v) => v[0]).every(is.regex)
            d.map((v) => v[1]).every(
                info((v) => is.string(v) || is.strary(v),
                    (v) => `"${v}" should be string or [string, ...]`));

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
        store: (d) => d.replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [BLACKLIST]: {
        desc: '<p>use regular expression to create blacklist</p>',
        def_conf:
`otoko.*
.*机器人.*|.*機器人.*
小冰|小氷`,
        validate: (d) => d.split("\n").every(is.regex),
        plain: (d) => d,
        load: (d) => d.split("\n"),
        store: (d) => d.replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [BANABUSE]: {
        desc: 'ban abuse',
        def_conf:
`Any word you consider as abuse`,
        validate: (d) => d.split("\n").every(is.regex),
        plain: (d) => d,
        load: (d) => d.split("\n"),
        store: (d) => d.replace(/^\s*[\r\n]|\n^\s*$/gm, '')
    },
    [MSGEVENTS]: {
        desc: `<p>custom your event handlers</p>`,
        def_conf:
`"/play ", ".*", "playKeyword", "$[2-]"`,
        validate: (data) => {
            var d = rule_store(data);
            d.map((v) => v[0]).every(
                info(is.string, (v) => `"${v}" should be string`))
            d.map((v) => v[0]).every(is.regex)
            d.map((v) => v[1]).every(
                info(is.string, (v) => `"${v}" should be string`))
            d.map((v) => v[1]).every(is.regex)
            d.map((v) => v[2]).every(
                info(is.string, (v) => `"${v}" should be string`))
            d.map((v) => v[3]).every(
                info(is.string, (v) => `"${v}" should be string`))
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

function sendTab(data, except){
    roomTabs((tabs) => {
        if(tabs.length)
            chrome.tabs.sendMessage(tabs[0].id, data)
        else if(except) except();
    });
}

function bcastTabs(data){
    roomTabs((tabs) => 
        tabs.forEach((tab) =>
            chrome.tabs.sendMessage(tab.id, data)));
}

function ommited_name(name, length = 20){
    return name.substring(0, length)
         + (name.length >= length ? '...' : '');
}
