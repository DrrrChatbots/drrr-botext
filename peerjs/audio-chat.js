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
    debug: 2
  });

  peer.on('call', function(incoming) {
    console.log("Here's a call");
    incoming.on('stream', function(stream) {
      // Do something with this audio stream
      console.log("Here's a stream");
      playStream(stream);
    });
    //call.answer(mediaStream);
    incoming.answer(null);
  });

  peer.on('disconnected', function () {
    console.log("Connection lost. Please reconnect");

    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
  });
  peer.on('close', function() {
    // destroy audio tag, remove incoming
    console.log("Connection destroyed. Please refresh");
  });
  peer.on('error', function (err) {
    console.log(err);
    alert('' + err);
  });
};

function playStream(stream) {
  var audio = $('<audio autoplay />').appendTo('body');
  audio[0].srcObject = stream;
  //audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
}
/**
 * Create the connection between the two Peers.
 *
 * Sets up callbacks that handle any events related to the
 * connection and data received on it.
 */
function join(id) {
  alert("join");
  // Close old connection
  if (conn) {
    conn.close();
  }

  var outgoing = null;
  if(id) outgoing = peer.call(id, audioStream);
  else outgoing = peer.call(prompt("input your peerID"), audioStream);

  outgoing.on('stream', function(stream) {
    // Do something with this audio stream
  });
};

/**
 * Triggered once a connection has been achieved.
 * Defines callbacks to handle incoming data and connection events.
 */
function ready() {
  setTimeout(function(){
    console.log("done");
  }, 2e3);
  conn.on('data', function (data) {
    console.log(`peer: ${data}`)
  });
  conn.on('close', function () {
    console.log("Connection reset\nAwaiting connection...");
    conn = null;
  });
}

var remoteStream = null;
var lastPeerId = null;
var conn = null;
var peer = null; // Own peer object
var host = null;
var audioStream = null;

$(document).ready(function(){

  host = findGetParameter('host');
  if(host) peerID = `DRRR${host}`;
  else peerID = prompt("input your peerID");

  // handle browser prefixes
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  document.getElementById("joinButton").addEventListener('click', join);

  initialize();

  // Get access to microphone
  navigator.getUserMedia (
    // Only request audio
    {video: false, audio: true},

    // Success callback
    function success(localAudioStream) {
      // Do something with audio stream
      alert("success");
      audioStream = localAudioStream;
      remote = findGetParameter('remote');
      if(remote) join(`${remote}`);
      call = findGetParameter('call');
      if(call){
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
      alert("You won't be able to talk to your peer");
      call = findGetParameter('call');
      if(call){
        alert("No Mic, so you cannot call peer");
      }
      remote = findGetParameter('remote');
      if(remote) join(`${remote}`);
    }
  );
});
