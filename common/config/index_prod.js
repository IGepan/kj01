define(function () {
  var isConfigIndex = ['main.liyantech.cn', 'kj01.liyantech.cn', 'intell.liyantech.cn','kjzx.liyantech.cn'].indexOf(location.host);
  var configs = [
    {
      authUrl: 'https://ts-zuul.liyantech.cn/tsOauth2',
      baseUrl: 'https://ts-zuul.liyantech.cn/tsAdmin',
      assisUrl: 'https://ts-zuul.liyantech.cn/tsAssistant',
      statisticsUrl: 'https://as.liyantech.cn', // 统计地址
      imgUploadUrl: 'https://fs.liyantech.cn', // 文件上传服务
      imgVerify: 'https://captcha.liyantech.cn/', // 滑块验证码
      cmsUrl: 'https://cynews.liyantech.cn',
      companyApi: 'http://47.108.80.38:8304',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/dev/',
      resourceUrl:'http://city-service.cykj01.com/',//资源中心的数据接口
    },
    {
      authUrl: 'http://ts-zuul.liyantech.cn/tsOauth2',
      baseUrl: 'http://ts-zuul.liyantech.cn/tsAdmin',
      assisUrl: 'http://ts-zuul.liyantech.cn/tsAssistant',
      statisticsUrl: 'http://as.liyantech.cn', // 统计地址
      imgUploadUrl: 'http://fs.liyantech.cn', // 文件上传服务
      imgVerify: 'http://captcha.liyantech.cn/', // 滑块验证码
      cmsUrl: 'https://kj01news.liyantech.cn',
      companyApi: 'http://47.108.80.38:8304',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/dev/'
    },
    {
      authUrl: 'https://ts-zuul.liyantech.cn/tsOauth2',
      baseUrl: 'https://ts-zuul.liyantech.cn/tsAdmin',
      assisUrl: 'https://ts-zuul.liyantech.cn/tsAssistant',
      statisticsUrl: 'https://as.liyantech.cn', // 统计地址
      imgUploadUrl: 'https://fs.liyantech.cn', // 文件上传服务
      imgVerify: 'https://captcha.liyantech.cn/', // 滑块验证码
      cmsUrl: 'https://intellnews.liyantech.cn',
      companyApi: 'http://47.108.80.38:8304',
      bigData: 'http://47.108.80.38:8309',
      datacq: 'https://www.datacq.com.cn/dev/'
    },
   {
     baseUrl: 'https://ts-zuul.liyantech.cn/tsAdmin',
     bigData:'http://183.230.169.117:8069',
     authUrl: 'http://172.16.9.34:9769/tsOauth2',
     imgVerify: 'https://captcha.liyantech.cn/', // 滑块验证码
   }
  ];
  isConfigIndex === -1 && (isConfigIndex = 0);
  return configs[isConfigIndex]
})
