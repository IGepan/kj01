/**
 * 店铺接口模块
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
		/**
		 * 取得当前用户某菜单下所有下级菜单(鉴权)
		 */
    menuTree: function (param) {
      return Http.get(httpUrl.baseUrl + '/menu/tree', param)
    },
		/**
		 * 取得当前用户的卖家信息(鉴权)
		 */
    userSeller: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/seller', param)
    },
		/**
		 * 取得该站点最新服务协议
		 */
    protocol: function (param) {
      return Http.post(httpUrl.baseUrl + '/protocol/selectLatest', param)
    },
		/**
		 * 我是服务商
		 */
    shopInsert: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/insert', param)
    },
		/**
		 * 分页取得店铺模板(鉴权)
		 */
    shoptempletSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/shoptemplet/selectByPage', param)
    },
		/**
		 * 根据模板主键取得模板可动态变更属性及【用户已经设定的默认值】(鉴权)
		 */
    shopsetInit: function (param) {
      return Http.post(httpUrl.baseUrl + '/shopset/init', param)
    },
		/**
		 * 根据模板主键取得模板可动态变更属性及【用户已经设定的默认值】(鉴权)
		 */
    categorySelectByVo: function (param) {
      return Http.get(httpUrl.baseUrl + '/category/selectByVo', param)
    },
		/**
		 * 根据字典编码和分组信息获取数据字典
		 */
    dict: function (param) {
      return Http.post(httpUrl.baseUrl + '/dict/select', param)
    },
		/**
		 * 获取行业列表
		 */
    industrySelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/industry/select', param)
    },
		/**
		 * 查询服务领域列表
		 */
    servicesSelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/services/select', param)
    },
		/**
		 * 店铺装修预览(鉴权)
		 */
    shopsetPreview: function (param) {
      return Http.post(httpUrl.baseUrl + '/shopset/preview', param)
    },
		/**
		 * 店铺装修修改(鉴权)
		 */
    shopsetUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/shopset/update', param)
    },
		/**
		 * 保存店铺基本信息(鉴权)
		 */
    shopinfoUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/shopinfo/update', param)
    },
		/**
		 * 保存店铺基本信息(鉴权)
		 */
    shopinfoDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/shopinfo/detail', param)
    },
		/**
		 * 根据模板Id取得动态属性(鉴权)
		 */
    shoptempletDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/shoptemplet/detail', param)
    },

    // 证书
		/**
		 * 获取证书列表
		 */
    certificateSelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/certificate/selectByVo', param)
    },
		/**
		 * 添加证书
		 */
    certificateInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/certificate/insert', param)
    },
		/**
		 * 修改证书
		 */
    certificateUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/certificate/update', param)
    },
		/**
		 * 删除证书
		 */
    certificateDel: function (param) {
      return Http.post(httpUrl.baseUrl + '/certificate/delete', param)
    },
		/**
		 * 初始化证书
		 */
    certificateDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/certificate/detail', param)
    },

    // 个人经历
		/**
		 * 取得当前登录用户所有工作经历
		 */
    workSelectByVo: function (param) {
      return Http.get(httpUrl.baseUrl + '/work/selectByVo', param)
    },
		/**
		 * 取得当前登录用户所有教育经历
		 */
    eduSelectByVo: function (param) {
      return Http.get(httpUrl.baseUrl + '/edu/selectByVo', param)
    },
		/**
		 * 新增工作经历
		 */
    workInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/work/insert', param)
    },
		/**
		 * 修改工作经历
		 */
    workUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/work/update', param)
    },
		/**
		 * 取得工作经历详情
		 */
    workInit: function (param) {
      return Http.get(httpUrl.baseUrl + '/work/init', param)
    },
		/**
		 * 删除工作经历
		 */
    workDel: function (param) {
      return Http.post(httpUrl.baseUrl + '/work/delete', param)
    },
		/**
		 * 新增教育经历
		 */
    eduInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/edu/insert', param)
    },
		/**
		 * 修改教育经历
		 */
    eduUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/edu/update', param)
    },
		/**
		 * 取得教育经历详情
		 */
    eduinit: function (param) {
      return Http.get(httpUrl.baseUrl + '/edu/init', param)
    },
		/**
		 * 删除教育经历
		 */
    eduDel: function (param) {
      return Http.post(httpUrl.baseUrl + '/edu/delete', param)
    },

    // 经营许可

		/**
		 * 新增经营许可(鉴权)
		 */
    licenseInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/license/insert', param)
    },
		/**
		 * 取得当前登录用户所有有效经营许可(鉴权)
		 */
    licenseSelectByVo: function (param) {
      return Http.get(httpUrl.baseUrl + '/license/selectByVo', param)
    },
		/**
		 * 删除选中经营许可(鉴权)
		 */
    licenseDel: function (param) {
      return Http.post(httpUrl.baseUrl + '/license/delete', param)
    },
		/**
		 * 根据经营许可主键取得详情(鉴权)
		 */
    licenseDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/license/detail', param)
    },
		/**
		 * 修改经营许可(鉴权)
		 */
    licenseUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/license/update', param)
    },

    // 店铺激活
		/**
		 * 取得店铺是否能激活信息(鉴权)
		 */
    shopSelectActivateinfo: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/selectActivateinfo', param)
    },

		/**
		 * 激活当前用户的店铺(鉴权)
		 */
    shopActivate: function (param) {
      return Http.get(httpUrl.baseUrl + '/shopinfo/activate', param)
    },
    // 供应

		/**
		 *  查询商品列表
		 */
    goodsSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/selectByPage', param)
    },
		/**
		 * 上架
		 * @param {Object} param
		 */
    goodsUp: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/up', param)
    },
		/**
		 * 下架
		 * @param {Object} param
		 */
    goodsDown: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/down', param)
    },
		/**
		 * 批量上架
		 * @param {Object} param
		 */
    goodsUpBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/upBatch', param)
    },
		/**
		 * 批量下架
		 * @param {Object} param
		 */
    goodsDownBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/downBatch', param)
    },
		/**
		 * 批量删除
		 * @param {Object} param
		 */
    goodsDeleteBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/deleteBatch', param)
    },
		/**
		 * 将选中产品设置为首页展示
		 * @param {Object} param
		 */
    goodsSethomeBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/setHomeBatch', param)
    },
		/**
		 * 将选中产品设置为店铺置顶
		 */
    goodsSetrootBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/setRootBatch', param)
    },
		/**
		 * 取得指定类目所有动态属性(鉴权)
		 */
    categorytplSelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/categorytpl/select', param)
    },
      /**
       * 易智商城类型
       */
    mailTypeSelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/mailServiceType/tree', param)
      },
		/**
		 * 商品详情(鉴权)
		 */
    goodsDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/goods/detail', param)
    },
		/**
		 * 根据属性id取得所有有效的属性值(鉴权)
		 */
    specSelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/spec/select', param)
    },
		/**
		 * 根据类目code取得类目名称(鉴权)
		 */
    categorySelectByCode: function (param) {
      return Http.get(httpUrl.baseUrl + '/category/selectByCode', param)
    },
		/**
		 * 商品新增(鉴权)
		 */
    goodsInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/insert', param)
    },
		/**
		 * 商品修改(鉴权)
		 */
    goodsUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/update', param)
    },
		/**
		 * 商品提交(鉴权)
		 */
    goodsSubmit: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/submit', param)
    },
		/**
		 * 校验店铺激活状态(鉴权)
		 */
    validateActive: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/validateActive', param)
    },
		/**
		 * 潜在订单(鉴权)
		 */
    selectDemandByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectDemandByPage', param)
    },
		/**
		 * 申请解冻初始数据取得(鉴权)
		 */
    initFrozen: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/initFrozen', param)
    },
		/**
		 * 申请解冻提交(鉴权)
		 */
    applyFrozen: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/applyFrozen', param)
    },
    // 获取当前登录用户注册手机号(鉴权)
    getUserPhone: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/getPhone', param)
    },
    // 是否已设置密码(鉴权)
    isPassword: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/isPassword', param)
    },
    // 以短信形式发送6位随机数(鉴权)
    sendCaptchaCode: function (param) {
      return Http.post(httpUrl.baseUrl + '/verify/sendCaptchaCode', param)
    },
    // 验证短信验证码是否正确(鉴权)
    checkCaptchaCode: function (param) {
      return Http.post(httpUrl.baseUrl + '/verify/checkCaptchaCode', param)
    },
    // 设置密码(鉴权)
    setPassword: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/setPassword', param)
    },
    // 修改密码(鉴权)
    changePassword: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/changePassword', param)
    },
    // 绑定手机(鉴权)
    bindingPhone: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/bindingPhone', param)
    },
    // 校验手机号是否注册(鉴权)
    checkPhone: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/checkPhone', param)
    },
    // 获取当前登录用户邮箱(鉴权)
    getEmail: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/getEmail', param)
    },
    // 验证邮箱是否注册(鉴权)
    emailCheck: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/checkEmail', param)
    },
    // 用邮箱发送6位随机数(鉴权)
    sendCaptchaCodeEmail: function (param) {
      return Http.post(httpUrl.baseUrl + '/verify/sendCaptchaCodeEmail', param)
    },
    // 绑定新邮箱(鉴权)
    bindingNewEmail: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/bindingEmail', param)
    },
    // 修改绑定邮箱(鉴权)
    bindingChangeEmail: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/changeEmail', param)
    },
    // 账号注销(鉴权)
    accountDestroy: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/accountDestroy', param)
    },
    // 账号注销(鉴权)
    checkAccountDestroy: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/checkAccountDestroy', param)
    },
    // 店铺升级申请提交（鉴权）
    upgradeSave: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/upgradeSave', param)
    },
    // 店铺升级提交申请详情（鉴权）
    upgradeDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/upgradeDetail', param)
    }
  }
})
