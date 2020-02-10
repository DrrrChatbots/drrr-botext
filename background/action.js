
actions = {
    [action_msg ] : function(...msgs){
        if(msgs.length){
            setTimeout(
                () => sendTab({
                    fn: publish_message,
                    args: { msg: msgs[Math.floor(Math.random() * msgs.length)] }
                }), 1000);
        }
    },
    [action_umsg ] : function(url, ...msgs){
        if(url && msgs.length){
            setTimeout(
                () => sendTab({
                    fn: publish_message,
                    args: { 
                        url: url,
                        msg: msgs[Math.floor(Math.random() * msgs.length)] 
                    }
                }), 1000);
        }
    },
    [action_dm  ] : function(user, ...msgs){
        if(msgs.length){
            setTimeout(
                () => sendTab({
                    fn: dm_member,
                    args: { 
                        user: user, 
                        msg: msgs[Math.floor(Math.random() * msgs.length)] 
                    }
                }), 1000);
        }
    },
    [action_udm ] : function(user, url, ...msgs){
        if(url && msgs.length){
            setTimeout(
                () => sendTab({
                    fn: dm_member,
                    args: {
                        user: user,
                        url: url,
                        msg: msgs[Math.floor(Math.random() * msgs.length)]
                    }
                }), 1000);
        }
    },
    [action_kick] : function(user){
        setTimeout(
            () => sendTab({
                fn: kick_member,
                args: { user: user }
            }), 500)
    },
    [action_plym] : function(song){
        play_search(
            get_music.bind(null, song), 
            (msg) => sendTab({ 
                fn: publish_message, 
                args: { msg: msg } 
            })
        )
    },
    [action_addm] : function(song){
        add_search(get_music.bind(null, song), false, true)
    },
    [action_delm] : function(idx){
        setTimeout(()=>del_song(PLAYLIST, idx, undefined, false, true), 1000);
    },
    [action_lstm] : function(){
        setTimeout(()=>lstMusic(this), 1000);
    },
    [action_nxtm] : function(){
        setTimeout(()=> play_next(this, (msg) => sendTab({ fn: publish_message, args: { msg: msg } })), 1000);
    },
    [action_pndm] : function(song){
        setTimeout(()=>pndMusic(this, song), 1000);
    },
    [action_schm] : function(...args){
        if(args.length) setTimeout(()=>schMusic(this, ...args), 1000);
    },
    /* too quick leading play song failed in content script, so setTimout */
}

function event_action(event, config, req){
    var rules = settings[EVENTACT].load(config[sid(EVENTACT)]);
    rules.map(([type, user_regex, cont_regex, action, arglist])=> {
        if(((Array.isArray(type) && type.includes(event)) || type == event)
            && req.user.match(new RegExp(user_regex))
            && (req.text === 'unknown' || req.text.match(new RegExp(cont_regex)))){
            actions[action].apply(config, argfmt(arglist, req.user, req.text, req.url));
        }
    });
}
