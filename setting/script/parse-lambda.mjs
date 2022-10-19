#!/bin/node
// TODO: pattern matching, computed attribute
// TODO: make all keyword into reserved

import {
  lexer as LambdaLexer
} from "./lambda-lexer.mjs";

const TRACE = true
const DUMP = false
// var JisonLex = require("./src/jison-lex");
// var lexis = fs.readFileSync("src/lambda.jisonlex", "utf8");
// var lexer = new JisonLex(lexis);

function nimpl(parser){
  console.error(parser.tokls.map(t => `[${t.type}]`).join(' '))
  console.trace();
  throw showError(parser.tokls[0], "ParseError: not implement yet");
}

function validRegExp(pat){
  var ret = null;
  try {
    ret = new RegExp(pat);
  } catch(e) {
    ret = null;
  }
  return ret;
}

const event_types = [
  "me", "leave", "join", "newtab"
  , "msg", "dmto", "dm"
  , "exittab", "exitalarm", "musicbeg", "musicend"
  , "music", "kick", "ban", "unban", "roll"
  // , "new-description", "new-host", "room-profile"
  , "description", "host", "profile"
  , "lounge", "*"]

const literalMap = {
  'true': true,
  'false': false,
  'null': null,
  'undefined': undefined,
}

const key_tokens = ["ident", "number", "string"];
const arith_tokens = ["+", "-"]
const term_tokens = ["**", "*", "/"]

// TODO support (...) operator
//
const assign_tokens = ["=", "+=", "-=", "**=", "*=", "/="
  , "%=", "<<=", ">>=", ">>>=", "&="
  , "^=", "|=", "&&=", "||=", "??="];

const equality_tokens = ["==", "!=", "===", "!=="];

const relational_tokens = [
  "<", "<=", ">", ">=", "in", "instanceof"];

const shift_tokens = ["<<", ">>", ">>>"];

const prefix14 = ["!", "~", "+", "-", "typeof", "void", "delete"];

// constructors
const State = (name, stmt, tok) => ({
  name, stmt, tok,
});

const Visit = (state, tok) => ({
  type: 'visit',
  state,
  tok,
})

const Going = (state, tok) => ({
  type: 'going',
  state,
  tok,
})

const Event = (events, body, tok) => ({
  type: 'event',
  events, body, tok,
})

const Timer = (period, body, tok) => ({
  type: 'timer',
  period,
  body,
  tok,
})

const Later = (period, body, tok) => ({
  type: 'later',
  period,
  body,
  tok,
})

const Binary = (lval, op, rval, optChain, tok) => ({
  type: 'binary', lval, op, rval, optChain, tok
});

const Prefix = (op, val, tok) => ({
  type: 'prefix', op, val, tok,
});

const Postfix = (op, val, tok) => ({
  type: 'postfix', op, val, tok,
});

const LArray = (cells, tok) => ({
  type: "array", cells, tok,

})

const LObject = (pairs, tok) => ({
  type: "object", pairs, tok,

})

const Ifels = (cond, then, els, tok) => ({
  type: "ifels", cond, then, 'else': els, tok,
})

const Group = (stmts, tok) => ({
  type: 'group', body: stmts, tok,
});

const While = (cond, body, tok) => ({
  type: 'while', cond, body, tok
})

// const Floop

const Assignment = (lval, rval, tok) =>
  Binary(lval, "=", rval, false, tok);

const Unary = (op, val, tok) => ({
  type: 'prefix', op, val, tok,
})

const Call = (op, func, args, optChain, tok) => ({
  type: "call", op, func, args, optChain, tok
});

const Lambda = (pars = [], body, tok) => ({
  type: "arrow", pars, body, tok
});

const Val = (val, tok) => ({
  type: "val", val, tok,
});

const Var = (v, tok) => ({
  type: "var", var: v, tok,
})

const Void = (tok) => Val(undefined, tok)

// parser attribute builder

const left_assoc = s => ({
  infix: s, assoc: { l: 1 }
});

const right_assoc = s => ({
  infix: s, assoc: { r: 1 }
});

const noIn =
  noin => cfg => ({
    noIn: noin, ...cfg
  });

const prefix = s => ({
  prefix: s
});

