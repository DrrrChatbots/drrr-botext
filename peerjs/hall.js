let lange_zone_split = `<hr class="room-splitter" data-jets="">`

let roomTmplt = (room) =>
  `<ul class="rooms" lang="zh-TW" data-meta="${room.roomName} ${room.hostName}#${room.hostID}" data-description="" data-music="" data-jets="${room.roomName} ${room.hostName}#${room.hostID}">
      <li class="name" id="${room.roomID}">
         <!-- <form action="/room/" method="get"> -->
          <button class="btn btn-link select-text lounge-room-name" type="submit" name="id" value="${room.hostID}">
          <span class="room-badge room-badge-music"><i class="icon icon-music"></i></span>
          <span class="room-badge room-badge-description"><i class="icon icon-note"></i></span>
          <span class="room-name" title="${room.roomName}">${room.roomName}</span>
          </button>
         <!-- </form> -->
      </li>
      <li class="creator">
         <span class="symbol symbol-${room.hostAvatar}"></span>
         ${room.hostName}
      </li>
      <li class="status">
         <div class="progress-bar-label-wrap">
            <div class="progress-bar-label room-tooltip tooltipstered">
               N/A / N/A
            </div>
         </div>
         <div class="progress progress-desktop loaded" style="width: 30%;">
            <div class="progress-bar " role="progressbar" style="width: 100%;"></div>
         </div>
      </li>
      <li class="members">
         <div class="avatar-wrap symbol-wrap-${room.hostAvatar}">
            <span class="symbol symbol-${room.hostAvatar}"></span>
            ${room.hostName}<!--<span class="tripcode">#d4GREEN.76</span> --><span class="icon icon-device-type icon-desktop"></span>
         </div>
      </li>
   </ul>`;

