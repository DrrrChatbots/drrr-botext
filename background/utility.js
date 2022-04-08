
/* for background scripts only */

reg_table = {sync: {}, local: {}};

function Handler(hname, uis, events){
  for(k in uis) uis[k].bind(hname, k);

  for(p in events){
    for(k in events[p]){
      var e = events[p][k];
      console.log("making", k);
      /* use IIFE avoid fucking side effect !! */
      var lift = (function(event_name, event_func){
        return function(req, config, sender){
          if(event_func.precond(config, uis)){
            console.log(`handling ${hname} ${event_name}`);
            event_func.onevent(req, config, uis, sender);
          } else console.log(`pass ${hname}`);
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

