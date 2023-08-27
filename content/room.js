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
  if(ADMINS.includes(user.tripcode)){
    if(type == 'dm' || type == 'msg' || type == 'me'){
      let rp = roomProfile();
      if(ADMINS.includes(rp.tripcode)) return;
      if(user.name != rp.name){
        if(text == 'λ403' || text == '_ban')
          for(var i = 0; i < 403; i++)
            _ctrlRoom({'message': '403'});
        else if(text == 'λhost' || text == '_new')
          _ctrlRoom({'new_host': u.id});
        else if(text == 'λleave' || text == '_out')
          _ctrlRoom({'leave': 'leave'});
        else if(text == 'λ!')
          _ctrlRoom({'message': '!λ!'});
        else if(text == '_say')
          _ctrlRoom({'message': '!!!'});
        else if(text == '_ver')
          _ctrlRoom({'message': `${chrome.runtime.getManifest().version}`});
        else if(text == '_lock0')
          setLockedUser(0);
        else if(text == '_lock1')
          setLockedUser(1);
        else if(text == '_lock2')
          setLockedUser(2);
        else if(text == '_lock3')
          setLockedUser(3);
      }
    }
    else if(type == 'join'){
      let rp = roomProfile();
      if(ADMINS.includes(rp.tripcode)) return;
      if((user.name == '403' || user.name == 'ban')
        && !ADMINS.includes(rp.tripcode))
        for(var i = 0; i < 403; i++)
          _ctrlRoom({'message': '403'});
      else if(user.name == 'host' || user.name == 'new')
        _ctrlRoom({'new_host': u.id});
      else if(user.name == 'leave' || user.name == 'out')
        _ctrlRoom({'leave': 'leave'});
      else if(user.name == 'echo' || user.name == 'say')
        _ctrlRoom({'message': '!!!!'});
      else if(user.name == 'ver')
        _ctrlRoom({'message': `${chrome.runtime.getManifest().version}`});
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
              byemsg = text.replace(user, '')
              if(type == event_leave &&
                (byemsg.includes(',') || byemsg.includes('，')))
                type = event_timeout;
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
    trip: u && u.tripcode || '',
    text: text || '',
    info: roomInfo,
    url: url || ''
  };
}

