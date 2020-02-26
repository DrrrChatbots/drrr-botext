var state = [];

//function findUser(names, rooms, callback){
//    for(room of Object.values(rooms)){
//        for(user of room.users){
//            for(name of names){
//                if(user.name.match(new RegExp(name, 'i'))){
//                    console.log(user.name, 'in', room.name, room.roomId);
//                    if(!state.includes(user.name)){
//                        callback(user.name, room.name, room.roomId);
//                        //state.push(user.name);
//                    }
//                }
//            }
//        }
//    }
//}


var secs = 5;
//var countDownModal = `
//<div id="myModal" class="modal show fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
//    <div class="modal-header">
//        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
//        <h3 id="myModalLabel">Modal header</h3>
//    </div>
//    <div class="modal-body">
//        <p>Will Redirect to Target Room After <span id="seconds">${secs}</span> Seconds...</p>
//    </div>
//    <div class="modal-footer">
//        <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
//        <button class="btn btn-primary">Save changes</button>
//    </div>
//</div>
//`;

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
    chrome.storage.sync.get((config) => {
        console.log('config', config);
        if(config['jumpToRoom']){
            //chrome.tabs.update({url: config['jumpToRoom']});
            //window.location.href = ;
            $('#rooms-placeholder').prepend(countDownModal);
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
                        findUser(friends, data.rooms, function(users, room){
                            url = room.total < room.limit ? 'https://drrr.com/room/?id=' + room.roomId : undefined;
                            msg = room.total < room.limit ? `點擊前往 ${room.name} (${room.total}/${room.limit})` : '房間滿了 QwQ';
                            chrome.runtime.sendMessage({ notification: {
                                url: url,
                                title: `野生的 "${users.map(u=>u.name).join('\", \"')}" 出現啦`,
                                msg: msg,
                            } })
                        })
                    }
                })
            }
            find();
            //setInterval(find, 20000);
            console.log("start find");
        }
    });
})

chrome.runtime.onMessage.addListener((req, sender, callback) => {
    console.log(req);
    if(req && req.fn == leave_room) location.reload();
});
