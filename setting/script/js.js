Interpreter.prototype.execute = function(callback){
  while(!this.timeout && this.step()){ }
  if(this.timeout){
    setTimeout(() => {
      this.timeout = 0;
      try{
        this.execute(callback);
      }
      catch(err){
        return console.log(err.message);
      }
    }, this.timeout);
  }
  else callback && callback(this.value);
}

function object_bind(interpreter,
  pobj, name, obj, ignore, recursive = true, asyncF = false){
  var dummy = interpreter.nativeToPseudo({});
  interpreter.setProperty(pobj, name, dummy);
  if(!recursive) return;
  for(let k in obj){
    if(ignore && ignore.includes(k)) continue;
    if(typeof obj[k] == 'object'){
      object_bind(interpreter, dummy, k, obj[k], ignore, recursive);
    }
    else if(typeof obj[k] == 'function'){
      if(asyncF) interpreter.setProperty(dummy, k,
        interpreter.createAsyncFunction(obj[k].bind(obj)));
      else interpreter.setProperty(dummy, k,
        interpreter.createNativeFunction(obj[k].bind(obj)));
    }
    else interpreter.setProperty(dummy, k, obj[k]);
  }
}

var init_func = function(interpreter, globalObject) {
  // Object.assign(globalObject, globalThis);

  interpreter.globalObject = globalObject;

  var pseudo_drrr = interpreter.nativeToPseudo({});
  interpreter.setProperty(globalObject, 'drrr', pseudo_drrr);
  for(let k in drrr){
    if(typeof drrr[k] == 'function'){
      interpreter.setProperty(pseudo_drrr, k,
        interpreter.createNativeFunction(drrr[k].bind(drrr)));
    }
    else interpreter.setProperty(pseudo_drrr, k, drrr[k]);
  }

  function function_bind(pobj, name, func){
    interpreter.setProperty(pobj, name,
      interpreter.createNativeFunction(func));
  }

  function async_function_bind(pobj, name, func){
    interpreter.setProperty(pobj, name,
      interpreter.createAsyncFunction(func));
  }

  object_bind(interpreter, globalObject, 'chrome', chrome,
    ['sendRequest', 'onRequest', 'onRequestExternal'], true);
  object_bind(interpreter, globalObject, 'localStorage', localStorage);
  object_bind(interpreter, globalObject, 'drrr', drrr);
  object_bind(interpreter, globalObject, 'console', console);
  function_bind(globalObject, 'print', console.log);
  function_bind(globalObject, 'log', log);
  // async_function_bind(globalObject, 'setTimeout', setTimeout);
  // async_function_bind(globalObject, 'setInterval', setInterval);
  function_bind(globalObject, 'sleep', function(time){ interpreter.timeout = time; } )

  // async_function_bind(globalObject, 'get', function(url, cb){
  //   $.ajax({
  //     type: "GET", url: url, dataType: 'json',
  //     success: function(data){ cb(data); },
  //     error: function(jxhr){ console.log("get fetch failed"); }
  //   });
  // });

  // async_function_bind(globalObject, 'post', function(url, data, cb){
  //   $.ajax({
  //     type: "POST", url: url, data: data, dataType: 'json',
  //     success: function(data){ cb(data); },
  //     error: function(jxhr){ console.log("post fetch failed"); }
  //   });
  // });

  // var wrapper = function getXhr(href, callback) {
  //   var req = new XMLHttpRequest();
  //   req.open('GET', href, true);
  //   req.onreadystatechange = function() {
  //     if (req.readyState === 4 && req.status === 200) {
  //       callback(req.responseText);
  //     }
  //   };
  //   req.send(null);
  // };
  // interpreter.setProperty(globalObject, 'getXhr',
  //     interpreter.createAsyncFunction(wrapper));



  // interpreter.setProperty(globalObject, 'global', dummyGlobal);
  // interpreter.setProperty(globalObject, 'globalThis', dummyGlobal);
};

function redef_log() {
  globalThis.log = console.log;
  var logger = document.getElementById('log');
  console.log = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] == 'object') {
        logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i]/*, undefined, 2*/) : arguments[i]) + '<br />';
      } else {
        logger.innerHTML += arguments[i] + '<br />';
      }
    }
    jQuery( function(){
      var pre = jQuery("#log");
      pre.scrollTop( pre.prop("scrollHeight") );
    });
  }
}

