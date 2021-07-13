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
                    "id":"",
                    "achievement_demand_type":"",//需求类型
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
                    this.getTechAchiListPage();
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
                            window.location.href = '/common/usercenter/user_market_tech_achievements.html?id='+vm.id;
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    sendPros: function(args){
                        var vm = this;
                            //通过requestType申请类型区分:向经纪人发起“投递”技术成果业务（委托成果）1 向经纪人发起“委托经纪人”寻找技术成果需求业务(委托需求) 2 向经纪人发起“邀约”业务 3
                            var form = {
                                "requestItemId":this.id,
                                "requestType":1,
                                "requestCarryId":args,
                        }
                        indexApi.sendTechnicalManagerZMRequest(form).then(function (res) {
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
