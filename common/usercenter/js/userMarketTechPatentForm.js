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
                        "appNo": "",
                        "applicantName": "",
                        "id": "",
                        "inventorName": "",
                        "patentArea": "",
                        "patentName": "",
                        "patentType": "1",
                        "pubAbstract": "",
                        "pubDate": "",
                        "pubNo": "",
                    },   //   对象集合
                    "patent_type_list": [],   //   专利类型
                    "patent_type": "",   //  专利类型
                    "project_patent_type": true,   //   默认 若未填写
                    "proId": "", // 技术成果id
                    "id": "", // 专利id
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },

                watch: {

                },
                mounted: function () {
                    var now = new Date()
                    laydate.render({
                        elem: '#appDate',
                        value: this.patentForm.appDate,
                        format: 'yyyy-MM-dd',
                        startkey: 'appDate',
                        // min: '' + now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate(),
                        vm: this,
                        done: function (value, date, appDate) { //选择日期完毕的回调
                            this.vm.patentForm[this.startkey] = value;
                        }
                    })
                    laydate.render({
                        elem: '#pubDate',
                        value: this.patentForm.pubDate,
                        format: 'yyyy-MM-dd',
                        startkey: 'pubDate',
                        // min: '' + now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate(),
                        vm: this,
                        done: function (value, date, pubDate) { //选择日期完毕的回调
                            this.vm.patentForm[this.startkey] = value;
                        }
                    })
                },
                created: function () {
                    var _this = this;
                    this.find_dictionary_type_list();
                    var urlData = _this.$utils.urlPathParameters();
                    console.log(urlData)
                    _this.proId = urlData.proId; // 项目id

                    if (_this.$utils.validatesEmpty(urlData.id)) {
                        // 专利id
                        _this.id = urlData.id;
                        // 查询详情
                        _this.findProjectPatentDetails(_this.id);  //

                    }


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
                            window.location.href = '/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },


                    // 查询详情
                    findProjectPatentDetails: function (params) {
                        var _this = this;
                        userCenterApi.find_project_patent_details(params).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            res.data.patentType = res.data.patentType + "";
                            _this.patentForm = res.data;
                            console.log(_this.patentForm)
                            if (_this.patentForm.appDate.length > 11) {
                                _this.patentForm.appDate = _this.patentForm.appDate.slice(0, -9)
                            }

                            if (_this.patentForm.pubDate.length > 11) {
                                _this.patentForm.pubDate = _this.patentForm.pubDate.slice(0, -9)
                            }

                            console.log(_this.patentForm.appDate)
                            console.log(_this.patentForm.patentType)

                        })
                    },



                    //   提交
                    save_tech_project_patent: function (params) {
                        var _this = this;

                        var form = _this.patentForm;
                        form.projectId = _this.proId;

                        if (_this.emptyInputProject(form)) {
                            userCenterApi.save_ZMProject_patent(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }

                                _this.$dialog.showToast("提交成功");

                                setTimeout(function () {
                                    window.location.href = "/common/usercenter/user_market_tech_patent_list.html?id=" + _this.proId;
                                }, 2000)
                            })
                        }
                    },

                    //   非空验证
                    emptyInputProject: function (form) {
                        var _this = this;

                        if (!_this.$utils.validatesEmpty(form.patentType)) {
                            _this.$dialog.showToast("专利类型必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.patentName)) {
                            _this.$dialog.showToast("专利名称必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.appNo)) {
                            _this.$dialog.showToast("申请号必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.pubNo)) {
                            _this.$dialog.showToast("公布(公告)号必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.applicantName)) {
                            _this.$dialog.showToast("专利权人必填");
                            return false;
                        }

                        return true;
                    },



                    //   查询字典
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "patent_type",  //  专业类型
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
                                if (element.dictCode === "patent_type") {
                                    element.data.forEach(element => {
                                        _this.patent_type_list.push(element);
                                    });
                                }
                            }
                            console.log(_this.patent_type_list)


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
