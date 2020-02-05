
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
                amazingTimeout(wake_check, getDelay(config) * 1000);
            }
        },
    }
);

chrome.runtime.onMessage.addListener((req, sender, callback) => { 
    if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){ 
        console.log(req);
        console.log(JSON.stringify(sender))
        chrome.storage.sync.get((config) => {
            var reg_funcs = reg_table[req.type] || [];
            for(handle of reg_funcs)
                handle(req, callback, config, sender)
            if(callback) callback("done.");
        });   
    }
})
