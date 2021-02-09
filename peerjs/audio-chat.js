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

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {
  // Create own peer object with connection to shared PeerJS server
  peer = new Peer(peerID, {
    debug: 3
  });

  peer.on('open', function(){
    // Get access to microphone
    navigator.getUserMedia (
      // Only request audio
      {video: false, audio: true},

      // Success callback
      function success(localAudioStream) {
        // Do something with audio stream
        audioStream = localAudioStream;
        remote = findGetParameter('remote');
        if(remote) join(`${remote}`);
        call = findGetParameter('call');
        if(call){
          $("#status").text("Waiting call...");
          ctrlRoom({
            'message': 'Click to answer my call',
            'url': `https://${peerID}.call`,
            'to': call,
          })
        }
      },
      // Failure callback
      function error(err) {
        // handle error
        alert("No Mic, so you cannot call peer, please close the tab");
      }
    );
  })

  peer.on('call', function(incoming) {

    console.log("Here's a call");
    incoming.answer(audioStream);

    incoming.on('stream', function(stream) {
      // Do something with this audio stream
      console.log("Here's a stream");
      playStream(call, stream);
    });

    incoming.on('close', function() {
      // Do something with this audio stream
      removeStream();
      alert("call ended")
    });

    incoming.on('error', function(err) {
      removeStream();
      alert(`call error: ${JSON.stringify(err)}`)
      // Do something with this audio stream
    });

  });

  peer.on('disconnected', function () {
    console.log("Connection lost. Please reconnect");
    removeStream();

    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
  });
  peer.on('close', function() {
    // destroy audio tag, remove incoming
    console.log("Connection destroyed. Please refresh");
    removeStream();
  });
  peer.on('error', function (err) {
    console.log(err);
    removeStream();
  });
};

function playStream(id, stream) {
  $("#status").text("Connected");
  var audio = $(`<audio id="${id}" autoplay />`).appendTo('body');
  audio[0].srcObject = stream;
}

function removeStream(){
  $('#status').text('No Connection');
  if(call) $(`#${call}`).remove();
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
  if(!audioStream){
    alert("please enable your audio stream");
    return;
  }
  var outgoing = null;

  while(!id){
    id = prompt("input your peerID");
    if(!id) alert("Invalid ID");
  }

  outgoing = peer.call(id, audioStream);

  outgoing.on('stream', function(stream) {
    // Do something with this audio stream
    playStream(id, stream);
  });

  outgoing.on('close', function() {
    // Do something with this audio stream
    alert("call ended")
  });

  outgoing.on('error', function(err) {
    alert(`call error: ${JSON.stringify(err)}`)
    // Do something with this audio stream
  });
};

var remoteStream = null;
var lastPeerId = null;
var peer = null; // Own peer object
var host = null;
var audioStream = null;
var remote = null;
var call = null;

$(document).ready(function(){

  host = findGetParameter('host');
  if(host) peerID = `DRRR${host}`;
  else peerID = prompt("input your peerID");

  // handle browser prefixes
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  document.getElementById("joinButton").addEventListener('click', join);

  initialize();
});
