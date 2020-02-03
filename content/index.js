
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
                user = names[0].textContent;
                text = names[1].textContent;
            }
            else{
                [["leave", event_leave], ["join", event_join], ["new-host", event_newhost]]
                    .forEach(([w, e]) => {
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

var logout = false;
function handle_exit(){
    $('.do-logout').click(function(){
        logout = true;
    });

    function confirmExit(){

        if(logout){
            if(alarms.length) // for alarms only
                chrome.runtime.sendMessage({
                    type: event_logout,
                    user: 'unknown',
                    text: 'unknown',
                    url: 'unknown'
                });
            else console.log("logout without alarms");
        }
        else{
            if(alarms.length){
                chrome.runtime.sendMessage({
                    type: event_exitalarm,
                    user: 'unknown',
                    text: 'unknown',
                    url: 'unknown'
                });
                // return "are you sure exit?";
            }
            else console.log("exittab without alarms");
            //type: event_exittab
        }
    }
    window.onbeforeunload = confirmExit;
    //window.onunload = confirmExit;
}


var bot_ondm = false;
var ext_click = 0;
function make_extinputs(){

    var orgmsg = $('textarea[name="message"]')
    var extmsg = orgmsg.clone().attr("name", "ext_message");
    orgmsg.after(extmsg);
    orgmsg.wrap('<div style="display:none"></div>');

    console.log("whom length:", $('.to-whom'));

    $('.to-whom').on('DOMSubtreeModified',function(e){
        console.log($(this).hasClass('on'));
        if(!bot_ondm){
            if($(this).hasClass('on'))
                extmsg.addClass('state-secret');
            else extmsg.removeClass('state-secret');
        }
    });

    var orgpst = $('input[name="post"]');
    var extpst = orgpst.clone().attr("name", "ext_post").attr('type', 'button');
    orgpst.after(extpst);
    orgpst.wrap('<div style="display:none"></div>');

    (new MutationObserver(function(mutations){
        mutations.forEach(function(mutation) {
            if(ext_click){
                extpst.val(mutation.target.value);
                ext_click--;
            }
        });
    })).observe(orgpst[0], { attributes: true });

    extpst.click(function(){
        ext_click = 2;
        var cmd = '';
        if(!exgmsg.hasClass('state-secret') &&
            $('#url-icon').attr('data-status') !== 'filled' &&
            enableMe && !extmsg.val().match(/^\/\w/)) cmd = '/me ';

        $('textarea[name="message"]').val(cmd + extmsg.val()), extmsg.val('');

        $('input[name="post"]').click();
        setTimeout(function() {  
            chrome.runtime.sendMessage({
                type: event_submit,
                user: 'unknown',
                text: 'unknown',
                url: 'unknown'
            });
            console.log("submmited by click");
        }, 1000);
    });

    extmsg.on('keydown', function(e){
        setTimeout(()=>$(this).next().text($(this).attr('maxlength') - $(this).val().length), 50);
        if(!e.ctrlKey && !e.shiftKey && (e.keyCode || e.which) == 13) {
            var cmd = '';
            if(!$(this).hasClass('state-secret') && 
                $('#url-icon').attr('data-status') !== 'filled' &&
                enableMe && !extmsg.val().match(/^\/\w/)) cmd = '/me ';

            e.preventDefault();
            if(!$(this).val().match(/^\s*$/)){
                orgmsg.val($(this).val()), $(this).val('');
                setTimeout(function() {  
                    chrome.runtime.sendMessage({
                        type: event_submit,
                        user: 'unknown',
                        text: 'unknown',
                        url: 'unknown'
                    });
                    console.log("submmited by enter");
                }, 1000);
                orgpst.click();
            }
        }
    });
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
                        chrome.runtime.sendMessage({ type: event_musicend });
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

$(document).ready(function(){

    chrome.storage.sync.get((res) => {
        if(res[SWITCH_ME] !== undefined)
            enableMe = res[SWITCH_ME]
        else enableMe = false;
        console.log(enableMe);
        console.log(JSON.stringify(res));
    });

    $('#talks').bind('DOMNodeInserted', function(event) {
        var e = event.target;
        if(e.parentElement.id == 'talks')
            handle_talks(e);
    });

    make_extinputs(); 
    monit_progressbar();
    /* invoke newtab event */
    chrome.runtime.sendMessage({
        type: event_newtab
    });
    console.log("start background moniter new"); 
    handle_exit();
});

chrome.runtime.onMessage.addListener((req, sender, callback) => {
    console.log(JSON.stringify(req), "comes the method from background");
    methods[req.fn](req.args, callback);
});
