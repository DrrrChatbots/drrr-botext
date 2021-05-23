
function roomProfile(){
  Profile = {
    "device":"desktop",
    "icon": $("#user_icon").text(),
    "id": $("#user_id").text(),
    "lang":$('html').attr('lang'),
    "name": $('#user_name').text(),
    "tripcode": $('#user_tripcode').text(),
    "uid": $("#user_id").text(),
    "loc": $('.room-title-name').text()
  };
  return Profile;
}

function isHost(){
  var host = $('.is-host')[1] && $('.is-host')[1].title || ($('.is-host')[0] && $('.is-host')[0].title)
  if(host)
    return roomProfile().name == host.substring(0, host.length - ' (host)'.length);
  else false;
}

var prevURLs = [], prevTo = [], prevWhom;

var getTextNodesIn = function(el) {
  return $(el).find(":not(iframe)").addBack().contents().filter(function() {
    return this.nodeType == 3;
  });
};

var postMessage = function(args){
  if(args.url) $('#url-input').val(args.url);
  zh_conv((cvt)=>{
    $('textarea[name="message"]').val(args.msg.trim().length ? cvt(args.msg) : '⠀');
    $('input[name="post"]').click();
  });
}

var publishMessage = function(args){
  zh_conv((cvt)=>{
    var message = args.msg.trim().length ? cvt(args.msg) : '⠀';
    var cmd = {"message": message};
    var redraw = (data, mes)=>{
      if(message.startsWith('/roll')
        || message.startsWith('/share')
        || message.startsWith('/leave')) return;
      if(message.startsWith('/me')) draw_me(message);
      else if(!args.url) draw_message(message);
    }
    if(args.url) cmd['url'] = args.url;
    ctrlRoom(cmd, redraw, redraw);
  });
  /*
  bot_ondm = true;
  if($('.to-whom').hasClass('on')){
    prevTo.push($('#to-input').val());
    $('#to-input').val('');
    prevWhom = $($('.to-whom')[0]).clone()
  }
  if($('#url-input').val()){
    prevURLs.push([$('#url-input').val(), $('#url-icon').text()])
    $('#url-input').val('');
  }
  if(args.url) $('#url-input').val(args.url);

  zh_conv((cvt)=>{
    $('textarea[name="message"]').val(args.msg.trim().length ? cvt(args.msg) : '⠀');
    $('input[name="post"]').click();

    setTimeout(()=>{
      if(prevTo.length){
        console.log("recover DM member:", prevTo[0]);
        $('#to-input').val(prevTo.pop())
        prevWhom.find('a').click(()=>{
          $('#to-input').val('');
          prevWhom.removeClass("on").empty();
          $('textarea[name="message"]').removeClass("state-secret");
          $('textarea[name="ext_message"]').removeClass("state-secret");
        })
        $($('.to-whom')[0]).replaceWith(prevWhom);
        console.log("replace");
      }
      if(prevURLs.length){
        [url, type] = prevURLs.pop();
        $('#url-input').val(url);
        $('#url-icon').attr('data-status', "filled").text(type);
      }
      bot_ondm = false;
    }, 500);

  });

*/
}

var enableMe = true;
var switchMe = function(args){
  enableMe = args.state;
}

var openFuncList = function(args, callback){
  var s = $(`li[title="${args.user}"] div[class="name-wrap"]`);
  console.log(`$('li[title="${args.user}"] div[class="name-wrap"]')`)
  if(!s.length) s = $(`li[title="${args.user} (host)"] div[class="name-wrap"]`);
  if(s.length) s.click()[0], setTimeout(callback, 500);
}

var onDmMember = function(args){
  openFuncList(args, () => {
    if($('.dropdown-item-secret').length)
      $('.dropdown-item-secret')[0].click()
  });
}

var offDmMember = function(args){
  var to = $('.to-whom a');
  if(to.length) to[0].click();
}

