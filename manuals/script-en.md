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

You can also emit ajax in the language, which let you implement some interesting functionalities.

```javascript=
fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
    pprint(result.hitokoto);
});
```

※ 測試姬 (baka bot) /baka yande.re command recurrent（nsfw warning）

```javascript=
event[me,msg](u,m:"^/baka yande.re")=>$.get("https://yande.re/post.json?limit=1&page="+Math.floor(Math.random()*1e4),d=>drrr.dm(u,".",d[0].preview_url))
```

## Syntax

`+`, `-`, `*`, `/` operators are supported，`+=`, `++`, `--`, too.

### cond

if then else syntax is supported now, but there is no switch syntax.

Note the if else is expression, and "then" keyword is optional. You can omit the parentheses of if condition.

```javascript=
if 1 then 2 else 3
// => 2
if 0 then 1
// => false
if(x == 3) then { "hello" } else { "world" }
```

### loop

loop syntax supports while, for loop, for in, for of. They are same as JS's basically. But do ... while is not supported now. `break` and `continue` syntax also support now.

The parentheses of loop can be omitted.

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

There's no function keyworkd, you can use arrow function syntax to define a function. It return the last expression by default. `return` syntax also support now.

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
pprint(f(1, 4)) // 5

g = { args[0] + args[1] };
pprint(g(1, 2)) // 3
```

Like the keyword "arguments" in JS, in function or lifted scope, the "args" keyword provide you the argument list.

You can declare and initialize the variable in current scope by using `=`, the behavior is same as Python, while JavaScript will initialize the variable in global.

But if the variable exists in global, the `=` operator will update the variable instead of declare it in current scope, it is different from Python, and more similar to JavaScript.

If you want to declare the variable that already existed in global in current scope, you can use `let`.

ex: `let x, y = 2 + 2;`


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

drrr.log("log info")
// print in script console

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

// like globalThis in js (global scope)
// sometimes be alias to window, top in browser
// and global in nodejs
// if you want to use script global scope, use top
top.x = 3
console.log(x) // 3
```

At present, in addition to the reserved words mentioned earlier, there are some special keywords in LambdaScript:

### state

Declare a state, use it with going, and have its own scope.

But going is to jump to that place and won't come back.

If you want to come back, please use visit.

The current visit uses dynamic scoping, while going is static scoping.

`push` and `pop` syntax for state are also supported, the state will transfer to new state after you use `push`, but `push` will keep the execution position of last state, you can use `pop` to back to the previous state. Note that you don't need to give state name for `pop`.

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

You can also use argument to call the state:

```javascript=
state t(a, b) => {
    console.log(a, b);
    pop;
}

push t(5, 6);
// pop will back to here

state s (a, b) => {
    console.log(a, b);
}
visit s(3, 4);
going s(1, 2);
// no back after going
```



### event

To handle related events, the type of event is the same as the description in event action.

```javascript=
// The colon (:) is followed by RegExp, and it will be called if it matches.
// Applies to user and content (first and second parameters)
event msg (user: "lambda", content, tc, url, req) => {
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
timer 10000 pprint("hello world"); // print would be lifted as a function automatically

// Use hitokoto to change the description of the house every 30 seconds
timer 30000 fetch("https://v1.hitokoto.cn")
  .then(response => response.json())
  .then(result => {
drrr.descr(result.hitokoto);
});

// Equal to first example
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

Used to delay the execution of a function, which is similar to a timer, but only executes once.

```javascript=
later 10000 pprint("hello world")
f = () => console.log("hello world")
later 3000 f // works
later 3000 f() // print "hello world" after 3 secs
later 3000 () => console.log("hello world") // parse error, 3000() is not a function call, works after 1.783
later 3000; () => console.log("hello world") // works, good
later 3000; (a, b) => console.log("hello world") // fine, too
later 3000 console.log("hello world") // works
later 3000 {
  console.log("hello world") // works
}
```

※ Note "timer" and "later" will eval your expression on the timestamp you set, if the result is a function, it will feed arguments to it, and the result of the function call is still a function, the above actions will be continue repeating.

### new/delete

The two keyword is same with JS.

### statement lifting

Like scope `{}` will be lifted as function in expressions, other statement like `for`, `while`, `event`, `timer`, `later`, `going`, `visit`, `push`, `pop` have the same feature.

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

Lifted functions and normal functions have a difference that named tick.
The lifted functions cannot be executed ouside the state they declared.

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
pprint(guests)
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