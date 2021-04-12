/**
 * 活动发布等接口
 */
define(['jquery', 'dic', 'utils', 'httpUrl', 'http'], function ($, dic, utils, httpUrl, Http) {
  return {
    // 分页取得我发布的活动(鉴权)
    selectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectByPage', param);
    },
    // 执行上/下架操作(鉴权)
    shelf: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/shelf', param);
    },
    // 删除活动(鉴权)
    delete: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/delete', param);
    },
    // 编辑活动(鉴权)
    update: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/update', param);
    },
    // 保存活动并提交(鉴权)
    updateSubmit: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/updateSubmit', param);
    },
    // 活动详情(鉴权)
    detail: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/detail', param);
    },
    // 新增活动(鉴权)
    insert: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/insert', param);
    },
    // 保存活动并提交(鉴权)
    submit: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/submit', param);
    },
    // 获取模板表单项(鉴权)
    getByCode: function (param) {
      return Http.get(httpUrl.baseUrl + '/templete/getByCode', param);
    },
    // 取得我的指定活动的报名信息表格头部(鉴权)
    enrollHeader: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/enroll/selectHeader', param);
    },
    // 分页取得我的指定活动的报名信息(鉴权)
    enrollByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/enroll/selectByPage', param);
    },
    // 审核报名信息(鉴权)
    audit: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/enroll/audit', param);
    },
    // 取得我的指定活动的签到信息表格头部(鉴权)
    signHeader: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/sign/selectHeader', param);
    },
    // 分页取得我的指定活动的签到信息(鉴权)
    signByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/sign/selectByPage', param);
    },
    // 取得我的指定活动的意见信息表格头部(鉴权)
    receiptHeader: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/receipt/selectHeader', param);
    },
    // 分页取得我的指定活动的意见信息(鉴权)
    receiptByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/receipt/selectByPage', param);
    },
    // 活动回顾详情(鉴权)
    summaryDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/summary/detail', param);
    },
    // 保存活动回顾(鉴权)
    summaryUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/summary/submit', param);
    },
    // 活动二维码
    getWxcode: function (param) {
      return Http.getFile(httpUrl.baseUrl + '/active/getWxacode', param, 'get', 'image/*;charset=UTF-8');
    },
    // 签到二维码
    getWxSignCode: function (param) {
      return Http.getFile(httpUrl.baseUrl + '/wxApp/active/getActiveSignPageQRCodeByActiveId', param, 'get', 'image/*;charset=UTF-8');
    },
    // 意见征集列表excel导出(鉴权)
    receiptListExport: function (param) {
      return Http.getFile(httpUrl.baseUrl + '/active/receipt/receiptListExport', param, 'post', 'application/json;charset=UTF-8');
    },
    // 签到列表excel导出(鉴权)
    signListExport: function (param) {
      return Http.getFile(httpUrl.baseUrl + '/active/sign/signListExport', param, 'post', 'application/json;charset=UTF-8');
    },
    // 报名列表excel导出(鉴权)
    enrollListExport: function (param) {
      return Http.getFile(httpUrl.baseUrl + '/active/enroll/enrollListExport', param, 'post', 'application/json;charset=UTF-8');
    },
    // 报名列表excel导出(鉴权)
    selectPolicy: function (param) {
      return Http.get(httpUrl.baseUrl + '/htmlTemplete/selectActive', param);
    },
    // 判断是否活动(鉴权)
    isActiveLock: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/isActiveLock', param);
    },
    // 获取通用多级树(鉴权)
    getTree: function (param) {
      return Http.post(httpUrl.baseUrl + '/treeMapSaas/getTree', param);
    },
    // 统计查询(鉴权)
    statisticsGraph: function (param) {
      return Http.post(httpUrl.baseUrl + '/index/statisticsGraph', param);
    },
    // 获取通用多级树(鉴权)
    importEnrollCVS: function (param, collback, errorback) {

      var LOGIN_INFO = utils.getCookie(dic.locaKey.LOGIN_INFO);
      var head = {'access-token': ''}
      if (LOGIN_INFO && LOGIN_INFO !== 'null') {
        LOGIN_INFO = JSON.parse(LOGIN_INFO)
        head['access-token'] = LOGIN_INFO.access_token
      }
      $.ajax({
        headers: head,
        url: httpUrl.baseUrl + '/active/enroll/importEnrollCVS',//后台的接口地址
        type:"post",  //post请求方式
        data: param,  //参数
        cache: false,
        processData: false,
        contentType: false,
        xhrFields: {  // 这样在请求的时候会自动将浏览器中的cookie发送给后台
          withCredentials: true
        },
        dataType:"json",
        success:function (data) {
          collback(data)
        },
        error:function (err) {
          errorback(err)
        }
      })
    },
    //判断当前用户是否有创建直播的权限
    liveAuth: function (param) {
      return Http.get(httpUrl.baseUrl + '/userAuth/validateUserAuth', param);
    },
    //开始直播
    startLive: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/startWeiho', param);
    },
    //结束直播
    endLive: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/endWeiho', param);
    },
    //获取推流地址
    getStreamUrl: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getPushAdress', param);
    },
  }
})
