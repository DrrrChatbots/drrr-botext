var months = ["January", "February", "March", "April",
              "May", "June", "July", "August", "September",
              "October", "November", "December"];
var months_abb = ["Jan", "Feb", "Mar", "Apr",
                  "May", "Jun", "Jul", "Aug",
                  "Sep", "Oct", "Nov", "Dec"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday"];
var days_abb = ["Sun", "Mon", "Tue", "Wed",
                "Thur", "Fri", "Sat"];
var months_zh = ["一", "二", "三", "四", "五", "六",
                 "七", "八", "九", "十", "十一", "十二"];
var dates_zh = ["", "一", "二", "三", "四", "五", "六",
                "七", "八", "九", "十", "十一", "十二",
                "十三", "十四", "十五", "十六", "十七",
                "十八", "十九", "二十", "二十一", "二十二", "二十三",
                "二十四", "二十五", "二十六", "二十七",
                "二十八", "二十九", "三十", "三十一"];
var days_zh = ["日", "一", "二", "三", "四", "五", "六"];

function getZoneTime(offset) {
  var d = new Date();
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  var nd = new Date(utc + (3600000*offset));
  return nd;
}

function timefmt(str){
  var local = new Date();
  var fmts = [
    ['Y',    t => t.getFullYear()                            ],
    ['年',   t => String(t.getFullYear())
      .replace(new RegExp('0', 'g'), '零')
      .replace(new RegExp('1', 'g'), '一')
      .replace(new RegExp('2', 'g'), '二')
      .replace(new RegExp('3', 'g'), '三')
      .replace(new RegExp('4', 'g'), '四')
      .replace(new RegExp('5', 'g'), '五')
      .replace(new RegExp('6', 'g'), '六')
      .replace(new RegExp('7', 'g'), '七')
      .replace(new RegExp('8', 'g'), '八')
      .replace(new RegExp('9', 'g'), '九')                    ],
    ['MMMM', t => months[t.getMonth()]                       ],
    ['MMM',  t => months_abb[t.getMonth()]                   ],
    ['MM',   t => String((t.getMonth() + 1)).padStart(2, '0')],
    ['M',    t => String(t.getMonth() + 1)                   ],
    ['月',   t => months_zh[t.getMonth()]                    ],
    ['DD',   t => String(t.getDate()).padStart(2, '0')       ],
    ['D',    t => String(t.getDate())                        ],
    ['日',   t => dates_zh[t.getDate()]                      ],
    ['dd',   t => days[t.getDay()]                           ],
    ['d',    t => days_abb[t.getDay()]                       ],
    ['星',   t => days_zh[t.getDay()]                        ],
    ['HH',   t => String(t.getHours()).padStart(2, '0')      ],
    ['H',    t => String(t.getHours())                       ],
    ['hh',   t => String(t.getHours() == 24 ?
               24 : t.getHours() % 12).padStart(2, '0')      ],
    ['h',    t => String(t.getHours() == 24 ?
               24 : t.getHours() % 12)                       ],
    ['n',    t => t.getHours() >= 12 ? 'p.m.' : 'a.m.'       ],
    ['午',   t => t.getHours() >= 12 ? '下午' : '上午'       ],
    ['mm',   t => String(t.getMinutes()).padStart(2, '0')    ],
    ['m',    t => String(t.getMinutes())                     ],
    ['ss',   t => String(t.getSeconds()).padStart(2, '0')    ],
    ['s',    t => String(t.getSeconds())                     ],
    ['%',    t => '%'                                        ],
  ];

  for(let fmt of fmts)
    str = str.replace(
      new RegExp(`(^|[^%])%${fmt[0]}`, 'g'),
      `$1${fmt[1](local)}`);

  for(let i = -12; i < 13; i++){
    let dt = getZoneTime(i);
    for(let fmt of fmts){
      let pat = i >= 0 ? `%(\\+)?${i}${fmt[0]}` : `%${i}${fmt[0]}`
      let val = fmt[1](dt)
      str = str.replace(
        new RegExp(`(^|[^%])${pat}`, 'g'),
        `$1${val}`);
    }
  }

  return str;
}

toEnd = (str) => str === '' ? undefined : Number(str) + 1;
toBeg = (str) => str === '' ? 0 : Number(str);
atPos = (arr, idx) => idx < arr.length && idx >= 0 ? arr[idx] : '';
unquote = (str) => str.length && str[0] === str[str.length - 1] && [`'`, `"`].includes(str[0]) ? str.substring(1, str.length - 1) : str;

function escstr(str, callback){
  const quotes = new RegExp("'", 'g');
  let ret = "'" + str.replace(/\\/g, '\\\\').replace(quotes, "\\\\'") + "'";
  return callback ? callback(ret) : ret;
}

function arrayLifter(args){
  return Array.isArray(args) ? args : [args];
}

function ops_apply_purely(code, args, callback){
  if(callback){
    run_lambda_code_purely(code, (f) => {
      if(f && f.call){
        callback(arrayLifter(f.call(null, args)));
      }
      else notification_alert(`code error ${code}`, 'APPLY PURELY');
    });
  }
  else{
    let f = run_lambda_code_purely(code);
    if(f && f.call)
      return arrayLifter(f.call(null, args));
    else {
      notification_alert(`code error ${code}`, 'APPLY PURELY');
      return [];
    }
  }
}

function ops_apply_impurely(code, args, callback){
  callback && run_lambda_code_impurely(code, (f) => {
    if(f && f.call)
      callback(arrayLifter(f.call(null, args)));
    else notification_alert(`code error ${code}`, 'APPLY IMPURELY');
  });
}

function ops_call_purely(code, args, callback){
  if(callback){
    run_lambda_code_purely(code, (f) => {
      if(f && f.apply)
        callback(arrayLifter(f.apply(null, args)));
      else notification_alert(`${code}`, 'CODE ERROR');
    });
  }
  else{
    let f = run_lambda_code_purely(code);
    if(f && f.apply)
      return arrayLifter(f.apply(null, args));
    else notification_alert(`${code}`, 'CODE ERROR');
  }
}

function ops_call_impurely(code, args, callback){
  callback && run_lambda_code_impurely(code, (f) => {
    if(f && f.apply)
      callback(arrayLifter(f.apply(null, args)));
    else notification_alert(`${code}`, 'CODE ERROR');
  });
}

const argsfuncs = {
  'call!': ops_call_impurely,
  'apply!': ops_apply_impurely,
  'call': ops_call_purely,
  'apply': ops_apply_purely,
}

function argfmt(arglist, user, cont, url, callback, cmat){

  if(!Array.isArray(arglist)
    || !arglist.length) return [];

  let args = (((m)=> m ? m.map(unquote) : [])(
    cont.match(/'.*?'|".*?"|\S+/gu)))

  let dict = {
    url: url,
    user: user,
    cont: cont,
    midx: cmat ? String(cmat.index) : String(-1),
    args: args.length ? cont.substring(args[0].length + 1).trim() : '',
  }

  let [car, ...cdr] = arglist;

  if(callback){
    return async_map([], cdr, (s, cb) => fmt_syncasync(s, dict, args, cmat, cb),
      (done) => fmt_car_async(car, dict, args, cmat, done, callback));
  }
  else{
    return fmt_car_sync(car, dict, args, cmat,
      cdr.map(s => fmt_syncasync(s, dict, args, cmat)));
  }
}

function async_map(done, pending, f, callback){
  if(pending.length){
    let [car, ...cdr] = pending;
    f(car, (_car) => async_map(done.concat([_car]), cdr, f, callback));
  }
  else{
    callback(done);
  }
}

function fmt_car_async(str, dict, args, cmat, cdr, callback){
  let m = undefined;
  if(m = str.match(/^\S*\$/)){
    for(let name in argsfuncs){
      if(str.startsWith(name, m[0].length)){
        let begp = m[0].length + name.length
        let end = find_next_paran(str, begp)
        if(end){
          return fmt_syncasync(
            str.substring(begp + 1, end), dict, args, cmat,
            (arg) => argsfuncs[name](arg, cdr, callback)
          );
        }
        break;
      }
    }
  }
  fmt_syncasync(str, dict, args, cmat,
    (_car) => callback([_car, ...cdr]));
}

function fmt_syncasync(str, dict, args, cmat, callback){
  let out = '';
  for(let i = 0; i < str.length; i++){
    let cur = str[i];
    let next = i + 1 < str.length ? str[i + 1] : '';
    if(cur == '$'){
      let m = undefined;
      let sub = i + 1 < str.length ? str.substring(i + 1) : '';
      if(next == '$'){
        out += '$', i++;
        continue;
      }
      else if(m = sub.match(/^_(\d+)/)){
        out += atPos(cmat, toBeg(m[1]))
        i += m[0].length;
        continue;
      }
      else if(m = sub.match(/^(\d+)/)){
        out += atPos(args, toBeg(m[1]))
        i += m[0].length;
        continue;
      }
      else if(m = sub.match(/^\[(\d*)-?(\d*)\]/)){
        out += args.slice(toBeg(m[1]), toEnd(m[2])).join(' ')
        i += m[0].length;
        continue;
      }
      else{
        let parsed = parse_dict(str, i + 1, dict);
        if(parsed){
          let [ret, end] = parsed;
          out += ret, i = end;
          continue;
        }

        if(callback){
          let cont = (parsed) => {
            if(parsed){
              let [ret, end] = parsed;
              if(typeof ret === 'object')
                ret = JSON.stringify(ret)
              fmt_syncasync(
                str.substring(end + 1), dict, args, cmat,
                (_out) => callback(out + ret + _out));
            }
          }
          return parse_argfuncs(str, i + 1, dict, args, cmat, (parsed) => {
            if(parsed) cont(parsed);
            else fmt_syncasync(
              str.substring(i + 1), dict, args, cmat,
              (_out) => callback(out + cur + _out));
          })
        }
        else {
          let parsed = parse_argfuncs(str, i + 1, dict, args, cmat);
          if(parsed){
            let [ret, end] = parsed;
            if(typeof ret === 'object')
              ret = JSON.stringify(ret)
            out += ret, i = end;
            continue;
          }
        }
      }
    }
    else if(cur == '%'){
      let parsed = timefmt_unit(str.substring(i))
      if(parsed){
        let [t, l] = parsed;
        out += t, i += l;
        continue;
      }
    }
    out += cur;
  }
  return callback ? callback(out) : out;
}

function fmt_car_sync(str, dict, args, cmat, cdr){
  let m = undefined;
  if(m = str.match(/^\S*\$/)){
    for(let name in argsfuncs){
      if(str.startsWith(name, m[0].length)){
        let begp = m[0].length + name.length
        let end = find_next_paran(str, begp)
        if(end){
          let arg = fmt_syncasync(str.substring(begp + 1, end), dict, args, cmat);
          return argsfuncs[name](arg, cdr);
        }
        break;
      }
    }
  }
  return [fmt_syncasync(str, dict, args, cmat), ...cdr];
}

function parse_argfuncs(str, idx, dict, args, cmat, callback){
  const nonsync_argfuncs = {
    'tenor': tenor_img,
    'giphy': giphy_img,
    '!': window.run_lambda_code_impurely,
  }

  const argfuncs = {
    'str': escstr,
    '': window.run_lambda_code_purely,
  }

  let funcs = callback ? {...nonsync_argfuncs, ...argfuncs} : argfuncs;

  for(let name in funcs){
    if(str.startsWith(`${name}(`, idx)){
      let end = find_next_paran(str, idx + name.length)
      if(end){
        let beg = idx + 1 + name.length;
        if(callback){
          return fmt_syncasync(
            str.substring(beg, end), dict, args, cmat,
            (arg) => funcs[name](arg,
              (out) => callback([out, end])));
        }
        else {
          let arg = fmt_syncasync(str.substring(beg, end), dict, args, cmat);
          return [funcs[name](arg), end];
        }
      }
      // cannot break because empty string
    }
  }
  return callback ? callback(null) : null;
}

function parse_dict(str, idx, dict){
  for(let name in dict){
    if(str.startsWith(name, idx)){
      return [dict[name], idx + name.length - 1]
      break;
    }
  }
  return null;
}

function timefmt_unit(str){
  var fmts = [
    ['Y',    t => t.getFullYear()                            ],
    ['年',   t => String(t.getFullYear())
      .replace(new RegExp('0', 'g'), '零')
      .replace(new RegExp('1', 'g'), '一')
      .replace(new RegExp('2', 'g'), '二')
      .replace(new RegExp('3', 'g'), '三')
      .replace(new RegExp('4', 'g'), '四')
      .replace(new RegExp('5', 'g'), '五')
      .replace(new RegExp('6', 'g'), '六')
      .replace(new RegExp('7', 'g'), '七')
      .replace(new RegExp('8', 'g'), '八')
      .replace(new RegExp('9', 'g'), '九')                    ],
    ['MMMM', t => months[t.getMonth()]                       ],
    ['MMM',  t => months_abb[t.getMonth()]                   ],
    ['MM',   t => String((t.getMonth() + 1)).padStart(2, '0')],
    ['M',    t => String(t.getMonth() + 1)                   ],
    ['月',   t => months_zh[t.getMonth()]                    ],
    ['DD',   t => String(t.getDate()).padStart(2, '0')       ],
    ['D',    t => String(t.getDate())                        ],
    ['日',   t => dates_zh[t.getDate()]                      ],
    ['dd',   t => days[t.getDay()]                           ],
    ['d',    t => days_abb[t.getDay()]                       ],
    ['星',   t => days_zh[t.getDay()]                        ],
    ['HH',   t => String(t.getHours()).padStart(2, '0')      ],
    ['H',    t => String(t.getHours())                       ],
    ['hh',   t => String(t.getHours() == 24 ?
               24 : t.getHours() % 12).padStart(2, '0')      ],
    ['h',    t => String(t.getHours() == 24 ?
               24 : t.getHours() % 12)                       ],
    ['n',    t => t.getHours() >= 12 ? 'p.m.' : 'a.m.'       ],
    ['午',   t => t.getHours() >= 12 ? '下午' : '上午'       ],
    ['mm',   t => String(t.getMinutes()).padStart(2, '0')    ],
    ['m',    t => String(t.getMinutes())                     ],
    ['ss',   t => String(t.getSeconds()).padStart(2, '0')    ],
    ['s',    t => String(t.getSeconds())                     ],
    ['%',    t => '%'                                        ],
  ];

  for(let fmt of fmts){
    let m = str.match(new RegExp(`(^|[^%])%${fmt[0]}`, 'g'));
    if(m) return [fmt[1](new Date()), m[0].length]
  }

  for(let i = -12; i < 13; i++){
    for(let fmt of fmts){
      let pat = i >= 0 ? `%(\\+)?${i}${fmt[0]}` : `%${i}${fmt[0]}`
      let m = str.match(new RegExp(`(^|[^%])${pat}`, 'g'));
      if(m) return [fmt[1](getZoneTime(i)), m[0].length]
    }
  }
  return null;
}

function find_next_paran(str, pos){
  let count = 0;
  if(str[pos] != '(') return;
  for(let i = pos; i < str.length; i++){
    if(str[i] == '(') count++;
    else if(str[i] == ')') count--;
    if(!count) return i;
    else if(count < 0) return;
  }
}

// console.log(argfmt(['$user', '$args', '$cont', '$url', '$1', '$[2-4]', '$$user', '$[-]'], 'zxc', 'arg0 arg1 arg2 arg3 arg4 arg5 arg6', 'https://drrr.com'));
// console.log(argfmt(['$args'], 'zxc', 'arg0 $1 $2', 'https://drrr.com'));
// console.log(argfmt(['$1'], 'zxc', 'arg0 $args $2', 'https://drrr.com'));
// console.log(argfmt(['$1 $args'], 'zxc', 'arg0 $args $2', 'https://drrr.com'));
// console.log(timefmt('%hh %8hh %+7hh %+9hh %1hh'));
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

require('../setting/script/lambdascript');
require('./globals');
console.log(argfmt(['$args'], 'zxc', 'arg0 $1 $2', 'https://drrr.com'));
//
console.log(argfmt(["$op('$user'.substring(1))"], "z'xc", 'arg0 $1 $2', 'https://drrr.com', console.log))
argfmt(["$call((a, b) => [b, a])", "$user", "%hh"], 'zxc', 'arg0 $1 $2', 'https://drrr.com')
*/
