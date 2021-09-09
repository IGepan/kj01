// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/polist.js', 'laydate', 'httpUrl'], 
    function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
    new Vue({
      el: '#index_box',
      data: {
        saasId: '',
        breadcrumb: [
          {
            label: '资讯',
            url: '/polist.html'
          },
          {
            label: '科技动态'
          }
        ],
        recommendList: [
          {
            applyStatusDisplay: 0,
            country: "100",
            countryDisplay: "中国",
            dismantleFlag: "0",
            id: "220139809381756928",
            level: "02",
            levelDisplay: "省/直辖市",
            province: "500000",
            provinceDisplay: "重庆",
            publishDate: "2020.02.28",
            publishDepartmentDisplays: ["市场监管", "金融", "国资"],
            selfTagNames: ["资格资质", "双创投资"],
            summary: "鬼画符覅房价高i韩国i吧 和vi素有归属放沙发更黑u和vi人把日哦父亲哦九年发生的给很符合人v",
            title: "施行日期起止不必不填",
            itemUrl: '/podetail.html?id=220139809381756928'
          }
        ],
        pages: {
          hasNextPage: true,
          hasPreviousPage: true,
          isFirstPage: true,
          isLastPage: false,
          navigateFirstPage: 1,
          navigateLastPage: 8,
          navigatePages: 8,
          navigatepageNums: [1, 2, 3, 4, 5, 6, 7, 8],
          nextPage: 2,
          pageNum: 4,
          pageSize: 8,
          pages: 11,
          prePage: 0,
          size: 8,
          startRow: 1,
          total: 84
        },
        newsList: [
          {
            description: "武汉：志愿者在行动",
            title: "武汉：志愿者在行动",
            url: "https://kj01news.liyantech.cn/kj01/cxqy/20200224/382.html",
            releaseDate: "2020-02-24 14:59:35",
            siteName: "易智网科技服务平台"
          }
        ]
      },
      filters: {
        formatTime: function (v) {
          return v ? v.split(' ')[0] : ''
        }
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'sub-head': httpVueLoader('/style/components/sub-head.vue'),
        'web-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {},
      methods: {}
    });
  })
});
