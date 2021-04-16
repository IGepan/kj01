/**
 * 用户信息模块
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
		 * 验证用户名在有效的用户中是否唯一(鉴权)
		 */
    checkUserNameOnly: function (param) {
      return Http.postNoToast(httpUrl.baseUrl + '/user/checkUserNameOnly', param)
    },
		/**
		 * 根据字典编码和分组信息获取数据字典
		 */
    dict: function (param) {
      return Http.post(httpUrl.baseUrl + '/dict/select', param)
    },
		/**
		 * 文件上传
		 */
    upload: function (param) {
      return Http.post(httpUrl.baseUrl + '/file/upload', param)
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
		 * 修改用户信息(鉴权)
		 */
    updatePerson: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updatePerson', param)
    },
		/**
		 * 修改企业信息
		 */
    updateEnterprise: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updateEnterprise', param)
    },
		/**
		 * 修改高校信息
		 */
    updateSchool: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updateSchool', param)
    },
    /**
     * 修改科研及服务机构
     */
    updateMechanism: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updateMechanism', param)
    },
		/**
		 * 修改政府团体信息
		 */
    updateDepart: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updateDepart', param)
    },
		/**
		 * 获取用户详细信息(鉴权)
		 */
    detail: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/detail', param)
    },
		/**
		 * 修改个人认证信息(鉴权)
		 */
    updatePersonAuthen: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updatePersonAuthen', param)
    },
		/**
		 * 修改企业认证信息
		 */
    updateSchoolAuthen: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updateSchoolAuthen', param)
    },
		/**
		 * 修改机构认证信息(鉴权)
		 */
    updateEnterpriseAuthen: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/updateEnterpriseAuthen', param)
    },
		/**
		 * 取得用户认证信息(鉴权)
		 */
    detailPersonAuthen: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/detailPersonAuthen', param)
    },
		/**
		 * 取得企业认证信息(鉴权)
		 */
    detailEnterpriseAuthen: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/detailEnterpriseAuthen', param)
    },
		/**
		 * 取得当前用户账号信息
		 */
    buyer: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/buyer', param)
    },
		/**
		 * 指定分类下本站及下级站点收藏量较高的几条数据
		 */
    amountList: function (param) {
      return Http.post(httpUrl.baseUrl + '/collection/amountList', param)
    },
		/**
		 * 获取页面板块栏目店铺
		 */
    selectShopByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectShopByPage', param)
    },
      /**
       * 为您推荐-服务机构
       */
      selectShopRecommend: function (param) {
          return Http.get(httpUrl.baseUrl + '/shop/recommend', param)
      },
      /**
       * 为您推荐-专家
       */
      selectShopExpert: function (param) {
          return Http.get(httpUrl.baseUrl + '/shop/recommendExpert', param)
      },
		/**
		 * 条件搜索当前登录用户指定分类及所有下级分类的所有收藏
		 */
    selectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/collection/selectByPage', param)
    },
		/**
		 * 对外用户
		 */
    detailInfo: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/detailInfo', param)
    },
    /**
     * 分页取得我的贷款(鉴权)
     */
    loanSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/loan/selectByPage',param)
    },
    /**
     * 提交贷款申请(登录)
     */
    loanInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/loan/insert',param)
    },
    /**
     * 校验是否企业身份且已身份认证已通过(登录)
     */
    loancheckApply: function (param) {
      return Http.get(httpUrl.baseUrl + '/loan/checkApply',param)
    },
    /**
     * 分页取得我的贷款(鉴权)
     */
    loanselectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/loan/selectByPage',param)
    },
    /**
     * 获取考试列表（鉴权）
     */
    examSelectByPage: function (param) {
        return Http.post(httpUrl.baseUrl + '/exam/selectByPage',param)
    },
    /**
     * 获取关注的政策列表
     */
    getFocusPolicy: function (param) {
      return Http.get(httpUrl.baseUrl + '/label/list',param)
    },    
  }
})
