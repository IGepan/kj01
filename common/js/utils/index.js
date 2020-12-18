define(['jquery'], function ($) {
  /*\
  |*|  https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
  |*|  :: cookies.js ::
  |*|
  |*|  A complete cookies reader/writer framework with full unicode support.
  |*|
  |*|  Revision #3 - July 13th, 2017
  |*|
  |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
  |*|  https://developer.mozilla.org/User:fusionchess
  |*|  https://github.com/madmurphy/cookies.js
  |*|
  |*|  This framework is released under the GNU Public License, version 3 or later.
  |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
  |*|
  |*|  Syntaxes:
  |*|
  |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
  |*|  * docCookies.getItem(name)
  |*|  * docCookies.removeItem(name[, path[, domain]])
  |*|  * docCookies.hasItem(name)
  |*|  * docCookies.keys()
  |*|
  \*/
  var docCookies = {
    getItem: function (sKey) {
      if (!sKey) { return null; }
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0;nIdx < nLen;nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };
  return {
    // cookie过期时间
    expiresTime: 7200000,
    getReqStr: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    },
    getShopCode: function () {
      return location.pathname.split('/')[3]
    },
    endWith: function (str, s) {
      var d = str.length - s.length;
      return (d >= 0 && str.lastIndexOf(s) == d)
    },
    getCookie: function (name) {
      var nameValue = docCookies.getItem(name)
      var value = ''
      var time = new Date().getTime();
      // cookie过期处理
      if (nameValue) {
        value = JSON.parse(nameValue)
        value = new Date(value.expires).getTime()
        if (time - value > this.expiresTime) {
          nameValue = null
        }
      }
      return nameValue;
    },
    delCookie: function (name) {
      var domain = location.hostname.split('.')
      domain[0] = ''
      docCookies.removeItem(name, '/', domain.join('.'))
    },
    setCookie: function (name, value) {
      var exp = new Date();
      var domain = location.hostname.split('.')
      domain[0] = ''
      exp.setTime(exp.getTime() + this.expiresTime);
      var time = exp.toGMTString()
      value.expires = time;
      docCookies.setItem(name, JSON.stringify(value), time, '/', domain.join('.'));
    },
    openNewTable: function (url, target) {
      target = target || '_blank'
      var a = $('<a href="' + url + '" target="' + target + '">新标签页面</a>').get(0);
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      a.dispatchEvent(e);
    }
  }
})
