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
    globalThis.machine = PS.Main.newMachine();
  }
  code = $('#step').text();
  globalThis.machine = PS.Main.interact(globalThis.machine)(code)()
  val = machine.val;
  console.log(`=> ${stringify(val)}`);
}

function execute(){
  code = globalThis.editor.getValue();
  globalThis.machine = PS.Main.execute(code)();
  val = machine.val;
  console.log(`=> ${stringify(val)}`);
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
  chrome.storage.local.set({'botscript': globalThis.editor.getValue()},
    function(){
      chrome.notifications.create({
        type: "basic",
        iconUrl: '/icon.png',
        title: 'SCRIPT SAVED',
        message: 'Your botscript are saved to local storage'
      });
    });
}

function pause_script(){
  PS.Main.execute(';')();
  chrome.notifications.create({
    type: "basic",
    iconUrl: '/icon.png',
    title: 'SCRIPT PAUSED',
    message: 'Your botscript are terminated'
  });
}

function clear_console(){
  var logger = document.getElementById('log');
  logger.innerHTML = "";
}

mirror = undefined;
mirrors = undefined;
show_chatroom = undefined;

function load_mirrors(mirror, mirrors){
  for(m in mirrors){
    $('#mirror').append(`<option value="${m}">${m}</option>`);
  }
  if(!mirrors[mirror].index)
    update_index(mirror, mirrors);
  else load_index(mirrors[mirror].index)
}

function load_modules(modules){
  $('#module').empty();
  if(modules) for(s of modules)
    $('#module').append(`<option value="${s}">${s.substring(0, s.length - 3)}</option>`);
}

function load_index(index){
  $('#category').empty();
  for(cat in index)
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

function load_module(){
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

$(document).ready(function(event) {

  bind_modal();

  chrome.storage.local.get(['botscript', 'bs-mirror', 'bs-mirrors', 'show-chatroom'], (config) => {

    show_chatroom = config['show-chatroom'] === undefined ? true : config['show-chatroom'];

    if(show_chatroom)
      $('#iframe-container').append('<iframe class="drrr" src="https://drrr.com/"></iframe>');

    $('#show-room').click(function(e){
      e.preventDefault();
      if(show_chatroom)
        $('#iframe-container').empty();
      else
        $('#iframe-container').append('<iframe class="drrr" src="https://drrr.com/"></iframe>');
      show_chatroom = !show_chatroom;
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
    $('#mirror-link').attr('href', `https://${mirrors[mirror]}/bs-pkgs`)

    $('#category').change(function(){
      load_modules(mirrors[mirror].index[[this.value]]);
    });

    $('#mirror').change(function(){
      load_index(mirrors[this.value].index);
    });

    $('#mirror-update').click(function(){
      update_index($('#mirror').val(), mirrors)
    })

    $('#module-install').click(function(){
      //update_index($('#mirror').val(), mirrors)
    })

    $('#module-load').click(function(){
      //update_index($('#mirror').val(), mirrors)
      //globalThis.editor.setValue()
      load_module();
    })

    globalThis.editor = CodeMirror(document.body.getElementsByTagName("article")[0], {
      value: config['botscript'] ? config['botscript'] : 'print("hello world")',
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
    $('#script').append('<span id="step" style="padding: 1px 1px 1px 1px;" class="textarea log" role="textbox" contenteditable></span>');
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
    $('#script').append('<pre id="log" class="log"></pre>');
    redef_log();
  });
});
