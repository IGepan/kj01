// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/common/js/httpApi/activity.js', 'jqValidate', 'dialog', 'httpUrl', 'laydate', 'VueUeditor'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, jqValidate, dialog, httpUrl, laydate, VueUeditor) {
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: function () {
        return {
          fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
          rsfileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
          http: httpUser,
          options: {},
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
              'tolowercase' //字母小写
            ]]
          },
          activeId: '',
          formData: {
            activeId: '', // 活动id
            summary: '', // 活动回顾
            auditSituation: '', // 审核情况(字典表：audit_situation)
            noPassReason: '', // 未通过原因
            attachments: [] // 附件
          },
          isSubmitDisabled: false
        };
      },
      watch: {},
      created: function () {
        this.activeId = this.formData.activeId = this.$utils.getReqStr('id');
        this.initData()
      },
      components: {
        'vue-ueditor-wrap': VueUeditor,
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/conferenceLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue')
      },
      mounted: function () { },
      methods: {
        initData: function () {
          this.getOptions('summary_attachment_type')
          this.activeId && this.getDetail();
        },
        getDetail: function () {
          var vm = this;
          activityApi.summaryDetail({ activeId: this.activeId }).then(function (res) {
            if (res.code === 'rest.success') {
              var to = res.result
              for (var key in to) {
                key !== 'attachments' && (vm.formData[key] = to[key]);
                key === 'attachments' && (vm.formData[key] = to[key].map(function (file) {
                  file.name = file.file.name;
                  file.url = file.file.url;
                  file.fileId = file.file.id;
                  delete file.file;
                  return file;
                }));
              }
              to.auditSituation === '03' && (vm.isSubmitDisabled = true);
            }
          })
        },
        getOptions: function (key) {
          var vm = this;
          this.$httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options[key] = res.result
            }
          })
        },
        requestForm: function (type) {
          var vm = this;
          $('.valiform').validate('submitValidate', function (val) {
            if (val) {
              var data = JSON.parse(JSON.stringify(vm.formData, function (k, v) {
                if (k === 'fileIds') {
                  return v.map(function (file) { return file.id; })
                }
                return v;
              }))
              vm.isSubmitDisabled = true
              activityApi[type](data).then(function (res) {
                if (res.code === 'rest.success') {
                  setTimeout(() => {
                    location.href = this.$pathPrefix+'/common/activity/?code=001.004.001.001'
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
          var vm = this
          var options = {
            title: '温馨提示',
            width: '300px',
            texts: '确认保存吗？',
            buttons: [
              {
                label: '确认',
                fun: function () {
                  vm.requestForm('summaryUpdate')
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
        handleBack: function () {
          var vm = this
          var options = {
            title: '温馨提示',
            width: '300px',
            texts: '确认取消吗？',
            buttons: [
              {
                label: '确认',
                fun: function () {
                  location.href = vm.$pathPrefix+'/common/activity/?code=001.004.001.001'
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
        handleDelFile: function (i) {
          this.formData.attachments.splice(i, 1)
        },
        clearMsg: function (code) {
          this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
        },
        activeImgValid: function (v, o, callback) {
          if (!this.formData.posterId) {
            callback(o, '宣传图不能为空')
          } else {
            callback(o)
          }
        },
        customprofession: function (v, o, callback) {
          v = this.formData.summary ? this.formData.summary.replace(/<\/?.+?>/g, "").replace(/ /g, "") : '';
          if (v === '') {
            callback(o, '活动回顾不能为空')
          } else if (v.length > 10000) {
            callback(o, '活动回顾少于10000字')
          } else {
            callback(o)
          }
        },
        uploadSuccess: function (successInfo) {
          successInfo.data['activeId'] = this.activeId;
          successInfo.data['summaryAttachmentType'] = successInfo.exp.value;
          successInfo.data['fileId'] = successInfo.data.id;
          // value: '03', display: '活动视频'
          this.formData.attachments.push(successInfo.data)
        }
      }
    });
  });
});