const postfix = s => ({
  postfix: s
});

const mustLval = s => ({
  mustLval: true, ...s
})

const noNL = s => ({
  noNL: true, ...s
})

// ( ... )
const between = s =>
  (open, close) => ({
    open, close
  });

// prefix postfix
// open   close
// right left

// ... ( ... ) or ... [ ... ]
const between_on =
  (left, right, times = 1, non_followed_by) => ({
    left, right, times, non_followed_by
  });

// new ... ( ... )
const prefix_between_on =
  (prefix, beg, end, optbe = false) => ({
    prefix, beg, end, optbe
  });

// ... ? ... : ...
// const ternary =
//   (cond, div) => ({
//     cond, div
//   });

const identP = (p, noIn) => {
  return p.expect("ident");
}

const lnext = lp => s => ({
  lnext: lp, ...s
});

const ops_precedences = [
  // move to expression
  // assign_tokens.map(right_assoc),
  [0,  ["||", "??"].map(left_assoc), [1, 1]],
  [1,  ["&&"].map(left_assoc), [1, 1]],
  [2,  ["|"].map(left_assoc), [1, 1]],
  [3,  ["^"].map(left_assoc), [1, 1]],
  [4,  ["&"].map(left_assoc), [1, 1]],
  [5,  equality_tokens.map(left_assoc), [1, 1]],
  [6,  relational_tokens.map(left_assoc), [1, 0]],
  [7,  shift_tokens.map(left_assoc)], // noIn(0, 0)
  [8,  ["+", "-"].map(left_assoc)],
  [9,  ["*", "/", "%"].map(left_assoc)],
  [10, ["**"].map(right_assoc)],
  [11, prefix14.map(prefix).concat(["++", "--"].map(prefix).map(mustLval))],
  [12, ["++", "--"].map(postfix).map(mustLval).map(noNL)],
  // [["new"].map(prefix)],
  // [[".", "?."].map(left_assoc)
  //             .map(lnext(identP))],
  // identifier name
  // [[lnext(identP)(left_assoc(".")),
  //   lnext(identP)(left_assoc("?.")),
  //   prefix_between_on("new", "(", ")"),
  //   between_on("[", "]"), between_on("(", ")")]],
  // [between("(", ")")]
];

function isLval(expr){
  return expr.type == 'var' ||
    expr.type == 'call' && expr.op == "[]" ||
    expr.type == "binary" && expr.op == ".";
}

