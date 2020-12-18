'use strict';
if (!("classList" in document.documentElement)) {
  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function () {
      var self = this;
      function update (fn) {
        return function (value) {
          var classes = self.className.split(/\s+/g),
            index = classes.indexOf(value);

          fn(classes, index, value);
          self.className = classes.join(" ");
        }
      }

      return {
        add: update(function (classes, index, value) {
          if (!~index) classes.push(value);
        }),

        remove: update(function (classes, index) {
          if (~index) classes.splice(index, 1);
        }),

        toggle: update(function (classes, index, value) {
          if (~index)
            classes.splice(index, 1);
          else
            classes.push(value);
        }),

        contains: function (value) {
          return !!~self.className.split(/\s+/g).indexOf(value);
        },

        item: function (i) {
          return self.className.split(/\s+/g)[i] || null;
        }
      };
    }
  });
}

var _createClass = function () { function defineProperties (target, props) { for (var i = 0;i < props.length;i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
  var w = 300,
    // canvas宽度
    h = 150; // canvas高度

  //创建画布
  function createCanvas (width, height) {
    var canvas = createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function createElement (tagName) {
    return document.createElement(tagName);
  }

  function createImg (onload, src) {
    var img = createElement('img');
    img.onload = onload;
    img.src = src;
    return img;
  }

  function addClass (tag, className) {
    tag.classList.add(className);
  }

  function removeClass (tag, className) {
    tag.classList.remove(className);
  }

  //  function ajax() {
  //    var ajaxData = {
  //      type: arguments[0].type || "GET",
  //      url: arguments[0].url || "",
  //      async: arguments[0].async || 'false',
  //      data: arguments[0].data || null,
  //      dataType: arguments[0].dataType || "text",
  //      contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
  //      beforeSend: arguments[0].beforeSend || function () {},
  //      success: arguments[0].success || function () {},
  //      error: arguments[0].error || function () {}
  //    };
  //    ajaxData.beforeSend();
  //    var xhr = createxmlHttpRequest();
  //    xhr.responseType = "json";
  //    xhr.open(ajaxData.type, ajaxData.url + '?' + convertData(ajaxData.data), ajaxData.async);
  //    xhr.setRequestHeader("Content-Type", ajaxData.contentType);
  //    xhr.send();
  //    xhr.onreadystatechange = function () {
  //      if (xhr.readyState == 4) {
  //        if (xhr.status == 200) {
  //          ajaxData.success(xhr.response);
  //        } else {
  //          ajaxData.error();
  //        }
  //      }
  //    };
  //  }

  function createxmlHttpRequest () {
    if (window.ActiveXObject) {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
  }

  function convertData (data) {
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
      var convertResult = "";
      for (var c in data) {
        convertResult += c + "=" + data[c] + "&";
      }
      convertResult = convertResult.substring(0, convertResult.length - 1);
      return convertResult;
    } else {
      return data;
    }
  }

  function loadImg (captcha) {
    return function (result) {
      var data = result;
      if (data.code == 'rest.success') {
        var targetImg = createImg(function () {
          captcha.canvasCtx.drawImage(targetImg, 0, 0, w, h);
        }, data.result.target);

        var blockImg = createImg(function () {
          captcha.block.width = 39;
          captcha.blockCtx.drawImage(blockImg, 0, 0, 39, h);
        }, data.result.block);

        captcha.token = data.result.token;
        captcha.targetImg = targetImg;
        captcha.blockImg = blockImg;
      } else {
        console.log(data);
      }
    };
  }

  function restImg (captcha) {
    return function (result) {
      var data = result;
      if (data.code == 'rest.success') {
        captcha.token = data.result.token;
        captcha.code = '';
        captcha.targetImg.src = data.result.target;
        captcha.blockImg.src = data.result.block;
      } else {
        console.log(data);
      }
    };
  }

  function loadRandomImg (captcha, fun) {
    $.ajax({
      url: captcha.url + 'verify/loadImage',
      type: 'GET',
      data: { type: 'slider' },
      cache: false,
      crossDomain: true == !(document.all),
      success: fun(captcha),
      error: function error (data, status, e) {
        console.log(data);
      }
    });
  }

  function checkCode (captcha, stddev) {
    return function (result) {
      //var data = eval("(" + result + ")");
      var data = result;
      if (data.code == 'rest.success') {
        var spliced = data.result == true;
        var verified = stddev !== 0;
        if (spliced) {
          if (verified) {
            addClass(captcha.sliderContainer, 'sliderContainer_success');
            captcha.isSuccess = true;
            typeof captcha.onSuccess === 'function' && captcha.onSuccess();
          } else {
            addClass(captcha.sliderContainer, 'sliderContainer_fail');
            captcha.text.innerHTML = '再试一次';
            captcha.reset();
          }
        } else {
          addClass(captcha.sliderContainer, 'sliderContainer_fail');
          typeof captcha.onFail === 'function' && captcha.onFail();
          setTimeout(function () {
            captcha.reset();
          }, 300);
        }
      } else {
        console.log(data);
      }
    };
  }

  function verifyCode (captcha) {
    var arr = captcha.trail; // 拖动时y轴的移动距离
    var average = arr.reduce(sum) / arr.length;
    var deviations = arr.map(function (x) {
      return x - average;
    });
    var stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
    var left = parseInt(captcha.block.style.left);
    captcha.code = left;

    $.ajax({
      url: captcha.url + 'verify/verify',
      type: 'GET',
      crossDomain: true == !(document.all),
      cache: false,
      data: { type: 'slider', token: captcha.token, code: left },
      success: checkCode(captcha, 1),
      error: function error (data, status, e) {
        console.log(data);
      }
    });
  }

  function sum (x, y) {
    return x + y;
  }

  function square (x) {
    return x * x;
  }

  var captcha = function () {
    function captcha (_ref) {
      var el = _ref.el,
        onSuccess = _ref.onSuccess,
        onFail = _ref.onFail,
        onRefresh = _ref.onRefresh,
        url = _ref.url;

      _classCallCheck(this, captcha);

      el.style.position = el.style.position || 'relative';
      this.el = el;
      this.onSuccess = onSuccess;
      this.onFail = onFail;
      this.onRefresh = onRefresh;
      this.url = url;
    }

    _createClass(captcha, [{
      key: 'init',
      value: function init () {
        this.initDOM();
        this.initImg();
        this.bindEvents();
      }
    }, {
      key: 'initDOM',
      value: function initDOM () {
        var canvas = createCanvas(w, h); // 画布
        var block = canvas.cloneNode(true); // 滑块
        var sliderContainer = createElement('div'); //拖动容器
        var refreshIcon = createElement('div'); //刷新按钮
        var sliderMask = createElement('div');
        var slider = createElement('div');
        var sliderIcon = createElement('span');
        var text = createElement('span');

        block.className = 'block';
        sliderContainer.className = 'sliderContainer';
        refreshIcon.className = 'refreshIcon';
        sliderMask.className = 'sliderMask';
        slider.className = 'slider';
        sliderIcon.className = 'sliderIcon';
        text.innerHTML = '向右滑动滑块填充拼图';
        text.className = 'sliderText';

        var el = this.el;
        el.appendChild(canvas);
        el.appendChild(refreshIcon);
        el.appendChild(block);
        slider.appendChild(sliderIcon);
        sliderMask.appendChild(slider);
        sliderContainer.appendChild(sliderMask);
        sliderContainer.appendChild(text);
        el.appendChild(sliderContainer);

        $.extend(this, {
          canvas: canvas,
          block: block,
          sliderContainer: sliderContainer,
          refreshIcon: refreshIcon,
          slider: slider,
          sliderMask: sliderMask,
          sliderIcon: sliderIcon,
          text: text,
          canvasCtx: canvas.getContext('2d'),
          blockCtx: block.getContext('2d')
        });
      }
    }, {
      key: 'initImg',
      value: function initImg () {
        loadRandomImg(this, loadImg);
      }
    }, {
      key: 'bindEvents',
      value: function bindEvents () {
        var _this = this;

        this.el.onselectstart = function () {
          return false;
        };
        this.refreshIcon.onclick = function () {
          _this.reset();
          typeof _this.onRefresh === 'function' && _this.onRefresh();
        };

        this.isSuccess = false;
        var originX = void 0,
          originY = void 0,
          trail = [],
          isMouseDown = false;
        this.slider.addEventListener('mousedown', function (e) {
          originX = e.x, originY = e.y;
          isMouseDown = true;
        });
        document.addEventListener('mousemove', function (e) {
          if (!isMouseDown || _this.isSuccess) return false;
          var moveX = e.x - originX;
          var moveY = e.y - originY;
          if (moveX < 0 || moveX + 38 >= w) return false;
          _this.slider.style.left = moveX + 'px';
          //var blockLeft = (w - 40 - 20) / (w - 40) * moveX	//这里为何要减20不明白，导致滑动时坐标不一致
          var blockLeft = (w - 39) / (w - 39) * moveX;
          _this.block.style.left = blockLeft + 'px';

          addClass(_this.sliderContainer, 'sliderContainer_active');
          _this.sliderMask.style.width = moveX + 'px';
          trail.push(moveY);
        });
        document.addEventListener('mouseup', function (e) {
          if (!isMouseDown) return false;
          isMouseDown = false;
          if (_this.isSuccess) return false;
          if (e.x == originX) return false;
          removeClass(_this.sliderContainer, 'sliderContainer_active');
          _this.trail = trail;

          verifyCode(_this);
        });
      }
    }, {
      key: 'reset',
      value: function reset () {
        this.sliderContainer.className = 'sliderContainer';
        this.slider.style.left = 0;
        this.block.style.left = 0;
        this.sliderMask.style.width = 0;
        this.isSuccess = false;
        loadRandomImg(this, restImg);
      }
    }]);

    return captcha;
  }();

  window.captcha = {
    init: function init (opts) {
      return new captcha(opts).init();
    }
  };
})(window);
