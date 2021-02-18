const defaultVideoSize = { width:640, height:480 };

var call_constraints = {
  'mandatory': {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
  },
  offerToReceiveAudio: 10,
  offerToReceiveVideo: 10,
}


// Init Howler sound sprite
/* need port
if(Settings.is("mute-message")){
  Howler.mobileAutoEnable = false;
}
*/

var sound = {};
sound.play = function(item){
  var newSound = new Howl({
    src: [
      "/media/effect.mp3"
    ],
    preload: true,
    volume: 1,
    sprite: {
      bubble: [0, 287.3469387755102],
      userin: [2000, 975.2380952380952],
      userout: [4000, 400.5442176870746]
    },
    onloaderror: function(){
      console.warn('Load Sound effect error');
    }
  });
  newSound.play(item);
  sound = newSound;
};




const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
}

const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  canvas.getContext('2d').fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};

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

function handleCall(call){
  call.on('stream', function(stream) {
    // Do something with this audio stream
    playStream(this.peer, stream);
  });

  call.on('close', function() {
    // Do something with this audio stream
    stopStream(this.peer);
  });

  call.on('error', function(err) {
    stopStream(this.peer);
    // Do something with this audio stream
  });
}

function handleCallClose(call){
  call.peerConnection.onconnectionstatechange = function (event) {
    if (event.currentTarget.connectionState === 'disconnected') {
      call.close();
    }
  };
}

function getConfig(){
  const audioSources =
    $('#audio-input')
    .find(':checkbox')
    .filter(':checked')
    .get().map(e => e.value);

  const videoSource = $('#video-input').val();
  return {
    audio: audioSources.length ? true : false,
    //audio: audioSources.length ? {deviceId: audioSources} : false,
    video: videoSource === "none" ? false : {deviceId: videoSource}
  };
}

function getStream(config, success, error){

  function getOtherStreams(cfg, initStream){
    if(cfg.video || cfg.audio){
      navigator.mediaDevices
        .getUserMedia(cfg)
        .then((stream) => {
          stream
            .getTracks()
            .forEach(track => initStream.addTrack(track));
          success(wrapAudioVideo(initStream));
        })
        .catch(e => {
          error(e);
        });
    }
    else success(wrapAudioVideo(initStream));
  }

  if(!config.video && !config.audio)
    success(wrapAudioVideo(new MediaStream([createEmptyAudioTrack()])))
  else if(config.video && config.video.deviceId == 'screen'){
    navigator.mediaDevices
      .getDisplayMedia({video: true, audio: true})
      .then(stream => {
        config.video = false;
        getOtherStreams(config, new MediaStream(stream))
      })
      .catch(e => {
        error(e);
      });
  }
  else getOtherStreams(config,new MediaStream());
}

function handlePeer(peer){

  peer.on('disconnected', function () {

  });

  peer.on('close', function() {
    backToProfile();
  });

  peer.on('error', function (err) {
    if(err.type === 'peer-unavailable'){
      alert("ROOM not existed");
    }
    else if(err.type === 'unavailable-id'){
      alert("The ROOM ID is taken, close duplicated tab or rename");
    }
    else{
      console.log('peer error:' + err.type);
      alert('peer error:' + err.type);
    }
    $('#profile-ui').show();
    $('#chat-ui').hide();
  });
}

function profile2user(p){
  return {
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    call: p.call
  };
}

function addMessage(id, arg){
  let user = id === profile.id ?
    profile2user(profile) : profile.users[id];
  $('#talks').prepend(
    `<dl class="talk ${user.avatar}" id="">
      <dt class="dropdown user">
      <div class="avatar avatar-${user.avatar}"></div>
      <div class="name" data-toggle="dropdown"><span class="select-text">${user.name}</span></div>
      <ul class="dropdown-menu" role="menu"></ul>
      </dt>
      <dd class="bounce">
      <div class="bubble">
        <div class="tail-wrap center" style="background-size: 65px;">
          <div class="tail-mask"></div>
        </div>
        <p class="body select-text">${arg.message}</p>
      </div>
      </dd>
    </dl>`);
  sound.play("bubble");
}