globalThis.pprint = function(){
  var logger = document.getElementById('log');
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
      logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
    } else {
      logger.innerHTML += (arguments[i]) + '<br />';
    }
  }
  jQuery( function(){
    var pre = jQuery("#log");
    pre.scrollTop( pre.prop("scrollHeight") );
  });
}

function show_bindings(){
  var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = {\n";
  var map = CodeMirror.keyMap.sublime;
  map['Ctrl-Enter'] = 'Execute Script'
  map['Ctrl-L'] = 'Clear Window'
  map['Ctrl-P'] = 'Pause Script'
  map['Ctrl-S'] = 'Save Script'
  for (var key in map) {
    var val = map[key];
    if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
      value += "  \"" + key + "\": \"" + val + "\",\n";
  }
  value += "}\n\n";
  console.log(value);
}

notify_web = false;

stringify = obj => {
  str = JSON.stringify(obj)
  if(obj === undefined)
    str = "undefined";
  else if(typeof obj == 'function')
    str = 'function' + (obj.name ? ' ' + obj.name : '');
  else if(str === undefined && obj.toString)
    str = obj.toString();
  else if(str === '{}' && obj.constructor
    && obj.constructor.name != 'Object')
    str = "[Object " + obj.constructor.name + "]"
  return str;
}

function interact(){
  if(!globalThis.machine){
    globalThis.machine = new Interpreter('', init_func);
  }
  code = $('#step').text();
  try {
    code = Babel.transform(code, {'presets': ['es2015']}).code;
    globalThis.machine.appendCode(code);
    globalThis.machine.execute(val => console.log(`=> ${stringify(val)}`));
  }
  catch(err){
    return console.log(err.message);
  }
  // val = machine.value;
  // console.log(`=> ${stringify(val)}`);
}

function execute(){
  code = globalThis.editor.getValue();
  try {
    code = Babel.transform(code, {'presets': ['es2015']}).code;
    code = preloaded_code(code);
    globalThis.machine = new Interpreter(code, init_func);
    log(code);
    globalThis.machine.execute(val => console.log(`=> ${stringify(val)}`));
  }
  catch(err){
    return console.log(err.message);
  }
  // val = machine.value;
  // console.log(`=> ${stringify(val)}`);
  if(!notify_web){
    chrome.tabs.query({
      url: 'https://drrr.com/*'
    }, (tabs) => {
      if(!tabs.length){
        console.log("no drrr.com tab exist, if you want to listen event, create one.")
        chrome.runtime.sendMessage({
          notification: {
            title: 'CLICK TO OPEN DRRR.COM',
            msg: 'open drrr.com to listen event',
            url: 'drrr_webpage'
          }
        });
      }
      notify_web = true;
    });
  }
}

function save_script(){
  chrome.storage.local.set({'lambdascript': globalThis.editor.getValue()},
    function(){
      chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: 'SCRIPT SAVED',
        message: 'Your lambdascript are saved to local storage'
      });
    });
}

function pause_script(){
  // globalThis.machine = PS.Main.execute(';')();
  // val = machine.value;
  chrome.notifications.create({
    type: "basic",
    iconUrl: '/icon.png',
    title: 'SCRIPT PAUSED',
    message: 'Your lambdascript are terminated'
  });
}

function clear_console(){
  var logger = document.getElementById('log');
  logger.innerHTML = "";
}

mirror = undefined;
mirrors = undefined;
local_modules = undefined;
show_chatroom = undefined;

function load_mirrors(mirror, mirrors){
  $('#mirror').empty();
  for(m in mirrors)
    $('#mirror').append(`<option value="${m}">${m}</option>`);
  load_index(mirrors[mirror].index)
}

function load_modules(modules){
  $('#module').empty();
  if(modules) for(s of modules)
    $('#module').append(`<option value="${s}">${s.substring(0, s.length - 3)}</option>`);
  $('#mirror').val(mirror)
}

function load_index(index){
  $('#category').empty();
  if(index) for(cat in index)
    $('#category').append(`<option value="${cat}">${cat}</option>`);
  load_modules(index ? index[$('#category').val()] : index);
}

