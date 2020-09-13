var GAME_OTOKO = "GAME_OTOKO"

var language = window.navigator.userLanguage || window.navigator.language;
var intro = (language == 'zh-CN' || language == 'zh-TW') ?
  `<p>假裝是一隻 otoko，支援時間格式語法。</p>`:`<p>Pretend otoko, support time format syntax.</p>`

export const ui = (config) => {
  return `
<div class="input-group">

    <select id="otoko_lang" name="otoko_change_room" class="form-control" style="text-align:center;padding-left: 4px;padding-right: 0px;padding-top: 4px;" title="enable auto room changing">
      <option value="all">ALL Language</option>
      <option value="zh">中文</option>
      <option value="en-US">English</option>
      <option value="af-ZA">Afrikaans</option>
      <option value="ar-SA">العربية</option>
      <option value="bg-BG">Български</option>
      <option value="bn-BD">Bangla</option>
      <option value="ca-ES">Català</option>
      <option value="cs-CZ">Čeština</option>
      <option value="da-DK">Dansk</option>
      <option value="de-DE">Deutsch</option>
      <option value="el-GR">Ελληνικά</option>
      <option value="eo-UY">Esperanto</option>
      <option value="es-ES">Español</option>
      <option value="et-EE">Eesti</option>
      <option value="fi-FI">Suomi</option>
      <option value="fil-PH">Filipino</option>
      <option value="fr-FR">Français</option>
      <option value="he-IL">עברית‎</option>
      <option value="hr-HR">Hrvatski</option>
      <option value="hu-HU">Magyar</option>
      <option value="id-ID">Bahasa Indonesia</option>
      <option value="it-IT">Italiano</option>
      <option value="ja-JP">日本語</option>
      <option value="ka-GE">ქართული</option>
      <option value="ko-KR">한국어</option>
      <option value="lt-LT">Lietuvių</option>
      <option value="lv-LV">Latviešu</option>
      <option value="ms-MY">Bahasa Melayu</option>
      <option value="nl-NL">Nederlands</option>
      <option value="no-NO">Norsk bokmål</option>
      <option value="pl-PL">Polska</option>
      <option value="pt-BR">Português (Brazil)</option>
      <option value="pt-PT">Português</option>
      <option value="ro-RO">Română</option>
      <option value="ru-RU">Русский</option>
      <option value="sk-SK">Slovenčina</option>
      <option value="sl-SI">Slovenščina</option>
      <option value="sr-SP">Српски / srpski</option>
      <option value="sv-SE">Svenska</option>
      <option value="th-TH">ไทย</option>
      <option value="tl-PH">Tagalog</option>
      <option value="tr-TR">Türkçe</option>
      <option value="uk-UA">Українська</option>
      <option value="ur-PK">اردو</option>
      <option value="vi-VN">Tiếng Việt</option>
      <option value="zh-CN">中文（简体）</option>
      <option value="zh-TW" selected="selected">中文（繁體）</option>
      <option value="zh-TM">正體中文（萌萌ㄉㄜ）(翻譯募集中...)</option>
      <option value="ka-KA">(๑˃̵ᴗ˂̵)و『( ·᷄ὢ·᷅ )...』</option>
    </select>

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>
    <input id="otoko_change_interval" type="number" class="form-control" min="5" max="120" placeholder="min">
    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>

    <div class="input-group-btn">
        <button id="otoko_room_change" class="btn btn-default" type="button"
                                                               data-delayed-toggle="collapse" data-target=""
                                                                                              title="if auto change room">
            <i id="" class="glyphicon 	glyphicon-plane"></i>
        </button>
    </div>
  </div>

  <div class="input-group">


    <input id="otoko_report_text" type="text" class="form-control" placeholder="REPORT TEXT">

    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>
    <input id="otoko_change_interval" type="number" class="form-control" min="5" max="120" placeholder="min">
    <span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>
    <div class="input-group-btn">
        <button id="otoko_set_text" class="btn btn-default" type="button"
                                                               data-delayed-toggle="collapse" data-target=""
                                                                                              title="set report text">
            <i id="" class="glyphicon 	glyphicon-pencil"></i>
        </button>
    </div>
</div><br>${intro}`
}

export const ui_event = (config) => {

}

export const event_action = (req, config) => {
  var type = req.type;
}

// game logic
