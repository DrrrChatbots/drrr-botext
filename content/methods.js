
function roomProfile(){
    Profile = {
        "device":"desktop",
        "icon": $("#user_icon").text(),
        "id": $("#user_id").text(),
        "lang":$('html').attr('lang'),
        "name": $('#user_name').text(),
        "tripcode": $('#user_tripcode').text(),
        "uid": $("#user_id").text(),
        "loc": $('.room-title-name').text()
    };
    return Profile;
}

var prevURLs =[], prevTo = '', prevWhom;

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

    bot_ondm = true;
    if($('.to-whom').hasClass('on')){
        prevTo = $('#to-input').val();
        $('#to-input').val('');
        prevWhom = $($('.to-whom')[0]).clone()
    }
    if($('#url-input').val()){
        prevURLs.push([$('#url-input').val(), $('#url-icon').text()])
        $('#url-input').val('');
    }
    if(args.url) $('#url-input').val(args.url);
    $('textarea[name="message"]').val(args.msg);

    $('input[name="post"]').click();

    setTimeout(()=>{
        if(prevTo){
            console.log("recover DM member:", prevTo);
            $('#to-input').val(prevTo)
            prevWhom.find('a').click(()=>{
                $('#to-input').val('');
                prevWhom.removeClass("on").empty();
                $('textarea[name="message"]').removeClass("state-secret");
                $('textarea[name="ext_message"]').removeClass("state-secret");
            })
            $($('.to-whom')[0]).replaceWith(prevWhom);
            console.log("replace");
        }
        if(prevURLs.length){
            [url, type] = prevURLs.pop();
            $('#url-input').val(url);
            $('#url-icon').attr('data-status', "filled").text(type);
        }
        bot_ondm = false;
    }, 500);
}

var enableMe = true;
var switchMe = function(args){
    enableMe = args.state;
}

var openFuncList = function(args, callback){
    var s = $(`li[title="${args.user}"] div[class="name-wrap"]`);
    console.log(`$('li[title="${args.user}"] div[class="name-wrap"]')`)
    if(!s.length) s = $(`li[title="${args.user} (host)"] div[class="name-wrap"]`);
    if(s.length) s.click()[0], setTimeout(callback, 500);
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

var dmMember = function(args, passOn){
    bot_ondm = true;
    if($('.to-whom').hasClass('on')){
        prevTo = $('#to-input').val();
        $('#to-input').val('');
        prevWhom = $($('.to-whom')[0]).clone()
    }

    if(!passOn) onDmMember(args);

    if($('#url-input').val()){
        prevURLs.push([$('#url-input').val(), $('#url-icon').text()])
        $('#url-input').val('');
    }
    if(args.url) $('#url-input').val(args.url);
    $('textarea[name="message"]').val(args.msg);
    $('input[name="post"]').click();
    setTimeout(()=>{
        if(prevTo){
            console.log("recover DM member:", prevTo);
            $('#to-input').val(prevTo)
            prevWhom.find('a').click(()=>{
                $('#to-input').val('');
                prevWhom.removeClass("on").empty();
                $('textarea[name="message"]').removeClass("state-secret");
                $('textarea[name="ext_message"]').removeClass("state-secret");
            })
            $($('.to-whom')[0]).replaceWith(prevWhom);
            console.log("replace");
        }
        if(prevURLs.length){
            [url, type] = prevURLs.pop();
            $('#url-input').val(url);
            $('#url-icon').attr('data-status', "filled").text(type);
        }
        bot_ondm = false;
    }, 1000);
}

var handOverRoom = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-handover').length){
            $('.dropdown-item-handover')[0].click()
            setTimeout(()=> $('.confirm')[0].click(), 500);
            setTimeout(()=> $('.confirm')[0].click(), 1500);
        }
        else alert("you are not room owner, can't handover the room");
    });
}

var kickMember = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-kick').length){
            $('.dropdown-item-kick')[0].click()
            setTimeout(()=> (x=>x.length && x[0].click())($('.confirm')), 1000);
        }
        else alert("you are not room owner, can't kick anyone");
    });
}

var banMember = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-ban').length){
            $('.dropdown-item-ban')[0].click()
            setTimeout(()=> (x=>x.length && x[0].click())($('.confirm')), 1000);
        }
        else alert("you are not room owner, can't kick anyone");
    });
}

var banReportMember = function(args){
    openFuncList(args, () => {
        if($('.dropdown-item-report-user').length){
            $('.dropdown-item-report-user')[0].click();
            setTimeout(()=> (x=>x.length && x[0].click())($('.confirm')), 1000);
        }
        else alert("you are not room owner, can't kick anyone");
    });
}

