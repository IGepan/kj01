let refreshTokenFlag = false;
define(['jquery', 'dic', 'dialog', 'utils', 'httpUrl', 'httpCom', 'base64'], function ($, dic, dialog, utils, httpUrl, httpCom, base64) {
  $.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
      return {
        // create new XMLHttpRequest
        send: function (headers, callback) {
          // setup all variables
          var xhr = new XMLHttpRequest(),
            url = options.url,
            type = options.type,
            async = options.async || true,
            // blob or arraybuffer. Default is blob
            dataType = options.responseType || "blob",
            data = options.data || null,
            username = options.username || null,
            password = options.password || null;

          xhr.addEventListener('load', function () {
            var data = {};
            data[options.dataType] = xhr.response;
            // make callback and send data
            callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
          });
          xhr.addEventListener('error', function () {
            var data = {};
            data[options.dataType] = xhr.response;
            // make callback and send data
            callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
          });

          xhr.open(type, url, async, username, password);

          // setup custom headers
          for (var i in headers) {
            xhr.setRequestHeader(i, headers[i]);
          }

          xhr.responseType = dataType;
          xhr.send(data);
        },
        abort: function () { }
      };
    }
  });
  return {
    ajax: function (url, data, type, contentType, header, cache, async, dataType, option, xhrFields) {
      var that = this
      var def;
      if ($.Deferred) {
        def = $.Deferred();
      } else {
        def = jQuery.Deferred();
      }
      var type = type || 'post'; //????????????
      var dataType = dataType || 'json'; //??????????????????
      var async = async || true; //????????????
      var cache = cache || false; //?????????????????????
      var contentType = contentType || ''
      var header = header || {}
      var option = option || {}
      var LOGIN_INFO = utils.getCookie(dic.locaKey.LOGIN_INFO);
      var token = '';
      if (LOGIN_INFO && LOGIN_INFO !== 'null') {
        LOGIN_INFO = JSON.parse(LOGIN_INFO)
        token = LOGIN_INFO.access_token
      }
      console.log("ajax token:" + token);
      // ??????????????????
      for (item in data) {
        if (data[item] === '') {
          delete data[item];
        }
      }
      if (type == 'post' && contentType == 'application/json;charset=UTF-8') {
        data = JSON.stringify(data);
      }
      //????????????????????????WxSrcUrl
      if (location.href.indexOf('/site/') > -1) {
        let urls = location.href.split('site')[1]
        header = $.extend({
          'WxSrcUrl': location.href.split('site')[0] + 'site/' + urls.split('/')[1],
        }, header);
      }
      if (url.indexOf('/oauth/token') === -1 && url.indexOf('http://city-service.cykj01.com') === -1) {
        header = $.extend({
          'access-token': token,
        }, header);
      }
      //newmain??????????????????????????????????????????token
      if (url.indexOf('http://city-service.cykj01.com') > -1) {
        header = $.extend({
          'Authorization': localStorage.getItem('Authorization') ? 'Bearer ' + localStorage.getItem('Authorization') : ''
        }, header);
      }
      var xhrFields = xhrFields || {}
      var success = function (data, a, b) {
        var noCodes = ['msg.user.buyerIdentityHaveNot', 'msg.shop.info.pleaseActive', 'msg.goods.noUp', 'msg.shop.info.frozened', 'msg.goods.deleted']
        if (this.url.indexOf('/access/save') === -1 && this.url.indexOf('/access/wxappSave') === -1) {
          if (data.refreshToken && !refreshTokenFlag) {
            refreshTokenFlag = true;
            var param = {};
            param.auth_type = 'userName';
            param.login_type = '1';
            param.grant_type = 'refresh_token';
            param.refresh_token = LOGIN_INFO.refresh_token
            that.formPost(httpUrl.authUrl + '/oauth/token', param, {
              'Authorization': 'Basic ' + $.base64.encode('ts_liyan:ts_liyan')
            }).then(function (res) {
              if (res.code == 'rest.success' || data.code) {
                utils.delCookie(dic.locaKey.LOGIN_INFO);
                utils.setCookie(dic.locaKey.LOGIN_INFO, res.result);
              } else {
                refreshTokenFlag = false;
                dialog.showToast(res.desc);
                window.location.href = window.$pathPrefix + '/common/login.html'
              }
            }).catch(() => {
              refreshTokenFlag = false;
            })
          }
          if (data.code == 'rest.success' || data.code) {
            def.resolve(data);
          } else if ((data.code == 'msg.user.tokenFail' || data.code == 'msg.user.authFail')) {
            var urls = this.url.split('/')
            utils.delCookie(dic.locaKey.LOGIN_INFO);
            utils.delCookie(dic.locaKey.USER_INFO);
            localStorage.removeItem(dic.locaKey.SAASID);
            localStorage.removeItem(dic.locaKey.USER_INFO);
            if (urls[5] !== 'selected' && urls[5] !== 'add' && urls[5].indexOf('cancel') === -1) {
              // dialog.showToast(this.url + '????????????');
              // setTimeout(function () {
              //?????????????????????????????????
              if (window.location.hostname.indexOf('kjzx') > -1) {
                window.location.href = '/login/login.html'
              } else {
                window.location.href = window.$pathPrefix + '/common/login.html'
              }
              // }, 2000)
            } else {
              console.log('????????????')
              if (window.location.hostname.indexOf('kjzx') > -1) {
                window.location.href = '/login/login.html'
              } else {
                window.location.href = window.$pathPrefix + '/common/login.html'
              }
            }
          } else {
            //??????????????????????????????????????????????????????
            if (!option.noShowToast) {
              if (data.desc && noCodes.every(function (code) { return data.code !== code })) {
                dialog.showToast(data.desc);
              }
            }
            if (data.code == 'msg.user.buyerIdentityHaveNot') {
              // window.$httpCom.webCommonUser().then(function (res) {
              //   if (res.code === 'rest.success') {
              //     utils.delCookie(dic.locaKey.LOGIN_INFO);
              //     utils.setCookie(dic.locaKey.USER_INFO, res.result);
              //     localStorage.setItem('saasId', res.result.saasId);
              //     localStorage.setItem(dic.locaKey.USER_INFO, JSON.stringify(res.result));
              //     // location.href = '/index.html'
              //   }
              // })
            }
            def.resolve(data);
          }
        }
      };
      var error = error || function (data) {
        if (this.url.indexOf('/access/save') === -1 && this.url.indexOf('/financial/finProduct/list') === -1) {
          // dialog.showToast('?????????????????????????????????');
          def.reject(error);
        }
        // let code = data.responseJSON ? data.responseJSON.message : ''
        // if ((code == 'msg.user.tokenFail' || code == 'msg.user.authFail')) {
        //   var urls = this.url.split('/')
        //   utils.delCookie(dic.locaKey.LOGIN_INFO);
        //   utils.delCookie(dic.locaKey.USER_INFO);
        //   localStorage.removeItem(dic.locaKey.SAASID);
        //   localStorage.removeItem(dic.locaKey.USER_INFO);
        //   if (urls[5] !== 'selected' && urls[5] !== 'add' && urls[5].indexOf('cancel') === -1) {
        //     // dialog.showToast(this.url + '????????????');
        //     // setTimeout(function () {
        //     //?????????????????????????????????
        //     if (window.location.hostname.indexOf('kjzx') > -1) {
        //       window.location.href = '/login/login.html'
        //     } else {
        //       window.location.href = window.$pathPrefix + '/common/login.html'
        //     }
        //     // }, 2000)
        //   } else {
        //     console.log('????????????')
        //     if (window.location.hostname.indexOf('kjzx') > -1) {
        //       window.location.href = '/login/login.html'
        //     } else {
        //       window.location.href = window.$pathPrefix + '/common/login.html'
        //     }
        //   }
        // }
      };
      $.ajax({
        'headers': header,
        'url': url,
        'data': data,
        'type': type,
        'contentType': contentType,
        'dataType': dataType,
        'async': async,
        'success': success,
        'error': error,
        'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),
        'beforeSend': function (xhr) { 
					for(var i in header){
						if(header[i])xhr.setRequestHeader(i,header[i]);
					}
				},
        'xhrFields': xhrFields
      });
      return def.promise();
    },
    getFile: function (url, data, type, contentType, header, cache) {
      return this.ajax(url, data, type, contentType, header, cache, false, 'binary');
    },
    post: function (url, data, header, cache) {
      return this.ajax(url, data, 'post', 'application/json;charset=UTF-8', header, cache, false, 'json');
    },
    postNoToast: function (url, data, header, cache) {
      return this.ajax(url, data, 'post', 'application/json;charset=UTF-8', header, cache, false, 'json', {
        noShowToast: true
      });
    },
    getNoToast: function (url, data, header, cache) {
      return this.ajax(url, data, 'get', 'application/x-www-form-urlencoded;charset=UTF-8', header, cache, false, 'json', {
        noShowToast: true
      });
    },
    get: function (url, data, header, cache) {
      return this.ajax(url, data, 'get', 'application/x-www-form-urlencoded;charset=UTF-8', header, false, 'json');
    },
    formPost: function (url, data, header, cache) {
      return this.ajax(url, data, 'post', 'application/x-www-form-urlencoded;charset=UTF-8', header, cache, false, 'json', {}, {
        withCredentials: true
      });
    },
    // pdf????????????
    blobFile: function (url, method, headers, param) {
      var def;
      var method = method || 'GET'
      var headers = headers || {}
      var param = param || ''
      if ($.Deferred) {
        def = $.Deferred();
      } else {
        def = jQuery.Deferred();
      }
      headers['access-token'] = JSON.parse(utils.getCookie(dic.locaKey.LOGIN_INFO)).access_token
      headers['Content-Type'] = 'application/pdf'
      headers['X-Requested-With'] = 'XMLHttpRequest'
      $.ajax({
        url: url,
        type: method,
        dataType: 'binary',
        headers: headers,
        data: param,
        processData: false,
        success: function (result) {
          if (result.type === 'text/xml' || result.type === 'application/pdf') {
            def.resolve(result);
          } else {
            dialog.showToast('????????????');
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          def.reject({ xhr: xhr, ajaxOptions: ajaxOptions, thrownError: thrownError })
        }
      });
      return def.promise()
    }
  }
})

