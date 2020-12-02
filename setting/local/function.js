const nothing = ()=>{};
var local_functions = {
  "Hashtag": {
    validate: (data) => { return true; },
    plain: dict_plain,
    load: (d) => d,
    store: dict_store,
    empty_cbk: nothing,
    save_cbk: nothing,
    module_file: 'hashtag.js'
  },
  "ChatLog": {
    validate: (data) => { return true; },
    plain: rule_plain,
    load: (d) => d,
    store: rule_store,
    empty_cbk: nothing,
    save_cbk: nothing,
    module_file: 'chatlog.js'
  },
};
