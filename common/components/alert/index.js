// import alert from './alert'
define(['jquery'], function ($) {
  return {
    //toast
    toast: function (options) {
      var options = options || {};
      var texts = options.texts || ''
      var html = "<div class='cover toast' type='toast'><div class='ctr'><div class='tips'>" + texts + "</div></div></div>"
      $('body').prepend(html)
      setTimeout(function () {
        $("[type=toast]").remove();
      }, 2000)
    },
    showToast: function (texts) {
      this.toast({
        texts: texts
      })
    },

    //alert
    alert: function (options) {
      var options = options || {};
      var title = options.title || ''
      var texts = options.texts || ''
      var buttons = [];
      buttons[0] = options.buttons ? options.buttons[0] || '确定' : '确定'
      var html = "<div class='cover' type='alert'><div class='ctr'><div class='alert'><div class='clear'><div class='icon'></div><div class='content'><div class='title'>" + title + "</div><div class='text'>" + texts + "</div></div></div><button class='primary'>" + buttons[0] + "</button></div></div></div>"
      $('body').prepend(html)
      var iconHtml = ''
      if (options.degree == 'warning') {
        iconHtml = "<i class='iconfont icon-jinggao'></i>"
      } else if (options.degree == 'error') {
        iconHtml = "<i class='iconfont icon-cuowu'></i>"
      }
      $('.icon').append(iconHtml)
      $('.primary').on('click', function () {
        $("[type=alert]").remove();
      })
      $('.primary').on('click', options.callback)
    },
    alertWar: function (options) {
      options.degree = 'warning';
      this.alert(options);
    },
    //confirm
    confirm: function (options) {
      var options = options || {};
      var title = options.title || '';
      var texts = options.texts || '';
      var buttons = [];
      buttons[0] = options.buttons ? options.buttons[0] || '确定' : '确定'
      buttons[1] = options.buttons ? options.buttons[1] || '取消' : '取消'
      var html = "<div class='cover' type='confirm'><div class='ctr'><div class='alert confirm'><div class='clear'><div class='content'><div class='title'>" + title + "</div><div class='text'>" + texts + "</div></div></div><div class='btnbox'><button class='primary'>" + buttons[0] + "</button><button>" + buttons[1] + "</button></div></div></div></div>"
      $('body').prepend(html)
      $('.btnbox .primary').on('click', function () {
        typeof options.callback === 'function' && options.callback();
        $("[type=confirm]").remove();
      })
      $('.btnbox button:last-child').on('click', function () {
        typeof options.cancel === 'function' && options.cancel();
        $("[type=confirm]").remove();
      })
    },
    //confirm
    confirm2: function (opts) {
      // 如果有方法 必须显示返回 true
      var defaultOpts = {
        title: '示例展示',
        texts: '内容可以包含纯文本和HTML',
        class: '',
        width: '',
        btnBoxClass: '',
        close: true,
        buttons: [
          {
            label: '确定',
            class: 'form-button_confirm'
          },
          {
            label: '取消'
          }
        ],
        closeCallback: function () { return 1 }
      }
      var options = $.extend({}, defaultOpts, opts);
      var $body = $('body')
      var btns = ''
      opts && (options.title = opts.title || '')
      options.off = function () {
        this.$dom.off().remove()
        !$('.cover[type^="confirm2-"]').length && $('body').removeClass('overflow')
      }
      options.index = $('.cover[type^="confirm2-"]').length
      options.type = 'confirm2' + '-' + options.index
      // 框架开始
      var html = '<div class="cover ' + options.class + '" type="' + options.type + '"  style="z-index: ' + (100000 + options.index) + '"><div class="ctr"><div class="cover-box"' + (options.width ? ' style="width:' + options.width + '"' : '') + '>'
      // 头部
      options.title && (html += '<div class="form-title"><span class="active">' + options.title + '</span>' + (options.close ? '<span class="close">X</span>' : '') + '</div>')
      // 内容
      html += '<div class="form-view">' + options.texts + '</div>'
      // 按钮
      options.buttons.length && (btns = options.buttons.map(function (btn) {
        return '<button class="' + btn.class + '">' + btn.label + '</button>'
      }).join(''), html += '<div class="form-view_button ' + options.btnBoxClass + '">' + btns + '</div>')
      // 框架结束
      html += '</div></div></div>';
      !options.index && $body.addClass('overflow').append(html)
      options.index && $body.append(html)
      options.$dom = $("[type=" + options.type + "]")
        typeof options.onShow === 'function' && options.onShow(options);
      options.$dom.on('click', function (e) {
        var $target = $(e.target)
        if ($target.is('.close')||$target.parents('.close').length) {
          this.closeCallback ? (this.closeCallback() && this.off()) : this.off()
          return
        }
        if ($target.is('button')) {
          var index = $target.index()
          var callback = this.buttons[index].fun
          callback ? (callback(options) && this.off()) : this.off()
        }
      }.bind(options))
    },
		/**
		 * 显示loading
		 */
    showLoading: function () {
      var html = '<div id="loader" class="loader cover"><div class="ctr"><div class="loader-inner ball-pulse"><div></div><div></div><div></div></div></div></div>'
      $('body').prepend(html)
    },
		/**
		 * 隐藏loading
		 */
    hideLoading: function () {
      $('#loader').remove();
    },
  }
});

// this.alert({
//   texts:"fdsfds",
//   title:'fdsfdsfds',
//   buttons:[""]
// })
// this.confirm()