function precedence_factory(
  parser, ops, next_ops, [NoInL, NoInR]){
  // may opt below because we can push
  // the correspoding op parsing function
  // instead of do if check (dispatch) in the function
  let prefixes = ops.filter(op => op.prefix);
  let infixes = ops.filter(op => op.infix);
  let postfixes = ops.filter(op => op.postfix);
  // let betweens = ops.filter(op => op.open);

  // let ternarys = ops.filter(op => op.cond);
  let btwnons = ops.filter(op => op.right);

  return function current_ops(NoIn){

    let next = parser.precedences[next_ops].bind(parser);

    for(let op of prefixes){
      if(!op.beg && (
        parser.accept(op.prefix) ||
        parser.reserved(op.prefix))){
        let pt = parser.token;
        let val = current_ops(NoIn);
        if(op.mustLval && !isLval(val))
          throw showError(this.token, `ParseError: operand of ${op.prefix} must be a lval`);
        return Prefix(op.prefix, val, pt);
      }
    }

    // for(op of betweens){
    //   if(parser.accept(op.open)){
    //     // think
    //     let computed = parser.expr(0);
    //     parser.expect("]");
    //     return;
    //   }
    // }

    let matched_op = true;

    let lhs = null;

    for(let op of prefixes){
      if(op.beg && parser.reserved(op.prefix)){
        lhs = {
          type: "ctor",
          op: parser.token.val,
          func: null,
          args: [],
        }
        lhs.func = op.cnext();
        let arglist = [];
        if(op.optbe){
          if(parser.ahead_is(op.beg)){
            lhs.args = parser.list(
              () => parser.expr2(0),
              op.beg, op.end, ",", -1);
          }
          // else no arglist
        }
        else {
          lhs.args = parser.list(
              () => parser.expr2(0),
              op.beg, op.end, ",", -1);
        }
        break;
      }
    }

    lhs = lhs || next(NoInL);

    let optChain = false;
    let optChainTok = null;

    do {
      matched_op = false;
      for(let op of infixes){
        if(NoIn && op.infix == "in") continue;
        if(parser.accept(op.infix) || parser.reserved(op.infix)){
          let bt = parser.token;
          if(op.assoc.l){
            if(op.infix == "?."){
              if(parser.accept("ident"))
                lhs = Binary(lhs, ".", rhs, true, bt);
              else {
                optChain = true;
                optChainTok = bt;
              }
            }
            else {
              let rhs = op.lnext ?
                        op.lnext(parser, NoInR) :
                        next(NoInR);
              lhs = Binary(lhs, op.infix, rhs, false, bt);
            }
            // node = [node, op.sym, rv];
            matched_op = true;
            break;
          }
          else if(op.assoc.r){
            return Binary(lhs, op.infix, current_ops(NoIn), false, bt);
            // return [node, op.sym, current_ops()];
          }
          else throw showError(bt,
                 `ParseError: [TODO] no assoc on infix operator ${op.infix}`);
        }
      }

      for(let op of btwnons){
        if(parser.ahead_is_not_nl(op.left)){

          let ct = parser.tokls[0];

          if(op.non_followed_by)
            parser.rb_record();

          let args = parser.list(
              () => parser[
                op.times == 1 ? 'expr' : 'expr2'
              ](op.noIn && op.noIn[1]),
              op.left, op.right, ",", op.times);

          if(op.non_followed_by){
            if(parser.ahead_is(op.non_followed_by)){
              parser.rb_reset();
              continue;
            }
            else parser.rb_erase();
          }
          matched_op = true;
          lhs = Call(
            `${op.left}${op.right}`,
            lhs, args, optChain, ct,
          );
          optChain = false;
          break;
        }
      }
    } while(matched_op);

    if(optChain)
      throw showError(optChainTok,
        `ParseError: unexpected optChain expr,\n?. should be followed by identifier, (..) or [...],\nget ${JSON.stringify(parser.tokls[0].text, null, 2)}`)

    // for(let op of ternarys){
    //   if(parser.accept(op.cond)){
    //     current_ops(0);
    //     parser.expect(op.div);
    //     current_ops(NoIn);
    //     return; // something
    //   }
    // }

    for(let op of postfixes){
      // NOTE: no postfix op are reserved word
      let consume = op.noNL?
        () => parser.acceptNoNL(op.postfix):
        () => parser.accept(op.postfix);

      if(consume()){
        if(op.mustLval && !isLval(lhs))
          continue;
        return Postfix(op.postfix, lhs, parser.token);
      }
    }
    return lhs;
  }
}

function is_key_token(v){
  return key_tokens.includes(v);
}

function build_ops(parser){

  let newOp = prefix_between_on("new", "(", ")", true);
  let memberOps = [lnext(identP)(left_assoc(".")),
    left_assoc("?."),
    // TODO: support optional chaining
    newOp, between_on("[", "]")]

  let memberExpression = precedence_factory(
      parser, memberOps, 13 + 1, []);

  newOp.cnext = memberExpression.bind(parser);

  let LeftHandSideExpression = [...memberOps, between_on("(", ")", -1, "=>")];

  let new_precs = [...ops_precedences
    , [13, LeftHandSideExpression]];

  new_precs.forEach(([prec, ops, NoIns]) => {
    parser.precedences[prec] = precedence_factory(
      parser, ops, prec + 1, NoIns || []);
  });

  parser.precedences[
    new_precs.length] = parser.factor;
}

class Parser {

  lexer = null;
  token = null;
  tokls = [];
  precedences = {};
  rbpos = [];
  rbtoks = [];
  code = [];

  constructor(lexer){
    this.lexer = lexer;
    build_ops(this);
  }

  rb_record(){
    this.rbpos.push(this.rbtoks.length);
  }

  rb_erase(){
    this.rbpos.pop();
  }

  rb_reset(){
    let pos = this.rbpos.pop();
    this.tokls = this.rbtoks.splice(pos).concat(this.tokls);
  }

