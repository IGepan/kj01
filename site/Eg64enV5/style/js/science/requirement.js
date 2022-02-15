require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/technologyMarket.js', 'httpUrl', '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
        function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll, toast) {
            new Vue({
                el: '#index_box',
                data: {
                    breadcrumb: [
                        {
                            label: '技术需求',
                            url: './scienceRequire.html'
                        },
                        {
                            label: '详情',
                            url: './requireDetail.html'
                        },
                        {
                            label: '投递',

                        },
                    ],
                    cmsUrl: httpUrl.cmsUrl,
                    saasId: '',
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
                    "id":"",
                    "achievement_demand_type":"",//需求类型
                },
                components: {
                    'ly-toper': httpVueLoader('./style/components/toper.vue'),
                    'index-head': httpVueLoader('./style/components/header.vue'),
                    'com-footer': httpVueLoader('./style/components/com-footer.vue'),
                },

                watch: {
                    // navIndex: function (v) {
                    //     console.log(this.navIndex)
                    // },
                },
                created: function () {
                    this.initData();
                    // 技术成果列表查询
                    this.getTechAchiListPage();
                    this.find_dictionary_type_list();

                    this.project_source_list[0].active = true;//成果来源
                    this.industry_area_list[0].active = true;//行业类型
                    this.achievement_maturity_list[0].active = true;//成熟度
                    this.achievement_belong_list[0].active = true;//权属性质
                    this.achievement_cooperation_list[0].active = true;//合作方式
                    this.price_range_list[0].active = true;//意向价格
                    this.business_plan_list[0].active = true;//商业计划书
                    this.achievement_demand_type_list[0].active=true;//成果需求类型
                },
                methods: {
                    initData: function () {
                        let d = new Date()
                        let dy = d.getFullYear()
                        let dm = d.getMonth()
                        let dd = d.getDate()
                        this.saasId = localStorage.getItem('saasId');
                        var id = this.$utils.getReqStr('id');
                        this.id=id;
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)));
                    },
                    addProject: function(){
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            window.location.href = vm.$pathPrefix+'/common/usercenter/user_market_tech_achievements.html?id='+vm.id;
                        } else {
                            window.location.href = vm.$pathPrefix+'/common/login.html';
                        }
                    },
                    sendPros: function(args){
                        var vm = this;
                          var form = {
                                "requestItemId":this.id,//技术需求的id
                                "requestType":"",
                                "requestCarryId":args,//投递项目的id
                        }
                        indexApi.sendTechnicalResult(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }

                            toast.showToast("您的成果已投递，请等待审核！");
                            // alert("您的成果已投递，请等待审核！");
                        })
                    },
                       // 技术成果列表查询
                       getTechAchiListPage: function () {
                        var _this = this;
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                // "achievementBelong": 0,
                                // "achievementMaturity": 0,
                                // "budget": 0,
                                // "businessPlanProportion": 0,
                                 //"certificationFlag": 2,
                                // "city": "string",
                                // "cooperationMode": 0,
                                // "createUserId": 0,
                                 "delFlag": 0,
                                // "district": "string",
                                // "id": 0,
                                // "platformOrder": 0,
                                // "projectIndustryType": 0,
                                // "projectType": 0,
                                // "province": "string",
                                // "readCount": 0,
                                // "saasId": 0,
                                // "status": "string",
                                // "title": "string",
                                // "topMark": 0,
                                // "updateUserId": 0,
                                // "version": 0
                            }
                        }
                        indexApi.find_technology_pages(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            _this.techAchiList = datalist.records;
                            _this.allTotal = datalist.total;
                        })
                    },
                    // 成果来源
                    clickProject_source: function (item, index) {
                        var _this = this;
                        console.log(item)

                        _this.project_source_list.forEach(function (item, i) {
                            item.active = index === i; // 切换检索类型
                        });

                        _this.projects_source = item.id
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                                "achievement_demand_type":_this.achievement_demand_type,//需求类型
                            }
                        }
                        // 技术成果列表查询
                        console.log(form)
                        _this.getTechAchiListForPage(form);
                    },

                    // 点击行业领域
                    clickIndustryArea: function (item, index) {
                        var _this = this;
                        console.log(item)
                        _this.industrys_area = item.dictValue;
                        _this.industry_area_list.forEach(function (item, i) {
                            item.active = index === i; // 切换检索类型
                        });
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                            }
                        }
                        // 技术成果列表查询
                        console.log(form)
                        _this.getTechAchiListForPage(form);

                        // projectIndustryType
                    },


                    
                        // 点击行业领域
                        clickAchievementDemandType: function (item, index) {
                            var _this = this;
                            console.log(item)
                            _this.achievement_demand = item.dictValue;
                            _this.achievement_demand_type.forEach(function (item, i) {
                                item.active = index === i; // 切换检索类型
                            });
                            var form = {
                                "pageParam": {
                                    "current": _this.currentPage,
                                    "size": _this.pageSize,
                                    "order": "desc",
                                    "sort": "id",
                                },
                                "payload": {
                                    "projectSource": _this.projects_source,//成果来源
                                    "projectIndustryType": _this.industrys_area,//行业类型
                                    "achievementMaturity": _this.achievements_maturity,//成熟度
                                    "achievementBelong": _this.achievements_belong,//权属性质
                                    "cooperationMode": _this.achievements_cooperation,//合作方式
                                    "budget_sectionQuery": _this.pricse_range,//意向价格
                                    "businessPlanProportion": _this.businesses_plan,//商业计划书
                                    "demand_type":_this.achievement_demand,//需求类型
                                }
                            }
                            // 技术成果列表查询
                            console.log(form)
                            _this.getTechAchiListForPage(form);
    
                            // projectIndustryType
                        },
                    // 点击成熟度
                    clickachievementMaturity: function (item, index) {
                        var _this = this;
                        console.log(item)
                        console.log(item.dictValue)

                        _this.achievement_maturity_list.forEach(function (item, i) {
                            item.active = index === i;// 切换检索类型
                        });

                        _this.achievements_maturity = item.dictValue
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                            }
                        }
                        // 技术成果列表查询
                        console.log(form)
                        _this.getTechAchiListForPage(form);
                    },

                    // 权属性质
                    clickachievementBelong: function (item, index) {
                        var _this = this;
                        console.log(item)
                        console.log(item.dictValue)

                        _this.achievement_belong_list.forEach(function (item, i) {
                            item.active = index === i;// 切换检索类型
                        });
                        _this.achievements_belong = item.dictValue
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                            }
                        }
                        // 技术成果列表查询
                        console.log(form)
                        _this.getTechAchiListForPage(form);
                    },


                    // 合作方式
                    clickachievementCooperation: function (item, index) {
                        var _this = this;
                        console.log(item)
                        console.log(item.dictValue)

                        _this.achievement_cooperation_list.forEach(function (item, i) {
                            item.active = index === i;// 切换检索类型
                        });
                        _this.achievements_cooperation = item.dictValue
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                            }
                        }
                        // 技术成果列表查询
                        console.log(form)
                        _this.getTechAchiListForPage(form);
                    },


                    // 意向价格
                    clickpriceRange: function (item, index) {
                        var _this = this;
                        console.log(item)
                        console.log(item.dictValue)

                        _this.price_range_list.forEach(function (item, i) {
                            item.active = index === i;// 切换检索类型
                        });

                        _this.pricse_range = item.dictValue
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                            }
                        }
                        // 技术成果列表查询
                        console.log(form)
                        _this.getTechAchiListForPage(form);
                    },

                    // 商业计划书
                    clickbusinessPlan: function (item, index) {
                        var _this = this;
                        console.log(item)
                        console.log(item.dictValue)

                        _this.business_plan_list.forEach(function (item, i) {
                            item.active = index === i;// 切换检索类型
                        });
                        _this.businesses_plan = item.dictValue
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                            }
                        }
                        // 技术成果列表查询
                        console.log(form)
                        _this.getTechAchiListForPage(form);
                    },

                    // 技术成果列表查询
                    getTechAchiList: function () {
                        var _this = this;
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {

                            }
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechAchiListForPage(form);

                    },
                    // 技术成果列表查询
                    getTechAchiListForPage: function (form) {
                        var _this = this;
                        form.payload.achievementDemandType=_this.achievement_demand_type;//需求类型
                        indexApi.tech_require_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            var data = res.data
                            _this.techAchiList = data.records
                            console.log(_this.techAchiList);
                            _this.allTotal = data.total
                        })
                    },

                    // 翻页
                    handleCurrentChange: function (page) {
                        var _this = this;
                        var form = {
                            "pageParam": {
                                "current": page,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                "projectSource": _this.projects_source,//成果来源
                                "projectIndustryType": _this.industrys_area,//行业类型
                                "achievementMaturity": _this.achievements_maturity,//成熟度
                                "achievementBelong": _this.achievements_belong,//权属性质
                                "cooperationMode": _this.achievements_cooperation,//合作方式
                                "budget_sectionQuery": _this.pricse_range,//意向价格
                                "businessPlanProportion": _this.businesses_plan,//商业计划书
                            }
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechAchiListForPage(form);
                    },


                    // 查询字典
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "project_source",//成果来源
                            "industry_area",//行业类型
                            "achievement_maturity",//成熟度
                            "achievement_belong",//权属性质
                            "achievement_cooperation",//合作方式
                            "price_range",//意向价格
                            "business_plan",//商业计划书
                            "achievement_demand_type"//成果需求类型
                        ]
                        console.log(form)
                        // 技术成果列表查询
                        indexApi.dictionary_type_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }

                            var data = res.data
                            console.log(data);
                            var datalist = _this.arryGroupMatch(data)
                            for (let i = 0; i < datalist.length; i++) {
                                const element = datalist[i];
                                console.log(element);
                                if (element.dictCode === "project_source") {
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.project_source_list.push(element);
                                    });
                                } else if (element.dictCode === "industry_area") {
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.industry_area_list.push(element);
                                    });
                                } else if (element.dictCode === "achievement_maturity") {
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.achievement_maturity_list.push(element);
                                    });
                                } else if (element.dictCode === "achievement_belong") {
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.achievement_belong_list.push(element);
                                    });
                                } else if (element.dictCode === "achievement_cooperation") {
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.achievement_cooperation_list.push(element);
                                    });
                                } else if (element.dictCode === "business_plan") {
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.business_plan_list.push(element);
                                    });
                                } else if (element.dictCode === "price_range") {
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.price_range_list.push(element);
                                    });
                                }else if(element.dictCode ==="achievement_demand_type"){
                                    element.data.forEach(element => {
                                        element.active = false;
                                        _this.achievement_demand_type_list.push(element);
                                    });
                                }
                            }
                            console.log(_this.achievement_belong)
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
