/**
 * 易智商城等接口
 */
define(['jquery', 'dic', 'utils', 'httpUrl', 'http'], function ($, dic, utils, httpUrl, Http) {
    return {
        //商城统计,基本信息
        mailSiteDetail: function () {
            return Http.get(httpUrl.baseUrl + '/mailSite/selectMailSite');
        },
        //服务分类
        mailServiceType: function () {
            return Http.get(httpUrl.baseUrl + '/mailServiceType/tree');
        },
        //查询指定位置banner
        selectBanner: function (param) {
            return Http.post(httpUrl.baseUrl + '/banner/selectByType', param);
        },
        //分页查询商品列表
        selectMailGoods: function (param) {
            return Http.post(httpUrl.baseUrl + '/mailGoods/selectByPage', param);
        },
        //发布需求
        saveMailDemand: function (param) {
            return Http.post(httpUrl.baseUrl + '/mailDemand/save', param);
        },
        //帮助中心列表查询
        mailHelpSelectByPage: function (param) {
            return Http.post(httpUrl.baseUrl + '/mailHelp/selectByPage', param);
        },
        //帮助中心问题详情
        mailHelpSelectDetail: function (param) {
            return Http.post(httpUrl.baseUrl + '/mailHelp/selectDetail', param);
        },
        //足迹列表查询
        selectMailGoodsPrint: function (param) {
            return Http.post(httpUrl.baseUrl + '/mailGoodsPrint/selectByPage', param);
        },
        //删除足迹
        deleteGoodsPrint: function (param) {
            return Http.post(httpUrl.baseUrl + '/mailGoodsPrint/delete', param);
        },
        //提交投诉
        saveMailFeedback: function (param) {
            return Http.post(httpUrl.baseUrl + '/mailFeedback/save', param);
        },
    }
})
