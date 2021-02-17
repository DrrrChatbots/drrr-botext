var GAME_TRPG = "GAME_TRPG"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `<p>歡迎使用 TRPG 遊戲模組<br>發送 <code>2D10</code> 讓 host 幫你搖兩個骰子（1-10）</p>`:`<p>Welcome to TRPG game module<br>send <code>2D10</code> let host roll 2 dices(1-10) for you</p>`

export const ui = (config) => {
  return `
<div class="input-group">
    <div class="input-group-btn">
        <button id="trpg_host" class="btn btn-default" type="button" title="become host">
            <i id="is_host" class="glyphicon glyphicon-user"></i>
        </button>
    </div>

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>

    <input id="trpg_bg_url" type="text" class="form-control" placeholder="SCENE URL">

    <div class="input-group-btn">
        <button id="set_trpg_bg" class="btn btn-default" type="button"
                                                               data-delayed-toggle="collapse" data-target=""
                                                                                              title="set scene">
            <i id="" class="glyphicon 	glyphicon-picture"></i>
        </button>
    </div>
</div><br>${intro}`
}

export const ui_event = (config) => {
  $('#set_trpg_bg').click(()=>{
    sendTab({
      fn: publish_message,
      args: { msg: '[TRPG SCENE]', url: $('#trpg_bg_url').val()}
    });
  });

  host(config['trpg_is_host']);

  $('#trpg_host').click(()=>{
    if($('#is_host').hasClass('glyphicon-user')){
      host(true, true);
      setTimeout(()=>sendTab({ fn: publish_message, args: { msg: '[TRPG HOST]'} }), 1000);
    }
    else{
      host(false, true);
      setTimeout(()=>sendTab({ fn: publish_message, args: { msg: '[TRPG PLAYER]'} }), 1000);
    }
  });
}

export const event_action = (req, config) => {
  var type = req.type;
  if(type == event_msg){
    if(req.text.match(/^\d*[dD]\d*$/)){
      setTimeout(()=>{ if(config['trpg_is_host']) sendTab({ fn: publish_message, args: { msg: dice(req.text) } }) }, 800);
    }
    else if(req.text == '[TRPG SCENE]'){
      setTimeout(()=> sendTab({ fn: change_bg_img_url, args: { url: req.url } }), 200);
    }
    else if(req.text == '[TRPG HOST]'){
      setTimeout(()=> getProfile((p)=>{
        if(p.name != req.user){
          host(false, true);
        }
      }), 500);
    }
  }
}

// game logic

function host(bool, set){
  if(bool){
    $('#is_host').removeClass('glyphicon-user')
    $('#is_host').addClass('glyphicon-bullhorn')
    $('#trpg_host').attr('title', 'become player');
  }
  else{
    $('#is_host').removeClass('glyphicon-bullhorn')
    $('#is_host').addClass('glyphicon-user')
    $('#trpg_host').attr('title', 'become host');
  }
  if(set){ chrome.storage.sync.set({ 'trpg_is_host': bool }); }
}

function dice(text){
  var match = (/^(\d*)[dD](\d*)$/g).exec(text)
  if(!match) return "wrong format, use [1-100]d[digits]"
  var ins = Number(match[1]);
  if(ins > 0 && ins <= 100){
    return [...Array(ins)].map((_, i) => String(Math.floor(Math.random()*match[2])+1)).join(' ');
  }
  else return "number of dice should between 1 to 100";
}

//function new_note(){
//  $.ajax({
//    type: "GET",
//    url: 'https://hackmd.io',
//    dataType: 'html',
//    success: function(data){
//      var nodes = $(data);
//      $.ajax({
//        type: "POST",
//        url: 'https://hackmd.io/template/template-Try-it?redirect=true',
//        data: {'_csrf': nodes.find('input[name="_csrf"]').val()},
//        dataType: 'html',
//        headers: {
//          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//          'accept-encoding': 'gzip, deflate, br',
//          'accept-language': 'zh-TW,zh;q=0.9,zh-CN;q=0.8,en;q=0.7',
//          'cache-control': 'max-age=0',
//          'content-length': '42',
//          'content-type': 'application/x-www-form-urlencoded',
//          'origin': 'https://hackmd.io',
//          'referer': 'https://hackmd.io/',
//          'sec-fetch-dest': 'document',
//          'sec-fetch-mode': 'navigate',
//          'sec-fetch-site': 'same-origin',
//          'sec-fetch-user': '?1',
//          'upgrade-insecure-requests': '1',
//          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
//        },
//        success: function(data){
//          alert(data);
//        },
//        error: function(data){
//          console.log(data);
//        }
//      });
//    },
//    error: function(data){
//      console.log(data);
//    }
//  });
//}

/*
?BGM系統 - 輸入.mp3的網址可以直接撥放(GM用)
v對話(打字)系統 - 可以語音跑團搭配使用，單純用文字跑團也可以
○角色系統 - 玩家可以輸入角色數值，方便增減
v線上擲骰系統 - 內建的線上擲骰系統
○筆記系統 - 分成共用和私人筆記
v背景圖系統 - 可以輸入圖片網址 / 上傳圖片，在頁面裡可以顯示當背景圖(GM用)
v錄影系統 - 可以側錄進行的過程 - TG bot
○地圖系統 - 有點類似RPG製做大師，可以製作地圖
○方塊系統 - 可以建立棋子、角色方塊、指示方塊
○立繪系統 - 可以將導入圖片顯示在角色棋子上
○卡片系統 - 各式TRPG卡片，也可以自訂卡片
*/