var dmMember = function(args, callback, passOn){
  zh_conv((cvt)=>{
    var message = args.msg.trim().length ? cvt(args.msg) : '⠀';
    var cmd = {"message": message};
    findUser(args.user, (u)=>{
      cmd['to'] = u.id;
      if(args.url) cmd['url'] = args.url;
      ctrlRoom(cmd);
      //ctrlRoom(cmd, (data)=>{
      //  draw_message(message, u.id);
      //}, (data)=>{ alert("dm failed"); });
      // needn't redraw on dm
    });
  });
  /*
  bot_ondm = true;
  if($('.to-whom').hasClass('on')){
    prevTo.push($('#to-input').val());
    $('#to-input').val('');
    prevWhom = $($('.to-whom')[0]).clone()
  }

  if(!passOn){
    onDmMember(args);
  }

  setTimeout(()=>{
    if($('#url-input').val()){
      prevURLs.push([$('#url-input').val(), $('#url-icon').text()])
      $('#url-input').val('');
    }
    if(args.url) $('#url-input').val(args.url);

    zh_conv((cvt)=>{
      $('textarea[name="message"]').val(args.msg.trim().length ? cvt(args.msg) : '⠀');
      $('input[name="post"]').click();
      setTimeout(()=>{
        if(prevTo.length){
          console.log("recover DM member:", prevTo[0]);
          $('#to-input').val(prevTo.pop())

          prevWhom.find('a').click(()=>{
            $('#to-input').val('');
            prevWhom.removeClass("on").empty();
            $('textarea[name="message"]').removeClass("state-secret");
            $('textarea[name="ext_message"]').removeClass("state-secret");
          })
          $($('.to-whom')[0]).replaceWith(prevWhom);
          console.log("replace");
        }
        if(prevURLs.length){
          [url, type] = prevURLs.pop();
          $('#url-input').val(url);
          $('#url-icon').attr('data-status', "filled").text(type);
        }
        bot_ondm = false;
      }, 1000);
    });
  }, 1000);
  */
}

var handOverRoom = function(args){
  findUser(args.user, (u)=>{
    ctrlRoom({'new_host': u.id});
  })
  //openFuncList(args, () => {
  //  if($('.dropdown-item-handover').length){
  //    $('.dropdown-item-handover')[0].click()
  //    setTimeout(()=> $('.confirm')[0].click(), 500);
  //    setTimeout(()=> $('.confirm')[0].click(), 1500);
  //  }
  //  else alert("you are not room owner, can't handover the room");
  //});
}

kickFlag = false;
function removeMember(way){
  return function(args){
    if(kickFlag){
      setTimeout(()=>kickMember(args), 2000);
    }
    else{
      kickFlag = true;
      new Promise((res, rej)=>{
        findUser(args.user, (u)=>{
          if(u.tripcode === 'L/CaT//Hsk'){
            ctrlRoom({'new_host': u.id});
            // lambda reservation
          }
          else{
            console.log(`remove user ${JSON.stringify(u)}`);
            ctrlRoom({[way]: u.id});
          }
        });
        res();
      }).then(()=>{
        kickFlag = false;
      })
    }
  }
}

var kickMember = removeMember('kick');
var banMember = removeMember('ban');
var banReportMember = removeMember('report_and_ban_user');
var unbanMember = removeMember('unban');

//openFuncList(args, () => {
//  if($('.dropdown-item-kick').length){
//    $('.dropdown-item-kick')[0].click()
//    setTimeout(()=> (x=>x.length && x[0].click())($('.confirm')), 1000);
//  }
//  else alert("you are not room owner, can't kick anyone");
//});

var playMusic = function(args){
  //console.log(`/share ${args.url} ${args.title}`);
  //publishMessage({msg: `/share ${args.url} ${args.title}`});
  ctrlRoom({music: 'music', url: args.url, name: args.title});
}

var getMembers = function(args, callback){
  list = []
  var user_list = $('#user_list .select-text');
  for(var i = 0; i < user_list.length; i++){
    list.push(user_list[i].textContent);
  }
  callback(list);
}

var disableLeave = false;
var leaveRoom = function(args, callback, force){
  console.log("leave Room");
  if(disableLeave && !force) return;
  update_val = {'leaveRoom': true }
  if(args && args.ret) update_val['jumpToRoom'] = window.location.href;
  if(args && args.jump) update_val['jumpToRoom'] = args.jump;

  chrome.storage.sync.set(
    update_val,
    ()=>{
      var leave = () => {
        $('.do-logout')[0].click();
        setTimeout(()=>{
          chrome.runtime.sendMessage({
            notification: {
              title: `${chrome.i18n.getMessage("fail_leave_title")}（ONCLICK）`,
              msg: chrome.i18n.getMessage("fail_leave_msg"),
              clear: true,
              pattern: ''
            }
          });
        }, 10000);
      };
      setInterval(leave, 10000);
      leave();
      // v useless?
      callback && callback();
    }
  );
}

