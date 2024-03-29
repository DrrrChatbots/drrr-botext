
/* for background scripts only */

reg_table = {sync: {}, local: {}};

function Handler(hname, uis, events){
  for(let k in uis) uis[k].bind(hname, k);

  for(let p in events){
    for(let k in events[p]){
      let e = events[p][k];
      // console.log("making", k);
      /* use IIFE avoid fucking side effect !! */
      let lift = (function(event_name, event_func){
        return function(req, pconfig, sender, syncConfig){
          if(event_func.precond(pconfig, uis)){
            event_func.onevent(req, pconfig, uis, sender, syncConfig);
          }
        }
      })(k, e);
      if(k in reg_table[p]) reg_table[p][k].push(lift);
      else reg_table[p][k] = [lift];
    }
  }

  this.bindEvents = ($) =>{ for(ui of uis) ui.bindEvents($, uis); }
  this.ui = function(config){
    //alert(this.hname)
    return uis.map((ui)=>ui.html(config)).join('');
  }
}

function ajax(request){
  console.log(request);
  $.ajax(request);
}

