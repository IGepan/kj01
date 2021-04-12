(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery, window, document);
  }
}(function ($, window, document, undefined) {

  /*************************策略对象*****************************/

  var RULES = {
    isNonEmpty: function (value, errorMsg, vm, callback) {
      //不能为空
      value = value.trim();
      if (!value.length) {

        return callback(vm, errorMsg);
      }
      return callback(vm);
    },
    minLength: function (value, length, errorMsg, vm, callback) {
      //大于length位
      if (value.length < length) {
        return callback(vm, errorMsg);
      }
      return callback(vm);
    },
    maxLength: function (value, length, errorMsg, vm, callback) {
      //小于length位
      if (value.length > length) {
        return callback(vm, errorMsg);
      }
      return callback(vm);
    },
    minNum: function (value, num, errorMsg, vm, callback) {
      //大于
      if (value.length > 0) {
        if (parseFloat(value) < parseFloat(num) || !/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
          return callback(vm, errorMsg);
        }
      }
      return callback(vm);
    },
    maxNum: function (value, num, errorMsg, vm, callback) {
      //小于
      if (value.length > 0) {
        if (parseFloat(value) > parseFloat(num) || !/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
          return callback(vm, errorMsg);
        }
      }
      return callback(vm);
    },
    isZero: function (value, num, errorMsg, vm, callback) {
      if (value.trim() != 0) {
        return errorMsg;
      }
    },
    isMobile: function (value, errorMsg, vm, callback) {
      //是否为手机号码
      if (value != '' && !/(^1\d{10}$)/.test(value.trim())) {
        return callback(vm, errorMsg);
      }
      return callback(vm);
    },
    isComma: function (value, errorMsg, vm, callback) {
      //是否为半角逗号
      if (!/^[\x00-\xff]*$/.test(value.trim())) {
        return errorMsg;
      }
    },
    isTelAndMobile: function (value, errorMsg, vm, callback) {
      //是否为手机号码/座机
      // var isLandLine = /^(((0\d{3}[\-])?\d{7,8}|(0\d{2}[\-])?\d{8}))(|[\-]\d{1,4})?$/;
      var isLandLine = /^(((0\d{3})?\d{7,8}|(0\d{2})?\d{8}))(|\d{1,4})?$/;
      var isMob = /^1[3|4|5|7|8][0-9]{9}$/;
      if (value.length > 0) {
        if (!(isMob.test(value.trim()) || isLandLine.test(value.trim()))) {
          return callback(vm, errorMsg);
        }
      }
      return callback(vm);
    },
    isTel: function (value, errorMsg, vm, callback) {
      //是否为手机号码/座机
      var isLandLine = /^(((0\d{3}[\-])?\d{7,8}|(0\d{2}[\-])?\d{8}))(|[\-]\d{1,4})?$/;
      if (value.length > 0) {
        if (isLandLine.test(value.trim())) {
          return callback(vm, errorMsg);
        }
      }
      return callback(vm);
    },
    isfaxNumber: function (value, errorMsg, vm, callback) {
      //传真号码
      var faxNumber = /^(((0\d{3}[\-])?\d{7}|(0\d{2}[\-])?\d{8}))?$/;
      if (value.length > 0) {
        if (!(faxNumber.test(value.trim()))) {
          return errorMsg;
        }
      }
    },
    isEmail: function (value, errorMsg, vm, callback) {
      //是否为邮箱
      if (value != "" && !/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
        return callback(vm, errorMsg);
      }
      return callback(vm);
    },
    isMenuScore: function (value, errorMsg, vm, callback) {
      //是否为枚举分值(因为逗号分隔，最多两位小数)
      if (!/(^([0-9]+(.[0-9]{1,2}){0,1}){0,1}(,([0-9]+(.[0-9]{1,2}){0,1}))*$)/.test(value)) {
        return errorMsg;
      }
    },
    between: function (value, range, errorMsg, vm, callback) {
      //长度范围
      var min = parseInt(range.split('-')[0]);
      var max = parseInt(range.split('-')[1]);
      if (value.length != 0 && (value.length < min || value.length > max)) {
        return errorMsg;
      }
    },
    decimalsRange: function (value, range, errorMsg, vm, callback) {
      //小数长度范围
      var min = parseInt(range.split('-')[0]);
      var max = parseInt(range.split('-')[1]);
      if (value.indexOf('.') > 0 && (value.split('.')[1].length < min || value.split('.')[1].length > max)) {
        return errorMsg;
      }
    },
    numRange: function (value, range, errorMsg, vm, callback) {
      //数字范围
      var min = parseInt(range.split('-')[0]);
      var max = parseInt(range.split('-')[1]);
      if (value < min || value > max || !/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
        return errorMsg;
      }
    },
    onlyEn: function (value, errorMsg, vm, callback) {
      //纯英文
      if (!/^[A-Za-z]+$/.test(value)) {
        return errorMsg;
      }
    },
    onlyZh: function (value, errorMsg, vm, callback) {
      //纯中文
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        return errorMsg;
      }
    },
    onlyZhPun: function (value, errorMsg, vm, callback) {
      //纯中文及中文字符
      if (!/^[\u4e00-\u9fa5\“\”\‘\’\《\》\—\：\，\、\；\？\（\）]+$/.test(value)) {
        return errorMsg;
      }
    },
    noZh: function (value, errorMsg, vm, callback) {
      //不含中文
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (reg.test(value)) {
        return errorMsg;
      }
    },
    onlyNum: function (value, errorMsg, vm, callback) {
      //数字包含小数
      if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
        return errorMsg;
      }
    },
    onlyInt: function (value, errorMsg, vm, callback) {
      //整数
      if (!/^[0-9]*$/.test(value)) {
        return errorMsg;
      }
    },
    positiveNum: function (value, errorMsg, vm, callback) {
      //正数包含小数
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value.trim())) {
        if (value.trim().length > 0) {
          return callback(vm, errorMsg);
        }
      }
      callback(vm);
    },
    positiveInt: function (value, errorMsg, vm, callback) {
      //正整数
      if (!/^[+]{0,1}(\d+)$/.test(value)) {
        if (value.length > 0) {
          return errorMsg;
        }
      }
    },
    isUrl: function (value, errorMsg, vm, callback) {
      //域名
      var durl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (value.trim() != "" && !durl.test(value.trim())) {
        return callback(vm, errorMsg);
      }
      callback(vm);
    },
    idCard: function (value, errorMsg, vm, callback) {
      if (vueDom.$children.some(function (child) {
        if (child.formData && child.formData.personalCertificateType !== '01' && child.formData.legalPersonCertificatType !== '01') {
          return true
        }
      })) {
        callback(vm); return;
      }
      value = value.toUpperCase(); //转换为大写
      //地址编码
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      if (!city[value.substr(0, 2)]) {
        return callback(vm, errorMsg);
      }
      //检查身份证格式及长度
      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
        return callback(vm, errorMsg);
      }
      //生日日期是否正确
      if (value.length == 15) {
        var reg = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = value.match(reg);
        var dtmBirth = new Date('19' + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
          return callback(vm, errorMsg);
        }
      }
      if (value.length == 18) {
        var reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = value.match(reg);
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
          return callback(vm, errorMsg);
        }
      }
      //检查身份证号码末位校验码
      var valnum, nTemp = 0;
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      if (value.length == 15) {
        //把身份证号码转为18位
        value = value.substr(0, 6) + '19' + value.substr(6, value.length - 6);
      }
      for (var i = 0;i < 17;i++) {
        nTemp += value.substr(i, 1) * factor[i];
      }
      valnum = parity[nTemp % 11];
      if (valnum != value.substr(17, 1)) {
        return callback(vm, errorMsg);
      }
      callback(vm);
    },
    isChecked: function (value, errorMsg, el, vm, callback) {
      var i = 0;
      var $collection = $(el).find('input:checked');
      if (!$collection.length) {
        return callback(vm, errorMsg);
      } else {
        callback(vm);
      }
    }
  };

  /*************************Validator类*****************************/

  var setting = {
    type: null,
    onBlur: null,
    onFocus: null,
    onChange: null,
    successTip: true
  };
  var Validator = function () {
    this.cache = [];
  };
  var $form = null
  var callbackResult = true; // 全局保存验证结果

  Validator.prototype.add = function (dom, rules) {
    var self = this;
    for (var i = 0, rule;rule = rules[i++];) {
      (function (rule) {
        var strategyAry = rule.strategy.split(':');
        var errorMsg = rule.errorMsg
        self.cache.push(function () {
          var strategy = strategyAry.shift(); // 前删匹配方式并赋值
          if (strategy == "custom") {
            var fun = strategyAry.shift();
            var errMsg = eval('vueDom.' + fun + '("' + dom.value + '",dom, callback)');
            return {
              errorMsg: '',
              el: dom
            };
          } else {
            strategyAry.unshift(dom.value); // 前插value值
            strategyAry.push(errorMsg); // 后插出错提示
            strategyAry.push(dom); // 后插dom
            if (!RULES[strategy]) {
              $.error('没有' + strategy + '规则，请检查命名或自行定义');
            }
            return {
              errorMsg: RULES[strategy].apply(dom, strategyAry),
              el: dom
            };
          }
        });
      }(rule));
    }
  };

  Validator.prototype.start = function () {
    var result = [];
    for (var i = 0;i < this.cache.length;i++) {
      validatorFunc = this.cache[i];
      var results = validatorFunc();
      if (setting.successTip) {
        new Validator().showMsg($(results.el), '', 1);
      }
      if (results.errorMsg) {
        result.push(results);
      }

    };
    return result;
  };

  Validator.prototype.showMsg = function (target, msg, status, callback) {
    //status
    // 0 : tip
    // 1 : success
    // 2 : error
    var _current = status ? (status > 1 ? 'error' : 'success') : 'tip';
    var errDom = target.closest(".form_item").find('.form_msg').get(0);//$('.' + errDom);
    var $errDom = $(errDom);
    !$errDom.length && ($errDom = target.next())
    $errDom.text(msg);
    if (_current == 'error') {
      $errDom.addClass('form_error');
      target.css('borderColor', 'red');
    } else {
      $errDom.removeClass('form_error');
      target.css('borderColor', '#c9c9c9');
    }
  };
	/**
	 * 错误失败回调
	 */
  var callback = function (dom, errMsg) {
    //		console.log('校验完毕一个')
    var validator = new Validator();
    $this = $(dom);
    if (errMsg) {
      console.log(errMsg)
      console.log(callbackResult)
      $this.attr('data-status', 0);
      validator.showMsg($this, errMsg, 2);
      callbackResult = false;
      validError = true;
      //			return false;
    } else {
      validator.showMsg($this, '', 1);
      //			callbackResult = true;
      //			return true;
    }
    if (validIndex == validLen || validError) {
      //			// 校验完成 ， 校验下一组
      if (isOnec) {
        isOnec = false;
        validError = false;
        validIndex = 0;
        validLen = 0;
        return;
      }
      //			console.log('检验下一组')
      validError = false;
      validIndex = 0;
      validLen = 0;
      validForm();
    } else {
      //			console.log('检验下一个')
      validEvent(dom);
    }

  }
	/**
	 * 验证方法
	 */
  var activeIndex = 0 // 当前校验方法的队列索引
  var valiCallback = undefined;
  var validForm = function () {
    var $required = $form.children().not(".exception").find('.required');
    var $vm = $required[activeIndex];
    activeIndex++;
    if (activeIndex <= $required.length) {
      validEvent($vm);
    } else {
      console.log('完毕')
      // 校验完毕、给出结果
      if (valiCallback) {

        valiCallback(callbackResult);
        callbackResult = true;
        activeIndex = 0;
        valiCallback = undefined;
        validIndex = 0;
        validLen = 0;
        validError = false;
      }
    }

  }
  var validIndex = 0;
  var validLen = 0;
  var validError = false;
  var isOnec = false;
  var validEvent = function (vm, e) {
    var $this = $(vm);
    var validator = new Validator();
    if ($this.parents(".exception").length > 0) {
      return false;
    }
    var dataValid = $this.attr('data-valid');
    validArr = !dataValid ? [] : dataValid.split('||');
    validLen = validArr.length;
    var strategyAry, strategy, errMsg;
    if (!validArr[validIndex]) {
      throw new Error('input.' + vm.className + ': 校验项目错误或自定义callback错误')
    }
    // 改为同步调用
    strategyAry = validArr[validIndex].split(':');
    strategy = strategyAry.shift();
    if (strategy == "custom") {
      //				console.log('校验自定义')
      var fun = validArr[validIndex].split(':')[1];
      console.log(fun)
      validIndex++;
      eval('vueDom.' + fun + '("' + vm.value + '",vm, callback, e)');
    } else {
      //				console.log('校验原生')
      //				console.log(strategy)
      //				console.log(vm)
      var errCollection = $this.attr('data-error');
      var errMsgAry = errCollection.split("||");
      strategyAry.unshift(vm.value);
      strategyAry.push(errMsgAry[validIndex]);
      strategyAry.push(vm);
      strategyAry.push(callback)
      validIndex++;
      RULES[strategy].apply(vm, strategyAry);
    }
  }
  var plugin = {
    init: function (options) {
      var $form = this;
      var $body = $('body');
      var $required = $form.find('.required');
      setting = $.extend(setting, options);
      if (setting.type) {
        $.extend(RULES, setting.type);
      }
      var validator = new Validator();
      $body.on({
        focus: function (event) {

          var $this = $(this);
          if ($this.parents(".exception").length > 0) {
            return false;
          }
          var _tipMsg = $this.attr('data-tip') || '';
          var _status = $this.attr('data-status');
          if (_status === undefined || !parseInt(_status)) {
            validator.showMsg($this, _tipMsg);
          }
          setting.onFocus ? setting.onFocus.call($this, arguments) : '';
        },
        blur: function (event) {

          /*var $this = $(this);
          isOnec = true;
          validEvent(this, event)
          setting.onBlur ? setting.onBlur.call($this, arguments) : '';*/
        },
        change: function (event) {

          var $this = $(this);
          isOnec = true;
          validEvent(this, event)
          setting.onChange ? setting.onChange.call($this, arguments) : '';
        }
      }, ".required");
    },
    clear: function () {
      // var $required = $('.valiform').children().not(".exception").find('.required');
      // if($required) {
      // 	var validator = new Validator();
      // 	for(var index in $required) {
      // 		// 防止深度遍历
      // 		if( $required.hasOwnProperty( index ) ) {
      // 			validator.showMsg($($required[index]), '', 1);
      // 		}
      // 	}
      // }
      $('.form_msg').text("")
      $('.required').css('borderColor', '#c9c9c9');
    },
    submitValidate: function (valiCb) {
      callbackResult = true;
      valiCallback = valiCb
      validForm();
    }
  };

  $.fn.validate = function () {
    // 验证调用的方法
    var method = arguments[0];
    // 验证回调
    var valiCallback = arguments[1];

    if (plugin[method]) {
      method = plugin[method];
      arguments = Array.prototype.slice.call(arguments, 1);
    } else if (typeof (method) == 'object' || !method) {
      method = plugin.init;
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.validate Plugin');
      return this;
    }
    $form = this
    return method.apply(this, arguments);
  }
  //表单验证
  $('.valiform').validate({
    onFocus: function () {
      return false;
    },
    onBlur: function () {
      return false;
    }
  });
}))
