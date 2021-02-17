var ROOM_CHAT = "ROOM_CHAT"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `歡迎使用房間聊天模組。`:`Welcome to Room Chat module.`

export const ui = (config) => {
  return `
  <div class="input-group">

    <!--
     <span id="unable_launch" title="You are not room owner" class="input-group-addon"><i class="glyphicon glyphicon-phone-alt"></i></span>
    -->

     <div id="able_launch" class="input-group-btn" >
       <button id="launch_room" class="btn btn-default" type="button" title="You are not room owner" disabled>
         <i class="glyphicon glyphicon-phone-alt"></i>
       </button>
     </div>

     <span class="input-group-addon form-control panel-footer text-center">${intro}</span>

     <div class="input-group-btn">
      <button id="join_room" class="btn btn-default" type="button" title="You are not in a room" disabled>
        <i class="glyphicon glyphicon-earphone"></i>
      </button>
     </div>
  </div>

  <!--
    <hr>
    <div class="row" style="height:100%">
      <div class="col-md-4">
        <div class="list-group" style="margin-bottom: 0px;">
          <div id='peer_list_container'></div>
        </div>
      </div>
    </div>
  -->`
}

var call_peer_btn = (args) =>
  `<button class="btn btn-default call-peer" type="submit"
         data="${args.data.id}"   title="call the peer user">
     <i class="glyphicon glyphicon-earphone"></i>
  </button>`

export const ui_event = (config) => {
  getRoom((info) => {
    console.log(info)
    if(info.room){
      if(info.room.host === info.profile.id){
        $('#launch_room')
          .attr('title', 'Launch Room Call')
          .attr('disabled', false)
          .click(function(){
            chrome.tabs.create({
              url: chrome.extension.getURL(`/peerjs/room-chat.html?room=${encodeURIComponent(info.room.name)}&host=${info.room.roomId}&uid=${info.profile.id}&name=${info.profile.name}`)
            });
          });
      }
      $('#join_room')
        .attr('title', 'Join the Room')
        .attr('disabled', false)
        .click(function(){
        chrome.tabs.create({
          url: chrome.extension.getURL(`/peerjs/room-chat.html?join=${info.room.roomId}&uid=${info.profile.id}&name=${info.profile.name}`)
        });
      });
    }
  }, (err) => {
    alert("Cannot get room list");
  })
}

export const event_action = (req, config) => {
  var type = req.type;
}
