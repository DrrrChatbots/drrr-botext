var bkg = chrome.extension.getBackgroundPage;

function open_manual(){
  let language = window.navigator.userLanguage || window.navigator.language;
  if(language == 'zh-CN' || language == 'zh-TW')
    chrome.tabs.create({url: chrome.extension.getURL('manuals/manual-zh.html')});
  else
    chrome.tabs.create({url: chrome.extension.getURL('manuals/manual-en.html')});
}

function open_background(){
  let type = $("#storage-type").hasClass('fa-hdd-o') ? 'local' : 'sync';
  chrome.tabs.create({url: chrome.extension.getURL(`setting/${type}/index.html`)});
}

var nodes = undefined;
var chats = undefined;
function set_hidden_room(){
  /* test login
  $.ajax({
    type: "GET",
    url: `https://drrr.chat/api/notifications`,
    dataType: 'json',
    success: function(data){
      var nodes = $(data);
      console.log(data);
    },
    error: function(data){
      if(data.status == 401){
        alert("you need login drrr.chat first");
        chrome.tabs.create({url: 'https://drrr.chat'});
      }
      else alert("fetch failed" + JSON.stringify(data));
    }
  });
  */

  // try to enter room
  //$.ajax({
  //  type: "GET",
  //  url: `https://drrr.com/room/?id=wWAapCaLyI&api=json`,
  //  dataType: 'json',
  //  success: function(data){
  //    console.log("success");
  //    console.log(data);
  //    if(data.message == "ok" && data.redirect == "room"){

  //    }
  //    else{
  //      console.log(data.error);
  //    }
  //  },
  //  error: function(data){
  //    console.log(data);
  //  }
  //});

  // delete room
  //$.ajax({
  //  url: 'https://drrr.chat/api/posts/8846',
  //  type: "POST",
  //  data: {"data":{"type":"posts","id":"8846","attributes":{"isHidden":true}}},
  //  dataType: 'json',
  //  success: function(data){
  //    alert(data);
  //  },
  //  error: function(data){
  //    alert("error");
  //    alert(JSON.stringify(data));
  //  }
  //})
}

function c2sess(cookies){
  let session = '';
  if(cookies && cookies.forEach){
   cookies.forEach(c => {
     if(c.name == 'drrr-session-1'){
       session = c.value;
     }
   })
  }
  return session;
}

function open_tripgen(){
  chrome.tabs.create({url: chrome.extension.getURL('setting/tripcode.html')});
}

function get_music(callback){
  let keyword = $('#keyword').val();
  let source = $('#music_source').val();
  if(keyword){
    music_api(keyword, callback, {
      // log: alert.bind(window),
      log: notification_alert,
      ajax: (req) =>
      chrome.runtime.sendMessage(
        { type: 'ajax' },
        () => bkg().ajax(req))
    }, source);
    /* retain ? */
    $('#keyword').val('');
    emptyKeyword();
  } else alert("please input keyword");
}

var list_template = (args, btns) => `<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon ${args.icon || 'glyphicon-music'}"></i></span>
     <span class="input-group-addon form-control panel-footer text-center"
            title="${args.title}">${args.content}</span>
     <div class="input-group-btn">
        ${btns.map((b) => b(args)).join('')}
     </div>
 </div>`;

var grid_row_template = (ctx) => `<div class="row" style="display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; padding: 0 4px;">${ctx}</div>`

var grid_col_template = (args, btns) => `<div class="column hover09" style="${args.colstyle}">${btns.map((b) => b(args)).join('')} </div>`


var empty_template = (name, icon) => `<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon ${icon || 'glyphicon-music'}"></i></span>
     <span class="input-group-addon form-control panel-footer text-center">${name}</span>
 </div>`;

var sticker_src = (args) => `${args.url}`
var sticker_btn = (args) => `<figure><img src="${sticker_src(args)}" class="sticker-btn" style="${args.imgstyle}"></figure>`

var imm_play_data = (args) => `${args.type} ${args.idx}`
var imm_play_btn = (args) => `<button class="btn btn-default imm-play" type="submit"
         data='${imm_play_data(args)}'     title="play the song immediately">
     <i class="glyphicon glyphicon-play"></i>
  </button>`

var imm_pldl_data = (args) => `${args.type} ${args.idx}`
var imm_pldl_btn = (args) => `<button class="btn btn-default imm-pldl" type="submit" data-idx="${args.idx}"
         data='${imm_pldl_data(args)}'     title="play the song immediately">
     <i class="glyphicon glyphicon-play"></i>
  </button>`

var add_song_data = (args) => `${args.type} ${args.idx}`
var add_song_btn = (args) => `<button class="btn btn-default add-song" type="submit"
         data='${add_song_data(args)}'     title="add the song the playlist">
     <i class="glyphicon glyphicon-plus"></i>
 </button>`

var fav_song_data = (args) => `${args.type} ${args.idx}`
var fav_song_btn = (args) => `<button class="btn btn-default fav-song" type="submit"
         data='${fav_song_data(args)}'     title="add the song the favlist">
     <i class="glyphicon glyphicon-heart"></i>
 </button>`

var del_song_data = (args) => `${args.idx}`
var del_song_btn = (args) => `<button class="btn btn-default del-song" type="submit"
         data='${del_song_data(args)}'   title="remove the song from playlist">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

var vaf_song_data = (args) => `${args.idx}`
var vaf_song_btn = (args) => `<button class="btn btn-default vaf-song" type="submit"
         data='${vaf_song_data(args)}'   title="remove the song from favlist">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

var goto_room_data = (args) => `${args.can ? args.url : args.roomId}`
var goto_room_btn = (args) => `<button class="btn btn-default goto-room" type="submit"
         data='${goto_room_data(args)}'   title="${args.can ? 'goto the room' : 'wait to join'}">
     <i class="glyphicon  ${args.can ? 'glyphicon-plane' : 'glyphicon-tag'}"></i>
  </button>`


