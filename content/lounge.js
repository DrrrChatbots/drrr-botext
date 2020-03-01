var state = [];
var secs = 3;

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

$(document).ready(function(){
    chrome.runtime.sendMessage({ clearNotes: true, pattern: '' });
    //'https://drrr.com/room/.*'
    chrome.storage.sync.get(['leaveRoom', 'jumpToRoom', 'profile'], (config) => {
        console.log('config', config);

        if(!config['profile']) ajaxProfile();
        else Profile = config['profile'];

        if(config['leaveRoom'])
            chrome.storage.sync.remove('leaveRoom');
        if(config['jumpToRoom']){
            planeGo();
            $('#rooms-placeholder').prepend(countDownModal);
            var hand = setInterval(function(){
                $('#seconds').text(--secs)
                if(!secs) chrome.runtime.sendMessage({ jumpto: config['jumpToRoom'] });
            }, 1000);
            setTimeout(()=>{
                $('#myModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#myModal').modal('show');
                $('#cancel_go').click(()=>{
                    clearInterval(hand);
                    if(confirm('OK to stay in the lounge.\nCancel will lead you to to the room!')){
                        chrome.storage.sync.remove('jumpToRoom');
                    }
                    else{ chrome.runtime.sendMessage({ jumpto: config['jumpToRoom'] }); }
                })
            }, 100);

        }
        else{
            var monit = ()=>monitRooms(false);
            setTimeout(monit, 5000);
            setInterval(monit, 20000);
            console.log("start find");
        }
    });
})

chrome.runtime.onMessage.addListener((req, sender, callback) => {
    console.log(req);
    if(req){
        if(req.fn == leave_room)
            location.reload();
        else if(req.fn == cache_profile){
            console.log("lounge cache", Profile ? "succ": "failed");
            callback(Profile)
        }
        else if(req.fn == update_profile){
            Profile = req.args.profile;
        }
    }
});
