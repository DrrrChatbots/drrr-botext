
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months_zh = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
var dates_zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二",
"十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三",
"二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一"];
var days_zh = ["日", "一", "二", "三", "四", "五", "六"];

function timefmt(str){
  var time = new Date();
  var fmts = {
    '%Y': time.getFullYear(),
    '%年': String(time.getFullYear())
    .replace(new RegExp('0', 'g'), '零')
    .replace(new RegExp('1', 'g'), '一')
    .replace(new RegExp('2', 'g'), '二')
    .replace(new RegExp('3', 'g'), '三')
    .replace(new RegExp('4', 'g'), '四')
    .replace(new RegExp('5', 'g'), '五')
    .replace(new RegExp('6', 'g'), '六')
    .replace(new RegExp('7', 'g'), '七')
    .replace(new RegExp('8', 'g'), '八')
    .replace(new RegExp('9', 'g'), '九'),
    '%M': months[time.getMonth()],
    '%月': months_zh[time.getMonth()],
    '%D': String(time.getDate()).padStart(2, '0'),
    '%日': dates_zh[time.getDate()],
    '%d': days[time.getDay()],
    '%拜': days_zh[time.getDay()],
    '%H': String(time.getHours()).padStart(2, '0'),
    '%h': String(time.getHours() == 24 ? 24 : time.getHours() % 12).padStart(2, '0'),
    '%c': time.getHours() > 12 ? 'p.m.' : 'a.m.',
    '%m': String(time.getMinutes()).padStart(2, '0'),
    '%s': String(time.getSeconds()).padStart(2, '0'),
    '%%': '%'
  };
  for(var fmt in fmts) str = str.replace(new RegExp(`(^|[^%])${fmt}`, 'g'), `$1${fmts[fmt]}`);
  return str;
}

toEnd = (str) => str === '' ? undefined : Number(str) + 1;
toBeg = (str) => str === '' ? 0 : Number(str);
unquote = (str) => str.length && str[0] === str[str.length - 1] && [`'`, `"`].includes(str[0]) ? str.substring(1, str.length - 1) : str;

function argfmt(arglist, user, cont, url, callback){
  var args = ((m)=>m?m.map(unquote) : [])(cont.match(/'.*?'|".*?"|[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\u3131-\uD79D]+/gu))
  var fmts = {
    '\\$url': url,
    '\\$user': user,
    '\\$cont': cont,
    '\\$args': args.length ? cont.substring(args[0].length + 1).trim() : '',
    '\\$\\$': '$'
  };
  args = arglist.map((s)=>
    Object.keys(fmts).reduce(
      (acc, fmt)=> acc.replace(new RegExp(`(^|[^\\$])${fmt}`, 'g'), `$1${fmts[fmt]}`),
      s.replace(/(^|[^\$])\$(\d+)/g, (match, _, v)=> _ + args[toBeg(v)])
      .replace(/(^|[^\$])\$\[(\d*)-?(\d*)\]/g, (match, _, b, e)=> _ + args.slice(toBeg(b), toEnd(e)).join(' '))
    )
  );
  return giffmt([], args, callback);
}

function giffmt(done, pending, callback){
  if(pending.length){
    [car, ...cdr] = pending;
    car.replace(/(^|[^\$])\$gif\((.*)\)/g, (match, _, word)=> word)
    match = (/(^|[^\$])\$gif\((.*)\)/g).exec(car)
    if(match)
      return tenor_img(match[2], (url)=> giffmt(done.concat([car.replace(/(^|[^\$])\$gif\((.*)\)/g, (match, _, word)=> url)]), cdr, callback));
    else return giffmt(done.concat([car]), cdr, callback);
  }
  else return callback(done);
}

// console.log(argfmt(['$user', '$args', '$cont', '$url', '$1', '$[2-4]', '$$user', '$[-]'], 'zxc', 'arg0 arg1 arg2 arg3 arg4 arg5 arg6', 'https://drrr.com'));

/*
[
  'zxc',
  'arg0 arg1 arg2 arg3 arg4 arg5 arg6',
  'https://drrr.com',
  'arg1',
  'arg2 arg3 arg4',
  '$user',
  'arg0 arg1 arg2 arg3 arg4 arg5 arg6'
]
*/
