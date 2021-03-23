define(function () {
  var isConfigIndex = ['main.liyantech.cn:8081', 'kj01.liyantech.cn:8080', 'intell.liyantech.cn:8083','kjzx.liyantech.cn:8082','testweb.kj01.cn'].indexOf(location.host);
  var configs = [
    {
      // authUrl: 'http://ts-zuul.liyantech.cn/tsOauth2',
      authUrl: 'http://172.16.9.34:9769/tsOauth2',
      // baseUrl: 'http://ts-zuul.liyantech.cn/tsAdmin',
      baseUrl: 'http://172.16.9.34:9769/tsAdmin',
      assisUrl: 'http://ts-zuul.liyantech.cn/tsAssistant',
      statisticsUrl: 'http://as.liyantech.cn', // 统计地址
      imgUploadUrl: 'http://fs.liyantech.cn', // 文件上传服务
      imgVerify: 'http://captcha.liyantech.cn/', // 滑块验证码
      cmsUrl: 'http://cynews.liyantech.cn',
      companyApi: 'http://47.108.80.38:8304',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/dev/',
      resourceUrl:'http://city-service.cykj01.com/',//资源中心的数据接口
    },
    {
      authUrl: 'http://ts-zuul.liyantech.cn/tsOauth2',
      // authUrl: 'http://172.16.9.34:9769/tsOauth2',
      baseUrl: 'http://ts-zuul.liyantech.cn/tsAdmin',
      // baseUrl: 'http://172.16.9.34:9769/tsAdmin',
      assisUrl: 'http://ts-zuul.liyantech.cn/tsAssistant',
      statisticsUrl: 'http://as.liyantech.cn', // 统计地址
      imgUploadUrl: 'http://fs.liyantech.cn', // 文件上传服务
      imgVerify: 'http://captcha.liyantech.cn/', // 滑块验证码
       // imgVerify: 'http://172.16.9.34:8720/', // 滑块验证码
      cmsUrl: 'http://kj01news.liyantech.cn',
      // cmsUrl: 'http://news.kj01.cn',
      companyApi: 'http://47.108.80.38:8304',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/dev/'
    },
    {
      authUrl: 'http://ts-zuul.liyantech.cn/tsOauth2',
      baseUrl: 'http://ts-zuul.liyantech.cn/tsAdmin',
      // baseUrl: 'http://172.16.9.34:9769/tsAdmin',
      assisUrl: 'http://ts-zuul.liyantech.cn/tsAssistant',
      statisticsUrl: 'http://as.liyantech.cn', // 统计地址
      imgUploadUrl: 'http://fs.liyantech.cn', // 文件上传服务
      imgVerify: 'http://captcha.liyantech.cn/', // 滑块验证码
      cmsUrl: 'http://intellnews.liyantech.cn',
      companyApi: 'http://47.108.80.38:8304',
      bigData: 'http://data.znhpt.com',
      datacq: 'https://www.datacq.com.cn/dev/',
      kj01Url:'http://kj01.liyantech.cn:8080'
    },
    {
      baseUrl: 'http://ts-zuul.liyantech.cn/tsAdmin',
      // baseUrl: 'http://172.16.9.34:9769/tsAdmin',
      authUrl: 'http://ts-zuul.liyantech.cn/tsOauth2',
      // authUrl: 'http://172.16.9.34:9769/tsOauth2',
      bigData:'http://183.230.169.117:8069',
      imgVerify: 'http://captcha.liyantech.cn/', // 滑块验证码
      imgUploadUrl: 'http://fs.liyantech.cn', // 文件上传服务
      statisticsUrl: 'http://as.liyantech.cn', // 统计地址
      reportDocumentUrl: 'http://39.100.48.36:3093', // 分析报告-论文，新闻
    },{
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
    }
  ];
  isConfigIndex === -1 && (isConfigIndex = 0);
  return configs[isConfigIndex]
})
