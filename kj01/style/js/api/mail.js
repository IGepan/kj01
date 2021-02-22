/**
 * 易智商城等接口
 */
define(['jquery', 'dic', 'utils', 'httpUrl', 'http'], function ($, dic, utils, httpUrl, Http) {
    return {
        mailSiteDetail: function () {
            return Http.get(httpUrl.baseUrl + '/mailSite/detail');
        },
        mailServiceType: function () {
            return Http.get(httpUrl.baseUrl + '/mailServiceType/tree');
        },
    }
})
