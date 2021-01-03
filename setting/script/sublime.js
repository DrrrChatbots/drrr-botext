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
  for (var key in map) {
    var val = map[key];
    if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
      value += "  \"" + key + "\": \"" + val + "\",\n";
  }
  value += "}\n\n";
  console.log(value);
}

function execute(){
  code = globalThis.editor.getValue();
  if(code.trim().length === 0) code =';'
  result = PS.Main.execute(code)();
  val = result.val;
  if(val !== undefined && val !== null){
    str = JSON.stringify(val);
    if(str === undefined){
      val = val.constructor.name;
    }
    else val = str;
  }
  console.log(`=> ${val}`);
}

$(document).ready(function(event) {

  var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = {\n";
  var map = CodeMirror.keyMap.sublime;
  for (var key in map) {
    var val = map[key];
    if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
      value += "  \"" + key + "\": \"" + val + "\",\n";
  }
  value += "}\n\n// The implementation of joinLines\n";
  value += CodeMirror.commands.joinLines.toString().replace(/^function\s*\(/, "function joinLines(").replace(/\n  /g, "\n") + "\n";
    globalThis.editor = CodeMirror(document.body.getElementsByTagName("article")[0], {
      value: 'print("hello world")',
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
          var logger = document.getElementById('log');
          logger.innerHTML = "";
        },
        "Ctrl-P": function(instance) {
          PS.Main.execute(';')();
        }
      }
    });

    $('#execute').click(function(){
      execute();
    });
  $('#clear').click(function(){
    var logger = document.getElementById('log');
    logger.innerHTML = "";
  });
  $('#stop').click(function(){
    PS.Main.execute(';')();
  });

  document.getElementById("show-bindings").addEventListener("click",function(e){
    show_bindings();
  },false);

  orig_print = drrr.print;
  drrr.print = function(){
    orig_print.apply(null, arguments);
    pre = $('#drrr');
    $('#iframe-container').after('<iframe id="drrr" src="https://drrr.com/"></iframe>');
    setTimeout(function(){
      pre.remove();
    }, 3000);
  }
  $('#script').append('<pre id="log"></pre>');
  redef_log();
});
