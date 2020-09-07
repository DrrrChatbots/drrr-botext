
/* require global.js utility.js */

function amazingTimeout(func, ms){
    if(ms){
        const at = 6000;
        console.log('amazing ...')
        period = ms <= at ? ms : at;
        setTimeout(function(){
            amazingTimeout(func, ms - period);
        }, period);
    }
    else{
        func();
        console.log('amazing done.')
    }
}

new Handler("music", [],
    {
        [event_musicend]: { /* handle config[MUSIC_MODE] be undefined slightly */
            precond: (config, uis) => config[MUSIC_MODE] !== SINGLE_MODE && !empty_list(config, PLAYLIST),
            onevent: (req, callback, config, uis, sender) => {
                function wake_check(){
                    sendTab({
                        fn: is_playing,
                    }, undefined, ([active, after]) => {
                        if(!active){
                            if(after === undefined || after > getDelay(config) - 5)
                                play_next(config)
                            else
                                amazingTimeout(wake_check, (getDelay(config) - after + 5) * 1000);
                        }
                    });
                }
                console.log("wait for delay", getDelay(config), 's');
                amazingTimeout(wake_check, 1000);
            }
        },
    }
);

function generate_notification(req){
    var func = () =>
        chrome.notifications.create(
            req.notification.url || req.notification.sel || undefined, {
                type: "basic",
                iconUrl: '/icon.png',
                title: req.notification.title,
                message: req.notification.msg
            }
        );

    if(req.notification.clear){
        chrome.notifications.getAll((notes)=>{
            for(n in notes)
                if(n.match(new RegExp(req.notification.pattern)))
                    chrome.notifications.clear(n);
            func();
        })
    }
    else func();

    if(req.notification.url)
        chrome.notifications.onClicked.addListener(
            ((exit, url)=>
                function(toURL) {
                    console.log(toURL);
                    if(toURL !== url) return;
                    if(exit){
                        sendTab({ fn: leave_room, args: {jump: toURL} });
                    } else chrome.tabs.update({
                        url: toURL
                    });
                    chrome.notifications.getAll((notes)=>{
                        for(n in notes)
                            if(n.startsWith('https://drrr.com/room/?id='))
                                chrome.notifications.clear(n);
                    });
                }
            )(req.notification.exit, req.notification.url));
    else if(req.notification.sel)
        chrome.notifications.onClicked.addListener(
            ((sel)=>
                function(toSel) {
                    console.log(toSel);
                    if(toSel !== sel) return;
                    sendTab({ fn: scroll_to, args: {sel: sel}}, undefined, undefined, undefined, 'https://drrr.com/lounge/*');
                }
            )(req.notification.sel));
}

var error403 = 0;
chrome.runtime.onMessage.addListener((req, sender, callback) => {
    console.log(sender);
    if(req && req.jumpto){
        if(sender.tab && sender.tab.id)
            chrome.tabs.update(sender.tab.id, { url: req.jumpto });
        else chrome.tabs.update({ url: req.jumpto });
    }
    else if(req && req.clearNotes){
        chrome.notifications.getAll((notes)=>{
            for(n in notes)
                if(n.match(new RegExp(req.pattern)))
                    chrome.notifications.clear(n);
        })
    }
    else if(req && req.saveCookie){
        chrome.cookies.getAll({
            url : 'https://drrr.com'
        }, function(cookies){
            chrome.storage.sync.set({
                'profile': req.profile,
                'cookie':cookies
            }, ()=> callback && callback());
        });
    }
    else if(req && req.setCookies){
        setCookies(req.cookies, callback);
    }
    else if(req && req.notification){
        generate_notification(req);
    }
    else if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){
        console.log(req);
        console.log(JSON.stringify(sender))
        chrome.storage.sync.get((config) => {
            var reg_funcs = reg_table[req.type] || [];
            for(handle of reg_funcs)
                handle(req, callback, config, sender)
            if(config['select_game'])
                import(`/game/${game_mapping[config['select_game']]}`).then(
                    (module)=>{
                        module.event_action && module.event_action(req.type, req);
                    }
                )

            if(callback) callback("done.");
        });
    }
    else if(sender.url.match(new RegExp('https://drrr.com/lounge'))){

    }
})