  next(ignore){
    if(!ignore && !this.tokls.length)
      throw showError(this.token, "ParseError: zero length of token list on calling next()");

    if(!ignore){
      this.token = this.tokls.shift();
      if(this.rbpos.length)
        this.rbtoks.push(this.token);
      // console.log(`consume ${JSON.stringify(this.token, null, 2)}`)
    }

    if(!this.tokls.length){
      let tok = this.lexer.lex()
      this.tokls.push({
        type: tok,
        text: this.lexer.yytext,
        val: this.lexer.yylval,
        loc: {...this.lexer.yylloc},
        code: this.code,
      });
    }
  }

  peekNonNLIdx(){
    let i = 0;
    while(this.peek(i) == 'nl') i++;
    return i;
  }

  peekNonNL(idx = 0){
    let i = 0, acc = -1;
    while(this.peek(i) != 'EOF'){
      if(this.peek(i) != 'nl')
        acc++;
      if(acc == idx) return this.peek(i);
      i++;
    }
    return 'EOF';
  }

  acceptNoNL(...tokens){
    let p = this.peek();
    let ret = tokens.some(t => t == p);
    if(ret){
      this.next();
    }
    return ret;
  }

  acceptNLs(){
    while(this.peek() == 'nl')
      this.next();
  }

  // auto ignore nl
  accept(...tokens){
    // check if empty tokls
    if(tokens.includes(this.peekNonNL()))
      this.acceptNLs();
    return this.acceptNoNL(...tokens);
  }

  expect(token){
    // console.log(`expect ${token}`)
    if(!this.accept(token)){
      if(TRACE) console.trace();
      throw showError(this.tokls[0],
        `ParseError: expected token [${token}], get [${this.peekNonNL()}]`)
      // console.error(this.lexer.showPosition());
    }
    return this.token.val;
  }

  ahead_is_not_nl(...args){
    // check if empty tokls
    return args.includes(this.peek());
  }

  ahead_is(...args){
    // check if empty tokls
    return args.includes(this.peekNonNL());
  }

  ahead_is_reserved(...args){
    let idx = this.peekNonNLIdx()
    return this.peek(idx) == 'ident'
      && args.includes(this.tokls[idx].val);
  }

  aheads_are(...args){
    // check if empty tokls
    return args.every((v, i) =>
      typeof v == 'function' ?
      v(this.peekNonNL(i)) : v == this.peekNonNL(i));
  }

  peek(k = 0){
    while(!this.lexer.done && k >= this.tokls.length){
      let tok = this.lexer.lex()
      this.tokls.push({
        type: tok,
        text: this.lexer.yytext,
        val: this.lexer.yylval,
        loc: {...this.lexer.yylloc},
        code: this.code,
      });
    }
    return k >= this.tokls.length ?
      null : this.tokls[k].type;
  }

  parse(code){
    this.code = code.split("\n");
    this.lexer.setInput(code);
    this.lexer.opt_t = false;
    this.tokls = [];

    let sym = null;
    if(DUMP) do{
      sym = this.lexer.lex();
      // if(sym == "string")
      //   console.log(this.lexer.yylval);
      // console.log(this.lexer.done)
    } while(sym != "EOF");
    else return this.script();
  }

  list(item, beg, end, delimiter = ",", times = -1){
    let ret = [];
    this.expect(beg)
    let token = this.token;
    while(!this.accept(end)){
      if(times == 0) throw showError(token, `ParseError: too may exprs in ${beg}...${end}`);
      ret.push(item());
      if(times > 0) times -= 1;

      if(times == 0){
        this.expect(end);
        break;
      }
      else if(this.accept(end)) break;

      this.expect(delimiter);
      if(this.accept(end)) break;
    }
    if(times > 0) throw showError(token, `ParseError: insufficient exprs in ${beg}...${end}`)
    return ret;
  }

  // start of the parsing rules

