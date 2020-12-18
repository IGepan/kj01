/**
 * 登录接口模块
 */
define(['httpUrl', 'http', 'base64'], function (httpUrl, Http, base64) {
  return {
    // 登录
    oauth: function (param) {
      param.grant_type = 'password';
      param.login_type = 3;
      param.type = 'slider';
      return Http.formPost(httpUrl.authUrl + '/oauth/token', param, {
        'Authorization': 'Basic ' + $.base64.encode('ts_liyan:ts_liyan')
      })
    },
    // 以短信形式发送6位随机数
    sendCaptchaCode: function (param) {
      return Http.post(httpUrl.baseUrl + '/verify/sendCaptchaCode', param)
    },
    // 用户注册
    register: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/register', param)
    },
    // 检查手机号
    checkPhone: function (param) {
      return Http.getNoToast(httpUrl.baseUrl + '/user/checkPhone', param)
    },
    // 用户详情
    userDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/user/detail', param)
    }
  }
})
