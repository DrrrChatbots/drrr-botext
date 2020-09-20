fcc = function(e, t, n, i) {
  var o = (n.message || "").toString().split("\n").filter(function(e) {
    return "" !== e.trim()
  }),
    a = $("<p />", {
      class: "body select-text"
    }),
    s = o.length > 10 ? 10 : o.length - 1;
  if (o.forEach(function(e, t) {
    e.split("  ").forEach(function(e, t) {
      t && a.append("&nbsp;&nbsp;"), a.append(document.createTextNode(e)), " " === e && a.append("&nbsp;")
    }), s > t && a.append($("<br>"))
  }), n.url) {
    var r = this._htmlEncode(n.url),
      l = /[^/]+\.(bmp|jpg|jpeg|png|svg|gif)/i.exec(r);
    if (l && window.expose) expose.formChatImageContent(a, r, l[0], l[1]);
    else {
      var c = $("<a />", {
        class: "message-link bstooltip",
        text: "URL",
        title: r,
        href: r,
        target: "_blank"
      });
      $(a).append(c)
    }
  }
  var u = $("<dd />").append($("<div />", {
    class: "bubble"
  }).append(a)),
    d = $("<dt />", {
      class: "dropdown user"
    }).data(t).data(i).append($("<div />", {
      class: "avatar"
    }).addClass("avatar-" + t.icon).addClass(t.admin ? "is-mod" : "")).append($("<div />", {
      class: "name",
      "data-toggle": "dropdown"
    }).append($("<span />", {
      text: "" + t.name,
      class: "select-text"
    }))).append($("<ul />", {
      class: "dropdown-menu",
      role: "menu"
    }));
  i.secret && profile.id == t.id && u.append($("<div />", {
    class: "secret-to-whom"
  }).addClass(!1 === i.to.alive ? "dead" : "").append($("<span />", {
    class: "to"
  })).append($("<div />", {
    class: "dropdown user"
  }).data(i.to).append($("<div />", {
    "data-toggle": "dropdown",
    class: "name"
  }).append($("<span />", {
    class: "symbol symbol-" + i.to.icon
  })).append($("<span />", {
    class: "select-text"
  }).text(i.to.name))).append($("<div />", {
    role: "menu",
    class: "dropdown-menu"
  }))));
  var m = $("<dl />", {
    class: "talk",
    id: e
  }).append(d).append(u).addClass(t.icon);
  return i.secret && m.addClass("secret"), t.admin && m.addClass("is-mod"), t.hasOwnProperty("player") && m.addClass(t.player ? "player" : "non-player"), t.hasOwnProperty("alive") && m.addClass(t.alive ? "alive" : "dead"), m
}

function writeMessage(e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
  if (1 || !this._shouldBeAlreadyWrittenFast(e)) {
    t = t || e.from;
    var n = {
      secret: e.secret
    };
    e.secret && (n.to = e.to);
    var i = fcc(e.id, t, {
      message: e.message,
      url: e.url
    }, n);
    return e.element = i, i
  }
}

_formBasicNode = function(e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
    n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
    i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
    o = $("<div />", {
      class: "talk",
      id: e.id
    }).addClass(e.type);
  return n && o.addClass("system"), t && o.addClass("select-text"), i && o.attr(i), e.element = o, e.element
}

_appendNodeContent = function(e) {
  e.translated = (/*this.prompt*/"►►" + " " /* unknown + t(e)*/).split(/{\d+}/g)
  e.element.append(e.translated[0]);
  for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
  return n.forEach(function(t, n) {
    e.element.append(t), t ? e.element.append(e.translated[n + 1]) : e.translated[n + 2] = e.translated[n + 1]
  }), e.element
}
_formUserNode = function(e) {
  if ("all" === e) return "";
  e || (e = {
    name: "ERROR",
    id: null,
    error: !0
  });
  var t = {
    "data-toggle": "dropdown",
    class: "name",
    text: e.name
  };
  return e.error && (t.style = "color: gray"), $("<span />", {
    class: "dropdown user"
  }).data(e).append($("<span />", t)).append($("<ul />", {
    class: "dropdown-menu",
    role: "menu"
  }))
}

_formIconNode = function(e) {
  return e && "all" !== e ? $("<span />", {
    class: "symbol symbol-" + e.icon
  }) : ""
}

function writeMe(e){
  return _formBasicNode(e, !0), _appendNodeContent(e, $("<span />").append(_formIconNode(e.from)).append(_formUserNode(e.from)), escapeHtml(e.content));
}

var me_message = {
  type: "message",
  from: profile,
  is_fast: !0,
  is_me: !0,
  message: '/me test',
  content: ' test'
};

var pub_message = {
  type: "message",
  from: {
    id: profile.id
  },
  is_fast: !0,
  is_me: !0,
  message: 'test public message',
};

//me_message.element = writeMe(me_message, profile)
//pub_message.element = writeMessage(pub_message, profile)
//$('#talks').prepend(me_message.element)
//$('#talks').prepend(pub_message.element)