  factor(NoIn){
    // array literal, parens
    if(this.accept("number", "string")){
      return Val(this.token.val, this.token);
    }
    else if(this.reserved(
      "true", "false", "null", "undefined")){
      return Val(literalMap[this.token.val], this.token);
    }
    else if(this.accept("ident")){
      return Var(this.token.val, this.token);
    }
    else if(this.accept("(")){
      let val = this.expr(0);
      this.expect(")");
      return val;
    }
    else if(this.ahead_is("[")){
      let at = this.tokls[0];
      return LArray(this.list(
          () => this.expr2(0), "[", "]", ",", -1), at);
    }
    else if(this.ahead_is("{")){
      // object
      if(  this.aheads_are("{", "}")
        || this.aheads_are("{", is_key_token, ":")
        || this.aheads_are("{", "ident", ",")
        || this.aheads_are("{", "ident", "}")){
        return this.object(0);
      }
      // block
      else{
        this.expect("{");
        let ret = Group([], this.token);
        while(!this.accept("}")){
          ret.body.push(this.stmt());
        }
        return ret;
      }
    }
    else {
      console.log(this.lexer.showPosition());
      let idx = this.peekNonNLIdx();
      throw showError(this.tokls[idx], `ParseError: unexpected token, expected factor`);
    }
  }

  object(NoIn){
    // console.log(`peek ${this.peek()}`);
    // console.log(this.tokls)
    let pairs = [];
    this.expect("{");
    let ot = this.token;
    while(!this.accept("}")){
      if(this.accept.apply(this, key_tokens)){
        let k = this.token.val;
        this.expect(":");
        let v = this.expr2(0);
        pairs.push([k, v]);
        if(this.accept("}")) break;
        this.expect(",");
        if(this.accept("}")) break;
      }
      else {
        let idx = this.peekNonNLIdx();
        throw showError(this.tokls[idx], `ParseError: expected an object key`);
      }
    }
    return LObject(pairs, ot);
  }

  assignment(NoIn){

    let LogicalORExpression = this.precedences[0].bind(this);

    let mayLHS = LogicalORExpression(NoIn);

    // LHSexpr
    // { ids } op=
    // [ ids ] op=
    // Logical

    if(this.accept.apply(this, assign_tokens)){
      let bt = this.token;
      let op = this.token.val;
      if(!isLval(mayLHS))
        throw showError(bt, `ParseError: operand of ${op} must be a lval`);
      return Binary(mayLHS, op, this.expr(NoIn), false, bt);
    }
    else if(this.accept("?")){
      let qt = this.token;
      let tn = this.expr(0);
      this.expect(":");
      let es = this.expr(NoIn);
      return Ifels(mayLHS, tn, es, qt);
    }
    else return mayLHS;
  }

  expr2(NoIn){ // think if support , operator
    // ( ids ) =>
    if(this.reserved("if")){
      let it = this.token;
      let ret = Ifels(
        this.expr(0),
        undefined,
        undefined, it);
      this.reserved("then");
      ret.then = this.stmt(true);
      if(this.reserved("else"))
        ret.else = this.stmt(true);
      return ret;
    }
    else if(this.aheads_are("ident", "=>")
      || this.aheads_are("ident", ":")
      || this.aheads_are("(", ")", "=>")
      || this.aheads_are("(", "ident", ",", "=>")
      || this.aheads_are("(", "ident", ":")
      || this.aheads_are("(", "ident", ",")
      || this.aheads_are("(", "ident", ")", "=>")
    ){
      let ret = Lambda();
      // ident =>
      // ident : expr =>
      // ( ) =>
      // ( ident # , ident # =>
      // ( ident :
      // ( ident ,
      if(this.accept("(")){
        while(!this.accept(")")){
          let sym = this.expect("ident");
          let pat = this.accept(":") ?
                    this.expr2(0) : undefined;

          if(pat && pat.type == 'val' && typeof pat.val == 'string'){
            let regexp = validRegExp(pat.val)
            if(regexp) pat.val = regexp;
            else throw showError(pat.token,
              `ParseError: "${pat.val}" is not a valid RegExp`);
          }

          ret.pars.push([sym, pat]);
          if(this.accept(")")) break;
          this.expect(",");
          if(this.accept(")")) break;
        }
      }
      else{
        let sym = this.expect("ident");
        let pat = this.accept(":") ?
                  this.expr(0) : undefined;

        if(pat && pat.type == 'val' && typeof pat.val == 'string'){
          let regexp = validRegExp(pat.val)
          if(regexp) pat.val = regexp;
          else throw showError(pat.token,
            `ParseError: "${pat.val}" is not a valid RegExp`);
        }

        ret.pars.push([sym, pat]);
      }
      this.expect("=>");
      ret.tok = this.token;
      // no comma
      ret.body = this.stmt(true);
      return ret;
    }
    else return this.assignment(noIn);
  }

