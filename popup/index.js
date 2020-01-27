var bkg = chrome.extension.getBackgroundPage;

function refresh_settings(){
    chrome.storage.sync.clear();
}

function open_background(){
    chrome.tabs.create({url: chrome.extension.getURL('background/index.html')});
}

function netease_api_url(keyword){
    return `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1&offset=0&total=true&limit=10`
}

function netease_songs(data){
    if(data.code != 200 || !data.result.songs || !data.result.songs.length)
        throw `No search result... QAQ`;
    return data['result']['songs'];
}

function netease_link(data, idx = 0){
    return `https://music.163.com/#/song?id=${netease_songs(data)[idx]['id']}`
}

function netease_name(data, idx = 0){
    return netease_songs(data)[idx]['name'];
}

function netease_singer(data, idx = 0){
    return netease_songs(data)[idx]['artists'].map((m)=>m['name']).join(',');
}

function baidu_api_url(keyword){
    return `http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.search.catalogSug&format=json&query=${keyword}`;
}

function baidu_songs(data){
    if(data.error_code == 22001 || !data['song'].length)
        throw `No search result... QAQ`;
    return data['song'];
}

function baidu_link(data, idx = 0){
    return `http://music.taihe.com/song/${baidu_songs(data)[idx]['songid']}`;
}

function baidu_name(data, idx = 0){
    return baidu_songs(data)[idx]['songname'];
}

function baidu_singer(data, idx = 0){
    return baidu_songs(data)[idx]['artistname'];
}

var api = {
    '易': {
        url: netease_api_url,
        link: netease_link,
        name: netease_name,
        songs: netease_songs,
        singer: netease_singer
    },
    '千': {
        url: baidu_api_url,
        link: baidu_link,
        name: baidu_name,
        songs: baidu_songs,
        singer: baidu_singer
    }
}

function nextkey(name, dict){
    var keys = Object.keys(dict);
    var idx = keys.indexOf(name);
    idx = (idx + 1) % keys.length;
    return keys[idx];
}

function get_music_data(callback, source, start_from){
    if(start_from && start_from === source){
        alert("all source unavailiable");
        return;
    }
    if(!source) source = $('#music_source').val();
    var keyword = $('#keyword').val();
    if(keyword) {
        alert(`getting source ${source}`);
        chrome.runtime.sendMessage({ type: 'ajax' },
            () => bkg().ajax({
                type: "GET",
                url: api[source].url(keyword),
                dataType: 'json',
                success: function(data){
                    try{
                        callback(keyword, source, data);
                    }
                    catch(e){
                        alert(e);
                        get_music_data(
                            callback,
                            nextkey(source, api),
                            start_from ? start_from : source);
                    }
                    finally{
                        $('#keyword').val('');
                        $('#list_type').attr('class', 'glyphicon glyphicon-list');
                        $('#music_list_opener').attr('title', 'show playlist');
                    }
                },
                error: function(jxhr){
                    alert("Fetch song failed, report developer:\n" + JSON.stringify(jxhr));
                    $('#keyword').val('');
                    $('#list_type').attr('class', 'glyphicon glyphicon-list');
                    $('#music_list_opener').attr('title', 'show playlist');
                }
            })
        );
    } else alert("please input keyword");
}

function play_search(){
    get_music_data((keyword, source, data) => {
        sendTab({
            fn: play_music,
            args: {
                title: keyword,
                url: api[source].link(data)
            }
        }, () => alert('no active drrr.com chatroom tab'))
    });
}

function push_value(entry, val, callback){
    chrome.storage.sync.get((config)=>{
        var list = config[entry];
        if(!list) list = [];
        list.push(val);
        chrome.storage.sync.set({
            [entry]: list
        });
        if(callback) callback();
    });
}

function add_search(){
    get_music_data((keyword, source, data) => {
        push_value(
            PLAYLIST,
            {
                name: api[source].name(data),
                link: api[source].link(data),
                singer: api[source].singer(data)
            }
        );
        chrome.notifications.create({
            type: "basic",
            iconUrl: '/icon.png',
            title: `PLAYLIST UPDATE`,
            message: `${api[source].name(data)} - ${api[source].singer(data)} is added to playlist`
        });
    });
    // if ui list open, update ui list
    // show notifications added
}