var del_fbrule_data = (args) => `${args.data}-${args.idx}`
var del_fbrule_btn = (args) =>
  `<button class="btn btn-default del-fbrule" type="submit"
         data='${del_fbrule_data(args)}'   title="remove the rule">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

function bind_sticker(args){
  $(`img[src="${sticker_src(args)}"]`).click(function(){
  // $(`.sticker-btn`).click(function(){
    sendTab({
      fn: publish_message,
      args: {
        msg: '⠀',
        url: this.src
      }
    });
  })
}

function bind_imm_play(args){
  $(`.imm-play[data='${imm_play_data(args)}']`).click(function(){
  // $(`.imm-play`).click(function(){
    // let song = JSON.parse($(this).attr('data'));
    let [type, idx] = $(this).attr('data').split(' ');
    let song = window.datalist[type][Number(idx)].data;
    playMusic(
      song_title(song),
      song.link,
      alert.bind(window)
    );
  })
}

function bind_imm_pldl(args){
  $(`.imm-pldl[data='${imm_pldl_data(args)}']`).click(function(){
  // $(`.imm-pldl`).click(function(){
    // let song = JSON.parse($(this).attr('data'));
    let [type, idx] = $(this).attr('data').split(' ');
    let song = window.datalist[type][Number(idx)].data;
    playMusic(
      song_title(song),
      song.link,
      alert.bind(window)
    );
    let sel = $('#mode_type');
    let mtype = mplay_modes.find(m => sel.hasClass(m)) || ALBUM_MODE;
    if(mtype === ALBUM_MODE || mtype === SINGLE_MODE)
      del_song(PLAYLIST, $(this).attr('data-idx'), (res) => res && show_playlist(), true);
  })
}

function bind_fav_song(args){
  $(`.fav-song[data='${fav_song_data(args)}']`).click(function(){
  // $(`.fav-song`).click(function(){
    // let song = JSON.parse($(this).attr('data'));
    let [type, idx] = $(this).attr('data').split(' ');
    let song = window.datalist[type][Number(idx)].data;
    if(song.songid) {
      song.link = song.songid;
      delete song.songid;
    }
    add_song(
      FAVLIST,
      song,
    );
  })
}

function bind_add_song(args){
  $(`.add-song[data='${add_song_data(args)}']`).click(function(){
  // $(`.add-song`).click(function(){
    // let song = JSON.parse($(this).attr('data'));
    let [type, idx] = $(this).attr('data').split(' ');
    let song = window.datalist[type][Number(idx)].data;
    add_song(
      PLAYLIST,
      song,
    );
  })
}

function bind_del_song(args){
  $(`.del-song[data='${del_song_data(args)}']`).click(function(){
  // $(`.del-song`).click(function(){
    del_song(PLAYLIST, $(this).attr('data'), (res) => res && show_playlist(), false);
  });
}

function bind_vaf_song(args){
  $(`.vaf-song[data='${vaf_song_data(args)}']`).click(function(){
  // $(`.vaf-song`).click(function(){
    del_song(FAVLIST, $(this).attr('data'), (res) => res && show_favlist(), false);
  });
}

function bind_goto_room(args){
  $(`.goto-room[data='${goto_room_data(args)}']`).click(function(){
  // $(`.goto-room`).click(function(){
    let toURL = $(this).attr('data');
    if(toURL.startsWith('https'))
      chrome.storage.sync.set(
        {'jumpToRoom': toURL },
        ()=> sendTab({ fn: leave_room }, ()=>{
          chrome.tabs.update({ url: toURL });
        })
      );
    else{
      let type = 0;
      chrome.storage.sync.set({
        'eager-type': type,
        'eager-input': toURL
      });
      type_switch(type, '#eager-input', '#eager_type', 'Join Room when Avail by', eager_info, eager_types);
      $('#eager-input').val(toURL);
    }
  });
}

function bind_del_fbrule(args){
  $(`.del-fbrule[data='${del_fbrule_data(args)}']`).click(function(){
  // $(`.del-fbrule`).click(function(){
    [conf, idx] = $(this).attr('data').split('-');
    console.log(conf, idx);
    del_value(conf, idx, (v) => v && show_fbrulelist(),
      (cn, item) => chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: `${cn.toUpperCase()} UPDATE`,
        message: `RegExp Rule "${item}" is deleted from ${cn}`
      }),
      (cn, item) => sendTab({
        fn: publish_message,
        args: {
          msg: `RegExp Rule "${item}" is deleted from ${cn}`
        }
      }), false
    )
  });
}

btn_funcbind = {
  [sticker_btn]: bind_sticker,
  [imm_play_btn]: bind_imm_play,
  [imm_pldl_btn]: bind_imm_pldl,
  [fav_song_btn]: bind_fav_song,
  [add_song_btn]: bind_add_song,
  [del_song_btn]: bind_del_song,
  [vaf_song_btn]: bind_vaf_song,
  [goto_room_btn]: bind_goto_room,
  [del_fbrule_btn]: bind_del_fbrule,
}

function show_list(cont_name, entries, btns, callback, extend){
  let cont = (!Array.isArray(entries) ? entries :
    entries.map((args)=> list_template(args, btns)).join(''))
  let func = extend ? 'append' : 'html';
  $(cont_name)[func](cont).promise().then(()=>{
    callback();
    Array.isArray(entries) && entries.forEach((args) => {
      for(btn of btns) btn_funcbind[btn](args);
    });
  });
}


function grid_of(list, n){
  return list.reduce((acc, v, idx)=>{idx % n ? acc[acc.length - 1].push(v) : acc.push([v]); return acc}, [])
}

function show_grid(cont_name, entries, btns, callback){
  $(cont_name).html(
    !Array.isArray(entries) ? entries :
    entries.map( rargs =>
      grid_row_template(
        rargs.map( col =>
          grid_col_template(col, btns)
        ).join('')
      )
    )
  ).promise().then(()=>{
    callback();
    Array.isArray(entries) && entries.forEach((rargs) => {
      rargs.forEach((args)=>{
        for(btn of btns) btn_funcbind[btn](args);
      })
    })
  });
}

window.datalist = {};
function show_searchlist(callback){
  get_music((keyword, source, data) => {
    window.datalist[SCHLIST] = Object.keys(api[source].songs(data)).map((idx)=>{
      let song = data2info(data, source, idx);
      return ({
        idx: idx,
        type: SCHLIST,
        icon: 'glyphicon-search',
        title: song_title(song),
        content: ommited_name(song.name, song.singer),
        data: song
      });
    });

    show_list(
      '#list_container',
      window.datalist[SCHLIST],
     [add_song_btn, imm_play_btn, fav_song_btn], callback
    )
  });
}

function maxFreqElt(array)
{
  if(array.length == 0)
    return null;
  let modeMap = {};
  let maxEl = array[0], maxCount = 1;
  for(let i = 0; i < array.length; i++)
  {
    let el = array[i];
    if(modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if(modeMap[el] > maxCount)
    {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

function extractImagesFromNodes(nodes){
  let urls = Object.values(nodes.find('.FnStickerPreviewItem')).map(
    (node) => {
      if($(node).attr('data-preview')){
        let attr = $(node).attr('data-preview');
        let view = JSON.parse(attr);
        if(view.animationUrl && view.animationUrl.length)
          return view.animationUrl;
        else return view.staticUrl;
      }
      return "";
    }
  ).filter((v)=>v.length);
  if(urls.length) return urls;
  urls = nodes.find('.FnImage').toArray().map(u=>{
    let attr = $(u).css('background-image')
    return attr.substring(attr.indexOf('https'), attr.indexOf('")'))
  }).filter((v)=>v.length);
  if(urls.length) return urls;

  let k = maxFreqElt(nodes.find('span').map(function(){ return this.className; }))
  urls = nodes.find(`.${k}`).toArray().map(u=>{
    let attr = $(u).css('background-image')
    return attr.substring(attr.indexOf('https'), attr.indexOf('")'))
  }).filter((v)=>v.length);
  return urls.unique();

}

function show_stickergrid(url, callback){
  $.ajax({
    type: "GET",
    url: url,
    dataType: 'text',
    success: function(data){

      // data = data.replaceAll("(?i)<link[^>]*>", "").replaceAll("(?i)<script[^>]*>", "");
      data = data.replaceAll("<p", "<meta").replaceAll("<p", "<meta")
      // console.log(data);

      let nodes = $(data);

      let urls = extractImagesFromNodes(nodes);

      show_grid(
        '#sticker_list_container',
        grid_of(urls.map((url)=>({
          url: url,
          colstyle: `flex: 50%; max-width: 50%; padding: 0 4px;`,
          imgstyle: `margin-top: 8px; vertical-align: middle; width: 100%; `,
        })), 2), [sticker_btn], callback
      );

    },
    error: function(data){
      console.log("Error on get sticker images: " + JSON.stringify(data));
    }
  });
}

function show_homelist(callback){
  show_findlist(
    findAsList.bind(null, {'home':true}),
    roomTitle, (room, users) => ommited_name(`${room.language}`, `${room.name}`, 40),
    callback, empty_template('NO MARKED PLACE ONLINE', 'glyphicon-home'), 'glyphicon-home'
  )
}

function show_friendlist(callback){
  show_findlist(
    findAsList.bind(null, {'friend':true}),
    roomTitle, (room, users) => ommited_name(`${room.name}`, `${users.map(u=>`${u.name}`).join(', ')}`, 40),
    callback, empty_template('NO FRIEND ONLINE', 'glyphicon-user'), 'glyphicon-user'
  );
}

function show_tripcodelist(callback){
  show_findlist(
    findAsList.bind(null, {'tripcode':true}),
    roomTitle, (room, users) => ommited_name(`${room.name}`, `${users.map(u=>`#${u.tripcode}`).join(', ')}`, 40),
    callback, empty_template('NO TRIPCODE USER ONLINE', 'glyphicon-lock'), 'glyphicon-lock'
  );
}

function show_roomlist(callback){
  show_findlist(
    findAsList.bind(null, {'all':true}),
    roomTitle, (room, users) => ommited_name(`${room.language}`, `${room.name}`, 40),
    callback, empty_template('NO ROOM ON DRRR (WTF)', 'glyphicon-globe'), 'glyphicon-globe'
  );
}

// ['glyphicon-lock', 'glyphicon-user', 'glyphicon-home'];
function show_fbsearchlist(callback){
  let option = {};
  let type = cur_type('#fb_rule_type', fb_rule_types);
  rule = $('#fb-input').val();
  try{
    new RegExp(rule);
  }
  catch(e){
    return alert(e);
  }
  op = ['trip', 'user', 'room'][type];
  show = [
    (room, users) => ommited_name(`${room.name}`, `${users.map(u=>`${u.tripcode}`).join(', ')}`, 100),
    (room, users) => ommited_name(`${room.name}`, `${users.map(u=>`${u.name}`).join(', ')}`, 100),
    (room, users) => ommited_name(`${room.language}`, `${room.name}`, 100),
  ][type];

  option[op] = [rule];
  show_findlist(
    findAsList.bind(null, option),
    roomTitle, show, callback, empty_template('NO SEARCH RESULT', 'glyphicon-search'),
    ['glyphicon-lock', 'glyphicon-user', 'glyphicon-home'][type]
  )
}

function show_fbrulelist(callback){
  show_configlist(
    '#fb_list_container',
    [TRIPCODES, FRIENDS, HOMES], callback,
    [del_fbrule_btn],
    (c)=>`EMPTY ${c.toUpperCase()} RULE LIST`, {
      title: (c, l) => `${c.substring(0, c.length - 1)} RegExp Rule: ${l}`,
      content: (c, l) => l,
      data: (c, l) => c,
      icon: (c) => ({ [TRIPCODES]:'glyphicon-lock', [FRIENDS]: 'glyphicon-user', [HOMES]: 'glyphicon-home' }[c])
    });
}

function show_findlist(findGroups, getTitle, getContent, callback, empty, icon){
  ajaxRooms(
    function(data){
      lounge = data.rooms.sort(
        function(a,b){return (a.language > b.language) ? 1 : ((b.language > a.language) ? -1 : 0);}
      ).reverse();
      findGroups(lounge, undefined, (groups, config) =>{
        if(groups.length)
          show_list(
            '#fb_list_container',
            groups.map(([room, users])=>{
              return ({
                icon: icon || 'glyphicon-home',
                title: getTitle(room, users, config),
                content: getContent(room, users, config),
                can: checkAvail(room),
                roomId: room.roomId,
                url: 'https://drrr.com/room/?id=' + room.roomId,
              });
            }), [goto_room_btn], callback
          )
        else show_list('#fb_list_container', empty, [], callback);
      });
    }
  );
}

function show_configlist(
 container, conf_type, callback,
 buttons, empty_name, attrs, default_config){
  let load = default_config ?
    (ct, cb) => cb(default_config) :
    (ct, cb) => chrome.storage.sync.get(ct, cb);

  //chrome.storage.sync.get(conf_type, (config) => {
  load(conf_type, (config) => {
    function recursive(cfs, callback, ext){
      if(cfs.length){
        conf = cfs[0];
        let list = config[conf];
        if(list && list.length){
         window.datalist[conf_type] =
          Object.keys(list).map((idx) => {
            let icon = attrs.icon;
            icon = typeof icon === 'string' ? icon : icon(conf, list[idx]);
            let title = attrs.title(conf, list[idx]);
            let content = attrs.content(conf, list[idx]);
            let data = attrs.data(conf, list[idx]);
            return ({
              idx: idx,
              type: conf_type,
              conf: conf,
              icon: icon,
              title: title,
              content: content,
              data: data,
            });
          });
          show_list(
            container,
            window.datalist[conf_type],
            buttons, ()=>recursive(cfs.slice(1), callback, true), ext
          )
        }
        else{
          window.datalist[conf_type] = [];
          show_list(
            container,
            empty_template(
              typeof empty_name === 'string' ? empty_name : empty_name(conf),
              typeof attrs.icon === 'string' ? attrs.icon : attrs.icon(conf, undefined)),
            [], ()=>recursive(cfs.slice(1), callback, true), ext);
        }
      }
      else callback && callback();
    }
    confs = Array.isArray(conf_type) ? conf_type : [conf_type];
    recursive(confs, callback);
  });
}

function show_playlist(callback){
  show_configlist(
    '#list_container',
    PLAYLIST, callback,
    [del_song_btn, imm_pldl_btn, fav_song_btn],
    'EMPTY PLAYLIST', {
      title: (c, l) => song_title(l),
      content: (c, l) => ommited_name(l.name, l.singer),
      data: (c, l) => (l),
      icon: 'glyphicon-list'
    });
}

function show_favlist(callback){
  show_configlist(
    '#list_container',
    FAVLIST, callback,
    [add_song_btn, imm_play_btn, vaf_song_btn],
    'EMPTY FAVLIST', {
      title: (c, l) => song_title(l),
      content: (c, l) => ommited_name(l.name, l.singer),
      data: (c, l) => (l),
      icon: 'glyphicon-heart'
    });
}

function emptyKeyword(){
  $('#list_type').attr('class', 'glyphicon glyphicon-list');
  $('#music_list_opener').attr('title', 'show playlist');
  $('#fav_add_icon').attr('class', 'glyphicon glyphicon-heart');
  $('#fav_add_search').attr('title', 'show favorite songs');
  $('#play_search').attr('title', "play first song in playlist")
}

function add_scheme(url, scheme){
  if (url.indexOf("//") > -1){
    return url;
  }
  return scheme + url;
}

function extractHostname(url){
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1){
    scheme = url.substring(0, url.indexOf("://") + 3)
    hostname = url.split('/')[2];
  }
  else {
    scheme = 'http://'
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return scheme + hostname;
}

const mplay_modes = [SINGLE_MODE, ALBUM_MODE, SLOOP_MODE, ALOOP_MODE];
function music_bar_setup(config){
  /* music mode change */
  function music_mode_switch(mode){
    $('#mode_type').attr('class', `glyphicon ${mode}`);
    if(mode === SINGLE_MODE){
      $('#music_mode').attr('title', 'single mode, play one song at a time')
    }
    else if (mode === ALBUM_MODE){
      $('#music_mode').attr('title', 'album mode, continue playing if any song in playlist')
    }
    else if(mode === SLOOP_MODE){
      $('#music_mode').attr('title', 'loop mode, loop current song')
    }
    else if(mode === ALOOP_MODE){
      $('#music_mode').attr('title', 'loop mode, loop all songs in playlist')
    }
  }

  /* handle config[MUSIC_MODE] be undefined slightly */
  music_mode_switch(config[MUSIC_MODE] || ALBUM_MODE);
  $('#music_mode').click(()=>{
    let sel = $('#mode_type');
    let mtype = mplay_modes[(mplay_modes.findIndex(m => sel.hasClass(m)) + 1) % mplay_modes.length];
    chrome.storage.sync.set({
      [MUSIC_MODE]: mtype
    });
    music_mode_switch(mtype);
  })

  /* keyword change icon setting */
  $('#keyword')[0].addEventListener('keyup', function(v){
    if(v.keyCode == 13){
      if(!v.shiftKey && !v.ctrlKey)
        $('#music_list_opener').click();
      else if(v.shiftKey && !v.ctrlKey)
        $('#play_search').click();
      else if(!v.shiftKey && v.ctrlKey)
        $('#fav_add_search').click();
    }

  }, false);

  $('#keyword').on('input focus',function(e){
    if(e.type == 'focus') $('#music_list').collapse('hide');
    if($(this).val().trim()){
      $('#list_type').attr('class', 'glyphicon glyphicon-search');
      $('#music_list_opener').attr('title', 'search and show available results');
      $('#fav_add_icon').attr('class', 'glyphicon glyphicon-plus');
      $('#fav_add_search').attr('title', 'search and add the song to playlist');
      $('#play_search').attr('title', "search and play the song immediately")
    }
    else{
      emptyKeyword();
    }
  });

  /* music source setting */
  Object.keys(api).forEach((v)=>{
    $('#music_source').append(`<option value="${v}">${v}</option>`);
  })

  if(config['music_source'])
    $('#music_source').val(config['music_source']);

  $('#music_source').change(function(){
    chrome.storage.sync.set({ music_source: $(this).val() });
  });


  /* when open the music_list */
  /* .collapse('hide') .collapse('show') */

  $('#music_list_opener').on('click', function (){
    let $target = $($(this).attr("data-target"));
    let tartype = $target.attr('data');
    let opening = $target.hasClass('in');

    if($('#list_type').hasClass('glyphicon-list')){
      $target.attr('data', 'playlist');
      if(!opening) show_playlist(()=>$target.collapse('show'));
      else if(tartype == 'playlist') $target.collapse('hide');
      else{
        //show playlist
        callback = function (){
          show_playlist(()=>$target.collapse('show'));
          $target.off('hidden.bs.collapse', callback);
        }
        $target.on('hidden.bs.collapse', callback);
        $target.collapse('hide');
      }
    }
    else{
      //search and show the result
      $target.attr('data', 'search')
      show_searchlist(()=>$target.collapse(('show')));
    }
  });

  $('#fav_add_search').on('click', function(){
    let $target = $($(this).attr("data-target"));
    let tartype = $target.attr('data');
    let opening = $target.hasClass('in');
    if($('#fav_add_icon').hasClass('glyphicon-heart')){
      $target.attr('data', 'fav')
      if(!opening) show_favlist(()=>$target.collapse('show'));
      else if(tartype == 'fav') $target.collapse('hide');
      else{
        //show playlist
        callback = function (){
          show_favlist(()=>$target.collapse('show'));
          $target.off('hidden.bs.collapse', callback);
        }
        $target.on('hidden.bs.collapse', callback);
        $target.collapse('hide');
      }
    }
    else{
      add_search(get_music)
    }
  });

  /* when search buttons clicked */
  $('#play_search').click(function(){
    if($('#keyword').val().trim())
      play_search(get_music, alert.bind(window));
    else{
      let tartype = $($(this).attr("data-target")).attr('data');
      chrome.storage.sync.get(config => {
        play_next(config, alert.bind(window),
          tartype == 'playlist' ? show_playlist : undefined);
      });
    }
  });


  function bind_request(event){
    // Permissions must be requested from inside a user gesture, like a button's
    // click handler.
    let url = $('#custom_api').attr('data');
    chrome.permissions.request({
      //permissions: [extractHostname(url) + '/*'],
      origins: [extractHostname(url) + '/*'],
    }, function(granted){
      if (granted){
        let save = ()=>{
          chrome.storage.sync.set({
            "youtube-api-url": add_scheme(url, 'http://')
          });
          alert(`bind YouTube API URL to: ${add_scheme(url, 'http://')}`)
        }
        if(config["youtube-api-url"] && extractHostname(config["youtube-api-url"]) != extractHostname(url)){
          chrome.permissions.remove({
            //permissions: [extractHostname(url) + '/*'],
            origins: [extractHostname(config["youtube-api-url"]) + '/*'],
          }, function(removed){
            if (removed){
              // The permissions have been removed.
              alert(`remove ${extractHostname(config["youtube-api-url"]) + '/*'} success`);
              save();
            } else {
              alert("remove failed");
              // The permissions have not been removed (e.g., you tried to remove
              // required permissions).
              save();
            }
          });
        } else save();
      } else {
        alert("permissions denied!");
      }
      $('#custom_api').attr('data', '');
    });

    document.querySelector('#custom_api').removeEventListener('click', bind_request);
    document.querySelector('#custom_api').addEventListener('click', bind_api_url);
  }

  function bind_api_url(){
    chrome.storage.sync.get("youtube-api-url", (config)=>{
      let url = prompt("Input Your YouTube API URL:", config["youtube-api-url"]);
      if(url !== null){
        if(!url.length && config["youtube-api-url"] && config["youtube-api-url"].length){
          chrome.permissions.remove({
            //permissions: [extractHostname(url) + '/*'],
            origins: [extractHostname(config["youtube-api-url"]) + '/*'],
          }, function(removed){
            if (removed){
              // The permissions have been removed.
              alert(`remove ${extractHostname(config["youtube-api-url"]) + '/*'} success`);
              chrome.storage.sync.remove("youtube-api-url");
              alert("API URL removed!");
            } else {
              alert("remove permission failed");
              // The permissions have not been removed (e.g., you tried to remove
              // required permissions).
              chrome.storage.sync.remove("youtube-api-url");
              alert("API URL removed!");
            }
          });
          return;
        }
        url = url.replace(/\/ *$/, '')
        if(confirm("Do you want to test your api first?\n(you need input url and rebind again)")){
          chrome.tabs.create({url: url + '/kw?term=Yellow'});
          return;
        }
        alert(`please re-click the bind button to accept permission:\n${extractHostname(url) + '/*'}`);
        $('#custom_api').attr('data', url);
        document.querySelector('#custom_api').removeEventListener('click', bind_api_url);
        document.querySelector('#custom_api').addEventListener('click', bind_request);
      }
    });
  }
  document.querySelector('#custom_api').addEventListener('click', bind_api_url);
}

//var content = document.querySelector('#content');
function setCookie(c, callback){
  c['url'] = 'https://drrr.com';
  chrome.cookies.set(c, callback);
}

function getCookie(callback, url){
  let output = [];
  chrome.cookies.getAll({
    url : url || 'https://drrr.com'
  }, function(cookies){
    callback(cookies);
  });
}

function delCookie(name, url, callback){
  url = url || 'https://drrr.com'
  if(name) chrome.cookies.remove({
    url  : url,
    name : name
  }, callback);
}

function delCookies(list, callback, url){
  url = url || 'https://drrr.com';
  function recursive(list, cb){
    if(list.length){
      let name = list[0];
      chrome.cookies.remove({
        url  : url,
        name : name
      }, ()=> recursive(list.slice(1), cb));
    } else cb && cb();
  }
  recursive(list, callback);
}

//function store_bio(succ, fail){
//  getProfile(function(p){
//    if(p){
//      getCookie((cs)=>{
//        push_value('bio_cookies', [p, cs], (bios) => succ(bios[bios.length - 1]));
//      });
//    }
//    else fail();
//  })
//}

function redraw_bios(bio_cookies, data){
  let $stored = $('#bio_select');

  bio_cookies = bio_cookies || [];

  cache(undefined, (config)=>{
    let session = c2sess(config['cookie']);
    getProfile(function(p, err){
      if(data){
        Profile = data.profile;
        p = data.profile;
      }
      $stored.find('option').remove();
      let add_trip = (p => p && p.tripcode ? `#${p.tripcode}` : '')
      if(p){
        //let cont = `🔖 ${p.name}${add_trip(p)}@${p.icon}`;
        let c = HtmlUtil.htmlEncode(`🔖 ${p.name}@${p.loc}`);
        $stored.append(`<option value="${session}">${c}</option>`);
      }
      else{
        $stored.append(`<option value="">Not Logined</option>`);
      }

      bio_cookies.forEach(([pro, cookie])=>{
        //let c = `💾 ${pro.name}${add_trip(p)}@${pro.icon}`;
        let c = HtmlUtil.htmlEncode(`💾 ${pro.name || 'somebody' }@${pro.loc || 'somewhere'}`);
        $stored.append(`<option value="${c2sess(cookie)}">${c}</option>`);
    });
   })


  });

}

