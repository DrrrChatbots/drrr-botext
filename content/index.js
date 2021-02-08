$(document).ready(function(){
  chrome.runtime.sendMessage({ clearNotes: true, pattern:'' });
  //'https://drrr.com/room/.*'
  chrome.storage.sync.get(
    ['profile', 'cookie'],
    (config)=>{
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
});

chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if(req.cookieDone){
    ajaxProfile(function(p, err){
    if(p) location.reload()
    else{
      alert(`Bio Expired ${JSON.stringify(err)}`);
      chrome.storage.sync.remove(['profile', 'cookie']);
      chrome.runtime.sendMessage({expired_bio: true});
    }
  }, true, 'login');
  }
});
