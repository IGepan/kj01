//   JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', 'ELEMENT', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, ELEMENT, userCenterApi) {


            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            Vue.component('vue-ueditor-wrap', VueUeditorWrap);
            Vue.component('user-tech-menu', httpVueLoader('/common/components/userTechMenu.vue'));

            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,

                    ueditorConfig: {
                        initialFrameHeight: 180,
                        maximumWords: 5000
                    },
                    //   附件上传
                    fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
                    uploadData: {
                        system: 'ts'
                    },
                    business_files2: [],	  //  	附件	是	[array]


                    "patentForm": {
                        "patentTransactionType": "",
                        "budget": "",
                        "expectRequiredSite": "",
                        "intentionCooperationUnit": "",
                        "otherRequire": "",
                        "existingCooperationUnit": "",
                        "formCooperation": "",
                        "specificProducts": "",
                        "expectedCost": "",
                        "expectedPrice": "",
                        "expectedMarketCapacity": "",
                        "expectedMarketShare": "",
                        "expectedProductionCycle": "",
                        "industryTeamDes": "",
                        "marketingStrategy": "",
                        "financingAmountPurpose": "",
                        "projectionsFiveYears": "",
                        "expectedSocialBenefits": "",

                    },   //   对象集合
                    "patent_transaction_type_list": [], //意向转化方式
                    "project_patent_type": true, //

                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },

                watch: {

                },

                created: function () {
                    var _this = this;

                    var urlData = _this.$utils.urlPathParameters();
                    _this.proId = urlData.proId; // 项目id
                    console.log(urlData)



                    this.find_dictionary_type_list();

                },
                components: {
                    'vue-ueditor-wrap': VueUeditorWrap,
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue')
                },
                methods: {


                    // 班级报名
                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href =this.$pathPrefix+ '/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },


                    // 查询详情
                    findProjectPatentDetails: function (params) {
                        var _this = this;
                        userCenterApi.find_technology_details(params).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            res.data.patentTransactionType = res.data.patentTransactionType + "";
                            _this.patentForm = res.data;
                            console.log(_this.patentForm)

                        })
                    },



                    //   提交
                    save_tech_project_patent: function (params) {
                        var _this = this;

                        _this.project_patent_type = true;

                        //_this.emptyInputProject();   //   非空验证

                        var form = _this.patentForm;
                        form.businessFiles = _this.business_files2[0] ? _this.business_files2[0].id : "";

                        form.id = _this.proId;
                        console.log(form)

                        if (_this.emptyInputProject(form)) {
                            userCenterApi.save_technology_convert(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast("提交成功");
                                setTimeout(function () {
                                    window.location.href =this.$pathPrefix+ "/common/usercenter/user_market_tech_achievements.html";
                                }, 2000)
                            })
                        }
                    },


                    // 非空验证
                    emptyInputProject: function form(form) {
                        var _this = this;

                        if (!_this.$utils.validatesEmpty(form.patentTransactionType)) {
                            _this.$dialog.showToast("意向转让方式必填");
                            return false;
                        }

                        return true;
                    },


                    handleUploadSuccess2: function (successInfo) {
                        this.business_files2 = [];
                        this.business_files2.push(successInfo.data)
                    },
                    handleDelFile2: function (i) {
                        this.business_files2.splice(i, 1)
                    },




                    //   查询字典
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "patent_transaction_type",  //  专业类型
                        ]
                        console.log(form)
                        //   技术成果列表查询
                        userCenterApi.dictionary_type_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }

                            var data = res.data
                            console.log(data);
                            var datalist = _this.arryGroupMatch(data)
                            for (let i = 0; i < datalist.length; i++) {
                                const element = datalist[i];
                                //   console.log(element);
                                //    else
                                if (element.dictCode === "patent_transaction_type") {
                                    element.data.forEach(element => {
                                        _this.patent_transaction_type_list.push(element);
                                    });
                                }
                            }

                            _this.findProjectPatentDetails(_this.proId);  //
                            console.log(_this.patent_transaction_type_list)


                        })
                    },

                    //  数组变型得到新数组 JS数组根据字段进行分组
                    arryGroupMatch(arr) {
                        var map = {}
                        var dest = []
                        for (var i = 0; i < arr.length; i++) {
                            var ai = arr[i]
                            if (!map[ai.dictCode]) {
                                dest.push({
                                    dictCode: ai.dictCode,
                                    data: [ai]
                                })
                                map[ai.dictCode] = ai
                            } else {
                                for (var j = 0; j < dest.length; j++) {
                                    var dj = dest[j]
                                    if (dj.dictCode === ai.dictCode) {
                                        dj.data.push(ai)
                                        break
                                    }
                                }
                            }
                        }
                        return dest
                    },
                },
            });
        });
});
