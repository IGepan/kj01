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
                    // (2)已委托多个经纪人、(1)已委托经纪人、(0)未委托经纪人] 成果来源

                    "projects_source": "",//成果来源
                    "industrys_area": "",//行业领域
                    "achievements_maturity": "",//成熟度
                    "achievements_belong": "",//权属性质
                    "achievements_cooperation": "",//合作方式
                    "pricse_range": "",//意向价格
                    "businesses_plan": "",//商业计划书
                    "id": "",
                    "favoriteFlag": 0,//未收藏
                    tabs: [
                        {
                            label: '成果描述',
                            selected: true
                        },
                        {
                            label: '团队信息',
                            selected: false
                        },

                        {
                            label: '证书附件',
                            selected: false
                        },
                        {
                            label: '视频材料',
                            selected: false
                        },
                        {
                            label: '成果副图',
                            selected: false
                        },

                        {
                            label: '专利信息',
                            selected: false
                        }
                        ,

                        {
                            label: '专利信息',
                            selected: false
                        }
                    ],
                    infos: {
                        comment0: "0xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment1: "1xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment2: "2xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment3: "3xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment4: "4xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment5: "5xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment6: "5xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment7: "5xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf"
                    },

                    tabs1: [
                        {
                            label: '成果转化信息',
                            selected: true
                        },
                        {
                            label: '成果转化商业分析',
                            selected: false
                        },
                    ],
                    infos1: {
                        comment0: "0xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment1: "1xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                    },
                    "ZMProjectVO": {
                        "achievementBelong": 0,
                        "achievementMaturity": 0,
                        "agentCount": 0,
                        "budget": 0,
                        "businessFiles": "",
                        "businessPlanProportion": 0,
                        "certificateFiles": "",
                        "certificationFlag": 0,
                        "city": "",
                        "cooperationMode": 0,
                        "createTime": "2021-06-22T04:23:21.626Z",
                        "createUserId": 0,
                        "delFlag": 0,
                        "district": "",
                        "id": 0,
                        "platformOrder": 0,
                        "projectCreateTime": "2021-06-22T04:23:21.626Z",
                        "projectDes": "",
                        "projectImg": "",
                        "projectIndustryType": 0,
                        "projectType": 0,
                        "projectVideo": "",
                        "province": "",
                        "readCount": 0,
                        "saasId": 0,
                        "status": "",
                        "teamDes": "",
                        "teamFirstName": "",
                        "title": "string",
                        "topMark": 0,
                        "updateTime": "2021-06-22T04:23:21.626Z",
                        "updateUserId": 0,
                        "version": 0,
                        "zmprojectAdditionalList": [
                            {
                                "additionalService": 0,
                                "createTime": "2021-06-22T04:23:21.626Z",
                                "createUserId": 0,
                                "id": 0,
                                "projectId": 0
                            }
                        ],
                        "zmprojectKeywordsList": [
                            {
                                "createTime": "2021-06-22T04:23:21.626Z",
                                "createUserId": 0,
                                "id": 0,
                                "keyword": "string",
                                "projectId": 0
                            }
                        ],
                        "zmprojectPatentList": [
                            {
                                "appDate": "2021-06-22T04:23:21.626Z",
                                "appNo": "string",
                                "applicantName": "string",
                                "createTime": "2021-06-22T04:23:21.626Z",
                                "createUserId": 0,
                                "id": 0,
                                "inventorName": "string",
                                "patentArea": "string",
                                "patentName": "string",
                                "patentType": 0,
                                "projectId": 0,
                                "pubAbstract": "string",
                                "pubDate": "2021-06-22T04:23:21.626Z",
                                "pubNo": "string",
                                "validateStatus": 0
                            }
                        ],
                    },
                    "techDataList": [],
                    queryModel: {
                        'pageParam': {
                            'current': 1,
                            'size': 8,
                            'order': 'desc',
                            'sort': 'id',
                        },
                        'payload': {
                            projectSource: null,
                            projectIndustryType: null,
                            achievementMaturity: null,
                            achievementBelong: null,
                            cooperationMode: null,
                            budget_sectionQuery: null,
                            businessPlanProportion: null,
                        },
                    },
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
                    this.listZMProject();
                    this.initFavorite();
                    this.queryList()
                },
                methods: {
                    Pricre: function (v) {

                        if (typeof v !== 'undefined') {

                            if (v >= 10000) {
                                return (v / 10000).toFixed(2) + '万元';
                            } else {
                                return v + '元'
                            }
                        }

                    },
                    // 列表
                    queryList() {
                        let _this = this;
                        indexApi.tech_achi_list(_this.queryModel).then(function (res) {
                            if (!res.code) {
                                toast.showToast(res.message);
                                return;
                            }
                            let data = res.data;

                            // res.data.projectIndustryType
                            _this.techDataList = data.records;
                            // _this.total = data.total;
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
                        var str = aUrl.split("/").pop().replace(/(^achievementStatic)|(\.\S+$)/g,"");
                        if(id!=null){
                            this.id = id;
                        }
                        if(id==null){
                            this.id = str;
                        }
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)));
                    },
                    invitation: function () {
                        var vm = this;
                        if (this.userInfo && this.userInfo.userName) {
                            var form = {
                                "requestItemId": this.id
                            }
                            indexApi.sendInvitationsCommunicate(form).then(function (res) {
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
                    selecedTab: function (i) {
                        this.tabs.forEach(function (tab, ti) {
                            tab.selected = ti === i
                        })
                    },

                    selecedTab1: function (i) {
                        this.tabs1.forEach(function (tabs1, ti) {
                            tabs1.selected = ti === i
                        })
                    },
                    //初始化收藏按钮
                    initFavorite: function () {
                        var _this = this;
                        if (this.userInfo && this.userInfo.userName) {
                            var form =
                            {
                                "businessId": _this.id,
                                "delFlag": 0,
                                "favoriteType": 2,
                            };

                            indexApi.findZMFavoriteExistsByVO(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    this.$dialog.showToast(res.message);
                                    return;
                                }
                                //  "favoriteFlag":0,//未收藏
                                _this.favoriteFlag = res.data ? 1 : 0;
                            })
                        }


                    },
                    //收藏
                    addFavorite: function () {
                        var _this = this;
                        if (this.userInfo && this.userInfo.userName) {
                            var form =
                            {
                                "businessId": _this.id,
                                "favoriteType": 2,
                                "delFlag": _this.favoriteFlag
                            };

                            indexApi.editZMFavorite(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    this.$dialog.showToast(res.message);
                                    return;
                                }
                                //  "favoriteFlag":0,//未收藏
                                _this.favoriteFlag = _this.favoriteFlag == 0 ? 1 : 0;
                            })
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    // 技术成果列表查询

                    // 技术成果列表查询
                    listZMProject: function () {
                        var _this = this;
                        var form = {
                            "id": this.id
                        }
                        indexApi.listZMProject(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                this.$dialog.showToast(res.message);
                                return;
                            }
                            _this.ZMProjectVO = res.data;
                            console.log(_this.ZMProjectVO);
                            _this.ZMProjectVO.zMProjectAdditional = "";
                            _this.ZMProjectVO.zMProjectAdditionalList.forEach(element => {
                                _this.ZMProjectVO.zMProjectAdditional += element.additionalService + ","
                            });
                        })
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
                            "business_plan"//商业计划书
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