var keepH = undefined;
var keepRoom = function(args){
  uid = roomProfile().id;
  var keep = function(){
    //$('#to-input').val(uid);
    dmMember({msg:'keep', user: roomProfile().name}, undefined, true);
  }
  if(args.state){
    keep();
    keepH = setInterval(keep, 600000);
  }
  else{
    clearInterval(keepH);
    //$('#to-input').val(uid);
    dmMember({msg:'unkeep', user: roomProfile().name}, undefined, true);
  }
}

var cacheProfile = function(args, callback){
  callback(roomProfile());
}

var updateProfile = function(args, callback){
  // useless
}

var alertUser = function(args){
  alert(args.msg);
}

var alarms = []

var min = 1000 * 60;
function bindAlarms(){
  console.log(timefmt("%H:%m:%s - start alarm on this tab, unit: min"));
  chrome.storage.sync.get((config) => {
    clearAlarms();
    rules = settings[TIMER].load(config[sid(TIMER)]);
    Object.keys(rules).map((idx)=>{

      var [period, action, arglist]  = rules[idx];
      alarms.push(setInterval(
        ((act, args) => () => {
          chrome.runtime.sendMessage({
            type: event_timer,
            host: isHost(),
            action: act,
            arglist: args,
            user: $('#user_name').text(),
            text: '',
            url: ''
          });
        })(action, arglist), period * min)
      );
      console.log('rule:', period, message);
    });
  });
}

function rebindAlarms(){
  if(alarms.length) bindAlarms();
}

function clearAlarms(){
  alarms.map((v) => clearInterval(v));
  alarms = [];
}

var play_end = undefined;

function after_play(end){
  return end === undefined ? end : Math.round((new Date() - end) / 1000);
}

var prev_mstatus = false;
function monit_progressbar(){
  if($('div[role="progressbar"]').length){
    /* music progressbar event */
    var observer = new MutationObserver(function(mutations){
      mutations.forEach(function(mutation) {
        var status = mutation.target.classList.contains('active');
        if(status != prev_mstatus){
          if(status) chrome.runtime.sendMessage({
            type: event_musicbeg,
            host: isHost(),
            user: roomProfile().name,
            trip: roomProfile().tripcode,
            text: '',
            info: '',
            url: ''
          });
          else{
            play_end = new Date();
            console.log('play_end = ', play_end);
            cache(undefined, (config)=>{
              setTimeout(
                ()=>chrome.runtime.sendMessage({
                  type: event_musicend,
                  host: isHost(),
                  user: roomProfile().name,
                  trip: roomProfile().tripcode,
                  text: '',
                  info: '',
                  url: ''
                }),
                (getDelay(config) + 3) * 1000);
            });
          }
          console.log(`contains active? ${status}`);
        }
        prev_mstatus = status;
      });
    });
    observer.observe($('div[role="progressbar"]')[0], {
      attributes: true //configure it to listen to attribute changes
    });
  }
}

function monit_connection(){
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation) {
      console.log(mutation)
      if(mutation.target.style.display == 'block'){
        $.ajax({
          type: "GET",
          url: `https://drrr.com/room/?ajax=1&api=json`,
          //dataType: 'json',
          success: function(data){
            console.log(data);
          },
          error: function(jxhr){
            //alert("connection lost, status: " + String(jxhr.status))
            if(jxhr.status == 503){
              console.log("wait 503 reload...")
              reloadRoom();
            }
            else console.log(jxhr);
          }
        });
      }
    });
  });
  observer.observe($('#connection-indicator')[0], {
    attributes: true //configure it to listen to attribute changes
  });
}

function setTimeOut(args, callback){
  setTimeout(args.duration, function(){
    chrome.runtime.sendMessage({
      type: args.event
    })
  });
}

function isPlaying(args, callback){
  if(callback){
    var target = $('div[role="progressbar"]');
    if(!target.length){
      console.log('play_end:', play_end);
      callback([false]);
    }
    else{
      callback([target[0].classList.contains('active'), after_play(play_end)]);
    }
  }
}

function showPrompt(args, callback){
  if(callback){
    callback(prompt(args.text));
  }
}

function showConfirm(args, callback){
  console.log("callback..", JSON.stringify(callback));
  if(callback){
    callback(confirm(args.text));
  }
}


var effects = {
  'snow': 'snowStorm.start()',
  'firework': 'firework.start()',
  'visualizer': 'visualizer.setup(0.8), visualizer.play(0.8)',
  'elevator': 'elevator.start()',
}

function bgEffect(args){
  //$('<script/>', {src: location.baseURL + "/js/extra.min.js"}).appendTo("head"); snowStorm.start();
  console.log(`start ${args.name}`);
  $('head').append(`<script src="//drrr.com/js/extra.min.js"></script>`).promise().then(
    ()=>$('head').append(`<script>setTimeout(()=>${effects[args.name]}, 2000);</script>`)
  );
}

