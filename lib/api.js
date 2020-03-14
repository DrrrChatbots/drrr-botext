// https://drrr-botext-ymsrc.herokuapp.com/ | https://git.heroku.com/drrr-botext-ymsrc.git
// https://<your-app-name>.herokuapp.com/api/version

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

function yt_api_url(keyword){
    //return `https://ytapier-cat.herokuapp.com/yt?term=${keyword}`;
    return `https://youtube-cat.herokuapp.com/yt?term=${keyword}`;
}

function yt_songs(data){
    //if(data.error_code == 22001 || !data['song'].length)
    //    throw `千: No search result... QAQ`;
    return data['songs'];
}

function yt_link(data, idx = 0){
    return yt_songs(data)[idx]['link'];
}

function yt_name(data, idx = 0){
    return yt_songs(data)[idx]['name'];
}

function yt_singer(data, idx = 0){
    return ''
    //return yt_songs(data)[idx]['artistname'];
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
    },
    'Ｙ': {
        url: yt_api_url,
        link: yt_link,
        name: yt_name,
        songs: yt_songs,
        singer: yt_singer
    }
}

function nextkey(name, dict){
    var keys = Object.keys(dict);
    var idx = keys.indexOf(name);
    idx = (idx + 1) % keys.length;
    return keys[idx];
}

var max_len = 18;
function ommited_name(name, singer, length = max_len){
    var str = `${name} - ${singer}`
    if(str.length < max_len)
        return str
    return str.substring(0, str.length >= length ? length - 3 : length)
        + (str.length >= length ? '...' : '');
}

function music_ajax(keyword, callback, funcs, src, begsrc){
    console.log(`fetching ${begsrc} ${api[src].url(keyword)}`);
    if(begsrc && begsrc === src)
        funcs.error("all source unavailable");
    else if(!(src in api))
        funcs.error("invalid music source");
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
                music_ajax(
                    keyword, callback,
                    funcs, nextkey(src, api),
                    begsrc ? begsrc : src);
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
    var send = (murl) => sendTab({
        fn: play_music,
        args: {
            title: title,
            url: murl
        }
    }, () => log('no active drrr.com chatroom tab'))
    if(url.length > 100) short_url(url, send);
    else send(url);
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
    del_value(conf_name, idx, callback,
        (cn, item) => chrome.notifications.create({
            type: "basic",
            iconUrl: '/icon.png',
            title: `${cn.toUpperCase()} UPDATE`,
            message: `${item.name} - ${item.singer} is deleted from ${cn}`
        }),
        (cn, item) => sendTab({
            fn: publish_message,
            args: { 
                msg: `${item.name} - ${item.singer} is deleted from ${cn}` 
            }
        }), mute, publish
    )
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

function play_search(get_music, log = console.log, idx){
    get_music((keyword, source, data) => {
        console.log(data, 'source: ', source);
        if(idx && api[source].songs(data).length <= idx)
            log(`only ${api[source].songs(data).length} available`);
        else
            playMusic(keyword, api[source].link(data, idx), log); 
    });
}

function add_search(get_music, mute, publish, idx){
    get_music((keyword, source, data) => {
        if(idx && api[source].songs(data).length <= idx){
            if(!mute) chrome.notifications.create({
                type: "basic",
                iconUrl: '/icon.png',
                title: `add range out of bound`,
                message: `only ${api[source].songs(data).length} available`
            });
            if(publish) sendTab({
                fn: publish_message,
                args: { msg: `only ${api[source].songs(data).length} available` }
            });
        }
        else{
            add_song(
                PLAYLIST,
                api[source].name(data, idx),
                api[source].link(data, idx),
                api[source].singer(data, idx),
                mute, publish
            );
        }
    });
}
