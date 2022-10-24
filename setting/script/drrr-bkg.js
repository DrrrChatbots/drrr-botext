/* setting.html */

doing = false;
queue = []
function renew_chatroom(){
  return; // not work for standalone bot
  if(doing){ queue.push(1) }
  else{
    doing = true;
    wait_again = function(){
      if(globalThis.show_chatroom){
        $('#iframe-container')
          .append('<iframe class="drrr" src="https://drrr.com/"></iframe>');
        setTimeout(remove_until, 5000);
      }
    }
    remove_until = function(){
      if($('.drrr').length > 1){
        $('.drrr')[0].remove();
        setTimeout(remove_until, 5000);
      }
      else if(queue.length){
        queue.pop();
        wait_again();
      }
      else doing = false;
    }
    wait_again();
  }
}

function renew_callback(msg, to){
  if(to
    || !msg.startsWith
    || msg.startsWith('/roll')
    || msg.startsWith('/share')
    || msg.startsWith('/leave')
    || msg.startsWith('/me'))
    return undefined;
  return renew_chatroom;
}

function reload_chatroom(){
  return; // not work for standalone bot
  setTimeout(()=>{
    roomTabs((tabs)=>{
      if(tabs.length)
        chrome.tabs.reload(tabs[0].id);
    }, "https://drrr.com/*");
  }, 2000);
}

function talk2event(talk, bot){
  let evt = {
    type: "",
    user: (talk.from && talk.from.name) || "",
    trip: (talk.from && talk.from.tripcode) || "",
    from: (talk.from || false),
    text: talk.content || talk.message || "",
    url: talk.url || ""
  };
  if(talk.type === 'message')
    evt.type = talk.to ? (talk.from.name == bot.name ? 'dmto': 'dm') : 'msg';
  else evt.type = talk.type;
  return evt;
}

function getCookie(cookie_raw){
  let cookies = cookie_raw;
  if(!cookies[0]) pprint(cookies);
  // what if cookies is a string instead of an array
  if ( (cookies != null) && (cookies[0].length == 1) ) {
    cookies = new Array(1);
    cookies[0] = cookie_raw || cookie_raw;
  }
  for (let i = 0; i < cookies.length; i++)
    cookies[i] = cookies[i].split(';')[0];
  return cookies.join(";");
}

class Bot {

  room = {};
  events = {};
  states = {};
  cur_st = "";
  loopID = null;
  history = null;
  lastTalk = null;
  cookie = '';

  constructor(...args){
    args = args.filter(v => typeof v !== 'object');
    let [name, avatar, lang, agent] = args;
    this.name = name;
    this.avatar = avatar;
    this.cookie = '';
    this.lang = lang || 'en-US';
    this.agent = agent || 'Bot';
  }

  exec_method = false;
  method_queue = [];
  exec_time_gap = 1500;

  _prev_say_args = [];

  repeat = function(msg){
    let [func, args] = this._prev_say_args;
    if(func) this[func](...args);
  }

  do_method = (function(){
    let self = this;
    function _do_method(){
      if(self.method_queue.length){
        self.method_queue.shift()(); // may use promise instead
        setTimeout(()=>{ // wait previous task complete
          if(self.method_queue.length)
            _do_method();
          else self.exec_method = false;
        }, self.exec_time_gap);
      }
    }
    if(!self.exec_method){ self.exec_method = true; _do_method(); }
  }).bind(this);

  ctrlRoom = (function(...args){
    this.method_queue.push(((args) => {
      return ()=>_ctrlRoom.apply(this, args);
    })(args));
    this.do_method();
  }).bind(this);

  ctrl = this.ctrlRoom.bind(this);

  ajaxProfile = ajaxProfile.bind(this);

  listen = (function(e){
    lambdascript_event_action(e.type, null, e);
  }).bind(this);

  handle = (function(talk){
    // ignore room history
    if(!this.history) return;

    let e = talk2event(talk, this);
    (this.events[e.type] || []).forEach(
      f => f(e.user, e.text, e.url, e.trip, e))

    if(this.listen) this.listen(e)
  }).bind(this);

