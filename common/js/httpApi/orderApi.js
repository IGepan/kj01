/**
 * 订单模块
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 分页条件取得我的订单	post
    buyerSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyer/selectByPage', param)
    },
    // 批量删除	post
    buyerDeleteBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyer/deleteBatch', param)
    },
    // 取消订单，订单状态迁移	post
    buyerCancel: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyer/cancel', param)
    },
    // 确认订单，订单状态迁移	post
    buyerCheck: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyer/check', param)
    },
    // 将订单主表中买家回收标识设置为是	post
    buyerDelete: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyer/delete', param)
    },
    // 确认收货	post
    buyerReceipt: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyer/receipt', param)
    },
    // 确认支付
    buyerpayment: function (param) {
      return Http.get(httpUrl.baseUrl + '/order/buyer/payment', param)
    },
    // 订单详情	get
    buyerDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/order/buyer/detail', param)
    },
    // 分页条件取得我的订单	post
    sellerSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/seller/selectByPage', param)
    },
    // 批量删除	post
    sellerDeleteBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/seller/deleteBatch', param)
    },
    // 文件上传	post
    sellerUpload: function (param) {
      return Http.post(httpUrl.baseUrl + '/file/upload', param)
    },
    // 取消订单，订单状态迁移	post
    sellerCancel: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/seller/cancel', param)
    },
    // 将订单主表中买家回收标识设置为是	post
    sellerDelete: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/seller/delete', param)
    },
    // 申请验收，改变订单状态	post
    sellerApplyCheck: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/seller/applyCheck', param)
    },
    // 订单详情
    sellerDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/order/seller/detail', param)
    },
    // 更改订单协议价格	post
    sellerChangePrice: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/seller/changePrice', param)
    },
    // 确认发货
    sellershipments: function (param) {
      return Http.get(httpUrl.baseUrl + '/order/seller/shipments', param)
    },
		/**
		 * 当前店铺最新交易用户列表
		 */
    tradeUserList: function (param) {
      return Http.get(httpUrl.baseUrl + '/order/tradeUserList', param)
    },
		/**
		 * 取得关注当前店铺的用户 该接口不鉴权，店铺首页也调用该接口
		 */
    whoConcern: function (param) {
      return Http.post(httpUrl.baseUrl + '/collection/whoConcern', param)
    },
    /**
		 * 取分页取得我在所有站点发布的需求(鉴权)
		 */
    diagnosisByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/diagnosis/selectByPage', param)
    },
    /**
     * 收藏方案
     */
    planByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/plan/selectByPage', param)
    },
    /**
     * 删除收藏方案
     */
    plandelete: function (param) {
      return Http.post(httpUrl.baseUrl + '/plan/delete', param)
    },
    /**
     * 批量删除收藏方案
     */
    plandeleteBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/plan/deleteBatch', param)
    },
    /**
     * 修改收藏方案名称
     */
    planupdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/plan/update', param)
    },
    /**
     * 修改收藏方案名称
     */
    plandetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/plan/detail', param)
    },
    /**
     * 修改收藏方案名称
     */
    addshopcar: function (param) {
      return Http.post(httpUrl.baseUrl + '/shopcar/add', param)
    },
    getFileBlob: function (url) {
      return Http.blobFile(url)
    },
    /**
     * 收藏商品
     */
    goodsSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/collection/selectByPage', param)
    },
    /**
     * 删除收藏商品
     */
    goodscancel: function (param) {
      return Http.get(httpUrl.baseUrl + '/collection/cancel', param)
    },
    /**
     * 批量删除收藏商品
     */
    goodscancelBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/collection/deleteBatch', param)
    },
  //  服务案例start
    //分页获取服务案例（鉴权）
    serviceCaseSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/serviceCase/selectByPage', param)
    },
    //删除服务案例（鉴权）
    serviceCaseDelete: function (param) {
      return Http.post(httpUrl.baseUrl + '/serviceCase/delete', param)
    },
    //服务案例详情（鉴权)
    serviceDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/serviceCase/detail', param)
    },
    //新增服务案例（鉴权）
    serviceCaseInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/serviceCase/insert', param)
    },
    //修改服务案例（鉴权）
    serviceCaseUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/serviceCase/update', param)
    },
    //服务案例提交审核（鉴权）
    serviceCaseSubmit: function (param) {
      return Http.post(httpUrl.baseUrl + '/serviceCase/submit', param)
    },
  //  服务案例end

  }
})
