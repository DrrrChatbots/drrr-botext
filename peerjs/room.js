let roomUITmplt = (profile) =>
`<div class="message_box select-none">
  <div class="message_box_effect_wraper">
    <div class="message_box_inner">
      <form id="message">
        <div class="clearfix">
          <h2 id="room_name" class="select-text">
            <!-- <span class="room-title-capacity">8/15</span> -->
            <span class="room-title-name">${profile.room}</span>
          </h2>
          <ul class="menu">

              <li id="end-call" class="image needsclick" style="display: none;">
              <i class="icon icon-pause"></i>
              </li>

              <li id="call" class="image needsclick" style="display: list-item;">
              <i class="icon icon-phone"></i>
              </li>

              <li id="image" class="image needsclick" style="display: list-item;">
              <i class="icon icon-list"></i>
              </li>

              <!--
              <li id="musicShare" class="music needsclick music_on" style="display: list-item;">
              <i class="icon icon-music"></i>
              </li>
              -->

              <li class="setting needsclick" style="display: list-item;">
              <i class="icon icon-users"></i>
              </li>


              <li class="dropdown" style="display: list-item;">
              <a class="preferences" role="button" data-toggle="dropdown" href="#">
              <i class="icon icon-share"></i>
              </a>
              <ul class="dropdown-menu pull-right" role="menu" aria-labelledby="drop6">
              <li><a id="invite" data-subject="${profile.room}">Invite</a></li>
              <li><a id="inviteURL" data-subject="${`${profile.room}@DOLLARS Mirror（Durarara!! Mirror）`}">Copy Invite URL</a></li>
              <li><a class="sharer" data-sharer="email" data-title="I'm in 'share link' room @dollarschat" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}" data-to="" data-subject="${`${profile.room}@DOLLARS Mirror（Durarara!! Mirror）`}">Email</a></li>

              <li data-langs="zh-CN zh-TW" class="visible"><a class="sharer" data-sharer="weibo" data-title="我在「🌈你画我猜🌈摘星塔🍎✨」房间（点击链接可加入房间）／drrr.com #DOLLARS聊天室# #无头骑士异闻录#" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}" data-image="${`https://drrr.com/banner/?t=${profile.room}`}" data-appkey="2793388877" data-ralateuid="5842424001">微博</a></li>

              <li><a class="sharer" data-sharer="twitter" data-title="I'm in 'share link' room @dollarschat" data-hashtags="drrr_anime, drrrchat" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}">推特</a></li>

              <li><a class="sharer" data-sharer="facebook" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}">臉書</a></li>

              <li><a class="sharer" data-sharer="tumblr" data-title="I'm in 'share link' room @dollarschat" data-caption="I'm in 'share link' room @dollarschat" data-hashtags="drrr_anime, drrrchat" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}">Tumblr</a></li>

              <li><a class="sharer" data-sharer="googleplus" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}">Google+</a></li>

              <li><a class="sharer" data-sharer="telegram" data-title="I'm in 'share link' room @dollarschat" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}">Telegram</a></li>

              <li><a class="sharer" data-sharer="line" data-title="I'm in 'share link' room @dollarschat" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}">LINE</a></li>

              <li><a class="sharer" data-sharer="vk" data-title="I'm in 'share link' room @dollarschat" data-caption="I'm in 'share link' room @dollarschat" data-url="${`https://drrrchatbots.gitee.io${location.pathname}?join=${profile.host}`}" data-image="${`https://drrr.com/banner/?t=${profile.room}`}">VK</a></li>
              </ul>
              </li>

              <li class="dropdown" style="display: list-item;">
              <a class="preferences" role="button" data-toggle="dropdown" href="#">
              <i class="icon icon-settings"></i>
              </a>
              <ul class="dropdown-menu pull-right" role="menu" aria-labelledby="drop6">
              <li>
              <a class="needsclick" role="menuitem" tabindex="-1" data-toggle="modal" data-target="#modal-settings">
              設置                  </a>
              </li>
              <!--
              <li>
              <a class="needsclick" role="menuitem" tabindex="-1" onclick="location.reload(true)">
              重新載入                  </a>
              </li>

              <li role="presentation" class="divider"></li>

              <li>
              <a class="needsclick import-coll" role="menuitem" tabindex="-1">
              導入收藏                  </a>
              <input class="hide" type="file" accept="application/json">
              </li>
              <li>
              <a class="needsclick export-coll" role="menuitem" tabindex="-1">
              導出收藏                  </a>
              </li>
              -->

              <li role="presentation" class="divider"></li>

              <li data-langs="zh-CN zh-TW" class="visible"><a class="needsclick" role="menuitem" tabindex="-1" target="_blank" href="https://drrr.wiki/">維基</a></li>
              <li data-langs="zh-CN zh-TW" class="visible"><a class="needsclick" role="menuitem" tabindex="-1" target="_blank" href="https://drrr.chat/">離線版</a></li>
              <li data-langs-hide="zh-CN zh-TW" class="hidden"><a class="needsclick" role="menuitem" tabindex="-1" href="/static-en/">離線版</a></li>
              <li data-langs-hide="zh-CN zh-TW" class="hidden"><a class="needsclick" role="menuitem" tabindex="-1" target="_blank" href="http://dollars-bbs.org/">BBS</a></li>
              <li role="presentation" class="divider"></li>
              <li class="logout needsclick"><a class="btn-link do-logout">離開房間</a></li>
              </ul>
              </li>

          </ul>

          <span class="to-whom">To</span>
        </div>

        <div class="room-input-wrap">
          <textarea name="message" class="form-control" tabindex="1" maxlength="140"></textarea><span class="counter">140</span>
          <a id="url-icon" class="url-icon select-none tooltipstered" tabindex="2">URL</a>
          <input id="url-input" name="url" tabindex="-1" type="hidden">
          <input id="to-input" name="to" tabindex="-1" type="hidden">
        </div>

        <div class="room-submit-wrap">
          <div><input type="submit" class="form-control room-submit-btn" name="post" value="POST!" tabindex="3"></div>
        </div>

        <ul id="members" class="room-members panel-hide">
          <li class="member">少女 (host)</li>
          <li class="member">柴 </li>
          <li class="member">🌊 </li>
          <li class="member">浪 </li>
          <li class="member">KAGU辣酱 </li>
          <li class="member">阳光，海浪与沙雕 </li>
          <li class="member">jysonwoo </li>
          <li class="member">Soutider </li>
        </ul>

        <ul class="panel-hide">
          <li id="user_id">9069863ee7dcbd4c82decfaf244e0e2b</li>
          <li id="user_name" class="select-text">浪</li>
          <li id="user_icon">bakyura-2x</li>
          <li id="user_tripcode">L/CaT//Hsk</li>
        </ul>
      </form>

      <!-- akakoori -->
      <div id="image_panel" class="panel-image panel-hide" style="max-height: 100%;">
        <div class="container-fluid">
          <div class="row">
            <!-- shows when no images -->
            <div id="no_images" class="col-lg-12">
                <center><p id="stream-info">點擊手機圖示加入通話</p></center>
                <center id="videos">
                </center>
            </div>
            <!--
            <div class="col-xs-3 col-sm-2 col-lg-1p5"><div class="image-mask"><img src="https://i.loli.net/2019/04/07/5ca9d7861f53b.gif" alt="5ca9d7861f53b.gif" data-src="https://i.loli.net/2019/04/07/5ca9d7861f53b.gif" class="img-thumbnail"><a href="javascript:;" class="icon btn-delete-image">×</a></div></div><div class="col-xs-3 col-sm-2 col-lg-1p5"><div class="image-mask"><img src="https://i.loli.net/2020/03/30/l4cktoROXYWzSCL.gif" alt="l4cktoROXYWzSCL.gif" data-src="https://i.loli.net/2020/03/30/l4cktoROXYWzSCL.gif" class="img-thumbnail"><a href="javascript:;" class="icon btn-delete-image">×</a></div></div>
            -->
            </div>
          <!-- mirrorContainer for dragula -->
          <div class="row">
          </div>
        </div>
      </div>
      <!-- akakoori -->

      <!-- Willian -->
      <div id="music_pannel" class="panel-hide">
        <div class="">
          <div class="input-group input-group-sm">
            <span for="form-room-music-name" class="input-group-addon">音樂名稱：</span>
            <input type="text" id="form-room-music-name" name="music_name" class="form-control form-inline input-sm" maxlength="30">
          </div>
          <div class="input-group input-group-sm">
            <span for="form-room-music-url" class="input-group-addon">URL:</span>
            <input type="text" id="form-room-music-url" name="music_url" class="form-control form-inline input-sm" maxlength="300">
            <span class="input-group-btn">
              <input type="button" name="play" class="btn btn-default btn-sm" value="點播！">
            </span>
          </div>
        </div>
      </div>
      <!-- Willian -->

      <div id="setting_pannel" class="panel-hide" style="top: 115px; display: block;">
        <ul id="user_list" class="user-list"></ul>
      </div>
    </div>
  </div>

  <div id="connection-indicator" class="notification-bar warning" style="display: none;">連接丟失，重新連接…</div>
  <div id="unread-indicator" class="notification-bar notice">
    <span class="counter">0</span>
    <span class="pp-form singular">新訊息</span>
    <span class="pp-form plurals">新訊息</span>
  </div>
