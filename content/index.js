var new_script = function(url){
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = url;
    $("head").append(s);
}

var enableMe = true;

var postMessage = function(args){
    $('textarea[name="message"]').val(args.msg);
    $('input[name="post"]').click();
}

var openFuncList = function(args, callback){
    var s = $(`li[title="${args.user}"] div[class="name-wrap"]`);
    if(!s.length) s = $(`li[title="${args.user} (host)"] div[class="name-wrap"]`);
    if(s.length) s.click(), setTimeout(callback, 100);
}

var offDmMember = function(args){
    var to = $('.to-whom a');
    if(to.length) to[0].click();
}

var onDmMember = function(args){
    //$(`li[title*="${args.user}"] div[class="name-wrap"]`).click();
    openFuncList(args, () => 
        $('.dropdown-item-secret')[0].click());
}

var dmMember = function(args){
    onDmMember(args);
    setTimeout(()=> {
        var me = enableMe;
        enableMe = false;
        postMessage(args)
        enableMe = me;
    }, 1500);
}

var getTextNodesIn = function(el) {
    return $(el).find(":not(iframe)").addBack().contents().filter(function() {
        return this.nodeType == 3;
    });
};

var publishMessage = function(args){
    var input = $('textarea[name="message"]');
    var retainText = input.val();
    var retainUser = '';
    if(input.hasClass('state-secret')){
        retainUser = getTextNodesIn($('.to-whom'))[1].textContent.slice(0, -1);
        offDmMember();
    }
    $('textarea[name="message"]').val(args.msg);
    $('input[name="post"]').click();
    setTimeout(()=>{
        if(retainUser) onDmMember({name: retainUser});
        $('textarea[name="message"]').val(retainText);
    }, 1000);
}

var kickMember = function(args){
    openFuncList(args, () =>
        $('.dropdown-item-kick')[0].click());
}

var banMember = function(args){
    //$(`li[title="${args.user}"] div[class="name-wrap"]`).click();
    openFuncList(args, () =>
        $('dropdown-item-ban')[0].click());
}

var banReportMember = function(args){
    //$(`li[title="${args.user}"] div[class="name-wrap"]`).click();
    openFuncList(args, () => {
        $('dropdown-item-report-user')[0].click();
        setTimeout(()=> $('.confirm')[0].click(), 500);
    });
}

var playMusic = function(args){
    postMessage(`/share ${args.url} ${args.title}`);
}

var switchMe = function(args){
    enableMe = args.state;
}

var listenMe = function(){
    if(!$('textarea[name="message"]').hasClass('state-secret')){
        $('input[name="post"]').click(()=>{
            if(enableMe)
                $('textarea[name="message"]').val('/me ' + $('textarea[name="message"]').val())
        })
        $('textarea[name="message"]').keydown(function(e){
            if(!e.ctrlKey && !e.shiftKey && (e.keyCode || e.which) == 13 && enableMe) {
                $('textarea[name="message"]').val('/me ' + $('textarea[name="message"]').val())
            }
        });
    }
}

var getMembers = function(args, callback){
    list = []
    var user_list = $('#user_list .select-text');
    for(var i = 0; i < user_list.length; i++){
        list.push(user_list[i].textContent);
    }
    callback(list);
}

var renew = function(){
    var msgs = ['/me' , '/roll' , '過了十分鐘囉~', '孤獨 ;w;'];
    postMessage({
        msg: msgs[Math.floor(Math.random() * msgs.length)]
    });
}

var welcome = function(latest){

    if(latest.className === "talk join system"){
        var guest = latest.firstElementChild.firstElementChild.innerText;
        var msgs = [`歐 是${guest}` , `${guest} 晚好哇` , `${guest} 安安`, `${guest} 夜安`];
        postMessage({
            msg: msgs[Math.floor(Math.random() * msgs.length)]
        });
    }
}

var handle_talks = function(msg){

    var type = 'unknown', user = 'unknown',
        text = 'unknown', url = 'unknown';
    try{
        if(msg.classList.contains("system")){
            if(msg.classList.contains("me")){
                type = event_me;
                user = $(msg).find('.name').text();
                text = $(msg).contents().filter(function() {
                    return this.nodeType == 3;
                }).get().pop().textContent;
            } 
            else if(msg.classList.contains("music")){
                type = event_music;
                names = $(msg).find('.name');
                /* if it works? */
                [user,text] = names.map((e)=>e.textContent);
                //user = names[0].textContent;
                //text = names[1].textContent;
                console.log(user);
            }
            else{

                [
                    ["leave", event_leave],
                    ["join", event_join],
                    ["new-host", event_newhost]
                ]
                    .forEach(([w, e])=>{
                        if(msg.classList.contains(w)){
                            type = e;
                            user = $(msg).find('.name').text();
                        } 
                    });
            }
        }
        else{
            text = $(msg).find($('.bubble p'))
                .clone().children().remove().end().text();
            var ue = $(msg).find($('.bubble p a'));
            if(ue.length) url = ue.attr('href');
            ue = $(msg).find($('img'));
            if(ue.length) url = ue.attr('data-src');

            var $user = $(msg).find('.name span');
            if($user.length > 1){ // send dm to someone
                console.log($user);
                user = $user[2].textContent;
                type = event_dmto;
            }
            else{
                user = $(msg).find('.name span').text();
                type = msg.classList.contains("secret") ? event_dm : event_msg;
            }
        }
    }
    catch(err){
        alert('err from talks')
        console.log(err);
        throw new Error("Stop execution");
        return;
    }
    console.log(type, user, text, url);

    chrome.runtime.sendMessage({
        type: type,
        user: user,
        text: text,
        url: url
    });
}

$(document).ready(function(){
    listenMe();

    chrome.storage.sync.get((res) => {
        if(res[SWITCH_ME] !== undefined)
            enableMe = res[SWITCH_ME]
        else enableMe = false;
        console.log(enableMe);
        console.log(JSON.stringify(res));
    });

    $('#talks').bind('DOMNodeInserted', function(event) {
        var e = event.target;
        if(e.parentElement.id == 'talks'){
            handle_talks(e);
        }
        else{
            //console.log("fake", e)
        }
    });


    /* invoke submit event */
    $('input[name="post"]').click(()=>{
        setTimeout(function() {  
            chrome.runtime.sendMessage({
                type: event_submit,
                user: 'unknown',
                text: 'unknown',
                url: 'unknown'
            });
            console.log("submmited by click");
        }, 1000);

    })
    $('textarea[name="message"]').keydown(function(e){
        if(!e.ctrlKey && !e.shiftKey && (e.keyCode || e.which) == 13) {
            setTimeout(function() {  
                chrome.runtime.sendMessage({
                    type: event_submit,
                    user: 'unknown',
                    text: 'unknown',
                    url: 'unknown'
                });
                console.log("submmited by enter");
            }, 1000);
        }
    });
    //$('div[role="progressbar"]').attr('class')
    /* invoke newtab event */
    chrome.runtime.sendMessage({
        type: event_newtab,
    });
    console.log("start background moniter");
});

var methods = {}
methods[post_message] = postMessage;
methods[publish_message] = publishMessage;
methods[switch_me] = switchMe;
methods[on_dm_member] = onDmMember;
methods[off_dm_member] = offDmMember;
methods[kick_member] = kickMember;
methods[ban_member] = banMember;
methods[ban_report_member] = banReportMember;
methods[play_music] = playMusic;
methods[get_members] = getMembers;

chrome.runtime.onMessage.addListener((req, sender, callback) => {
    console.log(JSON.stringify(req), "comes the method from background");
    methods[req.fn](req.args, callback);
});