function bio_setup(config){
  let $stored = $('#bio_select');

  redraw_bios(config['bio_cookies']);

  $('#show_cookie').on('click', function(){
    getCookie((x)=>alert(JSON.stringify(x)));
  });

  $('#ch_bios').on('click', function(){
    let $stored = $('#bio_select');
    let optionSelected = $("option:selected", $stored);
    let valueSelected = $stored.val();
    if(!valueSelected)
      return alert("cannot change to not logined bio");

    cache(undefined, (config)=>{
      let session = c2sess(config['cookie']);
      getProfile(function(p){
        if(p){
          if(session == valueSelected){
            chrome.tabs.create({url: 'https://drrr.com'});
          }
          else{
            let bios = config['bio_cookies']
            let idx = bios.findIndex(([pro, cookies]) => c2sess(cookies) === valueSelected);

            getCookie((cs)=>{
              cs = cs.filter(c => c.name === "drrr-session-1")
              let curbio = [p, cs];
              let [nprofile, ncookies] = bios[idx];
              setCookies(ncookies, ()=> {
                bios.splice(idx, 1);
                bios.unshift(curbio);
                chrome.storage.sync.set({
                  'bio_cookies': bios,
                  'profile': nprofile,
                  'cookie': ncookies
                }, ()=> chrome.tabs.update(
                  { url: "https://drrr.com" },
                  ()=>redraw_bios(bios, {profile: nprofile})));
              });
            });
          }
        }
        else{
          cache(undefined, (config)=>{
            let bios = config['bio_cookies']
            let idx = bios.findIndex(([pro, cookies]) => c2sess(cookies) === valueSelected);
            let [nprofile, ncookies] = bios[idx];
            setCookies(ncookies, ()=> {
              bios.splice(idx, 1);
              chrome.storage.sync.set({
                'bio_cookies': bios,
                'profile': nprofile,
                'cookie': ncookies
              }, ()=> chrome.tabs.update(
                { url: "https://drrr.com" },
                ()=>redraw_bios(bios, {profile: nprofile})));
            });
          }, 'bio_cookies')
        }
      })
    });
  });

  $('#new_bios').on('click', function(){
    getProfile((p)=>{
      if(p){
        getCookie((cs)=>{
          cs = cs.filter(c => c.name === "drrr-session-1")
          let curbio = [p, cs]
          delCookies(cs.map(c=>c.name), ()=>{
            push_value('bio_cookies', curbio, (list)=>{
              chrome.storage.sync.remove(
                ['profile', 'cookie'],
                ()=>chrome.tabs.update(
                  { url: "https://drrr.com" },
                  (tab)=>redraw_bios(list, {profile:undefined})));
            });
          });

        });
      } else {
        alert("no cookie to store");
        chrome.tabs.update({ url: "https://drrr.com" });
      }
    })
  });

  $('#del_bios').on('click', function(){
    let $stored = $('#bio_select');
    let optionSelected = $("option:selected", $stored);
    let valueSelected = $stored.val();

    cache(undefined, (config)=>{
      let session = c2sess(config['cookie']);
      getProfile(function(p){
        if(p && session == valueSelected){
          getCookie((cs)=> {
            delCookies(cs.map(c=>c.name), ()=>{
              chrome.storage.sync.remove(
                ['profile', 'cookie'],
                ()=>chrome.tabs.update({ url: "https://drrr.com" },
                  ()=> optionSelected.replaceWith(`<option value="">Not Logined</option>`)));
            });
          });
        }
        else{
          pop_value(
            'bio_cookies',
            (([pro, cookies], idx, ary) => c2sess(cookies) == valueSelected),
            (res, cookies) => redraw_bios(cookies)
          )
        }
      })
    });
  });

  $('#imp_session').on('click', function(){
    let session = prompt(
      `Input session token:`);
    if(session !== null && session.trim()){
      let sessionCookie = {
        "domain": ".drrr.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "drrr-session-1",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": true,
        "storeId": "0",
        "value": session
      };

      getProfile(function(p){
        if(p){
          cache(undefined, (config)=>{
            let bios = config['bio_cookies']
            getCookie((cs)=>{
              cs = cs.filter(c => c.name === "drrr-session-1")
              let curbio = [p, cs];
              let [nprofile, ncookies] = [null, [sessionCookie]]
              setCookies(ncookies, ()=> {
                bios.unshift(curbio);
                chrome.storage.sync.set({
                  'bio_cookies': bios,
                  'profile': nprofile,
                  'cookie': ncookies
                }, ()=> chrome.tabs.update(
                  { url: "https://drrr.com" },
                  ()=> {
                    ajaxProfile(p => {
                      redraw_bios(bios, {profile: p})
                    }, true, 'ImportSession')
                  }
                ));
              });
            });
          }, 'bio_cookies')
        }
        else{
          cache(undefined, (config)=>{
            let bios = config['bio_cookies']
            let [nprofile, ncookies] = [null, [sessionCookie]]
            setCookies(ncookies, ()=> {
              chrome.storage.sync.set({
                'bio_cookies': bios,
                'profile': nprofile,
                'cookie': ncookies
              }, ()=> chrome.tabs.update(
                { url: "https://drrr.com" },
                ()=> {
                    ajaxProfile(p => {
                      redraw_bios(bios, {profile: p})
                    }, true, 'ImportSession')
                  }
              ));
            });
          }, 'bio_cookies')

        }
      })
    }
  })

  $('#exp_session').on('click', function(){
    cache(undefined, (config)=>{
      let copied = false;
      let session = c2sess(config['cookie']);
      if(session.length){
        copyToClipboard(session);
        copied = true;
      }
      chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: copied ? `SESSION COPIED` : `NO SESSION`,
        message: copied ? `Your session was copied to clipboard` : `Please login first`
      });
    });
  })

  if(config['zh_conv']){
    $('#zh_conv').val(config['zh_conv']);
  }

  $('#zh_conv').change(function(){
    chrome.storage.sync.set({ zh_conv: $(this).val() });
  });


  if(config['#bg-url-input']){
    $('#bg-url-input').val(config['#bg-url-input']);
  }

  $('#bg-url-set').on('click', function(){
    chrome.storage.sync.set({'#bg-url-input': $('#bg-url-input').val()});
    sendTab({ fn: change_bg_img_url, args: { url: $('#bg-url-input').val() } });
  });

  if(config['#name-color-input']){
    $('#name-color-input').val(config['#name-color-input']);
  }

  $('#name-color-set').on('click', function(){
    chrome.storage.sync.set({'#name-color-input': $('#name-color-input').val()});
    sendTab({ fn: change_name_clr, args: { color: $('#name-color-input').val() } });
  });

  if(config['#name-bg-color-input']){
    $('#name-bg-color-input').val(config['#name-bg-color-input']);
  }

  $('#name-bg-color-set').on('click', function(){
    chrome.storage.sync.set({'#name-bg-color-input': $('#name-bg-color-input').val()});
    sendTab({ fn: change_name_bg_clr, args: { color: $('#name-bg-color-input').val() } });
  });

  $('#room-msg-input').on('keypress', function(event){
    if(!event.shiftKey && (event.key === 'Enter' || event.keyCode === 13)){
      let text = $(this).val();
      chrome.storage.sync.get(SWITCH_ME, config => {
        if(config[SWITCH_ME] && !text.match(/^\/\w/)) text = '/me' + text;
        sendTab({ fn: publish_message, args: { msg: text } })
        $(this).val("");
      })
    }
  })

  $('#room-msg-send').on('click', function(){
    let text = $('#room-msg-input').val()
    chrome.storage.sync.get([SWITCH_ME], config => {
      if(config[SWITCH_ME] && !text.match(/^\/\w/)) text = '/me' + text;
      sendTab({ fn: publish_message, args: { msg: text } })
      $('#room-msg-input').val("");
    })
  });
}