let hallTmplt = profile =>
`<div class="container">
    <div class="row">
       <div class="col-sm-4 col-sm-push-8">
         <ul id="profile" class="lounge-profile" data-avatar="${profile.avatar}">
             <li class="icon">
               <div class="avatar avatar-${profile.avatar}"></div>
                <div class="name">
                    ${profile.name}<!--<span class="tripcode">#L/CaT//Hsk</span>-->
                </div>
                <div class="profile-links">
                   <form action="?" method="get">
                      <input type="submit" class="btn btn-invert btn-link" value="登出">
                   </form>
                </div>
             </li>
             <li class="lang" style="display:none">zh-TW</li>
             <li class="lang-friends" style="display:none">zh-CN zh-TW zh-TM</li>
             <!-- <li class="user-ip" style="display:none">MTQwLkExMy5xMjguMTg4</li> -->
          </ul>
          <!-- <div class="sidebar-box note highlight">
             <a href="http://status.sparanoid.com/" target="_blank">Server maintenance notice - 2015-10-21 2:00:00 PM UTC</a>
             </div> -->
          <div class="sidebar-box note rooms-filter-wrap">
             <input type="search" class="form-control rooms-filter" id="rooms-filter" placeholder="Google Sheet ID">
             <div class="checkbox">
                <input id="update-rooms" type="button" value="更新大廳">
             </div>
          </div>
          <div class="sidebar-box note highlight">
             <ul>
                <li><a href="https://crowdin.com/project/drrr/invite" target="_blank">歡迎閣下翻譯 DRRR 聊天室！</a></li>
                <li class="sidebar-partial list-item visible" data-hide="true" data-langs="zh-CN zh-TW">
                   如果您有任何意見與建議，請访问 <a href="https://drrr.chat/t/feedback">DOLLARS 休息室</a>
                </li>
                <li class="sidebar-partial list-item" data-hide="true" data-langs="en-US" style="display: none;">
                   If you have any suggestion or request, please <a href="https://drrr.chat/t/feedback">visit our forum</a> for more info.
                </li>
             </ul>
          </div>
          <!-- Sidebar elemets that should be hidden for mobile devices
             The following elements are copyied (jquery clone) to #sidebar-mobile
             -->
          <div class="hide-sm">
             <div class="sidebar-box no-padding mobile-clone bstooltip tooltipstered visible" data-hide="true" data-langs="zh-CN zh-TW">
                <a href="javascript:void(0)" class="sharer" data-sharer="weibo" data-title="2021-02-23 每日打卡 drrr.com #DOLLARS聊天室# #无头骑士异闻录#" data-url="https://drrr.com/" data-image="https://drrr.com/apple-touch-icon.png" data-appkey="2793388877" data-ralateuid="5842424001">
                <img src="https://drrr.com/img/sidebar/share-weibo.png">
                </a>
             </div>
             <div class="sidebar-box no-border no-padding mobile-clone">
                <a href="/durachan/"><img src="https://drrr.com/img/sidebar/durachan-welcome.png"></a>
             </div>
             <div class="sidebar-box sidebar-hitokoto visible" id="sidebar-hitokoto" data-hide="true" data-langs="zh-CN zh-TW">
                Welcome to drrr.mirror
             </div>
             <!-- <div class="sidebar-box no-margin-bottom sidebar-bangumi" id="sidebar-bangumi">
                …
                </div>
                <div class="sidebar-box no-border no-padding-vertical attach-top small">
                powered by <a href="http://where.moe/" target="_blank">where.moe</a>
                </div> -->
             <!-- placeholder -->
          </div>
          <!-- .hide-sm -->
       </div>
       <!-- .col-sm-4 -->
       <div class="col-sm-8 col-sm-pull-4">
          <div class="wrap">
             <div class="lounge-top">
                <span data-langs-hide="zh-CN zh-TW" class="hidden">
                <a href="https://drrr.chat/">離線版</a>
                </span>
                <span data-hide="true" data-langs="zh-CN zh-TW" class="visible">
                <a href="https://drrr.chat/">離線版</a>
                </span>
                <span data-langs-hide="zh-CN zh-TW" class="hidden">
                - <a target="_blank" href="http://dollars-bbs.org/">BBS</a>
                </span>
                <span data-hide="true" data-langs="zh-CN zh-TW" class="visible">
                - <a href="https://drrr.wiki/">維基</a>
                </span>
                - <a href="/donate/" style="color: #ea2727">捐助</a>
                - <a class="lounge-refresh" id="lounge-refresh"><b>刷新</b></a>
                <span class="load-placeholder load-placeholder--lounge">Loading…</span>
             </div>
             <div class="lounge-nav">
                <div class="create-room pull-left" id="create_room">
                   <form action="?" method="get">
                      <input type="hidden" name="name" value="${encodeURIComponent(profile.name)}">
                      <input type="hidden" name="uid" value="${encodeURIComponent(profile.id)}">
                      <input type="hidden" name="host" value="${encodeURIComponent(profile.id)}">
                      <input type="submit" class="btn btn-default" value="創立部屋">
                   </form>
                </div>
                <div class="lounge-links pull-left">
                   <div class="lounge-counter on">
                      <span class="rooms-count" id="rooms-count">N/A</span>
                      rooms
                      - <span class="online-count" id="online-count">N/A</span>
                      users
                   </div>
                </div>
                <!-- .left -->
             </div>
             <div class="rooms-placeholder show-members" id="rooms-placeholder">
                <div class="rooms-wrap" id="rooms-filter-support">
                </div>
             </div>
          </div>
       </div>
       <!-- .col-sm-8 -->
    </div>
    <!-- .row -->
    <div class="row">
       <div class="col-sm-12">
          <div class="lounge-footer">
             <!--
                Sidebar blocks for mobile
                Add .mobile-clone class for elements you'd like to show on mobile site
                -->
             <div id="sidebar-mobile" class="sidebar-mobile visible-xs-block">
                <div class="sidebar-box no-padding mobile-clone bstooltip tooltipstered visible" data-hide="true" data-langs="zh-CN zh-TW">
                   <a href="javascript:void(0)" class="sharer" data-sharer="weibo" data-title="2021-02-23 每日打卡 drrr.com #DOLLARS聊天室# #无头骑士异闻录#" data-url="https://drrr.com/" data-image="https://drrr.com/apple-touch-icon.png" data-appkey="2793388877" data-ralateuid="5842424001">
                   <img src="https://drrr.com/img/sidebar/share-weibo.png">
                   </a>
                </div>
                <div class="sidebar-box no-border no-padding mobile-clone">
                   <a href="/durachan/"><img src="https://drrr.com/img/sidebar/durachan-welcome.png"></a>
                </div>
             </div>
             <!--
                Async sidebar blocks for mobile
                -->
             <div class="sidebar-mobile visible-xs-block">
                <div class="sidebar-box sidebar-hitokoto visible" id="sidebar-hitokoto-mobile" data-hide="true" data-langs="zh-CN zh-TW">
                   …
                </div>
                <!-- <div class="sidebar-box no-margin-bottom sidebar-bangumi" id="sidebar-bangumi-mobile">
                   …
                   </div>
                   <div class="sidebar-box no-border no-padding-vertical attach-top small">
                   powered by <a href="http://where.moe/" target="_blank">where.moe</a>
                   </div> -->
             </div>
             <ul class="list-unstyled list-inline">
                <li><a href="https://twitter.com/dollarschat"><i class="icon icon-twitter"></i> 推特</a></li>
                <li><a href="https://www.facebook.com/drrrchatroom/"><i class="icon icon-facebook"></i> 臉書</a></li>
                <li><a href="https://weibo.com/drrrchat"><i class="icon icon-weibo"></i> 微博</a></li>
                <li data-hide="true" data-langs="zh-CN zh-TW" class="visible"><a href="https://drrr.wiki/"><i class="icon icon-puzzle-piece"></i> 維基</a></li>
                <li data-hide="true" data-langs="zh-CN zh-TW" class="visible"><a href="https://drrr.chat/"><i class="icon icon-chat"></i> 離線版</a></li>
                <li data-langs-hide="zh-CN zh-TW" class="hidden"><a href="/static-en/"><i class="icon icon-chat"></i> 離線版</a></li>
                <li><a href="/blog/"><i class="icon icon-pencil"></i> 日誌</a></li>
             </ul>
             <ul class="list-unstyled list-inline">
                <li><a href="/faq/">常見問答集</a></li>
                <li><a href="/platforms/">應用程式</a></li>
                <li><a href="/resources/">資源</a></li>
                <li><a href="/changelog/">更新記錄</a></li>
                <li><a href="/translators/">譯者</a></li>
                <li><a href="/donate/">捐助</a></li>
                <li data-hide="true" data-langs="zh-CN zh-TW" class="visible"><a href="/sponsors/">廣告投放</a></li>
                <li><a href="/about/">關於</a></li>
             </ul>
             <ul class="list-unstyled list-inline">
                <li>
                   <a href="/about/">
                   <span class="project-dollars sm inline bstooltip tooltipstered"></span>
                   </a>
                </li>
             </ul>
             <ul id="timezones" class="list-unstyled list-inline small">
                <li title="02-23-2021">Local 02:33</li>
                <li title="02-22-2021">UTC 18:33</li>
                <li title="02-23-2021">NRT 03:33</li>
                <li title="02-23-2021">PVG 02:33</li>
                <li title="02-22-2021">JFK 13:33</li>
                <li title="02-22-2021">LAX 10:33</li>
             </ul>
          </div>
       </div>
       <!-- .col-sm-12 -->
    </div>
    <!-- .row -->
  </div>
  <!-- .container -->`;