  expr(NoIn){ // think if support , operator
    // ( ids ) =>
    let lhs = this.expr2(NoIn);
    while(this.accept(",")){
      let bt = this.token;
      lhs = Binary(lhs, ",", this.expr(NoIn), false, bt);
    }
    return lhs;
  }

  optAccept(v, s){
    this.accept(s);
    return v;
  }

  floop(){
    let ft = this.token;

    let parens = this.accept("(");

    let ret = { type: 'floop' };

    let init = this.accept(";") ?
               Void(this.token) :
               this.optAccept(this.expr(1), ";");

    if(this.reserved("in")){
      // TODO: check is lval
      ret['var'] = init;
      ret['iter'] = [this.expr(0), 'keys'];
      if(parens) this.expect(")");
    }
    else if(this.reserved("of")){
      // TODO: check is lval
      ret['var'] = init;
      ret['iter'] = [this.expr(0), 'values'];
      if(parens) this.expect(")");
    }
    else {
      ret['init'] = init;
      ret['cond'] = this.accept(";") ?
                    Void(this.token) :
                    this.optAccept(this.expr(0), ";");
      if(!parens){
        ret['step'] = this.expr(0);
      }
      else if(!this.accept(")")){
        ret['step'] = this.expr(0);
        this.expect(")");
      }
    }
    ret['body'] = this.stmt();
    ret['tok'] = ft;
    return ret;
  }

  events(){
    let ret = [];
    let parseE = (function(){
      if(this.accept("ident")){
        if(!event_types.includes(this.token.val))
          throw showError(this.token,
            `ParseError: expected a event type, get: ${this.token.val}`);
        ret.push(this.token.val);
      }
      else if(this.accept("string")){
        if(!event_types.includes(this.token.val))
          throw showError(this.token, `ParseError: expected a event type, get: ${this.token.val}`);
        ret.push(this.token.val);
      }
      else if(this.accept("*")){
        ret.push(this.token.val);
      }
      else {
        let idx = this.peekNonNLIdx();
        throw showError(this.tokls[idx], `ParseError: expected a event type`);
      }
    }).bind(this);

    if(this.ahead_is("[")){
      this.list(parseE, "[", "]");
    }
    else parseE();
    return ret;
  }

  reserved(...symbol){
    // state event later timer going visit
    let idx = this.peekNonNLIdx()
    if(this.peek(idx) == 'ident'
      && symbol.includes(this.tokls[idx].val))
      return this.accept("ident");
    return false;
  }

  stmt(noComma){
    if(this.accept(";")){
      return Group([], this.token);
    }

    let ret = null;
    // | parseStmtExpr
    if(this.reserved("while")){
      let st = this.token;
      ret = While(this.expr(0), this.stmt(), st);
    }
    else if(this.reserved("for")){
      ret = this.floop();
    }
    else if(this.reserved("timer")){
      let st = this.token;
      ret = Timer(this.expr(0), this.stmt(), st);
    }
    else if(this.reserved("later")){
      let st = this.token;
      ret = Later(this.expr(0), this.stmt(), st);
    }
    else if(this.reserved("event")){
      let st = this.token;
      ret = Event(this.events(), this.stmt(), st);
    }
    else if(this.reserved("going")){
      let st = this.token;
      ret = Going(this.expect("ident"), st);
    }
    else if(this.reserved("visit")){
      let st = this.token;
      ret = Visit(this.expect("ident"), st);
    }
    else{
      ret = noComma ? this.expr2(2) : this.expr(0);
    }
    this.accept(";");
    return ret;
  }

  state(){
    let st = this.token;
    return State(this.expect("ident"), this.stmt(), st);
  }

  states(){
    let ss = [];
    while(this.reserved("state"))
      ss.push(this.state());
    return ss;
  }

  stmts(){
    let ss = [];
    while(!
      (this.ahead_is_reserved("state")
        || this.ahead_is("EOF"))){
      ss.push(this.stmt());
    }
    return ss;
  }

