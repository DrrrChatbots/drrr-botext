// https://drrr-botext-ymsrc.herokuapp.com/ | https://git.heroku.com/drrr-botext-ymsrc.git
// https://<your-app-name>.herokuapp.com/api/version

function notification_alert(message, title = 'ALERT'){
  chrome.notifications.create({
    type: "basic",
    iconUrl: '/icon.png',
    title: title,
    message: message
  })
}

function song_title(song){
  let title = `${song.name}`;
  if(song.src != '' && song.src != '易')
    title = `${song.src}|${title}`
  if(song.singer != '')
    title = `${title} - ${song.singer}`
  return title
}

/* new netease api */
function ne_api_url(keyword, callback){
  var url = `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1&offset=0&total=true&limit=10`
  return callback ? callback(url) : url;
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

function ne_fetch(cb, id){
  $.ajax({
    type: "GET",
    url: `https://drrr-netease.herokuapp.com/song/url?id=${id}`,
    dataType: 'json',
    success: function(data){
      cb(data.data[0].url);
    },
    error: function(jxhr){
      notification_alert("fetch failed");
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
  return `http://link.hhtjim.com/163/${netease_songs(data)[idx]['id']}.mp3`
  // return `https://music.163.com/#/song?id=${netease_songs(data)[idx]['id']}`
}

function netease_name(data, idx = 0){
  return netease_songs(data)[idx]['name'];
}

function netease_singer(data, idx = 0){
  return netease_songs(data)[idx]['artists'].map((m)=>m['name']).join(',');
}

function make_liuzhijin_api(en_name, zh_name){
  function urlBy(referrer, body, callback){
    var data = {
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ko;q=0.6",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      referrer: referrer,
      body: body,
    }
    if(callback) callback(`https://music.liuzhijin.cn/`, data);
    else return [`https://music.liuzhijin.cn/`, data];
  }

  function urlByKeyword(keyword, callback){
    return urlBy(
      `https://music.liuzhijin.cn/?name=${encodeURI(keyword)}&type=${en_name}`,
      `input=${encodeURI(keyword)}&filter=name&type=${en_name}&page=1`, callback
    );
  }

  function urlByID(ID, callback){
    return urlBy(
      `https://music.liuzhijin.cn/?id=${ID}&type=${en_name}`,
      `input=${ID}&filter=id&type=${en_name}&page=1`, callback
    );
  }

  function songs(data){
    if(data.code != 200 || !data.data || !data.data.length)
      throw `${zh_name}: No search result... QAQ`;
    let songs = data['data'].filter(s => s.url.length);
    if(!songs.length) throw `${zh_name}: No search result... QAQ`;
    return songs;
  }
  function link(data, idx = 0){
    return songs(data)[idx]['url'];
  }
  function name(data, idx = 0){
    return songs(data)[idx]['title'];
  }
  function singer(data, idx = 0){
    return songs(data)[idx]['author'];
  }
  function songid(data, idx = 0){
    return `${zh_name} ${songs(data)[idx]['songid']}`;
  }
  function songfetch(cb, lnk){
    if(lnk.startsWith('http://') || lnk.startsWith('https://')){
      return cb ? cb(lnk) : lnk;
    }
    else {
      if(!cb) return notification_alert(`fetch liu must be async`);
      let [theURL, data] = urlByID(lnk);
      fetch(theURL, {
          "headers": data.headers,
          "referrer": data.referrer,
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": data.body,
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          cb(link(myJson));
        })
        .catch(function(err){
          notification_alert("fetch failed" + JSON.stringify(err));
        });
    }
  }
  // also have pic
  return {
    url: urlByKeyword,
    link: link,
    name: name,
    songs: songs,
    singer: singer,
    songid: songid,
    fetch: songfetch,
  }
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
  return `Y ${yt_songs(data)[idx]['link']}`;
}

function yt_name(data, idx = 0){
  return yt_songs(data)[idx]['name'];
}

function yt_singer(data, idx = 0){
  return ''
  //return yt_songs(data)[idx]['artistname'];
}

function yt_fetch(cb, url){
  var callback = (fullURL) => $.ajax({
    type: "GET",
    url: fullURL,
    dataType: 'json',
    success: function(data){
      cb(yt_songs(data)[0]['link']);
    },
    error: function(jxhr){
      notification_alert("fetch failed" + JSON.stringify(jxhr));
    }
  });
  chrome.storage.sync.get("youtube-api-url", (config)=>{
    if(config["youtube-api-url"])
      callback(`${config["youtube-api-url"]}/lk?url=${url}`);
    else callback(`https://ytapier-cat.herokuapp.com/lk?url=${url}`);
  });
}

var api = {
  '易': {
    url: netease_api_url,
    link: netease_link,
    name: netease_name,
    songs: netease_songs,
    singer: netease_singer,
  },
  'Q': make_liuzhijin_api('qq', 'Q'),
  '狗': make_liuzhijin_api('kugou', '狗'),
  '千': make_liuzhijin_api('baidu', '千'),
  // '我': make_liuzhijin_api('kuwo', '我'),
  'Y': {
    url: yt_api_url,
    link: yt_link,
    name: yt_name,
    songs: yt_songs,
    singer: yt_singer,
    fetch: yt_fetch,
  },
  '網': {
    url: ne_api_url,
    link: ne_link,
    name: ne_name,
    songs: ne_songs,
    singer: ne_singer,
    fetch: ne_fetch,
  },
}

function data2info(data, src, idx = 0){
  let info = {
    src: src,
    name: api[src].name(data, idx),
    link: api[src].link(data, idx),
    singer: api[src].singer(data, idx),
  };
  if(api[src].songid)
    info.songid = api[src].songid(data, idx);
  return info;
}

function nextkey(name, dict){
  var keys = Object.keys(dict);
  var idx = keys.indexOf(name);
  idx = (idx + 1) % keys.length;
  return keys[idx];
}

var max_len = 18;
function ommited_name(name, singer, length = max_len){
  let str = `${name}`;
  if(singer != '') str += ` - ${singer}`;
  if(str.length < max_len)
    return str
  return str.substring(0, str.length >= length ? length - 3 : length)
    + (str.length >= length ? '...' : '');
}

function music_ajax(keyword, callback, funcs, src, begsrc){
  if(begsrc && begsrc === src){
    funcs.error("all source unavailable");
  }
  else if(!(src in api)){
    funcs.error("invalid music source");
  }
  else{
    api[src].url(keyword, (theURL, data)=>{
      console.log(`fetching ${src} ${theURL}`);
      let onSuccess = function(data){
        try{ callback(keyword, src, data); }
        catch(e){
          funcs.log(e);
          music_ajax(
            keyword, callback,
            funcs, nextkey(src, api),
            begsrc ? begsrc : src);
        }
      }
      let onError = function(jxhr){
        // funcs.log(`Fetch ${src} ${theURL} song failed, report developer:\n`
        //   + JSON.stringify(jxhr));
        // chrome.tabs.create({url: theURL});
        console.log(`Fetch ${src} ${theURL} song failed, report developer:\n`
          + JSON.stringify(jxhr));
        music_ajax(
          keyword, callback,
          funcs, nextkey(src, api),
          begsrc ? begsrc : src);
      };

      if(data){
        fetch(theURL, {
          "headers": data.headers,
          "referrer": data.referrer,
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": data.body,
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(myJson) {
            onSuccess(myJson)
          })
          .catch(function(err){
            onError(err);
          });
      }
      else{
        funcs.ajax({
          type: "GET",
          url: theURL,
          dataType: 'json',
          success: onSuccess,
          error: onError,
        });
      }
    })
    //funcs.log(`getting src ${src}`);
  }
}

function music_api(keyword, callback, funcs, source){
  if(!funcs['log']) funcs.log = console.log;
  if(!funcs['error']) funcs.error = funcs.log;
  if(funcs['ajax'])
    music_ajax(keyword, callback, funcs, source);
  else{
    funcs.log('please specific the ajax function');
  }
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

  let link_args = url.split(' ').slice();
  if(link_args.length > 1){
    let sendm = (link) => link.length > 100 ? short_url(link, send) : send(link);
    let [src, ...args] = link_args;
    api[src].fetch(sendm, ...args) ;
  }
  else { send(url); }
}

function add_song(list, song, mute = false, publish = false){
  // song: name, link, singer
  push_value(list, song);
  if(!mute) chrome.notifications.create({
    type: "basic",
    iconUrl: '/icon.png',
    title: `${list.toUpperCase()} UPDATE`,
    message: `${song_title(song)} is added to ${list}`
  });
  if(publish){
    sendTab({
      fn: publish_message,
      args: { msg: `${song_title(song)} is added to ${list}` }
    })
  }
}

function del_song(conf_name, idx, callback, mute = false, publish = false){
  del_value(conf_name, idx, callback,
    (cn, item) => chrome.notifications.create({
      type: "basic",
      iconUrl: '/icon.png',
      title: `${cn.toUpperCase()} UPDATE`,
      message: `${song_title(item)} is deleted from ${cn}`
    }),
    (cn, item) => sendTab({
      fn: publish_message,
      args: {
        msg: `${song_title(item)} is deleted from ${cn}`
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
      message: `${song_title(item)} is looped from ${cn}`
    }),
    (cn, item) => sendTab({
      fn: publish_message,
      args: {
        msg: `${song_title(item)} is looped from ${cn}`
      }
    }), mute, publish
  )
}

function play_next(config, log = console.log, callback){
  cache(config, (config)=>{
    if(!empty_list(config, PLAYLIST)){
      var song = config[PLAYLIST][0];
      playMusic(
        song_title(song),
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
    else{
      let song = data2info(data, source, idx);
      playMusic(song_title(song), song.link, log);
    }
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
        data2info(data, source, idx),
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
