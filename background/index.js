
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
                if(n.match(new RegExp(req.clearNotes)))
                    chrome.notifications.clear(n);
        })
    }
    else if(req && req.notification){
        chrome.notifications.create(
            req.notification.url ? req.notification.url : undefined,
            {
                type: "basic",
                iconUrl: '/icon.png',
                title: req.notification.title,
                message: req.notification.msg 
            });
        if(req.notification.url)
            chrome.notifications.onClicked.addListener(((exit)=>function(notificationId) {
                console.log(notificationId);

                if(exit){
                    var lambda = function(){
                        $.ajax({
                            type: "POST",
                            data: {'leave':'leave'},
                            url: 'https://drrr.com//room',
                            dataType: 'json',
                            success: function(data){
                                alert('WTF', data);
                                if(data.status && data.status == "403"){


                                }
                                else{
                                    chrome.storage.sync.set({'jumpToRoom': notificationId }); 
                                }
                            },
                            error: function(data){
                                console.log(data)
                                if(data.status && data.status == "403"){
                                    if(!error403){
                                        error403++;
                                        chrome.notifications.getAll((notes)=>{
                                            for(n in notes) chrome.notifications.clear(n);
                                            chrome.notifications.create({
                                                type: "basic",
                                                iconUrl: '/icon.png',
                                                title: '離開失敗，十秒後為您重試',
                                                message: '蟲洞即將開啟，請不要亂動'
                                            });
                                            setTimeout(lambda, 10000);

                                        });
                                    }
                                }
                                else {
                                    chrome.storage.sync.set({'jumpToRoom': notificationId });
                                    error403 = 0;
                                }
                            }
                        })
                    }
                    lambda();
                } else chrome.tabs.update({
                    url: notificationId
                });
                //chrome.notifications.clear(notificationId);
                chrome.notifications.getAll((notes)=>{
                    for(n in notes)
                        if(n.startsWith('https://drrr.com/room/?id='))
                            chrome.notifications.clear(n);
                })
            })(req.notification.exit));  
    }
    else if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){ 
        console.log(req);
        console.log(JSON.stringify(sender))
        chrome.storage.sync.get((config) => {
            var reg_funcs = reg_table[req.type] || [];
            for(handle of reg_funcs)
                handle(req, callback, config, sender)
            if(callback) callback("done.");
        });   
    }
    else if(sender.url.match(new RegExp('https://drrr.com/lounge'))){ 

    }
})
