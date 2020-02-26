var bkg = chrome.extension.getBackgroundPage;

function open_manual(){
    chrome.tabs.create({url: chrome.extension.getURL('manual.html')});
}

function open_background(){
    chrome.tabs.create({url: chrome.extension.getURL('setting/index.html')});
}

function get_music(callback){
    var keyword = $('#keyword').val();
    var source = $('#music_source').val();
    if(keyword) {
        music_api(keyword, callback, {
            log: alert.bind(window), 
            ajax: (req) =>
            chrome.runtime.sendMessage(
                { type: 'ajax' },
                () => bkg().ajax(req))
        }, source);
        /* retain ? */
        $('#keyword').val('');
        emptyKeyword();
    } else alert("please input keyword"); 
}

var list_template = (args, btns) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon ${args.icon ? args.icon : 'glyphicon-music'}"></i></span>
     <span class="input-group-addon form-control panel-footer text-center"
            title="${args.title}">${args.content}</span>
     <div class="input-group-btn">
        ${btns.map((b) => b(args)).join('')} 
     </div>  
 </div>`;

var empty_template = (name, icon) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon ${icon ? icon : 'glyphicon-music'}"></i></span>
     <span class="input-group-addon form-control panel-footer text-center">${name}</span>
 </div>`;

var imm_play_btn = (args) =>
`<button class="btn btn-default imm-play" type="submit"
         data="${args.data}"     title="play the song immediately">
     <i class="glyphicon glyphicon-play"></i>
  </button>`

var imm_pldl_btn = (args) =>
`<button class="btn btn-default imm-pldl" type="submit" data-idx="${args.idx}"
         data="${args.data}"     title="play the song immediately">
     <i class="glyphicon glyphicon-play"></i>
  </button>`

var add_song_btn = (args) =>
`<button class="btn btn-default add-song" type="submit"
         data="${args.data}"     title="add the song the playlist">
     <i class="glyphicon glyphicon-plus"></i>
 </button>`

var fav_song_btn = (args) =>
`<button class="btn btn-default fav-song" type="submit"
         data="${args.data}"     title="add the song the favlist">
     <i class="glyphicon glyphicon-heart"></i>
 </button>`

