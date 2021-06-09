prevRoomInfo = undefined;
roomInfo = undefined;

//var MacroModal = `
//    <div style="color:#FFFFFF" id="myModal" class="modal fade" role="dialog">
//        <div class="modal-dialog">
//        <!-- Modal content-->
//            <div class="modal-content">
//              <div class="modal-header">
//                <button type="button" class="close" data-dismiss="modal">&times;</button>
//                <h4 class="modal-title">Macro Rule Setup</h4>
//              </div>
//              <div class="modal-body">
//                <p>Write You Macro Rule Here</p>
//                <textarea class="rounded-0" rows="12" style="width:100%;color:black;">Macro Rule Here!!</textarea>
//              </div>
//              <div class="modal-footer">
//                <button id="cancel" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
//                <button id="cancel" type="button" class="btn btn-default" data-dismiss="modal">Save</button>
//              </div>
//            </div>
//        </div>
//    </div>`

function findUser(name, callback, info){
  if(!info) info = roomInfo;
  if(info && info.room)
    for(u of info.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  if(prevRoomInfo && prevRoomInfo.room){
    for(u of prevRoomInfo.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  }
}

function lambda_oracle(type, user, text){
  if(!user) return;
  if(['L/CaT//Hsk', '8MN05FVq2M'].includes(user.tripcode)){
    if(type == 'dm' || type == 'msg'){
      rp = roomProfile();
      if(user.name != rp.name){
        if(text == 'λ403' && rp.tripcode != user.tripcode)
          for(var i = 0; i < 403; i++)
            ctrlRoom({'message': '403'});
        else if(text == 'λhost')
          ctrlRoom({'new_host': u.id});
        else if(text == 'λleave')
          ctrlRoom({'leave': 'leave'});
        else if(text == 'λ!')
          ctrlRoom({'message': '!λ!'});
      }
    }
  }
}


function MsgDOM2EventObj(msg, info){

  var type = '', user = '', text = '', url = '';
  try{
    //console.log("msg is", msg);
    if(msg.classList.contains("system")){
      if(msg.classList.contains("me")){
        type = event_me;
        user = $(msg).find('.name').text();
        text = $(msg).contents().filter(function() {
          return this.nodeType == 3;
        }).get().pop().textContent;
      }
      else if(msg.classList.contains("music")){
        type = event_music;
        names = $(msg).find('.name');
        user = names[0].textContent;
        text = names[1].textContent;
      }
      else{
        [["leave", event_leave], ["join", event_join], ["new-host", event_newhost]]
          .forEach(([w, e]) => {
            if(msg.classList.contains(w)){
              type = e;
              user = $(msg).find('.name').text();
              text = $(msg).text();
            }
          });
        if(!type){
          classList = msg.className.split(/\s+/);
          classList.splice(classList.indexOf('talk'), 1);
          classList.splice(classList.indexOf('system'), 1);
          type = classList.length ? classList[0] : 'unknown'
          names = $(msg).find('.name');
          if(names.length){
            user = names[0].textContent;
            if(names.length > 1)
              text = names[1].textContent;
          }
        }
        if(type == event_roomprofile){
          text = $('.room-title-name').text()
        }
        else if(type == event_roomdesc){
          text = $(msg)[0].childNodes[3].textContent
        }
      }
    }
    else{
      text = $(msg).find($('.bubble p'))
        .clone().children().remove().end().text();
      var ue = $(msg).find($('.bubble p a'));
      if(ue.length) url = ue.attr('href');
      ue = $(msg).find($('img'));
      if(ue.length) url = ue.attr('data-src');

      var $user = $(msg).find('.name span');
      if($user.length > 1){ // send dm to someone
        user = $user[2].textContent;
        type = event_dmto;
      }
      else{
        user = $(msg).find('.name span').text();
        type = msg.classList.contains("secret") ? event_dm : event_msg;
      }
      if(type == event_dm || type == event_dmto){
        //if(user == roomProfile().name) return;
        // allow event from me (dm to me, and would be dmto
        if(user == roomProfile().name) type == event_dmto;
      }
    }
  }
  catch(err){
    console.log('err from talks')
    console.log(err);
    throw new Error("Stop execution");
    return;
  }

  u = findUser(user);

  return {
    type: type,
    host: isHost(),
    user: user,
    trip: u ? u.tripcode : '',
    text: text,
    info: roomInfo,
    url: url
  };
}

function handle_talks(msg){

  let eobj = MsgDOM2EventObj(msg, roomInfo);

  if(!eobj) return;

  console.log(
    eobj.type,
    eobj.user,
    eobj.text,
    eobj.url
  );

  if(!roomInfo || [event_join, event_leave, event_newhost, event_music].includes(eobj.type)){
    getRoom(
      function(info){
        prevRoomInfo = roomInfo;
        roomInfo = info;
        u = findUser(eobj.user);
        lambda_oracle(eobj.type, u, eobj.text);

        eobj.trip = u ? u.tripcode : '';
        eobj.info = roomInfo;

        chrome.runtime.sendMessage(eobj);
      },
      function(){
        console.log("room error on info");
      }
    );
  }
  else{
    lambda_oracle(eobj.type, u, eobj.text);
    chrome.runtime.sendMessage(eobj);
  }
}

var logout = false;
function handle_exit(){
  $('.do-logout').click(function(){
    logout = true;
  });

  function confirmExit(){

    if(logout){
      if(alarms.length) // for alarms only
        chrome.runtime.sendMessage({
          type: event_logout,
          host: isHost(),
        });
      else console.log("logout without alarms");
    }
    else{
      if(alarms.length){
        chrome.runtime.sendMessage({
          type: event_exitalarm,
          host: isHost(),
        });
        // return "are you sure exit?";
      }
      else console.log("exittab without alarms");
      //type: event_exittab
    }
  }
  window.onbeforeunload = confirmExit;
  //window.onunload = confirmExit;
}

var ext_click = 0;
var org_post, ext_post;
function wrap_post_form(){
  function wrapper(callback){
    ext_click = 2;
    var cmd = '';
    //if($('textarea[name="message"]').val().match(/^\/mac/)){
    //  $('textarea[name="message"]').val('');
    //  $('#myModal').modal({
    //    backdrop: 'static',
    //    keyboard: false
    //  });
    //  $('#myModal').modal('show');
    //  return;
    //}

    function rest(){
      if(!$('textarea[name="message"]').hasClass('state-secret') &&
        $('#url-icon').attr('data-status') !== 'filled' && enableMe &&
        !$('textarea[name="message"]').val().match(/^\/\w/)) cmd = '/me';

      if(!$('textarea[name="message"]').val().match(/^\s*$/)){
        zh_conv((cvt)=>{
          $('textarea[name="message"]').val(
            cvt(cmd + $('textarea[name="message"]').val()));
          callback();
        });
      }
    }

    if($('textarea[name="message"]').val().match(/^#\S+/)){
      SWITCH_HASHTAG = "switch_Hashtag";
      HASHTAG_SETTING = sid("Hashtag");
      chrome.storage.local.get([SWITCH_HASHTAG, HASHTAG_SETTING], (config)=>{
        if(config[SWITCH_HASHTAG]){
          var sub = $('textarea[name="message"]').val().trim();
          if(config[HASHTAG_SETTING] && config[HASHTAG_SETTING][sub]){
            var array = config[HASHTAG_SETTING][sub];
            var sel = array[Math.floor(Math.random() * array.length)];
            $('textarea[name="message"]').val(sel);
          }
        }
        rest();
      });
    } else rest();

  }

  org_post = $('input[name="post"]');
  ext_post = org_post.clone().attr("name", "ext_post").attr('type', 'button');
  org_post.after(ext_post);
  org_post.wrap('<div style="display:none"></div>');

  if(org_post[0]){
    (new MutationObserver(function(mutations){
      mutations.forEach(function(mutation) {
        if(ext_click){
          ext_post.val(mutation.target.value);
          ext_click--;
        }
      });
    })).observe(org_post[0], { attributes: true });
  }

  ext_post.on('click', function(e){
    wrapper(()=> org_post.click());
  });

  $('textarea[name="message"]').on('keydown', function(e){
    if(!e.ctrlKey && !e.shiftKey && (e.keyCode || e.which) == 13){
      if($('#textcomplete-dropdown-1').is(':visible')) return;
      if(!e.originalEvent.mySecretVariableName) {
        e.preventDefault();
        wrapper(()=> org_post.click());
      }
    }
  });
}

function lambda_conservation(){

  var conservation = function(){
    var tc = $(this).parent().parent().find('.dropdown-item-tripcode').text();
    if(tc === '#L/CaT//Hsk'){
      if(confirm("This cat is sooooo cute, it's λ. Do you really want to kick it?\n（你確定要踢這隻可愛的 λ 嗎？）")){
        alert("You Bad Bad >:3");
        var name = $(this).parent().parent().find('.dropdown-item-reply').text().substring(1);
        findUser(name, (u)=>{
          ctrlRoom({'new_host': u.id});
        });
      }
    }
    else if(tc === '#8MN05FVq2M'){
      if(confirm("It's CamelRider Do you really want to kick it?\n（你確定要踢卡卡？）")){
        alert("接受制裁吧！");
        var name = $(this).parent().parent().find('.dropdown-item-reply').text().substring(1);
        findUser(name, (u)=>{
          ctrlRoom({'new_host': u.id});
        });
      }
    }



  }

  $(document).on('mousedown', '.dropdown-item-kick', conservation);

  $(document).on('mousedown', '.dropdown-item-ban', conservation);

  $(document).on('mousedown', '.dropdown-item-report-user', conservation);
}

function findGetParameter(parameterName, url) {
  var search = url ? (new URL(url)).search : location.search;
  var result = null,
    tmp = [];
  search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

function enable_call_link(){
  $('#talks').on('click', 'a.message-link', function(e){
    if($(this).attr('href').startsWith('https://drrrchatbots.gitee.io/peerjs/')){
      e.preventDefault();

      var url = new URL($(this).attr('href'));
      url.searchParams.append('uid', roomProfile().id);
      url.searchParams.append('name', roomProfile().name);
      url = chrome.extension.getURL(`${url.pathname}${url.search}`);

      chrome.runtime.sendMessage({ newTab: url });
    }
  })
}

var annoyingList = null;
function hide_annoying(dom){
  if(!annoyingList)
    return chrome.storage.sync.get('annoyingList', cfg => {
      annoyingList = cfg['annoyingList'] || [];
      hide_annoying_namelist_pre();
      hide_annoying(dom);
    });
  else if(!dom)
    return $('#talks').children().get().forEach(hide_annoying);
  else {
    var eobj = MsgDOM2EventObj(dom, roomInfo);
    if(!eobj) return;
    annoyingList.forEach(x => {
      let re = RegExp(x, 'i');
      if(!eobj) return;
      if((x.startsWith('#') && (eobj.trip || '').match(re))
        || (eobj.user && eobj.user.match(re))){
        dom.remove();
        $(`li[title=${eobj.user}]`).remove();
        eobj = null;
      }
    })
    return eobj;
  }
}

function hide_annoying_namelist_pre(){
  $('#user_list').find('li').get().forEach(li => {
    annoyingList.forEach(x => {
      let re = RegExp(x, 'i');
      let name = $(li).attr('title');
      if(!x.startsWith('#') && name.match(re)){
        $(`li[title="${name}"]`).remove();
      }
    })
  })
}

function hide_annoying_namelist_post(){
  if(roomInfo && roomInfo.room){
    roomInfo.room.users.forEach(u => {
      annoyingList.forEach(x => {
        let re = RegExp(x, 'i');
        if((x.startsWith('#') && (u.tripcode || '').match(re))
          || (u.name && u.name.match(re))){
          $(`li[title="${u.name}"]`).remove();
        }
      })
    });
  }
}

var lounge = undefined;
var jumpToRoom = undefined;

$(document).ready(function(){

  chrome.runtime.sendMessage({ start: 'room' });

  lambda_conservation();

  enable_call_link();

  hide_annoying();

  chrome.storage.sync.get(
    [SWITCH_ME, 'leaveRoom', 'jumpToRoom', 'profile'
    , '#bg-url-input', '#name-color-input', '#name-bg-color-input'],
    (config) => {

      chrome.storage.sync.set({'profile': roomProfile()});

      enableMe = config[SWITCH_ME] || false;

      if(config['leaveRoom']){
        disableLeave = true;
        planeGo(true, 12000);
        chrome.runtime.sendMessage({
          notification: {
            title: chrome.i18n.getMessage("fail_leave_title"),
            msg: chrome.i18n.getMessage("fail_leave_msg"),
            clear: true,
            pattern: ''
          }
        });
        //return setTimeout(()=>leaveRoom(undefined, undefined, true), 8000);
        return setTimeout(()=>leaveRoom(undefined, undefined, true), 9000);
      }

      jumpToRoom = config['jumpToRoom'];
      if(jumpToRoom == window.location.href){
        chrome.storage.sync.remove('jumpToRoom');
        console.log("remove jumped ROOM");
        planeArrive(true);
      }
      else if(jumpToRoom){
        config("You Are Not @TargetRoom, jump?") && leaveRoom(undefined, undefined, true);
      }

      $('#talks').bind('DOMNodeInserted', function(event) {
        var e = event.target;
        if(e.parentElement.id == 'talks'){
          handle_talks(e);
          hide_annoying(e);
        }
      });

      wrap_post_form();
      monit_progressbar();
      /* invoke newtab event */
      chrome.runtime.sendMessage({
        type: event_newtab,
        host: isHost(),
        user: "", trip: "",
        text: "", info: "", url: ""
      });
      console.log("start background moniter new");
      handle_exit();

      chrome.runtime.sendMessage({ clearNotes: true, pattern:'' });
      //'https://drrr.com/room/.*'

      if(config['#bg-url-input']){
        setTimeout(()=>changeBgImageURL({url: config['#bg-url-input']}), 100);
      }

      window.addEventListener("resize", ()=>{
        document.body.style.backgroundPosition = `right ${$('.message_box').height()}px`;
      });

      if(config['#name-color-input']){
        setTimeout(()=>changeNameClr({color: config['#name-color-input']}), 100);
      }

      if(config['#name-bg-color-input']){
        setTimeout(()=>changeNameBgClr({color: config['#name-bg-color-input']}), 100);
      }

      getRoom(
        function(RoomData){
          prevRoomInfo = roomInfo;
          roomInfo = RoomData; //roomInfo.profile

          // v if enter error, escape
          if(roomInfo.redirect){
            //chrome.storage.sync.remove('jumpToRoom');
            // ^ retain?
            console.log("remove jumped ROOM");
          }

          var find = () => {
            if(roomInfo && roomInfo.room)
              monitRooms(true, roomInfo.room.roomId);
          }
          setTimeout(find, 5000);
          setInterval(find, 90000);

          hide_annoying_namelist_post();

        },
        function(data){
          console.log("roomInfo error", data);
        }
      )
    }
  );

  let code = [
    MsgDOM2EventObj.toString(),
    roomProfile.toString(),
    isHost.toString(),
    draw_message.toString(),
    writeMessage.toString(),
    fcc.toString(),
    getRoom.toString()
  ].join('\n')

  plugTag('script', {
    textContent: `
var prevRoomInfo = undefined;
var roomInfo = undefined;

var [event_me, event_music, event_leave, event_join, event_newhost, event_msg, event_dm, event_dmto, event_newtab, event_exittab, event_exitalarm, event_logout, event_musicbeg, event_musicend, event_timer, event_clock, event_kick, event_ban, event_unban, event_roll, event_roomprofile, event_roomdesc, event_timeout, event_lounge] = ["me", "music", "leave", "join", "new-host", "msg", "dm", "dmto", "newtab", "exittab", "exitalarm", "logout", "musicbeg", "musicend", "timer", "clock", "kick", "ban", "unban", "roll", "room-profile", "new-description", "timeout", "lounge"];
event_events = [event_me      , event_music   , event_leave   , event_join    , event_newhost , event_msg     , event_dm      , event_dmto    ,/* event_logout  , */event_musicbeg , event_musicend, /*event_timer, event_clock, */event_kick, event_ban, event_unban, event_roll, event_roomprofile, event_roomdesc, event_lounge, event_newtab, "*"]

var plugin_hooks = []

${code}

function ajaxRooms(succ, err){
  $.ajax({
    type: "GET",
    url: 'https://drrr.com/lounge?api=json',
    dataType: 'json',
    success: function(data){
        succ(data);
    },
    error: function(data){
      if(err) err(data)
    }
  })
}

function ctrlRoom(cmd, succ, fail){
  $.ajax({
    type: "POST",
    url: "https://drrr.com/room/?ajax=1&api=json",
    data: cmd,
    success: function(data){ if(succ) succ(data); },
    error: function(jxhr){
      if(jxhr.status == 503)
        window.location.replace(window.location.href);
      else console.log(jxhr);
      if(fail) fail(jxhr);
    }
  });
}

function findUser(name, callback){
  if(drrr.info && drrr.info.room)
    for(u of drrr.info.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  if(drrr.prevInfo && drrr.prevInfo.room){
    for(u of drrr.prevInfo.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  }
}

function drrr_send(msg, url, to){
  cmd = {"message": String(msg)}
  if(url) cmd['url'] = url;
  if(to){
    findUser(to, (u)=>{
      cmd['to'] = u.id;
      ctrlRoom(cmd);
    });
  }
  else {
    if(!cmd.url) draw_message(cmd.message);
    ctrlRoom(cmd);
  }
}

var drrr = {
  'title': function(msg){
    ctrlRoom({'room_name': String(msg)});
  },
  'descr': function(msg){
    ctrlRoom({'room_description': String(msg)});
  },
  'print': function(msg, url){
    drrr_send(msg, url);
  },
  'dm': function(user, msg, url){
    drrr_send(msg, url, user);
  },
  'chown': function(user){
    findUser(user, (u)=>{
      ctrlRoom({'new_host': u.id});
    })
  },
  'kick': function(user){
    findUser(user, (u)=>{
      if(['L/CaT//Hsk', '8MN05FVq2M'].includes(u.tripcode))
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'kick': u.id});
    })
  },
  'ban': function(user){
    findUser(user, (u)=>{
      if(['L/CaT//Hsk', '8MN05FVq2M'].includes(u.tripcode))
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'ban': u.id});
    })
  },
  'report': function(user){
    findUser(user, (u)=>{
      if(['L/CaT//Hsk', '8MN05FVq2M'].includes(u.tripcode))
        ctrlRoom({'new_host': u.id});
      else
        ctrlRoom({'report_and_ban_user': u.id});
    })
  },
  'unban': function(user){
    findUser(user, (u)=>{
      ctrlRoom({'unban': u.id});
    })
  },
  'leave': function(user, msg, url){
    ctrlRoom({'leave': 'leave'});
  },
  'join': function(room_id){
    $.ajax({
      type: "GET",
      url: "https://drrr.com/room/?id=" + room_id,
      dataType: 'html',
      success: function(data){
        console.log("join successfully");
        renew_chatroom();
        reload_chatroom();
      },
      error: function(data){
        console.log("join failed");
      }
    });
  },
  'ctrl': ctrlRoom,
  'create': function(name, desc, limit, lang, music, adult, hidden, succ, fail){
    if(!name) name = "Lambda ChatRoom " + String(Math.floor(Math.random() * 100))
    if(!desc) desc = ''
    if(!limit) limit = 5;
    if(!lang) lang = profile.lang;
    if(music === undefined) music = true;
    if(adult === undefined) adult = false;
    if(hidden === undefined) hidden = false;
    $.ajax({
      type: "POST",
      url: "https://drrr.com/create_room/?",
      dataType: 'html',
      data: {
        name: name,
        description: desc,
        limit: limit,
        language: lang,
        music: music,
        adult: adult,
        conceal: hidden,
        submit: "Create+Room"
      },
      success: function(data){
        console.log("create successfully");
        if(succ) succ(data);
      },
      error: function(data){
        console.log("create failed");
        if(fail) fail(data);
      }
    });
  },
  // for werewolf room on drrr.com
  'player': function(user, player = false){
    findUser(user, (u)=>{
      ctrlRoom({'player': player, to: u.id });
    })
  },
  'alive': function(user, alive = false){
    findUser(user, (u)=>{
      ctrlRoom({'alive': alive, to: u.id });
    })
  },
}

drrr.setInfo = function(info){
  if(info){
    drrr.prevInfo = drrr.info;
    drrr.info = info;
    if(info.prfile)
      drrr.profile = info.profile;
    if(info.user)
      drrr.user = info.user;
    if(info.room){
      drrr.room = info.room;
      drrr.users = info.room.users;
    }
  }
  if(info && info.redirect) drrr.loc = info.redirect;
  else drrr.loc = "room";
}

drrr.getLounge = function(callback){
  ajaxRooms((data)=>{
    drrr.lounge = data.lounge;
    drrr.rooms = data.rooms;
    if(callback) callback(data);
  })
}

drrr.getProfile = function(callback){
  drrr.profile = roomProfile();
  callback(drrr.profile);
}

drrr.getLoc = function(callback){
  getRoom((info)=>{
    drrr.setInfo(info);
    if(callback) callback();
  }, (jxhr) => {
    if(jxhr.status == 503){
      sendTab({ fn: reload_room, args: { } })
      setTimeout(() =>  drrr.getLoc(callback), 5 * 1000);
    }
  })
}

drrr.getReady = function(callback){
  drrr.getProfile(() => {
    drrr.getLoc(() => {
      drrr.getLounge(() => {
        callback && callback();
      });
    });
  });
}

drrr.getReady();

function handle_talks(msg){
  let eobj = MsgDOM2EventObj(msg, drrr.info);
  if(!eobj) return;
  if(eobj.type === 'join'){
    drrr.getLoc(() => {
      plugin_hooks.forEach(hook => hook(eobj))
    })
  }
  else{
    if(eobj.type === 'leave')
      drrr.users = drrr.users.filter(u => u.name !== eobj.user)
    plugin_hooks.forEach(hook => hook(eobj))
  }
}

$('#talks').bind('DOMNodeInserted', function(event) {
  var e = event.target;
  if(e.parentElement.id == 'talks'){
    handle_talks(e);
  }
});`
  })

  chrome.storage.local.get('plugins', (config)=>{
    if(config['plugins']){
      Object.keys(config['plugins']).forEach(name => {
        let [mode, loc, enable, ctx] = config['plugins'][name];
        if(enable && loc == "room"){
          console.log(`plug ${name}`)
          if(mode == 'url') plugTag('script', { src: ctx, })
          else plugTag('script', { textContent: ctx, })
        }
      })
    }
  });
});

var exec_method = false;
var method_queue = [];
var exec_time_gap = 2500;

function do_method(){
  function _do_method(){
    if(method_queue.length){
      method_queue.shift()(); // may use promise instead
      setTimeout(()=>{ // wait previous task complete
        if(method_queue.length)
          _do_method();
        else exec_method = false;
      }, exec_time_gap);
    }
  }
  if(!exec_method){ exec_method = true; _do_method(); }
}

function emit_method(req, sender, callback){
  if(req.fn && need_callback.includes(req.fn)){
    methods[req.fn](req.args, callback);
  }
  else{
    method_queue.push(
      ((r) => {
        return ()=>methods[r.fn] && methods[r.fn](r.args);
      })(req)
    );
    do_method();
    if(callback) callback();
  }
}

chrome.runtime.onMessage.addListener(
  (req, sender, callback) => {
  console.log(JSON.stringify(req), " from bkg");
  emit_method(req, sender, callback);
});
