define(function () {
  var isConfigIndex = ['www.cykj01.com', 'kj.kjy01.com', 'www.kj01.cn','kj01.cn', 'www.znhpt.com','www.kjzx.cn'].indexOf(location.host)
  var configs = [
    {
      authUrl: 'http://ts-zuul.cykj01.com/tsOauth2',
      baseUrl: 'http://ts-zuul.cykj01.com/tsAdmin',
      statisticsUrl: 'http://as.cykj01.com', // 统计地址
      imgUploadUrl: 'http://fs.cykj01.com', // 文件上传服务
      imgVerify: 'http://captcha.cykj01.com/', // 滑块验证码
      cmsUrl: 'http://news.cykj01.com',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/',
      resourceUrl:'http://city-service.cykj01.com/',//资源中心的数据接口
    }, {
      authUrl: 'https://ts-zuul.kjy01.com/tsOauth2',
      baseUrl: 'https://ts-zuul.kjy01.com/tsAdmin',
      statisticsUrl: 'https://as.kjy01.com', // 统计地址
      imgUploadUrl: 'https://fs.kjy01.com', // 文件上传服务
      imgVerify: 'https://captcha.kjy01.com/', // 滑块验证码
      cmsUrl: 'https://news.kjy01.com',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/'
    }, {
      authUrl: 'https://ts-zuul.kj01.cn/tsOauth2',
      baseUrl: 'https://ts-zuul.kj01.cn/tsAdmin',
      assisUrl: 'https://ts-zuul.kj01.cn/tsAssistant',
      statisticsUrl: 'https://as.kj01.cn', // 统计地址
      imgUploadUrl: 'https://fs.kj01.cn', // 文件上传服务
      imgVerify: 'https://captcha.kj01.cn/', // 滑块验证码
      cmsUrl: 'https://news.kj01.cn',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/'
    },{
      authUrl: 'https://ts-zuul.kj01.cn/tsOauth2',
      baseUrl: 'https://ts-zuul.kj01.cn/tsAdmin',
      assisUrl: 'https://ts-zuul.kj01.cn/tsAssistant',
      statisticsUrl: 'https://as.kj01.cn', // 统计地址
      imgUploadUrl: 'https://fs.kj01.cn', // 文件上传服务
      imgVerify: 'https://captcha.kj01.cn/', // 滑块验证码
      cmsUrl: 'https://news.kj01.cn',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'http://47.105.63.195:801/',
      datacq: 'https://www.datacq.com.cn/'
    }, {
      authUrl: 'http://ts-zuul.cykj01.com/tsOauth2',
      baseUrl: 'http://ts-zuul.cykj01.com/tsAdmin',
      statisticsUrl: 'http://as.cykj01.com', // 统计地址
      imgUploadUrl: 'http://fs.cykj01.com', // 文件上传服务
      imgVerify: 'http://captcha.cykj01.com/', // 滑块验证码
      cmsUrl: 'http://news.znhpt.com',
      companyApi: 'https://www.dsjscpx.com',
      bigData: 'http://47.108.80.38:8309',
      datacq: 'https://www.datacq.com.cn/'
    },
    {
      bigData:'http://183.230.169.117:8069',
    }
  ]
  isConfigIndex === -1 && (isConfigIndex = 0);
  return configs[isConfigIndex]
})
