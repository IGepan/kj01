define(function () {
  var isConfigIndex = ['dev.kj02.cn','testweb.kj01.cn','www.kj01.cn'].indexOf(location.host);

  var configs = [
    {
      // 本地环境
      authUrl: 'http://192.168.0.200:9769/tsOauth2',
      // baseUrl: 'http://192.168.1.3:9769/tsAdmin',
      baseUrl: 'http://192.168.0.200:9769/tsAdmin',
      assisUrl: 'http://192.168.0.200:9769/tsAssistant',
      statisticsUrl: 'http://192.168.0.200/as', // 统计地址 配置域名
      imgUploadUrl: 'http://192.168.0.200:8710', // 文件上传服务 配置域名
      imgVerify: 'http://192.168.0.200:8720/', // 滑块验证码 配置域名
      cmsUrl: 'https://cynews.liyantech.cn',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/'
    },
    {
      //测试环境
      authUrl: 'http://222.180.163.242:9769/tsOauth2',
      baseUrl: 'http://222.180.163.242:9769/tsAdmin',
      assisUrl: 'http://222.180.163.242:9769/tsAssistant',
      statisticsUrl: 'http://testweb.kj01.cn/as', // 统计地址 配置域名
      imgUploadUrl: 'http://222.180.163.230:8710', // 文件上传服务 配置域名
      imgVerify: 'http://222.180.163.242:8720/', // 滑块验证码 配置域名
      // cmsUrl: 'https://cynews.liyantech.cn',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/'
    },{
      //正式环境
      authUrl: 'https://ts-zuul.kj01.cn/tsOauth2',  // ts zuul
      baseUrl: 'https://ts-zuul.kj01.cn/tsAdmin',// ts zuul
      assisUrl: 'https://ts-zuul.kj01.cn/tsAssistant', // ts zuul
      statisticsUrl: 'https://www.kj01.cn/asapi', // 统计地址
      imgUploadUrl: 'https://fs.kj01.cn', // 文件上传服务
      imgVerify: 'https://captcha.kj01.cn/', // 滑块验证码
      cmsUrl: 'https://cms.kj01.cn/',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'https://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/'
    }

  ];
  isConfigIndex === -1 && (isConfigIndex = 0);
  return configs[isConfigIndex]
})
