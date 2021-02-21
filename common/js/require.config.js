/**
 * 全局依赖配置
 */
require.config({
  baseUrl: '/common/',//'http://www.cqmall.com:81/',

  paths: {
    jquery: 'js/libs/jquery-3.2.1.min',
    validate: 'js/libs/jquery.validate.min',
    vue: 'js/libs/vue', //
    ELEMENT: "js/libs/element",
    base64: 'js/libs/jq.base64',
    polyfill: 'js/libs/polyfill.min',
    promise: 'js/libs/es6-promise.min', // 转码
    httpUrl: 'config/index',
    http: 'js/sy_main',
    ZeroClipboard: "js/libs/static/UEditor/third-party/zeroclipboard/ZeroClipboard.min", // 富文本编辑器主要是加这句话
    // 接口
    httpLogin: 'js/httpApi/login',
    httpUser: 'js/httpApi/user',
    httpStoret01: 'js/httpApi/store',
    httpStore: 'js/httpApi/storeSet',
    httpCom: 'js/httpApi/common',
    httpCartApi: 'js/httpApi/cartapi',
    httpUserAddressApi: 'js/httpApi/userAddressApi',
    httpOrderApi: 'js/httpApi/orderApi',
    httpDemandApi: 'js/httpApi/demandApi',
    httpEvaluateApi: 'js/httpApi/evaluateapi',
    // 配置
    dic: 'config/dic',
    img_captcha: 'js/libs/captcha/img_captcha',
    httpVueLoader: 'js/libs/httpVueLoader',
    carousel: 'js/libs/owl.carousel.2.2.1/owl.carousel.min',
    // 工具类
    utils: 'js/utils/index',
    // jq插件
    jqcloud: 'js/libs/jqcloud-1.0.4',
    jqValidate: 'js/libs/jquery-validate',
    jqSelect: 'js/libs/select',
    nicescroll: 'js/libs/jquery.nicescroll.min',
    dialog: 'components/alert/index',
    fileSaver: 'js/libs/FileSaver.min',
    echarts: 'js/libs/echarts.min',
    superSlide:'js/libs/jquery.SuperSlide.2.1.3.js',
    // 用户中心
    userCenter: 'usercenter/js/usercenter',
    // 店铺装修
    seller: 'seller/js/seller',
    // 供应
    addpatentKey: 'seller/mixins/addpatentKey',
    im: 'js/libs/im/index',
    websdk: 'js/libs/im/websdk-1.11.0',
    laydate: 'js/laydate/laydate',
    viewerjs: 'js/libs/vviewwer/viewer.min',
    VueViewer: 'js/libs/vviewwer/v-viewer',
    VueUeditor: 'js/libs/vue-ueditor-wrap.min',
  },
  waitSeconds: 0, //没有超时，默认是7秒超时
  shim: {
    'img_captcha': {
      exports: 'captcha' //exports的值为js提供的 对外接口的名称
    },
    // "ELEMENT": {
    //   "deps": ["vue", "css!/common/css/element.css"]
    // },
    'httpVueLoader': {
      exports: 'httpVueLoader'
    },
    'nicescroll': ['jquery'],
    'base64': ['jquery'],
    'validate': ['jquery'],
    'carousel': ['jquery'],
    'jqcloud': ['jquery'],
    'jqValidate': ['jquery'],
    'jqSelect': ['jquery']
  }
});
// 转码
define(['promise', 'vue', 'dialog', 'utils', 'httpCom', 'ZeroClipboard', 'httpUrl', 'http', 'im', 'viewerjs', 'VueViewer','ELEMENT'], function (Promise, Vue, dialog, utils, httpCom, ZeroClipboard, httpUrl, http, im, viewerjs, VueViewer,ELEMENT) {
  Vue.prototype.$utils = utils;
  Vue.prototype.$httpCom = httpCom;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.$http = http;
  Vue.use(im);
  Vue.use(VueViewer.default)
  Vue.use(ELEMENT)
  window.Promise = Promise;
  window.$httpCom = httpCom;
  window.$dialog = dialog;
  window.httpUrl = httpUrl;
  window['ZeroClipboard'] = ZeroClipboard;
  // dialog.showLoading();
  // setTimeout(function () {
  //     dialog.hideLoading();
  // }, 1000);
  Vue.filter('formatPrice', function (flag, v, n, m) {
    if(flag === '1') {
      return '面议'
    } else {
      if(typeof v !== 'undefined') {
        return v
      } else if(!v && !m) {
        return n
      } else {
        return n + '-' + m
      }
    }
  })
});
