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


```javascript=
print(x)
// not defined, show false (before v1.740 is {}, false after v1.740)
```

這個語言也可以發 ajax，可以實作一些有趣的功能。

```javascript=
fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
    print(result.hitokoto);
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

注意這裡的 if else 是 expression，且需要 then。可以省略 if 的括號。
```javascript=
if 1 then 2 else 3
// => 2
if 0 then 1
// => false
if(x == 3) then { "hello" } else { "world" }
```

### loop

迴圈語法支援 while, for loop, for in, for of，基本上和 JS 一樣，但沒有 do while。目前也不支援 break 和 continue。

迴圈的小括弧可以省略。

```javascript=
// for(i = 0; i < 10; i++) is also good
for i = 0
    i < 10
    i++
    print(i)
    
j = 0
while(j < 3){
  print(j);
  j++;
}

for(i of [1,2,3,4]) print(i);
for(j in {tom: 1, allen: 2}) print(j);
```

### function

沒有支援 function 語法，僅支援 arrow function，預設回傳最後一個 expression。不支援 return 語法。

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
print(f(1, 4)) // 5

g = { args[0] + args[1] };
print(g(1, 2)) // 3
```

跟 JS 的 arguments 一樣，在 function 或是 lifted scope 中，浪語的 args 可以拿到參數列。


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
```

目前浪語裡，除了先前提到的保留字外，還有一些特殊的關鍵字：

### state

宣告一個 state，與 going 搭配使用，有自己的 scope。

但 going 是直接跳去那個地方不會回來。

如果你要回來的話，請使用 visit。

目前的 visit 是使用 dynamic scoping，而 going 是 static scoping。

```javascript=
state welcome {
  print("hello world");
  going bye
}

state bye {
  print("bye");
  // done.
}

going welcome
```

```javascript=
state welcome {
  print("hello world");
  going bye
}

state bye {
  print("bye");
    // because "visit welcome", so back to visit
}

visit welcome
// back from bye
print("done");
// done.
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
timer 10000 print("hello world"); // print 會被自動 lift 成 function

// 三十秒使用一言換一次部屋描述
timer 30000 fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
drrr.descr(result.hitokoto);
});

// 等價於第一個範例
timer 10000 {
  print("hello world");
}

// parse error, 10000() is not a function call
// works after 1.783
timer 10000 () => {
  print("hello world");
}
```

### later 

用於延遲執行 function，和 timer 很像，但是只執行一次。

```javascript=
later 10000 print("hello world")
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

※ 注意 timer 和 later 會將 "非 lambda 的 expression" lift 成一個 lambda expression，然後時間到了再 eval 他。

### new/delete

這兩個關鍵字用法和 JS 相同。

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
print(guests)
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