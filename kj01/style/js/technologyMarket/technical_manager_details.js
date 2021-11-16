require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/technologyMarket.js', 'httpUrl', '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
        function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll, toast) {
            new Vue({
                el: '#index_box',
                data: {
                    "techAchiList": [],//技术成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 8,//每页显示条数

                    // 筛选
                    "project_source_list": [
                        { "id": "", "display": "全部", "active": false },
                        { "id": 0, "display": "未委托经纪人", "active": false },
                        { "id": 1, "display": "已委托经纪人", "active": false },
                        { "id": 2, "display": "已委托多个经纪人", "active": false },
                    ],
                    "industry_area_list": [{ "display": "全部" }],//行业领域
                    "achievement_maturity_list": [{ "display": "全部" }],//成熟度
                    "achievement_belong_list": [{ "display": "全部" }],//权属性质
                    "achievement_cooperation_list": [{ "display": "全部", active: true },],//合作方式
                    "price_range_list": [{ "display": "全部", active: true }],//意向价格
                    "business_plan_list": [{ "display": "全部", active: true }],//商业计划书
                    "achievement_demand_type_list": [{ "display": "全部", active: true }],//成果需求类型
                    // (2)已委托多个经纪人、(1)已委托经纪人、(0)未委托经纪人] 成果来源

                    "projects_source": "",//成果来源
                    "industrys_area": "",//行业领域
                    "achievements_maturity": "",//成熟度
                    "achievements_belong": "",//权属性质
                    "achievements_cooperation": "",//合作方式
                    "pricse_range": "",//意向价格
                    "businesses_plan": "",//商业计划书
                    "achievement_demand_type": "",//需求类型
                    "id": "",//经纪人id
                    "ZMTechBrokerVO": "",
                    "favoriteFlag": 0,//未收藏
                    tabs: [
                        {
                            label: '个人介绍',
                            selected: true
                        },
                        {
                            label: '用户评价',
                            selected: false
                        },
                        // {
                        //     label: '荣誉奖励',
                        //     selected: false
                        // },
                    ],
                    infos: {
                        comment0: "0xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment1: "1xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment2: "1xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                    },

                    "value2": null,
                    "colors": ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
                    "values": 3.2,
                    "valuess": 4,
                    "evaluation_pop_show": false,

                    "evaluationScore": '',
                    "evaluationDes": '',
                    "evaluationList": [],
                    "averageValue": "",
                    "dataList": [],

                    queryModel: {
                        'pageParam': {
                            'current': 1,
                            'size': 8,
                            'order': 'desc',
                            'sort': 'id',
                        },
                        'payload': {
                            industryType: null,
                            agentType: null,
                            honorLevel: null,
                            creditLevel: null,
                            capabilityLevel: null,
                        },
                    },
                    "userInfoId": "",
                    "userInfoIdSame": false,
                    paramDTOTech: {
                        "current": 1,
                        "dictCode": "string",
                        "id": 0,
                        "order": "desc",
                        "size": 6,
                        "sort": "id"
                    },
                    paramDTODemand: {
                        "current": 1,
                        "dictCode": "string",
                        "id": 0,
                        "order": "desc",
                        "size": 6,
                        "sort": "id"
                    },
                    techsReceiveList: [],
                    demandsReceiveList: [],
                    allTotalTech: 0,
                    allTotalDemand: 0,
                    createUserId: "",
                },
                components: {
                    //插入头信息
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    //插入市场
                    'tech_market_header': httpVueLoader('/style/components/tech_market_header.vue'),

                    //插入脚信息
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },

                watch: {
                    // navIndex: function (v) {
                    //     console.log(this.navIndex)
                    // },
                },
                created: function () {
                    this.initData();
                    // 技术成果列表查询
                    this.getTechAchiList();
                    this.initFavorite();
                    this.findPageQueryEvaluation();
                    this.findqueryAverageScore(this.id);//查询平均分
                    // 技术成果列表查询
                    this.queryList();
                },
                methods: {
                    // 列表
                    queryList() {
                        let vm = this;
                        indexApi.selectPageZMTechBrokerVOTrans(this.queryModel).
                            then(function (res) {
                                if (!res.code) {
                                    toast.showToast(res.message);
                                    return;
                                }
                                let data = res.data;
                                vm.dataList = data.records;
                                vm.dataList.forEach(el => {
                                    el.zMTechBrokerAdditionalList.forEach(element => {
                                        if (el.zMProjectAdditional == undefined) {
                                            el.zMProjectAdditional = '';
                                        }
                                        el.zMProjectAdditional = element.additionalService +
                                            ',';
                                    });
                                    if (el.zMProjectAdditional.length > 0) {
                                        el.zMProjectAdditional = el.zMProjectAdditional.substr(
                                            0,
                                            el.zMProjectAdditional.length - 1);
                                    }
                                });
                                vm.total = data.total;
                            });
                    },




                    // 查询平均分
                    findqueryAverageScore: function (id) {
                        var vm = this;

                        indexApi.queryAverageScore(id).then(function (res) {
                            console.log(res);
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            vm.averageValue = res.data;
                            console.log(vm.averageValue)
                        });
                    },
                    // 点击评价按钮
                    evaluateEvent: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            vm.evaluation_pop_show = true;
                        } else {
                            toast.showToast("请先登录")
                            setTimeout(function () {
                                window.location.href = '/common/login.html';
                            }, 2000)
                        }
                    },

                    // 评价
                    keep_evaluation_pop: function () {

                        var vm = this;

                        if (vm.evaluationScore < 1 || !vm.$utils.validatesEmpty(vm.evaluationScore)) {
                            // alert("请选择评分")
                            toast.showToast("请选择评分");
                            return;
                        }
                        if (!vm.$utils.validatesEmpty(vm.evaluationDes)) {
                            // alert("评价为空")
                            toast.showToast("评价为空");
                            return;
                        }

                        var form = {
                            "businessId": this.id, // 业务Id
                            "evaluationType": 1, //评价类型 1	评价技术经纪人  2	评价技术转移机构 3	评价投资机构
                            "evaluationScore": vm.evaluationScore, // 评价分数
                            "evaluationDes": vm.evaluationDes, //描述
                        }

                        indexApi.createEvaluation(form).then(function (res) {
                            console.log(res);
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            toast.showToast("评价成功！")
                            vm.evaluation_pop_show = false;
                            vm.findPageQueryEvaluation();
                        });
                    },

                    // 查询评价
                    findPageQueryEvaluation: function () {
                        var vm = this;
                        var form = {
                            "pageParam": {
                                "current": 1,
                                "order": "desc",
                                "size": 10,
                                "sort": "id"
                            },
                            "payload": this.id
                        };

                        indexApi.pageQueryEvaluation(form).then(function (res) {
                            console.log(res);
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            vm.evaluationList = res.data.records;
                        });

                    },




                    getImgPath(path) {
                        return httpUrl.fileShowUrl + '/resource/' + path;
                    },
                    initData: function () {
                        let d = new Date()
                        let dy = d.getFullYear()
                        let dm = d.getMonth()
                        let dd = d.getDate()
                        this.saasId = localStorage.getItem('saasId');
                        var id = this.$utils.getReqStr('id');
                         var aUrl=window.location.href
                         var str = aUrl.split("/").pop().replace(/(^content)|(\.\S+$)/g,"");
                        if(id!=null){
                            this.id = id;
                        }
                        if(id==null){
                            this.id = str;
                        }
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)));
                        if (this.userInfo && this.userInfo.userName) {
                            this.get_certification();
                        }
                    },


                    get_certification: function () {
                        var vm = this;
                        indexApi.get_certification().then(function (res) {
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            vm.userInfoId = res.data.info ? res.data.info.id : "";
                            if (vm.userInfoId === vm.id) {
                                vm.userInfoIdSame = true;
                            }
                        })
                    },





                    //初始化收藏按钮
                    initFavorite: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            var form =
                            {
                                "businessId": this.id,
                                "delFlag": 0,
                                "favoriteType": 3,
                            };

                            indexApi.findZMFavoriteExistsByVO(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    toast.showToast(res.message);
                                    return;
                                }
                                //  "favoriteFlag":0,//未收藏
                                vm.favoriteFlag = res.data ? 1 : 0;
                            })
                        }


                    },
                    //收藏
                    addFavorite: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            var form =
                            {
                                "businessId": this.id,
                                "favoriteType": 3,
                                "delFlag": vm.favoriteFlag
                            };

                            indexApi.editZMFavorite(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    toast.showToast(res.message);
                                    return;
                                }
                                //  "favoriteFlag":0,//未收藏
                                vm.favoriteFlag = vm.favoriteFlag == 0 ? 1 : 0;
                            })
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    sendEntrustPro: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            window.location.href = '/technologyMarket/technical_manager_entrustment.html?id=' + vm.id;

                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    sendEntrustRequirements: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            window.location.href = '/technologyMarket/technical_manager_requirements.html?id=' + vm.id;

                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    invitation: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            //通过requestType申请类型区分:向经纪人发起“投递”技术成果业务（委托成果）1 向经纪人发起“委托经纪人”寻找技术成果需求业务(委托需求) 2 向经纪人发起“邀约”业务 3
                            var form = {
                                "requestItemId": this.id,
                                "requestType": 3,
                                "requestCarryId": "",
                            }
                            indexApi.sendTechnicalManagerZMRequest(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    toast.showToast(res.message);
                                    return;
                                }
                                toast.showToast("您的邀约交流已提交，请等待审核！");
                                // alert("您的邀约交流已提交，请等待审核");
                            })
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    sendProject: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            window.location.href = '/technologyMarket/technical_manager_entrustment.html?id=' + vm.id;

                        } else {

                            window.location.href = '/common/login.html';
                        }
                    },
                    selecedTab: function (i) {
                        this.tabs.forEach(function (tab, ti) {
                            tab.selected = ti === i
                        })
                    },
                    // 技术成果列表查询
                    getTechAchiList: function () {
                        var vm = this;
                        var form = {
                            "id": this.id
                        }

                        console.log(form)
                        indexApi.listZMTechBrokerByVO(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }

                            vm.ZMTechBrokerVO = res.data;
                            vm.techReceiveList(vm.ZMTechBrokerVO.createUserId);
                            vm.demandReceiveList(vm.ZMTechBrokerVO.createUserId);
                            vm.createUserId = vm.ZMTechBrokerVO.createUserId;

                            console.log(vm.ZMTechBrokerVO);
                            vm.ZMTechBrokerVO.zMTechBrokerAdditional = "";
                            vm.ZMTechBrokerVO.zMTechBrokerAdditionalList.forEach(element => {
                                vm.ZMTechBrokerVO.zMTechBrokerAdditional += element.additionalService + ","
                            });
                            if (vm.ZMTechBrokerVO.zMTechBrokerAdditional.length > 0) {
                                vm.ZMTechBrokerVO.zMTechBrokerAdditional = vm.ZMTechBrokerVO.zMTechBrokerAdditional.substr(0, vm.ZMTechBrokerVO.zMTechBrokerAdditional.length - 1);
                            }

                        })
                    },


                    techReceiveList(id) {
                        let vm = this;
                        var form = {
                            id: id,
                            paramDTO: vm.paramDTOTech
                        }
                        indexApi.pageListTechBrokerReceivedProjectDelegation(form).then(function (res) {
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            vm.techsReceiveList = res.data.records;
                            vm.allTotalTech = res.data.total;
                        })
                    },


                    // 翻页
                    handleCurrentChange1: function (page) {
                        var vm = this;
                        console.log(page)

                        vm.paramDTOTech.current = page;
                        // 技术成果列表查询
                        var form = {
                            id: vm.createUserId,
                            paramDTO: vm.paramDTOTech
                        }
                        indexApi.pageListTechBrokerReceivedProjectDelegation(form).then(function (res) {
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            vm.techsReceiveList = res.data.records;
                            vm.allTotalTech = res.data.total;
                        })
                    },



                    demandReceiveList(id) {
                        let vm = this;
                        var form = {
                            id: id,
                            paramDTO: vm.paramDTODemand
                        }
                        indexApi.pageListTechBrokerReceivedDemandDelegation(form).then(function (res) {
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            vm.demandsReceiveList = res.data.records;
                            vm.allTotalDemand = res.data.total;
                        })
                    },

                    // 翻页
                    handleCurrentChange2: function (page) {
                        var vm = this;
                        console.log(page)

                        vm.paramDTODemand.current = page;
                        // 技术成果列表查询
                        var form = {
                            id: vm.createUserId,
                            paramDTO: vm.paramDTODemand
                        }
                        indexApi.pageListTechBrokerReceivedDemandDelegation(form).then(function (res) {
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            vm.demandsReceiveList = res.data.records;
                            vm.allTotalDemand = res.data.total;
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

                },
            })
        })
})
