define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    /******卖家评价***/
    // 返回某订单主要信息
    detailBuyer: function (param) {
      return Http.get(httpUrl.baseUrl + '/order/seller/detailBuyer', param)
    },
    // 针对买家的首次评价更新至服务器
    sellerinsertFst: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/seller/insertFst', param)
    },
    // 根据筛选条件分页取得对应数据
    selectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/seller/selectByPage', param)
    },
    // 新增回复
    insert: function (param) {
      return Http.post(httpUrl.baseUrl + '/reply/insert', param)
    },
    // 取得订单详情精简版
    detailSpe: function (param) {
      return Http.get(httpUrl.baseUrl + '/order/buyer/detailSpe', param)
    },
    // 首次评价提交至服务器
    buyerinsertFst: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/buyer/insertFst', param)
    },
    // 修改首次评价提交至服务器
    updateFst: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/buyer/updateFst', param)
    },
    // 买家列表
    buyerForByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/buyer/selectByPage', param)
    },
    // 买家列表初始化评价
    buyerInit: function (param) {
      return Http.get(httpUrl.baseUrl + '/evaluate/buyer/init', param)
    },
    // 买家列表追加评价
    buyerInsertSec: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/buyer/insertSec', param)
    },
    // 买家列表修改评价
    buyerUpdateFst: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/buyer/updateFst', param)
    },
    // 买家评价详情
    buyerDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/evaluate/buyer/detail', param)
    },
  }
})
