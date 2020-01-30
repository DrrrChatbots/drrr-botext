
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months_zh = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
var days_zh = ["日", "一", "二", "三", "四", "五", "六"];

function timefmt(str){
    var time = new Date();
    var fmts = {
        '%Y': time.getFullYear(),
        '%M': months[time.getMonth()],
        '%月': months_zh[time.getMonth()],
        '%D': time.getDate(),
        '%d': days[time.getDay()],
        '%日': days_zh[time.getDay()],
        '%H': time.getHours(),
        '%h': time.getHours() == 24 ? 24 : time.getHours() % 12,
        '%c': time.getHours() > 12 ? 'p.m.' : 'a.m.',
        '%m': time.getMinutes(),
        '%s': time.getSeconds(),
        '%%': '%'
    };
    for(var fmt in fmts) str = str.replace(new RegExp(`(^|[^%])${fmt}`, 'g'), `$1${fmts[fmt]}`);
    return str;
}

toEnd = (str) => str === '' ? undefined : Number(str) + 1;
toBeg = (str) => str === '' ? 0 : Number(str);
unquote = (str) => str.length && str[0] === str[str.length - 1] && [`'`, `"`].includes(str[0]) ? str.substring(1, str.length - 1) : str;

function argfmt(arglist, user, cont, url){
    var args = cont.match(/'.*?'|".*?"|[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\u3131-\uD79D]+/gu).map(unquote);
    var fmts = {
        '\\$url': url, 
        '\\$user': user,
        '\\$cont': cont,
        '\\$args': cont.substring(args[0].length),
        '\\$\\$': '$'
    };
    return arglist.map((s)=>
        Object.keys(fmts).reduce(
            (acc, fmt)=> acc.replace(new RegExp(`(^|[^\\$])${fmt}`, 'g'), `$1${fmts[fmt]}`),
            s.replace(/(^|[^\$])\$(\d+)/g, (match, _, v)=> args[toBeg(v)])
             .replace(/(^|[^\$])\$\[(\d*)-?(\d*)\]/g, (match, _, b, e)=> _ + args.slice(toBeg(b), toEnd(e)).join(' '))
        )
    )
}

console.log(argfmt(['$user', '$args', '$cont', '$url', '$1', '$[2-4]', '$$user', '$[-]'], 'zxc', 'arg0 arg1 arg2 arg3 arg4 arg5 arg6', 'https://drrr.com'));

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