  handleUser = (function(talk){
    if(!talk.user) return;
    if(talk.type === 'join'){
      let users = this.room.users || []
      let index = users.findIndex(u => u.id == talk.user.id);
      if(index < 0) this.room.users.push(talk.user);
    }
    else if(talk.type === 'leave'){
      let users = this.room.users || []
      let index = users.findIndex(u => u.id == talk.user.id);
      if(index >= 0) this.room.users.splice(index, 1);;
    }
  }).bind(this);

  goodUpdate = (function(){
    let updateTime = this.lastTalk && this.lastTalk.time || null;
    if(this.history && this.history.update){
      let update = this.history.update;
      updateTime = updateTime ?
        (update > updateTime ? updateTime : update) : update;
    }
    return updateTime && updateTime - 60 * 1000;
  }).bind(this);

  update = (function(callback){
    let self = this;
    let url = "/json.php";
    let updateTime = self.goodUpdate();
    if(updateTime) url += `?update=${updateTime}`;
    $.ajax({
      type: "GET",
      url: 'https://drrr.com' + url,
      dataType: 'json',
      beforeSend : function(xhr) {
        if(self.agent){
          xhr.setRequestHeader('drrr-agent', self.agent);
          xhr.setRequestHeader('drrr-cookie', self.cookie);
        }
      },
      success: function(data, textStatus, request){
        if(data.users){
          self.room = data;
          self.users = data.users;
        }
        callback && callback(data);
        self.history = data;
      },
      error: function(res){
        callback(false);
      }
    });
  }).bind(this);

  event = (function(type, callback){
    this.events[type] = this.events || [];
    this.events.push(callback);
  }).bind(this);

  state = (function(name, callback){
    this.states[name] = callback;
  }).bind(this);

  going = (function(name){
    let dest = this.states[name];
    if(!dest) return pprint("no such state");
    this.cur_st = name;
    dest();
  }).bind(this);

  visit = (function(name){
    let dest = this.states[name];
    if(!f) return pprint("no such state");
    this.cur_st = name;
    dest();
  }).bind(this);

  login = (function(...args){
    let self = this;
    let callback = args.find(v => typeof v === 'function');
    let ready = args.find(
      v => typeof v === 'boolean') || true;

    function get_login_token(bot, callback){
      $.ajax({
        type: "GET",
        url: "https://drrr.com?api=json",
        dataType: 'json',
        beforeSend : function(xhr) {
          if(self.agent){
            xhr.setRequestHeader('drrr-agent', self.agent);
            xhr.setRequestHeader('drrr-cookie', self.cookie);
          }
        },
        success: function(data, textStatus, request){
          pprint(data);
          let cookie = request.getResponseHeader('drrr-cookie')
          if(data.redirect) return callback(data);
          callback && callback(data['token'], getCookie(cookie));
        },
        error: function(res){
          pprint("login-1-step failed");
          pprint(res.status);
          pprint(res.text);
          callback && callback(res);
        }
      });
    }

    get_login_token(this, (token, cookie) => {

      if(!cookie) return callback && callback(token);

      let form = {
        'name' : this.name,
        'login' : 'ENTER',
        'token' : token,
        'language' : this.lang,
        'icon' : this.avatar
      };

      this.cookie = cookie;


      $.ajax({
        type: "POST",
        url: "https://drrr.com?api=json",
        data: form,
        dataType: 'json',
        beforeSend : function(xhr) {
          if(self.agent){
            xhr.setRequestHeader('drrr-agent', self.agent);
            xhr.setRequestHeader('drrr-cookie', self.cookie);
          }
        },
        success: function(data, textStatus, request){
          let cookie = request.getResponseHeader('drrr-cookie');
          self.cookie = getCookie(cookie);
          if(ready)
            self.getReady(() => callback && callback(data));
          else callback(data);
        },
        error: function(res){
          pprint("login-2-step failed");
          callback && callback(res);
        }
      });
    });
  }).bind(this);

