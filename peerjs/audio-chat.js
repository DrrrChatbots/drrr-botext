/*
 let screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true
});
*/

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
    window.call = null;
  });

  call.on('error', function(err) {
    window.onbeforeunload = null;
    stopStream();
    alert(`call error: ${err.type}`)
    window.call = null;
    // Do something with this audio stream
  });

  call.peerConnection.onconnectionstatechange = function (event) {
    if (event.currentTarget.connectionState === 'disconnected') {
      call.close();
    }
  };
}

function clearPeer(){
  peer.destroy();
  $('#id').text('Please set your peerID');
  peerID = null;
  peer = null;
}

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {
  // Create own peer object with connection to shared PeerJS server
  if(!peerID) {
    alert("Please set your ID");
    return;
  }

  $('#id').text(peerID);

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

        remote = findGetParameter('invite');
        if(remote){
          $('#remote-id').text(remote);
          join(`${remote}`);
        }
        else{
          remote = findGetParameter('wait');
          if(remote){
            remote = `DRRR${remote}`
            $('#remote-id').text(remote);
            tryCall = true;
            $("#status").text("Try Calling...");
            window.call = peer.call(id, window.localStream);
            handlecall(window.call);
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

    function answer_call(){
      $('#remote-id').text(call.peer);
      remote = call.peer;
      window.call = call;
      //window.onbeforeunload = askBeforeLeave;
      console.log("Here's a call");
      call.answer(window.localStream);
      handlecall(call);
    }

    function cancel_call(){
      call.answer();
      setTimeout(function(){
        call.close();
      }, 2500);
    }

    if(window.call){
      answer = confirm(`New call from ${call.peer}, break current and answer?`);
      if(answer){
        // break and answer
        window.call.close();
        var until_close = () => setTimeout(function(){
          if(window.call) until_close();
          else answer_call();
        }, 2500);
        until_close();
      } else cancel_call();
    }
    else{
      answer = true;
      if(call.peer != remote)
        answer = confirm(`Call from ${call.peer}, do you wanna answer?`);
      if(answer) answer_call();
      else cancel_call();
    }
  });

  peer.on('disconnected', function () {
    stopStream();
    console.log("Connection lost. Please reconnect");
    // Workaround for peer.reconnect deleting previous id
    //peer.id = lastPeerId;
    //peer._lastServerId = lastPeerId;
    //peer.reconnect();
  });
  peer.on('close', function() {
    stopStream();
    console.log("Connection destroyed. Please refresh");
  });

  peer.on('error', function (err) {
    stopStream();
    console.log(err);
    if(err.type === 'peer-unavailable'){
      //'peer-unavailable'
      window.call = null;
      if(tryCall){
        $("#status").text("Waiting answer...");
        ctrlRoom({
          'message': 'Click to answer my call',
          'url': `https://drrrchatbots.gitee.io${location.pathname}?invite=${peerID}`,
          'to': remote.replace('DRRR', ''),
        })
        tryCall = false;
      }
    }
    else if(err.type === 'unavailable-id'){
      alert("the id is taken");
      peerID = null;
      $('#id').text('Please set your ID');
    }
    else{
      console.log('Error:' + err.type);
      alert('Error:' + err.type);
    }
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
  function _join(){
    $("#status").text("Connecting...");
    if(!window.localStream){
      alert("please enable your audio stream");
      return;
    }

    while(!id){
      id = prompt("Input the peerID you want to call");
      if(!id) alert("Invalid ID");
    }

    // outgoing call
    window.call = peer.call(id, window.localStream);
    //window.onbeforeunload = askBeforeLeave;
    handlecall(window.call);
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

var peer = null; // Own peer object
var host = null;
var remote = null;
var lastPeerId = null;
var tryCall = false;
window.localStream = null;
window.call = null;

$(document).ready(function(){

  host = findGetParameter('host');
  if(host) peerID = `DRRR${host}`;

  $('#setID').click(function(){
    // TODO:clear window.call?
    input = prompt("Input your peerID");
    if(input){
      peerID = input;
      initialize();
    }
    else{
      peerID = null;
      $('#id').text('Please set your ID');
    }
  });

  $('#inviteRemote').click(function(){
    if(peerID){
      ctrlRoom({
        'message': 'Click to call me',
        'url': `https://${peerID}.call`,
      })
    }
    else alert("Please set your ID");
  })

  $('#setRemoteID').click(function(){
    // TODO:clear window.call?
    id = prompt("Input your peerID");
    if(id){
      remote = id;
      $('#remote-id').text(remote);
    }
    else{
      remote = null;
      $('#remote-id').text('Please set remote ID');
    }
  });

  $('#callRemote').click(function(){
    if(remote) join(remote);
    else alert("Please set remote ID");
  });

  $('#endCall').click(function(){
    if(window.call) window.call.close();
    else alert("There's no call now");
  })

  // handle browser prefixes
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  initialize();
});
