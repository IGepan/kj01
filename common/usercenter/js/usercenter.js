define([
  'jquery',
], function ($) {
  return {
    data: {
      activeTabsIndex: 0
    },
    mounted: function () {
      var vm = this;
      $(".tabs li").click(function () {
        var i = $(this).index();
        $(this).addClass("active").siblings("li").removeClass("active");
        $(this).parents(".card").find(".item").eq(i).fadeIn(300).siblings(".item").hide();
      });

			/**
			 *	图片剪裁上传
			 *	创建时间：2017-08-016
			 *	作者：fan.jin
			 */

      $.fn.imgUploader = function (options) {
        var _this = $(this),
          defaults = {
            size: "320,180", //默认尺寸
            prebox: 'edithead', //$(this).attr("class"),
            sys: 'ts',
            url: "", // 上传文件接口路径
            type: $(this).attr('data-type') // 回传数据
          };
        var opts = $.extend({}, defaults, options),
          wh = opts.size.split(","),
          wa,
          ha,
          sys = opts.sys,
          b = opts.prebox;
        type = opts.type;
        if (wh[0] >= 500) {
          wa = (parseInt(wh[0]) * 2 + parseInt(20) + 40);
          ha = (parseInt(wh[1]) * 1 + parseInt(74) + 40);
        } else {
          wa = (parseInt(wh[0]) * 2.5 + parseInt(20) + 40);
          ha = (parseInt(wh[1]) * 1.5 + parseInt(74) + 40);
        }

        _this.after('<div class="cover"><div class="ctr"><div class="imguploader" style="width:' + wa + 'px; height:' + ha + 'px"><div class="t">编辑并上传图片<div class="cls"><div class="iconfont icon-jia"></div></div></div><div class="c"></div></div></div></div>');
        var obj = _this.next(".cover");
        obj.find(".c").html('<iframe style="height:' + (ha - 34) + 'px" src="/common/js/imguploader/index.html?w=' + wh[0] + '&h=' + wh[1] + '&b=' + b + '&sys=' + sys + '&type=' + type + '&url=' + opts.url + '" frameborder="0"></iframe>');
        obj.hide();
        _this.click(function () {
          obj.show();
          $("body").css("overflow", "hidden");
        });
        obj.find(".cls").click(function () {
          close();
          return false;
        });
        var close = function () {
          obj.hide();
          $("body").css("overflow", "auto");
        };
        return this;
      };
    },
    methods: {
      navTabsChange: function (index) {
        this.activeTabsIndex = index;
        this.tabChange();
      }
    },
  }
});
