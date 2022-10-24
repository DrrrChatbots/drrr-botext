#!/bin/node

// TODO: add stack trace on machine exception

import {
  lexer as LambdaLexer
} from "./lambda-lexer.mjs";

import { Parser
  , validRegExp, showError, assign_tokens
  , callOF, liftGP, liftNF, removeTok
  , State, Visit, Going, Event, /* Return, */ Timer, Later
  , Unary, Binary, Prefix, Postfix, LArray, LObject
  , Ifels, Group, While, Assignment
  , Call, Lambda, Val, Var, Sym, Void, Proc
} from "./parse-lambda.mjs";

const DUMP = false;
const NONE = undefined;

function MachineException(type, value,
  token = null, message = "") {
  this.type = type;
  this.value = value;
  this.token = token;
  this.message = message;
}

MachineException.prototype.toString = function() {
  return "MachineException: " + this.type + '"';
}

/* utility functions */
function padArray(array, length, fill){
  return array.concat(Array(Math.max(
    length - array.length, 0)).fill(fill));
}

function evalUnary(op, val, tok){
  if(op == "!")
    return (!val);
  else if(op == '~')
    return (~val);
  else if(op == '+')
    return (+val);
  else if(op == '-')
    return (-val);
  else if(op == 'typeof')
    return (typeof val);
  else if(op == 'void')
    return (void val);

  throw new MachineException(
    "ImplError", null, tok,
    `ImplError: Unsupported unary operator ${op}`
  );
}

function evalBinary(op, lval, rval, tok){
  if(op == "%")
    return (lval % rval);
  else if(op == "/")
    return (lval / rval);
  else if(op == '*')
    return (lval * rval);
  else if(op == '+')
    return (lval + rval);
  else if(op == '-')
    return (lval - rval);
  else if(op == '**')
    return (lval ** rval);
  else if(op == '>')
    return (lval > rval);
  else if(op == '>=')
    return (lval >= rval);
  else if(op == '<')
    return (lval < rval);
  else if(op == '<=')
    return (lval <= rval);
  else if(op == '==')
    return (lval == rval);
  else if(op == '!=')
    return (lval != rval);
  else if(op == '===')
    return (lval === rval);
  else if(op == '!==')
    return (lval !== rval);
  else if(op == "|")
    return (lval | rval);
  else if(op == "^")
    return (lval ^ rval);
  else if(op == "&")
    return (lval & rval);
  else if(op == "<<")
    return (lval << rval);
  else if(op == ">>")
    return (lval >> rval);
  else if(op == ">>>")
    return (lval >>> rval);
  else if(op == 'in'){
    if(!(rval instanceof Object))
      throw new MachineException(
        "TypeError", op, tok,
        `TypeError: Cannot use 'in' operator to search for ${lval} in ${rval}`
      );
    return (lval in rval);
  }
  else if(op == 'instanceof')
    return (lval instanceof rval);
  else if(op == ',')
    return rval;

  throw new MachineException(
    "ImplError", null, tok,
    `ImplError: Unsupported binary operator ${op}`
  );
}

class Machine {
  constructor(script, error = console.error.bind(console)){
    let {states, stmts} = script
      || {states: [], stmts: []};
    this.cur = "";
    this.tick = 0;
    this.val = NONE;
    this.timers = {};
    this.events = {};
    this.top = pushEnv();
    this.states = states;
    this.scops = [stmts];
    this.stmts = null;
    this.stmt = null;
    this.env = this.top;
    this.error = error;
  }

  destructor(){
    this.clearAllTimer();
    this.clearAllEvent();
  }

  setTimer(state, prd, act){
    this.timers[state] = this.timers[state] || [];
    this.timers[state].push(setInterval(act, prd));
  }

  clearTimer(state){
    if(this.timers[state])
      for(let id of this.timers[state])
        clearInterval(id);
    this.timers[state] = [];
  }

  clearAllTimer(){
    for(let s in this.timers){
      for(let id of this.timers[s]){
        clearInterval(id);
      }
      delete this.timers[s];
    }
  }

  clearAllEvent(){
    this.cur = "";
    this.events = {};
  }

  listen(types, next){
    let state = this.cur;
    this.events[state] = this.events[state] || [];
    this.events[state].push([types, next])
  }

  tryUndef(ev){
    let val = NONE;
    try {
      val = ev();
    }
    catch(e){
      if(e.type == "ReferenceError"){
        return undefined;
      }
      throw e;
    }
    return val;
  }

