var state = [];
var secs = 3;

var countDownModal = `
        <img id="plane" src="${chrome.runtime.getURL('/images/plane.png')}" style="position:absolute; left:-300px; top:500px; z-index:999;">
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
    //chrome.runtime.sendMessage({ clearNotes: 'https://drrr.com/room/.*' });
    chrome.runtime.sendMessage({ clearNotes: '' });
    chrome.storage.sync.get((config) => {
        console.log('config', config);
        if(config['jumpToRoom']){
            //chrome.tabs.update({url: config['jumpToRoom']});
            //window.location.href = ;
            $('#rooms-placeholder').prepend(countDownModal);

            $("#plane").animate({ left:"+=1000px", top:"-=1000px" }, 4000);
            var hand = setInterval(function(){
                secs -= 1;
                $('#seconds').text(secs)
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
            var find = function(){
                console.log('check once');
                $.ajax({
                    type: "GET",
                    url: 'https://drrr.com//lounge?api=json',
                    dataType: 'json',
                    success: function(data){
                        monitLounge(friends, data.rooms, false);
                    },
                    error: function(data){
                        console.log("Error:", JSON.stringify(data));
                    }
                })
            }
            setTimeout(find, 5000);
            setInterval(find, 20000);
            console.log("start find");
        }
    });
})

chrome.runtime.onMessage.addListener((req, sender, callback) => {
    console.log(req);
    if(req && req.fn == leave_room) location.reload();
});