function parse_index(raw_index){
  index = {}
  for(file of raw_index[0].contents)
    if(file.type == 'directory'){
      index[file.name] = []
      for(script of file.contents)
        if(script.name.endsWith('.js'))
          index[file.name].push(script.name);
    }
  return index;
}


function update_index(mirror, mirrors){
  if(mirror != 'Local')
    fetch(`https://${mirrors[mirror].loc}/bs-pkgs/raw/main/index.json`)
      .then(response => response.json())
      .catch(error => {
        if(mirror != 'Local') alert(`cannot fetch ${mirror}`);
        index = {}
        mirrors[mirror].index = index;
        chrome.storage.local.set({
          'bs-mirror': mirror,
          'bs-mirrors': mirrors,
        });
        load_index(index);
      })
      .then(index => {
        index = parse_index(index);
        mirrors[mirror].index = index;
        chrome.storage.local.set({
          'bs-mirror': mirror,
          'bs-mirrors': mirrors,
        });
        load_index(index);
      });
  else load_index(mirrors[mirror].index);
}

function install_module(){
  M = $('#mirror').val();
  c = $('#category').val();
  m = $('#module').val();
  if(M && c && m){
    fetch(`https://${mirrors[M].loc}/bs-pkgs/raw/main/${c}/${m}`)
      .then(response => response.text())
      .catch(error => {
        alert("cannot fetch module");
        console.log(String(error));
      })
      .then(code => {
        local_modules[`${c}/${m}`] = {load: false, code: code};
        cat = mirrors['Local'].index[c] || [];
        if(!cat.includes(m)) cat.push(m);
        mirrors['Local'].index[c] = cat;

        chrome.storage.local.set({
          'bs-mirrors': mirrors,
          'bs-installed': local_modules
        });
        load_local_modules(local_modules);
      })
  }
  else alert("invalid module path");
}

function load_module(){
  M = $('#mirror').val();
  c = $('#category').val();
  m = $('#module').val();
  if(M == 'Local' && c && m){
    globalThis.editor.setValue(local_modules[`${c}/${m}`].code)
  }
  else if(M && c && m){
    fetch(`https://${mirrors[M].loc}/bs-pkgs/raw/main/${c}/${m}`)
      .then(response => response.text())
      .catch(error => {
        alert("cannot fetch module");
        console.log(String(error));
      })
      .then(code => {
        globalThis.editor.setValue(code);
      })
  }
}

function bind_modal(){
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  $('#mirror-link').click(function(e){
    load_local_modules(local_modules);
    modal.style.display = "block";
    e.preventDefault();
  })

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function load_local_modules(installed, index){
  $('#local-modules').empty();
  for(name in installed){
    $('#local-modules').append(
      `<div>
       <label for="${name}"><input class="local-modules" type="checkbox" id="${name}" name="${name}" ${name in installed && installed[name].load ? "checked" : ""}>${name}</label>
     </div>`)
  }
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value)
      arr.splice(i, 1);
    else
      ++i;
  }
  return arr;
}

function remove_module(){
  for(mod of $('.local-modules')){
    if(mod.checked){
      [c, m] = mod.name.split('/')
      chrome.storage.local.remove(`env-${mod.name}`);
      delete local_modules[mod.name];
      removeItemAll(mirrors['Local'].index[c], m)
      if(!mirrors['Local'].index[c].length)
        delete mirrors['Local'].index[c]
    }
  }
  chrome.storage.local.set({
    'bs-mirrors': mirrors,
    'bs-installed': local_modules
  }, () => {
    if($('#mirror').val() == 'Local')
      load_index(mirrors['Local'].index);
    load_local_modules(local_modules);
  });
}

function save_module(){
  c = $('#category').val();
  m = $('#module').val();
  if(c && m){
    code = editor.getValue();
    local_modules[`${c}/${m}`].code = code;
    chrome.storage.local.set({
      'bs-installed': local_modules
    });
  }
}