// glyphicon-barcode glyphicon-qrcode
var fb_rule_types = ['glyphicon-lock', 'glyphicon-user', 'glyphicon-home'];
var fb_rule_info = ['UserTripcode (RegExp)', 'UserName (RegExp)', 'RoomName (RegExp)'];

var eager_types = ['glyphicon-barcode', 'glyphicon-lock', 'glyphicon-user', 'glyphicon-home'];
var eager_info = ['RoomID', 'UserTripcode (RegExp)', 'UserName (RegExp)', 'RoomName (RegExp)'];

function cur_type(selector, type){
  for(i = 0; i < type.length; i++){
    if($(selector).hasClass(type[i]))
      return i;
  }
  return 0;
}

function next_type(selector, type){
  return (cur_type(selector, type) + 1) % type.length;
}

function type_switch(idx, input_s, icon_s, prefix, info, type){
  idx = idx || 0;
  $(input_s).attr('placeholder', `${prefix} ${info[idx]}`)
  $(icon_s).attr('class', `glyphicon ${type[idx]}`);
}

function friend_setup(config){


  type_switch(config['fb-rule-type'], '#fb-input', '#fb_rule_type', 'Search/AddRule by', fb_rule_info, fb_rule_types);
  type_switch(config['eager-type'], '#eager-input', '#eager_type', 'Join Room when Avail by', eager_info, eager_types);
  if(config['eager-input']) $('#eager-input').val(config['eager-input']);

  $('#fb_rule_type_btn').click(()=>{
    let type = next_type('#fb_rule_type', fb_rule_types);
    chrome.storage.sync.set({
      'fb-rule-type': type
    });
    type_switch(type, '#fb-input', '#fb_rule_type', 'Search/AddRule by', fb_rule_info, fb_rule_types);
  });

  $('#eager_type_btn').click(()=>{
    let type = next_type('#eager_type', eager_types);
    chrome.storage.sync.set({
      'eager-type': type
    });
    chrome.storage.sync.remove('eager-input');
    $('#eager-input').val('');
    type_switch(type, '#eager-input', '#eager_type', 'Join Room when Avail by', eager_info, eager_types);
  });


  $('#eager-input').on('input', function(){
    $('#eager-input').parent().addClass('has-warning').removeClass('has-success').removeClass('has-error');
  });

  $('#eager-set').click(()=>{
    let input = $('#eager-input').val();
    if(cur_type('#eager_type', eager_types)){
      try{
        new RegExp(input);
      }
      catch(e){
        alert(e);
        $('#eager-input').parent().addClass('has-error').removeClass('has-success').removeClass('has-warning');
        return;
      }
    }
    chrome.storage.sync.set({
      'eager-input': input
    });
    $('#eager-input').parent().addClass('has-success').removeClass('has-error').removeClass('has-warning');
  });
  function eager_ask_mode_switch(bool){
    $('#eager-ask-icon').attr('class', `glyphicon glyphicon-${bool? 'comment' : 'send'}`);
    $('#eager-ask').attr('title', ["jump without asking", "ask before jump"][Number(bool)]);
  }
  eager_ask_mode_switch(config[EAGER_ASK]);
  $('#eager-ask').click(function(){
    let v = !$('#eager-ask-icon').hasClass('glyphicon-comment');
    chrome.storage.sync.set({
      [EAGER_ASK]: v
    });
    eager_ask_mode_switch(v);
  })

  $('#annoying-hidder').click(function(){
    chrome.storage.sync.get('annoyingList', config => {
      list = (config['annoyingList'] && JSON.stringify(config['annoyingList'])) || []
      let val = prompt(
        `Input Rule: ["银蛇", "白.*术", "#pd4/u/MwnM"]\n"##" to remove the room`, list);
      if(val !== null){
        if(val.trim()){
          try{
            rule = JSON.parse(val)
            chrome.storage.sync.set({'annoyingList' : rule})
          }
          catch(err){
            alert(err);
          }
        }
        else chrome.storage.sync.remove('annoyingList')
      }
    })
  })

  function rule_note_mode_switch(bool){
    $('#rule-note-icon').attr('class', `glyphicon glyphicon-volume-${bool? 'off' : 'up'}`);
  }
  rule_note_mode_switch(config[RULE_NOTE_MUTE]);
  $('.rule-note').click(function(){
    let v = !$('#rule-note-icon').hasClass('glyphicon-volume-off');
    chrome.storage.sync.set({
      [RULE_NOTE_MUTE]: v
    });
    rule_note_mode_switch(v);
  })

  $('.fb-opener').on('click', function (){
    let $target = $($(this).attr("data-target"));
    let tartype = $target.attr('data');
    let opening = $target.hasClass('in');
    let opener = {
      'home-opener': show_homelist,
      'friend-opener': show_friendlist,
      'tripcode-opener': show_tripcodelist,
      'room-opener': show_roomlist,
      'fb-search-opener': show_fbsearchlist,
      'fb-rule-opener': show_fbrulelist,
    }[this.id];
    $target.attr('data', this.id);
    if(!opening){
      opener(()=>$target.collapse('show'));
    }
    else if(tartype == this.id) $target.collapse('hide');
    else{
      //show roomlist
      callback = function (){
        opener(()=>$target.collapse('show'));
        $target.off('hidden.bs.collapse', callback);
      }
      $target.on('hidden.bs.collapse', callback);
      $target.collapse('hide');
    }
    $('#fb-input').val('');
  });

  // if add enter?
  $('#fb-input')[0].addEventListener('keyup', function(v){
    if(v.keyCode == 13){
      if($(this).val().length){
        if(!v.shiftKey && !v.ctrlKey)
          $('#fb-search-opener').click();
        else if(v.shiftKey && !v.ctrlKey)
          $('#fb-add-rule').click();
        else if(!v.shiftKey && v.ctrlKey)
          $('#room-opener').click();
      }
      else{
        if(!v.shiftKey && !v.ctrlKey)
          $('#tripcode-opener').click();
        else if(v.shiftKey && !v.ctrlKey)
          $('#friend-opener').click();
        else if(!v.shiftKey && v.ctrlKey)
          $('#home-opener').click();
        else if(v.shiftKey && v.ctrlKey)
          $('#room-opener').click();
      }
      $('#fb-input').val('');
      $('#fb-input').change();
      $('#fb-input').focus();
    }
  }, false);

  $('#fb-input').on('input focus', function(e){
    if(e.type == 'focus') $('#fb_list').collapse('hide');
    if($(this).val().trim()){
      $('.fb-on-input').show();
      ////$('.fb-off-input').hide();
    }
    else{
      //$('#fb-input').val('');
      //$('#fb-input').change();
      //$('.fb-on-input').hide();
      //$('.fb-off-input').show();
    }
  });

  $('#fb-add-rule').on('click', function(e){
    let type = cur_type('#fb_rule_type', fb_rule_types);
    let list = [TRIPCODES, FRIENDS, HOMES][type]
    let rule = $('#fb-input').val();
    try{
      new RegExp(rule);
    }
    catch(e){
      return alert(e);
    }
    push_value(list, rule);
    chrome.notifications.create({
      type: "basic",
      iconUrl: '/icon.png',
      title: `${list.toUpperCase()} UPDATE`,
      message: `RegExp Rule ${rule} is added to ${list}`
    });
    $('#fb-input').val('');
    $('#fb-input').change();
    $('#fb-input').focus();
  })
}


