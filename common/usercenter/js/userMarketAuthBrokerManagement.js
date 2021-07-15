// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, userCenterApi) {


            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));

            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,
                    "techTableListOne": [],//投递成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 10,//每页显示条数

                    "techTableListTwo": [],//邀约列表
                    "allTotal_1": 0, //总条数
                    "currentPage_1": 1,//当前页
                    "pageSize_1": 10,//每页显示条数
                    tabs: [
                        {
                            label: '经纪人管理',
                            selected: true
                        },
                        {
                            label: '经纪人审核',
                            selected: false
                        }

                    ],
                    infos: {
                        comment0: "11",
                        comment1: "22"
                    },
                    "projectId": "",
                    "tech_work_level_list": [],
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    var _this = this;

                    var urlData = _this.$utils.urlPathParameters();
                    console.log(_this.$utils.validatesEmpty(urlData))
                    _this.projectId = urlData.id


                    // _this.search_project_list_one(_this.projectId);
                    // this.search_receive_invitation_list();

                    // 查询字典
                    _this.find_dictionary_type_list();

                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
                },
                methods: {

                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href = '/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },
                    formatter(row, column) {
                        return row.address;
                    },


                    // 翻页 成果
                    handleCurrentChange: function (page) {
                        console.log(page)
                        var _this = this;
                        // console.log(page)
                        var form = {
                            "pageParam": {
                                "current": page,
                                "order": "desc",
                                "size": _this.pageSize,
                                "sort": "id"
                            },
                            "payload": {
                                "queryMark": 0,
                                "certificationFlag": 1,
                                "organId": _this.projectId,
                            },
                        }
                        console.log(form)
                        // 我接收的项目投递列表查询
                        _this.getTechTreceiveProject(form, 0);

                    },

                    handleCurrentChange_1: function (page) {
                        var _this = this;
                        console.log(page)
                        var form = {
                            "pageParam": {
                                "current": page,
                                "order": "desc",
                                "size": _this.pageSize_1,
                                "sort": "id"
                            },
                            "payload": {
                                "queryMark": 0,
                                "certificationFlag": 2,
                                "organId": _this.projectId,
                            },
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechTreceiveProject(form, 1);
                    },
                    // // 分页查询
                    // search_receive_invitation_list: function () {
                    //     var _this = this;
                    //     // console.log(page)
                    //     var form = {
                    //         // "pageParam": {
                    //         "current": _this.currentPage_1,
                    //         "size": _this.pageSize_1,
                    //         "order": "desc",
                    //         "sort": "id",
                    //         "dictCode": "string",
                    //         // },
                    //         // "payload": {
                    //         // }
                    //     }
                    //     console.log(form)
                    //     // 我接收的邀约信息
                    //     _this.getTechTreceiveProject(form);
                    // },

                    // 翻页 邀约
                    search_project_list_one: function (id) {
                        var _this = this;
                        console.log(id)
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "order": "desc",
                                "size": _this.pageSize,
                                "sort": "id"
                            },
                            "payload": {
                                "queryMark": 0,
                                "certificationFlag": 2,
                                "organId": id,
                            },
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechTreceiveProject(form, 0);

                    },

                    // 分页查询
                    search_project_list_two: function (id) {
                        var _this = this;
                        // console.log(page)
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage_1,
                                "order": "desc",
                                "size": _this.pageSize_1,
                                "sort": "id"
                            },
                            "payload": {
                                "queryMark": 0,
                                "certificationFlag": 1,
                                "organId": id,
                            },
                        }
                        console.log(form)
                        // 我接收的项目投递列表查询
                        _this.getTechTreceiveProject(form, 1);

                    },



                    // 我接收的项目投递列表查询
                    getTechTreceiveProject: function (form, type) {
                        var _this = this;
                        userCenterApi.pageZMVerifyBindVO(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist)
                            for (let i = 0; i < datalist.records.length; i++) {
                                const element = datalist.records[i];
                                // console.log(element)

                                _this.tech_work_level_list.forEach(ele => {
                                    // console.log(ele)

                                    if (element.techWorkLevel == ele.dictValue) {
                                        // console.log(ele)
                                        element.techWorkLevel_text = ele.display
                                    }
                                });

                            }

                            console.log(datalist)
                            if (type == 0) {
                                _this.techTableListOne = datalist.records;
                                _this.allTotal = datalist.total;
                                console.log(_this.techTableListOne)

                            } else {
                                _this.techTableListTwo = datalist.records;
                                _this.allTotal_1 = datalist.total;
                                console.log(_this.techTableListTwo)

                            }
                        })
                    },

                    // 查询字典
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "tech_work_level"
                        ]
                        console.log(form)
                        // 技术成果列表查询
                        userCenterApi.dictionary_type_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }

                            var data = res.data
                            var datalist = _this.arryGroupMatch(data)
                            for (let i = 0; i < datalist.length; i++) {
                                const element = datalist[i];
                                if (element.dictCode === "tech_work_level") {
                                    element.data.forEach(element => {
                                        _this.tech_work_level_list.push(element);
                                    });
                                }
                                console.log(_this.tech_work_level_list);
                            }
                            // 查询列表
                            _this.search_project_list_one(_this.projectId);

                        })
                    },

                    //数组变型得到新数组 JS数组根据字段进行分组
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



                    /////////////////////////////////


                    // 选项卡
                    selecedTab: function (i) {
                        var _this = this
                        console.log(i)
                        this.tabs.forEach(function (tab, ti) {
                            tab.selected = ti === i
                        })

                        if (i == 0) {
                            _this.search_project_list_one(_this.projectId);
                        } else {
                            _this.search_project_list_two(_this.projectId);

                        }
                    },

                    changePageView: function (item) {
                        console.log(item)
                        // alert(item.id)
                        window.open("../../technologyMarket/technical_manager_details.html?id=" + item.brokerId);
                    },

                    changePagerevoke: function (item) {
                        console.log(item)
                        var _this = this;
                        userCenterApi.removeTechBrokerBind(item.brokerId).then(function (res) {
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            console.log(res);
                            _this.$dialog.showToast("撤销技术经理人成功");
                            _this.search_project_list_one(_this.projectId);
                            _this.search_project_list_two(_this.projectId);
                        })


                    },


                    //////////// 审核/////////////

                    // 审核经纪人
                    verifyZMVerifyBindBroker: function (form) {
                        var _this = this;

                        userCenterApi.verifyZMVerifyBind(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            _this.$dialog.showToast("审核成功");
                            _this.search_project_list_one(_this.projectId);
                            _this.search_project_list_two(_this.projectId);
                        })

                    },

                    // 返回值
                    // 返回值
                    handleCommand(command) {
                        console.log(command)
                        var _this = this;
                        var type = command.num
                        // var id = command.brokerId
                        // type 1查看 2通过 3不通过
                        if (type == 1) {
                            window.open("../../technologyMarket/technical_manager_details.html?id=" + command.command.brokerId);
                        } else if (type == 2) {
                            // alert(2)
                            var form = {
                                "certificationFlag": command.num,
                                "id": command.command.id,
                            }

                            console.log(form)
                            _this.verifyZMVerifyBindBroker(form)

                        } else if (type == 3) {
                            // var form = {
                            //     "certificationFlag": command.num,
                            //     "id": command.command.id,
                            //     // "noPassReason":
                            // }
                            _this.open(command);

                        }

                    },


                    open(command) {
                        // console.log(command.command)

                        var _this = this;
                        this.$prompt('请输入审核不通过的原因', '审核', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消', inputValidator: (value) => {
                                if ("" == value || null == value) {
                                    return "请输入审核不通过的原因";
                                }
                            }, beforeClose: function (action, instance, done) {
                                if (action === 'confirm') {
                                    var form = {
                                        "certificationFlag": command.num,
                                        "id": command.command.id,
                                        "noPassReason": instance.inputValue
                                    }

                                    console.log(form)
                                    _this.verifyZMVerifyBindBroker(form)

                                    // userCenterApi.queryDetailsNative(form).then(function (res) {
                                    //     // console.log(res);
                                    //     // if (res.data == null) {
                                    //     //     _this.$dialog.showToast("该技术转移机构名称不存在，请确认后重试");
                                    //     //     return;
                                    //     // }
                                    //     userCenterApi.saveZMVerifyBind(form).then(function (res) {
                                    //         console.log(res);
                                    //         if (!res.code) {
                                    //             _this.$dialog.showToast(res.message);
                                    //             return;
                                    //         }
                                    //         _this.$dialog.showToast("提交成功,请等待技术转移机构审核");
                                    //     })
                                    // });
                                    done();
                                } else {
                                    done();
                                }
                            }
                        }).then(({ value }) => {
                            _this.search_project_list_one(_this.projectId);
                            //   this.$message({
                            //     type: 'success',
                            //     message: '你的邮箱是: ' + value
                            //   });
                        }).catch(() => {
                            //   this.$message({
                            //     type: 'info',
                            //     message: '取消输入'
                            //   });       
                        });
                    },



                    // 点击查看
                    HandleButtonView(index, item, num) {
                        // console.log(2222)
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },
                    // 点击编辑
                    HandleButtonEdit(index, item, num) {
                        // console.log(2222)
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },


                    // 点击拒绝
                    handleButtonRefuse(index, item, num) {
                        // console.log(1111)
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },
                },
            });
        });
});
