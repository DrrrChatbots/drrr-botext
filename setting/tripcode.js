
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function dumpTrip(){
    var results = $('.result');
    if(results.length){
        var cont = '';
        for(var i = 0; i < results.length; i++){
            cont += $(results[i]).text() + '\n';
        }
        download('tripcode.txt', cont);
    }
    else alert("No tripcode to download, Do search first");
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    dummy.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function makeid(length, characters) {
    // don't use '>', '<', '&', '"'
    // String.fromCharCode(0x30A0 + Math.random() * (0x30FF-0x30A0+1));
    var result           = '';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

var digits = '0123456789!#$%\'()*+,-./:;=?@[\\]^_`{|}~';
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function randCode(){
    return function(){
        var len = getRandomInt(3) + 6;
        var d = getRandomInt(len - 1) + 1;
        var c = len - d;
        var code = makeid(d, digits) + makeid(c, chars);
        return code.shuffle();
    }
}

function valid_drrrtrip(password){
    var pass = password.split(""), msg = '';
    var d = pass.map((d) => digits.includes(d) ? 1 : 0).reduce((a, b) => a + b);
    var c = pass.map((c) => chars.includes(c) ? 1 : 0).reduce((a, b) => a + b);
    var s = pass.map((c) => ' '.includes(c) ? 1 : 0).reduce((a, b) => a + b);
    if(password.length < 6) msg = 'must longer than 6 characters on drrr.com'
    else if(!(d > 0 && c > 0)) msg = 'at least 1 character and 1 digits'
    else if(d + c + s !== password.length) msg = 'some characters may not guarantee the same transformation on drrr.com'
    console.log(d, c, s);
    return [d + c + s >= 6 && d > 0 && c > 0 && d + c + s === password.length, msg];
}

var O = {
    range: function(from, to) {
        var ar = [];
        for (var i = from; i <= to; i++) {
            ar.push(i);
        }
        return ar;
    },
    /**
     * nPr implements on JavaScript.
     *
     * @params [Integer] n
     * @params [Integer] r
     * @return [Integer] pattern
     */
    permutation: function (n, r) {
        if (n < r) {
            return 0;
        }
        return this.range((n - r) + 1, n).reduce(function(x, y) { return x * y; });
    },
    /**
     * nCr implements on JavaScript.
     *
     * @params [Integer] n
     * @params [Integer] r
     * @return [Integer] pattern
     */
    combination: function (n, r) {
        if (n < r) {
            return 0;
        }
        var a = this.range((n - r) + 1, n).reduce(function(x, y) { return x * y; });
        var b = this.range(1, r).reduce(function(x, y) { return x * y; });
        return a / b;
    }
}

function permut(string) {
    if (string.length < 2) return string; // This is our break condition

    var permutations = []; // This array will hold our permutations
    for (var i = 0; i < string.length; i++) {
        var char = string[i];

        // Cause we don't want any duplicates:
        if (string.indexOf(char) != i) // if char was used already
            continue; // skip it this time

        var remainingString = string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS

        for (var subPermutation of permut(remainingString))
            permutations.push(char + subPermutation)
    }
    return permutations;
}

function genTable(digs, chrs){
    var tot = 0;
    var a = digs.length, b = chrs.length;
    var table = [['', 0]]
    for(var l = 6; l < 9; l++){
        for(var i = 1; i < l; i++){
            var count = (a**i) * (b**(l - i));
            permut('d'.repeat(i) + 'c'.repeat(l - i)).forEach((s)=>{
                tot += count;
                table.push([s, tot])
            })
        }
    }
    return table;
}

var table = genTable(digits, chars);
var tidx = 1;
function find(v){
    try{
        if(v < table[tidx][1]){
            if(v >= table[tidx - 1][1])
                return [table[tidx][0], v - table[tidx - 1][1]];
            else{ tidx -= 1; return find(v); }
        }
        else{ tidx += 1; return find(v); }
    } //stop
    catch{ searchCodes(); }
}

var rdigs = undefined;
var rchrs = undefined;
function seqCode(){
    rdigs = $('#scratch').is(":checked") ? digits : digits.shuffle();
    rchrs = $('#scratch').is(":checked") ? chars : chars.shuffle();
    var n = { 'd' : rdigs.length, 'c' : rchrs.length }, 
        m = { 'd' : rdigs, 'c' : rchrs };
    return function(seq){
        var r = '', [pat, idx] = find(seq); 
        var i = pat.length;
        while(i--){
            r = m[pat[i]][idx % n[pat[i]]] + r;
            idx = Math.floor(idx / n[pat[i]])
        }
        return r;
    }
}

function colored(text, regex){
    return text.replace(regex, function(str) {return '<span style="color:#FF0000">'+str+'</span>'});
}

function searchAppend(regex, bz, genCode){
    bz = Math.min(Math.max(1, bz), 5000);
    for(var iter = 0; iter < bz; iter++){
        var pass = genCode(total);
        var trip = tripcode(pass);
        var match = regex.exec(trip);
        total += 1;
        if(match != null) {
            var result = `result-${count}`;
            count += 1;
            var entry = $(`<a href="javascript:void(0);"
                id="${result}" data=${JSON.stringify(pass)}
                onclick='copyToClipboard(${JSON.stringify(pass)});'
                class="list-group-item result">${colored(trip, regex)}<span style="font-weight:bolder;color:#00cc00">#</span>${pass}</a>`);
            entry.tooltip({title: "copied!", trigger: "click"});
            $('#result').append(entry);
        }
    }
    $('#count').text(`(${count}/${total})`);
}

var searching = undefined;
var count = 0;
var total = 0;
var SEARCH = "Search"
var STOP = "Stop"
function searchCodes(){
    if($('#search').hasClass('disabled')) return;
    if($('#search').text() === SEARCH){
        $('#test-regex').attr('disabled', true);
        $('#result').empty();
        $('#search').text(STOP);

        count = 0; total = 0;

        var numberOfMilliseconds = 1,
            regex = new RegExp(
                $('#test-regex').val(),
                $('#igcase').is(":checked") ? 'i': ''),
            batch_size = $('#batch_size').val(),
            method = $('#sequential').is(":checked") ? seqCode() : randCode();

        searching = setInterval(
            searchAppend.bind(null, regex, batch_size, method),
            numberOfMilliseconds);
    }
    else{
        $('#test-regex').attr('disabled', false);
        $('#search').text(SEARCH);
        clearInterval(searching);
    }
}

$(document).ready(function(){
    /* quick regex test */
    function setIcon(s, icon){
        return $(s).removeClass('glyphicon-ok')
            .removeClass('glyphicon-warning-sign')
            .removeClass('glyphicon-remove')
            .addClass(icon);
    }

    function setStatus(s, status, title = ''){
        return $(s).removeClass('has-success')
            .removeClass('has-warning')
            .removeClass('has-error')
            .addClass(status)
            .attr('title', title);
    }

    $('.test-input').on('input focus',function(e){
        var valid = true,
            regex = $('#test-regex').val(),
            string = $('#test-string').val();
        try{
            regex = new RegExp(regex);
        }
        catch(e){
            valid = false;
            setStatus('#test-string-status', 'has-warning', 'Please correct your RegExp');
            setIcon('#test-string-icon', 'glyphicon-warning-sign');
            setStatus('#test-regex-status', 'has-warning', e);
            setIcon('#test-regex-icon', 'glyphicon-warning-sign');
            $('#search').addClass('disabled');
        }
        if(valid){
            setStatus('#test-regex-status', 'has-sucess');
            setIcon('#test-regex-icon', 'glyphicon-ok');
            $('#search').removeClass('disabled');
            if($('#test-string').val().match(regex)){
                setStatus('#test-string-status', 'has-sucess');
                setIcon('#test-string-icon', 'glyphicon-ok');
            }
            else{
                setStatus('#test-string-status', 'has-error', 'String not match the RegExp');
                setIcon('#test-string-icon', 'glyphicon-remove');
            }
        }
    });

    $("#test-regex").on('keyup', function (e) {
        if (e.keyCode === 13) $('#search').click().focus();
    });


    $('#test-password').on('input focus',function(e){
        var val = $('#test-password').val().replace(/\s+$/, ''); // drrr trim right auto
        if(!val.length){
            $('#test-trip').text('[tripcode]');
            setStatus('#test-password-status', 'has-sucess');
            setIcon('#test-password-icon', 'glyphicon-ok');
            $('#warn-pass').hide();
            $('#example-list').removeClass('list-group-item-warning');
        }
        else{
            var [valid, msg] = valid_drrrtrip(val);
            if(valid){
                setStatus('#test-password-status', 'has-sucess');
                setIcon('#test-password-icon', 'glyphicon-ok');
                $('#warn-pass').hide();
                $('#example-list').removeClass('list-group-item-warning');
            }
            else{
                $('#example-list').addClass('list-group-item-warning');
                setStatus('#test-password-status', 'has-warning', msg);
                setIcon('#test-password-icon', 'glyphicon-warning-sign');
                $('#warn-pass').show();
            }
            var trip = tripcode(val)
            $('#test-trip').text(trip.length ? trip : '[tripcode]');
        }

    })

    /* checkboxes */
    $('#sequential').on("click", function(){
        $('#scratch').attr('disabled', !$('#sequential').is(":checked"))
        console.log($('#sequential').is(":checked"));
    })
})

$(document).on('shown.bs.tooltip', function (e) {
    setTimeout(function () {
        $(e.target).tooltip('hide');
    }, 1000);
});
