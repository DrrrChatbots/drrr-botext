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
  if(!cookies[0]) console.log(cookies);
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

  do_method(){
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
  }

  ctrlRoom(...args){
    this.method_queue.push(((args) => {
      return ()=>ctrlRoom.apply(this, args);
    })(args));
    this.do_method();
  }

  ctrl = this.ctrlRoom.bind(this);

  ajaxProfile = ajaxProfile.bind(this);

  listen(e){
    lambdascript_event_action(e.type, null, e);
  }

  handle(talk){
    // ignore room history
    if(!this.history) return;

    let e = talk2event(talk, this);
    (this.events[e.type] || []).forEach(
      f => f(e.user, e.text, e.url, e.trip, e))

    if(this.listen) this.listen(e)
  }

  handleUser(talk){
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
  }

  update(callback){
    let self = this;
    let url = "/json.php";
    if(self.history) url += `?update=${self.history.update}`;
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
  }

  event(type, callback){
    this.events[type] = this.events || [];
    this.events.push(callback);
  }

  state(name, callback){
    this.states[name] = callback;
  }

  going(name){
    let dest = this.states[name];
    if(!dest) return console.log("no such state");
    this.cur_st = name;
    dest();
  }

  visit(name){
    let dest = this.states[name];
    if(!f) return console.log("no such state");
    this.cur_st = name;
    dest();
  }

  login(...args){
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
          console.log(data);
          let cookie = request.getResponseHeader('drrr-cookie')
          if(data.redirect) return callback(data);
          callback && callback(data['token'], getCookie(cookie));
        },
        error: function(res){
          console.log("login-1-step failed");
          console.log(res.status);
          console.log(res.text);
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
          console.log("login-2-step failed");
          callback && callback(res);
        }
      });
    });
  }

  title(msg){
    this.ctrlRoom({'room_name': String(msg)});
  }
  descr(msg){
    this.ctrlRoom({'room_description': String(msg)});
  }
  print(msg, url){
    // TODO
    this.drrr_send(msg, url);
  }
  dm(user, msg, url){
    // TODO
    this.drrr_send(msg, url, user);
  }
  drrr_send(msg, url, to){
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
  }
  chown(user){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'new_host': u.id});
    })
  }
  kick(user){
    this.findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        this.ctrlRoom({'new_host': u.id});
      else
        this.ctrlRoom({'kick': u.id});
    })
  }
  ban(user){
    this.findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        this.ctrlRoom({'new_host': u.id});
      else
        this.ctrlRoom({'ban': u.id});
    })
  }
  report(user){
    this.findUser(user, (u)=>{
      if(ADMINS.includes(u.tripcode))
        this.ctrlRoom({'new_host': u.id});
      else
        this.ctrlRoom({'report_and_ban_user': u.id});
    })
  }
  unban(user){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'unban': u.id});
    })
  }
  leave(succ, fail){
    this.ctrlRoom({'leave': 'leave'}, succ, fail);
  }
  play(keyword, p1, p2){
    var idx = undefined, source = undefined;
    if(p1){ if(p1 in api) source = p1; else idx = p1; }
    if(p2){ if(p2 in api) source = p2; else idx = p2; }
    log(`play music[${source}][${idx}]: ${keyword}`);
    setTimeout(()=> play_search(
      get_music.bind(null, keyword, source),
      //TODO
      (msg) => this.drrr_send(msg), idx
    ), 1000);
  }
  join(room_id, callback){
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
        console.log("join successfully");
        callback && callback(json)
        let handle_count = 0;
        let handle = () => {
          if(handle_count) return;
          handle_count += 1;
          self.update(json => {
            let room = json;
            if(room && room.talks){
              room.talks.forEach(talk => self.handleUser(talk));
              room.talks.forEach(talk => self.handle(talk));
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
        console.log("join failed");
      }
    });
  }
  create(name, desc, limit, lang, music, adult, hidden, succ, fail){
    let self = this;
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
        console.log("create successfully");
        // TODO
        renew_chatroom();
        reload_chatroom();
        if(succ) succ();
      },
      error: function(data){
        console.log("create failed");
        if(fail) fail();
      }
    });
  }
  findUser(name, callback){
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
  }
  // for werewolf room on drrr.com
  player(user, player = false){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'player': player, to: u.id });
    })
  }
  alive(user, alive = false){
    this.findUser(user, (u)=>{
      this.ctrlRoom({'alive': alive, to: u.id });
    })
  }
  setInfo(info){
    if(info){
      this.prevInfo = this.info;
      this.info = info;
      if(info.prfile)
        this.profile = info.profile;
      if(info.user)
        this.user = info.user;
      if(info.room){
        this.room = info.room;
        this.users = info.room.users;
      }
    }
    if(info && info.redirect) this.loc = info.redirect;
    else this.loc = "room";
  }
  getLounge(callback){
    ajaxRooms.bind(this)((data)=>{
      this.lounge = data.lounge;
      this.rooms = data.rooms;
      if(callback) callback(data);
    })
  }

  getProfile(callback){
    getProfile.bind(this)((profile)=>{
      this.profile = profile;
      this.name = profile.name;
      this.avatar = profile.icon;
      this.lang = profile.lang;
      this.agent = profile.device;
      if(callback) callback(profile);
    })
  }

  getLoc(callback){
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
  }
  getReady(callback){
    this.getProfile(() => {
      this.getLoc(() => {
        this.getLounge(() => {
          callback && callback();
        });
      });
    });
  }
}

globalThis.Bot = Bot;

function lambdascript_event_action(event, config, req){
  var rules = PS.DrrrBot.events[""] || []

  if(PS.DrrrBot.cur.length)
    rules = rules.concat(PS.DrrrBot.events[PS.DrrrBot.cur] || [])

  rules.map(([type, user_trip_regex, cont_regex, action])=> {
    if((Array.isArray(type) && type.includes(event)) || type == event){
      //log("event matched!");
      if(match_user(req.user, req.trip, user_trip_regex)){
        //log("user matched!");
        if((req.text === 'unknown' || req.text === undefined)
          || req.text.match(new RegExp(cont_regex))){
          //log("context matched!");
          action(req.user, req.text, req.url, req.trip, req);
          //argfmt(arglist, req.user, req.text, req.url, (args)=>{
          //  return actions[action].apply(config, args);
          //});
        } //else log('content unmatched', req.text, cont_regex);
      } //else log('user unmatched', req.user, user_trip_regex);
    } //else log('event unmatched', event);
  });
}