var search_template = (args) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon glyphicon-music"></i></span>
     <span class="input-group-addon"
           style="width:0px; padding-left:0px;
                  padding-right:0px; border:none;"></span>
     <span class="input-group-addon form-control panel-footer text-center"
            title="${args.name} - ${args.singer}">${ommited_name(args.name)}</span>
     <div class="input-group-btn">
         <button class="btn btn-default imm-play" type="submit"
                 data="${args.link}"     title="play the song immediately">
             <i class="glyphicon glyphicon-play"></i>
         </button>
         <button class="btn btn-default add-song" type="submit"
                 data="${args.link}"     title="add the song the playlist">
             <i class="glyphicon glyphicon-plus"></i>
         </button>
     </div>  
 </div>`;

function display_search(){
    get_music_data((keyword, source, data) => {
        $('#list_container').html(
            Object.keys(api[source].songs(data)).map((idx)=>
                search_template({
                    name: api[source].name(data, idx),
                    link: api[source].link(data, idx),
                    singer: api[source].singer(data, idx)
                })
            ).join('')
        );
        $('.imm-play').click(function(){
            sendTab({
                fn: play_music,
                args: {
                    title: $(this).parent().prev().text(),
                    url: $(this).attr('data')
                }
            }, () => alert('no active drrr.com chatroom tab'))
        })

        $('.add-song').click(function(){
            var title = $(this).parent().prev().attr('title');
            var idx = title.lastIndexOf(' - ');
            push_value(
                PLAYLIST,
                {
                    name: title.substring(0, idx),
                    link: $(this).attr('data'),
                    singer: title.substring(idx + 3)
                }
            );
            chrome.notifications.create({
                type: "basic",
                iconUrl: '/icon.png',
                title: `PLAYLIST UPDATE`,
                message: `${title} is added to playlist`
            });
        })
    });
}

var playlist_template = (args) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon glyphicon-music"></i></span>
     <span class="input-group-addon form-control panel-footer text-center"
            title="${args.name} - ${args.singer}">${ommited_name(args.name)}</span>
     <div class="input-group-btn">
         <button class="btn btn-default imm-play" type="submit"
                 data="${args.link}"     title="play the song immediately">
             <i class="glyphicon glyphicon-play"></i>
         </button>
         <button class="btn btn-default del-song" type="submit"
                 data="${args.idx}"   title="remove the song from list">
             <i class="glyphicon glyphicon-remove"></i>
         </button>
     </div>  
 </div>`;

var empty_template =
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon glyphicon-music"></i></span>
     <span class="input-group-addon form-control panel-footer text-center">EMPTY LIST</span>
 </div>`;

function show_playlist(){
    chrome.storage.sync.get((config) => {
        var list = config[PLAYLIST];
        if(list.length){
            $('#list_container').html(
                Object.keys(list).map((idx) => 
                    playlist_template({
                        idx: idx,
                        name: list[idx].name,
                        link: list[idx].link,
                        singer: list[idx].singer
                    })
                ).join('')
            );
            $('.imm-play').click(function(){
                sendTab({
                    fn: play_music,
                    args: {
                        title: $(this).parent().prev().text(),
                        url: $(this).attr('data')
                    }
                }, () => alert('no active drrr.com chatroom tab'))
            })
            $('.del-song').click(function(){
                list.splice($(this).attr('data'), 1);
                chrome.storage.sync.set({
                    [PLAYLIST]: list
                })
                show_playlist();
            })
        }
        else{
            $('#list_container').html(empty_template);
        }
    });
}

$(document).ready(
    function(){
        $("#refresh").click(refresh_settings);
        $("#cog").click(open_background); 
        /* ensure activate the background page */
        chrome.runtime.sendMessage({ type: 'popup' },
            () => bkg().make_switch_panel($, '#switch_panel'));

        /* music mode change */
        chrome.storage.sync.get((config)=>{
            if(config['music_mode'] == SINGLE_MODE){
                $('#mode_type').attr('class', 'glyphicon glyphicon-headphones');
                $('#music_mode').attr('title', 'single mode, play one song at a time')
            }
            else{
                $('#mode_type').attr('class', 'glyphicon glyphicon-cd');
                $('#music_mode').attr('title', 'album mode, continue playing if any song in list')
            }
        });
        $('#music_mode').click(()=>{
            if($('#mode_type').hasClass('glyphicon-cd')){
                $('#mode_type').attr('class', 'glyphicon glyphicon-headphones');
                $('#music_mode').attr('title', 'single mode, play one song at a time')
                chrome.storage.sync.set({ music_mode: SINGLE_MODE });
            }
            else{
                $('#mode_type').attr('class', 'glyphicon glyphicon-cd');
                $('#music_mode').attr('title', 'album mode, continue playing if any song in list')
                chrome.storage.sync.set({ music_mode: ALBUM_MODE });
            }
        })

        /* keyword change icon setting */
        $('#keyword').on('input focus',function(e){
            if(e.type == 'focus') $('#music_list').collapse('hide');
            if($(this).val()){
                $('#list_type').attr('class', 'glyphicon glyphicon-search');
                $('#music_list_opener').attr('title', 'search and show available results');
            }
            else{
                $('#list_type').attr('class', 'glyphicon glyphicon-list');
                $('#music_list_opener').attr('title', 'show playlist');
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
        $('#music_list').on('show.bs.collapse', function () {
            if($('#list_type').hasClass('glyphicon-list')){
                //show playlist
                show_playlist();
            }
            else{
                //search and show the result
                display_search();
            }
        });

        /* when search buttons clicked */
        $('#play_search').click(play_search);

        $('#add_search').click(add_search);
    } 
);
