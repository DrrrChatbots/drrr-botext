var state = [];
var secs = 5;

var countDownModal = `
    <div style="color:#FFFFFF" id="myModal" class="modal fade" role="dialog">
        <div class="modal-dialog">
        <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Redirection</h4>
              </div>
              <div class="modal-body">
                <p>Will Redirect to Target Room After <span id="seconds">${secs}</span> Seconds...</p>
              </div>
              <div class="modal-footer">
                <button id="cancel_go" type="button"
                    class="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
        </div>
    </div>`

function checkGoToRoom(config){
    if(config['jumpToRoom']){
        planeGo();
        show_jump_dialogue(config);
        var url = config['jumpToRoom'];
        var idx = url.indexOf('?id=');
        if(idx > 0){
            roomid = url.substring(idx + 4);
            console.log(`button[value="${roomid}"]`);
            setTimeout(()=>blinkElt(`button[value="${roomid}"]`, jump_countdown.bind(null, config)), 1500);
        }
        else jump_countdown(config);
    }
    else{
        var monit = ()=>monitRooms(false);
        setTimeout(monit, 5000);
        setInterval(monit, 20000);
        console.log("start find");
    }
}

$(document).ready(function(){
    chrome.runtime.sendMessage({ clearNotes: true, pattern: '' });
    //'https://drrr.com/room/.*'
    $('form[action="//drrr.com/logout/"] > input').click(function(){
        chrome.storage.sync.remove(['profile', 'cookie']);
    })

    chrome.storage.sync.get(['leaveRoom', 'jumpToRoom', 'profile'], (config) => {
        console.log('config', config);

        if(!config['profile']) ajaxProfile(undefined, undefined, 'lounge');
        else Profile = config['profile'];

        //Profile.loc = 'lounge';
        //chrome.storage.sync.set({'profile': Profile});

        if(config['leaveRoom'])
            chrome.storage.sync.remove('leaveRoom', ()=>checkGoToRoom(config));
        else checkGoToRoom(config);
    });
})

var hand = undefined;

function show_jump_dialogue(config){
    $('#rooms-placeholder').prepend(countDownModal);
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#myModal').modal('show');
    $('#cancel_go').click(()=>{
        clearInterval(hand);
        hand = true;
        if(confirm('OK to stay in the lounge.\nCancel will lead you to to the room!')){
            chrome.storage.sync.remove('jumpToRoom');
        }
        else{ setTimeout(()=>chrome.runtime.sendMessage({ jumpto: config['jumpToRoom'] }), 2000); }
    })
}

function jump_countdown(config){
    setTimeout(()=>{
        hand = hand || setInterval(function(){
            $('#seconds').text(--secs)
            if(!secs) chrome.runtime.sendMessage({ jumpto: config['jumpToRoom'] });
        }, 1000);
    }, 100);
}

function blinkElt(sel, callback){
    if(!$('.rooms').length){
        setTimeout(()=>blinkElt(sel, callback), 1500);
    }
    else if($(sel).length){
        $(sel)[0].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        $(sel).parent().parent().parent()
            .css({"background-color": "#FFFF9C", "transition":"background-color 0.5s ease"});
        setTimeout(function(){
            $(sel).parent().parent().parent()
                .delay(100)
                .fadeOut('slow')
                .fadeIn('slow')
                .fadeOut('slow')
                .fadeIn('slow')
            setTimeout(function(){
                $(sel).parent().parent().parent().delay(1000)
                    .css("background-color", "#FFFFFF")
            }, 3000);
        }, 1000);
        callback && callback();
    } else callback && callback();
}

chrome.runtime.onMessage.addListener((req, sender, callback) => {
    console.log(req);
    if(req){
        if(req.fn == leave_room)
            location.reload();
        else if(req.fn == cache_profile){
            if(Profile) Profile.loc = 'lounge';
            console.log("lounge cache", Profile ? "succ": "failed");
            callback(Profile)
        }
        else if(req.fn == update_profile){
            Profile = req.args.profile;
        }
        else if(req.fn == scroll_to){
            var sel = req.args.sel;
            console.log(sel);
            blinkElt(sel);

        }
    }
});
