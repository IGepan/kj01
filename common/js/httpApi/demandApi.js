define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    /******买家中心-我发布的需求、需求延期弹出窗口、取消需求弹出窗口、确认完成弹出窗口、服务评价弹出窗口、追评弹出窗口***/
    // 需求列表
    selectMyDemand: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/selectMyDemand', param)
    },
    // 需求延期弹出窗口-检查是否可以延迟
    canBeDelay: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/buyer/canBeDelay', param)
    },
    // 需求延期弹出窗口-延期需求
    delayDemand: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/delayDemand', param)
    },
    // 取消需求弹出窗口
    cancelDemand: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/cancelDemand', param)
    },
    // 确认完成弹出窗口-获取确认完成子窗口初始数据
    getCompleteDisplay: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/buyer/getCompleteDisplay', param)
    },
    // 确认完成弹出窗口-确认完成需求
    completeDemand: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/completeDemand', param)
    },
    // 下载协议
    buyerdownLoadProtocol: function (param) {
      return Http.blobFile(httpUrl.baseUrl + '/demand/buyer/downLoadProtocol?id=' + param.id)
    },
    // 服务评价弹出窗口
    buyerserviceEvaluate: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/serviceEvaluate', param)
    },
    // 追评弹出窗口
    buyerserviceEvaluateAdd: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/serviceEvaluateAdd', param)
    },
    /***********************************买家中心-需求编辑*********************************************/
    // 根据id获取需求信息
    initDemand: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/buyer/init', param)
    },
    // 新增需求
    insertDemand: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/insert', param)
    },
    // 根据id更新需求信息
    updateDemand: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/update', param)
    },
    /************************买家中心-投标列表画面、设置中标弹出窗口**********************************/
    // 根据需求id，分页取得当前登录用户的投标数据
    selectBidByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/selectBidByPage', param)
    },
    // 设置中标
    winningBid: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/buyer/winningBid', param)
    },
    /********************************买家中心-需求详情画面******************************************/
    // 根据id获取需求信息
    detailDemand: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/buyer/detail', param)
    },
    /*********************************买家中心-需求日志画面******************************************/
    // 根据id获取需求日志信息
    selectLog: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/buyer/selectLog', param)
    },
    /***********************************搜索结果需求列表*********************************************/
    // 条件搜索需求
    selectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/selectByPage', param)
    },
    /*********************************需求详情页面、投标弹出窗口***************************************/
    // 需求详情
    detail: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/detail', param)
    },
    // 校验投标资格
    didValidate: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/seller/didValidate', param)
    },
    // 投标
    insertDid: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/insertDid', param)
    },
    // 需求推荐
    recommend: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/recommend', param)
    },
    /***********************************卖家中心-我的投标*********************************************/
    // 分页条件取得当前登录用户的已投标列表
    myBidByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/myBidByPage', param)
    },
    /**********卖家中心-我的中标、申请延期弹出窗口、申请验收弹出窗口、服务评价弹出窗口**********************/
    // 分页条件取得当前登录用户的已中标需求列表
    winBidByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/winBidByPage', param)
    },
    // 申请延期数据
    selectDelay: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/selectDelay', param)
    },
    // 提交延期申请
    insertDelay: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/insertDelay', param)
    },
    // 申请验收数据
    selectCheck: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/selectCheck', param)
    },
    // 提效申请验收
    insertCheck: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/insertCheck', param)
    },
    // 获取评价窗口数据
    initEvaluate: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/initEvaluate', param)
    },
    // 下载协议
    sellerdownLoadProtocol: function (param) {
      return Http.blobFile(httpUrl.baseUrl + '/demand/buyer/downLoadProtocol?id=' + param.id)
    },
    // 服务评价
    serviceEvaluate: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/seller/serviceEvaluate', param)
    },
    /***********************************卖家中心-投标详情*********************************************/
    // 根据id获取投标信息
    didDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/seller/bidDetail', param)
    },
    // 查看中验信息详情（鉴权）
    intermediateDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/demand/buyer/intermediateDetail', param)
    }
  }
})
