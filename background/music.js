

function get_music(keyword, callback){
    var source = '易';
    if(keyword) {
        music_api(keyword, callback, {
            log: console.log, 
            ajax: ajax
        }, source);
    } else console.log("please input keyword"); 
}

function lstMusic(){
    var list = this[PLAYLIST];
    if(list && list.length){
        msg = Object.keys(list).map(
            (idx) => `[${idx}] ${ommited_name(list[idx].name, list[idx].singer)}`
        ).join('\n');
    } else msg = 'EMPTY LIST'
    sendTab({
        fn: publish_message,
        msg: msg
    });
}
