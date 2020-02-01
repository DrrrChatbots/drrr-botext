
/* require global.js utility.js */

new Handler("music", [],
    {
        [event_musicend]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => {
                setTimeout(()=>play_next(config), getDelay(config) * 1000);
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
