document.addEventListener("DOMContentLoaded", function(event) {

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
          code = globalThis.editor.getValue();
          PS.Main.execute(code)();
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
      code = globalThis.editor.getValue();
      PS.Main.execute(code)();
    });
  $('#clear').click(function(){
    var logger = document.getElementById('log');
    logger.innerHTML = "";
  });
  $('#stop').click(function(){
    PS.Main.execute(';')();
  });

  (function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
          logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
          logger.innerHTML += arguments[i] + '<br />';
        }
      }
      jQuery( function(){
        var pre = jQuery("#log");
        pre.scrollTop( pre.prop("scrollHeight") );
      });
    }
  })();

  document.getElementById("show-bindings").addEventListener("click",function(e){
    show_bindings();
  },false);
});

  function show_bindings(){
    var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = {\n";
    var map = CodeMirror.keyMap.sublime;
    for (var key in map) {
      var val = map[key];
      if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
        value += "  \"" + key + "\": \"" + val + "\",\n";
    }
    value += "}\n\n";
    alert(value);
  }
