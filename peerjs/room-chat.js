var call_constraints = {
  'mandatory': {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
  },
  offerToReceiveAudio: 10,
  offerToReceiveVideo: 10,
}

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
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

function Room(id, name, owner){
  this.id = id;
  this.name = name;
  this.host = host;
  this.users = [];
  this.run = function(){
    this.peer = new Peer(this.id);

    peer.on('open', function(){
      $('#stream-ui').hide();
      $('#chat-ui').show();
    })

    peer.on('connection', function(conn) {
      conn.on('open', function() {
        //conn.send("Sender does not accept incoming connections");
        //setTimeout(function() { conn.close(); }, 500);
      });
      conn.on('data', function(data) {

      });
      conn.on('close', function () {

      });
    });

    peer.on('disconnected', function () {

    });

    peer.on('close', function() {
      $('#stream-ui').show();
      $('#chat-ui').hide();
    });

    peer.on('error', function (err) {
      stopStream();
      console.log(err);
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
      $('#stream-ui').show();
      $('#chat-ui').hide();
    });

    peer.on('call', function(call) {

    });
  }
}

function User(id, name, stream){
  this.id = id;
  this.name = name;
  this.stream = stream;
  this.run = function(){
    this.peer = new Peer(this.id);

    peer.on('open', function(){
      $('#stream-ui').hide();
      $('#chat-ui').show();
    })

    peer.on('call', function(call) {

    });

    peer.on('disconnected', function () {

    });

    peer.on('close', function() {
      $('#stream-ui').show();
      $('#chat-ui').hide();
    });

    peer.on('error', function (err) {
      stopStream();
      console.log(err);
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
      $('#stream-ui').show();
      $('#chat-ui').hide();
    });
  }
}

function handleCall(call){
  call.on('stream', function(stream) {
    // Do something with this audio stream
    console.log("Here's a stream");
    playStream(remote, stream);
  });

  call.on('close', function() {
    // Do something with this audio stream
    window.onbeforeunload = null;
    stopStream();
    alert("call ended")
    window.call = null;
    $("#chat-setting-container").show();
    $("#chat-video-container").hide();
  });

  call.on('error', function(err) {
    window.onbeforeunload = null;
    stopStream();
    alert(`call error: ${err.type}`)
    window.call = null;
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

function clearPeer(){
  peer.close();
  peer.destroy();
  $('#id').text('Please set your peerID');
  peerID = null;
  peer = null;
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
          success(initStream);
        })
        .catch(e => {
          error(e);
        });
    }
    else success(initStream);
  }

  if(!config.video && !config.audio)
    success(new MediaStream([createEmptyAudioTrack()]))
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

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize(){
  // Create own peer object with connection to shared PeerJS server
  if(host){

  }
  else if(join){

  }
};

function playStream(id, stream) {
  $("#status").text("Connected");
  $("#chat-setting-container").hide();
  $("#chat-video-container").show();

  var uelt = $(`#${id}`);
  if(uelt.length){
    // skip
    //localVideo = uelt.find(`#${id}-video`)[0];
    //localAudio = uelt.find(`#${id}-audio`)[0];
  }
  else{
    window.remoteStream = stream;
    full = null;
    if(stream.getVideoTracks().length){
      media = $(`<video poster="./p2p-chat.png" id="${id}-video" autoplay controls playsinline/>`)
      full = $(`<input type="submit" id="${id}-full" value="full screen" />`)
      full.click(function(){
        if (media[0].requestFullscreen)
          media[0].requestFullscreen();
        else if (media[0].webkitRequestFullscreen)
          media[0].webkitRequestFullscreen();
        else if (media[0].msRequestFullScreen)
          media[0].msRequestFullScreen();
      });
    }
    else media = $(`<audio id="${id}-audio" autoplay controls playsinline/>`)

    localMedia = media[0];

    function wrap(elt){
      return $(`<div class="col-100"></div>`).append(elt);
    }
    var container = $(`<div id="${id}" class="row"></div>`)
      .append(wrap(media))
      .appendTo('#chat-video-container');
    if(full) container.append(wrap(full));
  }

  if(!media[0].srcObject ||
    (stream.getTracks().length > media[0].srcObject.getTracks().length)){
    if ("srcObject" in media[0]) {
      media[0].srcObject = stream;
      // once I stop one video (0x0), the other one would be break
      //if(!media[0].videoHeight || !media[0].videoWidth)
      //  if(stream.getVideoTracks().length){
      //    var tracks = stream.getVideoTracks();
      //    //tracks[0].stop();
      //    //stream.removeTrack(tracks[0]);
      //  }
    } else {
      media[0].src = window.URL.createObjectURL(stream);
    }
  }
}

