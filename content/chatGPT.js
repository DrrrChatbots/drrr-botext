let chunkString = (size, str) => {
  let pos = 0, chunks = [];
  while(pos < str.length){
    chunks.push(str.substr(pos, size));
    pos += size;
  }
  return chunks;
}

function splitOn(text, del){
  if(typeof del == 'string')
    return text.split(del).map((s, i, a) =>
      i == a.length - 1 ? s : s + del
    ).filter(x => x);
  else if(Array.isArray(del)){
    if(!del.length) return [text];
    let rd = del.slice(1);
    return splitOn(text, del[0])
      .map(t => splitOn(t, rd)).flat();
  }
  return text;
}

let batchOf = callback => blocks => {
  let msgs = [];
  blocks.forEach(block => {
    let lines = []
    let buffer = "";

    let paragraph = block.code || block.text;

    let p = splitOn(paragraph, '\n').map(m =>
      splitOn(m, ['。', '！', '？', '，']).map(s =>
        s.split(/([.!?,] )/)).flat()).flat()
    p.forEach(ctx => {
      if(ctx.length)
        chunkString(120, ctx).forEach(chk => {
          if (buffer.length + chk.length > 120)
          { lines.push(buffer); buffer = chk; }
          else { buffer = buffer + chk; }
        })
    })
    if(buffer.length) lines.push(buffer)

    if(block.text)
      lines.forEach(l => msgs.push(l))
    else
      msgs.push(lines)
  });
  msgs.reverse();
  msgs.forEach(x => Array.isArray(x) ? x.reverse() : x)
  msgs.flat().forEach(m => callback(m))
}

let lock = false;
function sendChat(content){
  if(lock) return chrome.runtime.sendMessage({text: '...'});
  lock = true;
  $('textarea').val(content);
  $('textarea')[0].nextElementSibling.click()
}

function parseProse(p){
  let resp = [];
  [...p.children].forEach(c => {
    if(c.tagName == 'PRE'){
      resp.push({ code: [...c.querySelectorAll('code')]
        .map(c => c.textContent).join('\n') });
    }
    else if(c.tagName == 'UL'){
      let ul = [...c.children].map(
        li => '·' + li.textContent).join('\n');
      resp.push({ text: ul });
    }
    else if(c.tagName == 'OL'){
      let ol = [...c.children].map(
        (li, idx) => `${idx + 1}. ` + li.textContent).join('\n');
      resp.push({ text: ol });
    }
    else {
      resp.push({ text: c.textContent });
    }
  });
  return resp;
}

function monitChat(callback){
  let dom = document.getElementsByTagName('main')[0]
    .firstElementChild.firstElementChild.firstElementChild.firstElementChild

  dom.addEventListener( 'DOMNodeInserted', function ( event ) {
    if( event.target.parentNode.classList[0] == dom.classList[0] ) {
      // result-streaming
      if(event.target.querySelectorAll('svg')?.[0].classList.contains('w-6')){
        let prosesResp = [];
        for(let prose of event.target.querySelectorAll('.prose')){
          if(prose.classList.contains('result-streaming')){
            const observer = new MutationObserver(((p) =>
              function (mutations, owner) {
                console.log('waited', p);
                callback(parseProse(p));
                lock = false;
              }
            )(prose));
            return observer.observe(prose, {
              attributes: true,
            });
          }
          prosesResp.push(parseProse(prose));
        }
        // DO callback
        console.log('done', prose)
        callback(prosesResp.join('\n'));
        lock = false;
      }
    };
  }, false );
}

$(document).ready(function(){
  let recmd = '請限制之後的回答在 140 字內'
  setTimeout(() => $('textarea').val(recmd), 1000);
  let cb = batchOf(x => {
    console.log(x);
    chrome.runtime.sendMessage({text: x});
  });
  monitChat(cb);
});

chrome.runtime.onMessage.addListener(
  (req, sender, callback) => {
    sendChat(req.text);
  });
