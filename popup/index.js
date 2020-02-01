var bkg = chrome.extension.getBackgroundPage;

function refresh_settings(){
    chrome.storage.sync.clear();
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
            title="${args.name} - ${args.singer}">${ommited_name(args.name, args.singer)}</span>
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
         data="${args.link}"     title="play the song immediately">
     <i class="glyphicon glyphicon-play"></i>
  </button>`

var add_song_btn = (args) =>
`<button class="btn btn-default add-song" type="submit"
         data="${args.link}"     title="add the song the playlist">
     <i class="glyphicon glyphicon-plus"></i>
 </button>`

var fav_song_btn = (args) =>
`<button class="btn btn-default fav-song" type="submit"
         data="${args.link}"     title="add the song the favlist">
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

function bind_imm_play(){
    $('.imm-play').click(function(){
        playMusic(
            $(this).parent().prev().text(),
            $(this).attr('data'),
            alert.bind(window)
        );
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

btn_funcbind = {
    [imm_play_btn]: bind_imm_play,
    [fav_song_btn]: bind_fav_song,
    [add_song_btn]: bind_add_song,
    [del_song_btn]: bind_del_song,
    [vaf_song_btn]: bind_vaf_song
}

function show_list(songs, btns, callback){
    $('#list_container').html(
        !Array.isArray(songs) ? songs :
        songs.map((args)=> list_template(args, btns)).join('')
    ).promise().then(callback);
    for(btn of btns) btn_funcbind[btn]();
}

function show_searchlist(callback){
    get_music((keyword, source, data) => 
        show_list(
            Object.keys(api[source].songs(data)).map((idx)=>
                ({
                    icon: 'glyphicon-search',
                    name: api[source].name(data, idx),
                    link: api[source].link(data, idx),
                    singer: api[source].singer(data, idx)
                })
            ), [add_song_btn, imm_play_btn, fav_song_btn], callback
        )
    );
}

function show_configlist(conf_type, callback, buttons, empty_name, icon){
    chrome.storage.sync.get((config) => {
        var list = config[conf_type];
        if(list && list.length){
            show_list(
                Object.keys(list).map((idx) => 
                    ({
                        idx: idx,
                        icon: icon,
                        name: list[idx].name,
                        link: list[idx].link,
                        singer: list[idx].singer
                    })
                ), buttons, callback
            )
        }
        else show_list(empty_template(empty_name, icon), [], callback);
    });
}

function show_playlist(callback){
    show_configlist(
        PLAYLIST, callback,
        [del_song_btn, imm_play_btn, fav_song_btn],
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
}

$(document).ready(
    function(){
        $("#refresh").click(refresh_settings);
        $("#cog").click(open_background); 
        /* ensure activate the background page */
        chrome.runtime.sendMessage({ type: 'popup' },
            () => bkg().make_switch_panel($, '#switch_panel'));

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

        chrome.storage.sync.get((config)=> mode_switch(config[MUSIC_MODE] == SINGLE_MODE));
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

            //if ($target.hasClass('in')){
            //    $target.collapse('hide');
            //}
            if($('#list_type').hasClass('glyphicon-list')){
                $target.attr('data', 'playlist')
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
        $('#play_search').click(()=>{
            if($('#keyword').val().trim())
                play_search(get_music, alert.bind(window))
            else play_next(undefined, alert.bind(window));
        });
    } 
);
