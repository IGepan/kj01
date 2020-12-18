/**
 * 首页等接口
 */
define(['jquery', 'httpUrl', 'http'], function ($, httpUrl, Http) {
  var header = { 'ak': 'b8a24b9b57880f1623f794db363eb10b' };
  return {
    // 首页数据统计
    indexNum: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/enterprisecq/indexNum', param, header);
    },
    // 重庆市及所属区县
    cqAreaCode: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/administrativeregion/list', param, header);
    },
    // 企业行业门类
    industryListType: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/industry/list', param, header);
    },
    // 仪器分类接口
    apparatusListType: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/equipmenttype/list', param, header);
    },
    // 科技人才专业领域
    fields: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/scienceTalent/fields', param, header);
    },
    // 机构类型与服务行业接口
    getTypes: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/cqresearchbase/getTypes', param, header);
    },
    // 科技人才列表
    talentList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/scienceTalent/talentList', param, header);
    },
    // 科技人才详情
    talentListDetail: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/scienceTalent/talentDetail', param, header);
    },
    // 获取企业列表接口
    enterprisecqList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/enterprisecq/list', param, header);
    },
    // 获取企业详情接口
    enterprisecqDetail: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/enterprisecq/detail', param, header);
    },
    // 研发机构列表
    cqresearchbaseList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/cqresearchbase/list', param, header);
    },
    // 研发机构详情
    cqresearchbaseDetail: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/cqresearchbase/showDetail', param, header);
    },
    // 仪器设备列表
    equipmentinstrumentList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/equipmentinstrument/list', param, header);
    },
    // 仪器设备详情
    equipmentinstrumentDetail: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/equipmentinstrument/detail', param, header);
    },
    // 仪器设备列表
    equipmentinstrumentList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/equipmentinstrument/list', param, header);
    },
    // 论文列表
    paperList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/paper/paperList', param, header);
    },
    // 专利列表
    patentList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/patent/patentList', param, header);
    }
  }
})
