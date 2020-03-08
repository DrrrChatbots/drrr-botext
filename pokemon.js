
export const ui = () => {
    return `
<div class="input-group">
    <div class="input-group-btn">
        <button class="btn btn-default" type="button">
            <i class="glyphicon glyphicon-text-size"></i>
        </button>
    </div>

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>

    <input id="echo_text" type="text" class="form-control" placeholder="Search Keyword and Play">

    <div class="input-group-btn">
        <button id="echo_trigger" class="btn btn-default" type="button"
                                                               data-delayed-toggle="collapse" data-target="#music_list"
                                                                                              title="show playlist">
            <i id="list_type" class="glyphicon glyphicon-volume-up"></i>
        </button>
    </div>
</div>`
};

export const ui_event = () => {
    $('#echo_trigger').click(()=>{
        alert($("#echo_text").val());
        $("#echo_text").val('');
    });
}
