window.localStream = null;
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
  if(this.mute) return;
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
sound.mute = 0;

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    }
    catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    }
    finally {
      document.body.removeChild(textarea);
    }
  }
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

function handleCall(call){
  call.on('stream', function(stream) {
    playStream(this.peer, stream);
  });

  call.on('close', function() {
    stopStream(this.peer);
  });

  call.on('error', function(err) {
    stopStream(this.peer);
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

function getStream(config, _success, error){

  let success = val => {
    profile.streamConfig = config;
    _success(val);
  }

  function getOtherStreams(cfg, initStream){
    if(cfg.video || cfg.audio){
      navigator.mediaDevices
        .getUserMedia(cfg)
        .then((stream) => {
          stream
            .getTracks()
            .forEach(track => initStream.addTrack(track));
          success(wrapMedia(initStream));
        })
        .catch(e => {
          error(e);
        });
    }
    else success(wrapMedia(initStream));
  }

  if(!config.video && !config.audio)
    success(wrapMedia(new MediaStream([createEmptyAudioTrack()])))
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

function addMessage(id, arg){
  let user = id === profile.id ?
    profile.toUser() : profile.users[id];
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
    ►► @<span class="dropdown user"><span data-toggle="dropdown" class="name">${user.name}</span><ul class="dropdown-menu" role="menu"></ul></span> 已退出部屋</div>`);
  sound.play("userout");
}

function addJoin(id){
  let user = profile.users[id];
  $('#talks').prepend(`<div class="talk join system" id="">
    ►► @<span class="dropdown user"><span data-toggle="dropdown" class="name">${user.name}</span><ul class="dropdown-menu" role="menu"></ul></span> 已登入部屋</div>`);
  sound.play("userin");
}

function leftUser(id){
  if(!profile.users[id]
    || !profile.users[id])
    return;
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
    if(c.peer === profile.host) c.send(cmd);
  });
}

function handleCallCmd(arg){

  let prevCall = profile.users[arg.user].call;
  profile.users[arg.user].call = arg.call;

  if(arg.call){
    $(`#${arg.user}`).addClass('is-tripcode');
    if(arg.user === profile.id && profile.call)
      playStream(profile.id, window.localStream);
    if(arg.user === profile.id || !profile.call) return;

    if(prevCall && JSON.stringify(prevCall) !== JSON.stringify(arg.call)){
      if(arg.call.video){
        bindMediaSrc($(`#${arg.user}-video`)[0], profile.streams[arg.user]);
        setTimeout(() => $(`#${arg.user}`).click(), 1000);
      }
      else replayStream(arg.user);
    }
    else if(!prevCall){
      //call him
      profile.calls[arg.user] = profile.peer.call(arg.user, window.localStream, call_constraints);
      handleCall(profile.calls[arg.user]);
      handleCallClose(profile.calls[arg.user]);
    }
  }
  else{
    stopStream(arg.user);
    $(`#${arg.user}`).removeClass('is-tripcode');
  }
}

function UserHost(id, name, avatar, room, host){

  let THIS = this;

  THIS.id = id;
  THIS.name = name;
  THIS.avatar = avatar;

  THIS.where = 'login';

  THIS.host = host || id;
  THIS.room = room || '';

  THIS.conns = {};

  // if join group call now
  THIS.call = false;

  // the call type you selected (audio/video)
  THIS.callType = null;

  // call object
  THIS.calls = {}

  // stream of each call object
  THIS.streams = {}

  // your localStream config (mic/camear/screen)
  THIS.streamConfig = null;

  THIS.toUser = function(){
    return {
      id: THIS.id,
      name: THIS.name,
      avatar: THIS.avatar,
      call: THIS.call
    };
  }

  THIS.users = {[id]: THIS.toUser()};

  THIS.isHost = function(){
    return THIS.host === THIS.id;
  }

  THIS.handleCommand = function(data, conn){
    switch(data.fn){
        // host handle only
      case 'join':
        if(THIS.isHost()){
          data.arg.id = conn.peer;
          THIS.users[conn.peer] = data.arg;
          THIS.conns[conn.peer] = conn;
          conn.send({
            fn: 'room',
            arg: {
              room: THIS.room,
              host: THIS.host,
              users: THIS.users
            }
          })
          Object.values(THIS.conns).forEach(c => {
            if(c.peer != conn.peer)
              c.send({ fn: 'user', arg : data.arg });
          })
          addJoin(data.arg.id);
          renewUserList();
        }
        break;
        // both handle in different way
      case 'call':
        if(THIS.isHost()){
          data.arg.user = conn.peer;
          data.arg.call = data.arg.call;
          sendCmd(data);
        }
        handleCallCmd(data.arg);
        break;
        // user handle only
      case 'user':
        if(conn.peer === THIS.host){
          THIS.users[data.arg.id] = data.arg;
          THIS.conns[data.arg.id] = THIS.peer.connect(data.arg.id)
          THIS.handleUser(THIS.conns[data.arg.id])
          addJoin(data.arg.id);
          renewUserList();
        }
        break;
        // user handle only
      case 'room':
        if(conn.peer === THIS.host){
          THIS.room = data.arg.room;
          THIS.host = data.arg.host;
          THIS.users = data.arg.users;
          console.log('room command:', data);
          addJoin(THIS.id);
          renewUserList();
          goToChat();
        }
        break;
        // both handle
      case 'message':
        addMessage(conn.peer, data.arg)
        break;
      default:
        break;
    }
  }

  THIS.connectToHost = function(){

    THIS.conns[THIS.host] = THIS.peer.connect(THIS.host);

    THIS.conns[THIS.host].on('open', function() {
      THIS.conns[THIS.host].send({
        fn: 'join',
        arg: THIS.toUser()
      })
    });

    THIS.conns[THIS.host].on('data', function(data) {
      THIS.handleCommand(data, this);
    });

    THIS.conns[THIS.host].on('close', function () {
      if(profile.where === 'login')
        return;
      profile.where = 'login';
      swal("Host Left!");
      setTimeout(backToProfile, 3000);
    });

    THIS.conns[THIS.host].peerConnection.onconnectionstatechange = function(event){
      switch(event.currentTarget.connectionState){
        case "disconnected":
        case "failed":
        case "closed":
          if(profile.where === 'login')
            return;
          profile.where = 'login';
          swal("Host Left!");
          setTimeout(backToProfile, 3000);
          break;
        default:
          break;
      }
    };

    THIS.conns[THIS.host].on('error', function (err) {
      if(err.type === 'peer-unavailable'){
        alert("ROOM not existed");
      }
      else{
        console.log('peer error:' + err.type);
        alert('peer error:' + err.type);
      }
    });
  }

  THIS.run = function(){
    THIS.peer = new Peer(THIS.id);

    handlePeer.bind(THIS)(THIS.peer);

    THIS.peer.on('open', function(){
      if(THIS.isHost()){
        renewUserList();
        goToChat();
      }
      else THIS.connectToHost();
    });

    // text connection
    THIS.peer.on('connection', function(conn) {
      conn.on('open', function() { });
      conn.on('data', function(data) {
        THIS.handleCommand(data, conn);
      });
      conn.on('close', function () {
        leftUser(conn.peer);
      });
      conn.peerConnection.onconnectionstatechange = function(event){
        switch(event.currentTarget.connectionState){
          case "disconnected":
          case "failed":
          case "closed":
            leftUser(conn.peer);
            break;
          default:
            break;
        }
      };
    });

    // stream connection
    THIS.peer.on('call', function(call) {
      if(THIS.call){
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

function backToProfile(){
  // TODO delete profile
  profile.where = 'login';
  $('#chat-ui').hide();
  $('#profile-ui').show();
}

function goToChat(){
  profile.where = 'room';
  $('.room-title-name').text(profile.room);
  $('#profile-ui').hide();
  $('#musicBox').show();
  $('#chat-ui').show();
  $('.sharer').attr('data-url', `https://drrrchatbots.gitee.io${location.pathname}?join=${profile.id}`)
  $('.sharer').attr('data-image', `https://drrr.com/banner/?t=${profile.room}`)
  $('.sharer').attr('data-subject', `${profile.room}@DOLLARS Mirror（Durarara!! Mirror）`)
  $('#settings-info-room-name').html(`<p>${profile.room}</p>`);
  $('#settings-info-room-description').html(`<p>${profile.name}<p></p>${profile.id}</p>`);
  $('#settings-info-room-uptime').html(`<p>Avatar: ${profile.avatar}</p>`);
  $('title').text(profile.room);
}

function initialize(){
  var get = name => $(`input[name="${name}"]`).val().trim()
  var avatar = $('.user-icon.active').attr('data-avatar');
  if(doHost)
    profile = new UserHost(get("hid"), get("uname"), avatar, get("hname"));
  else if(doJoin)
    profile = new UserHost(get("uid"), get("uname"), avatar, undefined, get("jid"))
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
  if ("srcObject" in dom) {
    dom.srcObject = stream;
  } else {
    dom.src = window.URL.createObjectURL(stream);
  }
}

// on audio/video type change, replay it
function replayStream(id){
  let stream = profile.streams[id];
  stopStream(id);
  playStream(id, stream);
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
    toggleMediaSrc($(`#${id}-video`)[0], profile.streams[id]);
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

// stopStream by
// - stream terminated
// - 'call' command
function stopStream(id){
  if($(`#${id}-audio`).length)
    $(`#${id}-audio`).remove();
  if($(`#${id}-video`).length)
    $(`#${id}-video`).remove();
  delete profile.streams[id]
  setTimeout(() => document.getElementById("talks").style.transform = `matrix(1, 0, 0, 1, 0, ${$('.message_box').height()})`, 500);
}

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
  let theHost = profile.users[profile.host]
  let hostinfo = `<li id="${theHost.id}" title="${theHost.name} (host)" class="${theHost.call ? 'is-tripcode' : ''} dropdown user clearfix symbol-wrap-${theHost.avatar} is-host" device="desktop">${clickMenu}<div class="name-wrap" data-toggle="dropdown"><span class="symbol symbol-${theHost.avatar}"></span><span class="select-text name">${theHost.name}</span></div><span class="icon-display icon-device"></span> <span class="icon icon-users"></span></li>`
  let usersinfo = Object.values(profile.users).filter(u => u.id !== profile.host).map(u => `<li id="${u.id}" title="${u.name}" class="${u.call ? 'is-tripcode' : ''} dropdown user clearfix symbol-wrap-${u.avatar}" device="desktop">${clickMenu}<div class="name-wrap" data-toggle="dropdown"><span class="symbol symbol-${u.avatar}"></span><span class="select-text name">${u.name}</span></div><span class="icon-display icon-device"></span> <span class="icon icon-users"></span></li>`).join('')
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

function wrapMedia(stream){
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
  doHost = findGetParameter('host');
  doJoin = findGetParameter('join');
  room = findGetParameter('room') || 'This is a Lambda Room';

  if(doHost && doJoin) doHost = null;

  uid = uid ? `DRRR${uid}` : randomPeerID();

  if(doHost) doHost = `DRROOM${doHost}`
  if(doJoin) doJoin = `DRROOM${doJoin}`

  if(!name) name = uid.substr(4, 5);

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

  if(doHost){
    $('#video-div').show();
    $('#host-setting').show();
    $(`input[name="hid"]`).val(doHost).attr('required', true);
    $(`input[name="hname"]`).val(room).attr('required', true);
    // TODO: if require uid
  }

  if(doJoin){
    $('#join-setting').show();
    $(`input[name="uid"]`).val(uid).attr('required', true)
    $(`input[name="jid"]`).val(doJoin).attr('required', true);
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

  $('.icon-users').click(function(){
    $('#user_list').slideToggle();
    setTimeout(() => document.getElementById("talks").style.transform = `matrix(1, 0, 0, 1, 0, ${$('.message_box').height()})`, 500);
  })

  $('#invite').click(function(){
    ctrlRoom({
      'message': 'Click to join',
      'url': `https://drrrchatbots.gitee.io${location.pathname}?join=${profile.id.replace('DRROOM', '')}`,
    })
    swal("shared!");
  })

  $('#inviteURL').click(function(){
    copyToClipboard(`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.id.replace('DRROOM', '')}`)
    swal("copied!");
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
    if(!profile.streamConfig){
      window.tryCall = true;
      swal("Setup your stream first!\n(need save)");
      $('#modal-settings').modal('show');
      $(`#settings-user-tab`).find('a').click();
      return;
    }

    function doCall(){
      profile.call = profile.callType;
      callCmd = {
        fn: 'call',
        arg: {
          user: profile.id,
          call: profile.call
        }
      };
      // inform host
      if(profile.isHost()){
        sendCmd(callCmd);
        handleCallCmd(callCmd.arg);
      }
      else sendHost(callCmd)
      $('#end-call')[0].style.display = 'list-item';
      $('#call')[0].style.display = 'none';
      $('#stream-info').text('Streaming...');
      // others will call me
      // consider call failed, set the UI back
    }

    if(!window.localStream){
      getStream(getConfig(),
        function success(stream) {
          window.localStream = stream;
          doCall();
        },
        function error(e) {
          alert("Error: " + e);
          console.log(e);
        }
      );
    } else doCall();
  });

  $('#end-call').click(function(){
    // inform host
    if(profile.isHost()){
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
    $('#stream-info').text('Click phone to join group chat');
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

        if(profile.call){
          // TODO, consider audio or video
          profile.streams[profile.id] = stream;

          if(profile.call.video){
            bindMediaSrc($(`#${profile.id}-video`)[0], stream);
            setTimeout(() => $(`#${profile.id}`).click(), 1000);
          }
          else replayStream(profile.id);

          if(JSON.stringify(profile.call) !== JSON.stringify(profile.callType)){
            profile.call = profile.callType;
            // alert others
            (profile.isHost() ? sendCmd : sendHost)({
              fn: 'call',
              arg: {
                user: profile.id,
                call: profile.call
              }
            });
          }
        }

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
