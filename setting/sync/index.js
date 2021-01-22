/* setting.html */

var language = window.navigator.userLanguage || window.navigator.language;
var examples = []

import(`/manuals/manual-${(language == 'zh-CN' || language == 'zh-TW') ? 'zh' : 'en'}.js`).then((module)=>{
  var manual = module.manual;
  var infos = (url) => `
<li><a href="https://nobodyzxc.github.io/drrr-botext-manual" target="_blank" title="online doc"><i class="glyphicon glyphicon-question-sign"></i></a></li>
<li><a href="${url}" target="_blank" title="local doc"><i class="glyphicon glyphicon-question-sign"></i></a></li>
<li><a data-toggle="modal" data-target="#info-modal" title="about developer"><i class="glyphicon glyphicon-info-sign"></i></a></li>
<li><a id="reset" title="reset all setting"><i class="glyphicon glyphicon-refresh"></i></a></li>
<li><a id="export" title="export setting"><i class="glyphicon glyphicon-export"></i></a></li>
<li><a><input title="import setting" type="file" id="file-input" /></a></li>
`

  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      displayContents(contents);
    };
    reader.readAsText(file);
  }

  function displayContents(contents) {
    var element = document.getElementById('file-content');
    try{
      config = JSON.parse(contents)
      chrome.storage.sync.set(config, function(){
        alert("config updated");
        location.reload();
      });
    }
    catch(err){
      alert(err);
    }
  }

  function make_pills(ps, index){
    console.log(ps);
    var language = window.navigator.userLanguage || window.navigator.language;
    var url = chrome.extension.getURL(module.doc_url);
    return `<ul class="nav nav-pills">
                ${Object.keys(ps).map(
                  (idx) => `<li ${(`menu${idx}` === index ? `class="active"` : '')}>
                                <a data-toggle="pill" href="#menu${idx}">
                                    ${ps[idx]}
                                </a>
                              </li>`).join('')}
                ${infos(url)}
            </ul>${module.infopop}`;
  }

  function make_tabs(tabs, index, cbk){
    var keys = Object.keys(tabs);
    $.get(chrome.extension.getURL(module.doc_url), function(data, status){
      descs = Object.keys(keys).map(idx => $(data).find(manual[keys[idx]].desc));
      for(desc of descs){
        desc.parent().find('a').each(function(index){
          if(this.getAttribute("href") && this.getAttribute("href").match(/^(#.*)/) !== null){
            this.setAttribute("href", this.getAttribute("href").replace(/^(#.*)/, chrome.extension.getURL(module.doc_url) + "$1"));
            this.setAttribute("target", "_blank");
          }
        })
      }

      examples = descs.map(desc => desc.parent().find(`h4[data-id="${module.ex_name}"]`).map(
        function(){ return $(this).nextAll('pre').first().text() }).get()[0]
      );

      cbk(`<div class="tab-content">
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
                                ${descs[idx].parent().html()}
                                <!-- <textarea disabled rows="${examples[idx].split('\n').length}" style="width:100%; height:100%">${manual[keys[idx]].def_conf}</textarea>-->
                                <!--<pre><code>${manual[keys[idx]].def_conf}</pre></code>-->
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
                      <textarea class="setting-input rounded-0" rows="12" style="width:100%;"
                      id="${sid(keys[idx])}" data="${keys[idx]}"></textarea>
                    </div>
                </form>
             </div>`).join('')}
            </div>`);
    });
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
                message: 'Configuration changed, Timer restarted tab'
              });
            }
          });
        }
      })
    }
  }

  function refresh_settings(){
    chrome.storage.sync.clear();
    location.reload();
  }

  setting_cache = {};

  $(document).ready(()=>{

    var index = window.location.toString().split('#')[1]
    if(!index) index = 'menu0';
    $('#nav_pills').append(make_pills(Object.keys(settings), index));

    make_tabs(settings, index, function(cont){
      $('#tab_conts').append(cont);

      $("#reset").click(refresh_settings);

      document.getElementById('file-input').addEventListener('change', readSingleFile, false);

      $("#export").click(function(){
        chrome.storage.sync.get((res)=>{
          download('sync-config.json', JSON.stringify(res, undefined, 2));
        });
      });

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
        Object.keys(settings).forEach((e, index)=>{
          $(`#${sid(e)}`).attr(
            'placeholder',
            examples[index]
            //manual[e].def_conf
          );
          if(res[`${sid(e)}`]){
            var val = settings[e].plain(res[`${sid(e)}`]);
            setting_cache[`${sid(e)}`] = val;
            $(`#${sid(e)}`).val(val);
            //$(`#save-${$(this).attr('data')}`).hide();
          }
          else{
            setting_cache[`${sid(e)}`] = '';
          }
        })
      });

      /* save function */
      $('.save-button').click(function(){
        var val = $(`#${sid($(this).attr('data'))}`).val();
        if(val.match(/^\s*$/)){
          $(this).hide();
          $(`#reset-${$(this).attr('data')}`).hide();
          chrome.storage.sync.remove(`${sid($(this).attr('data'))}`);
          setting_cache[`${sid($(this).attr('data'))}`] = '';
          $(`#${sid($(this).attr('data'))}`).val('')
          /* close switch */
          settings[$(this).attr('data')].empty_cbk();
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
          //console.log($(this).attr('data'), save_callback);
          //if($(this).attr('data') in save_callback)
          //    save_callback[$(this).attr('data')]();
          /* open switch */
          settings[$(this).attr('data')].save_cbk();
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

      /* quick regex test */
      function setIcon(s, icon){
        return $(s).removeClass('glyphicon-ok')
          .removeClass('glyphicon-warning-sign')
          .removeClass('glyphicon-remove')
          .addClass(icon);
      }

      function setStatus(s, status, title = ''){
        return $(s).removeClass('has-success')
          .removeClass('has-warning')
          .removeClass('has-error')
          .addClass(status)
          .attr('title', title);
      }

      $('.test-input').on('input focus',function(e){
        var valid = true,
          regex = $('#test-regex').val(),
          string = $('#test-string').val();
        try{
          regex = new RegExp(JSON.parse(`"${regex}"`));
        }
        catch(e){
          valid = false;
          setStatus('#test-string-status', 'has-warning', 'Please correct your RegExp');
          setIcon('#test-string-icon', 'glyphicon-warning-sign');
          setStatus('#test-regex-status', 'has-warning', e);
          setIcon('#test-regex-icon', 'glyphicon-warning-sign');
        }
        if(valid){
          setStatus('#test-regex-status', 'has-sucess');
          setIcon('#test-regex-icon', 'glyphicon-ok');
          if($('#test-string').val().match(regex)){
            setStatus('#test-string-status', 'has-sucess');
            setIcon('#test-string-icon', 'glyphicon-ok');
          }
          else{
            setStatus('#test-string-status', 'has-error', 'String not match the RegExp');
            setIcon('#test-string-icon', 'glyphicon-remove');
          }
        }
      });

      chrome.storage.sync.get((config)=>{
        $('#music_delay').val(config[MUSIC_DELAY] ? config[MUSIC_DELAY] : DEFAULT_DELAY);
      });

      $('#music_delay').on('input focus',function(e){
        if(!isNaN(Number($(this).val()))){
          chrome.storage.sync.set({
            [MUSIC_DELAY]: $(this).val()
          })
        } else {
          alert('Please input number');
          $(this).val('');
        }
      });
    })
  });
});
