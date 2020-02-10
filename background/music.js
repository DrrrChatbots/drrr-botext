

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
        }, undefined, ([active, after]) => {
            if(active)
                add_search(get_music.bind(null, song), false, true);
            else{
                if(config[PLAYLIST] && config[PLAYLIST].length){
                    add_search(get_music.bind(null, song), false, true);
                    if(after === undefined || after > getDelay(config) + 5)
                        setTimeout(()=> play_next(config, publish), 1000);
                    
                }
                else if(after === undefined || after > getDelay(config) + 5){
                    play_search(get_music.bind(null, song), publish);
                    console.log('after is:', after, ' > ', getDelay(config) + 5, 'play');
                }
                else{
                    add_search(get_music.bind(null, song), false, true);
                    console.log('after is:', after, ' < ', getDelay(config) + 5, 'add');
                }
            }
        });
    }
    else lstMusic(config);
}

function schMusic(config, idx, keyword){
    console.log("search music;");
    if(!keyword) [idx, keyword] = [undefined, idx];
    if(idx){
        play_search(
            get_music.bind(null, keyword), 
            (msg) => sendTab({ 
                fn: publish_message, 
                args: { msg: msg } 
            }), idx
        )
    }
    else{
        get_music(keyword, (keyword, source, data) => {
            var msg0 = '', msg1 = '', songs = api[source].songs(data);
            for(var i = 0; i < 5; i++)
                if(songs[i]) msg0 += 
                    `[${i}] ${ommited_name(
                        api[source].name(data, i),
                        api[source].singer(data, i), 28)}\n`;
            for(var i = 5; i < 10; i++)
                if(songs[i]) msg1 +=
                    `[${i}] ${ommited_name(
                        api[source].name(data, i),
                        api[source].singer(data, i), 28)}\n`;
            if(msg1){
                sendTab({ 
                    fn: publish_message, 
                    args: { msg: msg1 } 
                });
            }
            if(msg0){
                setTimeout(function() {
                    sendTab({
                        fn: publish_message,
                        args: { msg: msg0 } 
                    });
                }, 1000);
            }
        });
    }
}
