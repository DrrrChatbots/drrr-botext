
export const event_action = (req, config, sender, pre_event_action) => {
  const MODULE_NAME = EVENTACT;
  const MODULE_SETTING = sid(MODULE_NAME);
  var type = req.type;
  chrome.storage.local.get(MODULE_SETTING, (config)=>{
    if(!config[MODULE_SETTING]) return;
    event_events.forEach(et => {
      pre_event_action(et, config, req)
    })
  });
};
