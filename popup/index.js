var bkg = chrome.extension.getBackgroundPage;

function open_manual(){
  var language = window.navigator.userLanguage || window.navigator.language;
  if(language == 'zh-CN' || language == 'zh-TW')
    chrome.tabs.create({url: chrome.extension.getURL('manuals/manual-zh.html')});
  else
    chrome.tabs.create({url: chrome.extension.getURL('manuals/manual-en.html')});
}

function open_background(){
  chrome.tabs.create({url: chrome.extension.getURL('setting/index.html')});
}

function open_tripgen(){
  chrome.tabs.create({url: chrome.extension.getURL('setting/tripcode.html')});
}

function get_music(callback){
  var keyword = $('#keyword').val();
  var source = $('#music_source').val();
  if(keyword) {
    music_api(keyword, callback, {
      log: alert.bind(window),
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

var list_template = (args, btns) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon ${args.icon || 'glyphicon-music'}"></i></span>
     <span class="input-group-addon form-control panel-footer text-center"
            title="${args.title}">${args.content}</span>
     <div class="input-group-btn">
        ${btns.map((b) => b(args)).join('')}
     </div>
 </div>`;

var grid_row_template = (ctx) =>
`<div class="row" style="display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; padding: 0 4px;">${ctx}</div>`

var grid_col_template = (args, btns) =>
`<div class="column hover09" style="${args.colstyle}">${btns.map((b) => b(args)).join('')} </div>`


var empty_template = (name, icon) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon ${icon || 'glyphicon-music'}"></i></span>
     <span class="input-group-addon form-control panel-footer text-center">${name}</span>
 </div>`;

var sticker_src = (args) => `${args.url}`
var sticker_btn = (args) =>
  `<figure><img src="${sticker_src(args)}" class="sticker-btn" style="${args.imgstyle}"></figure>`

var imm_play_data = (args) => `${args.data}`
var imm_play_btn = (args) =>
`<button class="btn btn-default imm-play" type="submit"
         data="${imm_play_data(args)}"     title="play the song immediately">
     <i class="glyphicon glyphicon-play"></i>
  </button>`

var imm_pldl_data = (args) => `${args.data}`
var imm_pldl_btn = (args) =>
`<button class="btn btn-default imm-pldl" type="submit" data-idx="${args.idx}"
         data="${imm_pldl_data(args)}"     title="play the song immediately">
     <i class="glyphicon glyphicon-play"></i>
  </button>`

var add_song_data = (args) => `${args.data}`
var add_song_btn = (args) =>
`<button class="btn btn-default add-song" type="submit"
         data="${add_song_data(args)}"     title="add the song the playlist">
     <i class="glyphicon glyphicon-plus"></i>
 </button>`

var fav_song_data = (args) => `${args.data}`
var fav_song_btn = (args) =>
`<button class="btn btn-default fav-song" type="submit"
         data="${fav_song_data(args)}"     title="add the song the favlist">
     <i class="glyphicon glyphicon-heart"></i>
 </button>`

var del_song_data = (args) => `${args.idx}`
var del_song_btn = (args) =>
  `<button class="btn btn-default del-song" type="submit"
         data="${del_song_data(args)}"   title="remove the song from playlist">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

var vaf_song_data = (args) => `${args.idx}`
var vaf_song_btn = (args) =>
  `<button class="btn btn-default vaf-song" type="submit"
         data="${vaf_song_data(args)}"   title="remove the song from favlist">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

var goto_room_data = (args) => `${args.can ? args.url : args.roomId}`
var goto_room_btn = (args) =>
  `<button class="btn btn-default goto-room" type="submit"
         data="${goto_room_data(args)}"   title="${args.can ? 'goto the room' : 'wait to join'}">
     <i class="glyphicon  ${args.can ? 'glyphicon-plane' : 'glyphicon-tag'}"></i>
  </button>`


var del_fbrule_data = (args) => `${args.data}-${args.idx}`
var del_fbrule_btn = (args) =>
  `<button class="btn btn-default del-fbrule" type="submit"
         data="${del_fbrule_data(args)}"   title="remove the rule">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

function bind_sticker(args){
  $(`img[src="${sticker_src(args)}"]`).click(function(){
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
  $(`.imm-play[data="${imm_play_data(args)}"]`).click(function(){
    playMusic(
      $(this).parent().prev().text(),
      $(this).attr('data'),
      alert.bind(window)
    );
  })
}

function bind_imm_pldl(args){
  $(`.imm-pldl[data="${imm_pldl_data(args)}"]`).click(function(){
    playMusic(
      $(this).parent().prev().text(),
      $(this).attr('data'),
      alert.bind(window)
    );
    del_song(PLAYLIST, $(this).attr('data-idx'), (res) => res && show_playlist(), true);
  })
}

function bind_fav_song(args){
  $(`.fav-song[data="${fav_song_data(args)}"]`).click(function(){
    var title = $(this).parent().prev().attr('title');
    var idx = title.lastIndexOf(' - ');
    add_song(
      FAVLIST,
      title.substring(0, idx),
      $(this).attr('data'),
      title.substring(idx + 3)
    );
  })
}

function bind_add_song(args){
  $(`.add-song[data="${add_song_data(args)}"]`).click(function(){
    var title = $(this).parent().prev().attr('title');
    var idx = title.lastIndexOf(' - ');
    add_song(
      PLAYLIST,
      title.substring(0, idx),
      $(this).attr('data'),
      title.substring(idx + 3)
    );
  })
}

function bind_del_song(args){
  $(`.del-song[data="${del_song_data(args)}"]`).click(function(){
    del_song(PLAYLIST, $(this).attr('data'), (res) => res && show_playlist(), false);
  });
}

function bind_vaf_song(args){
  $(`.vaf-song[data="${vaf_song_data(args)}"]`).click(function(){
    del_song(FAVLIST, $(this).attr('data'), (res) => res && show_favlist(), false);
  });
}

function bind_goto_room(args){
  $(`.goto-room[data="${goto_room_data(args)}"]`).click(function(){
    var toURL = $(this).attr('data');
    if(toURL.startsWith('https'))
      chrome.storage.sync.set(
        {'jumpToRoom': toURL },
        ()=> sendTab({ fn: leave_room }, ()=>{
          chrome.tabs.update({ url: toURL });
        })
      );
    else{
      var type = 0;
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
  $(`.del-fbrule[data="${del_fbrule_data(args)}"]`).click(function(){
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
  var cont = (!Array.isArray(entries) ? entries :
    entries.map((args)=> list_template(args, btns)).join(''))
  var func = extend ? 'append' : 'html';
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

function show_searchlist(callback){
  get_music((keyword, source, data) =>
    show_list(
      '#list_container',
      Object.keys(api[source].songs(data)).map((idx)=>{
        var name = api[source].name(data, idx);
        var singer = api[source].singer(data, idx);
        return ({
          icon: 'glyphicon-search',
          title: `${name} - ${singer}`,
          content: ommited_name(name, singer),
          data: api[source].link(data, idx)
        });
      }), [add_song_btn, imm_play_btn, fav_song_btn], callback
    )
  );
}

function maxFreqElt(array)
{
  if(array.length == 0)
    return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for(var i = 0; i < array.length; i++)
  {
    var el = array[i];
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
  var urls = Object.values(nodes.find('.FnStickerPreviewItem')).map(
    (node) => {
      if($(node).attr('data-preview')){
        var attr = $(node).attr('data-preview');
        var view = JSON.parse(attr);
        if(view.animationUrl && view.animationUrl.length)
          return view.animationUrl;
        else return view.staticUrl;
      }
      return "";
    }
  ).filter((v)=>v.length);
  if(urls.length) return urls;
  urls = nodes.find('.FnImage').toArray().map(u=>{
    var attr = $(u).css('background-image')
    return attr.substring(attr.indexOf('https'), attr.indexOf('")'))
  }).filter((v)=>v.length);
  if(urls.length) return urls;

  var k = maxFreqElt(nodes.find('span').map(function(){ return this.className; }))
  urls = nodes.find(`.${k}`).toArray().map(u=>{
    var attr = $(u).css('background-image')
    return attr.substring(attr.indexOf('https'), attr.indexOf('")'))
  }).filter((v)=>v.length);
  return urls.unique();

}

function show_stickergrid(url, callback){
  $.ajax({
    type: "GET",
    url: url,
    dataType: 'html',
    success: function(data){

      var nodes = $(data);

      var urls = extractImagesFromNodes(nodes);

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
      alert("Error: " + JSON.stringify(data));
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
  var option = {};
  var type = cur_type('#fb_rule_type', fb_rule_types);
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
        function(a,b) {return (a.language > b.language) ? 1 : ((b.language > a.language) ? -1 : 0);}
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

function show_configlist(container, conf_type, callback, buttons, empty_name, attrs){
  chrome.storage.sync.get(conf_type, (config) => {
    function recursive(cfs, callback, ext){
      if(cfs.length){
        conf = cfs[0];
        var list = config[conf];
        if(list && list.length){
          show_list(
            container,
            Object.keys(list).map((idx) => {
              var icon = attrs.icon;
              icon = typeof icon === 'string' ? icon : icon(conf, list[idx]);
              var title = attrs.title(conf, list[idx]);
              var content = attrs.content(conf, list[idx]);
              var data = attrs.data(conf, list[idx]);
              return ({
                idx: idx,
                conf: conf,
                icon: icon,
                title: title,
                content: content,
                data: data,
              });
            }), buttons, ()=>recursive(cfs.slice(1), callback, true), ext
          )
        }
        else{
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
      title: (c, l) => `${l.name} - ${l.singer}`,
      content: (c, l) => ommited_name(l.name, l.singer),
      data: (c, l) => l.link,
      icon: 'glyphicon-list'
    });
}

function show_favlist(callback){
  show_configlist(
    '#list_container',
    FAVLIST, callback,
    [add_song_btn, imm_play_btn, vaf_song_btn],
    'EMPTY FAVLIST', {
      title: (c, l) => `${l.name} - ${l.singer}`,
      content: (c, l) => ommited_name(l.name, l.singer),
      data: (c, l) => l.link,
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

function music_bar_setup(config){
  /* music mode change */
  function mode_switch(bool){
    if(bool){
      $('#mode_type').attr('class', 'glyphicon glyphicon-music');
      $('#music_mode').attr('title', 'single mode, play one song at a time')
    }
    else{
      $('#mode_type').attr('class', 'glyphicon glyphicon-cd');
      $('#music_mode').attr('title', 'album mode, continue playing if any song in playlist')
    }
  }

  /* handle config[MUSIC_MODE] be undefined slightly */
  mode_switch(config[MUSIC_MODE] === SINGLE_MODE);
  $('#music_mode').click(()=>{
    chrome.storage.sync.set({
      [MUSIC_MODE]: $('#mode_type').hasClass('glyphicon-cd') ? SINGLE_MODE : ALBUM_MODE
    });
    mode_switch($('#mode_type').hasClass('glyphicon-cd'));
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

  $('#music_list_opener').on('click', function () {
    var $target = $($(this).attr("data-target"));
    var tartype = $target.attr('data');
    var opening = $target.hasClass('in');

    if($('#list_type').hasClass('glyphicon-list')){
      $target.attr('data', 'playlist');
      if(!opening) show_playlist(()=>$target.collapse('show'));
      else if(tartype == 'playlist') $target.collapse('hide');
      else{
        //show playlist
        callback = function () {
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
    var $target = $($(this).attr("data-target"));
    var tartype = $target.attr('data');
    var opening = $target.hasClass('in');
    if($('#fav_add_icon').hasClass('glyphicon-heart')){
      $target.attr('data', 'fav')
      if(!opening) show_favlist(()=>$target.collapse('show'));
      else if(tartype == 'fav') $target.collapse('hide');
      else{
        //show playlist
        callback = function () {
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
      var tartype = $($(this).attr("data-target")).attr('data');
      play_next(undefined, alert.bind(window),
        tartype == 'playlist' ? show_playlist : undefined);
    }
  });
}

//var content = document.querySelector('#content');
function setCookie(c, callback) {
  c['url'] = 'https://drrr.com';
  chrome.cookies.set(c, callback);
}

function getCookie(callback, url) {
  var output = [];
  chrome.cookies.getAll({
    url : url || 'https://drrr.com'
  }, function(cookies){
    callback(cookies);
  });
}

function delCookie(name, url, callback) {
  url = url || 'https://drrr.com'
  if(name) chrome.cookies.remove({
    url  : url,
    name : name
  }, callback);
}

function delCookies(list, callback, url) {
  url = url || 'https://drrr.com';
  function recursive(list, cb){
    if(list.length){
      var name = list[0];
      chrome.cookies.remove({
        url  : url,
        name : name
      }, ()=> recursive(list.slice(1), cb));
    } else cb && cb();
  }
  recursive(list, callback);
}

function store_bio(succ, fail){
  getProfile(function(p){
    if(p){
      getCookie((cs)=>{
        push_value('bio_cookies', [p, cs], (bios) => succ(bios[bios.length - 1]));
      });
    }
    else fail();
  })
}

function redraw_bios(bio_cookies, data){
  var $stored = $('#bio_select');

  bio_cookies = bio_cookies || [];

  getProfile(function(p, err){
    if(data){
      Profile = data.profile;
      p = data.profile;
    }
    $stored.find('option').remove();
    var add_trip = (p => p && p.tripcode ? `#${p.tripcode}` : '')
    if(p){
      //var cont = `🔖 ${p.name}${add_trip(p)}@${p.icon}`;
      var cont = HtmlUtil.htmlEncode(`🔖 ${p.name}@${p.loc}`);
      $stored.append(`<option value="${p.id}">${cont}</option>`);
    }
    else{
      $stored.append(`<option value="">Not Logined</option>`);
    }
    bio_cookies.forEach(([pro, cookie])=>{
      //var c = `💾 ${pro.name}${add_trip(p)}@${pro.icon}`;
      var c = HtmlUtil.htmlEncode(`💾 ${pro.name}@${pro.loc}`);
      $stored.append(`<option value="${pro.id}">${c}</option>`);
    });
  })
}

function bio_setup(config){
  var $stored = $('#bio_select');

  redraw_bios(config['bio_cookies']);

  $('#show_cookie').on('click', function(){
    getCookie((x)=>alert(JSON.stringify(x)));
  });

  $('#ch_bios').on('click', function(){
    var $stored = $('#bio_select');
    var optionSelected = $("option:selected", $stored);
    var valueSelected = $stored.val();
    getProfile(function(p){
      if(valueSelected){
        if(p){
          if(p.id == valueSelected){
            chrome.tabs.create({url: 'https://drrr.com'});
          }
          else{
            cache(undefined, (config)=>{
              var bios = config['bio_cookies']
              var idx = bios.findIndex(([pro, cookies]) => pro.id === valueSelected);

              getCookie((cs)=>{
                var curbio = [p, cs];
                var [nprofile, ncookies] = bios[idx];
                setCookies(ncookies, ()=> {
                  console.log(`${JSON.stringify(bios)}.space(${idx}, 1)`);
                  bios.splice(idx, 1);
                  bios.unshift(curbio);
                  console.log(JSON.stringify(bios));
                  chrome.storage.sync.set({
                    'bio_cookies': bios,
                    'profile': nprofile,
                    'cookie': ncookies
                  }, ()=> chrome.tabs.update(
                    { url: "https://drrr.com" },
                    ()=>redraw_bios(bios, {profile: nprofile})));
                });
              });
            }, 'bio_cookies')
          }
        }
        else{
          cache(undefined, (config)=>{
            var bios = config['bio_cookies']
            var idx = bios.findIndex(([pro, cookies]) => pro.id === valueSelected);
            var [nprofile, ncookies] = bios[idx];
            setCookies(ncookies, ()=> {
              console.log(`${JSON.stringify(bios)}.space(${idx}, 1)`);
              bios.splice(idx, 1);
              console.log(JSON.stringify(bios));
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
      }
      else alert("cannot change to not logined bio");
    })
  });

  $('#new_bios').on('click', function(){
    getProfile((p)=>{
      if(p){
        getCookie((cs)=>{
          var curbio = [p, cs]
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
    var $stored = $('#bio_select');
    var optionSelected = $("option:selected", $stored);
    var valueSelected = $stored.val();
    getProfile(function(p){
      if(p && p.id == valueSelected){
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
          (([pro, cookies], idx, ary) => pro.id == valueSelected),
          (res, cookies) => redraw_bios(cookies)
        )
      }
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
    var type = next_type('#fb_rule_type', fb_rule_types);
    chrome.storage.sync.set({
      'fb-rule-type': type
    });
    type_switch(type, '#fb-input', '#fb_rule_type', 'Search/AddRule by', fb_rule_info, fb_rule_types);
  });

  $('#eager_type_btn').click(()=>{
    var type = next_type('#eager_type', eager_types);
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
    var input = $('#eager-input').val();
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
    var v = !$('#eager-ask-icon').hasClass('glyphicon-comment');
    chrome.storage.sync.set({
      [EAGER_ASK]: v
    });
    eager_ask_mode_switch(v);
  })


  function rule_note_mode_switch(bool){
    $('#rule-note-icon').attr('class', `glyphicon glyphicon-volume-${bool? 'off' : 'up'}`);
  }
  rule_note_mode_switch(config[RULE_NOTE_MUTE]);
  $('.rule-note').click(function(){
    var v = !$('#rule-note-icon').hasClass('glyphicon-volume-off');
    chrome.storage.sync.set({
      [RULE_NOTE_MUTE]: v
    });
    rule_note_mode_switch(v);
  })

  $('.fb-opener').on('click', function () {
    var $target = $($(this).attr("data-target"));
    var tartype = $target.attr('data');
    var opening = $target.hasClass('in');
    var opener = {
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
      callback = function () {
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
    var type = cur_type('#fb_rule_type', fb_rule_types);
    var list = [TRIPCODES, FRIENDS, HOMES][type]
    var rule = $('#fb-input').val();
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
  var $stored = $('#store_stickers');
  var stickers = default_stickers;
  var select_data = stickers[0];
  var select = sticker_url(select_data);
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

  var $stored = $('#store_stickers');
  var $target = $($stored.attr("data-target"));

  var stickers = config['stickers'];
  var select_data = config['select_stickers'];
  var select = select_data && sticker_url(select_data);
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

  $stored.on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    var $target = $($(this).attr("data-target"));
    var tartype = $target.attr('data');
    var opening = $target.hasClass('in');
    $target.attr('data', this.id);
    show_stickergrid(valueSelected, ()=>$target.collapse('show'));
    chrome.storage.sync.set({ 'select_stickers': extract_sticker_data(valueSelected) });
  });

  $('#reset-sticker').on('click', reset_stickers);
  $('#del_sticker').on('click', function(){
    var $stored = $('#store_stickers');
    var optionSelected = $("option:selected", $stored);
    var valueSelected = $stored.val();
    console.log('del', valueSelected);
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
    var error = () => alert(", you refer the 'goto store button'");
    var url = prompt('input the Line sticker URL:');
    sticker_data = extract_sticker_data(url);
    if(sticker_data){
      $.ajax({
        type: "GET",
        url: url,
        dataType: 'html',
        success: function(data){
          var nodes = $(data);
          s = nodes;
          var tidx = Object.values(nodes).findIndex((v)=>v.nodeName == 'TITLE')
          var name = tidx >= 0 ? nodes[tidx].textContent : '';
          var idx = name.indexOf(' – LINE貼圖 | LINE STORE')
          var idx = idx < 0 ? name.indexOf(' – LINE表情貼 | LINE STORE') : idx;
          name = name.substring(0, idx);
          var urls = extractImagesFromNodes(nodes);

          if(!urls.length) return alert("cannot find any sticker in the page");

          if(!name){
            //var i = Object.values(nodes).findIndex((v)=>v.nodeName == 'H3');
            var tags = nodes.find('h3')
            if(tags.length) name = tags[0].textContent;
          }

          name = prompt(chrome.i18n.getMessage("rename_as"),
            name ? name : chrome.i18n.getMessage("sticker"));
          name = name ? name : chrome.i18n.getMessage("sticker");

          push_value('stickers', [name].concat(sticker_data));
          var select = sticker_url(sticker_data);
          var idx = $('option', $stored).length;
          $stored.append(`<option value="${select}">${name}</option>`);
          $stored[0].selectedIndex = idx;
          $stored.change();
        },
        error: function(data){
          alert("Error: " + JSON.stringify(data));
        }
      });
    } else alert('URL should be something likes https://store.line.me/\\.*/(product|sticker)/\\w*');
  });

  $('#sticker-store-opener').on('click', function(){
    chrome.tabs.create({url: 'https://store.line.me/home/zh-Hant'});
  });

}

function game_setup(config){
  Object.keys(game_mapping).forEach((v)=>{
    $('#game-select').append(`<option style="text-align:center; text-align-last:center;" value="${v}">${v}</option>`);
  })

  var select_game = config['select_game'];
  if(!select_game) select_game = 'none';
  $('#game-select').val(select_game);

  var $target = $($('#game-select').attr("data-target"));
  import(`/game/${game_mapping[select_game]}`).then(
    (module)=>{
      if(module.ui && module.ui_event){
        $('#game_list_container').html(module.ui())
          .promise().then(()=>{
            $target.collapse('show').promise().then(
              ()=> module.ui_event(config)
            );
          });
      } else $target.collapse('hide');
    });

  $('#game-select').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    var $target = $($(this).attr("data-target"));
    var tartype = $target.attr('data');
    var opening = $target.hasClass('in');

    $target.attr('data', this.id);

    chrome.storage.sync.set({
      'select_game': valueSelected
    });

    chrome.storage.sync.get((config)=>{
      import(`/game/${game_mapping[valueSelected]}`).then(
        (module)=>{
          if(module.ui && module.ui_event){
            $('#game_list_container').html(module.ui(config))
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

$(document).ready(function(){
  $("#manual").click(open_manual);
  $("#cog").click(open_background);
  $("#tripgen").click(open_tripgen);
  $("#game-knight").click(function(){
    import('/game/echo.js');
  });

  /* ensure activate the background page */
  chrome.runtime.sendMessage({ type: 'popup' },
    () => bkg().make_switch_panel($, '#switch_panel'));

  chrome.storage.sync.get((config)=>{
    music_bar_setup(config);
    sticker_setup(config);
    friend_bio_setup(config);
    game_setup(config);
    var tab = config['pop-tab'] || 'tab0';
    $(`#${tab} > a`).click();
    //$(`#${tab}`).addClass('active');
    //$(`#${tab}-cont`).addClass('active').addClass('in');
    $('.pop-tab').on('click', function(){
      chrome.storage.sync.set({'pop-tab': this.id});
    })
  });
});


chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if(req && req.expired_bio){
    var $stored = $('#bio_select');
    var optionSelected = $("option:selected", $stored);
    optionSelected.replaceWith(`<option value="">Not Logined</option>`);
  }
});
