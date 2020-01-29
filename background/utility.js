
reg_table = {}

function Handler(hname, uis, events){
    for(k in uis) uis[k].bind(hname, k);
    for(k in events){
        var e = events[k];
        console.log("making", k);
        /* use IIFE avoid fucking side effect !! */
        var lift = (function(event_name, event_func){
            return function(req, callback, config, sender){
                if(event_func.precond(config, uis)){
                    console.log(`handling ${hname} ${event_name}`);
                    event_func.onevent(req, callback, config, uis, sender);
                } else console.log(`pass ${hname}`);
            }
        })(k, e);
        if(k in reg_table) reg_table[k].push(lift);
        else reg_table[k] = [lift];
    }
    this.bindEvents = ($) =>{ for(ui of uis) ui.bindEvents($, uis); }
    this.ui = () => uis.map((ui)=>ui.html()).join('');
}