  // may throw exception, and execute need catch it
  eval(env, expr){
    switch(expr.type){
      case 'arrow': {
        let vars = expr.pars.map(([v, p]) => v)
        let guards = expr.pars.map(([v, p]) => p)
                         .map(p => p && this.eval(env, p));
        for(let i = 0; i < guards.length; i++){
          let g = guards[i];
          if(!['function', 'string', 'undefined'].includes(typeof g)
            && !(g instanceof RegExp)){
            throw new MachineException(
              "TypeError", g, expr.pars[i][1].tok,
              `TypeError: Function guard must be function or string or undefined, get ${typeof g}`);
          }
          if(typeof g == 'string'){
            let regexp = validRegExp(g)
            if(regexp) guards[i] = regexp;
            throw new MachineException(
              "TypeError", g, expr.pars[i][1].tok,
              `TypeError: "${g}" is not a valid RegExp`
            );
          }
        }
        return (_env => (...args) => {
          for(let i = 0; i < guards.length; i++){
            let g = guards[i];
            if(typeof g == 'function' && !g(args[i]))
              return NONE;
            else if(g instanceof RegExp){
              if(typeof args[i] !== 'string'
                || !args[i].match(g))
                return NONE;
            }
            else if(typeof g === 'undefined')
              continue;
            else throw new MachineException(
              "TypeError", g, expr.pars[i][1].tok,
              `TypeError: Invalid guard type ${typeof g}`
            );
          }
          let newEnv = pushEnv(_env);
          insert(newEnv, 'args', args);
          vars.forEach((sym, idx) => {
            insert(newEnv, sym, args[idx]);
          })
          let [ok, val] = this.execute(
            newEnv, [[expr.body]], expr.tick || -1);
          return ok ? val : NONE;
        })(env);
      }
      case 'ifels': {
        if(this.eval(env, expr.cond)){
          let [ok, val] = this.execute(env, [[expr.then]])
          if(ok) return val;
          else throw new MachineException(
            "CondError", NONE, expr.then.tok,
            "IfThenError: Something wrong with then statement"
          );
        }
        else if(expr.else){
          let [ok, val] = this.execute(env, [[expr.else]])
          if(ok) return val;
          else throw new MachineException(
            "CondError", NONE, expr.else.tok,
            "IfElseError: Something Wrong with else statement"
          );
        }
        else return NONE;
      }
      case 'prefix':
        if(expr.op == '++' || expr.op == '--'){
          // wrong ++ output on 'a'
          let val = this.eval(env, expr.val);
          if(expr.op == '++') ++val;
          else if(expr.op == '--') --val;
          return this.eval(env,
            Assignment(
              expr.val,
              Val(val, expr.val.tok),
              expr.tok));
        }
        else if(expr.op == 'delete'){
          let lhs = expr.val;
          if(lhs.type == 'binary' && lhs.op == '.'){
            let lval = this.eval(env, lhs.lval)
            let rval = lhs.rval.sym;
            if(typeof lval === 'undefined' || lval === null)
              throw new MachineException(
                "TypeError", lval, lhs.tok,
                `TypeError: Cannot read (.) properties of ${lval}`
              );
            return delete lval[rval];
          }
          else if(lhs.type == 'call' && lhs.op == '[]'){
            let lval = this.eval(env, lhs.func)
            let rval = this.eval(env, lhs.args[0]);
            if(typeof lval === 'undefined' || lval === null)
              throw new MachineException(
                "TypeError", lval, lhs.tok,
                `TypeError: Cannot read ([]) properties of ${lval}`
              );
            return delete lval[rval];;
          }
          else if(lhs.type == 'var'){
            let tab = assocTab(lhs['var']);
            if(tab) delete tab[lhs['var']];
          }
          return delete this.eval(env, expr.val);
        }
        else return evalUnary(expr.op, this.eval(env, expr.val), expr.tok);
      case 'postfix':
        if(expr.op == '++' || expr.op == '--'){
          // wrong ++ output on 'a'
          let val = this.eval(env, expr.val);
          let postval = val;
          if(expr.op == '++') postval++;
          else if(expr.op == '--') postval--;
          this.eval(env,
            Assignment(
              expr.val,
              Val(postval, expr.val.tok),
              expr.tok))
          return val;
        }
        throw new MachineException(
          "ImplError", null, expr.tok,
          `ImplError: Unsupported postfix operator ${expr.op}`
        );
      case 'binary':
        if(expr.op == '='){
          let lhs = expr.lval;
          if(lhs.type == 'binary' && lhs.op == '.'){
            let lval = this.eval(env, lhs.lval)
            let rval = lhs.rval.sym;
            if(typeof lval === 'undefined' || lval === null)
              throw new MachineException(
                "TypeError", lval, lhs.tok,
                `TypeError: Cannot read (.) properties of ${lval}`
              );
            return lval[rval] = this.eval(env, expr.rval);
          }
          else if(lhs.type == 'call' && lhs.op == '[]'){
            let lval = this.eval(env, lhs.func)
            let rval = this.eval(env, lhs.args[0]);
            if(typeof lval === 'undefined' || lval === null)
              throw new MachineException(
                "TypeError", lval, lhs.tok,
                `TypeError: Cannot read ([]) properties of ${lval}`
              );
            return lval[rval] = this.eval(env, expr.rval);
          }
          return save(env, expr.lval['var'],
            this.eval(env, expr.rval));
        }
        else if(assign_tokens.includes(expr.op)){
          return this.eval(env,
            Assignment(
              expr.lval,
              Binary(
                expr.lval,
                expr.op.slice(0, -1),
                expr.rval,
                expr.tok
              ),
              expr.tok
            ));
        }
        else if(expr.op == '||'){
          return this.eval(env, expr.lval)
            || this.eval(env, expr.rval);
        }
        else if(expr.op == '??'){
          return this.tryUndef(() => this.eval(env, expr.lval))
            ?? this.eval(env, expr.rval);
        }
        else if(expr.op == '&&'){
          return this.eval(env, expr.lval)
            && this.eval(env, expr.rval);
        }
        else if(expr.op == '.'){
          let lval = this.eval(env, expr.lval);
          if(expr.optChain) return lval?.[expr.rval.sym];
          if(typeof lval === 'undefined' || lval === null)
            throw new MachineException(
              "TypeError", lval, expr.tok,
              `TypeError: Cannot read (.) properties of ${lval}`
            );
          return lval[expr.rval.sym];
        }
        else return evalBinary(
          expr.op,
          this.eval(env, expr.lval),
          this.eval(env, expr.rval),
          expr.tok,
        );
      case 'object': {
        let obj = {};
        // TODO support computable key
        for(let [k, v] of expr.pairs)
        obj[k] = this.eval(env, v);
        return obj;
      }
      case 'proc': {
        let func = Lambda([], expr.body, expr.tok, this.tick);
        return this.eval(env, func);
      }
      case 'array':
        return expr.cells.map(c => this.eval(env, c));
      case 'val':
        return expr.val;
      case 'var': {
        let val = NONE;
        try {
          val = assocVar(env, expr['var'])
        }
        catch(e){
          if(e.type == "ReferenceError"){
            e.value = expr['var'];
            e.token = expr.tok;
          }
          throw e;
        }
        return val;
      }
      case 'ctor': {
        if(expr.op == 'new'){
          let func = this.eval(env, expr.func);
          let args = expr.args.map(arg => this.eval(env, arg));
          return new func(...args);
        }
        throw new MachineException(
          "ImplError", null, expr.tok,
          `ImplError: Unsupported constructor ${expr.op}`
        );
      }
      case 'call':
        if(expr.op == '()'){
          let lval = null, rvalTok = null;
          let callee = expr.func, func = null;
          if(callee.type == 'binary' && callee.op == '.'){
            lval = this.eval(env, callee.lval)
            let rval = callee.rval.sym;
            rvalTok = callee.rval.tok;
            if(typeof lval === 'undefined' || lval === null)
              throw new MachineException(
                "TypeError", lval, callee.tok,
                `TypeError: Cannot read (.) properties of ${lval}`
              );
            func = lval[rval];
          }
          else if(callee.type == 'call' && callee.op == '[]'){
            lval = this.eval(env, callee.func)
            let rval = this.eval(env, callee.args[0]);
            rvalTok = callee.args[0].tok;
            if(typeof lval === 'undefined' || lval === null)
              throw new MachineException(
                "TypeError", lval, callee.tok,
                `TypeError: Cannot read ([]) properties of ${lval}`
              );
            func = lval[rval];
          }
          else func = this.eval(env, expr.func);

          if(expr.optChain &&
            (typeof func == 'undefined'
              || func === null))
            return undefined;

          if(typeof func !== 'function')
            throw new MachineException(
              "TypeError", func, rvalTok ? rvalTok : expr.func.tok,
              `TypeError: ${func} is not a function (it is a ${typeof func})`
            );

          func = func.bind(lval);

          let args = expr.args.map(
            arg => this.eval(env, arg));
          return func(...args);
        }
        else if(expr.op == '[]'){
          let lval = this.eval(env, expr.func)

          if(typeof lval === 'undefined'
                 || lval === null){
            if(expr.optChain)
              return undefined;
            else throw new MachineException(
              "TypeError", lval, expr.tok,
              `TypeError: Cannot read ([]) properties of ${lval}`
            );
          }

          let rval = this.eval(env, expr.args[0]);
          return lval[rval];
        }
        throw new MachineException(
          "ImplError", null, expr.tok,
          `ImplError: Unsupported call ${expr.op}`
        );
      default:
        throw new MachineException(
          "ImplError", null, expr.tok,
          `ImplError: Invalid ${expr.type} expression`
        );
    }
  }

