
/* require global.js utility.js */

function ajax(request){
    $.ajax(request);
}

new Handler("music", [],
    {
        [event_musicend]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config) 
        },
    }
);

/*
new Handler("msg event", [],
    {
        [event_join]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config) 
        },
        [event_leave]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config) 
        },
        [event_newhost]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config) 
        },
        [event_me]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config) 
        },
        [event_msg]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config) 
        },
        [event_dm]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config)
        },
        [event_submit]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config)
        },
        [event_dmto]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config)
        },
        [event_music]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config)
        },
        [event_musicend]: {
            precond: (config, uis) => config[MUSIC_MODE] == ALBUM_MODE,
            onevent: (req, callback, config, uis, sender) => play_next(config)
        },
    }
);
*/

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
