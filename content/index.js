$(document).ready(function(){
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
