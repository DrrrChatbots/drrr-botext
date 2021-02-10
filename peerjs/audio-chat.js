function askBeforeLeave(e) {
  var message = "Audio chat will end, do you wanna leave?",
    e = e || window.event;
  // For IE and Firefox
  if(window.call){
    if (e) {
      e.returnValue = message;
    }
    // For Safari
    return message;
  }
  return undefined;
}

function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

function handlecall(call){
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
  });

  call.on('error', function(err) {
    stopStream();
    alert(`call error: ${JSON.stringify(err)}`)
    // Do something with this audio stream
  });

  call.peerConnection.onconnectionstatechange = function (event) {
    if (event.currentTarget.connectionState === 'disconnected') {
      call.close();
    }
  };
}

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {
  // Create own peer object with connection to shared PeerJS server
  peer = new Peer(peerID, {
    //debug: 3
  });

  peer.on('open', function(){
    // Get access to microphone
    navigator.getUserMedia (
      // Only request audio
      {video: false, audio: true},

      // Success callback
      function success(stream) {
        // Do something with audio stream
        window.localStream = stream;

        remote = findGetParameter('from');
        if(remote) join(`${remote}`);
        else{
          remote = findGetParameter('to');
          if(remote){
            $("#status").text("Waiting call...");
            ctrlRoom({
              'message': 'Click to answer my call',
              'url': `https://${peerID}.call`,
              'to': remote,
            })
          }
        }
      },
      // Failure callback
      function error(err) {
        // handle error
        alert("No Mic, so you cannot call peer, please close the tab");
      }
    );
  })

  // incoming call
  peer.on('call', function(call) {
    window.call = call;
    window.onbeforeunload = askBeforeLeave;
    console.log("Here's a call");
    call.answer(window.localStream);
    handlecall(call);
  });

  peer.on('disconnected', function () {
    stopStream();
    console.log("Connection lost. Please reconnect");
    alert("Connection lost. Please reconnect");
    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
  });
  peer.on('close', function() {
    stopStream();
    console.log("Connection destroyed. Please refresh");
    alert("Connection destroyed. Please refresh");
  });
  peer.on('error', function (err) {
    stopStream();
    console.log(err);
    console.log('Error:' + err);
  });
};

function playStream(id, stream) {
  $("#status").text("Connected");
  var audio = $(`<audio id="${id}" autoplay />`).appendTo('body');
  audio[0].srcObject = stream;
}

function stopStream(){
  $('#status').text('No Connection');
  if(remote) $(`#${remote}`).remove();
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

  $("#status").text("Connecting...");
  if(!window.localStream){
    alert("please enable your audio stream");
    return;
  }

  while(!id){
    id = prompt("input your peerID");
    if(!id) alert("Invalid ID");
  }

  // outgoing call
  window.call = peer.call(id, window.localStream);
  window.onbeforeunload = askBeforeLeave;
  handlecall(window.call);
}

var peer = null; // Own peer object
var host = null;
var remote = null;
var lastPeerId = null;
window.localStream = null;
window.call = null;

$(document).ready(function(){

  host = findGetParameter('host');
  if(host) peerID = `DRRR${host}`;
  else peerID = prompt("input your peerID");

  // handle browser prefixes
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  document.getElementById("joinButton").addEventListener('click', join);

  initialize();
});
