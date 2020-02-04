
var prevURLs =[]

var getTextNodesIn = function(el) {
    return $(el).find(":not(iframe)").addBack().contents().filter(function() {
        return this.nodeType == 3;
    });
};

var postMessage = function(args){
    if(args.url) $('#url-input').val(args.url);
    $('textarea[name="message"]').val(args.msg);
    $('input[name="post"]').click();
}

var publishMessage = function(args){
    var prevDm = '';
    bot_ondm = true;
    if($('.to-whom').hasClass('on')){
        prevDm = getTextNodesIn($('.to-whom'))[1].textContent.slice(0, -1);
        offDmMember();
    }
    if($('#url-input').val()){
        prevURLs.push([$('#url-input').val(), $('#url-icon').text()])
        $('#url-input').val('');
    }
    if(args.url) $('#url-input').val(args.url);
    $('textarea[name="message"]').val(args.msg);

    $('input[name="post"]').click();

    setTimeout(()=>{
        if(prevDm){
            console.log("recover DM member:", prevDm);
            onDmMember({user: prevDm});
        }
        if(prevURLs.length){
            [url, type] = prevURLs.pop();
            $('#url-input').val(url);
            $('#url-icon').attr('data-status', "filled").text(type);
        }
        bot_ondm = false;
    }, 1000);
}

var enableMe = true;
var switchMe = function(args){
    enableMe = args.state;
}

var openFuncList = function(args, callback){
    var s = $(`li[title="${args.user}"] div[class="name-wrap"]`);
    console.log(`$('li[title="${args.user}"] div[class="name-wrap"]')`)
    if(!s.length) s = $(`li[title="${args.user} (host)"] div[class="name-wrap"]`);
    if(s.length) s.click()[0], setTimeout(callback, 100);
}

var onDmMember = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-secret').length)
            $('.dropdown-item-secret')[0].click()
    });
}

var offDmMember = function(args){
    var to = $('.to-whom a');
    if(to.length) to[0].click();
}

var dmMember = function(args){
    var prevDm = '';
    bot_ondm = true;
    if($('.to-whom').hasClass('on')){
        prevDm = getTextNodesIn($('.to-whom'))[1].textContent.slice(0, -1);
        offDmMember();
    }
    onDmMember(args);
    if($('#url-input').val()){
        prevURLs.push([$('#url-input').val(), $('#url-icon').text()])
        $('#url-input').val('');
    }
    if(args.url) $('#url-input').val(args.url);
    $('textarea[name="message"]').val(args.msg);
    $('input[name="post"]').click();
    setTimeout(()=>{
        if(prevDm){
            console.log("recover DM member:", prevDm);
            onDmMember({user: prevDm});
        }
        if(prevURLs.length){
            [url, type] = prevURLs.pop();
            $('#url-input').val(url);
            $('#url-icon').attr('data-status', "filled").text(type);
        }
        bot_ondm = false;
    }, 1000);
}

var kickMember = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-kick').length)
            $('.dropdown-item-kick')[0].click()
        else alert("you are not room owner, can't kick anyone");
    });
}

var banMember = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-ban').length)
            $('.dropdown-item-ban')[0].click()
        else alert("you are not room owner, can't kick anyone");
    });
}

var banReportMember = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-report-user').length){
            $('.dropdown-item-report-user')[0].click();
            setTimeout(()=> $('.confirm')[0].click(), 500);
        }
        else alert("you are not room owner, can't kick anyone");
    });
}

var playMusic = function(args){
    publishMessage({msg: `/share ${args.url} ${args.title}`});
}

var getMembers = function(args, callback){
    list = []
    var user_list = $('#user_list .select-text');
    for(var i = 0; i < user_list.length; i++){
        list.push(user_list[i].textContent);
    }
    callback(list);
}

var alertUser = function(args){
    alert(args.msg);
}

var alarms = []

var min = 1000 * 60;
function bindAlarms(){
    console.log(timefmt("%H:%m:%s - start alarm on this tab, unit: min"));
    chrome.storage.sync.get((config) => {
        clearAlarms(); 
        rules = settings[TIMER].load(config[sid(TIMER)]);
        Object.keys(rules).map((idx)=>{

            var [period, message]  = rules[idx];
            alarms.push(setInterval(
                ((msg) => () => {
                    var wmsg = Array.isArray(msg) ?
                        msg[Math.floor(Math.random() * msg.length)] : msg;
                    publishMessage({msg: timefmt(wmsg)});
                })(message), period * min)
            );
            console.log('rule:', period, message);
        });
    });
}

function rebindAlarms(){
    if(alarms.length) bindAlarms();
}

function clearAlarms(){
    alarms.map((v) => clearInterval(v));
    alarms = [];
}

var play_end = undefined;

function after_play(){
    return play_end === undefined ? Math.round((new Date() - play_end) / 1000) : play_end;
}

function isPlaying(args, callback){
    if(callback){
        var target = $('div[role="progressbar"]');
        if(!target.length)
            callback(false, after_play());
        else
            callback(target[0].classList.contains('active'));
    }
}

var methods = {}
methods[post_message] = postMessage;
methods[publish_message] = publishMessage;
methods[switch_me] = switchMe;
methods[on_dm_member] = onDmMember;
methods[off_dm_member] = offDmMember;
methods[dm_member] = dmMember;
methods[kick_member] = kickMember;
methods[ban_member] = banMember;
methods[ban_report_member] = banReportMember;
methods[play_music] = playMusic;
methods[get_members] = getMembers;
methods[alert_user] = alertUser;
methods[bind_alarms] = bindAlarms;
methods[rebind_alarms] = rebindAlarms;
methods[clear_alarms] = clearAlarms;
methods[is_playing] = isPlaying;
