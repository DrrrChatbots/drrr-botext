
/* GAME_GUESS_NUMBER EXAMPLE
"msg", "", "^/start", "gnset", [""]
"msg", "", "^\\d\\d\\d\\d$", "gnjdg", ["$cont"]
 */

// export
GAME_GUESS_NUMBER = "GAME_GUESS_NUMBER"
action_gnset = "gnset"
action_gnjdg = "gnjdg"
action_actions.push(action_gnset)
action_actions.push(action_gnjdg)

// game logic
function valid(digits){
    return digits.match(/^\d\d\d\d$/) && (new Set(digits.split(''))).size === 4;
}

function gnset(digits){
    if(!digits){
        do{ digits = String(Math.floor(1000 + Math.random() * 9000));
        } while(!valid(digits));
        chrome.storage.sync.set({ [GAME_GUESS_NUMBER]: digits });
        return "random number set, game start";
    }
    else if(valid(digits)){
        chrome.storage.sync.set({ [GAME_GUESS_NUMBER]: digits });
        return "number set, game start";
    }
    else return `give me 4 digits, you give me ${digits}`;
}

function gnjdg(guess, callback){
    chrome.storage.sync.get((config) => {
        if(valid(guess)){
            if(config[GAME_GUESS_NUMBER]){
                var d = config[GAME_GUESS_NUMBER].split('');
                var g = guess.split('');
                var c = g.map((v)=>d.includes(v)).reduce((a, b)=>a+b);
                var a = g.map((v, idx)=>d[idx] === g[idx]).reduce((a, b)=>a+b);
                var b  = c - a;
                callback(a === 4 ? "Your Number is Correct" : `${guess}: ${a}A${b}B`);
            } else callback("number not set yet, set number to start the game.");
        } else callback(`guess number must be 4 non-repeat digits: ${guess}`);
    });
}

// action
actions[action_gnset] = function(digits){
    setTimeout(()=> sendTab({ fn: publish_message, args: { msg: gnset(digits) } }), 1000);
}

actions[action_gnjdg] = function(digits){
    gnjdg(digits, (msg) =>
        setTimeout(()=> sendTab({ fn: publish_message, args: { msg: msg } }), 1000));
}
