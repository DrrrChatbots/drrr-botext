
export const event_action = (req, config) => {
  const MODULE_NAME = "Hashtag";
  const MODULE_SETTING = sid(MODULE_NAME);
  var type = req.type;
  if(type == event_msg){
    var reg = /#[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\u3131-\uD79D]+/g, result;
    var pure = req.text.replace(reg, '').trim();
    if(!pure.length) return;
    while((result = reg.exec(req.text)) !== null) {
      // chrome.storage.local.get(MODULE_SETTING,
      ((r)=>
        // (config)=>
        {
          if(!config[MODULE_SETTING])
            config[MODULE_SETTING] = {};
          var list = config[MODULE_SETTING][r] || [];
          list.push(pure);
          config[MODULE_SETTING][r] = list;
          chrome.storage.local.set({
            [MODULE_SETTING]: config[MODULE_SETTING]
          }, function(){
            if(chrome.runtime.lastError)
              $.notify("HashTag is full!", 'error');
          });
        }
      )(result)
      // );
    }
  }
};
