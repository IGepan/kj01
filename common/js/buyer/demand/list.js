// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpDemandApi', 'httpCom', 'fileSaver', 'laydate','httpUrl'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpDemandApi, httpCom, fileSaver, laydate,httpUrl) {
    new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: function () {
        return {
          http: httpUser,
          httpCom: httpCom,
          jquery: $,
          options: {
            operations: [
              {
                id: 1,
                display: '取消需求',
                value: 'cancel'
              },
              {
                id: 2,
                display: '修改需求',
                value: 'update'
              },
              {
                id: 3,
                display: '浏览需求',
                value: 'scan'
              },
              {
                id: 4,
                display: '需求延期',
                value: 'postpone'
              },
              {
                id: 5,
                display: '查看日志',
                value: 'viewLog'
              },
              {
                id: 6,
                display: '查看投标',
                value: 'viewBid'
              },
              {
                id: 7,
                display: '查看协议',
                value: 'viewProtocol'
              },
              {
                id: 8,
                display: '确认完成',
                value: 'signFor'
              },
              {
                id: 9,
                display: '评价',
                value: 'appraise'
              },
              {
                id: 10,
                display: '追评',
                value: 'addappraise'
              },
              {
                id: 11,
                display: '查看中验',
                value: 'accept'
              }
            ],
            demand_type: [],
            demand_status: [],
            demand_stage: [],
            certification_status: []
          },
          queryForm: {
            pageNum: 1,	// 	第几页	是	[string]		查看
            pageSize: 10,	// 	每页显示多少行	是	[string]		查看
            orderBy: '',	// 	排序字段	是	[string]		查看
            keyWord: '',	// 		关键字
            publicDateTo: '',	// 	发起日期下限
            publicDateFrom: '',	// 	发起日期上限
            title: '',	// 	需求名称
            demandType: '',	// 	需求类型(字典表：demand_type)
            status: '',	// 	需求状态(字典表：demand_status
            stage: '',	// 	需求所处阶段(字典表：demand_stage)
            certificationFlag: '',	// 审核结果(字典表：certification_status)
            total: 0
          },
          orderList: [],
          pages: 1,
          pageCount: 4,
        }
      },
      watch: {
        'queryForm.publicDateTo': function (newVal, oldval) {
          this.queryForm.publicDateFrom && new Date(newVal) > new Date(this.queryForm.publicDateFrom) && this.$dialog.showToast('开始时间不能大于结束时间！')
        },
        'queryForm.publicDateFrom': function (newVal, oldval) {
          this.queryForm.publicDateTo && new Date(this.queryForm.publicDateTo) > new Date(newVal) && this.$dialog.showToast('开始时间不能大于结束时间！')
        }
      },
      filters: {
        getOperations: function (o, v, s, evaluated) {
          // 0-9
          // 0 取消需求 1修改需求 2 浏览需求 3 需求延期 4 查看日志 5 查看投标 6 查看协议 7 确认完成 8 评价 9 追评 10 分包
          var types = {
            '01': [2, 3, 4], // 招标中
            '02': [2, 3, 4, 5], // 待选标
            '03': [2, 4, 5, 6, 10 ,7], // 工作中
            '04': [2, 4, 5, 6, 10 ,7], // 待验收
            '05': [2, 4, 5, 10 ,6], // 已完成
            '06': [], // 已取消
            '07': [], // 审核中
            '08': [0, 1], // 审核不通过
            '09': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 测试用全部
          }
          var r = types[v].map(function (key) {
            return o[key]
          })
          s && v == '01' && r.unshift(o[0])
          v == '05' && !evaluated && r.push(o[8])
          return r
        }
      },
      mounted: function () {
        var vm = this
        laydate.render({
          elem: '#timeStart',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'publicDateFrom',
          type: 'datetime',
          done: function (value, date, endDate) { //选择日期完毕的回调
            vm.queryForm[this.startkey] = value;
          }
        })
        laydate.render({
          elem: '#timeEnd',
          format: 'yyyy-MM-dd HH:mm:ss',
          endkey: 'publicDateTo',
          type: 'datetime',
          done: function (value, date, endDate) { //选择日期完毕的回调
            vm.queryForm[this.endkey] = value;
          }
        })
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getOptions([
          { 'code': 'demand_type' },
          { 'code': 'demand_status' },
          { 'code': 'demand_stage' },
          { 'code': 'certification_status' },
          { 'code': 'evaluate_item', group: 4 }
        ])
        this.getOrderList()
      },
      methods: {
        // 获取多个标准码
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                codes.code !== 'evaluate_item' && codes.dictIInfos.unshift({ id: '-1', value: '', display: "不限" })
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        getOrderList: function () {
          var vm = this
          httpDemandApi.selectMyDemand(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.list.forEach(function (o) { o.operation = '' })
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.total
              vm.pages = res.result.pages;
            } else {
              vm.orderList = []
              vm.queryForm.total = 0
              vm.pages = 0;
            }
          })
        },
        handleOrderChange: function (i) {
          var vm = this
          var order = this.orderList[i]
          order.operation && this[order.operation](order)
          order.operation && (order.operation = '', this.$set(this.orderList, i, order))
        },
        // 取消
        cancel: function (order) {
          var vm = this
          var options = {
            title: '取消需求',
            texts: '<table class="list"><tbody><tr><th>需求名称：</th><td>' + order.title + '</td></tr><tr><th>需求编号：</th><td>' + order.id + '</td></tr><tr><th>需求预算：</th><td class="form-view_yellow">' + order.budget + '元</td></tr><tr><th>截止日期：</th><td class="form-view_yellow">' + (order.endDate || '') + '</td></tr></tbody></table><div class="form-view_type centered">需求取消后，将不能对该需求进行任何操作</div>',
            buttons: [
              {
                label: '确认取消',
                fun: function () {
                  httpDemandApi.cancelDemand({ id: order.id, version: order.version }).then(function (res) {
                    if (res.code === 'rest.success') {
                      vm.$dialog.showToast(res.desc)
                      vm.getOrderList()
                    }
                  })
                  return 1
                }
              },
              {
                label: '关闭'
              }
            ]
          }
          this.$dialog.confirm2(options)
        },
        // 修改
        update: function (order) {
          this.$utils.openNewTable('add.html?code=001.001.002.002&id=' + order.id)
        },
        // 浏览需求
        scan: function (order) {
          this.$utils.openNewTable(this.$pathPrefix+'/common/demanddetail.html?id=' + order.id)
        },
        // 需求延期
        postpone: function (order) {
          var vm = this
          httpDemandApi.canBeDelay({ id: order.id }).then(function (res) {
            if (res.code === 'rest.success') {
              if (res.result) {
                var options = {
                  title: '需求延期',
                  texts: '<div class="form-view_type">如果在招标截止日期前未找到满意的投标人，您可以申请招标延期，您可以在不修改需求预算的前提下申请延期三次，每次延期时长不能超过7天</div><table class="list"><tr><th>需求名称：</th><td>' + order.title + '</td></tr><tr><th>需求编号：</th><td>' + order.id + '</td></tr><tr><th>需求预算：</th><td class="form-view_yellow">' + order.budget + '元</td></tr><tr><th>需求周期：</th><td>' + order.demandPeriod + '天</td></tr><tr><th>截止日期：</th><td>' + order.endDate + '</td></tr><tr><th>延期天数：</th><td class="select"><select id="days"><option value="">请选择</option><option value="1">1天</option><option value="2">2天</option><option value="3">3天</option><option value="4">4天</option><option value="5">5天</option><option value="6">6天</option><option value="7">7天</option></select><i class="iconfont icon-xiala1"></i></td></tr></table>',
                  buttons: [
                    {
                      label: '确认延期',
                      fun: function () {
                        var v = $('#days').val()
                        if (v) {
                          httpDemandApi.delayDemand({ id: order.id, delayNum: v, version: order.version }).then(function (res) {
                            if (res.code === 'rest.success') {
                              vm.$dialog.showToast(res.desc)
                              vm.getOrderList()
                            }
                          })
                        } else {
                          vm.$dialog.showToast('请选择延期天数')
                        }
                        return v
                      }
                    },
                    {
                      label: '关闭'
                    }
                  ]
                }
                vm.$dialog.confirm2(options)
              } else {
                vm.$dialog.showToast('您已延期三次，不能继续延期!')
              }
            }
          })
        },
        // 查看日志
        viewLog: function (order) {
          this.$utils.openNewTable('logs.html?code=001.001.002.002&id=' + order.id)
        },
        // 查看投标
        viewBid: function (order) {
          this.$utils.openNewTable('bidlist.html?code=001.001.002.002&id=' + order.id)
        },
        // 查看协议
        viewProtocol: function (order) {
          httpDemandApi.buyerdownLoadProtocol({ id: order.id }).then(function (res) {
            saveAs(res, order.id + '.pdf', { type: 'application/pdf;charset=utf-8' })
          })
        },
        // 确认完成
        signFor: function (order) {
          var vm = this
          httpDemandApi.getCompleteDisplay({ id: order.id }).then(function (res) {
            if (res.code === 'rest.success') {
              var info = res.result
              var options = {
                title: '确认完成',
                texts: '<div class= "form-view_type">确认完成后，将不能对需求进行任何操作，请确认需求的内容已完成后再执行此操作！</div> <div class="form-view_item">需求信息</div><table class="list"><tbody><tr><th>需求名称：</th><td>' + info.title + '</td></tr><tr><th>需求编号：</th><td>' + order.id + '</td></tr><tr><th>需求预算：</th><td class="form-view_blue">' + order.budget + '元</td></tr><tr><th>截止日期：</th><td>' + info.endDate + '</td></tr></tbody></table> <div class="form-view_item">投标信息</div> <table class="list"><tbody><tr><th>中标者：</th><td>' + info.bider + '</td></tr><tr><th>报价：</th><td>' + info.amount + '元</td></tr><tr><th>服务周期：</th><td>' + info.actualPeriod + '天</td></tr><tr><th>联系人：</th><td>' + info.contacts + '</td></tr><tr><th>联系电话：</th><td>' + info.phone + '</td></tr><tr><th>中标时间：</th><td>' + info.bidDate + '</td></tr></tbody></table>',
                buttons: [
                  {
                    label: '确认',
                    fun: function () {
                      httpDemandApi.completeDemand({ id: info.id, version: info.version }).then(function (res) {
                        if (res.code === 'rest.success') {
                          vm.$dialog.showToast(res.desc)
                          vm.getOrderList()
                        }
                      })
                      return 1
                    }
                  },
                  {
                    label: '取消'
                  }
                ]
              }
              vm.$dialog.confirm2(options)
            }
          })
        },
        //查看中验
        accept: function (order) {
          var vm = this
          httpDemandApi.intermediateDetail({ id: order.id }).then(function (res) {
            if (res.code === 'rest.success') {
              var info = res.result
              var file = ''
              var accessory
              info.files && info.files.length && (file = info.files.map(function (op) {
                return '<div class="savefile" data-id=\''+op.id+'\'>' + op.name + '</div>'
              }).join(''),accessory='<td>'+ file+'</td>')
              var options = {
                title: '查看中验',
                texts: '<table class="list"><tbody><tr><th>需求名称：</th><td>' + info.title + '</td></tr><tr><th>中验原因：</th><td class="form-view_blue">' + (info.inspectedCase || '') + '</td></tr><tr><th>中验时间：</th><td>' + (info.inspectedDate || '') + '</td></tr><tr><th valign="top">附件：</th>' + (accessory || '') + '</tr></tbody></table><div style="height:30px"></div>',buttons: []
              }
              vm.$dialog.confirm2(options)
              $('.savefile').on('click',function(){
                var name = $(this).html()
                var id=$('.savefile').attr('data-id')
                if(name.indexOf('.pdf')>-1){
                  vm.$utils.openNewTable(vm.$pathPrefix+'/common/buyer/demand/preview.html?id='+id);
                }else{
                  info.files.forEach(function(item){
                    if(item.name === name){
                      saveAs(httpUrl.imgUploadUrl + '/file/download?filePath=' + item.path, item.name)
                    }
                  })
                }
              })
            }
          })
        },
        // 评价
        appraise: function (order) {
          var vm = this
          httpDemandApi.getCompleteDisplay({ id: order.id }).then(function (res) {
            if (res.code === 'rest.success') {
              var info = res.result
              var eitems = ''
              var evaluateList = [
                {
                  evaluateType: '004', // 评价类型(字典表：evaluate)	是
                  anonymityFlag: 0, // 匿名标识(字典表：yes_no)（可以为空）
                  comment: '', // 评价内容（可以为空）	是
                  fileIds: [], //	评价内容附件Ids（可以为空）	是
                  resultVoList: vm.options.evaluate_item.map(function (item, i) {
                    eitems += '<tr><th>' + item.display + '：</th><td data-index="' + i + '"><i class="iconfont icon-star_full"></i><i class="iconfont icon-star_full"></i><i class="iconfont icon-star_full"></i><i class="iconfont icon-star_full"></i><i class="iconfont icon-star_full"></i></td></tr>'
                    return {
                      evaluateResult: 0,
                      evaluateItem: item.value
                    }
                  })
                }
              ]
              var options = {
                title: '服务评价',
                width: '1000px',
                texts: '<div class="form-view_item">请您根据本次需求，给予真实、客观、仔细地评价。<br>您的评价将是其他会员的参考，也将影响卖家的信用。累计信用和积分规则：中评不计分，但会影响卖家的好评率，请慎重给予。</div><div class="form-view_box"><table class="table"><tbody><tr><th>需求标题：</th><td>' + order.title + '</td></tr><tr><th>需求编号：</th><td>' + order.id + '</td></tr><tr><th>需求预算（元）：</th><td>￥ ' + order.budget + '</td></tr><tr><th>中标方名称：</th><td>' + info.bider + '</td></tr><tr><th>报价（元）：</th><td>' + info.amount + '</td></tr><tr><th>服务周期（天）：</th><td>' + info.actualPeriod + '</td></tr></tbody></table></div><div class="form-view_box"><table class="table" id="evaluateStar"><tbody><tr><th>待评价对象：</th><td>' + info.bider + '</td></tr>' + eitems + '<tr class="textarea"><th>评价内容：</th><td><textarea id="evaluate" maxlength="500" class="evaluate"></textarea></td></tr></tbody></table></div>',
                buttons: [
                  {
                    label: '确认',
                    fun: function () {
                      var v = $('#evaluate').val()
                      var t = evaluateList[0].resultVoList.every(function (i) {
                        return i.evaluateResult
                      })
                      if (v && t) {
                        $('#evaluateStar').off()
                        evaluateList[0].comment = v
                        httpDemandApi.buyerserviceEvaluate({ bid: order.id, evaluateList: evaluateList }).then(function (res) {
                          if (res.code === 'rest.success') {
                            vm.$dialog.showToast(res.desc)
                            vm.getOrderList()
                          }
                        })
                      } else if (!t) {
                        vm.$dialog.showToast('请选择评分！')
                      } else if (!v) {
                        vm.$dialog.showToast('请填写评价内容！')
                      }
                      return v && t
                    }
                  },
                  {
                    label: '关闭'
                  }
                ]
              }
              vm.$dialog.confirm2(options)
              $('#evaluateStar').on('click, mouseover', function (e) {
                var $target = $(e.target)
                var index
                var $parent
                if ($target.is('.icon-star_full')) {
                  index = $target.index()
                  $parent = $target.parent()
                  evaluateList[0].resultVoList[$parent.data('index')].evaluateResult = index + 1
                  $parent.children().each(function (i, item) {
                    var $item = $(item)
                    if (i <= index) {
                      $item.addClass('active')
                    } else {
                      $item.removeClass('active')
                    }
                  })
                }
              })
            }
          })
        },
        // 追评
        addappraise: function (order) {
          var vm = this
          httpDemandApi.getCompleteDisplay({ id: order.id }).then(function (res) {
            if (res.code === 'rest.success') {
              var info = res.result
              var options = {
                title: '服务追评',
                width: '1000px',
                texts: '<table class="table"><tbody><tr><th>需求标题：</th><td>' + order.title + '</td></tr><tr><th>需求编号：</th><td>' + order.id + '</td></tr><tr><th>需求预算（元）：</th><td>￥ ' + order.budget + '</td></tr><tr><th>中标方名称：</th><td>' + info.bider + '</td></tr><tr><th>报价（元）：</th><td>' + info.amount + '</td></tr><tr><th>服务周期（天）：</th><td>' + info.actualPeriod + '</td></tr></tbody></table><div class="form-view_box form-view_space"><table class="table"><tbody><tr><th>待评价对象：</th><td>' + info.bider + '</td></tr><tr class="textarea"><th>追评内容：</th><td><textarea id="evaluate" class="evaluate"></textarea></td></tr></tbody></table></div>',
                buttons: [
                  {
                    label: '确认',
                    fun: function () {
                      var v = $('#evaluate').val()
                      if (v) {
                        httpDemandApi.buyerserviceEvaluateAdd({ demandId: order.id, id: order.id, comment: v }).then(function (res) {
                          if (res.code === 'rest.success') {
                            vm.$dialog.showToast(res.desc)
                            vm.getOrderList()
                          }
                        })
                      } else {
                        vm.$dialog.showToast('请填写追评内容！')
                      }
                      return v
                    }
                  },
                  {
                    label: '取消'
                  }
                ]
              }
              vm.$dialog.confirm2(options)
            }
          })
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.queryForm.pageNum = index;
            this.getOrderList();
          }
        },
        isShowPage: function (index) {
          var pageNum = this.queryForm.pageNum;
          var row = parseInt(pageNum / 2);
          if (row == 0 || row == 1) {
            if (1 <= index && index <= 4) {
              return true;
            } else {
              return false;
            }
          } else {
            if (row * 2 - 1 <= index && index <= row * 2 + 2) {
              return true;
            } else {
              return false;
            }
          }
        },
        isMore: function () {
          var pageNum = this.queryForm.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
        }
      }
    });
  });
});