function addLeft(id){
  let user = profile.users[id];
  $('#talks').prepend(`<div class="talk leave system" id="">
    ►► @
    <span class="dropdown user">
      <span data-toggle="dropdown" class="name">${user.name}</span>
      <ul class="dropdown-menu" role="menu"></ul>
    </span>
    已退出部屋
  </div>`);
  sound.play("userout");
}

function addJoin(id){
  let user = profile.users[id];
  $('#talks').prepend(`<div class="talk join system" id="">
    ►► @
    <span class="dropdown user">
      <span data-toggle="dropdown" class="name">${user.name}</span>
      <ul class="dropdown-menu" role="menu"></ul>
    </span>
    已登入部屋
  </div>`);
  sound.play("userin");
}

function leftUser(id){
  addLeft(id);
  if(profile.calls[id]){
    stopStream(id)
    delete profile.calls[id];
  }
  delete profile.users[id];
  delete profile.conns[id];
  renewUserList();
}

function sendCmd(cmd){
  Object.values(profile.conns).forEach(c => {
    if(c.peer != profile.id) c.send(cmd);
  });
}

function sendHost(cmd){
  Object.values(profile.conns).forEach(c => {
    if(c.peer === profile.hostID) c.send(cmd);
  });
}

function handleCallCmd(arg){
  profile.users[arg.user].call = arg.call;
  if(arg.call){
    $(`#${arg.user}`).addClass('is-tripcode');
    if(arg.user === profile.id && profile.call)
      playStream(profile.id, window.localStream);
    if(arg.user === profile.id || !profile.call) return;
    //call him
    profile.calls[arg.user] = profile.peer.call(arg.user, window.localStream, call_constraints);
    handleCall(profile.calls[arg.user]);
    handleCallClose(profile.calls[arg.user]);
  }
  else{
    if(arg.user === profile.id)
      stopStream(profile.id);
    $(`#${arg.user}`).removeClass('is-tripcode');
  }
}

function Host(id, hostName, name, avatar){
  this.id = id;
  this.hostID = id;
  this.hostName = hostName;
  this.name = name;
  this.avatar = avatar;
  this.owner = id;
  this.users = {[id]: profile2user(this)};
  this.conns = {};
  this.call = false;
  this.callType = null;
  this.calls = {}
  this.streams = {}
  this.run = function(){
    this.peer = new Peer(this.id);

    handlePeer.bind(this)(this.peer);

    this.peer.on('open', function(){
      renewUserList();
      goToChat();
    })

    // text connection
    this.peer.on('connection', (function(conn) {
      conn.on('open', function() {
        //conn.send("Sender does not accept incoming connections");
        //setTimeout(function() { conn.close(); }, 500);
      });
      conn.on('data', function(data) {
        switch(data.fn){
          case 'join':
            data.arg.id = conn.peer;
            profile.users[conn.peer] = data.arg;
            profile.conns[conn.peer] = conn;
            conn.send({
              fn: 'room',
              arg: {
                room: profile.hostName,
                owner: profile.owner,
                users: profile.users
              }
            })
            Object.values(profile.conns).forEach(c => {
              if(c.peer != conn.peer)
                c.send({
                  fn: 'user',
                  arg : data.arg
                });
            })
            addJoin(data.arg.id);
            renewUserList();
            break;
          case 'message':
            console.log(`${profile.users[conn.peer].name}:`, data.arg)
            addMessage(this.peer, data.arg)
            break;
          case 'call':
            data.arg.user = this.peer;
            data.arg.call = data.arg.call;
            sendCmd(data);
            handleCallCmd(data.arg);
            break;
          default:
            console.log(`unknown cmd:`, data)
            break;
        }
      });
      conn.on('close', function () {
        leftUser(this.peer);
      });
    }).bind(this));

    // stream connection
    this.peer.on('call', function(call) {
      if(profile.call){
        handleCall(call);
        call.answer(window.localStream);
        handleCallClose(call);
      }
      else{
        call.answer();
        setTimeout(function(){
          call.close();
        }, 2500);
      }
    });
  }
}