var playMusic = function(args){
    console.log(`/share ${args.url} ${args.title}`);
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

var disableLeave = false;
var leaveRoom = function(args, callback, force){
    console.log("leave Room");
    if(disableLeave && !force) return;
    update_val = {'leaveRoom': true }
    if(args && args.ret) update_val['jumpToRoom'] = window.location.href;
    if(args && args.jump) update_val['jumpToRoom'] = args.jump;

    chrome.storage.sync.set(
        update_val,
        ()=>{
            var leave = () => {
                $('.do-logout')[0].click();
                setTimeout(()=>{
                    chrome.runtime.sendMessage({
                        notification: {
                            title: '離開失敗，十秒後為您重試（ONCLICK）',
                            msg: '蟲洞即將開啟，請不要亂動',
                            clear: true,
                            pattern: ''
                        }
                    });
                }, 10000);
            };
            setInterval(leave, 10000);
            leave();
            // v useless?
            callback && callback();
        }
    );

}

var keepH = undefined;
var keepRoom = function(args){
    uid = roomProfile().id;
    var keep = function(){
        $('#to-input').val(uid);
        dmMember({msg:'keep'}, true);
    }
    if(args.state){
        keep();
        keepH = setInterval(keep, 600000);
    }
    else{
        clearInterval(keepH);
        $('#to-input').val(uid);
        dmMember({msg:'unkeep'}, true);
    }
}

var cacheProfile = function(args, callback){
    callback(roomProfile());
}

var updateProfile = function(args, callback){
    // useless
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

            var [period, action, arglist]  = rules[idx];
            alarms.push(setInterval(
                ((act, args) => () => {
                    chrome.runtime.sendMessage({
                        type: event_timer,
                        action: act,
                        arglist: args,
                        user: $('#user_name').text(),
                        text: '',
                        url: ''
                    });
                })(action, arglist), period * min)
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

function after_play(end){
    return end === undefined ? end : Math.round((new Date() - end) / 1000);
}

var prev_mstatus = false;
function monit_progressbar(){
    if($('div[role="progressbar"]').length){
        /* music progressbar event */
        var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                var status = mutation.target.classList.contains('active');
                if(status != prev_mstatus){
                    if(status) chrome.runtime.sendMessage({ type: event_musicbeg });
                    else{
                        play_end = new Date();
                        console.log('play_end = ', play_end);
                        cache(undefined, (config)=>{
                            setTimeout(
                                ()=>chrome.runtime.sendMessage({ type: event_musicend }),
                                (getDelay(config) + 3) * 1000);
                        });
                    }
                    console.log(`contains active? ${status}`);
                }
                prev_mstatus = status;
            });
        });
        observer.observe($('div[role="progressbar"]')[0], {
            attributes: true //configure it to listen to attribute changes
        });
    }
}

function isPlaying(args, callback){
    if(callback){
        var target = $('div[role="progressbar"]');
        if(!target.length){
            console.log('play_end:', play_end);
            callback([false]);
        }
        else{
            callback([target[0].classList.contains('active'), after_play(play_end)]);
        }
    }
}

var effects = {
    'snow': 'snowStorm.start()',
    'firework': 'firework.start()',
    'visualizer': 'visualizer.setup(0.8), visualizer.play(0.8)',
    'elevator': 'elevator.start()',
}

function bgEffect(args){
    //$('<script/>', {src: location.baseURL + "/js/extra.min.js"}).appendTo("head"); snowStorm.start();
    console.log(`start ${args.name}`);
    $('head').append(`<script src="//drrr.com/js/extra.min.js"></script>`).promise().then(
        ()=>$('head').append(`<script>setTimeout(()=>${effects[args.name]}, 2000);</script>`)
    );
}

var methods = {}
methods[post_message] = postMessage;
methods[publish_message] = publishMessage;
methods[switch_me] = switchMe;
methods[on_dm_member] = onDmMember;
methods[off_dm_member] = offDmMember;
methods[dm_member] = dmMember;
methods[kick_member] = kickMember;
methods[handover_room] = handOverRoom;
methods[ban_member] = banMember;
methods[ban_report_member] = banReportMember;
methods[play_music] = playMusic;
methods[get_members] = getMembers;
methods[alert_user] = alertUser;
methods[bind_alarms] = bindAlarms;
methods[rebind_alarms] = rebindAlarms;
methods[clear_alarms] = clearAlarms;
methods[is_playing] = isPlaying;
methods[leave_room] = leaveRoom;
methods[keep_room] = keepRoom;
methods[cache_profile] = cacheProfile;
methods[update_profile] = updateProfile;
methods[bg_effect] = bgEffect;

