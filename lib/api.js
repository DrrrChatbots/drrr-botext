function netease_api_url(keyword){
    return `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1&offset=0&total=true&limit=10`
}

function netease_songs(data){
    if(data.code != 200 || !data.result.songs || !data.result.songs.length)
        throw `No search result... QAQ`;
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
        throw `No search result... QAQ`;
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

function ommited_name(name, singer, length = 20){
    if(name.length + singer.length < 20)
        return `${name} - ${singer}`
    return name.substring(0, length)
        + (name.length >= length ? '...' : '');
}

function music_ajax(keyword, callback, funcs, src, begsrc){
    if(begsrc && begsrc === src)
        funcs.log("all source unavailiable");
    else{
        funcs.log(`getting src ${src}`);
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

function add_song(name, link, singer, mute = false){
    push_value(
        PLAYLIST,
        {
            name: name,
            link: link,
            singer: singer
        }
    );
    if(!mute) chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `PLAYLIST UPDATE`,
        message: `${name} - ${singer} is added to playlist`
    });
}

function del_song(idx, mute = false){
    chrome.storage.sync.get((config) => {
        var list = config[PLAYLIST];
        var name = list[idx].name;
        var singer = list[idx].singer;
        list.splice(idx, 1);
        chrome.storage.sync.set({
            [PLAYLIST]: list
        });
        if(!mute) chrome.notifications.create({
            type: "basic",
            iconUrl: '/icon.png',
            title: `PLAYLIST UPDATE`,
            message: `${name} - ${singer} is deleted from playlist`
        });
    });
}

function play_next(config){
    cache(config, (config)=>{
        if(config[PLAYLIST].length){
            var song = config[PLAYLIST][0];
            playMusic(
                song.name,
                song.link
            ); 
            del_song(0, true);
        }
    });
}

function play_search(get_music, log){
    get_music((keyword, source, data) => {
        playMusic(keyword, api[source].link(data), log); 
    });
}

function add_search(get_music){
    get_music((keyword, source, data) => {
        add_song(
            api[source].name(data),
            api[source].link(data),
            api[source].singer(data)
        );
    });
}