function User(id, name, hostID, avatar){
  this.id = id;
  this.name = name;
  this.hostID = hostID;
  this.hostName = '';
  this.avatar = avatar;
  this.users = {};
  this.conns = {};
  this.owner = null;
  this.call = false;
  this.callType = null;
  this.calls = {}
  this.streams = {}
  this.run = function(){
    this.peer = new Peer(this.id);

    handlePeer.bind(this)(this.peer);

    this.peer.on('open', (function(){
      // connect to server
      console.log(this)
      this.conns[this.hostID] = this.peer.connect(this.hostID);
      this.conns[this.hostID].on('open', (function() {
        this.conns[this.hostID].send({
          fn: 'join',
          arg: profile2user(profile)
        })
        //this.host.send("Sender does not accept incoming connections");
        //setTimeout(function() { this.host.close(); }, 500);
      }).bind(this));
      this.conns[this.hostID].on('data', function(data) {
        switch(data.fn){
          case 'user':
            profile.users[data.arg.id] = data.arg;
            profile.conns[data.arg.id] = profile.peer.connect(data.arg.id)
            profile.handleUser(profile.conns[data.arg.id])
            addJoin(data.arg.id);
            renewUserList();
            break;
          case 'room':
            profile.hostName = data.arg.room;
            profile.owner = data.arg.owner;
            profile.users = data.arg.users;
            console.log('room command:', data);
            addJoin(profile.id);
            renewUserList();
            goToChat();
            break;
          case 'message':
            addMessage(this.peer, data.arg);
            break;
          case 'call':
            handleCallCmd(data.arg);
            break;
          default:
            console.log(`unknown cmd`, data)
            break;
        }
      });
      this.conns[this.hostID].on('close', function () {
        alert("Host left");
        backToProfile();
      });

      this.conns[this.hostID].on('error', function (err) {
        if(err.type === 'peer-unavailable'){
          alert("ROOM not existed");
        }
        else{
          console.log('peer error:' + err.type);
          alert('peer error:' + err.type);
        }
      });
    }).bind(this))

    // text connection
    this.peer.on('connection', function(conn) {
      profile.conns[this.peer] = conn;
      profile.handleUser(conn);
    });

    // stream connection
    this.peer.on('call', function(call) {
      if(profile.call){
        handleCall(call);
        call.answer(window.localStream);
        handleCallClose(call);
      }
      else{
        call.answer();
        setTimeout(function(){
          call.close();
        }, 2500);
      }
    });
  }

  this.handleUser = function(conn){
    // this.conns[id]
    conn.on('open', function() {
      // ADD USER TO UI
    });
    conn.on('data', function(data) {
      switch(data.fn){
        case 'message':
          console.log(data.arg);
          addMessage(this.peer, data.arg);
          break;
        default:
          console.log(`unknown cmd ${data}`)
          break;
      }
    });
    conn.on('close', function () {
      leftUser(this.peer);
    });
  }
}

function backToProfile(){
  // TODO delete profile
  $('#chat-ui').hide();
  $('#profile-ui').show();
}

function goToChat(){
  $('.room-title-name').text(profile.hostName);
  $('#profile-ui').hide();
  $('#musicBox').show();
  $('#chat-ui').show();
  $('.sharer').attr('data-url', `https://drrrchatbots.gitee.io${location.pathname}?join=${profile.id}`)
  $('.sharer').attr('data-image', `https://drrr.com/banner/?t=${profile.hostName}`)
  $('.sharer').attr('data-subject', `${profile.hostName}@DOLLARS Mirror（Durarara!! Mirror）`)
  $('#settings-info-room-name').html(`<p>${profile.hostName}</p>`);
  $('#settings-info-room-description').html(`<p>${profile.name}<p></p>${profile.id}</p>`);
  $('#settings-info-room-uptime').html(`<p>Avatar: ${profile.avatar}</p>`);
  $('title').text(profile.hostName);
}

