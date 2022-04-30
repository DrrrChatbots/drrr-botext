

function get_music(keyword, source, callback){
  var get = function(src){
    if(keyword) {
      music_api(keyword, callback, {
        log: console.log,
        error: (msg) => sendTab({ fn: publish_message, args: { msg: msg } }),
        ajax: ajax
      }, src);
    } else console.log("please input keyword");
  }

  if(!source){
    chrome.storage.sync.get((config) => {
      if(config['music_source']) get(config['music_source']); else get('Q');
    });
  } else get(source);
}

function lstMusic(config){
  var list = config[PLAYLIST];
  if(list && list.length){
    songs = Object.keys(list).map(
      (idx) => `[${idx}] ${ommited_name(list[idx].name, list[idx].singer, 28)}`
    );
    var msg = [[]]
    for(var s of songs){
      console.log(s);
      if(msg[msg.length - 1].length < 5)
        msg[msg.length - 1].push(s);
      else msg.push([s]);
    }
    msg = msg.map((s)=>s.join('\n'));
    msg.reverse();
  } else msg = ['EMPTY PLAYLIST'];

  for(var i = 0; i < msg.length; i++)
    setTimeout(((msg)=>function(){
      console.log('menu is..:', msg);
      sendTab({
        fn: publish_message,
        args:{
          msg: msg
        }
      });
    })(msg[i]), i * 1000);
}

function pndMusicKeyword(config, idx, keyword = '', source){
  var publish = (msg) => sendTab({ fn: publish_message, args: { msg: msg } });
  if(keyword.length){
    sendTab({
      fn: is_playing,
    }, undefined, ([active, after]) => {
      if(active)
        add_search(get_music.bind(null, keyword, source), false, true, idx);
      else{
        if(config[PLAYLIST] && config[PLAYLIST].length){
          console.log("add and play first")
          add_search(get_music.bind(null, keyword, source), false, true, idx);
          if(after === undefined || after === null || after > getDelay(config) + 5)
            setTimeout(()=> play_next(config, publish), 1000);

        }
        else if(after === undefined || after === null || after > getDelay(config) + 5){
          play_search(get_music.bind(null, keyword, source), publish, idx);
          console.log('after is:', after, ' > ', getDelay(config) + 5, 'play');
        }
        else{
          add_search(get_music.bind(null, keyword, source), true, idx);
          console.log('after is:', after, ' < ', getDelay(config) + 5, 'add');
        }
      }
    });
  }
  else lstMusic(config);
}

function pndMusic(config, song, mute = true){
  var publish = (msg) => sendTab({ fn: publish_message, args: { msg: msg } });
  sendTab({
    fn: is_playing,
  }, undefined, ([active, after]) => {
    if(active)
      add_song(PLAYLIST, song, mute, publish);
    else{
      if(config[PLAYLIST] && config[PLAYLIST].length){
        console.log("add and play first")
        add_song(PLAYLIST, song, mute, publish);
        if(after === undefined || after === null || after > getDelay(config) + 5)
          setTimeout(()=> play_next(config, publish), 1000);

      }
      else if(after === undefined || after === null || after > getDelay(config) + 5){
        playMusic(song_title(song), song.link, publish);
        console.log('after is:', after, ' > ', getDelay(config) + 5, 'play');
      }
      else{
        add_song(PLAYLIST, song, mute, publish);
        console.log('after is:', after, ' < ', getDelay(config) + 5, 'add');
      }
    }
  });
}

function showSongs(songs, source, data){
  var msg0 = '', msg1 = '';
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
}

function schMusic(config, keyword, source, callback){
  console.log(`search music[${source}]: ${keyword}`);
  get_music(keyword, source, (keyword, source, data) => {
    var songs = api[source].songs(data);
    callback && callback(keyword, source, data);
    showSongs(songs, source, data);
  });
}
