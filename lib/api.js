// https://drrr-botext-ymsrc.herokuapp.com/ | https://git.heroku.com/drrr-botext-ymsrc.git
// https://<your-app-name>.herokuapp.com/api/version

/* new netease api */
function ne_api_url(keyword, callback){
  var url = `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1&offset=0&total=true&limit=10`
  if(callback) callback(url);
  else return url;
}

function ne_songs(data){
  if(data.code != 200 || !data.result || !data.result.songs || !data.result.songs.length)
    throw `網: No search result... QAQ`;
  return data['result']['songs'];
}

function ne_link(data, idx = 0){
  return `網 ${ne_songs(data)[idx]['id']}`;
}

// https://drrr-netease.herokuapp.com/song/url?id=1373706768

function ne_name(data, idx = 0){
  return ne_songs(data)[idx]['name'];
}

function ne_singer(data, idx = 0){
  return ne_songs(data)[idx]['artists'].map((m)=>m['name']).join(',');
}

function ne_fetch(id, cb){
  $.ajax({
    type: "GET",
    url: `https://drrr-netease.herokuapp.com/song/url?id=${id}`,
    dataType: 'json',
    success: function(data){
      cb(data.data[0].url);
    },
    error: function(jxhr){
      alert("fetch failed");
    }
  });
}

/* old netease api */

