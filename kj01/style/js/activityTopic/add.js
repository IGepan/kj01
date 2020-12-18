// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/style/js/api/topic.js', '/style/js/api/activity.js', 'jqValidate', 'dialog', 'httpUrl', 'laydate', 'jqSelect', 'VueUeditor'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, activityApi1, jqValidate, dialog, httpUrl, laydate, jqSelect, VueUeditor) {
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: function () {
        return {
          http: httpUser,
          options: {
            active_type: []
          },
          type: 'add',
          imgOption: {
            size: '690,460',
            prev: 'head',
            type: 'posterId',
            url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
          },
          ueditorConfig: {
            initialFrameHeight: 240,
            maximumWords: 10000,
            toolbars: [[
              'undo', //撤销
              'redo', //重做
              '|',
              'bold', //加粗
              'indent', //首行缩进
              'italic', //斜体
              'underline', //下划线
              'strikethrough', //删除线
              'subscript', //下标
              'fontborder', //字符边框
              'superscript', //上标
              'formatmatch', //格式刷
              'pasteplain', //纯文本粘贴模式
              '|',
              'selectall', //全选
              'removeformat', //清除格式
              'time', //时间
              'date', //日期
              'inserttitle', //插入标题
              'cleardoc', //清空文档
              'fontfamily', //字体
              'fontsize', //字号
              'paragraph', //段落格式
              'spechars', //特殊字符
              'searchreplace', //查询替换
              '|',
              'justifyleft', //居左对齐
              'justifyright', //居右对齐
              'justifycenter', //居中对齐
              'justifyjustify', //两端对齐
              '|',
              'forecolor', //字体颜色
              'backcolor', //背景色
              '|',
              'insertorderedlist', //有序列表
              'insertunorderedlist', //无序列表
              'rowspacingtop', //段前距
              'rowspacingbottom', //段后距
              '|',
              'lineheight', //行间距
              'autotypeset', //自动排版
              'touppercase', //字母大写
              'tolowercase', //字母小写
              'simpleupload', // 单图上传
              '|',
              'inserttable'//表格
            ]]
          },
          dataset: {},
          isOpenCooperation: false,
          activeId: '',
          formData: {
            id: '', // 'id'
            title: '', // 专题名称
            keyWord: '', // 关键字
            topicDtls: [ // 关联活动
            ],
            sponsor: [], // 主办单位
            posterId: '', // 宣传海报
            activeText: '', // 活动介绍
            activeStartTime: '', // 活动开始时间
            activeEndTime: '', // 活动结束时间
            industry: [],
            cooperation: [], // 协作单位
            topicCustomTag: [] // 系列活动自定义标签(字典表：topic_custom_tag)
          },
          isShowLinks: false,
          isSubmitDisabled: false,
          columnHead: [
            {
              displayWeight: '',
              columnName: '选中'
            },
            {
              displayWeight: '200',
              columnName: '活动名称'
            },
            {
              displayWeight: '',
              columnName: '活动类型'
            },
            {
              displayWeight: '',
              columnName: '活动状态'
            },
            {
              displayWeight: '',
              columnName: '活动时间'
            },
            {
              displayWeight: '200',
              columnName: '所属行业'
            }
          ],
          queryForm: '',
          selectId: [],
          topicDtlsLength: 0,
          orderList: [],
          keywordVal: '',
          pages: 1,
          pageCount: 4
        };
      },
      watch: {},
      created: function () {
        this.activeId = this.$utils.getReqStr('id');
        this.type = this.$utils.getReqStr('type') || 'add';
        this.initData()
      },
      components: {
        'vue-ueditor-wrap': VueUeditor,
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/conferenceLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
        'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
        'img-uploader': httpVueLoader('/common/components/imgUploader.vue'),
        'ly-code-mulselect': httpVueLoader('/common/components/mulCodeSelect.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'ly-select': httpVueLoader('/common/components/select.vue'),
        'select-type': httpVueLoader('/style/components/selectType.vue')
      },
      mounted: function () {
        this.type !== 'view' && (this.$time = laydate.render({
          elem: '#time',
          type: 'datetime',
          value: this.formData.activeStartTime,
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'activeStartTime',
          endkey: 'activeEndTime',
          vm: this,
          trigger: 'click',
          calendar: true,
          done: function (value, date, endDate) { //选择日期完毕的回调
            value && (this.vm.$refs.atimeMsg.innerText = '')
            this.vm.formData[this.startkey] = value;
          }
        }));
        this.type !== 'view' && (this.$time2 = laydate.render({
          elem: '#time1',
          type: 'datetime',
          value: this.formData.activeEndTime,
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'activeStartTime',
          endkey: 'activeEndTime',
          vm: this,
          trigger: 'click',
          calendar: true,
          done: function (value, date, endDate) { //选择日期完毕的回调
            value && (this.vm.$refs.atimeMsg.innerText = '')
            this.vm.formData[this.endkey] = value;
          }
        }));
      },
      methods: {
        initData: function () {
          this.activeId && this.getDetail();
          this.getOptions('topic_status')
          this.getOptions('audit_situation')
          this.getOptions('active_status')
          this.getOption([
            { 'code': "cooperation_type" }
          ])
          this.getTree([
            {
              type: '11'
            }
          ])
          this.initQueryData()
        },
        getTree: function (keys) {
          var vm = this;
          activityApi1.getTree(keys).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options['active_type'] = res.result[0]
            }
          });
        },
        initQueryData: function () {
          this.queryForm = {
            pageNum: 1,	// 	第几页	是	[string]		查看
            pageSize: 10,	// 	每页显示多少行	是	[string]		查看
            orderBy: '',	// 	排序字段	是	[string]		查看
            title: '', // 活动名称
            activeType: '', // 活动类型(字典表：active_type)
            status: '03', // 活动状态(字典表：active_status)
            activeStartTimeFrom: '', // 活动开始时间起
            activeStartTimeTo: '', // 活动开始时间止
            total: 0
          }
        },
        getOption: function (keys) {
          var vm = this;
          this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        initDate: function () {
          this.$nextTick(function () {
            var vm = this
            // $('.plan .inputTime').each(function (i, item) {
            //   var $itemInput = $(item).find('input')
            //   $itemInput.each(function (index, input) {
            //     var $item = '';
            //     var $titem = ''
            //     var temp = vm.formData.topicDtls[i]
            //     if (!temp.activeId) {
            //       // vm.dataset['initObj' + i] =
            //       vm.type !== 'view' && laydate.render({
            //         elem: '#' + input.getAttribute("id"),
            //         type: 'datetime',
            //         value: index ? temp.activeEndTime : temp.activeStartTime,
            //         format: 'yyyy-MM-dd HH:mm:ss',
            //         startkey: 'activeStartTime',
            //         endkey: 'activeEndTime',
            //         valueType: index,
            //         subIndex: i,
            //         vm: vm,
            //         trigger: 'click',
            //         calendar: true,
            //         done: function (value, date, endDate) { //选择日期完毕的回调
            //           value && (this.vm.$refs.atimeMsg.innerText = '')
            //           this.valueType ? (this.vm.formData.topicDtls[this.subIndex][this.endkey] = value) : (this.vm.formData.topicDtls[this.subIndex][this.startkey] = value);
            //         }
            //       });
            //       input.value = index ? temp.activeEndTime : temp.activeStartTime
            //     } else {
            //       $item = $(input)
            //       $titem = $item.clone(false)
            //       $item.replaceWith($titem)
            //       $titem.val(index ? temp.activeEndTime : temp.activeStartTime)
            //       // vm.dataset['initObj' + i].config.vm = ''
            //       // vm.dataset['initObj' + i].config.elem = ''
            //       // item.removeAttribute('lay-key');
            //       // item.removeEventListener('click');
            //     }
            //   })
            // });
          })
        },
        getDetail: function () {
          var vm = this;
          activityApi.detail({ id: this.activeId }).then(function (res) {
            if (res.code === 'rest.success') {
              var to = res.result
              for (var key in to) {
                if (key !== 'poster') {
                  if (key === 'sponsor') {
                    // 初始化 主办方
                    vm.formData[key] = to[key] ? to[key].split('ぶんかつ') : [];
                  } else if (key === 'isNeverExpires') {
                    // 初始化 转化随到随学
                    vm.formData[key] = parseInt(to[key]);
                  } else {
                    // 初始化 其他属性
                    vm.formData[key] = to[key];
                  }
                }
                // 附件
                if (key === 'topicCustomTag') {
                  vm.formData['topicCustomTag'] = to[key].map(function (key) {
                    return key.tagValue
                  })
                }
              }
              to.topicDtls && (vm.topicDtlsLength = to.topicDtls.length)
              to.auditSituation === '03' && (vm.isSubmitDisabled = true);
              vm.$nextTick(function(){
                setTimeout(function () {
                  // 宣传图片
                  to.poster && (vm.$refs.bgImg.style.backgroundImage = 'url(' + to.poster.url + ')');
                  // 时间
                  // 时间
                  to.activeStartTime && (document.querySelector('#time').value = to.activeStartTime);
                  to.activeEndTime && (document.querySelector('#time1').value = to.activeEndTime);
                }, 500);
              })
              // 初始化时间
              vm.initDate();
            }
          })
        },
        getOptions: function (key) {
          var vm = this
          this.$httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.unshift({ id: "18322084" + key, value: "", display: "请选择" })
              vm.options[key] = res.result
            }
          })
        },
        getOrderList: function () {
          var vm = this
          if (!this.endIsGreaterThanThebeginning(this.queryForm.activeStartTimeFrom, this.queryForm.activeStartTimeTo)) {
            activityApi1.selectByPage(this.queryForm).then(function (res) {
              var selectId = []
              var defaultIds = {}
              if (res.code === 'rest.success') {
                res.result.list.forEach(function (item, i) {
                  if (Array.isArray(item.activeTypeDisplay) && item.activeTypeDisplay.length) {
                    item.activeTypeDisplay = item.activeTypeDisplay[0].name
                  } else {
                    item.activeTypeDisplay = ''
                  }
                  vm.formData.topicDtls.some(function (titem) {
                    return item.id === titem.activeId
                  }) && selectId.push(i) && (defaultIds[item.id] = 1);
                })
                vm.selectId = selectId;
                vm.defaultIds = defaultIds;
                vm.orderList = res.result.list
                vm.queryForm.total = res.result.total
                vm.pages = res.result.pages;
              } else {
                vm.orderList = []
                vm.queryForm.total = 0
                vm.pages = 0;
              }
            })
          } else {
            this.$dialog.showToast('活动时间开始时间不能大于结束时间')
          }
        },
        getSetting: function (templeteCode) {
          var vm = this;
          activityApi.getByCode({ templeteCode: templeteCode }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.formData[templeteCode + 'Column'] = res.result
            }
          });
          return 1;
        },
        requestForm: function (type) {
          var vm = this;
          $('.valiform').validate('submitValidate', function (val) {
            if (val) {
              var data = JSON.parse(JSON.stringify(vm.formData, function (k, v) {
                if (k === 'sponsor') {
                  return Array.isArray(v) ? v.join('ぶんかつ') : v
                }
                return v;
              }))
              data.topicDtls.forEach(function (item) {
                item.activeId && (item.activeEndTime = item.activeStartTime = '')
              })
              vm.isSubmitDisabled = true
              activityApi[type](data).then(function (res) {
                if (res.code === 'rest.success') {
                  setTimeout(() => {
                    location.href = '/activityTopic/?code=001.004.001.002'
                  }, 2000);
                } else {
                  vm.isSubmitDisabled = false
                }
                vm.$dialog.showToast(res.desc);
              }).catch(function (error) {
                vm.$dialog.showToast('系统错误！');
                vm.isSubmitDisabled = false
              });
            }
          })
        },
        handleInsert: function () {
          this.requestForm(this.type === 'edit' ? 'update' : 'insert')
        },
        handleSubmit: function () {
          this.requestForm('submit')
        },
        handleBack: function () {
          location.href = '/activityTopic/?code=001.004.001.002'
        },
        handleAddPlan: function () {
          // this.formData.topicDtls.push(
          //   {
          //     activeName: '', // 活动名称
          //     activeStartTime: '', // 活动开始时间
          //     activeEndTime: '', // 活动结束时间
          //     activeAddress: '', // 活动地址
          //     activeId: ''// 关联活动Id
          //   }
          // );
          this.handleOpenDialog(0)
          this.initDate();
        },
        handleDelPlan: function (i) {
          this.formData.topicDtls.splice(i, 1);
          this.initDate();
        },
        handlePrevPlan: function (i) {
          this.formData.topicDtls.splice(i - 1, 1, this.formData.topicDtls.splice(i, 1, this.formData.topicDtls[i - 1])[0])
          this.initDate();
        },
        handleNextPlan: function (i) {
          this.formData.topicDtls.splice(i + 1, 1, this.formData.topicDtls.splice(i, 1, this.formData.topicDtls[i + 1])[0])
          this.initDate();
        },
        handleAddKeywordClick: function () {
          if (this.keywordVal) {
            this.formData.sponsor.push(this.keywordVal)
            this.keywordVal = ''
          } else {
            this.$dialog.showToast('请先填写主办单位')
          }
        },
        handleDelKeywordClick: function (index) {
          this.formData.sponsor.splice(index, 1);
        },
        handleAddCooperation: function (e) {
          var dataset = e.target.dataset
          this.formData.cooperation.push({
            cooperationTypeDisplay: dataset.name,
            cooperationType: dataset.type,
            cooperationName: ''
          })
        },
        handleDelCooperation: function (index) {
          this.formData.cooperation.splice(index, 1);
        },
        handleOpenDialog: function (i) {
          this.triggerOpenIndex = i;
          this.getOrderList();
          this.isShowLinks = true;
          this.$nextTick(function () {
            this.queryForm.activeType = ''
            !this.$querytime && (this.$querytime = laydate.render({
              elem: '#querytime',
              type: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss',
              startkey: 'activeStartTimeFrom',
              endkey: 'activeStartTimeTo',
              trigger: 'click',
              vm: this,
              done: function (value, date, endDate) { //选择日期完毕的回调
                this.vm.queryForm[this.startkey] = value;
              }
            }), laydate.render({
              elem: '#querytime1',
              type: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss',
              startkey: 'activeStartTimeFrom',
              endkey: 'activeStartTimeTo',
              trigger: 'click',
              vm: this,
              done: function (value, date, endDate) { //选择日期完毕的回调
                this.vm.queryForm[this.endkey] = value;
              }
            }));
          })
        },
        handleCloseDialog: function () {
          this.isShowLinks = false;
          this.initQueryData();
        },
        handleSelectItem: function () {
          console.log(this.selectId)
          var vm = this;
          var sitems = []
          var defaultIds = this.defaultIds;
          if (this.selectId.length) {
            this.selectId.forEach(function (it, i) {
              var selectItem = vm.orderList[it]
              var item = {};
              if (!defaultIds[selectItem.id]) {
                item['activeName'] = selectItem.title; // 活动名称
                item['activeStartTime'] = selectItem.activeStartTime ? selectItem.activeStartTime + ' 00:00:00' : ''; // 活动开始时间
                item['activeEndTime'] = selectItem.activeEndTime ? selectItem.activeEndTime + ' 00:00:00' : ''; // 活动结束时间
                item['activeAddress'] = (selectItem.countryDisplay || '') + (selectItem.provinceDisplay || '') + (selectItem.cityDisplay || '') + (selectItem.districtDisplay || '') + (selectItem.location || ''); // 活动地址
                item['activeId'] = selectItem.id; // 关联活动Id
                item['isNeverExpires'] = selectItem.isNeverExpires // 随到随学
                sitems.push(item)
              }
            });
            this.formData.topicDtls = this.formData.topicDtls.concat(sitems)
            this.topicDtlsLength = this.formData.topicDtls.length - 1;
            this.isShowLinks = false;

            this.initQueryData();
            this.initDate();
          } else {
            this.$dialog.showToast('请选择活动')
          }
        },
        bindActiveTagValid: function (v, o, callback) {
          if (!this.formData.topicCustomTag.length) {
            callback(o, '标签不能为空')
          } else {
            callback(o)
          }
        },
        bindSponsorValid: function (v, o, callback) {
          if (!this.formData.sponsor.length) {
            callback(o, '主办单位不能为空')
          } else {
            callback(o)
          }
        },
        bindCooperationValid: function (v, o, callback) {
          if (this.formData.cooperation.some(function (item) {
            return !item.cooperationName
          })) {
            callback(o, '合作单位信息不能为空')
          } else {
            callback(o)
          }
        },
        bindActiveImgValid: function (v, o, callback) {
          if (!this.formData.posterId) {
            callback(o, '宣传封面不能为空')
          } else {
            callback(o)
          }
        },
        bindActiveTimeValid: function (v, o, callback) {
          if (!this.formData.activeStartTime || !this.formData.activeEndTime) {
            callback(o, '活动时间不能为空')
          } else if (this.endIsGreaterThanThebeginning(this.formData.activeStartTime, this.formData.activeEndTime)) {
            callback(o, '活动开始时间不能大于结束时间')
          } else {
            callback(o)
          }
        },
        bindCustomprofession: function (v, o, callback) {
          var $this = this
          setTimeout(function () {
            var t = $this.formData.activeText;
            v = $this.formData.activeText ? $this.formData.activeText.replace(/<\/?.+?>/g, "").replace(/ /g, "") : '';
            if (t === '') {
              callback(o, '活动详情不能为空')
            } else if (v.length > 10000) {
              callback(o, '活动详情少于10000字')
            } else {
              callback(o)
            }
          }, 2000)
        },
        endIsGreaterThanThebeginning: function (begin, end) {
          return new Date(begin).getTime() > new Date(end).getTime();
        },
        imgUploadSuccess: function (id, url, type, data) {
          this.formData[type] = id;
          this.$refs.bgImg.style.backgroundImage = 'url(' + url + ')';
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
