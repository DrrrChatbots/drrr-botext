/* plugin hook */
room_hook_plugin = `var prevRoomInfo = undefined;
var roomInfo = undefined;

var [event_me, event_music, event_leave, event_join, event_newhost, event_msg, event_dm, event_dmto, event_newtab, event_exittab, event_exitalarm, event_logout, event_musicbeg, event_musicend, event_timer, event_clock, event_kick, event_ban, event_unban, event_roll, event_roomprofile, event_roomdesc, event_timeout, event_lounge] = ["me", "music", "leave", "join", "new-host", "msg", "dm", "dmto", "newtab", "exittab", "exitalarm", "logout", "musicbeg", "musicend", "timer", "clock", "kick", "ban", "unban", "roll", "room-profile", "new-description", "timeout", "lounge"];
event_events = [event_me      , event_music   , event_leave   , event_join    , event_newhost , event_msg     , event_dm      , event_dmto    ,/* event_logout  , */event_musicbeg , event_musicend, /*event_timer, event_clock, */event_kick, event_ban, event_unban, event_roll, event_roomprofile, event_roomdesc, event_lounge, event_newtab, "*"]

var plugin_hooks = []

// ui part

function draw_message(msg, to){
  var the_message = {
    type: "message",
    from: roomProfile(),
    is_fast: !0,
    is_me: !0,
    message: msg,
  };
  if(to) the_message.secret = true, the_message.to = to;
  the_message.element = writeMessage(the_message, roomProfile());
  the_message.element.find(".bubble").prepend('<div class="tail-wrap center" style="background-size: 65px;"><div class="tail-mask"></div></div>');
  console.log(the_message.element)
  $('#talks').prepend(the_message.element)
}

function writeMessage(e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
  if (1 || !this._shouldBeAlreadyWrittenFast(e)) {
    t = t || e.from;
    var n = {
      secret: e.secret
    };
    e.secret && (n.to = e.to);
    var i = fcc(e.id, t, {
      message: e.message,
      url: e.url
    }, n);
    return e.element = i, i
  }
}

function fcc(e, t, n, i) {
  var o = (n.message || "").toString().split("\\n").filter(function(e) {
    return "" !== e.trim()
  }),
    a = $("<p />", {
      class: "body select-text"
    }),
    s = o.length > 10 ? 10 : o.length - 1;
  if (o.forEach(function(e, t) {
    e.split("  ").forEach(function(e, t) {
      t && a.append("&nbsp;&nbsp;"), a.append(document.createTextNode(e)), " " === e && a.append("&nbsp;")
    }), s > t && a.append($("<br>"))
  }), n.url) {
    var r = this._htmlEncode(n.url),
      l = /[^/]+\\.(bmp|jpg|jpeg|png|svg|gif)/i.exec(r);
    if (l && window.expose) expose.formChatImageContent(a, r, l[0], l[1]);
    else {
      var c = $("<a />", {
        class: "message-link bstooltip",
        text: "URL",
        title: r,
        href: r,
        target: "_blank"
      });
      $(a).append(c)
    }
  }
  var u = $("<dd />").append($("<div />", {
    class: "bubble"
  }).append(a)),
    d = $("<dt />", {
      class: "dropdown user"
    }).data(t).data(i).append($("<div />", {
      class: "avatar"
    }).addClass("avatar-" + t.icon).addClass(t.admin ? "is-mod" : "")).append($("<div />", {
      class: "name",
      "data-toggle": "dropdown"
    }).append($("<span />", {
      text: "" + t.name,
      class: "select-text"
    }))).append($("<ul />", {
      class: "dropdown-menu",
      role: "menu"
    }));
  i.secret && roomProfile().id == t.id && u.append($("<div />", {
    class: "secret-to-whom"
  }).addClass(!1 === i.to.alive ? "dead" : "").append($("<span />", {
    class: "to"
  })).append($("<div />", {
    class: "dropdown user"
  }).data(i.to).append($("<div />", {
    "data-toggle": "dropdown",
    class: "name"
  }).append($("<span />", {
    class: "symbol symbol-" + i.to.icon
  })).append($("<span />", {
    class: "select-text"
  }).text(i.to.name))).append($("<div />", {
    role: "menu",
    class: "dropdown-menu"
  }))));
  var m = $("<dl />", {
    class: "talk",
    id: e
  }).append(d).append(u).addClass(t.icon);
  return i.secret && m.addClass("secret"), t.admin && m.addClass("is-mod"), t.hasOwnProperty("player") && m.addClass(t.player ? "player" : "non-player"), t.hasOwnProperty("alive") && m.addClass(t.alive ? "alive" : "dead"), m
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
          classList = msg.className.split(/\\s+/);
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

function getRoom(succ, err){
  $.ajax({
    type: "GET",
    url: 'https://drrr.com/room?api=json',
    dataType: 'json',
    success: succ,
    error: err
  });
}

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
    if(!cmd.message.startsWith('/me') && !cmd.url)
      draw_message(cmd.message);
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
      plugin_hooks.forEach(hook => hook(eobj, msg, drrr.info))
    })
  }
  else{
    if(eobj.type === 'leave')
      drrr.users = drrr.users.filter(u => u.name !== eobj.user)
    plugin_hooks.forEach(hook => hook(eobj, msg, drrr.info))
  }
}

$('#talks').bind('DOMNodeInserted', function(event) {
  var e = event.target;
  if(e.parentElement.id == 'talks'){
    handle_talks(e);
  }
});`


/* youtube iframe plugin */

function youtube_parser(url){
  if(!url) return false;
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

function youtube_iframe(ytid){
  return `<iframe width="560" height="315"
        src="https://www.youtube.com/embed/${ytid}"
        frameborder="0"
        allow="accelerometer; autoplay;
               clipboard-write; encrypted-media;
               gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
}

function youtube_replace_talk(){
  $("a.message-link").get().forEach(e => {
    var ue = $(e);
    var ytid = youtube_parser(ue.attr("href"));
    if(ytid){ ue.replaceWith(youtube_iframe(ytid)); }
  })
}

let yt_parser_code =
  youtube_parser.toString();

let yt_iframe_code =
  youtube_iframe.toString();

let yt_replace_talk_code =
  youtube_replace_talk.toString();

let youtube_plugin = `${yt_parser_code}
${yt_iframe_code}
(${yt_replace_talk_code})()
$('#talks').bind('DOMNodeInserted', function(event) {
  var e = event.target;
  var ue = $(e).find($('.bubble p a'));
  var ytid = youtube_parser(ue.attr('href'));
  if(ytid){ ue.replaceWith(youtube_iframe(ytid)) }
})`;

/* 503 autoreload plugin */

function monit_503(){
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation) {
      if(mutation.target.style.display == 'block'){
        $.ajax({
          type: "GET",
          url: 'https://drrr.com/room/?ajax=1&api=json',
          success: function(data){
            console.log(data);
          },
          error: function(jxhr){
            if(jxhr.status == 503){
              console.log("wait 503 reload...")
              window.location.replace(window.location.href);
            }
            else console.log(jxhr);
          }
        });
      }
    });
  });
  observer.observe($('#connection-indicator')[0], {
    //configure it to listen to attribute changes
    attributes: true
  });
}

let monit_503_code = monit_503.toString();
let monit_503_plugin = `(${monit_503_code})()`;
var builtin_plugins = {
  'chatroom_hooks': ['code', 'room', false, room_hook_plugin],
  'youtube_iframe': ['code', 'room', true, youtube_plugin],
  'cf_auto_reload': ['code', 'room', false, monit_503_plugin]
}
