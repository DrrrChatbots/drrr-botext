

function get_music(keyword, callback){
    var source = '易';
    if(keyword) {
        music_api(keyword, callback, {
            log: console.log, 
            error: (msg) => sendTab({ fn: publish_message, args: { msg: msg } }),
            ajax: ajax
        }, source);
    } else console.log("please input keyword"); 
}

function lstMusic(config){
    var list = config[PLAYLIST];
    if(list && list.length){
        msg = Object.keys(list).map(
            (idx) => `[${idx}] ${ommited_name(list[idx].name, list[idx].singer)}`
        ).join('\n');
    } else msg = 'EMPTY PLAYLIST'
    console.log(msg);
    sendTab({
        fn: publish_message,
        args:{
            msg: msg
        }
    });
}

function pndMusic(config, song){
    var publish = (msg) => sendTab({ fn: publish_message, args: { msg: msg } });
    if(song.length){
        sendTab({
            fn: is_playing,
        }, undefined, (active, after) => {
            if(active)
                add_search(get_music.bind(null, song), false, true);
            else{
                if(config[PLAYLIST] && config[PLAYLIST].length){
                    add_search(get_music.bind(null, song), false, true);
                    if(after === undefined || after > getDelay() + 5)
                        setTimeout(()=> play_next(config, publish), 1000);
                    
                }
                else if(after === undefined || after > getDelay() + 5)
                    play_search(get_music.bind(null, song), publish);
                else
                    add_search(get_music.bind(null, song), false, true);
            }
        });
    }
    else lstMusic(config);
}
