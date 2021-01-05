document.addEventListener("DOMContentLoaded", function(event) {
CodeMirror.commands.save = function(){ alert("Saving"); };
      var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "text/x-csrc",
        keyMap: "vim",
        matchBrackets: true,
        showCursorWhenSelecting: true
      });
      var commandDisplay = document.getElementById('command-display');
      var keys = '';
      CodeMirror.on(editor, 'vim-keypress', function(key) {
        keys = keys + key;
        commandDisplay.innerText = keys;
      });
      CodeMirror.on(editor, 'vim-command-done', function(e) {
        keys = '';
        commandDisplay.innerHTML = keys;
      });
      var vimMode = document.getElementById('vim-mode');
      CodeMirror.on(editor, 'vim-mode-change', function(e) {
        vimMode.innerText = JSON.stringify(e);
      });

});
