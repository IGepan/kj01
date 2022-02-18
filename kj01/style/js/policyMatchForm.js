require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpUser',
    '/style/js/api/index.js',
    '/style/js/libs/scroll.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.min.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.animate.min.js',
    '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js',
    'httpUrl', '/common/js/libs/jquery.SuperSlide.2.1.3.js',
    '/style/js/policyMatchData.js',
    'jqSelect',
    'dialog'
    ],
    function ($, Vue, dic, httpVueLoader, httpUser, indexApi, scroll, Swiper, animate, owlCarousel, httpUrl, superSlide, industryData, jqSelect, dialog) {
      new Vue({
        el: '#matchForm_box',
				components: {
					'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue'),
          'policymatch-head': httpVueLoader('/style/components/policyMatch_head.vue'),
          'ly-address-select': httpVueLoader('/common/components/addressSelect.vue'),
          'ly-select': httpVueLoader('/common/components/select.vue'),
          'ly-radio': httpVueLoader('/common/components/radio.vue'),     
          'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
          'ly-mulselect': httpVueLoader('/common/seller/components/technology/mulSelect.vue'),    
          'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),   
          'ly-select-level2': httpVueLoader('/common/components/select2level.vue'),        
				},        
				data() {
          return {
            httpUser: httpUser,
            http: httpUser,
            userInfo: {},
            formData: {
              headImg: '',
              userBasicId: '', // 用户基本信息主键
              userName: '', // 用户名
              displayName: '', // 用户昵称
              industryList: [], // 行业主键
              servicesList: [], // 服务领域主键
              identityType: '', // 身份类型(字典表:identity_type)
              country: '', //所在地区_国家(字典表:administrative_division)
              province: '', // 所在地区_省份(字典表:administrative_division)
              city: '', // 所在地区_城市(字典表:administrative_division)
              district: '', // 所在地区_区县(字典表:administrative_division
              location: '', // 详细地址
              attachmentIdUrl: '',
              qualifications: [],
              email: '', // 电子邮箱
              telephone: '', // 固定电话
              comment: '', // 简介
              realName: '', // 真实姓名
              visibleFlag: '1', // 自己可见
              birthday: '', // 出生年月
              sex: '1', // 性别(字典表：sex)
              scale: '', // 单位规模
              version: '', // 版本号
              creditCode: '', // 统一社会信用代码
              industryData_l1: '',
              industryData_l2: '',
              focusPolicy: [],
              focusPolicyName: '',
            }, 
            alias: {
              organizationNames: {
                '02': '企业名称：',
                '03': '院校名称：',
                '04': '机构名称：',
                '05': '单位名称：'
              },
              scaleNames: {
                '02': '企业规模：',
                '04': '机构规模：',
                '05': '单位规模：'
              },
              industryNames: {
                '01': '所属行业：',
                '02': '所属行业：',
                '03': '重点研究领域：',
                '04': '重点研究领域：',
                '05': '主导产业：'
              },
              servicesNames: {
                '01': '服务领域：',
                '02': '服务领域：',
                '03': '重点服务领域：',
                '04': '重点服务领域：',
                '05': '重点服务领域：'
              },
              parentUnitNames: {
                '02': '归属单位：',
                '03': '所属单位：',
                '04': '所属机构：',
                '05': '上级管理部门：'
              },
              submitFun: {
                '01': 'updatePerson',
                '02': 'updateEnterprise',
                '03': 'updateSchool',
                '04': 'updateMechanism',
                '05': 'updateDepart'
              },
              subDatas: {
                '01': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'version'],
                '02': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit',  'contacts', 'contactsPhone', 'version', 'qualifications'],
                '03': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit',  'contacts', 'contactsPhone', 'version'],
                '04': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit', 'contacts', 'contactsPhone', 'version'],
                '05': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit',  'contacts', 'contactsPhone', 'version']
              },
              organizationTypeNames: {
                '02': '企业类型：',
                '03': '办学类型：',
                '04': '机构性质：',
                '05': '单位类型：'
              },
              organizationTypeGroups: {
                '02': '1',
                '03': '2',
                '04': '4',
                '05': '3'
              },
            },
            qualification: [],         
            industryData: industryData, // 行业分类
            industryData_l2List: [],
            currentYear: '',
            lastYear: '',
            beforeLastYear: '',
            developmentInfo: {
              property1: null,
              property2: null,
              userNum: null,
              developFee: null,
              equipmentFee: null,
            },
            operatingInfo: {
              employeeNum: '',
              income1: null,
              netWorth1: null,
              income2: null,
              netWorth2: null,
              income3: null,
              netWorth3: null,  
              area: null,                          
            },
            isQualificationShow: false,
            honerList: [{
              name: '国家高新技术企业',
              value: 1,
              checked: true,
            },{
              name: '省（市）高新技术企业',
              value: 2,
              checked: false,
            },{
              name: '知识产权试点示范企业',
              value: 3,
              checked: false,
            },{
              name: '专精特新企业',
              value: 4,
              checked: false,
            },{
              name: '科技型中小（微）企业',
              value: 5,
              checked: false,
            },{
              name: '企业研发机构',
              value: 6,
              checked: false,
            },{
              name: '科技小巨人',
              value: 7,
              checked: false,
            },{
              name: '企业技术中心',
              value: 8,
              checked: false,
            },{
              name: '众创空间/孵化器',
              value: 9,
              checked: false,
            }],
            focusList: [],
            activeIndex:0,
            show:null
          }
        },
        
        created() {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          this.$httpCom.dict({ code: 'qualification' }).then(function (res) {
            if (res.code === 'rest.success') {
              console.log('请求qualification',res.result)
              this.qualification = res.result.map(function (i) {
                return Object.assign({}, i, {value: i.display, checked: false})        
              })
              this.setDefaultQualication();
            }
          }.bind(this));  
          this.industryData_l2List = this.industryData[0].children;    
          this.currentYear = new Date().getFullYear();
          this.lastYear = this.currentYear - 1;
          this.beforeLastYear = this.currentYear - 2;    
          this.initData();
          if(localStorage.getItem('developmentInfo')){
            this.developmentInfo = JSON.parse(localStorage.getItem('developmentInfo'))
          }
          if(localStorage.getItem('operatingInfo')){
            this.operatingInfo = JSON.parse(localStorage.getItem('operatingInfo'))
          } 
          this.getFocusPolicy();         
        },

        mounted: function () {
          document.getElementsByTagName('body')[0].addEventListener('click', this.bodyClick, false);
        },
        beforeDestroy: function () {
          document.getElementsByTagName('body')[0].removeEventListener('click', this.bodyClick, false);
        },
        methods: {
          initData: function (flag) {
            var vm = this;
            httpUser.detail().then(function (res) {
              var formData = $.extend({}, vm.formData, res.result);
              formData.attachmentIdUrl = formData.headImg.url;
              if(formData.qualifications) {
                formData.qualifications.length && (formData.qualifications = formData.qualifications.map(function (t) { return t.name }))
              }
              formData.headImg = formData.headImg.id;
              formData.creditCode = res.result.code;
              formData.focusPolicy = res.result.focusPolicyList ? res.result.focusPolicyList : [];
              vm.initIdentityType = formData.identityType = formData.identityType || '01'
              vm.formData = formData
              vm.initFormData = JSON.parse(JSON.stringify(formData));
              vm.setDefaultValue();
              vm.setDefaultQualication();
            });
          },  
          // 获取政策列表
          getFocusPolicy: function() {
            var vm = this;
            httpUser.getFocusPolicy().then(function(res) {
              console.log(res)
              vm.focusList = res.result;
            })
          },
          step(val){
           this.activeIndex=val
            console.log(this.activeIndex,'this.activeIndex')
          },
          setDefaultQualication() {
            var vm = this;
            vm.qualification.forEach(function(item){
              vm.formData.qualifications.forEach(function(item1){
                if(item.value == item1) {
                  item.checked = true;
                }
              })
            })
          },   
          checkQualification(item) {
            item.checked = !item.checked;
            this.formData.qualifications = this.qualification.filter(item => item.checked).map(item => item.value)
          },   
          removeQualification(index, name) {
            this.qualification.forEach(item => {
              if(item.value == name) {
                item.checked = false;
              }
            })
            this.formData.qualifications = this.qualification.filter(item => item.checked).map(item => item.value)
          },
          bodyClick(e) {
            this.isQualificationShow = false;
          },
          addressValid: function (v, o, callback) {
            var vm = this;
            setTimeout(function () {
              vm.getAddressValue();
              if (vm.formData.country == '' || vm.formData.province == '') {
                callback(o, '所在地区不能为空');
              } else {
                callback(o)
              }
            }, 800)
          },
          // 特殊处理默认值
          setDefaultValue: function () {
            this.$nextTick(function () {
              var data = this.formData
              var addressArr = this.$refs.addressRef;
              var navRadioRef = null
              var vm = this
              if (addressArr) {
                data.country ? addressArr.setValues([data.country, data.province, data.city, data.district]) : addressArr.reset();
              }
              // 初始化成立日期
              (data.identityType === '03' || data.identityType === '05') && laydate.render({
                elem: '#establishDate', //指定元素
                value: data.establishDate,
                done: function (val) { //选择日期完毕的回调
                  vm.formData.establishDate = val;
                }
              })
              // 初始化生日
              // data.identityType === '01' && laydate.render({
              //   elem: '#birthday', //指定元素
              //   value: data.birthday,
              //   done: function (val) { //选择日期完毕的回调
              //     vm.formData.birthday = val;
              //   },
              // })
              // 审核失败、审核中不让切换
              if (data.certificationFlag === '02' || data.certificationFlag === '03') {
                navRadioRef = this.$refs.navRef;
                if (navRadioRef) {
                  navRadioRef.setDisabeld();
                }
              }
              // 清除验证
              setTimeout(function () {
                // $('.valiform').validate('clear');
              }, 100)
            })
          },  
          numCheck(A) {
            if (A.value != "" && A.value.substr(0, 1) == ".") { A.value = "" } A.value = A.value.replace(/[^\d.]/g, "");
            A.value = A.value.replace(/^\./g, "");
            A.value = A.value.replace(/\.{2,}/g, ".");
            A.value = A.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            A.value = A.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
            if (A.value.indexOf(".") < 0 && A.value != "") { if (A.value.substr(0, 1) == "0" && A.value.length == 2) { A.value = A.value.substr(1, A.value.length) } }
          },
          clearMsg: function (code) {
            this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
          },            
          handleIndustryInput: function (v) {
            v.length && this.clearMsg('industry')
          },
          handleServicesInput: function (v) {
            v.length && this.clearMsg('services')
          },     
          handleIndustryChange(e, level) {
            let val = $(e.target).val();
            let index = 0;
            if(level == 1) {
              index = this.industryData.findIndex(item => item.id == val);
              this.industryData_l2List = this.industryData[index].children;
              this.formData.industryData_l1 = this.industryData[index].id;
            }
            if(level == 2) {
              index = this.industryData_l2List.findIndex(item => item.id == val);
              this.formData.industryData_l2 = this.industryData_l2List[index].id;
            }
          },
          getHonerInfo() {
            var obj = document.getElementsByName("honorProjectU");
            var check_arr = [];
            for (var i = 0; i < obj.length; i++) {
              if (obj[i].checked){
                check_arr.push(obj[i].value);
              }
            }
            return check_arr;
          },
          saveAllData() {
            let honerInfo = this.getHonerInfo();
            console.log(this.formData, this.developmentInfo, this.operatingInfo, honerInfo);

          },
          getPlocyParams: function() {
            var params = {};
            var data = this.formData;
            params.name = data.organizationName;
            params.socialCreditCode = data.creditCode;
            params.registeredTime = data.establishDate;
            params.industry = data.industryList ? data.industryList.map(item => item.name).join(',') : '';
            params.city = data.country + ','+ data.province + ',' + data.city + ','+ data.district;
            params.focusPolicy = data.focusPolicy ? data.focusPolicy.map(item => item.name).join(',') : '';
            var qualificationtext = data.qualifications;
            if(data.qualifications.length > 0) {
              // this.qualification.forEach(item => {
              //   data.qualifications.forEach(citem => {
              //     if(item.id == citem) {
              //       qualificationtext.push(item.display)
              //     }
              //   })
              // })
              console.log(qualificationtext)
              params.enterpriseQualification = qualificationtext.join();
            }else {
              params.enterpriseQualification = '';
            }
            params.enterpriseType = data.organizationTypeDisplay;
            // 研发情况
            params.oneIntellectualPropertyNum = this.developmentInfo.property1;
            params.twoIntellectualPropertyNum = this.developmentInfo.property2;
            params.researchPeopleNum = this.developmentInfo.userNum;
            params.researchMoney = this.developmentInfo.developFee;
            params.researchEquipmentMoney = this.developmentInfo.equipmentFee;
            // 经营情况
            params.employeesNum = this.operatingInfo.employeeNum;
            params.oneIncome = this.operatingInfo.income1;
            params.oneAssets = this.operatingInfo.netWorth1;
            params.twoIncome = this.operatingInfo.income2;
            params.twoAssets = this.operatingInfo.netWorth2;
            params.threeIncome = this.operatingInfo.income3;
            params.threeAssets = this.operatingInfo.netWorth3;
            params.area = this.operatingInfo.area;
            
            return params;
          },   
          verifyRequired(params) {
            var _this = this;
            if (!_this.$utils.validatesEmpty(params.name)) {
              this.$notify.error({
                title: '提示',
                message: '企业名称必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.socialCreditCode)) {
              this.$notify.error({
                title: '提示',
                message: '统一社会信用代码必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("统一社会信用代码必填");
              return false;
            }
            // if (!_this.$utils.validatesEmpty(params.registeredTime)) {
            //   this.$notify.error({
            //     title: '提示',
            //     message: '注册时间必填！',
            //     type: 'warning'
            //   });
            //   // _this.$dialog.showToast("注册时间必填");
            //   return false;
            // }
            if (!_this.$utils.validatesEmpty(params.industry)) {
              this.$notify.error({
                title: '提示',
                message: '行业分类必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("行业分类必填");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.city)) {
              this.$notify.error({
                title: '提示',
                message: '所在地必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("所在地必填");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.enterpriseQualification)) {
              this.$notify.error({
                title: '提示',
                message: '企业资质必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("企业资质必填");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.enterpriseType)) {
              this.$notify.error({
                title: '提示',
                message: '企业类型必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("企业类型必填");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.researchMoney)) {
              this.$notify.error({
                title: '提示',
                message: '年研发费用必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("企业类型必填");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.employeesNum)) {
              this.$notify.error({
                title: '提示',
                message: '在职员工数量必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("企业类型必填");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.twoIncome)) {
              this.$notify.error({
                title: '提示',
                message: '年主营业务收入必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("企业类型必填");
              return false;
            }
            if (!_this.$utils.validatesEmpty(params.area)) {
              this.$notify.error({
                title: '提示',
                message: '经营场地面积必填！',
                type: 'warning'
              });
              // _this.$dialog.showToast("企业类型必填");
              return false;
            }
            return true;
           // var keys = ['name', 'socialCreditCode', 'registeredTime', 'industry', 'city', 'enterpriseQualification', 'enterpriseType', 'researchMoney', 'employeesNum', 'twoIncome', 'area'];
           // var flag = false;
           // for (const key in params) {
           //  for (let index = 0; index < keys.length; index++) {
           //    if(key == keys[index] && !params[key]) {
           //      console.log(key, params[key])
           //      flag = true;
           //    }
           //  }
           // }
           // return flag;
          },
          saveParams() {
            localStorage.setItem('developmentInfo', JSON.stringify(this.developmentInfo))
            localStorage.setItem('operatingInfo', JSON.stringify(this.operatingInfo))
          },
          toLast1(val){
            this.saveAllData();
            this.saveParams();
            this.activeIndex=val-1
          },
          toLast2(val){
            this.saveAllData();
            this.saveParams();
            this.activeIndex=val+1
          },
          toLastStep() {
              this.saveAllData();
              this.saveParams();
              location.href = '/policyMatchLogin.html'
          },
          toResult() {
            this.saveAllData();
            this.saveParams();
            var params = this.getPlocyParams();
            // var flag = this.verifyRequired(params);
            // console.log('flag', flag)
            if(this.verifyRequired(params)) {
              localStorage.setItem('policyMatchParams', JSON.stringify(params));
              location.href = '/policyMatchResult.html?type=1'
            }
            // if(flag) {
            //   this.$dialog.showToast('请填写必填信息');
            //   return;
            // }
            // localStorage.setItem('policyMatchParams', JSON.stringify(params));
            // location.href = '/policyMatchResult.html'
          },                     
        }
      })
    })
});