  // if setTick > 0, it wouldn't execute after the tick
  // if setTick == 0, it would only execute in the tick when it execute
  // if setTick < 0, it would execute whenever
  execute(env, scops, setTick){
    let ok, val = null;
    while(scops.length){
      try {
        [ok, val] = this.execute_(env, scops, setTick);
      }
      catch(e){
        if(e instanceof MachineException){
          this.error(showError(e.token, e.message));
        }
        else {
          this.error(e.stack);
        }
        return [false, undefined];
      }
    }
    return [ok, val];
  }

  findState(stmt){
    let state = this.states.find(s => s.name == stmt.state)
    if(!state) throw new MachineException(
      "StateNotFound", stmt.state, stmt.tok,
      `StateNotFound: Cannot ${stmt.type} state ${stmt.state}`);
    return state.stmt;
  }

  execute_(env, scops, setTick = 0){
    let val = NONE;
    let tick = this.tick;
    while(scops.length){
      let stmts = scops.shift();
      while(stmts.length){

        if(setTick > 0 && this.tick > setTick)
          return [false, undefined];
        else if(setTick == 0 && tick != this.tick)
          return [false, undefined];
        // if (setTick < 0 && true)
        // /* continue executing anyway */ ;

        let stmt = stmts.shift();
        val = NONE;
        switch(stmt.type){
          case 'visit': {
            let stateStmt = this.findState(stmt);
            stmts = [[stateStmt]].concat(stmts);
            break;
          }
          case 'going': {
            if(this.cur.length)
              this.events[this.cur] = [];
            this.tick += 1;
            this.cur = stmt.state;
            let stateStmt = this.findState(stmt);
            setTimeout(() =>
              this.execute(this.env, [[stateStmt]]), 0);
            return [false, undefined];
          }
          case 'event': {
            this.listen(
              stmt.events,
              (_env => (...args) => {
                // TODO: think if add tick on scop vs function
                let [ok, val] = this.execute(_env, [[stmt.body]]);
                while(ok && typeof val == 'function')
                  val = val(...args);
              })(env)
            )
            break;
          }
          // case 'return': {
          //   return [true, this.eval(env, stmt.val)];
          //   break;
          // }
          case 'later':
            setTimeout((_env => () => {
              let [ok, val] = this.execute(_env, [[stmt.body]]);
              while(ok && typeof val == 'function')
                val = val();
            })(env), this.eval(env, stmt.period));
            break;
          case 'timer':
            this.setTimer(
              this.cur,
              this.eval(env, stmt.period),
              (_env => () => {
                let [ok, val] = this.execute(_env, [[stmt.body]])
                while(ok && typeof val == 'function')
                  val = val();
              })(env)
            )
            break;
          case 'while':
            if(this.eval(env, stmt.cond)){
              stmts.unshift(stmt);
              stmts.unshift(stmt.body);
            }
            break;
          case 'floop':
            if(stmt['var']){
              if(!('iter' in stmt))
                throw new MachineException(
                  "ImplError", null, stmt.tok,
                  `ImplError: Unsupported for syntax`
                );
              let [obj, iterCall] = stmt.iter;
              let iter = Object[iterCall](this.eval(env, obj)).values();
              stmts.unshift(
                Group([
                  Assignment(Var("@iter"), Val(iter)),
                  Assignment(Var("@var"), Val(iter.next())),
                  While(
                    Unary("!",
                      Binary(Var("@var"), ".", Sym("done"))),
                    Group([
                      Assignment(stmt['var'],
                        Binary(Var("@var"), ".", Sym("value"))),
                      stmt.body,
                      Assignment(
                        Var("@var"),
                        Call("()",
                          Binary(
                            Var("@iter"),
                            ".", Sym("next")), [])
                      ),
                    ])
                  )
                ])
              );
            }
            else if(stmt.init){
              stmts.unshift(
                Group([
                  stmt.init,
                  While(
                    stmt.cond,
                    Group([
                      stmt.body,
                      stmt.step,
                    ]),
                    stmt.tok
                  )
                ])
              );
            }
            else throw new MachineException(
              "ImplError", null, stmt.tok,
              `ImplError: Unsupported for syntax`
            );
            break;
          case 'group':
            scops.unshift(stmts);
            // NOTE: we need keep the body,
            // so clone a new body as stmts
            stmts = [...stmt.body];
            env = pushEnv(env);
            break;
          default:
            val = this.eval(env, stmt);
        }
      }
      env = popEnv(env);
    }
    return [true, val];
  }