function initialize(){
  // Create own peer object with connection to shared PeerJS server
  var get = name => $(`input[name="${name}"]`).val().trim()
  var avatar = $('.user-icon.active').attr('data-avatar');
  if(host)
    profile = new Host(get("hid"), get("hname"), get("uname"), avatar);
  else if(join)
    profile = new User(get("uid"), get("uname"), get("jid"), avatar);
  profile.run();
};

function toggleMediaSrc(media, src){
  if(media.srcObject || media.src)
    clearMediaSrc(media);
  else bindMediaSrc(media, src);
}

function clearMediaSrc(media){
  if ("srcObject" in media)
    media.srcObject = null;
  else media.src = null;
}

function bindMediaSrc(dom, stream){
  if(!dom.srcObject ||
    (stream.getTracks().length > dom.srcObject.getTracks().length)){
    if ("srcObject" in dom) {
      dom.srcObject = stream;
    } else {
      dom.src = window.URL.createObjectURL(stream);
    }
  }
}

function playStream(id, stream) {
  var uelt = $(`#${id}-audio`);
  if(uelt.length) return;
  profile.streams[id] = stream;
  audio = $(`<audio id="${id}-audio" class="user-audio" style="width:100%;" autoplay controls playsinline/>`).appendTo('#audios');
  video = $(`<video class="user-video" style="width: 75%;" poster="./p2p-chat.png" id="${id}-video" autoplay controls playsinline></video>`).appendTo('#videos');

  media = profile.users[id].call.video ? video[0] : audio[0];

  if(id !== profile.id) bindMediaSrc(media, stream);
  video.click(function(){
    toggleMediaSrc($(`#${id}-video`)[0], stream);
    setTimeout(() => $(`#${id}`).click(), 1000);
  })

  $('#user_list').on("click", `#${id}`, function(event){
    if($(`#${id}`).hasClass('is-tripcode')){
      $('.user-audio').hide();
      $('.user-video').hide();
      $(`#${id}-audio`).show();
      $(`#${id}-video`).show();
    }
  });
  $('.user-audio').hide();
  $('.user-video').hide();
  $(`#${id}-audio`).show();
  $(`#${id}-video`).show();
}

function stopStream(id){
  if($(`#${id}-audio`).length)
    $(`#${id}-audio`).remove();
  if($(`#${id}-video`).length)
    $(`#${id}-video`).remove();
  delete profile.streams[id]
  setTimeout(() => document.getElementById("talks").style.transform = `matrix(1, 0, 0, 1, 0, ${$('.message_box').height()})`, 500);
}

