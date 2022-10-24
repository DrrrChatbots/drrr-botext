/* setting.html */

var language = window.navigator.userLanguage || window.navigator.language;
var examples = []

const defaultViewType = 'text';
const settingType = window.location.pathname.split('/').slice(-2)[0]

import(`/manuals/manual-${(language == 'zh-CN' || language == 'zh-TW') ? 'zh' : 'en'}.js`).then((module)=>{
  var manual = module.manual;
  var infos = `
<li><a id="discard_settings" title="discard all setting"><i class="glyphicon glyphicon-refresh"></i></a></li>
<li><a id="discard_envvars" title="discard all environment variables"><i class="glyphicon glyphicon-floppy-remove"></i></a></li>
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
      chrome.storage[settingType].set(config, function(){
        $.notify("Config Updated", 'success');
        location.reload();
      });
    }
    catch(err){
      $.notify(String(err), 'error');
    }
  }

  function make_pills(ps, index){
    var language = window.navigator.userLanguage || window.navigator.language;
    $('#docURL').attr('href', chrome.extension.getURL(module.doc_url));
    return `${Object.keys(ps).map(
                  (idx) => `<li ${(`menu${idx}` === index ? `class="active"` : '')}>
                                <a class="nav-pill" data-toggle="pill" href="#menu${idx}">
                                    ${ps[idx]}
                                </a>
                              </li>`).join('')}`;
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

      examples = descs.map(
        desc => desc.parent().find(`h4[data-id="${module.ex_name}"]`).map(
        function(){ return $(this).nextAll('pre').first().text() }).get()[0]
      );

      let getViewType = id => localStorage.getItem(id)

      let ViewButtons = id => {
        let viewType = localStorage.getItem(`viewType-${id}`) || defaultViewType;
        let textViewStyle = viewType == 'text' ? `` : `style="display:none"`;
        let formViewStyle = viewType == 'form' ? `` : `style="display:none"`;
        return `
          <button type="button" ${formViewStyle}
                  class="btn btn-success btn-sm
                  ${id}-cfg-view ${id}-form-cfg-view cfg-view-set"
                  settype="${id}" viewtype="text">
                  <i class="glyphicon glyphicon-text-size"></i>
                  &nbsp;&nbsp;Text View
          </button>
          <!-- TODO complete form view setting
          <button type="button" ${textViewStyle}
                  class="btn btn-success btn-sm
                  ${id}-cfg-view ${id}-text-cfg-view cfg-view-set"
                  settype="${id}" viewtype="form">
                  <i class="glyphicon glyphicon-list-alt"></i>
                  &nbsp;&nbsp;Form View
          </button>
          -->
          `;
      }

      let ConfigViews = id => {
        let viewType = localStorage.getItem(`viewType-${id}`) || defaultViewType;
        let textViewStyle = viewType == 'text' ? `` : `style="display:none"`;
        let formViewStyle = viewType == 'form' ? `` : `style="display:none"`;
        return `
          <div class="${id}-cfg-view ${id}-text-cfg-view" ${textViewStyle}>
            <textarea class="setting-input rounded-0"
            rows="12" style="width:100%;"
            id="${sid(id)}"
            data="${id}"></textarea>
          </div>
          <div class="formblock-container
                      ${id}-cfg-view ${id}-form-cfg-view" ${formViewStyle}>


            <button style="width:45%"><i class="glyphicon glyphicon-import"></i></button>
            <button style="width:45%"><i class="glyphicon glyphicon-edit"></i></button>

            <hr>

            <div class="config-row">
            <button style="width:45%"><i class="glyphicon glyphicon-paste"></i></button>
            <button style="width:45%">
              <i class="glyphicon glyphicon-question-sign"></i></button>
            </div>

            <div class="config-row">
              <button><i class="glyphicon glyphicon-trash"></i></button>
              <select data-placeholder="Select a event" multiple class="chosen-select" name="test">
                <option>氣泡</option>
                <option>小字</option>
                <option>私信</option>
                <option>音樂</option>
                <option>Sloth Bear</option>
                <option>Sun Bear</option>
                <option>Polar Bear</option>
                <option>Spectacled Bear</option>
              </select>
              <input type="text" placeholder="user">
              <input type="text" placeholder="cont">

              <button><i class="glyphicon glyphicon-duplicate"></i></button>
            </div>

            <div class="config-row">

              <button><i class="glyphicon glyphicon-erase"></i></button>

              <select data-placeholder="func">
                <option>發訊息</option>
                <option>播音樂</option>
                <option>踢人</option>
              </select>

              <input type="text" placeholder="args">
              <input type="text" placeholder="args">

            <button><i class="glyphicon glyphicon-copy"></i></button>

            </div>

            <!--
            <div class="config-row">
              <input type="text" placeholder="args">
              <input type="text" placeholder="args">
              <input type="text" placeholder="args">
              <input type="text" placeholder="args">
              <input type="text" placeholder="args">
              <input type="text" placeholder="args">
            </div>
            -->

            <div class="config-row">
            <button style="width:45%"><i class="glyphicon glyphicon-minus"></i></button>
            <button style="width:45%"><i class="glyphicon glyphicon-plus"></i></button>
            </div>
            <hr>
          </div>`;
      }

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
                                <button id="default-${keys[idx]}" type="button"
                                        data="${keys[idx]}"
                                        class="btn btn-secondary btn-sm default-button">
                                         DEFAULT
                                </button>
                                <div class="${keys[idx]}-edited wrapper">
                                ${ViewButtons(keys[idx])}
                                </div>
                                <div class="${keys[idx]}-editing wrapper"
                                     style="display:none;">
                                  <button type="button" id="reset-${keys[idx]}"
                                  class="btn btn-warning btn-sm reset-button"
                                  data="${keys[idx]}">
                                           RESET
                                  </button>
                                  <button type="button" id="save-${keys[idx]}"
                                  class="btn btn-danger btn-sm save-button"
                                  data="${keys[idx]}">
                                           SAVE!
                                  </button>
                                </div>
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
                              </div>
                              <div class="modal-footer">
                                <button type="button"
                                    class="btn btn-default" data-dismiss="modal">Close</button>
                              </div>
                            </div>
                        </div>
                    </div>
                <form>
                    ${ConfigViews(keys[idx])}
                </form>
             </div>`).join('')}
            </div>`);
    });
  }

  var save_callback = {
    [TIMER]: function(){
      chrome.storage[settingType].get((config) => {
        if(config[SWITCH_TIMER]){
          roomTabs((tabs) => {
            if(tabs.length &&
              confirm('TIMER configuration changed, do you want to restart now?')){
              bcastTabs({ fn: rebind_alarms, args: { type: settingType } });
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

  function discard_settings(){
    if(confirm("Discard Settings?")){
      chrome.storage[settingType].get(config => {
        let names = Object.keys(config).filter(k => k.endsWith("-setting"))
        chrome.storage[settingType].remove(names, () => { $.notify("ok", 'success') });
      });
      location.reload();
    }
  }

  function discard_envvars(){
    if(confirm("Discard Environment Variables?")){
      chrome.storage.local.get(config => {
        let names = Object.keys(config).filter(k => k.startsWith("env-"))
        names.push('inline-env')
        chrome.storage.local.remove(names, () => { $.notify("ok", 'success') });
      });
    }
  }

  setting_cache = {};

  $(document).ready(() => {
    $.notify.defaults({globalPosition: 'bottom right'})
    let index = window.location.toString().split('#')[1]
                 || localStorage.getItem(`last-${settingType}-menu`) || 'menu0';

    $(`#nav-${settingType}`)
      .addClass('dropdown')
      .addClass('active')

    $(`#nav-${settingType} > a`)
      .attr('href', '#')
      .addClass('dropdown-toggle')
      .attr('data-toggle', 'dropdown')
      .append(` <b class="caret"></b>`);

    onReady(index);
  });

  let onReady = (index) => {

    $('#about_popup').append(module.infopop);

    $(`#${settingType}-pills`).prepend(make_pills(Object.keys(settings), index));

    $('.nav-pill').click(function(){
      localStorage.setItem(`last-${settingType}-menu`, this.href.split('#')[1]);
    });

    $("#discard_settings").click(discard_settings);
    $("#discard_envvars").click(discard_envvars);

    make_tabs(settings, index, function(cont){
      $('#tab_conts').append(cont);

      $(".chosen-select").chosen({
        no_results_text: "Oops, nothing found!"
      })

      document.getElementById('file-input')
              .addEventListener('change', readSingleFile, false);

      $("#export").click(function(){
        chrome.storage[settingType].get((res)=>{
          download(`${settingType}-config.json`, JSON.stringify(res, undefined, 2));
        });
      });

      $('.cfg-view-set').click(function(){
        let settype = this.getAttribute('settype')
        let viewtype = this.getAttribute('viewtype')

        localStorage.setItem(`viewType-${settype}`, viewtype)

        $(`.${settype}-cfg-view`).hide();
        $(`.${settype}-${viewtype}-cfg-view`).show();
      });

      /* enable tab */
      $(document).delegate('.setting-input', 'keydown', function(e) {
        setTimeout(()=>{
          if(setting_cache[$(this).attr('id')] === $(this).val()){
            $(`.${$(this).attr('data')}-editing`).hide();
            $(`.${$(this).attr('data')}-edited`).show();
          }
          else{
            $(`.${$(this).attr('data')}-editing`).show();
            $(`.${$(this).attr('data')}-edited`).hide();
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

      $('#music_delay').on('input focus',function(e){
        if(!isNaN(Number($(this).val()))){
          chrome.storage.sync.set({
            [MUSIC_DELAY]: $(this).val()
          })
        } else {
          $.notify('Please input number', 'error');
          $(this).val('');
        }
      });

      /* load or default for every field */
      chrome.storage[settingType].get((res) => {

        $('#music_delay').val(res[MUSIC_DELAY] ?
          res[MUSIC_DELAY] : DEFAULT_DELAY);

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

      $('.default-button').click(function(){
        var val = $(`#${sid($(this).attr('data'))}`).attr('placeholder');
        $(`#${sid($(this).attr('data'))}`).val(val.trim()).keydown();
      });

      /* save function */
      $('.save-button').click(function(){
        var val = $(`#${sid($(this).attr('data'))}`).val();
        if(val.match(/^\s*$/)){
          $(`.${$(this).attr('data')}-editing`).hide();
          $(`.${$(this).attr('data')}-edited`).show();
          chrome.storage[settingType].remove(`${sid($(this).attr('data'))}`);
          setting_cache[`${sid($(this).attr('data'))}`] = '';
          $(`#${sid($(this).attr('data'))}`).val('')
          /* close switch */
          settings[$(this).attr('data')].empty_cbk(settingType);
        }
        else try{
          settings[$(this).attr('data')].validate(val);
          chrome.storage[settingType].set({
            [`${sid($(this).attr('data'))}`]:
            settings[$(this).attr('data')].store(val)
          }, () => {
            if(chrome.runtime.lastError){
              $.notify(chrome.runtime.lastError.message, 'error');
            }
            else{
              $(`.${$(this).attr('data')}-editing`).hide();
              $(`.${$(this).attr('data')}-edited`).show();
              setting_cache[`${sid($(this).attr('data'))}`] = val;
              settings[$(this).attr('data')].save_cbk(settingType);
            }
          });
          //console.log($(this).attr('data'), save_callback);
          //if($(this).attr('data') in save_callback)
          //    save_callback[$(this).attr('data')]();
          /* open switch */
        }
        catch(e){
          $.notify(e, 'error');
        }

      });
      /* reset function */
      $('.reset-button').click(function(){

        $(`.${$(this).attr('data')}-editing`).hide();
        $(`.${$(this).attr('data')}-edited`).show();

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
    })
  }
});