var del_song_btn = (args) =>
    `<button class="btn btn-default del-song" type="submit"
         data="${args.idx}"   title="remove the song from playlist">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

var vaf_song_btn = (args) =>
    `<button class="btn btn-default vaf-song" type="submit"
         data="${args.idx}"   title="remove the song from favlist">
     <i class="glyphicon glyphicon-remove"></i>
  </button>`

var goto_room_btn = (args) =>
    `<button class="btn btn-default goto-room" type="submit"
        ${args.can ? '' : 'disabled="disabled"'}
         data="${args.url}"   title="goto the room">
     <i class="glyphicon glyphicon-plane"></i>
  </button>`

function bind_imm_play(){
    $('.imm-play').click(function(){
        playMusic(
            $(this).parent().prev().text(),
            $(this).attr('data'),
            alert.bind(window)
        );
    })
}

function bind_imm_pldl(){
    $('.imm-pldl').click(function(){
        playMusic(
            $(this).parent().prev().text(),
            $(this).attr('data'),
            alert.bind(window)
        );
        del_song(PLAYLIST, $(this).attr('data-idx'), show_playlist, true);
    })
}

function bind_fav_song(){
    $('.fav-song').click(function(){
        var title = $(this).parent().prev().attr('title');
        var idx = title.lastIndexOf(' - ');
        add_song(
            FAVLIST,
            title.substring(0, idx),
            $(this).attr('data'),
            title.substring(idx + 3)
        );
    })
}

function bind_add_song(){
    $('.add-song').click(function(){
        var title = $(this).parent().prev().attr('title');
        var idx = title.lastIndexOf(' - ');
        add_song(
            PLAYLIST,
            title.substring(0, idx),
            $(this).attr('data'),
            title.substring(idx + 3)
        );
    })
}

function bind_del_song(){
    $('.del-song').click(function(){
        del_song(PLAYLIST, $(this).attr('data'), show_playlist, false);
    });
}

function bind_vaf_song(){
    $('.vaf-song').click(function(){
        del_song(FAVLIST, $(this).attr('data'), show_favlist, false);
    });
}

function bind_goto_room(){
    $('.goto-room').click(function(){
        var toURL = $(this).attr('data');

        chrome.storage.sync.set({'jumpToRoom': toURL });
        sendTab({ fn: leave_room }, function(){
            chrome.runtime.sendMessage({ jumpto: toURL });
        });
        return;

        $.ajax({
            type: "POST",
            data: {'leave':'leave'},
            url: 'https://drrr.com//room',
            dataType: 'json',
            success: function(data){
                alert('WTF', data);
                if(data.status && data.status == "403"){


                }
                else{
                    //alert($(this).attr('data'));
                    chrome.storage.sync.set({'jumpToRoom': toURL });
                }
            },
            error: function(data){
                if(data.status && data.status == "403"){
                    chrome.notifications.create(
                        {
                            type: "basic",
                            iconUrl: '/icon.png',
                            title: '離開失敗，稍後再試',
                            message: '蟲洞開啟失敗'
                        });
                }
                else{
                    //alert($(this).attr('data'));
                    chrome.storage.sync.set({'jumpToRoom': toURL });
                }
            }
        });
    });
}

btn_funcbind = {
    [imm_play_btn]: bind_imm_play,
    [imm_pldl_btn]: bind_imm_pldl,
    [fav_song_btn]: bind_fav_song,
    [add_song_btn]: bind_add_song,
    [del_song_btn]: bind_del_song,
    [vaf_song_btn]: bind_vaf_song,
    [goto_room_btn]: bind_goto_room,
}

function show_list(cont_name, entries, btns, callback){
    $(cont_name).html(
        !Array.isArray(entries) ? entries :
        entries.map((args)=> list_template(args, btns)).join('')
    ).promise().then(callback);
    for(btn of btns) btn_funcbind[btn]();
}

function show_searchlist(callback){
    get_music((keyword, source, data) => 
        show_list(
            '#list_container',
            Object.keys(api[source].songs(data)).map((idx)=>{
                var name = api[source].name(data, idx);
                var singer = api[source].singer(data, idx);
                return ({
                    icon: 'glyphicon-search',
                    title: `${name} - ${singer}`,
                    content: ommited_name(name, singer),
                    data: api[source].link(data, idx)
                });
            }), [add_song_btn, imm_play_btn, fav_song_btn], callback
        )
    );
}

function show_roomlist(callback){
    $.ajax({
        type: "GET",
        url: 'https://drrr.com//lounge?api=json',
        dataType: 'json',
        success: function(data){
            lounge = data.rooms.sort(function(a,b) {return (a.language > b.language) ? 1 : ((b.language > a.language) ? -1 : 0);} ).reverse();

            show_list(
                '#fb_list_container',
                lounge.map((room)=>{
                    var status = `(${room.total}/${String(room.limit).substring(0, 4)})`;
                    var users = room.users.map(u=>`${room.host && room.host.name == u.name ? '👤': '👣'} ${u.name}`).join('\n');
                    return ({
                        icon: 'glyphicon-home',
                        title: `${room.language} ${room.name}\n${room.description}\n${users}`,
                        content: ommited_name(`${room.language}`, `${room.name} ${status}`, 100),
                        can: room.total < room.limit,
                        url: 'https://drrr.com/room/?id=' + room.roomId,
                    });
                }), [goto_room_btn], callback
            )

        },
        error: function(data){
            alert("error", data);
        }
    });
}

function show_friendlist(callback){
    $.ajax({
        type: "GET",
        url: 'https://drrr.com//lounge?api=json',
        dataType: 'json',
        success: function(data){
            lounge = data.rooms.sort(function(a,b) {return (a.language > b.language) ? 1 : ((b.language > a.language) ? -1 : 0);} ).reverse();
            var groups = findUserAsList(friends, lounge);
            console.log('groups:', groups);
            console.log("keys", Object.keys(groups));
            if(groups.length)
                show_list(
                    '#fb_list_container',
                    groups.map(([room, users])=>{
                        var status = `(${room.total}/${String(room.limit).substring(0, 4)})`;
                        var usernames = users.map(u=>`${u.name}`).join(', ');
                        var AllUsers = room.users.map(u=>`${room.host && room.host.name == u.name ? '👤': '👣'} ${u.name}`).join('\n');
                        return ({
                            icon: 'glyphicon-home',
                            title: `${room.language} ${room.name}\n${room.description}\n${AllUsers}`,
                            content: ommited_name(`${room.name}`, `${usernames}`, 100),
                            can: room.total < room.limit,
                            url: 'https://drrr.com/room/?id=' + room.roomId,
                        });
                    }), [goto_room_btn], callback
                )
            else show_list('#fb_list_container', empty_template('NO FRIEND ONLINE', 'glyphicon-home'), [], callback);
        },
        error: function(data){
            alert("error", data);
        }
    });
}

function show_configlist(conf_type, callback, buttons, empty_name, icon){
    chrome.storage.sync.get((config) => {
        var list = config[conf_type];
        if(list && list.length){
            show_list(
                '#list_container',
                Object.keys(list).map((idx) => {
                    var name = list[idx].name;
                    var singer = list[idx].singer;
                    return ({
                        idx: idx,
                        icon: icon,
                        title: `${name} - ${singer}`,
                        content: ommited_name(name, singer),
                        data: list[idx].link,
                    });
                }), buttons, callback
            )
        }
        else show_list('#list_container', empty_template(empty_name, icon), [], callback);
    });
}

function show_playlist(callback){
    show_configlist(
        PLAYLIST, callback,
        [del_song_btn, imm_pldl_btn, fav_song_btn],
        'EMPTY PLAYLIST', 'glyphicon-list');
}

function show_favlist(callback){
    show_configlist(
        FAVLIST, callback,
        [add_song_btn, imm_play_btn, vaf_song_btn],
        'EMPTY FAVLIST', 'glyphicon-heart');
}

function emptyKeyword(){
    $('#list_type').attr('class', 'glyphicon glyphicon-list');
    $('#music_list_opener').attr('title', 'show playlist');
    $('#fav_add_icon').attr('class', 'glyphicon glyphicon-heart');
    $('#fav_add_search').attr('title', 'show favorite songs');
    $('#play_search').attr('title', "play first song in playlist")
}

function music_bar_setup(){
    /* music mode change */
    function mode_switch(bool){
        if(bool){
            $('#mode_type').attr('class', 'glyphicon glyphicon-music');
            $('#music_mode').attr('title', 'single mode, play one song at a time')
        }
        else{
            $('#mode_type').attr('class', 'glyphicon glyphicon-cd');
            $('#music_mode').attr('title', 'album mode, continue playing if any song in playlist')
        }
    }

    /* handle config[MUSIC_MODE] be undefined slightly */
    chrome.storage.sync.get((config)=> mode_switch(config[MUSIC_MODE] === SINGLE_MODE));
    $('#music_mode').click(()=>{
        chrome.storage.sync.set({
            [MUSIC_MODE]: $('#mode_type').hasClass('glyphicon-cd') ? SINGLE_MODE : ALBUM_MODE
        });
        mode_switch($('#mode_type').hasClass('glyphicon-cd'));
    })

    /* keyword change icon setting */
    $('#keyword')[0].addEventListener('keyup', function(v){
        if(v.keyCode == 13){
            if(!v.shiftKey && !v.ctrlKey)
                $('#music_list_opener').click();
            else if(v.shiftKey && !v.ctrlKey)
                $('#play_search').click();
            else if(!v.shiftKey && v.ctrlKey)
                $('#fav_add_search').click();
        }

    }, false);

    $('#keyword').on('input focus',function(e){
        if(e.type == 'focus') $('#music_list').collapse('hide');
        if($(this).val().trim()){
            $('#list_type').attr('class', 'glyphicon glyphicon-search');
            $('#music_list_opener').attr('title', 'search and show available results');
            $('#fav_add_icon').attr('class', 'glyphicon glyphicon-plus');
            $('#fav_add_search').attr('title', 'search and add the song to playlist');
            $('#play_search').attr('title', "search and play the song immediately")
        }
        else{
            emptyKeyword();
        }
    });

    /* music source setting */
    Object.keys(api).forEach((v)=>{
        $('#music_source').append(`<option value="${v}">${v}</option>`);
    })
    chrome.storage.sync.get((config) => {
        if(config['music_source'])
            $('#music_source').val(config['music_source']);
    });
    $('#music_source').change(function(){
        chrome.storage.sync.set({ music_source: $(this).val() });
    });


    /* when open the music_list */
    /* .collapse('hide') .collapse('show') */

    $('#music_list_opener').on('click', function () {
        var $target = $($(this).attr("data-target"));
        var tartype = $target.attr('data');
        var opening = $target.hasClass('in');

        if($('#list_type').hasClass('glyphicon-list')){
            $target.attr('data', 'playlist');
            if(!opening) show_playlist(()=>$target.collapse('show'));
            else if(tartype == 'playlist') $target.collapse('hide');
            else{
                //show playlist
                callback = function () {
                    show_playlist(()=>$target.collapse('show'));
                    $target.off('hidden.bs.collapse', callback);
                }
                $target.on('hidden.bs.collapse', callback);
                $target.collapse('hide');
            }
        }
        else{
            //search and show the result
            $target.attr('data', 'search')
            show_searchlist(()=>$target.collapse(('show')));
        }
    });

    $('#fav_add_search').on('click', function(){
        var $target = $($(this).attr("data-target"));
        var tartype = $target.attr('data');
        var opening = $target.hasClass('in');
        if($('#fav_add_icon').hasClass('glyphicon-heart')){
            $target.attr('data', 'fav')
            if(!opening) show_favlist(()=>$target.collapse('show'));
            else if(tartype == 'fav') $target.collapse('hide');
            else{
                //show playlist
                callback = function () {
                    show_favlist(()=>$target.collapse('show'));
                    $target.off('hidden.bs.collapse', callback);
                }
                $target.on('hidden.bs.collapse', callback);
                $target.collapse('hide');
            }
        }
        else{
            add_search(get_music)
        }
    });

    /* when search buttons clicked */
    $('#play_search').click(function(){
        if($('#keyword').val().trim())
            play_search(get_music, alert.bind(window));
        else{
            var tartype = $($(this).attr("data-target")).attr('data');
            play_next(undefined, alert.bind(window),
                tartype == 'playlist' ? show_playlist : undefined);
        }
    });
}

function friend_bio_setup(){


    chrome.storage.sync.get((config)=>{
        var tab = config['pop-tab'] ? config['pop-tab'] : 'tab0';
        $(`#${tab}`).addClass('active');
        $(`#${tab}-cont`).addClass('active').addClass('in');
        //class="active" 
    });

    $('.pop-tab').on('click', function(){
        chrome.storage.sync.set({'pop-tab': this.id});
    })

    $('.fb-opener').on('click', function () {
        var $target = $($(this).attr("data-target"));
        var tartype = $target.attr('data');
        var opening = $target.hasClass('in');
        var opener = {'friend-opener': show_friendlist, 'room-opener': show_roomlist}[this.id];
        $target.attr('data', this.id);
        if(!opening) opener(()=>$target.collapse('show'));
        else if(tartype == this.id) $target.collapse('hide');
        else{
            //show roomlist
            callback = function () {
                opener(()=>$target.collapse('show'));
                $target.off('hidden.bs.collapse', callback);
            }
            $target.on('hidden.bs.collapse', callback);
            $target.collapse('hide');
        }
    });

}

$(document).ready(function(){
    $("#manual").click(open_manual);
    $("#cog").click(open_background); 
    /* ensure activate the background page */
    chrome.runtime.sendMessage({ type: 'popup' },
        () => bkg().make_switch_panel($, '#switch_panel'));
    music_bar_setup(); 
    friend_bio_setup();
});
