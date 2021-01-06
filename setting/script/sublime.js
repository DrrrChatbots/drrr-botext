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

function execute(){
  code = globalThis.editor.getValue();
  if(code.trim().length === 0) code =';'
  result = PS.Main.execute(code)();
  val = result.val;
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

$(document).ready(function(event) {

  chrome.storage.local.get('botscript', (config) => {
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
    $('#script').append('<pre id="log"></pre>');
    redef_log();
  });
});