/**
 * ???????????????????????????ajax??????
 * Author: zhou.ning
 * @param {Object} url      ????????????
 * @param {Object} data     ?????????????????????{"id":1}
 * @param {Object} success  ???????????? ?????? ???????????????
 * @param {Object} type     ????????????
 * @param {Object} cache    ?????????????????????
 * @param {Object} async    ????????????  ??? true | false
 * @param {Object} dataType ??????????????????  json
 * @param {Object} error    ????????????
 */

function ajaxForm(url, data, success, type, cache, alone, async, dataType, error) {
  var type = type || 'post'; //????????????
  var dataType = dataType || 'json'; //??????????????????
  var async = async || true; //????????????
  var cache = cache || false; //?????????????????????
  var success = success || function (data) {

    if (data.status) { //?????????????????????{

    } else { //?????????????????????

    }
  };
  var error = error || function (data) {
    $("body").hideloading();
    if (data.status == 401) {
      sy.toast('??????????????????????????????');
    } else if (data.status == 404) {
      sy.toast('??????????????????????????????');
    } else if (data.status == 503) {
      sy.toast('????????????????????????????????????');
    } else {
      sy.toast(url + '[' + data.status + ']:????????????,??????????????????');
    }
  };
  $.ajax({
    'headers': {
      'access-token': window.sessionStorage.getItem("backstage-access-token")
    },
    'url': url,
    'data': JSON.stringify(data),
    'type': type,
    'contentType': "application/json;charset=UTF-8",
    'dataType': dataType,
    'async': async,
    'success': success,
    'error': error,
    'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),
    'beforeSend': function () { },
  });
}

// submitAjax(post????????????)
function submitAjax(form, cache, alone) {
  cache = cache || true;
  var form = $(form);
  var url = form.attr('action');
  var data = form.serialize();
  ajax(url, data, 'post', cache, alone, false, 'json');
}

// ajax??????(get????????????)
function get(url, data, cache, alone) {
  return ajax(url, data, 'get', alone, false, 'json');
}

// jsonp????????????(get????????????)
function jsonp(url, data, cache, alone) {
  return ajax(url, {}, success, 'get', cache, alone, false, 'json');
}

// ajax??????(post????????????)
function request(url, data, type, cache, alone) {
  return ajax(url, data, success, type || "get", cache, alone, false, 'json');
}