function netease_api_url(keyword, callback){
  var url = `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1&offset=0&total=true&limit=10`
  if(callback) callback(url);
  else return url;
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

function baidu_api_url(keyword, callback){
  var url = `http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.search.catalogSug&format=json&query=${keyword}`;
  if(callback) callback(url);
  else return url;
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

function yt_api_url(keyword, callback){
  //return `https://ytapier-cat.herokuapp.com/yt?term=${keyword}`;
  var url = `https://ytapier-cat.herokuapp.com/kw?term=${keyword}`;
  if(callback){
    chrome.storage.sync.get("youtube-api-url", (config)=>{
      if(config["youtube-api-url"])
        callback(`${config["youtube-api-url"]}/kw?term=${keyword}`);
      else callback(url);
    });
  }
  else return url;
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
  var callback = (fullURL) => $.ajax({
    type: "GET",
    url: fullURL,
    dataType: 'json',
    success: function(data){
      cb(yt_songs(data)[0]['link']);
    },
    error: function(jxhr){
      alert("fetch failed" + JSON.stringify(jxhr));
    }
  });
  chrome.storage.sync.get("youtube-api-url", (config)=>{
    if(config["youtube-api-url"])
      callback(`${config["youtube-api-url"]}/lk?url=${url}`);
    else callback(`https://ytapier-cat.herokuapp.com/lk?url=${url}`);
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
  '網': {
    url: ne_api_url,
    link: ne_link,
    name: ne_name,
    songs: ne_songs,
    singer: ne_singer,
    fetch: ne_fetch,
  },
  '易': {
    url: netease_api_url,
    link: netease_link,
    name: netease_name,
    songs: netease_songs,
    singer: netease_singer,
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
    fetch: yt_fetch,
  },
  '我': {
    url: kuwo_api_url,
    link: kuwo_link,
    name: kuwo_name,
    songs: kuwo_songs,
    singer: kuwo_singer,
    fetch: kuwo_fetch,
  },
  '狗': {
    url: kugou_api_url,
    link: kugou_link,
    name: kugou_name,
    songs: kugou_songs,
    singer: kugou_singer,
    fetch: kugou_fetch,
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
  if(begsrc && begsrc === src)
    funcs.error("all source unavailable");
  else if(!(src in api))
    funcs.error("invalid music source");
  else{
    api[src].url(keyword, (theURL)=>{
      console.log(`fetching ${begsrc} ${theURL}`);
      funcs.ajax({
        type: "GET",
        url: theURL,
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
          funcs.log(`Fetch ${src} ${theURL} song failed, report developer:\n`
            + JSON.stringify(jxhr));
          chrome.tabs.create({url: theURL});
          music_ajax(
            keyword, callback,
            funcs, nextkey(src, api),
            begsrc ? begsrc : src);
        }
      });
    })
    //funcs.log(`getting src ${src}`);
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
  let send = (murl) => sendTab({
    fn: play_music,
    args: {
      title: title,
      url: murl
    }
  }, () => log('no active drrr.com chatroom tab'))

  let sendm = (link) => link.length > 100 ? short_url(link, send) : send(link);

  if(!url.startsWith('http')){
    let [src, ...args] = url.split(' ').slice()
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

function loop_song(conf_name, callback, mute = false, publish = false){
  loop_value(conf_name, callback,
    (cn, item) => chrome.notifications.create({
      type: "basic",
      iconUrl: '/icon.png',
      title: `${cn.toUpperCase()} LOOPED`,
      message: `${item.name} - ${item.singer} is looped from ${cn}`
    }),
    (cn, item) => sendTab({
      fn: publish_message,
      args: {
        msg: `${item.name} - ${item.singer} is looped from ${cn}`
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
      if(config[MUSIC_MODE] === SLOOP_MODE) { /*ignore remove*/ }
      else if(config[MUSIC_MODE] === ALOOP_MODE)
        loop_song(PLAYLIST, callback, true);
      else del_song(PLAYLIST, 0, callback, true);
    } else { log("EMPTY PLAYLIST"); }
  });
}

function play_search(get_music, log = console.log, idx){
  get_music((keyword, source, data) => {
    //console.log(data, 'source: ', source);
    if(idx && api[source].songs(data).length <= idx)
      log(`only ${api[source].songs(data).length} available`);
    else
      playMusic(api[source].name(data, idx), api[source].link(data, idx), log);
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
  var items = ['excited', 'cat', 'dog', 'animation', 'movie', 'fun'];
  var item = items[Math.floor(Math.random() * items.length)];
  var url = word.length ? `https://api.tenor.com/v1/search?q=${word}&key=B8JD0MUB9WBD&limit=${size}` : `https://api.tenor.com/v1/random?q=${item}&key=B8JD0MUB9WBD&limit=${size}&media_filter=basic&`;
  $.ajax({
    type: "GET",
    url: url,
    dataType: 'json',
    success: function(data){
      var limit = data.results.length;
      beg = Math.floor(Math.random()*limit);
      console.log('TENOR:', data);
      for(i = 0; i < limit; i++){
        idx = (beg + i) % limit;
        console.log('TENOR index:', idx);
        for(type of ['gif', 'nanogif', 'tinygif', 'mediumgif']){
          if(data.results[idx] && data.results[idx].media && data.results[idx].media[0][type]){
            return callback(data.results[idx].media[0][type].url);
          }
        }
      }
      console.log("no data send URL")
      callback(data.weburl);
      //callback('https://thumbs.dreamstime.com/b/no-found-symbol-unsuccessful-search-suitable-results-oops-page-failure-concept-flat-outline-vector-illustration-loupe-122872462.jpg');
    },
    error: function(jxhr){
      callback('http://tomchun.tw/tomchun/wp-content/uploads/2018/10/4536.jpg');
    }
  });
}

function giphy_img(word, callback){
  var size = 8;
  var url = word.length ? `http://api.giphy.com/v1/gifs/search?q=${word}&api_key=X7Moh4MHelU6MtR1yMkp2EiX2QkPx2aQ&limit=${size}` : `http://api.giphy.com/v1/gifs/random?api_key=X7Moh4MHelU6MtR1yMkp2EiX2QkPx2aQ`
  $.ajax({
    type: "GET",
    url: url,
    dataType: 'json',
    success: function(res){
      data = res.data;
      limit = res.data.length;
      beg = Math.floor(Math.random()*limit);
      //console.log('giphy:', data);
      if(!word.length){
        if(data.images.original && data.images.original.url)
          return callback(data.images.original.url);
        console.log("no random data send URL");
        console.log(data)
        callback('https://thumbs.dreamstime.com/b/no-found-symbol-unsuccessful-search-suitable-results-oops-page-failure-concept-flat-outline-vector-illustration-loupe-122872462.jpg');
      }
      for(i = 0; i < limit; i++){
        idx = (beg + i) % limit;
        console.log('TENOR index:', idx);
        for(type of ['gif', 'nanogif', 'tinygif', 'mediumgif']){
          if(data[idx] && data[idx].images && data[idx].images.original && data[idx].images.original.url){
            return callback(data[idx].images.original.url);
          }
        }
      }
      console.log("no data send URL");
      console.log(data)
      callback('https://thumbs.dreamstime.com/b/no-found-symbol-unsuccessful-search-suitable-results-oops-page-failure-concept-flat-outline-vector-illustration-loupe-122872462.jpg');
    },
    error: function(jxhr){
      callback('http://tomchun.tw/tomchun/wp-content/uploads/2018/10/4536.jpg');
    }
  });
}

/*
function share_hidden_room(room_url){
  // https://drrr.chat/d/1324-hidden-room-dispatcher
  // encrypt room url
  $.ajax({
    type: "POST",
    url: 'https://drrr.chat/api/posts',
    dataType: 'json',
    data: {
      "data":{
        "type":"posts",
        "attributes":{
          "content": room_url //"https://drrr.com/room/?id=w9FVjozX3d"
        },
        "relationships":{
          "discussion":{
            "data":{
              "type":"discussions",
              "id":"1324"
            }
          }
        }
      }
    },
    success: function(data){
      var nodes = $(data);
      console.log(data);
      alert(data);
    },
    error: function(data){
      if(data.status == 401){
        alert("you need login drrr.chat first");
        chrome.tabs.create({url: 'https://drrr.chat'});
      }
      else alert("fetch failed" + JSON.stringify(data));
    }
  });
}
// delete
//https://drrr.chat/api/posts/8846
//POST
//{"data":{"type":"posts","id":"8846","attributes":{"isHidden":true}}}
*/
