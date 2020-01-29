
/* setting.html */

function make_pills(ps, index){
    console.log(ps);
    return `<ul class="nav nav-pills">
                ${Object.keys(ps).map(
                    (idx) => `<li ${(`menu${idx}` === index ? `class="active"` : '')}>
                                <a data-toggle="pill" href="#menu${idx}">
                                    ${ps[idx]}
                                </a>
                              </li>`).join('')} 
            </ul>`;
}

function make_tabs(tabs, index){
    console.log(tabs);
    var keys = Object.keys(tabs);
    return `<div class="tab-content">
                ${Object.keys(keys).map(
                    (idx) =>
                    `<div id="menu${idx}" 
                      class="tab-pane fade ${`menu${idx}` === index ? `in active` : ''}"> 

                    <h3>${keys[idx]} Setting

                        <small>
                            <span class="btn-group" role="group">
                                <button type="button" class="btn btn-info btn-sm" 
                                    data-toggle="modal" data-target="#${keys[idx]}-modal">
                                         HELP
                                </button>
                                <button type="button" id="reset-${keys[idx]}"
                                class="btn btn-success btn-sm reset-button"
                                data="${keys[idx]}"
                                style="display:none;">
                                         RESET
                                </button>
                                <button type="button" id="save-${keys[idx]}"
                                class="btn btn-danger btn-sm save-button"
                                data="${keys[idx]}"
                                style="display:none;">
                                         SAVE!
                                </button>
                            </span>
                        </small>
                    </h3>
                    <div id="${keys[idx]}-modal" class="modal fade" role="dialog">
                        <div class="modal-dialog">
                        <!-- Modal content-->
                            <div class="modal-content">
                              <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">${keys[idx]} Configuration</h4>
                              </div>
                              <div class="modal-body">
                                ${settings[keys[idx]].desc}
                                <p>example: </p>
                                <textarea disabled rows="${settings[keys[idx]].def_conf.split('\n').length}" style="width:100%; height:100%">${settings[keys[idx]].def_conf}</textarea>
                              </div>
                              <div class="modal-footer">
                                <button type="button"
                                    class="btn btn-default" data-dismiss="modal">Close</button>
                              </div>
                            </div>
                        </div>
                    </div>
                <form>
                    <div class="form-group">
                      <textarea class="setting-input rounded-0"
                      id="${sid(keys[idx])}" data="${keys[idx]}"></textarea>
                    </div>
                </form>
             </div>`).join('')}
            </div>`
}

var save_callback = {
    [TIMER]: function(){
        chrome.storage.sync.get((config) => {
            if(config[SWITCH_TIMER]){
                roomTabs((tabs) => {
                    if(tabs.length &&
                        confirm('TIMER configuration changed, do you want to restart now?')){
                        bcastTabs({ fn: rebind_alarms });
                        chrome.notifications.create({
                            type: "basic",
                            iconUrl: '/icon.png',
                            title: 'RESTART TIMER',
                            message: 'Configuration changed, Timer restarted on other tab'
                        });
                    }
                });
            }
        })
    }
}

setting_cache = {};

$(document).ready(()=>{
    var index = window.location.toString().split('#')[1]
    if(!index) index = 'menu0';
    $('#nav_pills').append(make_pills(Object.keys(settings), index));
    $('#tab_conts').append(make_tabs(settings, index));

    /* enable tab */
    $(document).delegate('.setting-input', 'keydown', function(e) {
        setTimeout(()=>{
            if(setting_cache[$(this).attr('id')] === $(this).val()){
                $(`#save-${$(this).attr('data')}`).hide();
                $(`#reset-${$(this).attr('data')}`).hide();
            }
            else{
                $(`#save-${$(this).attr('data')}`).show();
                $(`#reset-${$(this).attr('data')}`).show();
            }
        }, 100);

        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

            // put caret at right position again
            this.selectionStart =
                this.selectionEnd = start + 1;
        }
    });
    /* smart indent */
    var elts = Object.values(document.getElementsByClassName('setting-input'));
    for(e of elts){
        e.addEventListener('keyup', function(v){
            if(v.keyCode != 13 || v.shiftKey || v.ctrlKey || v.altKey || v.metaKey)
                return;
            var val = this.value, pos = this.selectionStart;
            var line = val.slice(val.lastIndexOf('\n', pos - 2) + 1, pos - 1);
            var indent = /^\s*/.exec(line)[0];
            if(!indent) return;
            var st = this.scrollTop;
            this.value = val.slice(0, pos) + indent + val.slice(this.selectionEnd);
            this.selectionStart = this.selectionEnd = pos + indent.length;
            this.scrollTop = st;
        }, false);
    }
    /* load or default for every field */
    chrome.storage.sync.get((res) => {
        for(e of Object.keys(settings)){
            $(`#${sid(e)}`).attr(
                'placeholder',
                settings[e].def_conf);
            if(res[`${sid(e)}`]){
                var val = settings[e].plain(res[`${sid(e)}`]);
                setting_cache[`${sid(e)}`] = val;
                $(`#${sid(e)}`).val(val);
                //$(`#save-${$(this).attr('data')}`).hide();
            }
            else{
                setting_cache[`${sid(e)}`] = '';
            }
        }
    });
    /* save function */
    $('.save-button').click(function(){
        var val = $(`#${sid($(this).attr('data'))}`).val();
        if(val.match(/^\s*$/)){
            $(this).hide();
            $(`#reset-${$(this).attr('data')}`).hide();
            chrome.storage.sync.remove(`${sid($(this).attr('data'))}`);
            setting_cache[`${sid($(this).attr('data'))}`] = val;
        }
        else try{
            settings[$(this).attr('data')].validate(val);
            $(this).hide();
            $(`#reset-${$(this).attr('data')}`).hide();
            chrome.storage.sync.set({
                [`${sid($(this).attr('data'))}`]:
                settings[$(this).attr('data')].store(val)
            });
            setting_cache[`${sid($(this).attr('data'))}`] = val;
            console.log($(this).attr('data'), save_callback);
            if($(this).attr('data') in save_callback)
                save_callback[$(this).attr('data')]();
        }
        catch(e){
            alert(e);
        }

    });
    /* reset function */
    $('.reset-button').click(function(){
        $(this).hide();
        $(`#save-${$(this).attr('data')}`).hide();
        $(`#${sid($(this).attr('data'))}`).val(setting_cache[`${sid($(this).attr('data'))}`]);
    });
});
