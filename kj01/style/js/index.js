// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader',
            '/style/js/api/index.js',
            '/style/js/libs/scroll.js',
            '/style/js/libs/swiper-5.4.1/js/swiper.min.js',
            '/style/js/libs/swiper-5.4.1/js/swiper.animate.min.js',
            '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js',
            'httpUrl', '/common/js/libs/jquery.SuperSlide.2.1.3.js'],
        function ($, Vue, dic, httpVueLoader, indexApi, scroll, Swiper, animate, owlCarousel, httpUrl, superSlide) {
            new Vue({
                el: '#index_box',
                data: {
                    cmsUrl: httpUrl.cmsUrl,
                    mailServiceTypeList: [],
                    // goodFormData: {
                    //     orderBy: 'homePageFlag desc',
                    //     pageSize: 2,
                    //     type: ''
                    // },
					knowledgeTypeList:[],
					incubationTypeList: [],
					designTypeList: [],
					checkTypeList: [],
					propertyTypeList: [],
					technologyTypeList: [],
					transferTypeList: [],
                    countNumbers: [
                        {
                            label: '创新活动',
                            num: 0,
                            unit: '场',
                            url: '/alist.html'
                        },
                        {
                            label: '服务机构',
                            num: 1520,
                            unit: '家',
                            url: '/service/organization_list.html'
                        },
                        {
                            label: '技术成果',
                            num: 25683,
                            unit: '项',
                            url: '/service/results_list.html'
                        },
                        {
                            label: '科技创新政策',
                            num: 5410,
                            unit: '条',
                            url: '/polist.html'
                        },
                        {
                            label: '累计服务企业',
                            num: 15378,
                            unit: '家',
                            url: ''
                        },
                        {
                            label: '技术交易额',
                            num: 266.17,
                            unit: '亿元',
                            url: 'http://47.108.80.38:8309'
                        }
                    ],
                    honorList: [
                        {id: 1, name: '国际技术转移中心'},
                        {id: 2, name: '国家技术转移示范机构'},
                        {id: 3, name: '国际科技合作基地'},
                        {id: 4, name: '国家专利技术展示交易中心'},
                        {id: 5, name: '重庆技术产权交易中心'},
                        {id: 6, name: '重庆技术转移示范机构'},
                        {id: 7, name: '重庆众创空间'},
                    ],
                    activeHot: [],
                    // activeList:[],
                    ptabsNavs: [
                        // {
                        // 	label: '政策速递',
                        // 	active: 1,
                        // 	url: '/polist.html'
                        // },
                        {
                            label: '政策惠',
                            active: 1,
                            url: '/polist.html'
                        }
                        //平台动态-暂时隐藏
                        /*{
                            label: '平台动态',
                            active: 0,
                            url: '/about.html?activeIndex=1'
                        }*/
                    ],
                    expressList: [],
                    newsList_policy: [],
                    newsList_platform: [],
                    policyList: [],
                    answerList: [],
                    helperList: [],
                    server: [
                        {
                            tj: 1,
                            img: '/style/images/index/pinpai_9.png',
                            name: '科技社团',
                            subTips: '重庆市科协-科技社团',
                            url: 'http://www.kjy01.com/index.php?app=default&act=castic_list&page=1',
                            subName: '推荐社团',
                            subItems: [
                                {
                                    name: '机械工程',
                                    icon: 'icon-jixie',
                                    url: 'http://www.kjy01.com/index.php?app=default&act=castic_detail&id=43'
                                },
                                {
                                    name: '汽车工程',
                                    icon: 'icon-hetong',
                                    url: 'http://www.kjy01.com/index.php?app=default&act=castic_detail&id=26'
                                },
                                {
                                    name: '工业设计',
                                    icon: 'icon-gongyesheji',
                                    url: 'http://www.kjy01.com/index.php?app=default&act=castic_detail&id=21'
                                }
                            ],
                            infoItems: [
                                {
                                    shopName: '重庆市自动化与仪器仪表学会',
                                    shopIndexUrl: 'http://www.kjy01.com/index.php?app=default&act=castic_detail&id=33',
                                    shopLogo: '/style/images/index/pinpai_17.png'
                                },
                                {
                                    shopName: '重庆市工程师学会',
                                    shopIndexUrl: 'http://www.kjy01.com/index.php?app=default&act=castic_detail&id=51',
                                    shopLogo: '/style/images/index/pinpai_16.png'
                                },
                                {
                                    shopName: '重庆市环境科学学会',
                                    shopIndexUrl: 'http://www.kjy01.com/index.php?app=default&act=castic_detail&id=4',
                                    shopLogo: '/style/images/index/pinpai_15.png'
                                }
                            ]
                        },
                        {
                            img: '/style/images/index/pinpai_10.png',
                            name: '孵化服务',
                            subTips: '激发市场活力，释放双创动能',
                            url: 'http://www.cqsczt.com/scsite/index/index.html',
                            subName: '推荐服务',
                            subItems: [
                                {
                                    name: '双创地图',
                                    icon: 'icon-ditu-copy',
                                    url: 'http://www.cqsczt.com/scsite/map/index.html'
                                },
                                {
                                    name: '双创专家',
                                    icon: 'icon-zhuanjia-copy',
                                    url: 'http://www.cqsczt.com/scsite/expert/index.html'
                                },
                                {
                                    name: '双创载体',
                                    icon: 'icon-dengpao-copy',
                                    url: 'http://www.cqsczt.com/scsite/almanac/index.html'
                                }
                            ],
                            infoItems: [
                                {
                                    shopName: '双创专家',
                                    shopIndexUrl: 'http://www.cqsczt.com/scsite/expert/index.html',
                                    shopLogo: '/style/images/index/pinpai_18.png'
                                },
                                {
                                    shopName: '科技企业',
                                    shopIndexUrl: 'http://www.cqsczt.com/scsite/science/index.html',
                                    shopLogo: '/style/images/index/pinpai_19.png'
                                },
                                {
                                    shopName: '双创培训',
                                    shopIndexUrl: 'http://www.cqsczt.com/scsite/video/index.html',
                                    shopLogo: '/style/images/index/pinpai_20.png'
                                }
                            ]
                        },
                        {
                            img: '/style/images/index/pinpai_11.png',
                            name: '研发设计',
                            subTips: '协同创新，提升企业研发水平',
                            url: "/service/organization_list.html?stype=010",
                            subName: '推荐服务商',
                            subItems: [
                                {
                                    name: '工业设计',
                                    icon: 'icon-gongyesheji',
                                    url: '/service/resource_list.html?stype=010&sctype=122436690265508871'
                                },
                                {
                                    name: '软件开发',
                                    icon: 'icon-ruanjian',
                                    url: '/service/resource_list.html?stype=010&sctype=135019060147519660'
                                },
                                {
                                    name: '硬件开发',
                                    icon: 'icon-yingjian',
                                    url: '/service/resource_list.html?stype=010&sctype=122436690378755081'
                                }
                            ],
                            infoItems: []
                        },
                        {
                            img: '/style/images/index/pinpai_12.png',
                            name: '检验检测',
                            subTips: '专业服务，流程简洁、准确权威',
                            url: "/service/organization_list.html?stype=009",
                            subName: '推荐服务商',
                            subItems: [
                                {
                                    name: '工程分析',
                                    icon: 'icon-gongchengfenxi',
                                    url: '/service/resource_list.html?stype=009&sctype=122436690324229128'
                                },
                                {
                                    name: '机械检测',
                                    icon: 'icon-jiance',
                                    url: '/service/resource_list.html?stype=009&sctype=135019060319486127'
                                },
                                {
                                    name: '电气检测',
                                    icon: 'icon-dianqidianli',
                                    url: '/service/resource_list.html?stype=009&sctype=122436690642996238'
                                }
                            ],
                            infoItems: []
                        },
                        {
                            img: '/style/images/index/pinpai_13.png',
                            name: '知识产权',
                            subTips: '知识产权确权、维权、用权管理与咨询',
                            url: "/service/organization_list.html?stype=002",
                            subName: '推荐服务商',
                            subItems: [
                                {
                                    name: '知产代理',
                                    icon: 'icon-zhichandaili',
                                    url: '/service/resource_list.html?stype=002&sctype=122436693134412849'
                                },
                                {
                                    name: '知产交易',
                                    icon: 'icon-zhichanfuwu-copy',
                                    url: '/service/resource_list.html?stype=002&sctype=122436693197327410'
                                },
                                {
                                    name: '管理咨询',
                                    icon: 'icon-zixun',
                                    url: ''
                                }
                            ],
                            infoItems: []
                        },
                        {
                            img: '/style/images/index/pinpai_14.png',
                            name: '科技智库',
                            subTips: '科技创新，智库共享',
                            url: "http://www.castss.com",
                            subName: '推荐服务',
                            subItems: [
                                {
                                    name: '研究成果',
                                    icon: 'icon-jishu',
                                    url: 'http://www.castss.com/pubview/list.aspx?HfSubId=201606141548124268054c8d4d92064'
                                },
                                {
                                    name: '智库专报',
                                    icon: 'icon-kucun-copy',
                                    url: 'http://www.castss.com/sp/subchannel_ai_list.aspx?HfSubId=20160615162409140959743acf34907'
                                },
                                {
                                    name: '科技查新',
                                    icon: 'icon-keji1-copy',
                                    url: 'http://www.castss.com/about_us/index.aspx?HfId=201705230825075379658274d25db99'
                                }
                            ],
                            infoItems: [
                                {
                                    shopName: '重点专题',
                                    shopIndexUrl: 'http://www.castss.com/pubview/list.aspx?HfSubId=20170907095617028792388fc39bec7',
                                    shopLogo: '/style/images/index/pinpai_21.png'
                                },
                                {
                                    shopName: '科技参考',
                                    shopIndexUrl: 'http://www.castss.com/sp/subchannel_list.aspx?HfSubId=201606141605149772919c9ec7e715b',
                                    shopLogo: '/style/images/index/pinpai_22.png'
                                },
                                {
                                    shopName: '专家观点',
                                    shopIndexUrl: 'http://www.castss.com/pubview/list.aspx?HfSubId=20170907095617028792388fc39bec7',
                                    shopLogo: '/style/images/index/pinpai_23.png'
                                }
                            ]
                        },
                    ],
                    sources: [
                        {
                            name: '科技成果',
                            subName: '海量成果资源供您搜索',
                            list: [
                                {
                                    name: '专利成果',
                                    number: '2000万+',
                                    desc: ['发明专利、实用新型、', '外观设计'],
                                    url: '/resources/patent_list.html'
                                },
                                {
                                    name: '文献资源',
                                    number: '3000万+',
                                    desc: ['跨平台科技文献资源共享'],
                                    url: '/resources/literature_list.html'
                                }
                            ]
                        },
                        {
                            name: '科技人才',
                            subName: '汇聚行业精英、专家人才',
                            list: [
                                {
                                    name: '高层次人才',
                                    number: '10000万+',
                                    desc: [],
                                    url: '/resources/talents_list.html?type=高层次人才'
                                },
                                {
                                    name: '学术型人才',
                                    number: '2000万+',
                                    desc: [],
                                    url: '/resources/talents_list.html?type=学术性人才'
                                },
                                {
                                    name: '科技名人堂',
                                    number: '',
                                    desc: ['名家 · 名师 · 名匠'],
                                    url: ''
                                }
                            ]
                        },
                        {
                            name: '研发机构',
                            subName: '汇聚全市科研机构资源',
                            list: [
                                {
                                    name: '重点实验室',
                                    number: '96',
                                    desc: [],
                                    url: '/resources/organization_list.html?orgType=重点实验室'
                                },
                                {
                                    name: '企业工程技术中心',
                                    number: '134',
                                    desc: [],
                                    url: '/resources/organization_list.html?orgType=企业工程技术研究中心'
                                },
                                {
                                    name: '产业技术研究院',
                                    number: '12',
                                    desc: [],
                                    url: '/resources/organization_list.html?orgType=产业技术研究院'
                                }
                            ]
                        },
                        {
                            name: '科技企业',
                            subName: '汇聚全市科技企业资源',
                            list: [
                                {
                                    name: '高新技术企业',
                                    number: '3000+',
                                    desc: [],
                                    url: '/resources/enterprise_list.html?tags=highTechFirm'
                                },
                                {
                                    name: '科技型企业',
                                    number: '20000+',
                                    desc: [],
                                    url: '/resources/enterprise_list.html?tags=middleMinFirm'
                                },
                                {
                                    name: '独角兽/牛羚/蹬羚',
                                    number: '600+',
                                    desc: [],
                                    url: '/resources/enterprise_list.html?tags=gnuFirm'
                                }
                            ]
                        },
                        // {
                        //     name: '仪器设备',
                        //     subName: '为您提供高性能仪器设备',
                        //     list: [
                        //         {
                        //             name: '分析仪器',
                        //             number: '3449',
                        //             desc: [],
                        //             url: '/resources/equipment_list.html?equipmentTypeId=8'
                        //         },
                        //         {
                        //             name: '计量仪器',
                        //             number: '190',
                        //             desc: [],
                        //             url: '/resources/equipment_list.html?equipmentTypeId=1'
                        //         },
                        //         {
                        //             name: '电子测量仪器',
                        //             number: '414',
                        //             desc: [],
                        //             url: '/resources/equipment_list.html?equipmentTypeId=3'
                        //         }
                        //     ]
                        // },
                    ],
                    lvmengList: [
                        {
                            name: '找服务',
                            subtext: '一站式企业综合服务共享平台',
                            icon: 'icon-zhengwufuwuziyuanku_huaban',
                            url: 'https://www.qiyekexie.com/portal/zkx/6/techServiceList.action'
                        },
                        {
                            name: '找设备',
                            subtext: '仪器预约、检测服务',
                            icon: 'icon-shebei-copy',
                            url: 'https://www.qiyekexie.com/portal/zkx/6/equipment/instrumentList.action'
                        },
                        {
                            name: '找专家',
                            subtext: '行业专家快速连线解决创新难题',
                            icon: 'icon-jingjiren-copy',
                            url: 'https://www.qiyekexie.com/portal/zkx/6/expert/expertList.action'
                        },
                        {
                            name: '找技术',
                            subtext: '科技成果、技术需求',
                            icon: 'icon-keji',
                            url: 'https://www.qiyekexie.com/portal/zkx/6/achieveList.action'
                        },
                        {
                            name: '找资金',
                            subtext: '投资机构、中介机构、精选资金',
                            icon: 'icon-cunqianguan',
                            url: 'https://www.qiyekexie.com/portal/zkx/6/institutionList.action?type=1'
                        },
                        {
                            name: '找政策',
                            subtext: '更多政策资源',
                            icon: 'icon-zhengcejiedu1',
                            url: 'https://www.qiyekexie.com/portal/zkx/6/policy/policyList.action'
                        },
                    ],
                    pinpai_list: [],
                    activityTabs: [
                        {
                            label: '企业学堂',
                            active: true,
                            activeType: '218340665862391473',
                            sortType: "01",
                            tabList:[
                                {
                                label: '政策直播间',
                                active: true,
                                activeType: '218340665870780082',
                                sortType: "01",
                            },
                                {
                                    label: '创新课堂',
                                    active: false,
                                    activeType: '218340665883362995',
                                    sortType: "02",
                                }, {
                                    label: '管理学院',
                                    active: false,
                                    activeType: '218340665891751604',
                                    sortType: "01",
                                },]
                        },
                        {
                            label: '技术转移',
                            active: false,
                            activeType: '218340665862395555',
                            sortType: "01",
                            tabList: [
                                {
                                    label: '易智成果汇',
                                    active: false,
                                    activeType: '218340665862395556',
                                    sortType: "01",
                                },
                                {
                                    label: '易智人才汇',
                                    active: false,
                                    activeType: '218340665862395557',
                                    sortType: "01",
                                },
                                {
                                    label: '易智排行榜',
                                    active: false,
                                    activeType: '218340665862395558',
                                    sortType: "01",
                                },
                                {
                                    label: '易智大咖荟',
                                    active: false,
                                    activeType: '218340665862395559',
                                    sortType: "01",
                                },
                            ]
                        },
                        {
                            label: '品牌活动',
                            active: false,
                            activeType:'390092837996355585',
                            sortType: "02",
                            tabList: [
                                {
                                    label: '智汇两江',
                                    active: false,
                                    activeType:'01',
                                    topicCustomTag: '01',
                                    sortType: "01",
                                }
                                // {
                                //     label: '渝创渝新',
                                //     active: false,
                                //     activeType:'02',
                                //     topicCustomTag: '02',
                                //     sortType: "01",
                                // },
                            ]
                        },
                    ],
                    technologyTabs: [
                        {
                            label: '机械',
                            industryLevel: '001',
                            actvie: true
                        },
                        {
                            label: '汽车',
                            industryLevel: '002',
                            actvie: false
                        },
                        {
                            label: '集成电路',
                            industryLevel: '003',
                            actvie: false
                        },
                        {
                            label: '物联网',
                            industryLevel: '004',
                            active: false
                        },
                        {
                            label: '计算机及通信设备',
                            industryLevel: '005',
                            active: false
                        }
                    ],
                    goodsList: [],
                    demandList: [],
                    ManagerList:[],
                    buttons: [
                        {
                            label: '技术发布',
                            icon: 'icon-jishu',
                            url: '/common/seller/addpatent.html?code=technology-all&categoryId=82515756322918000'
                        },
                        // {
                        // 	label: '需求发布',
                        // 	icon: 'icon-xuqiu',
                        // 	url: '/common/buyer/demand/add.html?code=001.001.002.002'
                        // },
                        // {
                        //     label: '需求诊断',
                        //     icon: 'icon-xuqiu',
                        //     url: '/demand.html'
                        // },
                        {
                            label: '技术合同登记',
                            icon: 'icon-hetong',
                            url: '/other/checkin.html'
                        },
                        {
                            label: '技术评估',
                            icon: 'icon-pinggu',
                            url: '/other/assessment.html'
                        },
                        {
                            label: '技术挂牌交易',
                            icon: 'icon-jiaoyi',
                            url: '/other/transaction.html'
                        },
                        {
                            label: '交易公示',
                            icon: 'icon-gongshi',
                            url: '/other/publicity.html'
                        }
                    ],
                    shopList: [],
                    params: {
                        categoryCode: "001,010",
                        orderBy: "createTime desc",
                        pageNum: 1,
                        pageSize: 4
                    },
                    activeList: [],
                    activeLists: [],
                    activeParams: {
                        pageNum: 1,
                        pageSize: 10,
                        activeType: '218340665870780082',
                        // activeTypeDisplay:"政策直播间"
                    },
                    activeP: {
                        pageNum: 1,
                        pageSize: 10,
                        sortType: "02",
                        activeType: '218340665870780082',
                    },
                     params:{
                        activeType: "390092837996355585",
                        pageNum: 1,
                        pageSize: 10,
                         topicCustomTag: '01',

                    },
                    bannerList: [
                        {
                            banner: '/image/newbanner1.png',
                            texttop: '/style/images/index/texttop1.png',
                            textbtn: '/style/images/index/textbtn2.png',
                            texthint: '/style/images/index/texthintblack.png',
                            newcount: '/image/newcount1.png',
                            color: '1'
                        },
                        {
                            banner: '/image/newbanner2.png',
                            texttop: '/style/images/index/texttop.png',
                            textbtn: '/style/images/index/textbtn.png',
                            texthint: '/style/images/index/texthintwhite.png',
                            newcount: '/image/newcount.png'
                        },
                        {
                            banner: '/image/newbanner3.png',
                            texttop: '/style/images/index/texttop.png',
                            textbtn: '/style/images/index/textbtn1.png',
                            texthint: '/style/images/index/texthintwhite.png',
                            newcount: '/image/newcount.png'
                        },
                    ],
                    friendLink: [
                        {
                            img: '/style/images/index/friend_link_1.png',
                            href: 'http://kjj.cq.gov.cn/',
                            alt_tip: '重庆市科学技术局',
                        },
                        {
                            img: '/style/images/index/friend_link_2.png',
                            href: 'http://www.liangjiang.gov.cn',
                            alt_tip: '重庆两江新区',
                        },
                        {
                            img: '/style/images/index/friend_link_4.png',
                            href: 'http://dsjj.cq.gov.cn',
                            alt_tip: '重庆市大数据应用发展管理局',
                        },
                        {
                            img: '/style/images/index/friend_link_3.png',
                            href: 'http://gxq.cq.gov.cn',
                            alt_tip: '重庆高新区',
                        },

                        {
                            img: '/style/images/index/friend_link_5.png',
                            href: 'http://www.cqast.cn',
                            alt_tip: '重庆市科学技术协会',
                        },
                        {
                            img: '/style/images/index/friend_link_6.png',
                            href: 'http://www.cqast.org.cn',
                            alt_tip: '重庆市科学技术研究院',
                        },
                        {
                            // img: '/style/images/index/friend_link_7.png',
                            img: '/style/images/index/tt.png',
                            href: 'http://www.cqhte.com',
                            alt_tip: '重庆市高新技术企业协会',
                        },
                        // {
                        //     img: '/style/images/index/friend_link_8.jpg',
                        //     href: 'http://zwfw.cq.gov.cn/cq/public/index',
                        //     alt_tip: '渝快办',
                        // },
                        {
                            img: '/style/images/index/friend_link_8-1.png',
                            href: 'https://www.cykj01.com/',
                            alt_tip: '成渝城市群综合科技服务平台',
                        },
                        {
                            img: '/style/images/index/friend_link_9.png',
                            href: 'https://www.datacq.com.cn',
                            alt_tip: '愉快融',
                        },
                        {
                            img: '/style/images/index/friend_link_10(1).png',
                            href: 'http://www.csti.cn',
                            alt_tip: '重庆科技资源共享平台',
                        },
                        {
                            img: '/style/images/index/friend_link_11(1).png',
                            href: 'https://www.cqcxcyct.com',
                            alt_tip: '三创平台',
                        },
                        {
                            img: '/style/images/index/friend_link_12(1).png',
                            href: 'http://www.patentcloud.net',
                            alt_tip: '重庆市技术创新专利导航平台',
                        },
                    ],
                    userInfo: {},
                    isFixed: false,
                    number: 0,
                    recentNews: [],
                    typeList:[],//易智商城
                    goodList:[],//数据列表
                    bgImg:['/style/images/index/tab-bg1.png',
                        '/style/images/index/tab-bg2.png',
                        '/style/images/index/tab-bg3.png',
                        '/style/images/index/tab-bg4.png',
                        '/style/images/index/tab-bg5.png',
                        '/style/images/index/tab-bg6.png'],
                    boxActive:false,
                    iboxActive:false,
                    protocol: [
                        {
                            title: "服务协议详情",
                            content: "",
                        },
                        {
                            title: "隐私保护协议",
                            content: "",
                        },
                    ],
                    centerDialogVisible: false,
                    centerDialogVisible2: false,
                    protocolType: 0,
                },
                computed: {
                    text() {
                        return {
                            id: this.number,
                            val: this.honorList[this.number].name
                        };
                    }
                },
                filters: {
                    formatTime: function (v) {
                        return v ? v.split(' ')[0] : ''
                    },
                    formatTime1: function (v) {
                        var t;
                        if (v) {
                            t = new Date(v);
                            v = v.substr(0, 16) + [' 周日', ' 周一', ' 周二', ' 周三', ' 周四', ' 周五', ' 周六'][t.getDay()]
                        }
                        return v || '';
                    },
                },
                mounted: function () {
                    var _this = this
                    var swiperEntity = new Swiper('.slideTxtBox', {
                        slidesPerView: 5,
                        spaceBetween: 20,
                        loop: true, // 循环模式选项
                        autoplay: true, // 可选选项，自动滑动
                        delay: 3000,// 3秒切换一次
                        // initialSlide: 2, // 设定初始化时slide的索引。Swiper默认初始化时显示第一个slide，有时想初始化时直接显示其他slide，可以做此设置。
                        navigation: {
                            nextEl: '.item-next',
                            prevEl: '.item-prev',
                        },
                    })
                    $('.slideTxtBox').mouseenter(function () {
                        // 鼠标悬停停止播放
                        swiperEntity.autoplay.stop();
                    })
                    $('.slideTxtBox').mouseleave(function () {
                        // 鼠标移除开启自动播放
                        swiperEntity.autoplay.start();
                    })
                    // 获取类型板块
                    _this.getMailServiceType(function () {
                            //递归板块数据，从第一个板块开始
                            _this.getMailGoods(0)
                        }
                    );

                    // var swiperEntity = new Swiper('#swiper-containerIndex', {
                    //     loop: true, // 循环模式选项
                    //     autoplay: true, // 可选选项，自动滑动
                    //     delay: 3000,// 3秒切换一次
                    //     // initialSlide: 2, // 设定初始化时slide的索引。Swiper默认初始化时显示第一个slide，有时想初始化时直接显示其他slide，可以做此设置。
                    //     speed: 400, // 切换速度，即slider自动滑动开始到结束的时间（单位ms），也是触摸滑动时释放至贴合的时间。
                    //     watchSlidesProgress: true,
                    //     watchSlidesVisibility: true,
                    //     navigation: {
                    //         nextEl: '.swiper-button-next',
                    //         prevEl: '.swiper-button-prev',
                    //     },
                    //     on: {
                    //         init: function () {
                    //             animate.swiperAnimateCache(this); //隐藏动画元素
                    //             animate.swiperAnimate(this); //初始化完成开始动画
                    //             // this.emit('slideChangeTransitionEnd');//在初始化时触发一次slideChangeTransitionEnd事件
                    //         },
                    //         slideChange: function () {
                    //             animate.swiperAnimate(this); // 每个slide切换结束时也运行当前slide动画
                    //         }
                    //     }
                    // })
                    // $('#swiper-containerIndex').mouseenter(function () {
                    //     // 鼠标悬停停止播放
                    //     swiperEntity.autoplay.stop();
                    // })
                    // $('#swiper-containerIndex').mouseleave(function () {
                    //     // 鼠标移除开启自动播放
                    //     swiperEntity.autoplay.start();
                    // })
                    $('#honor').owlCarousel({
                        items: 1,
                        autoplay: true,
                        loop: true,
                        autoplayHoverPause: true,
                        autoHeight: true,
                        transitionStyle: 'fade',
                        dots: false
                    });
                    window.addEventListener('scroll', this.scroll);

                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/newtoper.vue'),
                    'number-grow': httpVueLoader('/style/components/number2.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'right-navs': httpVueLoader('/style/components/right.vue'),
                },
                created: function () {

                    this.startMove();
                    (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))) &&  this.$utils.getCookie(dic.locaKey.USER_INFO)
                    this.getNumbers2()
                    this.getNumbers3()
                    this.getAList('005')
                    this.getPList('004')
                    this.getcmsList(115)//政策精要
                    // this.getcmsList(128)//平台动态
                    this.getShops('022', 4) // 知识产权
                    this.getShops('023', 3) // 检验检测
                    this.getShops('024', 2) // 研发设计
                    this.finProduct()
                    this.getAnswerList() // 政策问答
                    this.getHelperList() // 申报助手
                    this.getGoodsList() // 技术成果
                    this.getDemandList() // 技术市场需求
                    this.getManagerList()//技术经理人
                    this.getShopList() // 技术供应商
                    this.getActiveList() //活动中心
                    this.getNewActiveList() //最新活动
                    setTimeout(function(){
                        document.getElementById("showbg").style.display="none"
                    },5000);
                    document.title = "易智网-科技创新综合服务平台";
                    var vm = this;
                    vm.$httpCom
                        .protocol({
                            protocolType: 1,
                        })
                        .then(function (res) {
                            if (res.result) {
                                vm.protocol[0].content = res.result.protocolContact;
                            }
                        });
                    vm.$httpCom
                        .protocol({
                            protocolType: 5,
                        })
                        .then(function (res) {
                            if (res.result) {
                                vm.protocol[1].content = res.result.protocolContact;
                            }
                        });
                },

                beforeDestroy: function () {
                    window.removeEventListener("scroll", this.handleScroll)
                },
                methods: {
                    about: function () {
                        location.href = "/about.html";
                    },
                    qiehuan:function (){
                        this.boxActive=true
                    },
                    Close:function (){
                        this.iboxActive=true
                    },
                    Pricre: function (v){

                        if (typeof v !== 'undefined' ) {
                            if (v >= 10000) {
                                return  (v / 10000).toFixed(2) + '万元';
                            }else {
                                return  v + '元'
                            }
                        }
                    },
                    hand:function (){
                        for(var i = 0; i < 40; i++){
                            console.log(1414980177918369807+i)


                        }
                    },
                    //价格判断
                    formatPrice: function (flag, v, n, m) {
                        if (flag == '2') {
                            return '面议'
                        }if(flag == "3"){
                            return '查看价格详情'
                        }else {
                            if (typeof v !== 'undefined' ) {
                                if (v >= 10000) {
                                    return  '￥'+((v / 10000).toFixed(2) + '万元');
                                }else {
                                    return '￥'+ v + '元'
                                }
                            } else if (!v && !m ) {
                                if (n >= 10000) {
                                    return  '￥'+((n / 10000).toFixed(2)+"万元");
                                }else {
                                    return  '￥'+n+"元";
                                }
                            } else {
                                if(n && m >= 10000){
                                    return '￥'+((n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)+'万元');
                                }else{
                                    return  '￥'+(n+ '-' +m+'元')
                                }

                            }
                        }
                    },

                    beforeMove: function () {
                        console.log('00')
                    },
                    scroll: function () {
                        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                        let offSetTop = setTimeout(function () {
                            document.querySelector('.header-box').offsetTop + 65;
                        }, 60);
                        this.isFixed = scrollTop > offSetTop ? true : false;
                    },
                    handle: function (val) {
                        if (val.activeType) {
                            location.href = '/alist.html?type=' + val.activeType
                        } else {
                            location.href = '/alist.html?type=' + val.topicCustomTag
                        }
                    },
                    /**
                     * 查看更多
                     * @param index
                     */
                    checkMore: function (index) {
                        location.href='/mall/sub1.html?type='+this.mailServiceTypeList[index].id
                    },
                    handleactivityTabs: function (val, i) {
                        var vm = this
                        //一级循环
                        vm.activityTabs.forEach(function (item, ti) {
                            item.active = ti === i

                            item.tabList.forEach(function (tab, idx) {
                                tab.active = tab.label == val.label
                            })

                        })
                        //二级循环
                        if (i === 2) {
                            vm.params.activeType = val.activeType
                            vm.params.topicCustomTag = val.topicCustomTag
                            vm.getBrandList()
                        } else{
                            if(val.activeType=="218340665862395558"||val.activeType=="218340665862395559"){

                            }else {
                                vm.activeParams.activeType = val.activeType
                                vm.getActiveList()
                            }
                        }
                    },
                    //品牌活动
                    getBrandList: function () {
                        let vm = this
                        indexApi.selectPortalPage(vm.params).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.$nextTick(function () {
                                    vm.activeLists = res.result.list
                                    vm.activeLists.forEach(function (items) {
                                        if (items.sponsor.indexOf('ぶんかつ') !== -1) {
                                            items.sponsor = (items.sponsor.split('ぶんかつ'))[0]
                                        }
                                        // item.joinNumTotal=(item.joinNum?item.joinNum:0)+(item.pageViews?parseInt(item.pageViews):0)
                                        items.joinNumTotal = items.totalViews
                                    })
                                })
                            }
                        })
                    },
                    //企业学堂
                    getActiveList: function () {
                        var vm = this
                        indexApi.selectIssuePage(vm.activeParams).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.activeLists = res.result.list
                                vm.activeLists.forEach((item) => {
                                    // item.joinNumTotal=(item.joinNum?item.joinNum:0)+(item.pageViews?parseInt(item.pageViews):0)
                                    item.joinNumTotal = (item.pageViews ? parseInt(item.pageViews) : 0)
                                })
                            }
                        })
                    },
                    getNewActiveList: function () {
                        var vm = this
                        indexApi.selectIssuePage({
                            orderBy: "sort asc,activeStartTime desc",
                            pageNum: 1,
                            pageSize: 3
                        }).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.expressList.forEach((item, index) => {
                                    if (index < 3) {
                                        item.itemUrl = '/podetail.html?id=' + item.contentId
                                        vm.recentNews.push(item)
                                    }
                                })
                                res.result.list.forEach((item) => {
                                    item.itemUrl = item.tagName ? '/atdetail.html?id=' + item.id : '/adetail.html?id=' + item.id
                                    vm.recentNews.push(item)
                                })
                                vm.$nextTick(() => {
                                    $(".recent-news").slide({
                                        mainCell: ".bd ul",
                                        autoPlay: true,
                                        effect: "leftMarquee",
                                        interTime: 30,
                                        vis: 6,
                                        trigger: "click"
                                    });
                                })
                            }
                        })
                    },
                    handletechnology: function (industryLevel, i) {
                        this.technologyTabs.forEach(function (item, ti) {
                            item.active = ti === i
                        })
                        location.href = '/service/results_list.html?industryLevel=' + industryLevel
                    },
                    getImgPath(path) {
                        return httpUrl.fileShowUrl + '/resource/' + path;
                    },
                    // getShopList: function () {
                    //     var vm = this
                    //     indexApi.shopSelectbByPage({
                    //         isContainIdentityTypeSelf: "0",
                    //         orderBy: "createTime desc",
                    //         pageNum: 1,
                    //         pageSize: 4
                    //     }).then(function (res) {
                    //         if (res.code === 'rest.success') {
                    //             vm.shopList = res.result.list
                    //         }
                    //     })
                    // },
                    getShopList: function () {
                        var vm = this
                        indexApi.shopSelectbByPage({
                            pageParam: {current: 1, size: 4, order: "desc", sort: "id"},
                            payload: {achievementBelong:null,
                                achievementMaturity:null,
                                budget_sectionQuery:null,
                                businessPlanProportion:null,
                                cooperationMode:null,
                                projectIndustryType:null,
                                projectSource:null}
                        }).then(function (res) {

                            vm.shopList = res.data.records

                        })
                    },
                    handleTips: function () {
                        this.$dialog.showToast('敬请期待')
                    },
                    // getDemandList: function () {
                    //     var vm = this
                    //     indexApi.demandSelectbByPage({
                    //         orderBy: "createTime desc",
                    //         pageNum: 1,
                    //         pageSize: 4
                    //     }).then(function (res) {
                    //         if (res.code === 'rest.success') {
                    //             vm.demandList = res.result.list
                    //         }
                    //     })
                    // },
                    // getGoodsList: function () {
                    //     var vm = this
                    //     indexApi.goodsSelectbByPage(vm.params).then(function (res) {
                    //         if (res.code === 'rest.success') {
                    //             vm.goodsList = res.result.list
                    //         }
                    //     })
                    // },
                    getDemandList: function () {
                        var vm = this
                        indexApi.demandSelectbByPage({
                            pageParam: {current: 1, size: 6, order: "desc", sort: "id"},
                            payload: {achievementBelong:null,
                                achievementMaturity:null,
                                budget_sectionQuery:null,
                                businessPlanProportion:null,
                                cooperationMode:null,
                                projectIndustryType:null,
                                projectSource:null}
                        }).then(function (res) {

                            vm.demandList = res.data.records

                        })
                    },
                    getGoodsList: function () {
                        var vm = this
                        indexApi.goodsSelectbByPage({
                            pageParam: {current: 1, size: 6, order: "desc", sort: "id"},
                            payload: {achievementBelong:null,
                                achievementMaturity:null,
                                budget_sectionQuery:null,
                                businessPlanProportion:null,
                                cooperationMode:null,
                                projectIndustryType:null,
                                projectSource:null}
                        }).then(function (res) {

                            vm.goodsList = res.data.records

                        })
                    },
                    getManagerList: function () {
                        var vm = this
                        indexApi.ManagerSelectbByPage({pageParam: {current: 1, size: 10, order: "desc", sort: "create_time"},
                            payload: {achievementBelong:null,
                                achievementMaturity:null,
                                budget_sectionQuery:null,
                                businessPlanProportion:null,
                                cooperationMode:null,
                                projectIndustryType:null,
                                projectSource:null}}).then(function (res) {

                            vm.ManagerList = res.data.records

                        })
                    },
                    getAnswerList: function () {
                        var vm = this
                        indexApi.answerSelectByType({
                            pageSize: 10,
                            pageNum: 1
                        }).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.answerList = res.result.list;
                                vm.initScroll();
                            }
                        })
                    },
                    getHelperList: function () {
                        var vm = this
                        indexApi.helperSelectByPage({
                            pageSize: 4,
                            pageNum: 1
                        }).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.helperList = res.result.list
                                if (vm.helperList.length) {
                                    vm.helperList[0].icon = 'icon-jigou'
                                    vm.helperList[1].icon = 'icon-juxing'
                                    vm.helperList[2].icon = 'icon-pinggu'
                                    vm.helperList[3].icon = 'icon-shenbao'
                                }
                            }
                        })
                    },
                    handlePTabsNav: function (i) {
                        this.ptabsNavs.forEach(function (item, ti) {
                            item.active = ti === i
                        })
                        this.policyList = i ? (i === 1 ? this.newsList_policy : this.newsList_platform) : this.expressList
                    },
                    handlePTabsNavMore: function (url) {
                        location.href = url
                    },
                    handleEnterpark:function (){
                        this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html?back=/enterpark.html";
                        } else {
                            window.location.href = "/enterpark.html";
                        }
                    },
                    handleTest: function () {
                        this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html?back=/test.html";
                        } else {
                            window.location.href = "/test.html";
                        }
                    },
                    getAList: function (id) {
                        var vm = this;
                        indexApi.selectIssuePage(vm.activeP).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.activeHot = res.result.list.slice(0, 3)
                                vm.activeList = res.result.list.slice(3, 7)
                                vm.$nextTick(function () {
                                    $('#activeHots').owlCarousel({
                                        items: 1,
                                        singleItem: true,
                                        autoplay: true,
                                        loop: true,
                                        autoplayHoverPause: true,
                                        autoplayTimeout: 2000,
                                        autoHeight: true,
                                        transitionStyle: 'fade',
                                    });
                            })
                            }
                        });
                        // indexApi.selectActiveByPage({
                        //     columnId: id,
                        // }).then(function (res) {
                        //     res.result && res.result.forEach(function (item) {
                        //         item.itemUrl = '/livedetail.html?id=' + item.contentId
                        //         item.itemImg = item.poster.url
                        //     })

                    },
                    //2020-12-23 政策速递 政策精要 改为政策惠
                    // getPList: function (id) {
                    // var vm = this;
                    // indexApi.selectPolicyByPage({
                    //  		columnId: id,
                    // 	}).then(function (res) {
                    // 		res.result && res.result.forEach(function (item) {
                    //  			item.itemUrl = '/podetail.html?id=' + item.contentId
                    //  			item.policyFileType = item.policyFileType && item.policyFileType.split(',')[0]
                    // 			item.policyFileTypeDisplay = item.policyFileTypeDisplay && item.policyFileTypeDisplay[0]
                    // 		})
                    //     vm.policyList = vm.expressList = res.result})
                    //  },
                    getPList: function (id) {
                        var vm = this;
                        indexApi.selectPolicyByPage({
                            columnId: id,
                        }).then(function (res) {
                            res.result && res.result.forEach(function (item) {
                                item.itemUrl = '/podetail.html?id=' + item.contentId
                                item.policyFileType = item.policyFileType && item.policyFileType.split(',')[0]
                                item.policyFileTypeDisplay = item.policyFileTypeDisplay && item.policyFileTypeDisplay[0]
                            })
                            vm.expressList = res.result
                        })
                    },
                    getcmsList: function (channelId) {
                        var vm = this;
                        indexApi.contentList({
                            pageNum: 1, pageSize: 16, limit: 16, policyFileType: ["07"],
                            orderBy: "publishDate-desc"
                        }).then(function (res) {
                            res.result.list && res.result.list.forEach(function (item) {
                                item.itemUrl = '/podetail.html?id=' + item.id
                                item.policyFileTypeDisplay = ''
                            });
                            vm.policyList = res.result.list
                            // if(channelId===115){
                            // 	vm.$data.newsList_policy = res.body
                            // }else if(channelId===128){
                            // 	vm.$data.newsList_platform = res.body
                            // }
                        })
                    },
                    //2020-12-23 政策速递 政策精要 改为政策惠
                    // getcmsList: function (channelId) {
                    // 	var vm = this;
                    // 	indexApi.contentList({
                    // 		pageNum: 1, pageSize: 10 ,limit:10, policyFileType: ["07"],
                    // 		orderBy: "publishDate-desc"
                    // 	}).then(function (res) {
                    // 		res.result.list && res.result.list.forEach(function (item) {
                    // 			item.itemUrl='/qykjDetail.html?id='+item.id
                    // 			item.policyFileTypeDisplay=''
                    // 		});
                    // 		vm.$data.newsList_policy = res.result.list
                    // 		// if(channelId===115){
                    // 		// 	vm.$data.newsList_policy = res.body
                    // 		// }else if(channelId===128){
                    // 		// 	vm.$data.newsList_platform = res.body
                    // 		// }
                    // 	})
                    // },
                    getNumbers2: function () {
                        var vm = this;
                        indexApi.getActiveStatistics({}).then(function (res) {
                            vm.countNumbers[0].num = res.result['activeNum'] || 0
                        })
                    },
                    getNumbers3: function () {
                        var vm = this;
                        indexApi.getGraphStatistics({'code': 'serviceTotal'}).then(function (res) {
                            let result = res.result.serviceTotal[0]
                            vm.countNumbers[1].num = parseInt(result.shopCount) || 0
                            vm.countNumbers[2].num = parseInt(result.techCount) || 0
                            vm.countNumbers[3].num = parseInt(result.policyNum) || 0
                        })
                    },
                    handleMall:function(){
                        if (this.userInfo.userTypes) {
                            for (var it of this.userInfo.userTypes) {
                                if (it === "002") {
                                    this.isSeller = true;
                                }
                            }
                        }

                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html";
                            return;
                        }
                        if (this.isSeller) {
                            window.location.href = "/common/seller/index.html";
                        } else {
                            window.location.href = "/common/seller/store_agreement.html";
                        }
                    },
                    handleOne:function () {
                        this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html?back=/common/usercenter/user_market_tech_achi_form.html";
                        } else {
                            window.location.href = "/common/usercenter/user_market_tech_achi_form.html";
                        }
                    },
                    handleTwo:function () {
                        this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html?back=/common/usercenter/user_market_tech_require_form.html";
                        } else {
                            window.location.href = "/common/usercenter/user_market_tech_require_form.html";
                        }
                    },
                    handleUrlBtn: function (e) {
                        var url = e.currentTarget.dataset ? e.currentTarget.dataset.url : e.currentTarget.getAttribute('data-url');
                        var isFlag = true
                        console.log(url)
                        !url && (url = '')
                        if (url.indexOf('/common/buyer') !== -1) {
                            if (this.userInfo && this.userInfo.userName) {
                                if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
                                    url = '';
                                    isFlag = false;
                                    this.$refs.lytoper.openBuyerConfirm()
                                }
                            } else {
                                url = '';
                                isFlag = false;
                                window.location.href = '/common/login.html';
                            }
                        }
                        if (url.indexOf('/common/seller') !== -1) {
                            if (this.userInfo && this.userInfo.userName) {
                                if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('002') === -1) {
                                    url = '';
                                    isFlag = false;
                                    this.$dialog.showToast('您还不是服务商，请先入驻成为服务商！')
                                }
                            } else {
                                url = '';
                                isFlag = false;
                                window.location.href = '/common/login.html';
                            }
                        }
                        if (url.indexOf('/activity/add') !== -1) {
                            if (this.userInfo && this.userInfo.userName) {
                                if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
                                    url = '';
                                    isFlag = false;
                                    this.$refs.lytoper.openBuyerConfirm()
                                }
                            } else {
                                url = '';
                                isFlag = false;
                                window.location.href = '/common/login.html';
                            }
                        }
                        if (url && isFlag) {
                            this.$utils.openNewTable(url)
                        }
                        if (!url && isFlag) {
                            this.$dialog.showToast('敬请期待')
                        }
                    },
                    getShops: function (id, dataKey) {
                        var vm = this;
                        indexApi.selectShopByPage({
                            columnId: id,
                            saasId: this.saasId,
                            saasFlag: 0
                        }).then(function (res) {
                            vm.$data.server[dataKey].infoItems = res.result
                        })
                    },
                    finProduct: function () {
                        var $vm = this;
                        let params = {
                            channelType: "WEB",
                            mSort: "DESC",
                            pageNum: 1,
                            pageSize: 4
                        }
                        this.$http.post(httpUrl.datacq + 'financial/finProduct/list', params).then(function (res) {
                            if (res.code === '20000') {
                                $vm.pinpai_list = res.data.list
                            }
                        })
                    },
                    initScroll: function () {
                        this.$nextTick(function () {
                            $('.listsScroll').myScroll({
                                speed: 30, //数值越大，速度越慢
                                rowHeight: 36
                            });
                        })
                    },
                    // policyScroll () {
                    // 	let speed = 50;
                    // 	let wrapper = document.getElementById('wrapper');
                    // 	let list_one = document.getElementById('list_one');
                    // 	let list_two = document.getElementById('list_two');
                    // 	list_two.innerHTML = list_one.innerHTML;
                    // 	// console.log(list_one.innerHTML);
                    // 	function Marquee () {
                    // 		if (list_two.offsetHeight - wrapper.scrollTop <= 0)
                    // 			wrapper.scrollTop -= list_one.offsetHeight;
                    // 		else {
                    // 			wrapper.scrollTop += 1
                    // 		}
                    // 	}
                    // 	let MyMar = setInterval(Marquee, speed);
                    // 	wrapper.onmouseover = function () { clearInterval(MyMar) };
                    // 	wrapper.onmouseout = function () { MyMar = setInterval(Marquee, speed) };
                    // },
                    startMove() {
                        let timer = setTimeout(() => {
                            if (this.number === 6) {
                                this.number = 0;
                            } else {
                                this.number += 1;
                            }
                            this.startMove();
                        }, 1000);
                    },
					// 获取商城分类名称以及id
                    getMailServiceType: function (call) {
                        var vm = this
                        indexApi.mailServiceType().then(function (res) {
                            var list = res.result || [];
                            //设置板块数据
                            for( var key in list){
                                list[key].goodList = [];
                            }
                            //设置板块列表
                            vm.typeList = list
                            //执行回调
                            typeof call == 'function' ? call():[]
                            vm.$nextTick(function () {
                                console.log('---------')
                            setTimeout(function (){
                                $(".swiperBox").slide({
                                    titCell: ".hd ul",
                                    mainCell: ".bd ul",
                                    autoPage: true,
                                    effect:"leftLoop",
                                    autoPlay: true,
                                    vis: 4
                                });
                            },1000)

                            })
                        })
                    },
                    //技术经理人学院
                    handleSchool: function () {
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            // window.location.href = '/common/login.html';
                          return window.location.href = httpUrl.baseSchoolOutUrl
                        }
                        var url = httpUrl.baseSchoolOutUrl ;
                        var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
                        var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
                        // window.open();
                        return window.location.href =(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
                    },
					getMailGoods: function (idx) {
						var vm = this
                        var item = vm.typeList[idx]
						indexApi.selectMailGoods({orderBy:'homePageFlag desc',pageSize:2,type: item.id}).then(function (res) {
							if (res.code === 'rest.success') {
                                item.goodList = res.result.list || []
                                //判断是否循环完
                                if(idx < vm.typeList.length - 1)vm.getMailGoods(idx + 1)

							}
						})
					},
                }
            });
        })
});
