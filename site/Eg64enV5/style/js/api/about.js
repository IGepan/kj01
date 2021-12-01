/**
 * 首页相关接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
    return {
        //协议
        selectLatest: function (param) {
            return Http.post(httpUrl.baseUrl + '/protocol/selectLatest', param);
        },
    }
})
