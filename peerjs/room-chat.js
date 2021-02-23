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

var sound = new Howl({
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
      if(profile.where === 'login'){
        swal({
          title: "Not Existed",
          text: "Room Not Existed",
          type: "warning",
          showConfirmButton: !1,
          timer: 1e3
        });
        dropLounge(profile.host);
        setTimeout(() => window.location.reload(), 2e3);
      }
      else if(profile.where === 'hall'){
        swal({
          title: "Not Existed",
          text: "Room Not Existed",
          type: "warning",
          showConfirmButton: !1,
          timer: 4e3
        });
        return dropLounge($(`button[value="${profile.host}"]`).parent().attr('id'),
          updateRoomList, updateRoomList);
      }
      else return;
      // think
    }
    else if(err.type === 'unavailable-id'){
      alert("The ROOM ID is taken, close duplicated tab or rename");
    }
    else{
      console.log('peer error:' + err.type);
      console.log(err);
      //alert('peer error:' + err.type);
      //Failed to execute 'setRemoteDescription' on 'RTCPeerConnection': Failed to set remote answer sdp: Called in wrong state: stable
    }
    backToProfile();
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

function addHost(id){
  let user = profile.users[id];
  $('#talks').prepend(`<div class="talk join system" id="">
    ►► @<span class="dropdown user"><span data-toggle="dropdown" class="name">${user.name}</span><ul class="dropdown-menu" role="menu"></ul></span> 成為新房主</div>`);
  sound.play("userin");
  renewUserList();
}

function newHost(id){
  if(id){
    // choose id
    profile.host = id;
    addHost(profile.host);
  }
  else{
    // auto selection first
    profile.host = Object.values(profile.users).reduce(function(prev, curr) {
      return prev.timestamp < curr.timestamp ? prev : curr;
    }).id;
    addHost(profile.host);
  }
  if(profile.host === profile.id)
    uploadLounge(roomInfo('keep'));
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

  if(id === profile.host){
    newHost();
  }

  renewUserList();
}

function sendCmd(cmd){
  Object.values(profile.users).forEach(u => {
    let c = profile.conns[u.id];
    if(c && c.peer != profile.id) c.send(cmd);
  });
}

function sendHost(cmd){
  if(profile.conns[profile.host]){
    profile.conns[profile.host].send(cmd);
  }
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

  THIS.host = host;
  THIS.room = room || '';
  THIS.roomID = room ? `${room}_${Math.floor(Date.now() / 1000)}` : '';
  THIS.rootID = room ? `${id}` : '';
  THIS.rootName = room ? `${name}` : '';
  THIS.rootAvatar = room ? `${avatar}` : '';

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

  THIS.handleUser = function(conn){
    conn.on('open', function() {
      // ADD USER TO UI
    });
    conn.on('data', function(data) {
      THIS.handleCommand(data, conn);
    });
    conn.on('close', function () {
      leftUser(conn.peer);
    });
  }

  THIS.handleCommand = function(data, conn){
    switch(data.fn){
        // host handle only
      case 'join':
        if(THIS.isHost()){
          data.arg.id = conn.peer;
          data.arg.timestamp = Math.floor(Date.now() / 1000);
          THIS.users[conn.peer] = data.arg;
          THIS.conns[conn.peer] = conn;
          conn.send({
            fn: 'room',
            arg: {
              room: THIS.room,
              roomID: THIS.roomID,
              rootID: THIS.rootID,
              rootName: THIS.rootName,
              rootAvatar: THIS.rootAvatar,
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
          Object.keys(data.arg).forEach(k => {
            THIS[k] = data.arg[k];
          });
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
      case 'new-host':
        // TODO: complete UI control
        if(conn.peer === THIS.host){
          THIS.host = data.arg.host;
          newHost(THIS.host);
        }
        break;
      default:
        break;
    }
  }

  THIS.leaveRoom = function(){
    Object.values(THIS.calls).forEach(c => c.close());
    Object.values(THIS.conns).forEach(c => c.close());
    THIS.host = null;
    THIS.room = '';
    THIS.roomID = ''
    THIS.rootID = ''
    THIS.rootName = ''
    THIS.rootAvatar = ''
    THIS.conns = {};
    THIS.call = false;
    // call object
    THIS.calls = {}
    // stream of each call object
    THIS.streams = {}
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
      if(!profile) return;
      if(profile.where === 'login')
        return;
      profile.where = 'login';
      //swal("Host Left!");
      leftUser(THIS.conns[THIS.host].peer);
      //setTimeout(backToProfile, 3000);
    });

    THIS.conns[THIS.host].peerConnection.onconnectionstatechange = function(event){
      switch(event.currentTarget.connectionState){
        case "disconnected":
        case "failed":
        case "closed":
          if(!profile) return;
          if(profile.where === 'login')
            return;
          profile.where = 'login';
          //swal("Host Left!");
          leftUser(THIS.conns[THIS.host].peer);
          //setTimeout(backToProfile, 3000);
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
        console.log('peer error:' + err.type, err);
        //alert('peer error:' + err.type);
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
        uploadLounge(roomInfo('create'));
      }
      else if(THIS.host) THIS.connectToHost();
      else goToHall();
    });

    // text connection
    THIS.peer.on('connection', function(conn) {
      conn.on('open', function() {
        THIS.conns[conn.peer] = conn;
        if(conn.peer === THIS.id){
          setTimeout(() => conn.close(), 3000);
        }
        // setTimeout check if remove
        setTimeout(()=>{
          if(!Object.keys(THIS.users).includes(conn.peer)){
            conn.close();
            delete THIS.conns[conn.peer];
          }
        }, 10 * 1000);
      });
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
  $('body').attr('class', ``);
  $('body').attr('style', ``);
  $('#hall-ui').hide();
  // TODO delete profile
  // consider more
  profile.peer.destroy();
  if(window.localStream)
    window.localStream.getTracks().forEach(track => track.stop());
  profile = null;
  $('#chat-ui').hide();
  $('#profile-ui').show();
}

function goToChat(callback){
  $('.sweet-overlay').remove();
  $('.sweet-alert').remove()
  $('body').attr('class', ``);
  $('body').attr('style', ``);
  $('#hall-ui').hide();
  profile.where = 'room';
  $('#profile-ui').hide();
  $('#musicBox').show();
  $('#chat-ui').html(roomUITmplt(profile)).show().promise().done(function(){
    set_chat_ui();
    $('title').text(profile.room);
    setMediaSources();
    renewUserList();
  });
}

function goToHall(){
  $('.sweet-overlay').remove();
  $('.sweet-alert').remove()
  profile.where = 'hall';
  $('#musicBox').hide();
  $('body').attr('class', `scheme-${profile.avatar}`);
  $('body').attr('style', `overflow-x: visible;`);
  $('#profile-ui').hide();
  $('#chat-ui').hide();
  $('title').text('部屋一覽 - DOLLARS Mirror');
  $('#hall-ui').html(hallTmplt(profile)).show().promise().done(function(){
    $('.lounge-refresh').click(function(){
      updateRoomList();
    })
    updateRoomList();
    setInterval(updateRoomList, 6 * 60 * 1000);
  });
}

function updateRoomList(){
  $('.rooms-wrap').html($('<center><p>Loading...</p></center>'));
  getLounge(function(hall){
    $('.rooms-wrap').empty();
    hall.data.forEach(r => {
      if(r.hostID !== profile.id)
        $('.rooms-wrap').append(roomTmplt(r));

      $('.lounge-room-name').click(function(){
        swal({
          title: "Wait...",
          text: "Connecting to the room...",
          //type: "success",
          type: "warning",
          showConfirmButton: !1,
          timer: 10e5
        })
        profile.host = $(this).attr('value');
        profile.connectToHost();
      });
    });
  }, function(){
    alert("Cannot get Lounge");
    window.location.reload();
  });
}

function initialize(){
  var get = name => $(`input[name="${name}"]`).val().trim()
  var avatar = $('.user-icon.active').attr('data-avatar');

  let mode = $('input[name="mode"]:checked').val();
  if(mode === 'host')
    profile = new UserHost(get("uid"), get("uname"), avatar, get("hname"), get("uid"));
  else if(mode === 'join'){
    swal({
      title: "Wait...",
      text: "Connecting to the room...",
      //type: "success",
      type: "warning",
      showConfirmButton: !1,
      timer: 10e5
    })
    profile = new UserHost(get("uid"), get("uname"), avatar, undefined, get("jid"))
  }
  else if(mode === 'hall')
    profile = new UserHost(get("uid"), get("uname"), avatar)
  else return alert(`invalid mode: ${mode}`);
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

function adjustTalk(){
  setTimeout(() => {
    if(document.getElementById("talks").style)
      document.getElementById("talks").style.transform = `matrix(1, 0, 0, 1, 0, ${$('.message_box').height()})`
    else adjustTalk();
  }, 500);
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
  adjustTalk();
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
  let theHost = profile.users[profile.host]

  let hostMenu = u =>
    `<ul class="dropdown-menu" role="menu">
    <li><a tabindex="-1" class="dropdown-item-reply">@${u.name}</a></li>
    <!-- <li class="divider" role="presentation"></li> -->
    <!-- <li><a tabindex="-1" class="dropdown-item-tripcode" data-toggle="modal" data-target="#modal-tripcode-help" data-name="${u.name}" data-icon="eight">#RUpzBSY9YE</a></li> -->
  </ul>`
  let userMenu = u =>
    `<ul class="dropdown-menu" role="menu">
    <li><a tabindex="-1" class="dropdown-item-reply">@${u.name}</a></li>
    <!-- <li><a tabindex="-1" class="dropdown-item-secret">私信（DM）</a></li> -->
    ${ profile.id === theHost.id ?
        `<li class="divider" role="presentation"></li>
       <li><a tabindex="-1" class="dropdown-item-handover">更改管理人</a></li>
    <!-- <li><a tabindex="-1" class="dropdown-item-kick">踢出</a></li> -->
    <!-- <li><a tabindex="-1" class="dropdown-item-ban">封鎖</a> -->
    <!-- </li><li><a tabindex="-1" class="dropdown-item-report-user">報告並封鎖</a></li> -->`
        : ''}
    <!-- <li><a tabindex="-1" class="dropdown-item-tripcode" data-toggle="modal" data-target="#modal-tripcode-help" data-name="${u.name}" data-icon="eight">#RUpzBSY9YE</a></li> -->
  </ul>`

  let hostinfo = `<li id="${theHost.id}" title="${theHost.name} (host)" class="${theHost.call ? 'is-tripcode' : ''} dropdown user clearfix symbol-wrap-${theHost.avatar} is-host" device="desktop">${hostMenu(theHost)}<div class="name-wrap" data-toggle="dropdown"><span class="symbol symbol-${theHost.avatar}"></span><span class="select-text name">${theHost.name}</span></div><span class="icon-display icon-device"></span> <span class="icon icon-users"></span></li>`
  let usersinfo = Object.values(profile.users).filter(u => u.id !== profile.host).map(u => `<li id="${u.id}" title="${u.name}" class="${u.call ? 'is-tripcode' : ''} dropdown user clearfix symbol-wrap-${u.avatar}" device="desktop">${userMenu(u)}<div class="name-wrap" data-toggle="dropdown"><span class="symbol symbol-${u.avatar}"></span><span class="select-text name">${u.name}</span></div><span class="icon-display icon-device"></span> <span class="icon icon-users"></span></li>`).join('')
  $('#user_list').html(`${hostinfo}${usersinfo}`).promise().done(function(){
    $('.dropdown-item-reply').click(function(){
      mbox = $('textarea[name="message"]')
      mbox.val(`${mbox.val()} ${$(this).text()} `);
    });

    $('.dropdown-item-handover').click(function(){
      profile.host = $('.dropdown-item-handover').parent().parent().parent().attr('id');
      sendCmd({
        fn: 'new-host',
        arg: {'host': profile.host}
      });
      newHost(profile.host);
    });
  });

  adjustTalk();
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

function set_login_ui(){
  // toggle the setting
  $('#home-extra-toggle').click(function(){
    $('#home-extra').toggle();
  })

  let icons = $('.user-icon').click(function(){
    $('.user-icon').removeClass('active');
    $(this).addClass('active');
  })
  // random avatar
  icons.get(Math.floor(Math.random()*icons.length)).click();
}

function set_login_default_fields(){
  uid = findGetParameter('uid');
  name = decodeURIComponent(findGetParameter('name') || '');
  doHost = findGetParameter('host');
  doJoin = findGetParameter('join');
  room = findGetParameter('room') || 'This is a Lambda Room';

  if(doHost && doJoin) doHost = null;

  uid = uid ? uid : randomPeerID();
  if(doHost) doHost = doHost;
  else if(doJoin) doJoin = doJoin;

  // set default name
  if(!name) name = uid.substr(4, 5);
  roomID = doHost || doJoin || uid;

  $(`input[name="uname"]`).val(name)

  function switch_mode(mode){
    hostMode = false;
    joinMode = false;
    if(mode === 'host') hostMode = true;
    else if(mode === 'join') joinMode = true;
    else if(mode === 'hall') ;
    else return alert("invalid mode");

    $(`input[name="hname"]`).attr('required', hostMode);
    $(`input[name="jid"]`).attr('required', joinMode);
    $('#host-setting')[hostMode ? 'show' : 'hide']();
    $('#join-setting')[joinMode ? 'show' : 'hide']();
    $('#profile-setting-form').show();
    $('#complete').val(mode);
  }

  $('#host_mode').click(() => switch_mode('host'));
  $('#join_mode').click(() => switch_mode('join'));
  $('#hall_mode').click(() => switch_mode('hall'));

  $(`input[name="uid"]`).val(uid);

  if(doHost){
    $(`input[name="hname"]`).val(room);
    // TODO: if require uid
    $('#host_mode').click();
  }
  else if(doJoin){
    $(`input[name="jid"]`).val(doJoin);
    $('#join_mode').click();
  }
  else{
    $(`input[name="uid"]`).val(uid);
    $('#hall_mode').click();
  }

  $('#profile-setting-form').submit(()=>{
    initialize();
    return false;
  });
}

function set_chat_ui(){
  $('#message').submit(function(){
    return false;
  });

  $(`#talks`).on('click', 'dt.dropdown.user', function(){
    mbox = $('textarea[name="message"]')
    mbox.val(`${mbox.val()} @${$(this).find('.select-text').text()} `);
  })

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
    adjustTalk();
  })

  $('#invite').click(function(){
    ctrlRoom({
      'message': 'Click to join',
      'url': `https://drrrchatbots.gitee.io${location.pathname}?join=${profile.id}`,
    })
    swal("shared!");
  })

  $('#inviteURL').click(function(){
    copyToClipboard(`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.id}`)
    swal({
      title: "Copied!",
      text: "share to your friend!",
      type: "success",
      showConfirmButton: !1,
      timer: 1e3
    });
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
    adjustTalk();
  })

  $('.logout').click(function(){
    swal({
      title: "Leaving ...",
      type: "warning",
      showConfirmButton: !1
    })
    if(profile.isHost() &&
      Object.keys(profile.users).length === 1){
      dropLounge(profile.roomID, goToHall, goToHall);
      profile.leaveRoom();
    }
    else{
      profile.leaveRoom();
      goToHall();
    }
  });

  $('#call').click(function(){
    if(!profile.streamConfig){
      window.tryCall = true;
      //swal("Setup your stream first!\n(need save)");
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

  $('#set-mute').click(function(){
    sound.volume($(this).is(":checked") ? 0 : 1);
  });
}

$(document).ready(function(){
  set_login_default_fields();
  set_login_ui();
});

function dropLounge(roomID, succ, err){
  if(!roomID) return;
  let loungeURL = 'https://script.google.com/macros/s/AKfycbxsSLmCa1naF_FSnVd_AWmtfdsHW_FRD58X_S0AWxTnuK82jtXyQUyW/exec';
  // sheet ID
  $.ajax({
    url: `${loungeURL}?drop=${encodeURIComponent(roomID)}`,
    success: succ || console.log,
    error: err || console.log
  });
}

function uploadLounge(data){
  let loungeURL = 'https://script.google.com/macros/s/AKfycbxsSLmCa1naF_FSnVd_AWmtfdsHW_FRD58X_S0AWxTnuK82jtXyQUyW/exec';
  // sheet ID
  $.ajax({
    type: "POST",
    url: loungeURL,
    dataType: 'json',
    data: {
      data: JSON.stringify(data),
    },
    success: function(data){
      console.log('logged:', data);
    },
    error: function(data){
      console.log('failed:', data);
    }
  });
}

function getLounge(succ, error){
  let loungeURL = 'https://script.google.com/macros/s/AKfycbxsSLmCa1naF_FSnVd_AWmtfdsHW_FRD58X_S0AWxTnuK82jtXyQUyW/exec';
  // sheet ID
  $.ajax({
    type: "GET",
    url: `${loungeURL}`,
    success: succ,
    error: error
  });
}

function roomInfo(cmd){
  let time =`${Math.floor(Date.now() / 1000)}`;
  if(cmd === 'create'){
    window.onbeforeunload = function(){
      if(profile.isHost() &&
        Object.keys(profile.users).length === 1){
        dropLounge(profile.roomID);
      }
    }
    setInterval(()=>{
      uploadLounge(roomInfo('keep'));
    }, 15 * 60 * 1000);
  }
  return [
    `${profile.roomID}`,
    `${profile.room}`,
    `${profile.rootID}`, `${profile.rootName}`, `${profile.rootAvatar}`,
    `${profile.id}`, `${profile.name}`, `${profile.avatar}`,
    `${cmd}`, `${time}`];
}

function fakeRoomInfo(){
  let peerID = randomPeerID(10);
  let peerName = peerID.substr(0, 5);
  let time =`${Math.floor(Date.now() / 1000)}`;
  return [
    `${peerID}_${time}`,
    `${peerName}'s ROOM'`,
    `${peerID}`, `${peerName}`, `bakyura-2x`,
    `${peerID}`, `${peerName}`, `bakyura-2x`,
    `create`, `${time}`];
}


function test(){
  uploadLounge(fakeRoomInfo());
}