  loop(){
    let [ok, val] = this.execute(this.env, this.scops);
    if(ok) this.val = val;
    return [ok, val];
  }

  step(scops){
    let [ok, val] = this.execute(this.env, scops);
    if(ok) this.val = val;
    return [ok, val];
  }
}

function evalStmt(state, stmt){

}

function runStep(machine, code){

}

/* Environment functions */

function pushEnv(env){
  return {
    lv: (env && env.lv + 1) || 0,
    tab: {},
    root: env || null,
  }
}

function popEnv(env){
  return env && env.root;
}

function topEnv(env){
  if(!env) return env;
  while(env.root)
    env = env.root;
  return env;
}

function assocTab(env, key){
  while(env){
    if(key in env.tab)
      return env.tab;
    env = env.root;
  }
  return null;
}

function assocVar(env, name){
  while(env){
    if(name in env.tab)
      return env.tab[name];
    env = env.root;
  }
  if(name in globalThis)
    return globalThis[name];
  throw new MachineException(
    "ReferenceError", undefined, null,
    `ReferenceError: ${name} is not defined`
  );
}

// update a existed key
function update(env, key, val){
  let tab = assocTab(env, key);
  if(!tab) return false;
  tab[key] = val;
  return true;
}

// update or insert a key
function save(env, key, val){
  if(!env) return val;
  if(!update(env, key, val))
    env.tab[key] = val;
  return val;
}

