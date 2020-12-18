require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'jqValidate', 'httpVueLoader', 'seller', 'jqSelect', 'addpatentKey', 'httpCom', 'httpDemandApi', 'fileSaver'], function ($, Vue, httpStore, httpUrl, dic, jqValidate, httpVueLoader, seller, jqSelect, addpatentKey, httpCom, httpDemandApi, fileSaver) {

    function imgPreview(target) {
      var c = document.createElement('div');
      var d = document.createElement('div');
      var ww = document.body.clientWidth;
      var hh = document.body.clientHeight;
      var parent = target.parentNode;
      c.style.cssText = 'position:fixed;z-index:99999;background:rgba(0,0,0,0.9);width:100%;height:100%;top:0;left:0';
      d.style.cssText = 'position:absolute;overflow:auto';
      target.style.width = target.naturalWidth + 'px';
      target.style.height = target.naturalHeight + 'px';
      if (target.naturalWidth > ww) {
        d.style.width = '90%';
        d.style.left = '5%';
        if (target.naturalHeight >= hh) {
          d.style.height = '90%';
          d.style.top = '5%';
        } else {
          d.style.height = target.naturalHeight + 'px';
          d.style.top = (hh - target.naturalHeight) / 2 + 'px';
        }
      } else if (target.naturalHeight > hh) {
        d.style.height = '90%';
        d.style.top = '5%';
        d.style.width = target.naturalWidth + 'px';
        d.style.left = (ww - target.naturalWidth) / 2 + 'px';
      } else {
        d.style.height = target.naturalHeight + 'px';
        d.style.width = target.naturalWidth + 'px';
        d.style.top = (hh - target.naturalHeight) / 2 + 'px';
        d.style.left = (ww - target.naturalWidth) / 2 + 'px';
      }
      d.appendChild(target);
      c.appendChild(d);
      c.onclick = function () {
        target.style.cssText = '';
        parent.appendChild(target);
        document.body.removeChild(c);
      };
      document.body.appendChild(c);
    }
    function formatTime(timestamp, format) {
      var time;
      if (!isNaN(timestamp)) {
        time = new Date(Number(timestamp));
      } else {
        time = new Date();
        if (typeof timestamp === 'string' && typeof format === 'undefined') {
          format = timestamp;
        }
      }
      var key = {
        Y: time.getFullYear() < 10 ? '0' + time.getFullYear() : time.getFullYear(),
        M: time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1,
        D: time.getDate() < 10 ? '0' + time.getDate() : time.getDate(),
        h: time.getHours() < 10 ? '0' + time.getHours() : time.getHours(),
        m: time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes(),
        s: time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds(),
        d: time.getDay()
      };
      var _f = function (format) {
        return format.replace(/[YMDhmsd]/g, function (a) {
          return key[a];
        });
      };
      return typeof format === 'string' ? _f(format) : _f('Y-M-D h:m:s');
    }
    window.vueDom = new Vue({
      el: '#store_box',
      data: {
        formData: {},
        searchData: {
          status: '',
          demandType: ''
        },
        options: {
          'demand_status': [],
          'evaluate_item': [],
          'demand_type': []
        },
        acceptInfo: {},
        delayInfo: {},
        commentsInfo: {},
        uploadHeader: {},
        searchDisable: false,
        uploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
        fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
        uploadData: {
          system: 'ts'
        },
        evItem: [],
        m_accept: 0,
        m_delay: 0,
        m_comments: 0,
        m_fb: 0,
        fb_info: {},
        fb_list: [],
        activeFbIndex: -1,
        moreIndex: -1,
        type: -1,
        searchList: [],
        isSubmitDisabled: false,
        jquery: $,
        page: 1,
        pageSize: 20,
        totalPage: 1,
        // dispatchFlag: false,
        http: httpStore,
        httpCom: httpCom
      },
      mixins: [seller, addpatentKey],
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-page': httpVueLoader('/common/components/pages.vue'),
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getOptions([
          { "code": "demand_type" },
          { 'code': 'evaluate_item', group: 5 },
          { "code": "demand_status" }
        ]);
        this.searchPage();
        /*var user = localStorage.getItem(dic.locaKey.USER_INFO);
        this.uploadHeader['access-token'] = JSON.parse(user).access_token;*/
      },
      mounted: function () {
        var $this = this;
        var start = laydate.render({
          elem: '#timeStart',
          showBottom: true,
          format: 'yyyy-MM-dd HH:mm:ss',
          done: function (value, date, endDate) { //选择日期完毕的回调
            if (value !== '') {
              $this.searchData.bidDateFrom = value;
              date.month = date.month - 1;
              date.date = date.date + 1;
              end.config.min = date;
              end.config.elem[0].focus();
            } else {
              $this.searchData.bidDateFrom = ''
            }
          }
        });
        var end = laydate.render({
          elem: '#timeEnd',
          showBottom: true,
          format: 'yyyy-MM-dd HH:mm:ss',
          done: function (value, date, endDate) { //选择日期完毕的回调
            if (value !== '') {
              $this.searchData.bidDateTo = value;
              date.month = date.month - 1;
              date.date = date.date - 1;
              start.config.max = date;
            } else {
              $this.searchData.bidDateTo = ''
            }
          }
        });
      },
      computed: {
        filterDemandStatus: function () {
          var a = ['03', '04', '05'];
          var b = [{ id: '-1', value: '', display: "不限" }];
          this.options['demand_status'].forEach(d => {
            if (a.indexOf(d.value) > -1) {
              b.push(d);
            }
          });
          return b;
        }
      },
      methods: {
        activeFb: function (k, i) {
          this.activeFbIndex = i;
          // for(var v in k) {
          //   this.fb_info[v] = k[v];
          // }
          this.fb_info.dispatchId = k.id;
        },
        submitFb: function () {
          var vm = this;
          if (typeof this.fb_info.dispatchId === 'undefined') {
            $dialog.showToast('请选择一个分包平台');
            return;
          }
          vm.$http.post(httpUrl.baseUrl + '/demand/seller/insertDispatch', vm.fb_info).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$dialog.confirm({
                title: '提示',
                texts: '查看分包详情',
                callback: function () {
                  vm.$utils.openNewTable(vm.fb_list[vm.activeFbIndex].detailUrl)
                  vm.closeFb();
                }
              })
            }else{
              if(res.code !=='msg.form.submitAgain'){
                vm.$http.get(httpUrl.baseUrl + '/common/getFormToken').then(function (res) {
                  if (res.code === 'rest.success') {
                    vm.fb_info.formToken = res.result;
                  }
                })
              }
            }
          }).catch((err)=>{
            vm.$http.get(httpUrl.baseUrl + '/common/getFormToken').then(function (res) {
              if (res.code === 'rest.success') {
                vm.fb_info.formToken = res.result;
              }
            })
          });
        },
        closeFb: function () {
          this.activeFbIndex = -1;
          this.fb_info = {};
          this.m_fb = 0;
        },
        showFBdlg: function (k) {
          if (k.dispatchFlag) {
            if(k.sn){
              let url=k.detailUrl.split(':')[0]+':'+k.detailUrl.split(':')[1]
              this.$utils.openNewTable(url+'/api/third/login?SN='+k.sn+'&demandId='+k.demandId)
              console.log(url+'/api/third/login?SN='+k.sn+'&demandId='+k.demandId)
            }else{
              this.$utils.openNewTable(k.detailUrl)
            }
          } else {
            this.m_fb = 1;
            this.fb_list = [];
            this.fb_info = {
              bidId: k.id,
              demandId: k.demandId
            }
            var $this = this;
            this.$http.get(httpUrl.baseUrl + '/common/getFormToken').then(function (res) {
              if (res.code === 'rest.success') {
                $this.fb_info.formToken = res.result;
                $this.$http.get(httpUrl.baseUrl + '/demand/seller/selectDispatch').then(function (res) {
                  $this.fb_list = res.result;
                });
              }
            })
          }
        },
        calcZQ: function (actualPeriod, delayCount) {
          return actualPeriod + delayCount;
        },
        calcJZ: function (createDate, delayCount) {
          return formatTime(new Date(createDate).getTime() + delayCount * 24 * 3600 * 1000);
        },
        getDataComments: function (id) {
          var $this = this;
          httpDemandApi.initEvaluate({ id: id }).then(function (res) {
            $this.commentsInfo = res.result;
            $this.commentsInfo.reason = '';
            $this.resetRate();
          });
        },
        getDataDelay: function (id) {
          var $this = this;
          httpDemandApi.selectDelay({ id: id }).then(function (res) {
            $this.delayInfo = res.result;
            $this.delayInfo.delay = '';
            $this.delayInfo.reason = '';
          });
        },
        getDataCheck: function (id) {
          var $this = this;
          httpDemandApi.selectCheck({ id: id }).then(function (res) {
            $this.acceptInfo = res.result;
            $this.acceptInfo.reason = '';
          });
        },
        starUpdate: function (index, k, isClicked) {
          var msg = ['1分 不满', '2分 不满', '3分 满意', '4分 满意', '5分 惊喜'];
          if (!isClicked && this.evItem[index].isClicked) return;
          this.evItem[index].index = k;
          this.evItem[index].txt = msg[k];
          if (isClicked) this.evItem[index].isClicked = true;
        },
        viewProtocol: function (id) {
          httpDemandApi.sellerdownLoadProtocol({ id: id }).then(function (res) {
            saveAs(res, id + '.pdf', { type: 'application/pdf;charset=utf-8' });
          });
        },
        uploadSuccess: function (res) {
          //url, fileName, id, name
          if (res.exp.type === 0) {
            if (this.acceptInfo.fileIds) {
              this.acceptInfo.fileIds.push(res.data.id);
              this.acceptInfo.fileName.push(res.data.fileName);
            } else {
              this.acceptInfo.fileIds = [res.data.id];
              this.$set(this.acceptInfo, 'fileName', [res.data.fileName]);
            }
          } else if (res.exp.type === 1) {
            if (this.commentsInfo.fileIds && this.commentsInfo.fileIds.length > 4) {
              $dialog.showToast('只能上传5张图片');
              return;
            }
            if (!this.commentsInfo.fileIds) {
              this.commentsInfo.fileIds = [];
              this.$set(this.commentsInfo, 'imgprev', []);
            }
            this.commentsInfo.fileIds.push(res.data.id);
            this.commentsInfo.imgprev.push(res.data.url);
            //this.commentsInfo.fileName = res.data.id;
          } else {

          }
        },
        imgPreview: function (e) {
          imgPreview(e.target);
        },
        delFile: function (type, n) {
          if (type === 0) {
            this.acceptInfo.fileIds.splice(n, 1);
            this.acceptInfo.fileName.splice(n, 1);
          } else if (type === 1) {
            this.commentsInfo.imgprev.splice(n, 1);
            this.commentsInfo.fileIds.splice(n, 1);
          }
        },
        submitAccept: function () {
          if (this.acceptInfo.reason.length > 200) {
            $dialog.showToast('不能超过200字符');
          } else if (this.acceptInfo.reason.length < 1) {
            $dialog.showToast('请填写原因');
          } else {
            var $this = this;
            !$this.isSubmitDisabled && ($this.isSubmitDisabled = true, httpDemandApi.insertCheck({
              fileIds: this.acceptInfo.fileIds,
              bidId: this.acceptInfo.id,
              inspectedCase: this.acceptInfo.reason
            }).then(function (res) {
              $this.closeAccept();
              $this.searchPage();
              $this.isSubmitDisabled = false
            }).catch(function () {
              $this.isSubmitDisabled = false
              $dialog.showToast('申请验收失败，请重试');
            })
            )
          }
        },
        showAccept: function (k) {
          this.getDataCheck(k.id);
          this.m_accept = 1;
        },
        closeAccept: function () {
          this.m_accept = 0;
        },
        submitDelay: function () {
          if (this.delayInfo.reason.length > 200) {
            $dialog.showToast('不能超过200字符');
          } else if (this.delayInfo.reason.length < 1) {
            $dialog.showToast('请填写原因');
          } else if (this.delayInfo.delay === '') {
            $dialog.showToast('请选择延期天数');
          } else {
            var $this = this;
            !$this.isSubmitDisabled && ($this.isSubmitDisabled = true, httpDemandApi.insertDelay({
              bidId: this.delayInfo.id,
              delayCase: this.delayInfo.reason,
              delayPeriod: this.delayInfo.delay
            }).then(function (res) {
              $this.closeDelay();
              $this.searchPage();
              $this.isSubmitDisabled = false
            }).catch(function () {
              $this.isSubmitDisabled = false
              $dialog.showToast('申请延期失败，请重试');
            })
            )
          }
        },
        showDelay: function (k) {
          this.getDataDelay(k.id);
          this.m_delay = 1;
        },
        closeDelay: function () {
          this.m_delay = 0;
        },
        resetRate: function () {
          this.evItem.forEach(function (d) {
            d.isClicked = false;
            d.index = -1;
            d.txt = '';
          });
        },
        getRate: function () {
          var a = [];
          var b = this.options['evaluate_item'];
          this.evItem.forEach(function (d, index) {
            a.push({
              evaluateResult: d.index + 1,
              evaluateItem: b[index].value
            })
          });
          return a;
        },
        checkRate: function () {
          for (var i = 0, l = this.evItem.length; i < l; i++) {
            if (this.evItem[i].index === -1) {
              return false;
            }
          }
          return true;
        },
        submitComments: function () {
          if (this.commentsInfo.reason.length > 200) {
            $dialog.showToast('不能超过200字符');
          } else if (!this.checkRate()) {
            $dialog.showToast('请评分');
          } else {
            var $this = this;
            !$this.isSubmitDisabled && ($this.isSubmitDisabled = true, httpDemandApi.serviceEvaluate({
              bid: this.commentsInfo.demandId,
              evaluateList: [{
                evaluateType: '005', // 评价类型(字典表：evaluate)	是
                anonymityFlag: this.commentsInfo.flag ? '1' : '0', // 匿名标识(字典表：yes_no)（可以为空）
                comment: this.commentsInfo.reason, // 评价内容（可以为空）	是
                fileIds: this.commentsInfo.fileIds, //	评价内容附件Ids（可以为空）	是
                resultVoList: this.getRate()
              }]
            }).then(function (res) {
              if (res.code === 'rest.success') {
                $dialog.showToast('评价成功');
                $this.closeComments();
                $this.searchPage();
              }
              $this.isSubmitDisabled = false
            }).catch(function () {
              $dialog.showToast('评价失败，请重试');
              $this.isSubmitDisabled = false
            })
            )
          }
        },
        closeComments: function () {
          this.m_comments = 0;
        },
        showComments: function (k) {
          this.getDataComments(k.id);
          this.m_comments = 1;
        },
        showOps: function (index) {
          this.moreIndex = index;
        },
        hideOps: function (index) {
          this.moreIndex = -1;
        },
        getOptions: function (keys) {
          var vm = this;
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                if (codes.code === 'evaluate_item') {
                  codes.dictIInfos.forEach(function (d, index) {
                    vm.evItem.push({
                      index: -1,
                      txt: ''
                    })
                  });
                } else {
                  codes.dictIInfos.unshift({ id: '-1', value: '', display: "不限" });
                }
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        searchPage: function (page) {
          if (this.searchDisable) return;
          var $this = this;
          this.searchData.pageNum = page || this.page;
          this.searchData.pageSize = this.pageSize;
          this.searchDisable = true;
          httpDemandApi.winBidByPage($.extend({}, this.searchData)).then(function (res) {
            if (res.code === 'rest.success') {
              $this.searchList = res.result.list;
              $this.totalPage = res.result.pages;
            }
            $this.searchDisable = false;
          }).catch(function (res) {
            $this.searchDisable = false;
          });
        }
      }
    });
  });
});
