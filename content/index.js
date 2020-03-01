$(document).ready(function(){
    chrome.runtime.sendMessage({ clearNotes: true, pattern:'' });
    //'https://drrr.com/room/.*'
    chrome.storage.sync.get(
        ['profile', 'cookie'],
        (config)=>{
            if(config['profile'] && config['cookie']){
                chrome.runtime.sendMessage(
                    { setCookies: true, cookies: config['cookie'] },
                    ()=>{ location.reload(); }
                )
            }
            else if(config['profile'] || config['cookie']){
                chrome.storage.sync.remove(['profile', 'cookie']);
            }
        }
    );
});
