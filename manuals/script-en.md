LambdaScript Introduction
===

A kind of JavaScript dialect,
it was named because it was created by lambda.

## Data Types

Following are the data types:

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
'hello, lambda' // since version 1.783
```

single quote string is now allowed, like `'hello'`.

### Array
```javascript=
[1,2,3,4]
```

### Object 
```javascript=
obj = {x: 1.34, y: 4.5}
obj.y = 4
```

literal is same with JS basically, but there's no usage such as `{[x]: 3}`.
You still need the assignment: `{}[x] = 3`.

### Function
```javascript=
a => a + 1
(a, b) => a + b
```

Basic usage is same as JS, but you can use pattern matching after the keywork "event".

## Implementation

The language is interpreted by JavaScript,
so all the objects in JS could be constructed and used.

Because refer the globalThis of JS, so you can use variables defined in global directly.

```javascript=
console.log("hello world");
alert("it's a alert!");
```

![Use hitokoto API change room desc every 30 secs](https://i.imgur.com/gh6i2fl.png)

The difference between LambdaScript and JavaScript is that, everything in LambdaScript has it own return value.

There is no undefined in the language, instead, it return false for you.

semicolon (;) could be omit in most cases, or you can use semicolon to return false.

The values of all the first refered variable would be false if they don't exist in the environment.

```javascript=
print(x)
// not defined, show false (before v1.740 is {}, false after v1.740)
```

You can also emit ajax in the language, which let you implement some interesting functionalities.

```javascript=
fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
    print(result.hitokoto);
});
```

※ 測試姬 (baka bot) /baka yande.re command recurrent（nsfw warning）

```javascript=
event[me,msg](u,m:"^/baka yande.re")=>$.get("https://yande.re/post.json?limit=1&page="+Math.floor(Math.random()*1e4),d=>drrr.dm(u,".",d[0].preview_url))
```

## Syntax

`+`, `-`, `*`, `/` operators are supported，`+=`, `++`, `--`, too. But ternary if-else operator is not supported now.

### cond

if then else syntax is supported now, but there is no switch syntax.

Note the if else is expression, and you need "then" keyword. You can omit the parentheses of if condition.

```javascript=
if 1 then 2 else 3
// => 2
if 0 then 1
// => false
if(x == 3) then { "hello" } else { "world" }
```

### loop

loop syntax supports while, for loop, for in, for of. They are same as JS's basically. But do ... while is not supported now.

The parentheses of loop can be omitted.

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

There's no function keyworkd, you can use arrow function syntax to define a function. It return the last expression by default.

```javascript=
f = (x) =>
  if x <= 0 then 0
  else if x == 1 then 1
  else f(x - 1) + f(x - 2)

[0, 1, 2, 3, 4, 5, 6].map(f)
// => [0,1,1,2,3,5,8]
```

Scope `{}` if be treated as argument or right value to be binded, it would be lift to a function without parameter.

```javascript=
f = (a, b) => a + b;
print(f(1, 4)) // 5

g = { args[0] + args[1] };
print(g(1, 2)) // 3
```

Like the keyword "arguments" in JS, in function or lifted scope, the "args" keyword provide you the argument list.


### builtins

I provide some drrr related function, and bind them in the drrr object.

```javascript=
drrr.title("room name")

drrr.descr("room desc")

drrr.print("public message")

drrr.dm("user name", "dm message")

drrr.chown("user name") // change host

drrr.leave() // leave room

drrr.play("keyword", "music src", "index number")
// the later 2 arguments are optional, like "play" in extension
// you can bind the event below to provide the function for user
event msg (user, msg: "^/play") => {
  word = argfmt(["$[1-]"], user, msg)[0]
  drrr.play(word)
}

drrr.join("room ID")

drrr.create("room name", "room desc", room limit:number, "language")

// Basically there are preset parameters, so you have to pass several parameters

// some pre-defined variable
drrr.loc // current location ("lounge" / "room")
drrr.profile // your profile
drrr.room // room info
drrr.users // room member
drrr.info // similar to profile api
drrr.rooms // All rooms, lounge state

// Sometimes you will need to update, you can update them through the following function
drrr.getLounge(callback);
drrr.getProfile(callback);
drrr.getLoc(callback);
```

At present, in addition to the reserved words mentioned earlier, there are some special keywords in LambdaScript:

### state

Declare a state, use it with going, and have its own scope.

But going is to jump to that place and won't come back.

If you want to come back, please use visit.

The current visit uses dynamic scoping, while going is static scoping.

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

To handle related events, the type of event is the same as the description in event action.

```javascript=
// The colon (:) is followed by RegExp, and it will be called if it matches.
// Applies to user and content (first and second parameters)
event msg (user: "lambda", content, url, tripcode, req) => {
  drrr.print(user + " 叫了一下");
}

// The number and name of the parameters can be arbitrary, depending on your needs
event join (user) => {
  drrr.print("welcome " + user);
}
```

### timer 

It is used to execute the function regularly.

```javascript=
// The unit is ms, so 10000 is ten seconds
timer 10000 print("hello world"); // print would be lifted as a function automatically

// Use hitokoto to change the description of the house every 30 seconds
timer 30000 fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
drrr.descr(result.hitokoto);
});

// Equal to first example
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

Used to delay the execution of a function, which is similar to a timer, but only executes once.

```javascript=
later 10000 print("hello world")
// 注意以下 function 不會被呼叫
f = () => console.log("hello world")
later 3000 f // wouldn't be called, because f will be lifted, it return a function instead of a function call on the time point.
later 3000 f() // print "hello world" after 3 secs
later 3000 () => console.log("hello world") // parse error, 3000() is not a function call, works after 1.783
later 3000; () => console.log("hello world") // works, good
later 3000; (a, b) => console.log("hello world") // fine, too
later 3000 console.log("hello world") // works
later 3000 {
  console.log("hello world") // works
}
```


※ Note "timer" and "later" will lift "non-lambda expression" to a "lambda expression", and eval it on the time point. 

### new/delete

The two keyword is same with JS.

## Example

Some sample code:

Welcome back:

```javascript=
guests = drrr.users.map((x)=>x.name);
event join (user) => {
  if guests.includes(user)
  then drrr.print("welcome back, " + user)
  else guests.push(user)
}
print(guests)
```

Guess The Number Game:

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

Welcome the Guests:

```javascript=
// room limit 9.0001 people
event join (user) => {
  if drrr.users.length == 10
  then drrr.print("/meWelcome to be the 0.0001 persion, have you finally stopped being a human?!");
  else drrr.print("/meWelcome the " + String(drrr.users.length) + " Guest！");
}
```

![](https://i.imgur.com/qB8pRM5.png)