// insert a new value only
function insert(env, key, val){
  if(!env) return env;
  env.tab[key] = val;
  return env;
}

/* exports */
function compile(code){
  let parser = new Parser({...LambdaLexer});
  let {states, stmts} = parser.parse(code);
  return [stmts];
}

function interact(machine, code){
  let parser = new Parser({...LambdaLexer});
  let {states, stmts} = parser.parse(code);
  return machine.step([stmts]);
}

function execute(code, error, dump = false){
  let parser = new Parser({...LambdaLexer});
  let script = parser.parse(code);
  if(dump)
    console.log(JSON.stringify(removeTok(script), null, 2))
  let machine = new Machine(script, error);
  let [ok, val] = machine.loop();
  return [ok, machine];
}

function main(){
  import('fs').then(({ readFileSync }) => {
    let parser = new Parser({...LambdaLexer});
    let code = readFileSync(process.argv[2] || 0, "utf8");

    try{
      // parser.parse(code);
      // console.log(
      //   JSON.stringify(parser.parse(code), null, 2));
      // console.log(parser.parse(code));
      let [ok, m] = execute(code, undefined, DUMP);
      if(ok && typeof m.val !== 'undefined')
        console.log(`${typeof m.val} => ${m.val}`);
    }
    catch(e){
      console.error(e);
    }
  });
}

if(typeof process != 'undefined'){
  import('url').then(({fileURLToPath}) => {
    if(process.argv[1] === fileURLToPath(import.meta.url)){
      main();
    }
  });
}

export { Machine, compile, execute, interact, insert };
// DOC: new semantics of later and timer (while eval on return function)
// DOC: new syntax of later (later 1000() => drrr.log("hello")) is allowed
// DOC: statement keyword (sometimes event is keyword, sometimes variable?)
// DOC: new tick semantics on lambda and scoping (if continue executing based on states)
// DOC: console.log to drrr.log, no print, support drrr.repeat
// DOC: parsing difference between javascript:
// ```
// console.log
// (3)
// // print 3 in js, while treate no function invocation in lambda script
//
// [1,2,3]
// [0,1]
// // 2 in js ([1,2,3][1]), while treate as two array in lambda script
// ```
// TODO: sometimes the drrr.print or drrr.dm not work
// TEST: all lval check on compile time
// TEST: event callback like timer
// TEST: constraints in parameters
