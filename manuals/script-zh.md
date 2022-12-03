浪語介紹
===

一種 JavaScript 的方言，因為由浪打所創因而得名。

## 資料型態

資料型態大概以下這些：

### Boolean
```javascript=
true
false
```

### Number
```javascript=
-1
0
3.14
```

### String
```javascript=
"hello, lambda!"
'hello, lambda!' // 從 1.783 開始支援
```
目前不允許單引號字串，如 `'hello'`。

### Array
```javascript=
[1,2,3,4]
```

### Object
```javascript=
obj = {x: 1.34, y: 4.5}
obj.y = 4
```
literal 基本上和 JS 一樣，但沒有 `{[x]: 3}` 這種用法。
基本上還是需要使用 `{}[x] = 3`。

### Function
```javascript=
a => a + 1
(a, b) => a + b
```

基本上用法和 JS 一樣，不過在 event 關鍵字後，可以使用 pattern matching。

## 實作

因為這個語言會被 JavaScript 直譯，

所以 JS 裡的物件其實都能在這個語言裡面進行構造、使用。

由於參考到 JS 的 globalThis，所以你也可以直接使用 global 裡面的東西。

```javascript=
console.log("hello world");
alert("it's a alert!");
```

![每三十秒使用一言 API 換一次部屋描述。](https://i.imgur.com/gh6i2fl.png)

這個語言也可以發 ajax，可以實作一些有趣的功能。

```javascript=
fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
    pprint(result.hitokoto);
});
```

※ 測試姬 /baka yande.re 指令復現（nsfw 警告）

```javascript=
event[me,msg](u,m:"^/baka yande.re")=>$.get("https://yande.re/post.json?limit=1&page="+Math.floor(Math.random()*1e4),d=>drrr.dm(u,".",d[0].preview_url))
```

## 語法

基本的 `+`, `-`, `*`, `/` 運算子都有支援，`+=`, `++`, `--` 之類的也有。

### cond

目前支援 if then else 語法，但 switch 沒有支援。

注意這裡的 if else 是 expression，then 可寫可不寫。可以省略 if 的括號。
```javascript=
if 1 then 2 else 3
// => 2
if 0 then 1
// => false
if(x == 3) then { "hello" } else { "world" }
```

### loop

迴圈語法支援 while, for loop, for in, for of，基本上和 JS 一樣，但沒有 do while。亦支援 break 和 continue。

迴圈的小括弧可以省略。

```javascript=
// for(i = 0; i < 10; i++) is also good
for i = 0
    i < 10
    i++
    pprint(i)

j = 0
while(j < 3){
  pprint(j);
  j++;
}

for(i of [1,2,3,4]) pprint(i);
for(j in {tom: 1, allen: 2}) pprint(j);
```

### function

沒有支援 function 語法，僅支援 arrow function，預設回傳最後一個 expression。亦支援 return 語法。

```javascript=
f = (x) =>
  if x <= 0 then 0
  else if x == 1 then 1
  else f(x - 1) + f(x - 2)

[0, 1, 2, 3, 4, 5, 6].map(f)
// => [0,1,1,2,3,5,8]
```

Scope `{}` 如果被當作參數，或者是 right value 綁定時，會被 lift 成沒有參數的 function。

```javascript=
f = (a, b) => a + b;
pprint(f(1, 4)) // 5

g = { args[0] + args[1] };
pprint(g(1, 2)) // 3
```

跟 JS 的 arguments 一樣，在 function 或是 lifted scope 中，浪語的 args 可以拿到參數列。

使用 `=` 就會在當前的 scope 宣告並初始該變數，該行為和 python 一樣，而 js 會把該變數直接初始在 global。
但是遇到 global 存在的變數時，`=` 會去更新該個變數，而不是在當前 scope 宣告新的變數，這點則是和 python 不同，和 js 比較類似的地方。
當你想要在當前 scope 宣告和 global 重複的變數的話，可以使用 `let`。

ex: `let x, y = 2 + 2;`

### builtins

我提供了一些和 drrr 有關的 function，綁定在 drrr 這個物件中。

```javascript=
drrr.title("設定部屋名稱")

drrr.descr("設定部屋描述")

drrr.print("發送訊息")

drrr.dm("人名", "私訊訊息")

drrr.chown("人名") // 更換房主

drrr.leave() // 離開部屋

drrr.play("關鍵字", "音源", "數字")
// 後兩個參數是選擇性，和插件的 play 一樣。
// 可以綁定以下 event 供使用者調用
event msg (user, msg: "^/play") => {
  word = argfmt(["$[1-]"], user, msg)[0]
  drrr.play(word)
}

drrr.join("房間 ID")

drrr.create("房間名稱", "房間描述", 房間人數:數字, "語系")
// 基本上都有預設參數，所以要傳幾個參數都行

drrr.log("log info")
// 在終端頁面印出來

// 還有一些幫你抓好的變數
drrr.loc // 現在位置（大廳或房間 "lounge" / "room"）
drrr.profile // 個人訊息
drrr.room // 房間訊息
drrr.users // 房間成員
drrr.info // 跟個人訊息有點像
drrr.rooms // 所有房間，大廳狀態

// 有時你會需要更新，可以透過以下函數去更新他們
drrr.getLounge(callback);
drrr.getProfile(callback);
drrr.getLoc(callback);

// 像是 js 裡面的 globalThis 一樣 (global scope)
// 有時候在瀏覽器會被 alias 成 window, top
// 而在 nodeJS 裡會被 alias 成 global
// 如果你想要用 script 的 global scope 可以用 top
top.x = 3
console.log(x) // 3
```

目前浪語裡，除了先前提到的保留字外，還有一些特殊的關鍵字：

### state

宣告一個 state，與 going 搭配使用，有自己的 scope。

但 going 是直接跳去那個地方不會回來。

如果你要回來的話，請使用 visit。

目前的 visit 是使用 dynamic scoping， 而 going 是 static scoping。

~~也新增了 push, pop 語法，使用 push 後會轉移到新的 state, 和 going 一樣，不過會像 visit 一樣保留上個 state 執行的位置，使用 pop 可以回到上一個 state。pop 不用給 state name。~~ 仍有語義上的實作問題。

```javascript=
state welcome {
  pprint("hello world");
  going bye
}

state bye {
  pprint("bye");
  // done.
}

going welcome
```

```javascript=
state welcome {
  pprint("hello world");
  going bye
}

state bye {
  pprint("bye");
    // because "visit welcome", so back to visit
}

visit welcome
// back from bye
pprint("done");
// done.
```


如果 state 後接著的是 function 的話，可以用參數去 call 它。
```javascript=
state t(a, b) => {
    console.log(a, b);
    pop;
}

push t(5, 6);
// pop 會回到這裡

state s (a, b) => {
    console.log(a, b);
}
visit s(3, 4);
going s(1, 2);
// 使用 going 後不會回來
```

### event

處理相關事件，event 種類和 event action 裡的說明一樣。

```javascript=
// 冒號 (:) 後面是 RegExp，如果匹配才呼叫。
// 適用於 user 和 content （第一和第二個參數）
event msg (user: "lambda", content, tc, url, req) => {
  drrr.print(user + " 叫了一下");
}

// 參數個數和名稱都可以任意，看你需求
event join (user) => {
  drrr.print("welcome " + user);
}
```

### timer

用於定時執行 function。

```javascript=
// 單位是 ms，所以 10000 是十秒
timer 10000 pprint("hello world"); // print 會被自動 lift 成 function

// 三十秒使用一言換一次部屋描述
timer 30000 fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
drrr.descr(result.hitokoto);
});

// 等價於第一個範例
timer 10000 {
  pprint("hello world");
}

// parse error, 10000() is not a function call
// works after 1.783
timer 10000 () => {
  pprint("hello world");
}
```

### later

用於延遲執行 function，和 timer 很像，但是只執行一次。

```javascript=
later 10000 pprint("hello world")
f = () => console.log("hello world")
later 3000 f // 可以
later 3000 f() // 這樣才會在三秒後印出 hello world
later 3000 () => console.log("hello world") // parse error, 3000() is not a function call, works after 1.783
later 3000; () => console.log("hello world") // works, good
later 3000; (a, b) => console.log("hello world") // fine, too
later 3000 console.log("hello world") // 這個也會正常運作
later 3000 {
  console.log("hello world") // 這個也會正常運作
}
```

※ 注意 timer 和 later 在時間到了的時候去 eval 你的 expression, 如果 eval 結果是 function 的話，會給他參數。而如果此 function 的結果還是 function 的話，他會一直重複上述行為。

### new/delete

這兩個關鍵字用法和 JS 相同。

### statement lifting

像是 scope `{}` 在 expression 中會被 lift 成 function 一樣, 其他的 statement 像是 `for`, `while`, `event`, `timer`, `later`, `going`, `visit`, `push`, `pop` 也有同樣的特性。

```javascript=
f = for i of args { console.log(i); }
f(1, 2, 3)
// 1 2 3

f = later 1000 (a, b, c) => {
  console.log("hello", args, a, b, c);
}
f(1, 2, 3)
// hello [1, 2, 3] 1 2 3
```

Lifted functions 和 normal functions 有一個叫做 tick 的小小區別。

Lifted functions 不能在他宣告的 state 外被執行。

```javascript=
let f;
state tick {
  f = { console.log("tick"); }
  f(); // show tick
  pop;
}

push tick;
console.log(f) // still a function
f(); // not show tick
```

## 範例

一些功能實作：

歡迎回來功能：

```javascript=
guests = drrr.users.map((x)=>x.name);
event join (user) => {
  if guests.includes(user)
  then drrr.print("welcome back, " + user)
  else guests.push(user)
}
pprint(guests)
```

猜數字遊戲：

```javascript=
valid = (digits) =>
  (new Set(digits.split(""))).size === 4

generate = () => {
  while(!valid(digits = String(Math.floor(1000 + Math.random() * 9000))));
  digits
}

gnjdg = (guess, callback) => {
  if(valid(guess)) then {
    d = theNumber.split("")
    g = guess.split("")
    c = g.map((v)=>d.includes(v)).reduce((a, b)=>a+b)
    a = g.map((v, idx)=>d[idx] === g[idx]).reduce((a, b)=>a+b)
    b  = c - a
    callback(
      if(a === 4) then
        "Your Number is Correct"
      else
        guess + ":" + String(a) + "A" + String(b) + "B"
    )
  } else callback("guess number must be 4 non-repeat digits" + guess);
}

theNumber = generate()
event msg (user, cont: "^\\d\\d\\d\\d$") => gnjdg(cont, drrr.print)
event msg (user, cont: "^new$") => theNumber = generate()
event msg (user, cont: "^ans$") => drrr.print(theNumber)
```

歡迎貴賓：

```javascript=
// 房間上限 9.0001 人
event join (user) => {
  if drrr.users.length == 10
  then drrr.print("/me恭喜成為 0.0001 人，你終於不做人類了嗎！");
  else drrr.print("/me歡迎第 " + String(drrr.users.length) + " 個貴賓！");
}
```

![](https://i.imgur.com/qB8pRM5.png)