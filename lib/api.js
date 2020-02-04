function netease_api_url(keyword){
    return `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1&offset=0&total=true&limit=10`
}

function netease_songs(data){
    if(data.code != 200 || !data.result || !data.result.songs || !data.result.songs.length)
        throw `易: No search result... QAQ`;
    return data['result']['songs'];
}

function netease_link(data, idx = 0){
    return `https://music.163.com/#/song?id=${netease_songs(data)[idx]['id']}`
}

function netease_name(data, idx = 0){
    return netease_songs(data)[idx]['name'];
}

function netease_singer(data, idx = 0){
    return netease_songs(data)[idx]['artists'].map((m)=>m['name']).join(',');
}

function baidu_api_url(keyword){
    return `http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.search.catalogSug&format=json&query=${keyword}`;
}

function baidu_songs(data){
    if(data.error_code == 22001 || !data['song'].length)
        throw `千: No search result... QAQ`;
    return data['song'];
}

function baidu_link(data, idx = 0){
    return `http://music.taihe.com/song/${baidu_songs(data)[idx]['songid']}`;
}

function baidu_name(data, idx = 0){
    return baidu_songs(data)[idx]['songname'];
}

function baidu_singer(data, idx = 0){
    return baidu_songs(data)[idx]['artistname'];
}

var api = {
    '易': {
        url: netease_api_url,
        link: netease_link,
        name: netease_name,
        songs: netease_songs,
        singer: netease_singer
    },
    '千': {
        url: baidu_api_url,
        link: baidu_link,
        name: baidu_name,
        songs: baidu_songs,
        singer: baidu_singer
    }
}

function nextkey(name, dict){
    var keys = Object.keys(dict);
    var idx = keys.indexOf(name);
    idx = (idx + 1) % keys.length;
    return keys[idx];
}

var max_len = 17;
function ommited_name(name, singer, length = max_len){
    if(name.length + singer.length < max_len)
        return `${name} - ${singer}`
    return name.substring(0, length)
        + (name.length >= length ? '...' : '');
}

function music_ajax(keyword, callback, funcs, src, begsrc){
    if(begsrc && begsrc === src)
        funcs.error("all source unavailiable");
    else{
        //funcs.log(`getting src ${src}`);
        funcs.ajax({
            type: "GET",
            url: api[src].url(keyword),
            dataType: 'json',
            success: function(data){
                try{ callback(keyword, src, data); }
                catch(e){
                    funcs.log(e);
                    music_ajax(
                        keyword, callback,
                        funcs, nextkey(src, api),
                        begsrc ? begsrc : src);
                }
            },
            error: function(jxhr){
                funcs.log("Fetch song failed, report developer:\n"
                    + JSON.stringify(jxhr));
            }
        });
    }
}

function music_api(keyword, callback, funcs, source){
    if(!funcs['log']) funcs.log = console.log;
    if(!funcs['error']) funcs.error = funcs.log;
    if(funcs['ajax'])
        music_ajax(keyword, callback, funcs, source);
    else
        funcs.log('please specific the ajax function');
}

/* implement get_music by music_api in popup and background */
function playMusic(title, url, log = console.log){
    sendTab({
        fn: play_music,
        args: {
            title: title,
            url: url
        }
    }, () => log('no active drrr.com chatroom tab'))
}

function add_song(list, name, link, singer, mute = false, publish = false){
    push_value(
        list,
        {
            name: name,
            link: link,
            singer: singer
        }
    );
    if(!mute) chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `${list.toUpperCase()} UPDATE`,
        message: `${name} - ${singer} is added to ${list}`
    });
    if(publish){
        sendTab({
            fn: publish_message,
            args: { msg: `${name} - ${singer} is added to ${list}` }
        })
    }
}

function del_song(conf_name, idx, callback, mute = false, publish = false){
    chrome.storage.sync.get((config) => {
        var succ = true;
        var list = config[conf_name];
        if(list && idx < list.length){
            var name = list[idx].name;
            var singer = list[idx].singer;
            list.splice(idx, 1);
            chrome.storage.sync.set({
                [conf_name]: list
            });
            if(!mute) chrome.notifications.create({
                type: "basic",
                iconUrl: '/icon.png',
                title: `${conf_name.toUpperCase()} UPDATE`,
                message: `${name} - ${singer} is deleted from ${conf_name}`
            });
            if(callback) callback();
            if(publish){
                sendTab({
                    fn: publish_message,
                    args: { msg: `${name} - ${singer} is deleted from ${conf_name}` }
                })
            }
        }
        else{
            if(!mute) chrome.notifications.create({
                type: "basic",
                iconUrl: '/icon.png',
                title: `UPDATE FAILED`,
                message: `delete range out of bound`
            });
            if(callback) callback();
            if(publish){
                sendTab({
                    fn: publish_message,
                    args: { msg: `delete range out of bound` }
                })
            }
        }
    });
}

function play_next(config, log = console.log, callback){
    cache(config, (config)=>{
        if(!empty_list(config, PLAYLIST)){
            var song = config[PLAYLIST][0];
            playMusic(
                song.name,
                song.link
            ); 
            del_song(PLAYLIST, 0, callback, true);
        } else { log("EMPTY PLAYLIST"); }
    });
}

function play_search(get_music, log){
    get_music((keyword, source, data) => {
        playMusic(keyword, api[source].link(data), log); 
    });
}

function add_search(get_music, mute, publish){
    get_music((keyword, source, data) => {
        add_song(
            PLAYLIST,
            api[source].name(data),
            api[source].link(data),
            api[source].singer(data),
            mute, publish
        );
    });
}
