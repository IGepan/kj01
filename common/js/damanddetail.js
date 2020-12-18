// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpCom', 'httpDemandApi', 'dialog', 'fileSaver', 'httpUrl', 'jqValidate', 'httpLogin'], function ($, Vue, dic, httpVueLoader, httpCom, httpDemandApi, dialog, fileSaver, httpUrl, jqValidate, httpLogin) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    window.vueDom = new Vue({
      el: '#index_box',
      data: {
        jquery: $,
        baseFilePath: httpUrl.imgUploadUrl,
        fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
        uploadData: {
          system: 'ts'
        },
        did: '',
        infos: {
          bids: []
        },
        apendMenu: [
          {
            label: '科技大数据分析',
            uri: httpUrl.bigData
          },
          {
            label: '关于我们',
            uri: httpUrl.cmsUrl
          }
        ],
        isBid: false,
        bidData: {
          demandId: '',
          amount: '',
          estimatePeriod: '',
          comment: '',
          bidderInfo: '',
          contacts: '',
          phone: '',
          quotaList: [
            {
              quotaName: '第一个',
              quotaComment: '第一个说明',
              value: ''
            }
          ],
          fileIds: []
        },
        issep: false,
        topClass: '',
        isSubmitDisabled: false,
        columns: [
          {
            label: '首页',
            type: 'index',
            url: '/index.html'
          },
          {
            label: '产品',
            type: 'product',
            url: '/searchList.html?type=product&word=&page=1'
          },
          {
            label: '服务',
            type: 'service',
            url: '/searchList.html?type=service&word=&page=1'
          },
          {
            label: '技术',
            type: 'technology',
            url: '/searchList.html?type=technology&word=&page=1'
          },
          // {
          //   label: '资源',
          //   type: 'resource',
          //   url: '/searchList.html?type=resource&word=&page=1'
          // },
          {
            label: '需求',
            type: 'demand',
            url: '/searchList.html?type=demand&word=&page=1'
          },
          {
            label: '店铺',
            type: 'shop',
            url: '/searchList.html?type=shop&word=&page=1'
          }
        ],
        steps: [
          {
            label: '招标中',
            selected: false
          },
          {
            label: '待选标',
            selected: false
          },
          {
            label: '工作中',
            selected: false
          },
          {
            label: '待确认',
            selected: false
          },
          {
            label: '已完成',
            selected: false
          }
        ],
        tabs: [
          {
            label: '需求描述',
            selected: true
          },
          {
            label: '投标方要求',
            selected: false
          },
          {
            label: '需求附件',
            selected: false
          },
          {
            label: '人才职业描述',
            selected: false
          }
        ],
        recommends: [],
        isselectedBid: false,
        httpCom: httpCom,
        code: '',
        searchUrl: '/searchList.html?type=demand&word=&page=1'
      },
      created: function () {
        this.initData();
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
        'ly-header': httpVueLoader('/style/components/header.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
      },
      filters: {
        computeDate: function (v) {
          return v ? Math.floor((new Date(v).getTime() - new Date().getTime()) / 86400000) : ''
        }
      },
      methods: {
        initData () {
          var host = location.host.split('.')[1]
          this.issep = host === 'kjy01' || host === 'kj01' || false
          this.issep && (this.topClass = 'white', this.searchUrl = '/service/demand_list.html');
          this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO'));
          this.bidData.demandId = this.did = this.$utils.getReqStr('id')
          this.code = this.$utils.getReqStr('c')
          this.getSceneList()
          this.getRecommends()
        },
        getSceneList: function () {
          var vm = this
          httpDemandApi.detail({ id: this.did, shortCode: this.code }).then(function (res) {
            if (res.code === 'rest.success') {
              var flag = 0
              vm.$data.infos = res.result
              switch (res.result.status) {
                case '01':
                  flag = 0
                  break;
                case '02':
                  flag = 1
                  break;
                case '03':
                  flag = 2
                  break;
                case '04':
                  flag = 3
                  break;
                case '05':
                  flag = 4
                  break;
                case '07':
                  flag = 8
                  break;
                case '08':
                  flag = 8
                  break;
                default:
                  flag = 4
              }
              vm.isselectedBid = res.result.bids.some(function (i) {
                return i.bidFlag === '1'
              })
              vm.steps = vm.steps.map(function (item, i) {
                item.selected = i === flag
                return item
              })
            }
          })
        },
        getRecommends: function () {
          var vm = this
          httpDemandApi.recommend({ pageSize: 5, id: this.did }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$data.recommends = res.result
            }
          })
        },
        selecedTab: function (i) {
          this.tabs.forEach(function (tab, ti) {
            tab.selected = ti === i
          })
        },
        fileSaveAs: function (i) {
          var fileInfo = this.infos.files[i]
          saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.path, fileInfo.name, { type: 'application/pdf;charset=utf-8' })
          // target="_blank" : href = "baseFilePath + '/file/download?filePath=' + adjunct.url"
        },
        getData: function () {
          var data = JSON.parse(JSON.stringify(this.$data.bidData))
          data.fileIds = data.fileIds.map(function (i) {
            return i.id
          })
          return data
        },
        pullBid: function () {
          var vm = this
          var data = this.getData()
          !vm.isSubmitDisabled && (vm.isSubmitDisabled = true, httpDemandApi.insertDid(data).then(function (res) {
            vm.$dialog.showToast(res.desc)
            if (res.code === 'rest.success') {
              vm.getSceneList()
              vm.isBid = false
            }
            vm.isSubmitDisabled = false
          }).catch(function () {
            vm.isSubmitDisabled = false
          })
          )
        },
        customFlag: function (v, o, callback) {
          if (!this.bidData.flag) {
            callback(o, '协议必选')
          } else {
            callback(o)
          }
        },
        handleUploadSuccess: function (successInfo) {
          this.bidData.fileIds.push(successInfo.data)
        },
        handleDelFile: function (i) {
          this.bidData.fileIds.splice(i, 1)
        },
        handleOpenBid: function () {
          var vm = this
          if (this.userInfo) {
            if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('002') !== -1) {
              httpDemandApi.didValidate({}).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.isBid = true
                } else {
                  vm.$dialog.showToast(res.desc)
                }
              })
            } else {
              this.$dialog.showToast('您还不是服务商，请先入驻成为服务商！')
            }
          } else {
            window.location.href = '/common/login.html';
          }
        },
        handleInsertDid: function () {
          var vm = this
          $('.bidform').validate('submitValidate', function (val) {
            if (val) {
              vm.pullBid()
            } else {
              vm.$dialog.showToast('请完善投标信息！')
            }
          })
        },
        handleCancel: function () {
          this.isBid = false
          $('.bidform').validate('clear')
        },
        handleOpenAdvisoryBox: function () {
          if (this.userInfo) {
            this.$root.$chat_im.connect(this.infos.userId)
          } else {
            window.location.href = '/common/login.html';
          }
        },
        handleOpenProtocol: function () {
          var vm = this
          // vm.$httpCom.protocol({
          //   protocolType: 7
          // }).then(function (res) {
          //   if (res.result) {
          //     var options = {
          //       class: 'full',
          //       title: '投标规则',
          //       close: false,
          //       texts: res.result.protocolContact,
          //       buttons: [
          //         {
          //           label: '确认阅读'
          //         }
          //       ]
          //     }
          //     vm.$dialog.confirm2(options)
          //   }
          // })
        }
      }
    });
  });
});
