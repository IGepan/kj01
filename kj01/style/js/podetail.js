// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery','dic', 'vue', 'httpVueLoader', '/style/js/api/polist.js', 'fileSaver', 'httpUrl'],
    function ($, dic, Vue, httpVueLoader, indexApi, fileSaver, httpUrl) {
    new Vue({
      el: '#index_box',
      data: {
        cmsUrl: httpUrl.cmsUrl,
        saasId: '',
        breadcrumb: [
          {
            label: '政策资讯',
            url: '/poindex.html'
          },
          {
            label: '政策惠',
            url: '/polist.html'
          },
          {
            label: '详情'
          }
        ],
        recommendList: [],
        detail: '',
        articleRect: '',
        isFixed: false,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        styles: {
          left: 0
        }
      },
      filters: {
        formatTime: function (v) {
          return v ? v.split(' ')[0] : ''
        },
        formatTime1: function (v, t) {
          if (v) {
            v = v.split(' ')[0];
            if(v.indexOf('.')!==-1){
              v = v.split('.')
            }else if(v.indexOf('-')!==-1){
              v = v.split('-')
            }
            v.splice(1, 0, '年')
            v.splice(3, 0, '月')
            v.push('日')
            return t ? ' ~ ' + v.join('') : v.join('')
          } else {
            return ''
          }
        },
        formatTime2: function (v, t) {
          if (v && t) {
            v = v.split(' ')[0]
            v = v.split('-')
            v.splice(1,0,'年')
            v.splice(3,0,'月')
            v.push('日')

            t = t.split(' ')[0]
            t = t.split('-')
            t.splice(1,0,'年')
            t.splice(3,0,'月')
            t.push('日')
            return v.join('') + ' ~ ' + t.join('')
          } else {
            return '无'
          }
        },
        formatAddress: function (v, v1, v2) {
          if (v) {

          } else {
            return ''
          }
        }
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'sub-head': httpVueLoader('/style/components/sub-head.vue'),
        'web-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {
        var id = this.$utils.getReqStr('id')
        var shortCode = this.$utils.getReqStr('shortCode')?this.$utils.getReqStr('shortCode'):''
        this.saasId = localStorage.getItem('saasId');
        id && this.getDetail(id,shortCode)
      },
      mounted: function() {
        var vm = this;
        document.addEventListener('scroll', function(e) {
          vm.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          if (vm.clientHeight + vm.scrollTop < vm.scrollHeight) {
            !vm.isFixed && (vm.isFixed = true, vm.styles.left = document.querySelector('.commonCententBox').offsetLeft);
          } else {
            vm.isFixed && (vm.isFixed = false, vm.styles.left = 0);
          }
        })
        window.addEventListener('resize', function () {
          vm.styles.left = document.querySelector('.commonCententBox').offsetLeft
        })
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
        getDetail: function (id,shortCode) {
          var vm = this;
          indexApi.getPolicyDetail({id: id,shortCode:shortCode}).then(function (res) {
            res.result.endDate=''
            res.result.startDate=''
            if(res.result.onlineEndDate && res.result.applyEndDate){
              res.result.endDate=new Date(res.result.onlineEndDate).getTime()<new Date(res.result.applyEndDate).getTime()?res.result.onlineEndDate:res.result.applyEndDate;
              res.result.startDate=new Date(res.result.onlineEndDate).getTime()<new Date(res.result.applyEndDate).getTime()?res.result.onlineStartDate:res.result.applyStartDate;
            }else{
              res.result.endDate=res.result.applyEndDate||res.result.onlineEndDate;
              res.result.startDate=res.result.applyStartDate||res.result.onlineStartDate
            }
            if (res.result.isAnnotation) {
              var keys = '';
              var content = ''
              try {
                if (res.result.annotation) {
                  // 格式化标记信息
                  content = res.result.annotationContent;
                  // res.result.writtenDepartment && (res.result.writtenDepartment = res.result.writtenDepartment.split('ぶんかつ'));
                  res.result.annotation = keys = res.result.annotation.split(';').map(function (keysText) {
                    keysText = keysText.replace(/\s/g, '换行');
                    keysText = ('{"' + keysText + '"}').replace(/:/g, '":"').replace(/,/g, '","');
                    keysText = JSON.parse(keysText);
                    keysText.text = '<p>' + keysText.text.split('换行').join('</p><p>') + '</p>';
                    keysText['words'] = content.substring(keysText.start, keysText.end)
                    keysText['isOpen'] = 0
                    keysText['style'] = ''
                    return keysText
                  })
                  // res.result.annotation[0].text = '90年来，中国共产党由小到大，由弱变强，领导中国人民冲破重重难关，夺取了革命斗争和经济建设的一个又一个胜利。中国共产党坚持以马克思列宁主义、毛泽东思想、中国特色社会主义理论体系为指导，领导全国人民改革开放，奋斗进取，全面推进中国特色社会主义现代化建设，综合国力显著增强，取得了举世闻名的成就。能够说，中国共产党的历史，就是不断从胜利走向胜利的历史。90年的历史经验归结到一点，就是把马克思主义基本原理同中国具体实际相结合，探索自我的革命、建设和改革道路。这些经验弥足珍贵，值得全体共产党人永远铭记。在中国已经成功的历史事件中，无与伦比的北京奥运会，还有正在进行的举世瞩目的上海世博会，还有在世界金融危机背景下经济的依然快速增长，这一系列重大成就和标志性事件都要归功于神中国共产党，这就是为什么中国共产党会成立90周年却依然能够充满生机和活力。中国共产党在90年的奋斗历程中，培育构成了一系列彰显政党性质，反映名族精神，体现了时代要求和凝聚了各方力量的伟大精神，这些伟大精，对于推动党所领导的革命，建设和改革事业发挥了无可替代的重要作用，中国共产党的伟大精神具有理想高远，紧贴实际，科学理性。'
                  keys.length && keys.forEach(function (key, index) {
                    var repText = '<span class=\"' + (key.type === '1' ? 'necessary' : 'emphasis') + '\" data-index=\"' + index + '\">' + key.words + '</span>';
                    content = content.replace(key.words, repText)
                  })
                  content = content.split('\n');
                  content = content.join('</p><p>');
                  content = '<p>' + content + '</p>';
                }
                res.result.annotationContent = content;
                vm.setDetailInfo(res, id)
              } catch (error) {
                console.log('标记信息解析失败！')
                console.error(error)
              }
            } else  {
              vm.setDetailInfo(res, id)
            }
          })
        },
        setDetailInfo: function (res, id) {
          var a = [];
          var vm = this
          res.result.viewType = 0
          res.result.isCollection = res.result.isCollection ? 1 : 0;
          res.result.countryDisplay && a.push(res.result.countryDisplay);
          res.result.provinceDisplay && a.push(res.result.provinceDisplay);
          res.result.cityDisplay && res.result.cityDisplay !== '县' && res.result.cityDisplay !== '市辖区'  && res.result.cityDisplay !== '市级' && a.push(res.result.cityDisplay);
          res.result.districtDisplay && a.push(res.result.districtDisplay);
          res.result.address = a.join('');
          if (res.result.files) {
            res.result.files.forEach(function(item) {
              item.flieType = item.name.substring(item.name.lastIndexOf(".") + 1)
              item.flieType = dic.imgs.indexOf(item.flieType) !== -1 ? 'tupian' : item.flieType
              item.flieType = dic.zips.indexOf(item.flieType) !== -1 ? 'yasuobao' : item.flieType
              item.flieType = dic.doc.indexOf(item.flieType) !== -1 ? 'word' : item.flieType
              item.flieType = dic.excel.indexOf(item.flieType) !== -1 ? 'excel' : item.flieType
              item.flieType = dic.ppt.indexOf(item.flieType) !== -1 ? 'ppt' : item.flieType
            })
          }
          if (res.result.relationFiles) {
            res.result.relationFiles.forEach(function(item){
              item.itemUrl = '/ddetail.html?id='+item.id
            })
          }
          if (res.result.policyFileType) {
            res.result.isViewTime = res.result.policyFileType.indexOf('01') !== -1;
          }
          this.$data.detail = res.result
          this.getPolicyRelated(id, res.result.keyWord)
        },
        getPolicyRelated: function(id, word) {
          var vm = this;
          indexApi.getPolicyRelated({ id: id, keyWord: word }).then(function (res) {
            res.result && res.result.forEach(function (item) {
              item.itemUrl = '/podetail.html?id='+item.id
            })
            vm.$data.recommendList = res.result || []

            vm.setIsFixed()
          })
        },
        setIsFixed: function () {
          this.$nextTick(function() {
            this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            this.scrollHeight = (document.body.scrollHeight || document.documentElement.scrollHeight) - 500;
            this.clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
            this.scrollHeight > this.clientHeight && (this.isFixed = true, this.styles.left = document.querySelector('.commonCententBox').offsetLeft);
          })
        },
        handleSetViewType: function (e) {
          var dataset = this.getAttributeData(e.currentTarget, ['viewtype'])
          this.detail.viewType = parseInt(dataset.viewtype)
          window.scrollTo(0, 0)
          this.setIsFixed()
        },
        handleContent: function (e) {
          if (this.detail.viewType === 2) {
            !this.articleRect && (this.articleRect = document.querySelector('.article').getBoundingClientRect())
            var vm = this
            var $target = e.target;
            var index = parseInt($target.dataset.index || $target.getAttribute("data-index"))
            if ($target.nodeName === 'SPAN') {
              this.detail.annotation.forEach(function(an, ai) {
                if (ai === index) {
                  an.isOpen = 1
                  !an.style && (an.style = { top: $target.getBoundingClientRect().top - vm.articleRect.top })
                } else  {
                  an.isOpen = 0
                }
              })
            }
          }
        },
        handleTips: function (index, e) {
          this.detail.annotation[index].isOpen = 0;
          console.log(e)
        },
        handleShareToWeixin: function () {
          this.handleShowTips()
          // var vm = this;
          // var options = {
          //   title: '二维码',
          //   width: '400px',
          //   texts: '<div style="text-align: center;padding: 10px;"><img src="'+ httpUrl.baseUrl + '/wxApp/policy/getPolicyQRCodeById?id='+ this.detail.id +'" alt="" srcset=""></div>',
          //   buttons: []
          // };
          //   vm.$dialog.confirm2(options)
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
        handleFileSaveAs: function (i) {
          var fileInfo = this.detail.files[i]
          saveAs(httpUrl.imgUploadUrl + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
          // target="_blank" : href = "baseFilePath + '/file/download?filePath=' + adjunct.url"
        },
        handleShowTips: function () {
          this.$dialog.showToast('敬请期待');
        },
        handleColSelected: function () {
          if (this.detail.isCollection) {
            this.collectionCancel();
          } else {
            this.colSelected();
          }
        },
        colSelected: function () {
          var vm = this;
          indexApi.selected({
            storeId: this.detail.id,
            type: '04'
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.detail.isCollection = 1;
              vm.detail.collectionNum++
              vm.$dialog.showToast("收藏成功")
            }
          })
        },
        collectionCancel: function () {
          var vm = this;
          indexApi.cancel({
            goodsId: this.detail.id
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.detail.isCollection = 0;
              vm.detail.collectionNum > 0 && (vm.detail.collectionNum--);
              vm.$dialog.showToast("取消成功")
            }
          })
        }
      }
    });
  })
});
