

function get_music(keyword, source, show = sendTabMessage, callback){
  var get = function(src){
    if(keyword) {
      music_api(keyword, callback, {
        log: console.log,
        error: (msg) => show(msg),
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

function lstMusic(config, show = sendTabMessage){
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
      show(msg);
    })(msg[i]), i * 1000);
}

function pndMusicKeyword(config, idx, keyword = '',
  source, pos = -1, show = sendTabMessage){
  if(keyword.length){
    sendTab({
      fn: is_playing,
    }, undefined, ([active, after]) => {
      if(active)
        add_search(get_music.bind(null, keyword, source, show), false, true, idx, pos);
      else{
        if(config[PLAYLIST] && config[PLAYLIST].length){
          add_search(get_music.bind(null, keyword, source, show), false, true, idx, pos);
          if(after === undefined || after === null || after > getDelay(config) + 5)
            setTimeout(()=> play_next(config, show), 1000);
        }
        else if(after === undefined || after === null || after > getDelay(config) + 5){
          play_search(get_music.bind(null, keyword, source, show), show, idx);
          console.log('after is:', after, ' > ', getDelay(config) + 5, 'play');
        }
        else{
          add_search(get_music.bind(null, keyword, source, show), true, idx, pos);
          console.log('after is:', after, ' < ', getDelay(config) + 5, 'add');
        }
      }
    });
  }
  else lstMusic(config, show);
}

function pndMusic(config, song, mute = true,
  pos = -1, autoplay = true, show = sendTabMessage){
  sendTab({
    fn: is_playing,
  }, undefined, ([active, after]) => {
    if(active)
      add_song(PLAYLIST, song, mute, show, pos);
    else{
      if(config[PLAYLIST] && config[PLAYLIST].length){
        add_song(PLAYLIST, song, mute, show, pos);
        if(autoplay && (after === undefined || after === null || after > getDelay(config) + 5))
          setTimeout(()=> play_next(config, show), 1000);

      }
      else if(autoplay && (after === undefined || after === null || after > getDelay(config) + 5)){
        playMusic(song_title(song), song.link, show);
        console.log('after is:', after, ' > ', getDelay(config) + 5, 'play');
      }
      else{
        add_song(PLAYLIST, song, mute, show, pos);
        console.log('after is:', after, ' < ', getDelay(config) + 5, 'add');
      }
    }
  });
}

function showSongs(songs, source, data, show = sendTabMessage){
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
  if(msg1){ show(msg1); }
  if(msg0){ setTimeout(() => show(msg0), 1000); }
}

function schMusic(config, keyword, source, callback, show = sendTabMessage){
  console.log(`search music[${source}]: ${keyword}`);
  get_music(keyword, source, show, (keyword, source, data) => {
    var songs = api[source].songs(data);
    callback && callback(keyword, source, data);
    showSongs(songs, source, data, show);
  });
}