  title = (function(msg){
    this.ctrlRoom({'room_name': String(msg)});
  }).bind(this);

  descr = (function(msg){
    this.ctrlRoom({'room_description': String(msg)});
  }).bind(this);

  print = (function(msg, url){
    this._prev_say_args = ['print', arguments];
    this.drrr_send(msg, url);
  }).bind(this);

  dm = (function(user, msg, url){
    this._prev_say_args = ['dm', arguments];
    this.drrr_send(msg, url, user);
  }).bind(this);

  log = function () {
    var logger = document.getElementById('log');
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] == 'object') {
        logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 1).replaceAll("\n", "<br>") : arguments[i]) + '&nbsp;';
      } else {
        logger.innerHTML += arguments[i] + '&nbsp;';
      }
    }
    logger.innerHTML += '<br />';
    jQuery( function(){
      var pre = jQuery("#log");
      pre.scrollTop( pre.prop("scrollHeight") );
    });
  }

  drrr_send = (function(msg, url, to){
    let callback = renew_callback(msg, to);

    let cmd = {"message": String(msg)}
    let chatcmd = { msg: String(msg) }

    if(url){
      cmd['url'] = url;
      chatcmd['url'] = url;
    }

    if(to){
      this.findUser(to, (u)=>{
        cmd['to'] = u.id;
        this.ctrlRoom(cmd, callback, callback);
      });
    }
    else{
      this.ctrlRoom(cmd, callback, callback)
      // not work for standalone bot
      //sendTab({ fn: publish_message, args: chatcmd },
      //  ()=>{ ctrlRoom(cmd, callback, callback) },
      //  callback);
    };
  }).bind(this);

  chown = (function(user){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'new_host': u.id});
    })
  }).bind(this);

  kick = (function(user){
    this.findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        this.ctrlRoom({'new_host': u.id});
      else
        this.ctrlRoom({'kick': u.id});
    })
  }).bind(this);

  ban = (function(user){
    this.findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        this.ctrlRoom({'new_host': u.id});
      else
        this.ctrlRoom({'ban': u.id});
    })
  }).bind(this);

  report = (function(user){
    this.findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        this.ctrlRoom({'new_host': u.id});
      else
        this.ctrlRoom({'report_and_ban_user': u.id});
    })
  }).bind(this);

  unban = (function(user){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'unban': u.id});
    })
  }).bind(this);

  leave = (function(succ, fail){
    this.ctrlRoom({'leave': 'leave'}, succ, fail);
  }).bind(this);

  play = (function(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    pprint(`play music[${source}][${idx}]: ${keyword}`);
    setTimeout(()=> play_search(
      get_music.bind(null, keyword, source),
      //TODO
      (msg) => this.drrr_send(msg), idx
    ), 1000);
  }).bind(this);

  join = (function(room_id, callback){
    let self = this;
    $.ajax({
      type: "GET",
      url: "https://drrr.com/room/?id=" + room_id + "&api=json",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      beforeSend : function(xhr) {
        if(self.agent){
          xhr.setRequestHeader('drrr-agent', self.agent);
          xhr.setRequestHeader('drrr-cookie', self.cookie);
        }
      },
      success: function(json){
        pprint("join successfully");
        callback && callback(json)
        let handle_count = 0;
        let handle = () => {
          if(handle_count) return;
          handle_count += 1;
          self.update(json => {
            let room = json;
            if(room && room.talks){
              let talks = room.talks.filter(
                talk => !self.lastTalk || talk.time > self.lastTalk.time)
              talks.forEach(talk => self.handleUser(talk));
              talks.forEach(talk => self.handle(talk));
              if(talks.length)
                self.lastTalk = talks[talks.length - 1];
            }
            handle_count -= 1;
          });
        }
        if(!self.loopID){
          self.loopID = setInterval(handle, 2000);
          intervals_remove_on_reExecute.push(self.loopID);
        }
        handle();
        renew_chatroom();
        reload_chatroom();
      },
      error: function(data){
        pprint("join failed");
      }
    });
  }).bind(this);

  create = (function(name, desc, limit, lang, music, adult, hidden, succ, fail){
    let self = this;
    if(!name) name = "Lambda ChatRoom " + String(Math.floor(Math.random() * 100))
    if(!desc) desc = ''
    if(!limit) limit = 5;
    if(!lang) lang = Profile.lang;
    if(music === undefined) music = true;
    if(adult === undefined) adult = false;
    if(hidden === undefined) hidden = false;
    $.ajax({
      type: "POST",
      url: "https://drrr.com/create_room/?",
      dataType: 'html',
      beforeSend : function(xhr) {
        if(self.agent){
          xhr.setRequestHeader('drrr-agent', self.agent);
          xhr.setRequestHeader('drrr-cookie', self.cookie);
        }
      },
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
        pprint("create successfully");
        // TODO
        renew_chatroom();
        reload_chatroom();
        if(succ) succ();
      },
      error: function(data){
        pprint("create failed");
        if(fail) fail();
      }
    });
  }).bind(this);

  findUser = (function(name, callback){
    if(this.users)
      for(let u of this.users){
        if(u.name == name) return callback ? callback(u) : u;
      }
    if(this.info && this.info.room)
      for(let u of this.info.room.users){
        if(u.name == name) return callback ? callback(u) : u;
      }
    if(this.prevInfo && this.prevInfo.room){
      for(let u of this.prevInfo.room.users){
        if(u.name == name) return callback ? callback(u) : u;
      }
    }
  }).bind(this);

  // for werewolf room on drrr.com
  player = (function(user, player = false){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'player': player, to: u.id });
    })
  }).bind(this);

  alive = (function(user, alive = false){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'alive': alive, to: u.id });
    })
  }).bind(this);

  setInfo = (function(info){
    if(info){
      this.prevInfo = this.info;
      this.info = info;
      if(info.prfile){
        this.profile = info.profile;
        this.user = this.profile;
      }
      if(info.user)
        this.user = info.user;
      if(info.room){
        this.room = info.room;
        this.users = info.room.users;
      }
    }
    if(info && info.redirect) this.loc = info.redirect;
    else this.loc = "room";
  }).bind(this);

  getLounge = (function(callback){
    ajaxRooms.bind(this)((data)=>{
      this.lounge = data.lounge;
      this.rooms = data.rooms;
      if(callback) callback(data);
    })
  }).bind(this);

  getProfile = (function(callback){
    getProfile.bind(this)((profile)=>{
      this.profile = profile;
      this.user = this.profile;
      this.name = profile.name;
      this.avatar = profile.icon;
      this.lang = profile.lang;
      this.agent = profile.device;
      if(callback) callback(profile);
    })
  }).bind(this);

  getLoc = (function(callback){
    getRoom.bind(this)((info)=>{
      this.setInfo(info);
      if(callback) callback(info);
    }, (jxhr) => {
      if(jxhr.status == 503){
        // TODO
        //sendTab({ fn: reload_room, args: { } })
        //setTimeout(() =>  this.getLoc(callback), 5 * 1000);
      }
    })
  }).bind(this);

  getReady = (function(callback){
    this.getProfile(() => {
      this.getLoc(() => {
        this.getLounge(() => {
          callback && callback();
        });
      });
    });
  }).bind(this);
}

globalThis.Bot = Bot;

function lambdascript_event_action(event, config, req){
  if(!globalThis.machine) return;

  var rules = globalThis.machine.events[""] || []

  if(globalThis.machine.cur.length)
    rules = rules.concat(globalThis.machine.events[globalThis.machine.cur] || [])

  rules.map(([type, action])=> {
    if((Array.isArray(type) && type.includes(event)) || type == event){
      action(req.user, req.text, req.trip, req.url, req);
    }
  });
}