window.localStream = null;

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomPeerID(len){
  return 'DRRR' + makeid(len || 20);
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function gotDevices(deviceInfos) {
  var videoSelect = $('#video-input');
  var audioInputChecks = $('#audio-input');
  //var audioOutputSelect = $('#audio-output');
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'audioinput') {
      //var label = deviceInfo.label || `microphone ${audioInputChecks.find(':checkbox').length + 1}`;
      //audioInputChecks.append($(`<label><input type="checkbox" name="microphone" value="${deviceInfo.deviceId}">${label}</label><br>`));
    } else if (deviceInfo.kind === 'audiooutput') {
      //var label = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
      //audioOutputSelect.append($(`<option value="${deviceInfo.deviceId}">${label}</option>`));
    } else if (deviceInfo.kind === 'videoinput') {
      var label = deviceInfo.label || `camera ${videoSelect.length}`;
      videoSelect.append($(`<option value="${deviceInfo.deviceId}">${label}</option>`));
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  if(navigator.mediaDevices.getDisplayMedia)
    videoSelect.append($(`<option value="screen">Screen</option>`));

  audioInputChecks.append(
    $(`<label><input type="checkbox" name="microphone" value="microphone">Microphone</label>`));
}

function setMediaSources(){
  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
}

function renewUserList(){
  //let clickMenu = `<ul class="dropdown-menu" role="menu"></ul>`;
  let clickMenu = '';
  let owner = profile.users[profile.owner]
  let hostinfo = `<li id="${owner.id}" title="${owner.name} (host)" class="${owner.call ? 'is-tripcode' : ''} dropdown user clearfix symbol-wrap-${owner.avatar} is-host" device="desktop">${clickMenu}<div class="name-wrap" data-toggle="dropdown"><span class="symbol symbol-${owner.avatar}"></span><span class="select-text name">${owner.name}</span></div><span class="icon-display icon-device"></span> <span class="icon icon-users"></span></li>`
  let usersinfo = Object.values(profile.users).filter(u => u.id !== profile.owner).map(u => `<li id="${u.id}" title="${u.name}" class="${u.call ? 'is-tripcode' : ''} dropdown user clearfix symbol-wrap-${u.avatar}" device="desktop">${clickMenu}<div class="name-wrap" data-toggle="dropdown"><span class="symbol symbol-${u.avatar}"></span><span class="select-text name">${u.name}</span></div><span class="icon-display icon-device"></span> <span class="icon icon-users"></span></li>`).join('')
  $('#user_list').html(`${hostinfo}${usersinfo}`);
  setTimeout(() => document.getElementById("talks").style.transform = `matrix(1, 0, 0, 1, 0, ${$('.message_box').height()})`, 500);
}

function replaceStream(peerConnection, mediaStream) {
  for(sender of peerConnection.getSenders()){
    if(sender.track.kind == "audio") {
      if(mediaStream.getAudioTracks().length > 0){
        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
      }
    }
    if(sender.track.kind == "video") {
      if(mediaStream.getVideoTracks().length > 0){
        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
      }
    }
  }
}

function wrapAudioVideo(stream){
  profile.callType = {video: false, audio: false};
  if(!stream.getAudioTracks().length)
    stream.addTrack(createEmptyAudioTrack());
  else profile.callType.audio = true;
  if(!stream.getVideoTracks().length)
    stream.addTrack(createEmptyVideoTrack(defaultVideoSize));
  else profile.callType.video = true;
  return stream;
}

$(document).ready(function(){

  setMediaSources();

  uid = findGetParameter('uid');
  name = findGetParameter('name') || '';
  host = findGetParameter('host');
  join = findGetParameter('join');
  room = findGetParameter('room') || 'This is a Lambda Room';

  if(host && join) host = null;

  uid = uid ? `DRRR${uid}` : randomPeerID();

  if(host) host = `DRROOM${host}`
  if(join) join = `DRROOM${join}`

  if(!name) name = id;

  $(`input[name="uname"]`).val(name)

  $('#home-extra-toggle').click(function(){
    $('#home-extra').toggle();
  })

  let icons = $('.user-icon').click(function(){
    $('.user-icon').removeClass('active');
    $(this).addClass('active');
  })
  // random avatar
  icons.get(Math.floor(Math.random()*icons.length)).click();

  if(host){
    $('#video-div').show();
    $('#host-setting').show();
    $(`input[name="hid"]`).val(host).attr('required', true);
    $(`input[name="hname"]`).val(room).attr('required', true);
    // TODO: if require uid
  }

  if(join){
    $('#join-setting').show();
    $(`input[name="uid"]`).val(uid).attr('required', true)
    $(`input[name="jid"]`).val(join).attr('required', true);
  }

  $('#profile-setting-form').submit(()=>{
    initialize();
    return false;
  });

  $('#message').submit(function(){
    return false;
  });

  let post = $('input[name="post"]').click(function(){
    message = $('textarea[name="message"]').val();
    $('textarea[name="message"]').val('');
    sendCmd({
      fn: 'message',
      arg: {'message': message}
    })
    addMessage(profile.id, {'message': message})
  })

  $('textarea[name="message"]').on('keydown', function(e){
    if(!e.ctrlKey && !e.shiftKey && (e.keyCode || e.which) == 13){
      e.preventDefault();
      if(!$(this).val().trim().length) return $(this).val('');
      if($('#textcomplete-dropdown-1').is(':visible')) return;
      post.click();
    }
    setTimeout(() => $('.counter').text(140 - $(this).val().length), 100);
  });

  /*
  $('.dropdown').click(function(){
    if($(this).hasClass('open')){
      $(this).removeClass('open');
      $(this).find('.preferences').attr("aria-expanded","false");
    }
    else{
      $(this).addClass('open')
      $(this).find('.preferences').attr("aria-expanded","true");
    }
  })
  */

  //$('.icon-settings').click(function(){
  //  //$('#modal-settings').addClass('in');
  //  $('#modal-settings').modal('show');
  //});

  $('.icon-users').click(function(){
    $('#user_list').slideToggle();
    setTimeout(() => document.getElementById("talks").style.transform = `matrix(1, 0, 0, 1, 0, ${$('.message_box').height()})`, 500);
  })

  $('#invite').click(function(){
    ctrlRoom({
      'message': 'Click to join',
      'url': `https://drrrchatbots.gitee.io${location.pathname}?join=${profile.id.replace('DRROOM', '')}`,
    })
    alert("shared!");
  })

  $('.icon-list').click(function(){
    $('#image_panel').slideToggle();
    $('.room-submit-wrap').slideToggle();
    //$('.room-input-wrap').slideToggle();
    setTimeout(() => {
      if($('#image_panel').is(":visible"))
        $('#setting_pannel').css('top', '0px');
      else
        $('#setting_pannel').css('top',$('.message_box').height() + 'px');
    }, 500);
    setTimeout(() => document.getElementById("talks").style.transform = `matrix(1, 0, 0, 1, 0, ${$('.message_box').height()})`, 500);
  })

  $('.logout').click(function(){
    window.location.reload();
  });

  $('#call').click(function(){
    if(!window.localStream){
      window.tryCall = true;
      alert("Setup your stream first! (need save)");
      $('#modal-settings').modal('show');
      $(`#settings-user-tab`).find('a').click();
      return;
    }

    profile.call = profile.callType;
    // inform host
    if(profile.id === profile.owner){
      sendCmd({
        fn: 'call',
        arg: {
          user: profile.id,
          call: profile.call
        }
      });
      handleCallCmd({ user: profile.id, call: profile.call });
    }
    else{
      sendHost({
        fn: 'call',
        arg: {
          user: profile.id,
          call: profile.call
        }
      })
    }
    $('#end-call')[0].style.display = 'list-item';
    $('#call')[0].style.display = 'none';
    $('#stream-info').text('直播間');
    // others will call me
  });
  $('#end-call').click(function(){
    // inform host
    if(profile.id === profile.owner){
      sendCmd({
        fn: 'call',
        arg: {
          user: profile.id,
          call: false
        }
      });
      handleCallCmd({ user: profile.id, call: false });
    }
    else{
      sendHost({
        fn: 'call',
        arg: {
          user: profile.id,
          call: false
        }
      })
    }
    $('#end-call')[0].style.display = 'none';
    $('#call')[0].style.display = 'list-item';
    $('#stream-info').text('點擊手機圖示加入通話');
    Object.values(profile.calls).forEach(call => call.close());
    profile.calls = {};
    profile.call = false;
  })

  $('#save-stream').click(function(){
    getStream(getConfig(),
      function success(stream) {
        if(window.localStream){
          // TEST: update peer stream
          Object.values(profile.calls).forEach(call => {
            replaceStream(call.peerConnection, stream);
          });
          window.localStream.getTracks().forEach(track => track.stop());
        }
        window.localStream = stream;
        if(window.tryCall){
          $('#call').click();
          window.tryCall = false;
        }
        $('#modal-settings').modal('hide');
      },
      function error(e) {
        alert("Error: " + e);
        console.log(e);
      });
  });
});
