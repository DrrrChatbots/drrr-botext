function log2mkd(type, e){
  //type, user, text, url
  console.log('log data', e);
  if(type === event_msg)
    return `*${e.user}*: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === event_me)
    return `_${e.user}_: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === event_dm)
    return `${e.user}: ${e.text}${e.url? ` [URL](${e.url})`: ''}`
  if(type === event_join)
    return `${e.user} join the room`
  if(type === event_leave)
    return `${e.user} leave the room`
  if(type === event_newhost)
    return `${e.user} become the room owner`
}

const ts = [event_msg, event_me, event_dm, event_join, event_leave, event_newhost];
export const event_action = (req, config) => {
  const MODULE_NAME = "ChatLog";
  if(ts.indexOf(req.type) >= 0){
    //alert(log2mkd(event_msg, req));
    chrome.storage.local.get(MODULE_NAME, (config)=>{
      if(!config[MODULE_NAME])
        config[MODULE_NAME] = [];
      config[MODULE_NAME].push([req.type, req.user, req.text, req.url]);
      chrome.storage.local.set({
        [MODULE_NAME]: config[MODULE_NAME]
      });
    });
  }
};