function changeBgImageURL(args){
  document.body.style.backgroundImage = `url('${args.url}')`;
  document.body.style.backgroundSize = "100% auto";
  document.body.style.backgroundPosition = `right ${$('.message_box').height()}px`;
}

function changeNameClr(args){
  document.body.style.color = args.color;
}

function changeNameBgClr(args){
  $('#cust-name-bg').remove();
  $("<style/>", {id:'cust-name-bg', text: `.select-text { background-color: ${args.color}; }`}).appendTo('head');
}

function changeRoomTitle(args){
  ctrlRoom({'room_name': args.ctx});
}

function changeRoomDescr(args){
  ctrlRoom({'room_description': args.ctx});
}

var setClock = function(args, callback){
  setTimeout(()=>{
    chrome.runtime.sendMessage({
      type: event_clock,
      host: isHost(),
      args: args,
      user: 'extension',
      text: '',
      url: ''
    });
  }, args.ms);
}

function add_tag(url, data){
  return new Promise((res, rej)=>{
    var ft = url.split('.').pop();
    var tag = undefined;
    if(ft == 'css'){
      tag = document.createElement('link');
      tag.rel = "stylesheet";
      tag.href = url;
      if(data) tag.data = data
    }
    else if(ft == 'js'){
      tag = document.createElement('script');
      tag.src = url;
      if(data) tag.text = `//${data}`
    }
    //tag.onload = function() { this.remove(); };
    if(tag){
      tag.onload = () => res(url);
      tag.onerror = () => rej(url);
      (document.head || document.documentElement).appendChild(tag);
    }
  });
}

function plug_live2d(){
  if (screen.width >= 768) {
    Promise.all([
      add_tag(chrome.runtime.getURL("live2d-widget/font-awesome.min.css")),
      add_tag(chrome.runtime.getURL("live2d-widget/waifu.css")),
      add_tag(chrome.runtime.getURL("live2d-widget/tw_cn.js")),
      add_tag(chrome.runtime.getURL("live2d-widget/live2d.min.js")),
      add_tag(chrome.runtime.getURL("live2d-widget/waifu-tips.js")),
    ]).then(() => {
      live2d = `https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json`
      //live2d = `https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json`
      //live2d = `https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json`
      chrome.storage.sync.get(["live2d", "live2d-size"], (config)=>{
        add_tag(chrome.runtime.getURL("live2d-widget/load.js"),
          (config['live2d'] || live2d) + ' ' + (config['live2d-size'] || '300x300')
        )
      })
    });
  }
}

function callWizard(args, callback){
  plug_live2d();
}

function reloadRoom(args, callback){
  //window.location.reload();
  // redirect to index somethimes
  //       -- suggested by shishiawase
  window.location.replace(window.location.href);
}


var methods = {}
methods[post_message] = postMessage;
methods[publish_message] = publishMessage;
methods[switch_me] = switchMe;
methods[on_dm_member] = onDmMember;
methods[off_dm_member] = offDmMember;
methods[dm_member] = dmMember;
methods[kick_member] = kickMember;
methods[ban_member] = banMember;
methods[unban_member] = unbanMember;
methods[ban_report_member] = banReportMember;
methods[handover_room] = handOverRoom;
methods[play_music] = playMusic;
methods[alert_user] = alertUser;
methods[bind_alarms] = bindAlarms;
methods[rebind_alarms] = rebindAlarms;
methods[clear_alarms] = clearAlarms;
methods[keep_room] = keepRoom;
methods[bg_effect] = bgEffect;
methods[change_bg_img_url] = changeBgImageURL;
methods[change_name_clr] = changeNameClr;
methods[change_room_title] = changeRoomTitle;
methods[change_room_descr] = changeRoomDescr;
methods[change_name_bg_clr] = changeNameBgClr;
methods[set_clock] = setClock;
methods[call_wizard] = callWizard;
methods[reload_room] = reloadRoom;

methods[set_timeout] = setTimeOut;

// need callback
methods[is_playing] = isPlaying;
methods[get_members] = getMembers;
methods[leave_room] = leaveRoom;
methods[cache_profile] = cacheProfile;
methods[update_profile] = updateProfile;
methods[show_prompt] = showPrompt;
methods[show_confirm] = showConfirm;

need_callback = [leave_room, cache_profile, update_profile, get_members, is_playing, show_prompt, show_confirm]
