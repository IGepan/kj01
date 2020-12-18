require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/market.js', 'httpUrl', '/style/js/libs/scroll.js'],
        function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll) {
            new Vue({
                el: '#index_box',
                data: {
                    userInfo:'',
                    isSeller:false,
                    activeIndex:0,
                    trainingList:[],
                    tabs1List:{
                        tabs_1:{
                            title:'',
                            description:'',
                            url:'',
                        },
                        tabs_2:{
                            title:'',
                            description:'',
                            url:'',
                        },
                        tabs_3:{
                            title:'',
                            description:'',
                            url:'',
                        },
                    },
                    navslist: [
                        {
                            label: '首页',
                            url: '/market/index.html',
                        },
                        {
                            label: '找技术',
                            url: '/service/results_list.html'
                        },
                        {
                            label: '找专利',
                            url: '/service/results_list.html?categoryCode=001.002'
                        },
                        {
                            label: '找需求',
                            url: '/service/demand_list.html'
                        },
                        {
                            label: '找供应商',
                            url: '/service/organization_list.html'
                        },
                        {
                            label: '技术经纪人',
                            url: '/market/technicalBroker.html',
                            selected: true
                        }
                    ],
                    tecSureList:[
                        {
                            label: '技术经纪人认定体系',
                            active: true,
                        },
                        {
                            label: '技术经纪人培育课程设计',
                            active: false,
                        },
                        {
                            label: '线上线下培育活动',
                            active: false,
                        },
                        {
                            label: '在线考试/认证',
                            active: false,
                        },
                    ],
                    onlineList:[
                        {
                            title:'完成线上or线下培训课程',
                            desc:'用户报名参加对应技术经纪人培训课程，并完成对应课程学习',
                            img:'/style/images/market/broker-7.jpg'
                        },
                        {
                            title:'登录考试',
                            desc:'完成培训课程的用户，登录考试系统，参加对应考试',
                            img:'/style/images/market/broker-8.jpg'
                        },
                        {
                            title:'通过后获得证书',
                            desc:'通过考试的用户，可以登录易智网查看并下载证书',
                            img:'/style/images/market/broker-9.jpg'
                        }
                    ],
                    lessonList:[
                        {
                            title:'培训体系',
                            desc:'按照培训大纲、培训基地、培训师资、培训教材 “四位一体”的国家技术转移人才培养体系建设思路，按照年度计划开展培训',
                            img:'/style/images/market/broker-7.jpg'
                        },
                        {
                            title:'分层培养',
                            desc:'国家技术转移专业人员能力等级培训按照分层次培养的原则，分为初级、中级、高级三个等级',
                            img:'/style/images/market/broker-8.jpg'
                        },
                        {
                            title:'课程设计',
                            desc:'国家技术转移专业人员能力等级培训设置为四个课程模块，分别为公共知识模块、政策法规模块、实务技能模块、能力提升模块',
                            img:'/style/images/market/broker-9.jpg'
                        }
                    ],
                    serviceToolsList:[
                        {
                            title:'技术经纪人专属服务店铺',
                            title_desc:'技术经纪人店铺系统',
                            desc:'为进入科技服务行业开展科技成果转化服务的从业者，提供在线培训、资质认证、证书查询、技术经纪人信息发布与展示等服务',
                            img:'/style/images/market/broker-11.jpg'
                        },
                        {
                            title:'科技服务总包分包协同',
                            title_desc:'技术经纪人协同服务工作台',
                            desc:'为技术经纪人开展服务提供在线订单管理、任务分派、收益分配的功能体系等服务环节的实际需求提供支撑',
                            img:'/style/images/market/broker-12.jpg'
                        }
                    ],
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'market_header': httpVueLoader('/style/components/market_header.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },
                created: function () {
                    this.getTrainingList();
                    this.getTabs1List();
                    // 当前用户信息
                    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
                    if (this.userInfo.userTypes) {
                        if(this.userInfo.userTypes.indexOf('001')>-1){
                            this.isSeller = false;
                        }else{
                            if(this.userInfo.userTypes.indexOf('002')>-1){
                                this.isSeller = true;
                            }else{
                                this.isSeller = false;
                            }
                        }
                    }
                },
                methods: {
                    handleSwitchover: function (i) {
                        var item = this.tecSureList[i]
                        this.tecSureList.forEach(function (item, si) {
                            item.active = si === i
                        });
                        this.activeIndex=i
                    },
                    bindUrl(){
                        window.location.href = '/';
                    },
                    //获取培训通知列表
                    getTrainingList: function () {
                        var vm = this
                        let params={
                            pageNum: 1,
                            pageSize: 1,
                            topicCustomTag:'04'
                        }
                        indexApi.trainingSelectByPage(params).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.trainingList = res.result.list;
                                vm.trainingList.forEach((item)=>{
                                    if(item.sponsor){
                                        item.sponsor=item.sponsor.split('ぶんかつ')[0]
                                    }
                                })

                            }
                        })
                    },
                    //技术经纪人认定体系
                    getTabs1List: function () {
                        var vm = this
                        let params={
                            format:0,
                            channelIds:116,
                            count:3,
                            first:0,
                            isApi:true,
                            orderBy:4
                        };
                        indexApi.tabs1SelectByPage(params).then(function (res) {
                            if (res.code === '200') {
                                if(res.body.length>0){
                                    vm.tabs1List.tabs_1 = res.body.length>=1?res.body[0]:''
                                    vm.tabs1List.tabs_2 = res.body.length>=2?res.body[1]:''
                                    vm.tabs1List.tabs_3 = res.body.length>=3?res.body[2]:''
                                }
                            }
                        })
                    },
                    fwsClick: function() {
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html";
                            return;
                        }
                        if (!this.isSeller) {
                            window.location.href = "/common/seller/store_agreement.html";
                        }
                    },
                    goTraningDetail(id){
                        window.location.href = "/atdetail.html?id="+id;
                    },
                    goActivity(){
                        window.open("https://www.kj01.cn/adetail.html?id=194467379300323328");
                    },
                    goTest(){
                        window.open("http://183.230.166.95:50007");
                    },
                    goClasses(){
                        window.open("https://news.kj01.cn/kj01/jsjjr/20200714/507.html");
                    }
                },
            })
        })
})