function friend_bio_setup(config){
  friend_setup(config);
  bio_setup(config);
}

function extract_sticker_data(url){
  return (x=>x && x.filter(x=>x).slice(1))(url.match(/.*store.line.me\/(.*\/product)\/(\w*)|.*store.line.me\/(.*\/sticker)\/(\w*)/));
}

var default_stickers = [
  ["LV1.野生喵喵怪", "stickershop/product", "6996333"],
  ["LV2.野生喵喵怪", "stickershop/product", "7431735"],
  ["LV3.野生喵喵怪", "stickershop/product", "8233424"],
  ["LV4.野生喵喵怪", "stickershop/product", "9435002"],
  ["LV5.野生喵喵怪", "stickershop/product", "9434741"],
  ["LV6.野生喵喵怪", "stickershop/product", "9329100"],
  ["LV7.野生喵喵怪", "stickershop/product", "9786706"],
  ["LV8.野生喵喵怪", "stickershop/product", "10247167"],
  ["LV9.野生喵喵怪", "stickershop/product", "10567103"],
  ["LV10.野生喵喵怪","stickershop/product", "10514415"],
]

function sticker_url(data){
  return `https://store.line.me/${data[data.length - 2]}/${data[data.length - 1]}`;
}

function reset_stickers(){
  let $stored = $('#store_stickers');
  let stickers = default_stickers;
  let select_data = stickers[0];
  let select = sticker_url(select_data);
  chrome.storage.sync.set({
    'stickers': default_stickers,
    'select_stickers': select_data
  });
  $stored.find('option').remove();
  stickers.forEach((data)=>{
    $stored.append(`<option value="${sticker_url(data)}">${data[0]}</option>`);
  })
  $stored.val(select);
  $stored.change();
  return [stickers, select];
}

