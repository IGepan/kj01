define(function () {
  var isConfigIndex = ['web.kj01.cn','www.yzw.com','www.kj01.cn'].indexOf(location.host);

  var configs = [
    {

      //正式环境
      // authUrl: 'https://fapi.kj01.cn/tsOauth2',  // ts zuul
      // baseUrl: 'https://fapi.kj01.cn/tsAdmin',// ts zuul
      // assisUrl: 'https://fapi.kj01.cn/tsAssistant', // ts zuul
      // statisticsUrl: 'https://sts.kj01.cn', // 统计地址
      // imgUploadUrl: 'https://fileup.kj01.cn', // 文件上传服务
      // imgVerify: 'https://ver.kj01.cn/', // 滑块验证码
      // cmsUrl: 'https://cynews.liyantech.cn',
      // companyApi: 'https://www.dsjscpx.com',
      // bigData: 'https://47.105.63.195:801/',
      // datacq: 'https://www.datacq.com.cn/'

      //本地环境
      // authUrl: 'http://127.0.0.1:9769/tsOauth2',
      // baseUrl: 'http://127.0.0.1:9769/tsAdmin',
      // assisUrl: 'http://127.0.0.1:9769/tsAssistant',
      // statisticsUrl: 'http://127.0.0.1:9764', // 统计地址 配置域名
      // imgUploadUrl: 'http://127.0.0.1:8710', // 文件上传服务 配置域名
      // imgVerify: 'http://127.0.0.1:8720/', // 滑块验证码 配置域名
      // cmsUrl: 'https://cynews.liyantech.cn',
      // companyApi: 'http://47.108.80.38:8304',
      // bigData: 'http://47.105.63.195:801/',
      // datacq: 'https://www.datacq.com.cn/'


      //测试环境
      authUrl: 'http://222.180.163.242:9769/tsOauth2',
      baseUrl: 'http://222.180.163.242:9769/tsAdmin',
      assisUrl: 'http://222.180.163.242:9769/tsAssistant',
      statisticsUrl: 'http://222.180.163.242:9764', // 统计地址 配置域名
      imgUploadUrl: 'http://222.180.163.230:8710', // 文件上传服务 配置域名
      imgVerify: 'http://222.180.163.242:8720/', // 滑块验证码 配置域名
      // cmsUrl: 'https://cynews.liyantech.cn',
      companyApi: 'http://47.108.80.38:8304',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/'
    }

  ];
  isConfigIndex === -1 && (isConfigIndex = 0);
  return configs[0]
})
