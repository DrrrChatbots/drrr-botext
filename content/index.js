if(!isLockedUser){
  $(document).ready(function(){
    chrome.runtime.sendMessage({ clearNotes: true, pattern:'' });
    //'https://drrr.com/room/.*'
    chrome.storage.sync.get(
      ['profile', 'cookie'],
      (config)=>{
        console.log(config);
        if(config['profile'] && config['cookie']){
          chrome.runtime.sendMessage(
            { setCookies: true, cookies: config['cookie'] }
          )
        }
        else if(config['profile'] || config['cookie']){
          chrome.storage.sync.remove(['profile', 'cookie']);
        }
      }
    );
    chrome.storage.local.get('plugins', (config)=>{
      if(config['plugins']){
        Object.keys(config['plugins']).forEach(name => {
          let [mode, loc, enable, ctx] = config['plugins'][name];
          if(enable && loc == "login"){
            if(mode == 'url') plugTag('script', { src: ctx, })
            else plugTag('script', { textContent: ctx, })
          }
          //else alert(enable, loc)
        })
      }
    });
  });

  chrome.runtime.onMessage.addListener((req, sender, callback) => {
    if(req.cookieDone){
      ajaxProfile(function(p, err){
        if(p) window.location.href = "https://drrr.com/lounge/";
        else{
          //alert(`Bio Expired ${JSON.stringify(err)}`);
          chrome.storage.sync.remove(['profile', 'cookie']);
          chrome.runtime.sendMessage({expired_bio: true});
        }
      }, true, 'login');
    }
  });
}
