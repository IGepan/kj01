// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/declaration.js', 'fileSaver', 'laydate', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, indexApi, fileSaver, laydate, httpUrl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/style/js/libs/pdfjs-dist/build/pdf.worker.js'
    new Vue({
      el: '#index_box',
      data: {
        cmsUrl: httpUrl.cmsUrl,
        saasId: '',
        breadcrumb: [
          {
            label: '资讯',
            url: '/poindex.html'
          },
          {
            label: '项目申报',
            url: '/declaration.html'
          },
          {
            label: '申报助手',
            url: '/declarationHelper/list.html'
          },
          {
            label: '文件预览'
          }
        ],
        recommendList: [],
        detail: '',
        pdfDocument: '',
        currentPage: 1,
        countPage: 0,
        scalePage: 1.0,
        canvasCTX: '',
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
      created: function () {
        var id = this.$utils.getReqStr('id')
        this.saasId = localStorage.getItem('saasId');
        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
        id && this.getDetail(id)
      },
      methods: {
        getAttributeData: function (el, keys) {
          var dataset = {}
          if (el.dataset) {
            dataset = el.dataset
          } else {
            keys.forEach(function (tkey) {
              dataset[tkey] = el.getAttribute('data-' + tkey);
            })
          }
          return dataset
        },
        getDetail: function (id) {
          var vm = this;
          indexApi.getDocumentDtlById({id: id}).then(function (res) {
            vm.$data.detail = res.result
            vm.getPolicyRelated(id, res.result.keyWord)
            vm.loadingPDF()
            vm.$nextTick(function () {
              !this.canvasCTX && (this.canvasCTX = this.$refs.theCanvas.getContext("2d"));
            })
          })
        },
        getPolicyRelated: function(id, word) {
          var vm = this;
          indexApi.getPolicyRelated({ id: id, keyWord: word }).then(function (res) {
            res.result && res.result.forEach(function (item) {
              item.itemUrl = '/podetail.html?id='+item.id
            })
            vm.$data.recommendList = res.result || []
          })
        },
        loadingPDF: function () {
          var vm = this
          var loadingTask = pdfjsLib.getDocument(httpUrl.imgUploadUrl + '/file/preview?fileId=' + this.detail.contentFileId);
          loadingTask.promise.then(function(pdfDocument) {
            vm.pdfDocument = pdfDocument;
            vm.countPage = pdfDocument.numPages
            vm.pageViewPort()
          })
          .catch(function(reason) {
            indexApi.preview({ fileId: this.detail.contentFileId}).then(function (res) {
              this.$dialog.showToast(res.desc);
            })
            console.error("Error: " + reason);
          });
        },
        pageViewPort: function() {
          var vm = this;
          this.pdfDocument.getPage(this.currentPage).then(function(pdfPage) {
            var viewport = pdfPage.getViewport({ scale: vm.scalePage });
            vm.$refs.theCanvas.width = viewport.width;
            vm.$refs.theCanvas.height = viewport.height;
            var renderTask = pdfPage.render({
              canvasContext: vm.canvasCTX,
              viewport: viewport,
            });
            return renderTask.promise;
          });
        },
        handleSetZoomInPage: function () {
          if (this.scalePage < 1.5) {
            this.scalePage += 0.01
            this.pageViewPort()
          } else {
            this.$dialog.showToast('已经最大了！');
          }
        },
        handleSetZoomOutPage: function () {
          if (this.scalePage > 0.5) {
            this.scalePage -= 0.01
            this.pageViewPort()
          } else {
            this.$dialog.showToast('已经最小了！');
          }
        },
        handleSetPrevPage: function (e) {
          if (this.currentPage > 1) {
            this.currentPage--
            this.pageViewPort()
          } else {
            this.$dialog.showToast("已经是第一页了！")
          }
        },
        handleSetNextPage: function (e) {
          if (this.currentPage < this.countPage) {
            this.currentPage++
            this.pageViewPort()
          } else {
            this.$dialog.showToast("没有有更多页面了！")
          }
        },
        handleShareToWeixin: function () {
          var vm = this;
          var options = {
            title: '二维码',
            width: '400px',
            texts: '<div style="text-align: center;padding: 10px;"><img src="'+ httpUrl.baseUrl + '/wxApp/policy/getPolicyQRCodeById?id='+ this.detail.id +'" alt="" srcset=""></div>',
            buttons: []
          };
            vm.$dialog.confirm2(options)
          // indexApi.getPolicyQRCodeById({id: this.detail.id}).then(function (res) {
          //   console.log(res)

          // })
        },
        handleShareToQQ: function () {
          var url = "https://connect.qq.com/widget/shareqq/index.html";
          var title = '精品政策-易智网';
          var summary = this.detail.title;
          var desc = this.detail.title;
          var fullUrl = [url, '?url=', encodeURIComponent(document.location.href), '&title=',  title, '&summary=', summary, '&desc=', desc].join('');
          window.open(fullUrl)
        },
        handleFileSaveAs: function () {
          indexApi.wxappSave({
            path: '/ddetail/downLoad?id=' + this.detail.id,
            goodsId: this.detail.id,
            domainName: 'https://www.kj01.cn'
          })
          saveAs(httpUrl.imgUploadUrl + '/file/download?filePath=' + this.detail.contentFilePath, this.detail.contentFileName)
          // target="_blank" : href = "baseFilePath + '/file/download?filePath=' + adjunct.url"
        },
        handleShowTips: function () {
          this.$dialog.showToast('敬请期待');
        },
        handleColSelected: function () {
          if (this.detail.collectionFlag === '1') {
            this.collectionCancel();
          } else {
            this.colSelected();
          }
        },
        colSelected: function () {
          var vm = this;
          indexApi.selected({
            storeId: this.detail.id,
            type: '07'
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.detail.collectionFlag = '1';
              vm.$dialog.showToast("收藏成功")
            }
          })
        },
        collectionCancel: function () {
          var vm = this;
          indexApi.cancel({
            goodsId:  this.detail.id
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.detail.collectionFlag = '0';
              vm.$dialog.showToast("取消成功")
            }
          })
        }
      }
    });
  })
});