s = undefined;
t = undefined;
function sticker_setup(config){

  let $stored = $('#store_stickers');
  let $target = $($stored.attr("data-target"));

  let stickers = config['stickers'];
  let select_data = config['select_stickers'];
  let select = select_data && sticker_url(select_data);
  if(!stickers || !stickers.length) [stickers, select] = reset_stickers();
  else{
    if(!select){
      select_data = stickers[0];
      chrome.storage.sync.set({'select_stickers': select_data });
      select = sticker_url(select_data);
    }
    stickers.forEach((data)=>{
      $stored.append(`<option value="${sticker_url(data)}">${data[0]}</option>`);
    })
    $stored.val(select);
  }


  $('.nav-tabs a').on('shown.bs.tab', ((showen) => function(event){
    if('LineSticker' == $(event.target).text() && !showen){
      showen = true;
      show_stickergrid(select, ()=>$target.collapse('show'));
    }
  })(false));

  let sel_callback = function (e){
    let optionSelected = $("option:selected", this);
    let valueSelected = this.value;
    let $target = $($(this).attr("data-target"));
    let tartype = $target.attr('data');
    let opening = $target.hasClass('in');
    $target.attr('data', this.id);
    show_stickergrid(valueSelected, ()=>$target.collapse('show'));
    chrome.storage.sync.set({ 'select_stickers': extract_sticker_data(valueSelected) });
  }
  $stored.on('change', sel_callback);
  $stored.on('click', sel_callback).click();

  $('#reset-sticker').on('click', reset_stickers);
  $('#del_sticker').on('click', function(){
    let $stored = $('#store_stickers');
    let optionSelected = $("option:selected", $stored);
    let valueSelected = $stored.val();
    if($("option", $stored).length > 1){
      pop_value('stickers', ((data, idx, ary) => data[0] === optionSelected.text() && sticker_url(data) == valueSelected))
      optionSelected.remove();
      $stored.change();
    }
    else{
      alert("cannot delete last sticker");
    }
  });

  $('#add_sticker').on('click', function(){
    let error = () => alert(", you refer the 'goto store button'");
    let url = prompt('input the Line sticker URL:');
    sticker_data = extract_sticker_data(url);
    if(sticker_data){
      $.ajax({
        type: "GET",
        url: url,
        dataType: 'text',
        success: function(data){
          let nodes = $(data);
          let tidx = Object.values(nodes).findIndex((v)=>v.nodeName == 'TITLE')
          let name = tidx >= 0 ? nodes[tidx].textContent : '';
          let idx = name.indexOf(' – LINE貼圖 | LINE STORE')
          idx = idx < 0 ? name.indexOf(' – LINE表情貼 | LINE STORE') : idx;
          name = name.substring(0, idx);
          let urls = extractImagesFromNodes(nodes);

          if(!urls.length) return alert("cannot find any sticker in the page");

          if(!name){
            //let i = Object.values(nodes).findIndex((v)=>v.nodeName == 'H3');
            let tags = nodes.find('h3')
            if(tags.length) name = tags[0].textContent;
          }

          name = prompt(chrome.i18n.getMessage("rename_as"),
            name ? name : chrome.i18n.getMessage("sticker"));
          name = name ? name : chrome.i18n.getMessage("sticker");

          push_value('stickers', [name].concat(sticker_data));
          let select = sticker_url(sticker_data);
          idx = $('option', $stored).length;
          $stored.append(`<option value="${select}">${name}</option>`);
          $stored[0].selectedIndex = idx;
          $stored.change();
        },
        error: function(data){
          alert("Error on getting sticker URL: " + JSON.stringify(data));
        }
      });
    } else alert('URL should be something likes https://store.line.me/\\.*/(product|sticker)/\\w*');
  });

  $('#sticker-store-opener').on('click', function(){
    chrome.tabs.create({url: 'https://store.line.me/home/zh-Hant'});
  });

}

