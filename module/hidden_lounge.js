var HIDDEN_LOUNGE = "HIDDEN_LOUNGE"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `<p>歡迎使用隱藏大廳模組，<br>可以填自己的 Google Sheet ID，<br>但要記得開 "共用" 和 "編輯權限"。</p>`:`<p>Welcome to Hidden Lounge Module,<br>you can use your own Google Sheet ID, <br>but remeber to provide the "edit permission".</p>`

export const ui = (config) => {
  return `
<div class="input-group">
    <div class="input-group-btn">
        <button id="upload_room" class="btn btn-default" type="button" title="upload room">
            <i class="glyphicon glyphicon-upload"></i>
        </button>
    </div>

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>

    <input id="hidden_lounge_sheet_id" type="text" class="form-control" placeholder="Sheet ID">

    <div class="input-group-btn">
        <button id="set_sheet_id" class="btn btn-default" type="button"
               data-delayed-toggle="collapse" data-target=""
                                                                                              title="set sheet id">
            <i id="" class="glyphicon glyphicon-pencil"></i>
        </button>
        <button id="go_lounge" class="btn btn-default" type="button"
               data-delayed-toggle="collapse" data-target=""
                                                                                              title="go to lounge">
            <i id="" class="glyphicon glyphicon-log-in"></i>
        </button>
    </div>
</div><br>${intro}`
}

export const ui_event = (config) => {

  $('#hidden_lounge_sheet_id').val(config[HIDDEN_LOUNGE] || '');

  $('#set_sheet_id').click(()=>{
    chrome.storage.sync.set({ [HIDDEN_LOUNGE]: $('#hidden_lounge_sheet_id').val() });
    alert("done");
  });

  $('#go_lounge').click(()=>{
    chrome.storage.sync.get([HIDDEN_LOUNGE], cfg => {
      chrome.tabs.create({
        url: `https://drrrchatbots.gitee.io/peerjs/hidden-lounge.html?${cfg[HIDDEN_LOUNGE] ? `id=${cfg[HIDDEN_LOUNGE]}` : ''}`
      });
    });
  });

  $('#upload_room').click(()=>{
    upload(()=>alert("ok"), ()=>alert("error"));
  });
}

export const event_action = (req, config) => {
  var type = req.type;
  console.log(req);
  if(req.start === 'room'){
    upload();
  }
  else if(type === event_join){
    upload();
  }
  else if(type === event_join){
    upload();
  }
}

function upload(succ, fail){
    let loungeURL = 'https://script.google.com/macros/s/AKfycbwaH1jCoYImuIxFaNqkrh5DcxoaAlL19V0WD_We8D4FA7OItepjCD9p/exec';

  getRoom(info => {

    //if(!info.room.hiddenRoom) return;

    var host = info.room.users.filter(u => u.id === info.room.host)[0];

    var room = [
      info.room.roomId,
      info.room.name,
      info.room.description,
      info.room.limit,
      info.room.total,
      host.name,
      host.icon,
      host.tripcode || '',
      info.room.update,
    ];

    chrome.storage.sync.get([HIDDEN_LOUNGE], config => {

      var params = { data: JSON.stringify(room) };
      if(config[HIDDEN_LOUNGE])
        params.id = config[HIDDEN_LOUNGE];
      params.cmd = 'keep';
      $.ajax({
        type: "POST",
        url: loungeURL,
        dataType: 'json',
        data: params,
        success: function(data){
          succ ? succ(data) : console.log('logged:', data);
        },
        error: function(data){
          fail ? fail(data) : console.log('failed:', data);
        }
      });
    });
  });
}
