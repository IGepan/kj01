// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpCom', 'jqValidate', 'dialog'], function ($, Vue, dic, httpVueLoader, httpCom, jqValidate, dialog) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    window.vueDom = new Vue({
      el: '#index_box',
      data: {
        jquery: $,
        options: {
          sceneList: [],
          diagnosis_period: []
        },
          index: -1,
        demandForm: {
          industry: [],
          planName: '',
          budget: '',
          period: '',
          sceneId: ''
        },
        httpCom: httpCom
      },
      created: function () {
				var userInfo = JSON.parse(this.$utils.getCookie("USER_INFO"));
				if(userInfo && userInfo.userId){
					this.initData();
				}else{
					window.location.href = "/common/login.html";
				}
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
        'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
      },
      methods: {
          activeIndex: function(i) {
              this.index = i;
          },
        initData: function () {
          var demandData = sessionStorage.getItem('update1DemandForm')
          sessionStorage.removeItem('update1DemandForm')
          if (demandData) {
            this.demandForm = JSON.parse(demandData)
          }
          this.getOption("diagnosis_period")
          this.getSceneList()
        },
        getOption: function (key) {
          var vm = this
          httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options[key] = res.result
            }
          })
        },
        getSceneList: function () {
          var vm = this
          httpCom.sceneList({}).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options['sceneList'] = res.result
            }
          })
        },
        clearMsg: function (code) {
          this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
        },
        handleIndustryInput: function (v) {
          v.length && this.clearMsg('industry')
        },
        industryValid: function (v, o, callback) {
          if (!this.demandForm.industry.length) {
            callback(o, '所属行业不能为空')
          } else {
            callback(o)
          }
        },
        urgencyValid: function (v, o, callback) {
          if (!this.demandForm.period.length) {
            callback(o, '请选择紧急程度')
          } else {
            callback(o)
          }
        },
        sceneIdValid: function (v, o, callback) {
            if(this.demandForm.sceneId === '129960266868248576' || this.demandForm.sceneId === '129960148890865664' || this.demandForm.sceneId === '129960021274972160') {
                this.$dialog.showToast('敬请期待');
                this.demandForm.sceneId = '';
                callback(o);
                return;
            }
          if (!this.demandForm.sceneId.length) {
            callback(o, '请选择应用场景')
          } else {
            callback(o)
          }
        },
        NumberValid: function (v, o, callback) {
          if (!this.demandForm.budget.length) {
            callback(o, '初步预算不能为空')
          } else if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(v.trim())) {
            callback(o, '初步预算必须为正整数或正小数')
          } else {
            callback(o)
          }
        },
        submit: function () {
          var vm = this
          $('.mianForm').validate('submitValidate', function (val) {
            if (val) {
              vm.options.diagnosis_period.some(function (period) {
                if (period.value === vm.demandForm.period) {
                  vm.demandForm.periodName = period.display
                }
              })
              vm.options.sceneList.some(function (scene) {
                if (scene.id === vm.demandForm.sceneId) {
                  vm.demandForm.sceneName = scene.sceneName
                }
              })
              sessionStorage.setItem('step1demandForm', JSON.stringify(vm.demandForm))
              document.location = '/demand-step2.html'
            }
          })
        }
      }
    });
  });
});
