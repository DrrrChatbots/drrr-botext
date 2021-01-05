/* setting.html */

$(document).ready(()=>{
  $('#execute').click(function(){
    if($('#script')) code = $('#script').val();
    else code = editor.getValue();
    alert(code);
    PS.Main.execute(code)();
  });
});