function module_setup(config){
  Object.keys(module_mapping).forEach((v)=>{
    $('#module-select').append(`<option style="text-align:center; text-align-last:center;" value="${v}">${v}</option>`);
  })

  let select_module = config['select_module'];
  if(!select_module) select_module = 'none';
  $('#module-select').val(select_module);

  let $target = $($('#module-select').attr("data-target"));
  import(`/module/${module_mapping[select_module]}`).then(
    (module)=>{
      if(module.ui && module.ui_event){
        $('#module_list_container').html(module.ui())
          .promise().then(()=>{
            $target.collapse('show').promise().then(
              ()=> module.ui_event(config)
            );
          });
      } else $target.collapse('hide');
    });

  $('#module-select').on('change', function (e){
    let optionSelected = $("option:selected", this);
    let valueSelected = this.value;
    let $target = $($(this).attr("data-target"));
    let tartype = $target.attr('data');
    let opening = $target.hasClass('in');

    $target.attr('data', this.id);

    chrome.storage.local.set({
      'select_module': valueSelected
    });

    chrome.storage.local.get((config)=>{
      import(`/module/${module_mapping[valueSelected]}`).then(
        (module)=>{
          if(module.ui && module.ui_event){
            $('#module_list_container').html(module.ui(config))
              .promise().then(()=>{
                $target.collapse('show').promise().then(
                  ()=> module.ui_event(config)
                )
              });
          } else $target.collapse('hide');
        });
    })
  });
}

function plugin_edit_freeze(bool){
  $('#plugin-select').attr('disabled', bool)
  $('#add_plugin').attr('disabled', bool)
  $('#del_plugin').attr('disabled', bool)
  $('#plugin-code').attr('disabled', !bool);
}

function set_builtin_plugins(reset){
  let load = reset ? (set_plugin => {
    chrome.storage.local.get("plugins", config => { set_plugin(config); });
  }) : (set_plugin => set_plugin({}))

  load(config => {
    config["plugins"] = config["plugins"] || {};
    for(let plug_name in builtin_plugins)
      config["plugins"][plug_name] = builtin_plugins[plug_name];
    chrome.storage.local.set({ "plugins": config["plugins"] })
    init_plugin(config);
  });
}

function init_plugin(config){
  if(config['plugins']){
    $('#plugin-select').empty();

    let plugins = Object.keys(config['plugins'])
      .filter(name => name !== 'chatroom_hooks');
    plugins.unshift('chatroom_hooks');

    plugins.forEach((name)=>{
      let [mode, loc, enable, ctx] = config['plugins'][name];
      $('#plugin-select').append(
        `<option style="text-align:center; text-align-last:center;"
          title="${mode == 'url' ? ctx : 'code'}"
          value="${name}">${name}/${loc}/${mode}</option>`);
      if(mode !== 'url'){
        $('#plugin-code').val(ctx);
        $('#plugin-codeblock').show();
      }
    })

    let select_plugin = config['select_plugin'];
    if(!select_plugin) select_plugin = 'chatroom_hooks';

    if(config['plugins'][select_plugin]){
      let [mode, loc, enable, ctx] = config['plugins'][select_plugin];
      $('#plugin-select').val(select_plugin);
      let plugin_switch = enable;
      $('#plugin-switch').attr('class', `fa fa-toggle-${enable ? 'on' : 'off'}`);
      if(mode !== 'url'){
        $('#plugin-codeblock').show();
        $('#plugin-code').val(ctx);
      }
    }
  }
  else set_builtin_plugins(false);
}

function local_setup(config){
  Object.keys(local_functions).forEach((v)=>{
    $('#local-select').append(`<option style="text-align:center; text-align-last:center;" value="${v}">${v}</option>`);
  })

  let select_local = config['select_local'];
  if(!select_local) select_local = Object.keys(local_functions)[0];

  $('#local-select').val(select_local);
  let local_switch = config[`switch_${select_local}`];
  $('#local-switch').attr('class', `fa fa-toggle-${local_switch ? 'on' : 'off'}`);

  $('#local-switch-btn').click(function(){
    let v = !$('#local-switch').hasClass(`fa-toggle-on`);
    let sel = $('#local-select')[0];
    let optionSelected = $("option:selected", sel);
    let valueSelected = sel.value;
    chrome.storage.local.set({
      ['switch_' + valueSelected]: v
    });
    $('#local-switch').attr('class', `fa fa-toggle-${v ? 'on' : 'off'}`);
  });

  $("#plug").click(function(){
    chrome.tabs.create({url: chrome.extension.getURL(`setting/plugin/index.html`)});
  });

  $("#local-setting-btn").click(function(){
    let sel = $('#local-select')[0];
    let optionSelected = $("option:selected", sel);
    let valueSelected = sel.value;
    chrome.tabs.create({url: chrome.extension.getURL(`setting/plugin/index.html#menu${Object.keys(local_functions).indexOf(valueSelected)}`)});
  });

  $('#local-select').on('change', function (e){
    let optionSelected = $("option:selected", this);
    let valueSelected = this.value;

    chrome.storage.local.set({
      'select_local': valueSelected
    }, function(){
      chrome.storage.local.get((config)=>{
        let local_switch = config['switch_' + valueSelected];
        $('#local-switch').attr('class', `fa fa-toggle-${local_switch ? 'on' : 'off'}`);
      });
    });
  });

  init_plugin(config);

  $('#upload_img').on('click', function(){
     chrome.tabs.create({url: 'https://imgtu.com/'});
  });

  $('#reset_plugin').on('click', function(){
    if(confirm("reset built-in plugins?"))
      set_builtin_plugins(true);
  });

  $('#write_plugin').on('click', function(){
    if(!$('#plugin-codeblock').is(":visible")){

      let valueSelected = $('#plugin-select').val();

      if(!valueSelected) return alert("the plugin is not editable");

      let url = prompt('edit the src url:', $('#plugin-select option:selected').attr('title'));

      if(url === null) return;

      chrome.storage.local.get("plugins", (config)=>{
        config["plugins"] = config["plugins"] || {}
        config["plugins"][valueSelected][3] = url;
        chrome.storage.local.set({ "plugins": config["plugins"] })
      });
    }

    if($('#save-plugin').is(":visible")){
      let $stored = $('#plugin-select');
      $stored.change();
      plugin_edit_freeze(false);
      $('#save-plugin').hide();
    }
    else{
      plugin_edit_freeze(true);
      $('#save-plugin').show();
    }
  });

  $('#save-plugin').on('click', function(){

    let $stored = $('#plugin-select');
    let valueSelected = $stored.val();

    if(!valueSelected){
      let name = prompt(chrome.i18n.getMessage("rename_as"),
        name ? name : chrome.i18n.getMessage("plugin"));

      if(name === null) return plugin_edit_freeze(false);

      name = name ? name : chrome.i18n.getMessage("plugin");

      let loc = prompt("location (room/lounge/login)", "room");

      if(loc === null) return plugin_edit_freeze(false);
    }
    else name = valueSelected;

    chrome.storage.local.get("plugins", (config)=>{
      config["plugins"] = config["plugins"] || {}
      let $stored = $('#plugin-select');
      if(!config["plugins"][name]){
        config["plugins"][name] = ['code', loc, true, $('#plugin-code').val()];
        let idx = $('option', $stored).length;
        $stored.append(`<option style="text-align:center; text-align-last:center;"
                                value="${name}" title="code">${name}/${loc}/code</option>`);
        $stored[0].selectedIndex = idx;
      }
      else{
        config["plugins"][name][3] = $('#plugin-code').val();
      }
      chrome.storage.local.set({ "plugins": config["plugins"] })
      $stored.change();
      $(this).hide();
      plugin_edit_freeze(false)
    });
  });

  $('#add_plugin').on('click', function(){
    let error = () => alert(", you refer the 'goto store button'");
    let ctx = prompt('input the plugin source code URL (empty for writing source):');
    if(ctx === null) return;

    let mode = ctx ? 'url' : 'code';
    ctx = ctx ||
      `// your javascript here ... example:
/*
function plugin_logger(event){ console.log(event); }
plugin_hooks.push(plugin_logger);
*/`;

    if(ctx.includes('gist.githubusercontent.com')
      || ctx.includes('raw.githubusercontent.com'))
      return alert('Use https://raw.githack.com to convert gist URL');

    let $stored = $('#plugin-select');

    let name = prompt(chrome.i18n.getMessage("rename_as"), chrome.i18n.getMessage("plugin"));

    if(name === null) return;

    name = name ? name : chrome.i18n.getMessage("plugin");

    let loc = prompt("location (room/lounge/login)", "room");

    if(loc === null) return;

    chrome.storage.local.get("plugins", (config)=>{
      config["plugins"] = config["plugins"] || {}

      while(config["plugins"][name]){
        if(confirm("overwrite existing plugin?")) break;
        else {
          name = prompt(chrome.i18n.getMessage("rename_as"),
            chrome.i18n.getMessage("plugin") + '2')
          if(name === null) return;
          name = name ? name : chrome.i18n.getMessage("plugin");
        }
      }

      config["plugins"][name] = [mode, loc, true, ctx];
      chrome.storage.local.set({ "plugins": config["plugins"] })
    });

    let idx = $('option', $stored).length;
    $stored.append(`<option style="text-align:center; text-align-last:center;"
      value="${name}" title="${mode == 'url' ? ctx : 'code'}">${name}/${loc}/${mode}</option>`);
    $stored[0].selectedIndex = idx;
    $stored.change();
  });

  $('#del_plugin').on('click', function(){
    let $stored = $('#plugin-select');
    let optionSelected = $("option:selected", $stored);
    let valueSelected = $stored.val();
    if(!valueSelected) return alert("no plugin selected");
    if(valueSelected === 'chatroom_hooks')
      return alert("You cannot delete chatroom_hooks");
    if($("option", $stored).length){
      chrome.storage.local.get("plugins", (config)=>{
        delete config["plugins"][valueSelected]
        chrome.storage.local.set({ "plugins": config["plugins"] })
      });
      optionSelected.remove();
      $stored.change();
    }
  });

  $('#plugin-select').on('change', function (e){
    let optionSelected = $("option:selected", this);
    let valueSelected = this.value;
    chrome.storage.local.set({
      'select_plugin': valueSelected
    }, function(){
      chrome.storage.local.get((config)=>{
        if(config['plugins'][valueSelected]){
          let [mode, loc, enable, ctx] = config['plugins'][valueSelected]
          $('#plugin-switch').attr('class', `fa fa-toggle-${enable ? 'on' : 'off'}`);
          if(mode == 'url'){
            $('#plugin-codeblock').hide();
            $('#plugin-code').val('');
          }
          else {
            $('#plugin-code').val(ctx);
            $('#plugin-codeblock').show();
          }
        }
        else{
          $('#plugin-codeblock').hide();
          $('#plugin-code').val('');
          $('#plugin-switch').attr('class', `fa fa-toggle-off`);
        }
      });
    });
  });

  $('#plugin-switch-btn').click(function(){
    let v = !$('#plugin-switch').hasClass(`fa-toggle-on`);
    let sel = $('#plugin-select')[0];
    let optionSelected = $("option:selected", sel);
    let valueSelected = sel.value;
    if(!valueSelected) return;
    chrome.storage.local.get("plugins", (config)=>{
      config["plugins"][valueSelected][2] = v;
      chrome.storage.local.set({ "plugins": config["plugins"] })
    });
    $('#plugin-switch').attr('class', `fa fa-toggle-${v ? 'on' : 'off'}`);
  });
}

