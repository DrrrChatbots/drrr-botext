chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if(sender.url.match(new RegExp('https://drrr.com/room/.*'))){
    if(req && req.info)
      updateInfo(req.info);
    if(req.start){
      updateProfile();
      updateLoc();
      updateLounge();
    }
    else{
      globalThis.lastReq = req;
      lambdascript_event_action(req.type, {}, req);
    }
    //console.log(req);
    //console.log(JSON.stringify(sender))
  }
  else if(sender.url.match(new RegExp('https://drrr.com/lounge'))){
    if(req.start){
      updateProfile();
      updateLoc();
      updateLounge();
    }
    updateProfile(()=>{
      req.type = event_lounge;
      req.host = false;
      req.user = profile.name;
      req.trip = profile.tripcode;
      req.text = '';
      req.url = '';
      globalThis.lastReq = req;
      lambdascript_event_action(req.type, {}, req);
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
