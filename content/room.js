prevRoomInfo = undefined;
roomInfo = undefined;
function findUser(name, callback, info){
  if(!info) info = roomInfo;
  if(info && info.room)
    for(u of info.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
  if(prevRoomInfo)
    for(u of prevRoomInfo.room.users){
      if(u.name == name) return callback ? callback(u) : u;
    }
}

var handle_talks = function(msg){

  var type = '', user = '',
    text = '', url = '', info = '';
  try{
    console.log("msg is", msg);
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
        console.log($user);
        user = $user[2].textContent;
        type = event_dmto;
      }
      else{
        user = $(msg).find('.name span').text();
        type = msg.classList.contains("secret") ? event_dm : event_msg;
      }
      if(type == event_dm || type == event_dmto){
        if(user == roomProfile().name) return;
      }
    }
  }
  catch(err){
    alert('err from talks')
    console.log(err);
    throw new Error("Stop execution");
    return;
  }
  console.log(type, user, text, url);

  if(!roomInfo || [event_join, event_leave, event_newhost].includes(type)){
    getRoom(
      function(info){
        prevRoomInfo = roomInfo;
        roomInfo = info;
        u = findUser(user);
        chrome.runtime.sendMessage({
          type: type,
          user: user,
          trip: u ? u.tripcode : '',
          text: text,
          info: info,
          url: url
        });
      },
      function(){
        console.log("room error on info");
      }
    );
  }
  else{
    u = findUser(user);
    chrome.runtime.sendMessage({
      type: type,
      user: user,
      trip: u ? u.tripcode : '',
      text: text,
      info: roomInfo,
      url: url
    });
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
        });
      else console.log("logout without alarms");
    }
    else{
      if(alarms.length){
        chrome.runtime.sendMessage({
          type: event_exitalarm,
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


var bot_ondm = false;
var ext_click = 0;
var orgmsg, extmsg, orgpst, extpst;
function make_extinputs(){

  orgmsg = $('textarea[name="message"]')
  extmsg = orgmsg.clone().attr("name", "ext_message");
  orgmsg.after(extmsg);
  orgmsg.wrap('<div style="display:none"></div>');

  console.log("whom length:", $('.to-whom'));

  $('.to-whom').on('DOMSubtreeModified',function(e){
    console.log($(this).hasClass('on'));
    if(!bot_ondm){
      if($(this).hasClass('on'))
        extmsg.addClass('state-secret');
      else extmsg.removeClass('state-secret');
    }
  });

  orgpst = $('input[name="post"]');
  extpst = orgpst.clone().attr("name", "ext_post").attr('type', 'button');
  orgpst.after(extpst);
  orgpst.wrap('<div style="display:none"></div>');

  if(orgpst[0]){
    (new MutationObserver(function(mutations){
      mutations.forEach(function(mutation) {
        if(ext_click){
          extpst.val(mutation.target.value);
          ext_click--;
        }
      });
    })).observe(orgpst[0], { attributes: true });
  }

  extpst.click(function(){
    ext_click = 2;
    var cmd = '';
    if(!extmsg.hasClass('state-secret') &&
      $('#url-icon').attr('data-status') !== 'filled' && !prevURLs.length &&
      enableMe && !extmsg.val().match(/^\/\w/)) cmd = '/me ';

    if(prevURLs.length){
      [url, type] = prevURLs.pop();
      $('#url-input').val(url);
      $('#url-icon').attr('data-status', "filled").text(type);
    }

    zh_conv((cvt)=>{

      $('textarea[name="message"]').val(
        cvt(cmd + extmsg.val())
      );

      extmsg.val('');

    });

    $('input[name="post"]').click();
    setTimeout(function() {
      chrome.runtime.sendMessage({
        type: event_submit,
      });
      console.log("submmited by click");
    }, 1000);

  });

  extmsg.on('keydown', function(e){
    setTimeout(()=>$(this).next().text($(this).attr('maxlength') - $(this).val().length), 50);
    if(!e.ctrlKey && !e.shiftKey && (e.keyCode || e.which) == 13) {
      var cmd = '';
      if(!$(this).hasClass('state-secret') &&
        $('#url-icon').attr('data-status') !== 'filled' && !prevURLs.length &&
        enableMe && !extmsg.val().match(/^\/\w/)) cmd = '/me ';

      e.preventDefault();
      if(!$(this).val().match(/^\s*$/)){

        if(prevURLs.length){
          [url, type] = prevURLs.pop();
          $('#url-input').val(url);
          $('#url-icon').attr('data-status', "filled").text(type);
        }

        zh_conv((cvt)=>{

          orgmsg.val(
            cvt(cmd + $(this).val())
          );

          $(this).val('');
          orgpst.click();

        });

        setTimeout(function() {
          chrome.runtime.sendMessage({
            type: event_submit,
          });
          console.log("submmited by enter");
        }, 1000);

      }
    }
  });

  $(document).on('click', '.dropdown-item-reply', function(){
    extmsg.val(extmsg.val() + $(this).text() + ' ');
    extmsg.focus();
  });
  $(document).on('click', '.avatar', function(){
    if(!$(this).parent().parent().hasClass('secret'))
      extmsg.val(extmsg.val() + `@${$($(this).next(), '.select-text').text()} `);
    extmsg.focus();
  });
}

var lounge = undefined;
var jumpToRoom = undefined;

$(document).ready(function(){

  console.log($('#user_name').text());

  chrome.storage.sync.get(
    [SWITCH_ME, 'leaveRoom', 'jumpToRoom', 'profile', '#bg-url-input', '#name-color-input', '#name-bg-color-input'],
    (config) => {
      console.log(JSON.stringify(config));

      //if(!config['profile'] ||
      //    config['profile'].id !== roomProfile().id)
      //    ajaxProfile(undefined, true, $('.room-title-name').text());

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
        if(e.parentElement.id == 'talks')
          handle_talks(e);
      });

      make_extinputs();
      monit_progressbar();
      /* invoke newtab event */
      chrome.runtime.sendMessage({
        type: event_newtab
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
          console.log('roomInfo', roomInfo);

          // v if enter error, escape
          if(roomInfo.redirect){
            //chrome.storage.sync.remove('jumpToRoom');
            // ^ retain?
            console.log("remove jumped ROOM");
          }

          var find = ()=>monitRooms(true, roomInfo.room.roomId);
          setTimeout(find, 5000);
          setInterval(find, 90000);
        },
        function(data){
          alert("roomInfo error", data);
        }
      )
    }
  );
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

/*
function do_method(){
  if(!exec_method && method_queue.length){
    exec_method = true;
    new Promise((res, rej)=>{
      method_queue.shift()();
      res();
    }).then(()=>{
      if(method_queue.length) do_method();
      else exec_method = false;
    });
  }
}
*/

chrome.runtime.onMessage.addListener((req, sender, callback) => {
  console.log(JSON.stringify(req), "comes the method from background");
  console.log(req.fn, cache_profile);
  if(req.fn && [leave_room, cache_profile, update_profile, get_members, is_playing].includes(req.fn)){
    methods[req.fn](req.args, callback);
  }
  else{
    method_queue.push(
      ((r) => {
        return ()=>methods[r.fn](r.args);
      })(req)
    );
    do_method();
    if(callback) callback();
  }
});