function plugTag(type, attr){
  let tag = document.createElement(type);
  for(at in attr)
    tag[at] = attr[at];
  document.getElementsByTagName('head')[0].appendChild(tag);
}

var tabInit = {
  'tab1': () => { $("#room-msg-input").focus(); },
  'tab2': () => {},
  'tab0': () => {},
  'tab3': () => {},
  'tab5': () => {},
  'tab4': () => {},
}

var popupTypedStorage = ($) => {
  if(!$) return chrome.storage.sync;
  let type = $("#storage-type")
               .hasClass('fa-hdd-o')
               ? "local" : "sync";
  return chrome.storage[type];
}

function template_setting($){
  var template = {}
  $(`.${class_map[SWITCH]}`).each(function(){
    template[this.id] = $(this).prop('checked');
  });
  return template;
}

function switch_synclocal_defaults(){
 return {
   [SWITCH_BANABUSE]: false,
   [SWITCH_EVENTACT]: false,
   [SWITCH_BANLIST ]: false,
   [SWITCH_TIMER   ]: false,
   [SWITCH_WELCOME ]: false,
 };
}

function update_switches($, state){
  // var state = {};
  // Object.assign(state, JSON.parse(JSON.stringify(
  //   !Object.keys(config).length ? defaults : config)));
  // let state = !Object.keys(config).length ? defaults : config;
  $(`.${class_map[SWITCH]}`).each(function(){
    $(this).bootstrapSwitch('state', state[this.id] || false, true);
  })
}

function localStorageGet(type){
  if(type == 'fa-cloud')
    return cb => cb(null)
  let storage = popupTypedStorage($);
  return storage.get.bind(storage);
}

function header_setup(config){
  $("#manual").click(open_manual);
  $("#cog").click(open_background);
  $("#program").click(function(){
    chrome.tabs.create({url: chrome.extension.getURL('setting/script/index.html')});
  });
  $("#video-guide").click(function(){
    chrome.tabs.create({url: 'https://www.youtube.com/playlist?list=PLaNluYBUsQrKe_faeHaFsKo9SkQzkQFOk'});
  });

  function setStorageType(type, dom){
    if(!dom) dom = $("#storage-type");
    dom.removeClass('fa-hdd-o').removeClass('fa-cloud').addClass(type);
  }
  $("#storage-toggle").click(function(){
    let dom = $("#storage-type");
    let type = dom.hasClass('fa-hdd-o') ? 'fa-cloud' : 'fa-hdd-o';
    setStorageType(type, dom);
    popupTypedStorage().set({"#storage-type": type});
    $('.setting').get().forEach(dom => {
      let icon = type == 'fa-cloud' ? '☁️' : '🖴';
      let name = type == 'fa-cloud' ? 'sync' : 'local';
      let suffix = `(${icon} ${name} ⚙ setting)`
      dom.title = dom.title.split('\n')[0] + '\n' + suffix;
    })
    popupTypedStorage().get((config) => {
      localStorageGet(type)((localConfig) => {
        let cfg = template_setting($);
        let slcfg = switch_synclocal_defaults();
        if(localConfig){
          Object.assign(slcfg, localConfig);
          Object.assign(config, slcfg);
        }
        Object.assign(cfg, config);
        update_switches($, cfg);
      });
    });
  });
  setStorageType(config["#storage-type"] || 'fa-cloud');
}

$(document).ready(function(){

  plugTag('link', {
    id: 'theme',
    rel: 'stylesheet',
    href: '/popup/theme.css'
  })

  $("#tripgen").click(open_tripgen);
  $("#goto-dc").click(function(){
    chrome.tabs.create({url: 'https://discord.com/invite/BBCw3UY'});
  });
  $("#wizard").click(function(){
    sendTab({ fn: call_wizard, args: {} });
  });
  $("#wizard-size").click(function(){
    alert("live2d is not supported on firefox");
  });
  $("#live2d").click(function(){
    alert("live2d is not supported on firefox");
  });

  /* ensure activate the background page */
  chrome.runtime.sendMessage({ type: 'popup' },
    () => bkg().make_switch_panel($, '#switch_panel'));

  chrome.storage.sync.get((config)=>{
    header_setup(config);
    music_bar_setup(config);
    sticker_setup(config);
    friend_bio_setup(config);
    chrome.storage.local.get((config)=>{
     local_setup(config)
     module_setup(config);
    });
    let tab = config['pop-tab'] || 'tab0';
    $(`#${tab} > a`).click();
    tabInit[tab] && tabInit[tab]();
    $('.pop-tab').on('click', function(){
      chrome.storage.sync.set({'pop-tab': this.id});
    })
  });
});


chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if(req && req.expired_bio){
    let $stored = $('#bio_select');
    let optionSelected = $("option:selected", $stored);
    optionSelected.replaceWith(`<option value="">Not Logined</option>`);
  }
  if(callback) callback();
});
