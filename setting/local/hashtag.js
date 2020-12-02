
export const event_action = (req, config) => {
  const MODULE_NAME = "Hashtag";
  var type = req.type;
  if(type == event_msg){
    var reg = /#[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\u3131-\uD79D]+/g, result;
    var pure = req.text.replace(reg, '').trim();
    if(!pure.length) return;
    while((result = reg.exec(req.text)) !== null) {
      chrome.storage.local.get(MODULE_NAME, ((r)=>
        (config)=>{
          if(!config[MODULE_NAME])
            config[MODULE_NAME] = {};
          var list = config[MODULE_NAME][r] || [];
          list.push(pure);
          config[MODULE_NAME][r] = list;
          chrome.storage.local.set({
            [MODULE_NAME]: config[MODULE_NAME]
          });
        })(result));
    }
  }
};
