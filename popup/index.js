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
        $('#list_type').attr('class', 'glyphicon glyphicon-list');
        $('#music_list_opener').attr('title', 'show playlist');
    } else alert("please input keyword"); 
}


var search_template = (args) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon glyphicon-music"></i></span>
     <span class="input-group-addon"
           style="width:0px; padding-left:0px;
                  padding-right:0px; border:none;"></span>
     <span class="input-group-addon form-control panel-footer text-center"
            title="${args.name} - ${args.singer}">${ommited_name(args.name, args.singer)}</span>
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
    get_music((keyword, source, data) => {
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
            playMusic(
                $(this).parent().prev().text(),
                $(this).attr('data'),
                alert.bind(window)
            );
        })

        $('.add-song').click(function(){
            var title = $(this).parent().prev().attr('title');
            var idx = title.lastIndexOf(' - ');
            add_song(
                title.substring(0, idx),
                $(this).attr('data'),
                title.substring(idx + 3)
            );
        })
    });
}

var playlist_template = (args) =>
`<div class="input-group">
     <span class="input-group-addon"><i class="glyphicon glyphicon-music"></i></span>
     <span class="input-group-addon form-control panel-footer text-center"
            title="${args.name} - ${args.singer}">${ommited_name(args.name, args.singer)}</span>
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
        if(list && list.length){
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
                playMusic(
                    $(this).parent().prev().text(),
                    $(this).attr('data'),
                    alert.bind(window)
                );
                $(this).next().click();
            })
            $('.del-song').click(function(){
                del_song($(this).attr('data'), true);
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
            if(config[MUSIC_MODE] == SINGLE_MODE){
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
                chrome.storage.sync.set({ [MUSIC_MODE]: SINGLE_MODE });
            }
            else{
                $('#mode_type').attr('class', 'glyphicon glyphicon-cd');
                $('#music_mode').attr('title', 'album mode, continue playing if any song in list')
                chrome.storage.sync.set({ [MUSIC_MODE]: ALBUM_MODE });
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
        $('#play_search').click(()=>play_search(get_music, alert.bind(window)));

        $('#add_search').click(()=>add_search(get_music));
    } 
);
