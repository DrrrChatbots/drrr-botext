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
  return `https://ytapier-cat.herokuapp.com/kw?term=${keyword}`;
}

function yt_songs(data){
  //if(data.error_code == 22001 || !data['song'].length)
  //    throw `千: No search result... QAQ`;
  return data['songs'];
}

function yt_link(data, idx = 0){
  //return yt_songs(data)[idx]['link'];
  return `Ｙ ${yt_songs(data)[idx]['link']}`;
}

function yt_name(data, idx = 0){
  return yt_songs(data)[idx]['name'];
}

function yt_singer(data, idx = 0){
  return ''
  //return yt_songs(data)[idx]['artistname'];
}

function yt_fetch(url, cb){
  $.ajax({
    type: "GET",
    url: `https://ytapier-cat.herokuapp.com/lk?url=${url}`,
    dataType: 'json',
    success: function(data){
      cb(yt_songs(data)[0]['link']);
    },
    error: function(jxhr){
      alert("fetch failed" + JSON.stringify(jxhr));
    }
  });
}

//https://trangle.top/article/28/%E9%85%B7%E6%88%91%E7%BD%91%E9%A1%B5api
function kuwo_api_url(keyword){
  return `http://search.kuwo.cn/r.s?client=kt&all=${keyword}&pn=1&rn=10&uid=221260053&ver=kwplayer_ar_99.99.99.99&vipver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1`
}

function kuwo_songs(data){
  return data.abslist;
}

function kuwo_link(data, idx = 0){
  return `我 ${kuwo_songs(data)[idx].MUSICRID.split('_')[1]}`
}

function kuwo_name(data, idx = 0){
  return kuwo_songs(data)[idx]['SONGNAME'];
}

function kuwo_singer(data, idx = 0){
  return kuwo_songs(data)[idx]['ARTIST'];
}

//http://api.63code.com/kuwo/
function kuwo_fetch(id, cb){
  $.ajax({
    type: "GET",
    url: `http://api.63code.com/kuwo/api.php?id=${id}&type=json`,
    dataType: 'json',
    success: function(data){
      cb(data.url);
    },
    error: function(jxhr){
      alert("fetch failed");
    }
  });
}


//https://www.twblogs.net/a/5c659202bd9eee06ef37909d
function kugou_api_url(keyword){
  return `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${keyword}&page=1&pagesize=10&showtype=1`
}

function kugou_songs(data){
  return data.data.info;
}

function kugou_link(data, idx = 0){
  return `狗 ${kugou_songs(data)[idx].hash}`
}

function kugou_name(data, idx = 0){
  return kugou_songs(data)[idx]['songname'];
}

function kugou_singer(data, idx = 0){
  return kugou_songs(data)[idx]['singername'];
}
//http://api.63code.com/kugou
function kugou_fetch(hash, cb){
  $.ajax({
    type: "GET",
    url: `http://api.63code.com/kugou/api.php?hash=${hash}`,
    dataType: 'json',
    success: function(data){
      cb(data.mp3url);
    },
    error: function(jxhr){
      alert("fetch failed");
    }
  });
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
    singer: baidu_singer,
  },
  'Ｙ': {
    url: yt_api_url,
    link: yt_link,
    name: yt_name,
    songs: yt_songs,
    singer: yt_singer,
    fetch: yt_fetch
  },
  '我': {
    url: kuwo_api_url,
    link: kuwo_link,
    name: kuwo_name,
    songs: kuwo_songs,
    singer: kuwo_singer,
    fetch: kuwo_fetch
  },
  '狗': {
    url: kugou_api_url,
    link: kugou_link,
    name: kugou_name,
    songs: kugou_songs,
    singer: kugou_singer,
    fetch: kugou_fetch
  },
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
        funcs.log(`Fetch ${src} song failed, report developer:\n`
          + JSON.stringify(jxhr)) + `\n${api[src].url(keyword)}`;
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

  var sendm = (link) => link.length > 100 ? short_url(link, send) : send(link);

  if(!url.startsWith('http')){
    var [src, ...args] = url.split(' ').slice()
    api[src].fetch(args, sendm) ;
  } else sendm(url);
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

function tenor_img(word, callback){
  var size = 8;
  $.ajax({
    type: "GET",
    url: `https://api.tenor.com/v1/search?q=${word}&key=B8JD0MUB9WBD&limit=${size}`,
    dataType: 'json',
    success: function(data){
      iter = Math.floor(Math.random()*size)+1;
      for(i = 0; i < size; i++){
        for(type of ['gif', 'nanogif', 'tinygif', 'mediumgif']){
          if(data.results[iter] && data.results[iter].media && data.results[iter].media[0][type]){
            return callback(data.results[iter].media[0][type].url);
          }
        }
      }
      console.log(data);
      callback(data.weburl);
      //callback('https://thumbs.dreamstime.com/b/no-found-symbol-unsuccessful-search-suitable-results-oops-page-failure-concept-flat-outline-vector-illustration-loupe-122872462.jpg');
    },
    error: function(jxhr){
      callback('http://tomchun.tw/tomchun/wp-content/uploads/2018/10/4536.jpg');
    }
  });
}
