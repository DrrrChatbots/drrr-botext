/* setting.html */

$(document).ready(()=>{

});

chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){
    console.log(req);
    console.log(JSON.stringify(sender))
  }
  else if(sender.url.match(new RegExp('https://drrr.com/lounge'))){
    console.log(req);
    console.log(JSON.stringify(sender))
  }
  if(callback){
    //alert(JSON.stringify(req));
    //console.log(JSON.stringify(req))
    //callback();
  }
})