  script(){
    this.next(true);
    let states = [], stmts = [];
    do{
      states.push.apply(states, this.states())
      stmts.push.apply(stmts, this.stmts())
    } while(!this.accept("EOF"));
    return { states, stmts };
  }
}

function showError(tok, message){
  if(!tok) return message;
  let loc = tok.loc;
  let ret = `${loc.first_line}:${loc.first_column}: ${message}\n`;
  let lastBeg = 0;
  for(let l = loc.first_line - 1; l < loc.last_line; l++){
    let indicator = '';
    if(l == loc.first_line - 1)
      indicator += ' '.repeat(loc.first_column)
    lastBeg = l == loc.first_line - 1 ? loc.first_column : 0;
    let end = l == loc.last_line - 1? loc.last_column : l.length;
    indicator += '^'.repeat(end - lastBeg);
    ret += `${String(l + 1).padStart(5)} | ${tok.code[l]}\n` +
           `      | ${indicator}\n`
  }
  return ret.slice(0, -1);
}

function main(){
  import('fs').then(({ readFileSync }) => {
    let parser = new Parser({...LambdaLexer});
    let code = readFileSync(process.argv[2] || 0, "utf8");
    try{
      // parser.parse(code);
      // console.log(
      //   JSON.stringify(parser.parse(code), null, 2));
      console.log(parser.parse(code));
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

// parser = new Parser({...LambdaLexer});

// https://262.ecma-international.org/5.1/#sec-11.2 parsing

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
//
/*
18	Grouping	n/a	( … )
17	Member Access	left-to-right	… . …
    Computed Member Access	n/a	… [ … ]
    new (with argument list)	n/a	new … ( … )
    Function Call	n/a	… ( … )
    Optional chaining	left-to-right	… ?. …
16	new (without argument list)	n/a	new …
15	Postfix Increment	n/a	… ++
    Postfix Decrement	… --
14	Logical NOT (!)	n/a	! …
  Bitwise NOT (~)	~ …
  Unary plus (+)	+ …
  Unary negation (-)	- …
  Prefix Increment	++ …
  Prefix Decrement	-- …
  typeof	typeof …
  void	void …
  delete	delete …
  await	await …
13	Exponentiation (**)	right-to-left	… ** …
12	Multiplication (*)	left-to-right	… * …
  Division (/)	… / …
  Remainder (%)	… % …
11	Addition (+)	left-to-right	… + …
  Subtraction (-)	… - …
10	Bitwise Left Shift (<<)	left-to-right	… << …
  Bitwise Right Shift (>>)	… >> …
  Bitwise Unsigned Right Shift (>>>)	… >>> …
9	Less Than (<)	left-to-right	… < …
  Less Than Or Equal (<=)	… <= …
  Greater Than (>)	… > …
  Greater Than Or Equal (>=)	… >= …
  in	… in …
  instanceof	… instanceof …
8	Equality (==)	left-to-right	… == …
  Inequality (!=)	… != …
  Strict Equality (===)	… === …
  Strict Inequality (!==)	… !== …
7	Bitwise AND (&)	left-to-right	… & …
6	Bitwise XOR (^)	left-to-right	… ^ …
5	Bitwise OR (|)	left-to-right	… | …
4	Logical AND (&&)	left-to-right	… && …
3	Logical OR (||)	left-to-right	… || …
  Nullish coalescing operator (??)	left-to-right	… ?? …
2	Assignment	right-to-left
  … = …
  … += …
  … -= …
  … **= …
  … *= …
  … /= …
  … %= …
  … <<= …
  … >>= …
  … >>>= …
  … &= …
  … ^= …
  … |= …
  … &&= …
  … ||= …
  … ??= …
  Conditional (ternary) operator	right-to-left (Groups on expressions after ?)	… ? … : …
  Arrow (=>)	n/a	… => …
  yield	yield …
  yield*	yield* …
  Spread (...)	... …
1	Comma / Sequence	left-to-right	… , …
*/

export { Parser, showError,
         Assignment, Group,
         While, Lambda, Call,
         Unary, Binary, Var, Val, Void,
         validRegExp, assign_tokens };