function new_module(){
  name = prompt("input category/module (ex: game/guess_number)")
  if(!name || name == "null") return;
  if(name && name.trim()){
    name = name.trim();
    [c, m] = name.split('/')
    if(c) c = c.trim();
    if(m) m = m.trim();
    if(!m){ m = c; c = "misc" }
    m += '.js'
    local_modules[`${c}/${m}`] = {
      code: editor.getValue(),
      load: false
    };
    cat = mirrors['Local'].index[c] || [];
    if(!cat.includes(m)) cat.push(m);
    mirrors['Local'].index[c] = cat;

    chrome.storage.local.set({
      'bs-mirrors': mirrors,
      'bs-installed': local_modules
    });
    load_index(mirrors[mirror].index);
    load_local_modules(local_modules);
  }
  else alert("empty input");
}

function clear_module_env(){
  c = $('#category').val();
  m = $('#module').val();
  if(c && m){
    chrome.storage.local.remove(`env-${c}/${m}`);
  }
}

function preloaded_code(code){
  return `
var __hooks = {};
function add_hook(types, callback){
  if(!Array.isArray(types)) types = [types]
  for(var i = 0; i < types.length; i++){
    type = types[i];
    __hooks[type] = __hooks[type] || [];
    __hooks[type].push(callback);
  }
}
function __hook(name, msg, url, trip, req){
  var cbs = __hooks[req.type];
  if(cbs) cbs.forEach(function(cb){ cb(name, msg, url, trip, req); })
}
${code}`;
  // for(n in local_modules)
  //   if(local_modules[n].load) pre += "\n" + local_modules[n].code;
  // return pre + code;
}


function save_preload_module(){
  for(mod of $('.local-modules')){
    local_modules[mod.name].load = mod.checked;
  }
  chrome.storage.local.set({
    'bs-installed': local_modules
  });
}

function module_button_display(){
  if(mirror == 'Local'){
    $('#module-install').hide();
    $('#mirror-update').hide();
    $('#module-save').show();
    $('#module-new').show();
    $('#module-clear-env').show();
  }
  else{
    $('#module-install').show();
    $('#mirror-update').show();
    $('#module-save').hide();
    $('#module-new').hide();
    $('#module-clear-env').hide();
  }
}

function add_mirror(alias, repo){
  // 'GitHub': { loc: 'github.com/DrrrChatbots' }
  if(!alias || !repo){
    input = prompt("ex: GitHub:github.com/DrrrChatbots");
    if(!input) return;
    [alias, repo] = input.split(":");
    alias = alias.trim();
    repo = repo.trim();
  }
  if(alias && repo){
    mirrors[alias] = {loc: repo};
    chrome.storage.local.set({
      'bs-mirrors': mirrors
    });
    load_mirrors(mirror, mirrors);
  }
  else alert("invalid format");
}

function del_mirror(alias){
  if(!alias) alias = prompt("input mirror name");
  if(alias === "Local"){
    alert("cannot delete local");
    return;
  }
  if(alias in mirrors){
    if(mirror == alias)
      mirror = "Local";
    delete mirrors[alias]
    chrome.storage.local.set({
      'bs-mirror': mirror,
      'bs-mirrors': mirrors
    });
    load_mirrors(mirror, mirrors);
  }
  else alert("mirror not existed");
}

