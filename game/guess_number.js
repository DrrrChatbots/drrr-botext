var GAME_GUESS_NUMBER = "GAME_GUESS_NUMBER"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
    `<p>在聊天室使用 <code>/start</code> 設定隨機數字，<br>或者你可以用上面的設定欄位設定（留空為隨機）</p><p>在聊天室發送四個數字開始猜數字。</p>`:`<p>Use <code>/start</code> in chatroom to set numbers randomly, <br>or you can use input above to set a number<br>(empty would be random)</p><p>Type four digits in chatroom to guess the number</p>`


export const ui = (config) => {
    return `
<div class="input-group">
    <div class="input-group-btn">
        <button class="btn btn-default" type="button">
            <i class="glyphicon glyphicon-sort-by-order"></i>
        </button>
    </div>

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>

    <input id="answer" type="text" class="form-control" placeholder="Input 4 digits">

    <div class="input-group-btn">
        <button id="set_answer" class="btn btn-default" type="button"
                                                               data-delayed-toggle="collapse" data-target="#music_list"
                                                                                              title="set digits">
            <i id="list_type" class="glyphicon glyphicon glyphicon-pencil"></i>
        </button>
        <button id="publish_set" class="btn btn-default" type="button" title="Announce Game">
            <i class="glyphicon glyphicon-volume-up"></i>
        </button>
    </div>
</div><br>${intro}`
}


export const ui_event = (config) => {
    if(config[GAME_GUESS_NUMBER])
        $('#answer').val(config[GAME_GUESS_NUMBER]);
    $('#set_answer').click(()=>{
        gnset(
            $('#answer').val(),
            (v, msg)=>{
                !v && $('#answer').attr('placeholder', msg);
                !v && $('#answer').parent().addClass('has-error').removeClass('has-success');
                v && $('#answer').parent().addClass('has-success').removeClass('has-error');
                $('#answer').val(v);
            }
        );
    });
    $('#publish_set').click(()=>{
        sendTab({
            fn: publish_message,
            args: { msg: 'number setted, game start' }
        });
    });


}

export const event_action = (type, req) => {
    if(type == event_msg){
        if(req.text.match(/^\/start/))
            setTimeout(()=> sendTab({ fn: publish_message, args: { msg: gnset() } }), 1000);
        else if(req.text.match(/^\d\d\d\d$/))
            gnjdg(req.text,
                (msg) => setTimeout(()=>
                    sendTab({ fn: publish_message, args: { msg: msg } }), 1000));
    }
}

/* GAME_GUESS_NUMBER EXAMPLE
"msg", "", "^/start", "gnset", [""]
"msg", "", "^\\d\\d\\d\\d$", "gnjdg", ["$cont"]
*/

// export
//action_gnset = "gnset"
//action_gnjdg = "gnjdg"
//action_actions.push(action_gnset)
//action_actions.push(action_gnjdg)

// game logic
function valid(digits){
    return digits.match(/^\d\d\d\d$/) && (new Set(digits.split(''))).size === 4;
}

function gnset(digits, callback){
    if(!digits){
        do{ digits = String(Math.floor(1000 + Math.random() * 9000));
        } while(!valid(digits));
        chrome.storage.sync.set({ [GAME_GUESS_NUMBER]: digits });
        callback && callback(digits, "random number set, game start");
        return "random number set, game start";
    }
    else if(valid(digits)){
        chrome.storage.sync.set({ [GAME_GUESS_NUMBER]: digits });
        callback && callback(digits, "number set, game start")
        return "number set, game start";
    }
    else{
        chrome.storage.sync.remove(GAME_GUESS_NUMBER);
        callback && callback('', `give me 4 different digits, you give me ${digits}`)
        return `give me 4 digits, you give me ${digits}`;
    }
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
