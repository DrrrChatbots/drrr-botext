/* youtube iframe plugin */

function youtube_parser(url){
  if(!url) return false;
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

function youtube_iframe(ytid){
  return `<iframe width="560" height="315"
        src="https://www.youtube.com/embed/${ytid}"
        frameborder="0"
        allow="accelerometer; autoplay;
               clipboard-write; encrypted-media;
               gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
}

function youtube_replace_talk(){
  $("a.message-link").get().forEach(e => {
    var ue = $(e);
    var ytid = youtube_parser(ue.attr("href"));
    if(ytid){ ue.replaceWith(youtube_iframe(ytid)); }
  })
}

let yt_parser_code =
  youtube_parser.toString();

let yt_iframe_code =
  youtube_iframe.toString();

let yt_replace_talk_code =
  youtube_replace_talk.toString();

let youtube_plugin = `${yt_parser_code}
${yt_iframe_code}
(${yt_replace_talk_code})()
$('#talks').bind('DOMNodeInserted', function(event) {
  var e = event.target;
  var ue = $(e).find($('.bubble p a'));
  var ytid = youtube_parser(ue.attr('href'));
  if(ytid){ ue.replaceWith(youtube_iframe(ytid)) }
})`;

/* 503 autoreload plugin */

function monit_503(){
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation) {
      if(mutation.target.style.display == 'block'){
        $.ajax({
          type: "GET",
          url: 'https://drrr.com/room/?ajax=1&api=json',
          success: function(data){
            console.log(data);
          },
          error: function(jxhr){
            if(jxhr.status == 503){
              console.log("wait 503 reload...")
              window.location.replace(window.location.href);
            }
            else console.log(jxhr);
          }
        });
      }
    });
  });
  observer.observe($('#connection-indicator')[0], {
    //configure it to listen to attribute changes
    attributes: true
  });
}

let monit_503_code = monit_503.toString();
let monit_503_plugin = `(${monit_503_code})()`
;
var builtin_plugins = {
  'youtube_iframe': ['code', 'room', true, youtube_plugin],
  'cf_auto_reload': ['code', 'room', false, monit_503_plugin]
}