function set_modules(config){
  show_chatroom = config['show-chatroom'] === undefined ? true : config['show-chatroom'];

  if(show_chatroom)
    $('#iframe-container').append('<iframe class="drrr" src="https://drrr.com/"></iframe>');
  $('#iframe-room').toggle(show_chatroom);

  $('.toggle-room').click(function(e){
    e.preventDefault();
    if(show_chatroom)
      $('#iframe-container').empty();
    else
      $('#iframe-container').append('<iframe class="drrr" src="https://drrr.com/"></iframe>');
    show_chatroom = !show_chatroom;
    $('#iframe-room').toggle(show_chatroom);
    if(show_chatroom){
      $('#iframe-room').css({
        'top': '0%',
        'left': '',
        'right': '0px',
      });
    }
    chrome.storage.local.set({ 'show-chatroom': show_chatroom })
  })

  mirrors = config['bs-mirrors'];

  if(!mirrors){
    mirrors = {
      'Local': {
        loc: 'none',
        index: {}
      },
      'GitHub': {
        loc: 'github.com/DrrrChatbots'
      },
      'Gitee': {
        loc: 'gitee.com/DrrrChatbots'
      }
    }
    chrome.storage.local.set({
      'bs-mirrors': mirrors
    });
  }

  mirror = config['bs-mirror'];

  if(!mirror){
    mirror = 'Local'
    chrome.storage.local.set({
      'bs-mirror': mirror
    });
  }

  load_mirrors(mirror, mirrors);
  module_button_display();

  //$('#mirror-link').attr('href', `https://${mirrors[mirror]}/bs-pkgs`)

  $('#category').change(function(){
    load_modules(mirrors[mirror].index[[this.value]]);
  });

  $('#mirror').change(function(){
    mirror = this.value;
    module_button_display();
    load_index(mirrors[mirror].index);
    chrome.storage.local.set({
      'bs-mirror': mirror
    });
  });

  $('#mirror-update').click(function(){
    update_index($('#mirror').val(), mirrors)
  })

  $('#module-install').click(function(){
    install_module();
  })

  $('#module-load').click(function(){
    load_module();
  })

  $('#module-remove').click(function(){
    remove_module();
  })

  $('#module-save').click(function(){
    save_module();
  })

  $('#module-new').click(function(){
    new_module();
  })

  $('#module-clear-env').click(function(){
    clear_module_env();
  })

  $('#module-preload').click(function(){
    save_preload_module();
  })

  local_modules = config['bs-installed'] || {};
  load_local_modules(local_modules);
}

function bind_manual(){
  $('#intro').click(() => {
    var language = window.navigator.userLanguage || window.navigator.language;
    if(language == 'zh-CN' || language == 'zh-TW')
      chrome.tabs.create({url: chrome.extension.getURL('manuals/script-zh.html')});
    else
      chrome.tabs.create({url: chrome.extension.getURL('manuals/script-en.html')});
  })
}

$(document).ready(function(event) {


  $(".draggable").draggable({
    iframeFix: true,
    start: function(event, ui) {
       $('.frameOverlay').show();
     },
     stop: function(event, ui) {
      $(".frameOverlay").hide();
     }
  });

  $( "#iframe-room" ).resizable();

  bind_manual();
  bind_modal();

  chrome.storage.local.get(['lambdascript', 'bs-mirror', 'bs-mirrors', 'show-chatroom', 'bs-installed'], (config) => {

    set_modules(config);

    globalThis.editor = CodeMirror(document.getElementById("code-editor"), {
      value: config['lambdascript'] ? config['lambdascript'] : 'print("hello world")',
      lineNumbers: true,
      mode: "javascript",
      keyMap: "sublime",
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      theme: "monokai",
      tabSize: 2,
      extraKeys: {
        "Ctrl-Enter": function(instance) {
          execute();
        },
        "Ctrl-L": function(instance) {
          clear_console();
        },
        "Ctrl-P": function(instance) {
          pause_script();
        },
        "Ctrl-S": function(instance) {
          save_script();
        }
      }
    });
    $('#execute').click(function(){
      execute();
    });
    $('#clear').click(function(){
      clear_console();
    });
    $('#stop').click(pause_script);
    $('#save').click(save_script);

    document.getElementById("show-bindings").addEventListener("click",function(e){
      show_bindings();
    },false);
    $("#step").on("keydown", function(e){
      if(e.which == 13 && e.ctrlKey){
        interact();
        $('#step').text('');
        return false;
      }
      else if(e.which == 76 && e.ctrlKey){
        clear_console();
        return false;
      }
      else if(e.which == 83 && e.ctrlKey){
        save_script();
      }
      else if(e.which == 80 && e.ctrlKey){
        pause_script();
        return false;
      }
    });
    redef_log();
  });
});

function js_event_action(event, config, req){

  if(!globalThis.machine) return;

  object_bind(globalThis.machine,
    globalThis.machine.globalObject, '_req', req);

  try {
    globalThis.machine.appendCode(
      `typeof __hook != 'undefined' &&
        __hook(_req.user, _req.text, _req.url, _req.trip, _req)`);
    globalThis.machine.execute(/*val => console.log(`=> ${stringify(val)}`)*/);
  }
  catch(err){
    return console.log(err.message);
  }
}