</div><!-- end #header -->

<div id="talks" class="talks select-none">
</div><!-- /#talks -->

<!-- Tripcode Modal -->
<div class="modal fade" id="modal-tripcode-help" tabindex="-1" role="dialog" aria-labelledby="modal-tripcode-help-label">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <h4 class="text-center">
          <span class="name">Tripcode</span><span class="tripcode"></span>
        </h4>
        <hr>
        <p>Tripcode 是一種加密的密文，用於區分不同的用戶而用戶無需在伺服器上存儲任何用戶數據，以保證用戶的匿名特性。</p>
        <img class="tripcode-help" src="./tripcode-help.png" alt="Tripcode">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">關閉​​​</button>
      </div>
    </div>
  </div>
</div>

<!-- Settings Modal -->
<!-- TODO Remove by Willian -->
<div class="modal fade" id="modal-settings" tabindex="-1" role="dialog" aria-labelledby="modal-settings-label">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">

        <div>
          <!-- Nav tabs -->
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" id="settings-info-tab" class="active"><a href="#settings-info" aria-controls="settings-info" role="tab" data-toggle="tab">資訊</a></li>
            <li role="presentation" id="settings-user-tab"><a href="#settings-user" aria-controls="settings-user" role="tab" data-toggle="tab">用戶設定</a></li>
            <li role="presentation" id="settings-room-tab" style="display: none;"><a href="#settings-room" aria-controls="settings-room" role="tab" data-toggle="tab">房間設定</a></li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <!-- Info -->
            <div role="tabpanel" class="tab-pane active" id="settings-info">
              <div class="checkbox" id="settings-info-room-name">${`<p>${profile.room}</p>`}</div>
              <div class="checkbox" id="settings-info-room-description">${`<p>${profile.name}<p></p>${profile.id}</p>`}</div>
              <div class="checkbox opacity-05" id="settings-info-room-uptime">${`<p>Avatar: ${profile.avatar}</p>`}</div>
              <div class="checkbox" id="settings-mute-div">
                <label>
                  <input type="checkbox" id="set-mute">  Mute                </label>
              </div>
            </div>

            <!-- User settings -->
            <div role="tabpanel" class="tab-pane" id="settings-user">
              <p><p>
              <div class="form-group" id="settings-util-name">
                <label for="video-input">Video Input</label>
                <div class="input-group">
                  <select id="video-input" class="form-control" style="background: rgba(0,0,0,.75);; color: #fff;">
                        <option value="none">None</option>
                  </select>

                  <span class="input-group-btn">
                    <button class="btn btn-default" type="button" id="save-stream">SAVE</button>
                  </span>

                </div>

              <div class="checkbox" id="settings-sound">
                <div id="audio-input" class="col-75">
                </div>
              </div>

              </div>

              <!--
              <div class="checkbox" id="settings-sound">
                <label>
                  <input type="checkbox" id="form-settings-system-sound"> 音效                </label>
              </div>
              <div class="checkbox" id="settings-bubble-tail">
                <label>
                  <input type="checkbox" id="form-settings-bubble-tail"> 動態泡泡尾巴                </label>
              </div>
              <div class="checkbox" id="settings-autoload-image">
                <label>
                  <input type="checkbox" id="form-settings-autoload-image"> 自動加載圖片                </label>
              </div>
              -->
            </div>

            <!-- Room settings  -->
            <div role="tabpanel" class="tab-pane" id="settings-room">
              <p></p>
              <div class="form-group" id="settings-room-name">
                <label for="form-settings-room-name">部屋名稱</label>
                <div class="input-group">
                  <input type="text" class="form-control" id="form-settings-room-name" name="room_name" placeholder="部屋名稱" required="">
                  <span class="input-group-btn">
                    <button class="btn btn-default" type="button" id="form-settings-room-name-save">變更</button>
                  </span>
                </div>
              </div>
              <div class="form-group" id="settings-room-description">
                <label for="form-settings-room-description">部屋描述</label>
                <div class="input-group">
                  <input type="text" class="form-control" id="form-settings-room-description" name="room_description" placeholder="部屋描述">
                  <span class="input-group-btn">
                    <button class="btn btn-default" type="button" id="form-settings-room-description-save">變更</button>
                  </span>
                </div>
              </div>
              <!-- akakoori:add a checkbox -->
              <div class="checkbox" id="settings-music-sharemode">
                <label>
                  <input type="checkbox" id="form-settings-music-sharemode">  DJ 模式                </label>
              </div>
              <!-- akakoori -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