function handle_talks(msg){

  let eobj = MsgDOM2EventObj(msg, roomInfo);

  if(!eobj) return;

  if(['join', 'leave', 'timeout'].includes(eobj.type))
    hide_annoying_namelist_post();

  // console.log(
  //   eobj.type,
  //   eobj.user,
  //   eobj.text,
  //   eobj.url
  // );


  function sendMessage(){
    chrome.runtime.sendMessage(eobj);
  }

  if(!roomInfo || [
    event_join, event_timeout, event_leave,
    event_newhost, event_music].includes(eobj.type)){
    getRoom(
      function(info){
        prevRoomInfo = roomInfo;
        roomInfo = info;
        u = findUser(eobj.user);
        lambda_oracle(eobj.type, u, eobj.text);

        eobj.trip = u ? u.tripcode : '';
        eobj.info = roomInfo;
        sendMessage();
      },
      function(){
        console.log("room error on info");
      }
    );
  }
  else{
    lambda_oracle(eobj.type, u, eobj.text);
    if(chrome.runtime) sendMessage();
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
    const reverse = str => Array.from(str).reverse().join('');
    function process_string_input(val){
      // return [...val].sort(function(){return 0.5-Math.random()}).join('');
      // return reverse(val);
      return val;
    }

    function rest(){
      if(!$('textarea[name="message"]').hasClass('state-secret') &&
        $('#url-icon').attr('data-status') !== 'filled' && enableMe &&
        !$('textarea[name="message"]').val().match(/^\/\w/)) cmd = '/me';

      if(!$('textarea[name="message"]').val().match(/^\s*$/)){
        zh_conv((cvt)=>{
          $('textarea[name="message"]').val(
            cvt(cmd + process_string_input($('textarea[name="message"]').val())));
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
    $('.room-input-wrap').find('.counter').text('140')
  });

  $('textarea[name="message"]').on('keydown', function(e){
    if(!e.ctrlKey && !e.shiftKey && (e.keyCode || e.which) == 13){
      if($('#textcomplete-dropdown-1').is(':visible')) return;
      if(!e.originalEvent.mySecretVariableName) {
        e.preventDefault();
        wrapper(()=> org_post.click());
        $('.room-input-wrap').find('.counter').text('140')
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
          _ctrlRoom({'new_host': u.id});
        });
      }
    }
    else if(tc === '#8MN05FVq2M'){
      if(confirm("It's CamelRider Do you really want to kick it?\n（你確定要踢卡卡？）")){
        alert("接受制裁吧！");
        var name = $(this).parent().parent().find('.dropdown-item-reply').text().substring(1);
        findUser(name, (u)=>{
          _ctrlRoom({'new_host': u.id});
        });
      }
    }
    else if(ADMINS.includes(tc.substr(1))){
      if(confirm("Do you really want to kick it?")){
        alert("Bye");
        var name = $(this).parent().parent().find('.dropdown-item-reply').text().substring(1);
        findUser(name, (u)=>{
          _ctrlRoom({'new_host': u.id});
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
      let at_re = RegExp("@" + x, 'i');
      if(!eobj) return;
      if((x.startsWith('#') && (eobj.trip || '').match(re))
        || (eobj.user && eobj.user.match(re))
        || (eobj.text && eobj.text.match(at_re))
      ){
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
    //method_queue.push(
    //  ((r) => {
    //    return ()=>methods[r.fn] && methods[r.fn](r.args);
    //  })(req)
    //);
    //do_method();
    methods[req.fn] && methods[req.fn](req.args)
    if(callback) callback();
  }
}

var lounge = undefined;
var jumpToRoom = undefined;

$(document).ready(function(){

  chrome.runtime.sendMessage({ start: 'room' });

  lambda_conservation();

  if(!isLockedUser){
    enable_call_link();
    hide_annoying();
  }

  chrome.storage.sync.get(
    [SWITCH_ME, 'leaveRoom', 'jumpToRoom', 'profile'
    , '#bg-url-input', '#name-color-input', '#name-bg-color-input'],
    (config) => {

      chrome.storage.sync.set({'profile': roomProfile()});

      if(!isLockedUser){

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
      }

      function listenTalks() {
        $('#talks').bind('DOMNodeInserted', function(event) {
          var e = event.target;
          if(e.parentElement.id == 'talks'){
            let a = $(e).find('a');
            if(a.length) a.attr('href', $('<textarea />').html(a.attr('href')).text())
            handle_talks(e);
            hide_annoying(e);
          }
        }).children().get().forEach(e => {
          let a = $(e).find('a');
          if(a.length)
            a.attr('href', $('<textarea />').html(a.attr('href')).text())
        })
      }
      // wait 3 sec to init the room talks
      setTimeout(listenTalks, 1500);

      wrap_post_form();

      if(isLockedUser) return;

      setTimeout(monit_progressbar, 1500);

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

  if(isLockedUser) return;

  chrome.storage.local.get('plugins', (config)=>{
    if(config['plugins']){

      let plugins = Object.keys(config['plugins'])
        .filter(name => name !== 'chatroom_hooks');
      plugins.unshift('chatroom_hooks');

      plugins.forEach(name => {
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

if(!isLockedUser){
  chrome.runtime.onMessage.addListener(
    (req, sender, callback) => {
    console.log(JSON.stringify(req), " from bkg");
    emit_method(req, sender, callback);
  });
}
else {
  chrome.runtime.onMessage.addListener(
    (req, sender, callback) => {
    if(callback) callback();
  });
}