function stopStream(){
  $('#status').text('No Connection');
  if(remote && $(`#${remote}`).length)
    $(`#${remote}`).remove();
}
/**
 * Create the connection between the two Peers.
 *
 * Sets up callbacks that handle any events related to the
 * connection and data received on it.
 */
function join(id) {
  // Close old connection
  // TODO
  function _join(){
    $("#status").text("Connecting...");
    try{
      if(!window.localStream){
        alert("please enable your audio stream");
        return;
      }

      while(!id){
        id = prompt("Input the peerID you want to call");
        if(!id) alert("Invalid ID");
      }

      if(id === peerID){
        stopStream();
        return alert("You cannot call yourself");
      }

      // outgoing call
      window.call = peer.call(id, window.localStream, call_constraints);
      handleCall(window.call);
      handleCallClose(window.call);
    }
    catch(err){
      alert(String(err));
    }
  }

  if(window.call){
    window.call.close();
    var until_close = () => setTimeout(function(){
      if(window.call) until_close();
      else _join();
    }, 2500);
    until_close();
  } else _join();
}

var profile = null;
var peer = null; // Own peer object
var peerID = null;
var remote = null;
var tryCall = false;
window.localStream = null;
window.call = null;

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

function validSetting(){
  if(!$('#uname').val().trim()) return false;
  if(host){
    if(!$('#hname').val().trim()) return false;
    if(!$('#hid').val().trim()) return false;
    return true;
  }
  else if(join){
    if(!$('#uid').val().trim()) return false;
    if(!$('#jname').val().trim()) return false;
    if(!$('#jid').val().trim()) return false;
    return true;
  }
  return false;
}

$(document).ready(function(){

  setMediaSources();

  uid = findGetParameter('uid');
  name = findGetParameter('name');
  host = findGetParameter('host');
  join = findGetParameter('join');
  room = findGetParameter('room') || 'This is a Lambda Room';

  if(host && join) host = null;

  uid = uid ? `DRRR${uid}` : randomPeerID();

  if(host) host = `DRROOM${host}`
  if(join) join = `DRROOM${join}`

  if(!name) name = id;

  $(`input[name="uid"]`).val(uid)
  $(`input[name="uname"]`).val(name)

  if(host){
    $('#video-div').show();
    $('#host-setting').show();
    $(`input[name="hid"]`).val(host);
    $(`input[name="hname"]`).val(room);
  }

  if(join){
    $('#join-setting').show();
    $(`input[name="jid"]`).val(join);
  }

  $('#complete').click(function(){
    if(validSetting()){
      getStream(getConfig(),
        function success(stream) {
          window.localStream = stream;
          initialize();
        },
        function error(e) {
          //alert("No Mic, so you cannot call peer, please close the tab");
          alert("stream error: " + e);
          console.log(e);
        });
    } else alert("* field cannot be blank");
  });


  //  $('#setID').click(function(){
  //    // TODO:clear window.call?
  //    input = prompt("Input your peerID");
  //    if(input){
  //      peerID = input;
  //      initialize();
  //    }
  //    else{
  //      peerID = null;
  //      $('#id').text('Please set your ID');
  //    }
  //  });
  //
  //  $('#inviteRemote').click(function(){
  //    if(peerID){
  //      ctrlRoom({
  //        'message': 'Click to call me',
  //        'url': `https://drrrchatbots.gitee.io${location.pathname}?invite=${peerID}`,
  //      })
  //    }
  //    else alert("Please set your ID");
  //  })
  //
  //  $('#setRemoteID').click(function(){
  //    // TODO:clear window.call?
  //    id = prompt("Input your peerID");
  //    if(id){
  //      remote = id;
  //      $('#remote-id').text(remote);
  //    }
  //    else{
  //      remote = null;
  //      $('#remote-id').text('Please set remote ID');
  //    }
  //  });
  //
  //  $('#callRemote').click(function(){
  //    if(remote) join(remote);
  //    else alert("Please set remote ID");
  //  });
  //
  //  $('#endCall').click(function(){
  //    if(window.call) window.call.close();
  //    else alert("There's no call now");
  //  })
  //
  //  $('#setup').click(function(){
  //    $('#chat-ui').hide();
  //    $('#stream-ui').show();
  //    if(window.call) window.call.close();
  //    if (window.localStream) {
  //      window.localStream.getTracks().forEach(track => track.stop());
  //      window.localStream = null;
  //    }
  //  });
  //
  //  $('#stream-setting-form').submit(()=>false);
  //  $('#chat-setting-form').submit(()=>false);
  //
  //  remote = findGetParameter('invite') || findGetParameter('wait');
  //
});
