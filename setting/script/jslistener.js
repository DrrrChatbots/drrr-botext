chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){
    if(req && req.info)
      drrr.setInfo(req.info);
    if(req.start){
      drrr.getProfile();
      drrr.getLoc();
      drrr.getLounge();
    }
    else{
      globalThis.lastReq = req;
      js_event_action(req.type, {}, req);
    }
    //console.log(req);
    //console.log(JSON.stringify(sender))
  }
  else if(sender.url.match(new RegExp('https://drrr.com/lounge'))){
    if(req.start){
      drrr.getProfile();
      drrr.getLoc();
      drrr.getLounge();
    }
    getProfile(profile=>{
      req.type = event_lounge;
      req.host = false;
      req.user = profile.name;
      req.trip = profile.tripcode;
      req.text = '';
      req.url = '';
      globalThis.lastReq = req;
      js_event_action(req.type, {}, req);
    })
    //console.log(req);
    //console.log(JSON.stringify(sender))
  }
  if(callback){
    //alert(JSON.stringify(req));
    //console.log(JSON.stringify(req))
    //callback();
  }
})
