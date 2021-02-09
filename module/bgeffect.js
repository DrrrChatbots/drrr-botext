
export const ui = () => {
  return `
<div class="input-group">
    <!--
    <div class="input-group-btn">
        <button class="btn btn-default" type="button">
            <i class="glyphicon glyphicon-sort-by-order"></i>
        </button>
    </div>
    -->

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>

    <div class="input-group-btn">
        <button id="snow" class="btn btn-default bgeffect" type="button" data-delayed-toggle="collapse">
            <i class="glyphicon glyphicon-cloud"></i>
        </button>
        <button id="firework" class="btn btn-default bgeffect" type="button" data-delayed-toggle="collapse">
            <i class="glyphicon glyphicon-fire"></i>
        </button>
        <button id="elevator" class="btn btn-default bgeffect" type="button" data-delayed-toggle="collapse">
            <i class="glyphicon glyphicon-sort"></i>
        </button>
        <!--
        <button id="visualizer" class="btn btn-default bgeffect" type="button" data-delayed-toggle="collapse">
            <i class="glyphicon glyphicon-cd"></i>
        </button>
        -->
    </div>
</div>`
}


export const ui_event = () => {
  $('.bgeffect').click(function(){
    sendTab({fn: bg_effect, args:{name: this.id}});
  });
}

//export const event_action = () => {
//
//}
