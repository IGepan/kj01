// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/service.js', '/style/js/libs/scroll.js',
    '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, indexApi, scroll, owlCarousel, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: '',
          counts: [
            {
             imgurl: '/style/images/market/polygon1.png',
             count: 0,
             unit: '项',
             key: 'techCount',
             label: '技术成果',
             url: '/service/results_list.html'
            },
            {
             imgurl: '/style/images/market/polygon4.png',
             count: 0,
             unit: '项',
             key: 'demandCount',
             label: '企业需求',
             url: '/service/demand_list.html'
            },
            {
             imgurl: '/style/images/market/polygon3.png',
             count: 0,
             unit: '家',
             key: 'shopCount',
             label: '服务机构',
             url: '/service/organization_list.html'
            },
            {
             imgurl: '/style/images/market/polygon2.png',
             count: 0,
             unit: '条',
             key: 'serviceCount',
             label: '服务资源',
             url: '/service/resource_list.html'
            }
           ],
          demandList: [],
          resultsList: [],
          firstList: [],
          ykrlist: [],
          secondList: 0,
          lastList: [],
          serviceList004: [],
          serviceList010: [],
          serviceList010A: [],
          serviceList009: [],
          serviceList002: [],
          serviceList001: [],
          serviceList006: [],
          serviceList007: [],
          serviceList005: [],
          organizationList010: [],
          organizationList009: [],
          organizationList002: [],
          organizationList001: [],
          serviceNavs: [
            {
              label: '技术转移',
              active: true,
              value: 'serviceList003',
              url:'/service/resource_list.html?stype=003'
            },
            {
              label: '科技咨询',
              active: false,
              value: 'serviceList005',
              url:'/service/resource_list.html?stype=005'
            },
            {
              label: '财税法律',
              active: false,
              value: 'serviceList007',
              url:'/service/resource_list.html?stype=007'
            }
          ],
          financialNavs: [
            {
              label: '推荐金融产品',
              active: true,
              // url: '/yukuairong/'
            },
            // {
            //   label: '精选金融服务',
            //   active: false,
            //   url: '/service/resource_list.html?stype=004'
            // }
          ],
          hatchsNavs: [
            {
              label: '品牌服务',
              active: true,
              url: 'http://www.cqsczt.com/scsite/index/index.html'
            },
            {
              label: '众包服务',
              active: false,
              url: '/service/resource_list.html?stype=006'
            }
          ],
          brandList: [
            {
              itemImg:'/style/images/service/icon_adress.png' ,
              name:'双创地图',
              text:'快速触达重庆优质双创资源',
              url:'http://www.cqsczt.com/scsite/map/index.html'
            },
            {
              itemImg:'/style/images/service/icon_ratingreport.png' ,
              name:'双创专家',
              text:'云集双创导师提供孵化落地服务，助您创业',
              url:'http://www.cqsczt.com/scsite/expert/index.html'
            },
            {
              itemImg:'/style/images/service/icon_authenticationservices.png' ,
              name:'双创载体',
              text:'汇集全市创业基地、孵化器、众创空间',
              url:'http://www.cqsczt.com/scsite/almanac/index.html'
            },
            {
              itemImg:'/style/images/service/icon_monitoring.png' ,
              name:'双创培训',
              text:'丰富培训资源，全方位落地创业服务',
              url:'http://www.cqsczt.com/scsite/video/index.html'
            },
            {
              itemImg:'/style/images/service/icon_recognition.png' ,
              name:'科技企业',
              text:'优质科技型企业资源、创业明星企业，分享创业经验',
              url:'http://www.cqsczt.com/scsite/science/index.html'
            },
            {
              itemImg:'/style/images/service/icon_Merchant ratings.png' ,
              name:'双创政策',
              text:'解读推送政府专项扶持政策、惠企政策',
              url:'/polist.html'
            }
          ],
          switchover: 0,
        },
        filters: {
          formatPrice2: function (flag, v, n, m) {
            if(flag === '1') {
              return '面议'
            } else {
              if(typeof v !== 'undefined') {
                return (v / 10000).toFixed(2)
              } else if(!v && !m) {
                return (n / 10000).toFixed(2)
              } else {
                return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
              }
            }
          },
          // formatPrice2: function (flag, v, n, m) {
          //   if(flag === '1') {
          //     return '面议'
          //   } else {
          //     v = typeof v !== 'undefined' ? (v / 10000).toFixed(2) : (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
          //     return v
          //   }
          // }
        },
        mounted: function () { },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'number-grow': httpVueLoader('/style/components/number.vue'),
          'service-head': httpVueLoader('/style/components/service_head.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          var vm = this
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          this.saasId = localStorage.getItem('saasId');
          this.getCounts()
          this.demandByPage('demandList');
          [
            {
              datakey: 'serviceList003', dataCode: '003', pageSize: 6
            }, {
              datakey: 'serviceList004', dataCode: '004', pageSize: 6
            }, {
              datakey: 'serviceList010', dataCode: '010', pageSize: 2
            }, {
              datakey: 'serviceList009', dataCode: '009', pageSize: 4
            }, {
              datakey: 'serviceList002', dataCode: '002', pageSize: 4
            }, {
              datakey: 'serviceList001', dataCode: '001', pageSize: 4
            }, {
              datakey: 'serviceList006', dataCode: '006', pageSize: 4
            }, {
              datakey: 'serviceList005', dataCode: '005', pageSize: 6
            }, {
              datakey: 'serviceList007', dataCode: '007', pageSize: 6
            }
          ].forEach(function (item) {
            setTimeout(function(){
              vm.getGoodsByPage({
                categoryCode: "009",
                servicesLevel: item.dataCode,
                pageNum: 1,
                pageSize: item.pageSize
              }, item.datakey)
            }, 200)
          });
          this.getGoodsByPage({
            pageNum: 1,
            pageSize: 4,
            categoryCode: "001,010"
          }, 'resultsList');
          [
            {
              datakey: 'organizationList010', dataCode: '010'
            }, {
              datakey: 'organizationList009', dataCode: '009'
            }, {
              datakey: 'organizationList002', dataCode: '002'
            }, {
              datakey: 'organizationList001', dataCode: '001'
            }
          ].forEach(function (item) {
            setTimeout(function(){
              vm.getShopByPage({
                pageNum: 1,
                pageSize: 5,
                isContainIdentityTypeSelf: '0',
                servicesLevel: item.dataCode
              }, item.datakey)
            }, 200)
          })
          this.getYKRData()
          this.getShopGoodByPage()
        },
        methods: {
          handleMore: function (url) {
            console.log(url)
            location.href = url
          },
          getShopByPage: function (data, key) {
            var vm = this;
            this.$httpCom['shopByPage'](data).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.list.forEach(function (item) {
                  var locationShow = []
                  item.provinceDisplay && locationShow.push(item.provinceDisplay);
                  if (item.cityDisplay && item.cityDisplay !== '县' && item.cityDisplay !== '市辖区') {
                    locationShow.push(item.cityDisplay)
                  } else {
                    item.districtDisplay && locationShow.push(item.districtDisplay)
                  }
                  item.cityShow = locationShow.join(' · ')
                  item.styles = item.shopLogo ? {
                    backgroundImage: 'url(' + item.shopLogo + ')'
                  } : {};
                  item.title = item.shopName
                  item.itemUrl = item.shopIndexUrl
                  item.itemImg = item.shopLogo ? item.shopLogo : ''
                })
                vm[key] = res.result.list
              }
            })
          },
          getGoodsByPage: function (data, key) {
            var vm = this;
            this.$httpCom['searchList'](data).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.list.forEach(function (item) {
                  var imgUrl = item.goodsImg && item.goodsImg.url
                  item.itemUrl = item.goodsDetailUrl
                  item.styles = imgUrl ? {
                    backgroundImage: 'url(' + imgUrl + ')'
                  } : {};
                  item.itemImg = imgUrl ? imgUrl : ''
                  item.shopStyles = item.shopLogoUrl ? {
                    backgroundImage: 'url(' + item.shopLogoUrl + ')'
                  } : {};
                  item.shopItemImg = item.shopLogoUrl ? item.shopLogoUrl : ''
                  item.title = item.goodsName
                })
                vm[key] = res.result.list
                if (key === 'serviceList003') {
					vm.$nextTick(function () {
						vm['lastList'] = res.result.list
					})
                }
              }
            })
          },
          getShopGoodByPage: function () {
            var vm = this;
            indexApi.selectpByPage({
              pageNum: 1,
              pageSize: 2,
              shopCode: "rIAn5mb2",
              categoryCode: "009"
            }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.list.forEach(function (item) {
                  var imgUrl = item.goodsImgFst
                  item.itemUrl = item.goodsDetailUrl
                  item.styles = imgUrl ? {
                    backgroundImage: 'url(' + imgUrl + ')'
                  } : {};
                  item.itemImg = imgUrl ? imgUrl : ''
                  item.shopStyles = item.shopLogoUrl ? {
                    backgroundImage: 'url(' + item.shopLogoUrl + ')'
                  } : {};
                  item.shopItemImg = item.shopLogoUrl ? item.shopLogoUrl : ''
                  item.title = item.goodsName
                })
                vm.serviceList010A = res.result.list
              }
            })
          },
          demandByPage: function (key) {
            var vm = this;
            this.$httpCom['demandByPage']({
              pageNum: 1,	// 	第几页	是	[string]		查看
              pageSize: 8,	// 	每页显示多少行	是	[string]		查看
              orderBy: 'createTime desc',	// 	排序字段	是	[string]		查看
            }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.list.forEach(function (item) {
                  item.itemUrl = '/common/demanddetail.html?id=' + item.id
                })
                vm[key] = res.result.list
                vm.initScroll()
              }
            })
          },
          getYKRData: function () {
            var vm = this;
            indexApi.getykrlist({
              channelType: "WEB",
              mSort: "DESC",
              pageNum: 1,
              pageSize: 6
            }).then(function (res) {
              if (res.code === '20000') {
                vm.ykrlist = res.data.list.map(function (item, i) {
                  item.itemUrl = '/yukuairong/detail.html?id=' + item.id
                  item.styles = {
                    backgroundImage: 'url(/image/service/ykr-img-' + i + '.jpg)'
                  }
                  item.itemImg = '/image/service/ykr-img-' + i + '.jpg'
                  item.title = item.name
                  item.viewtag = item.productTypeName ? item.productTypeName.split(',') : []
                  item.month = item.mtimenumSub + '-' + item.mtimenumSup
                  item.price = item.mSub + '-' + item.mSup
                  return item
                })
              }
            })
          },
          getCounts: function () {
            var vm = this;
            indexApi.statistics({
              code: "serviceTotal"
            }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.counts.forEach(function (item, i) {
                  item.count = parseInt(res.result.serviceTotal[0][item.key])
                })
              }
            })
          },
          initScroll: function () {
            this.$nextTick(function () {
              $('.listsScroll').myScroll({
                speed: 40, //数值越大，速度越慢
                rowHeight: 31
              });
            })
          },
          handleToUrl: function (e) {
            var url = e.target.dataset.url || e.currentTarget.dataset.url
            if (url) {
              this.$utils.openNewTable(url)
            } else {
              this.$dialog.showToast('敬请期待');
            }
          },
          handleOnLineConsult: function (i) {
            var data = this.lastList[i]
            if (data.userId) {
              this.$root.$chat_im.connect(data.userId);
            }
            // this.$dialog.showToast('敬请期待')
          },
          handleSwitchoverServer: function (i) {
            var item = this.serviceNavs[i]
            this.serviceNavs.forEach(function (item, si) { item.active = si === i });
            this.$nextTick(function () {
              this.lastList = this[item.value]
            })
          },
          // handleSwitchoverTechnology: function (i) {
          //   var item = this.technologyNavs[i]
          //   this.technologyNavs.forEach(function (item, si) { item.active = si === i });
          //   this.$nextTick(function () {
          //     this.firstList = this[item.value]
          //   })
          // },
          handleSwitchoverFinancial: function (i) {
            this.financialNavs.forEach(function (item, si) { item.active = si === i });
            this.$nextTick(function () {
              this.secondList = i
            })
          },
          handleToUrlAuth: function (e) {
            var url = e.currentTarget.href
            if (url.indexOf('/common/buyer') !== -1) {
              if (this.userInfo && this.userInfo.userName) {
                if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
                  e.preventDefault()
                  this.$refs.lytoper.openBuyerConfirm()
                }
              } else {
                e.preventDefault()
                window.location.href = '/common/login.html';
              }
            }
            if (url.indexOf('/common/seller') !== -1) {
              if (this.userInfo && this.userInfo.userName) {
                if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('002') === -1) {
                  e.preventDefault()
                  this.$dialog.showToast('您还不是服务商，请先入驻成为服务商！')
                }
              } else {
                e.preventDefault()
                window.location.href = '/common/login.html';
              }
            }
            if (url.indexOf('/activity/add') !== -1) {
              if (this.userInfo && this.userInfo.userName) {
                if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
                  e.preventDefault()
                  this.$refs.lytoper.openBuyerConfirm()
                }
              } else {
                e.preventDefault()
                window.location.href = '/common/login.html';
              }
            }
          },
          showToast: function () {
            this.$dialog.showToast('敬请期待');
          },
          handleSwitchoverHatchs: function (i) {
            this.hatchsNavs.forEach(function (item,index) {
              item.active = index === i
            })
            this.switchover = i
          }
        }
      });
    })
});
