$(document).ready(function(){
  chrome.storage.sync.get('#login-mode', (config)=>{
    $(this).val(config['#login-mode'])
    $('.home-name').append(`
      <select id="login-mode" name="conv_mode" class="home-name-input" style="width:100px" title="select login mode">
          <option value="Bot"     ${config['#login-mode'] == 'Bot' ? 'selected' : ''}  >bot</option>
          <option value="Tv"      ${config['#login-mode'] == 'Tv' ? 'selected' : ''}  >tv</option>
          <option value="Tablet"  ${config['#login-mode'] == 'Tablet' ? 'selected' : ''}  >tablet</option>
          <option value="Mobile"  ${config['#login-mode'] == 'Mobile' ? 'selected' : ''}  >phone</option>
          <option value="Desktop" ${config['#login-mode'] == 'Desktop' ? 'selected' : ''}  >desktop</option>
      </select>
    `)
  });

  $('.home-name').delegate('#login-mode', 'change', function(){
    chrome.storage.sync.set({'#login-mode': $(this).val()});
  });

  chrome.runtime.sendMessage({ clearNotes: true, pattern:'' });
  //'https://drrr.com/room/.*'
  chrome.storage.sync.get(
    ['profile', 'cookie'],
    (config)=>{
      if(config['profile'] && config['cookie']){
        chrome.runtime.sendMessage(
          { setCookies: true, cookies: config['cookie'] },
          ()=>{
            ajaxProfile(function(p){
              if(p) setTimeout(()=>location.reload(), 1000);
              else{
                alert("Bio Expired");
                chrome.storage.sync.remove(['profile', 'cookie']);
                chrome.runtime.sendMessage({expired_bio: true});
              }
            }, true, 'login');
          }
        )
      }
      else if(config['profile'] || config['cookie']){
        chrome.storage.sync.remove(['profile', 'cookie']);
      }
    }
  );
});
