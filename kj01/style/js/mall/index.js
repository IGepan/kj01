// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', 'httpUrl', 'validate', 'img_captcha', 'httpLogin','/common/js/libs/jquery.SuperSlide.2.1.3.js'],
        function ($, Vue, dic, httpVueLoader, indexApi, httpUrl, validate, captcha, httpLogin,slide) {
            window.vueDom = new Vue({
                el: '#index_box',
                data: function(){
                    let validateMethods = (rule, value, callback) => {
                        if (this.dataForm.discuss ==0 && this.dataForm.price=='') {
                            callback(new Error('请选择输入价格'));
                        } else {
                            callback();
                        }
                    };
                    return {
                        saasId: '',
                        mailSite: {},
                        mailServiceTypeList: [],
                        knowledgeTypeList: [],
                        incubationTypeList: [],
                        designTypeList: [],
                        checkTypeList: [],
                        propertyTypeList: [],
                        technologyTypeList: [],
                        transferTypeList: [],
                        incubationType: {},
                        designType: [],
                        checkType: [],
                        propertyType: [],
                        technologyType: [],
                        transferType: [],
                        indexBanner: [],
                        indexBanner02: [],
                        //精选服务
                        chooseGoods: [],
                        //最新入驻
                        newShops: [],
                        goodFormData: {
                            chosenFlag: '',
                            pageSize: '',
                            type: ''
                        },
                        contentErrorMsg: '',
                        phoneErrorMsg: '',
                        vercodeErrorMsg: '',
                        select: false,
                        isPhoneError: false,
                        isShowDialog: false,
                        isSubmitDisabled: false,
                        isDisabled: false,
                        codeTime: 60,
                        codeBtnText: '发送验证码',
                        form: {
                            phone: '',
                            content: '',
                            token: '',
                            code: '',
                        },
                        title: '',
                        userInfo: {},
                        dialogFormVisible: false,
                        formLabelWidth: '120px',
                        changeSelectStyle: '0',//索引样式
                        isSeller: false,
                        typeList: [],//板块列表
                        goodList: [],//板块数据列表
                        // bgcolor: ['/mall/images/bg1.png', '/mall/images/bg2.png', '/mall/images/bg3.png', '/mall/images/bg4.png', '/mall/images/bg5.png', '/mall/images/bg6.png', '/mall/images/bg7.png',
                        //     '/mall/images/bg8.png', '/mall/images/bg9.png',
                        // ],
                        bgList:['bg1','bg2','bg3','bg4','bg5','bg6','bg7','bg8','bg9',],
                        url: ['/mall/images/icon1.png', '/mall/images/icon2.png', '/mall/images/icon3.png', '/mall/images/icon4.png', '/mall/images/icon5.png', '/mall/images/icon6.png', '/mall/images/icon7.png',
                            '/mall/images/icon8.png', '/mall/images/icon9.png',
                        ],
                        scrollList: [],
                        dataForm:{
                            userId:'',
                            enterpriseName:'',//企业名称
                            description:'',//需求描述
                            price:'',//预期价格
                            discuss:0,//面议可选
                            contacts:'',//联系人
                            phone:'',//联系方式
                            progress:0
                        },
                        showList:[],
                        rules: {
                            enterpriseName: [
                                {required: true, message: '请输入企业名称',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            description: [
                                {required: true, message: '请输入需求描述',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            price: [
                                {required: true,validator:validateMethods,trigger: 'blur'},
                            ],
                            contacts: [
                                {required: true, message: '请输入联系人', trigger: 'blur'},
                            ],
                            phone: [
                                {required: true, message: '请填写联系方式',trigger: 'blur'},
                                {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码',trigger: 'blur'}
                            ]

                        },
                    }

                },
                // filters: {
                //     formatPrice: function (flag, v, n, m) {
                //         if (flag === '2') {
                //             return '面议'
                //         }if(flag === "3"){
                //             return '查看价格详情'
                //         }else {
                //             if (typeof v !== 'undefined') {
                //                 return (v / 10000).toFixed(2)
                //             } else if (!v && !m) {
                //                 return (n / 10000).toFixed(2)
                //             } else {
                //                 return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
                //             }
                //         }
                //     },
                //     formatPrice2: function (flag, v, n, m) {
                //         if (flag === '2') {
                //             return '面议'
                //         }if(flag === "3"){
                //             return '查看价格详情'
                //         }else {
                //             if (typeof v !== 'undefined') {
                //                 return (v / 10000).toFixed(2)
                //             } else if (!v && !m) {
                //                 return (n / 10000).toFixed(2)
                //             } else {
                //                 return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
                //             }
                //         }
                //     },
                // },

                // mounted: function () {
                // },
                components: {
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
                    'index-head': httpVueLoader('/style/components/index_head.vue'),
                    'number-grow': httpVueLoader('/style/components/number.vue'),
                    'header-mail': httpVueLoader('/style/components/header_mail.vue'),
                    'validate-dialog-mall': httpVueLoader('/common/components/validateDialogmall.vue'),
                },
                mounted: function () {
                    var _this = this
                    this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
                    this.saasId = localStorage.getItem('saasId');
                    // this.getMailSiteDetail();
                    this.getAllServiceType();//服务分类
                    // 获取类型板块
                    _this.getMailServiceType(function (){
                            //递归板块数据，从第一个板块开始
                            _this.getMailServiceData(0)
                        }
                    );
                    this.getE();
                    //首页banner
                    this.getBanner('01', 'indexBanner', 10);
                    //最新入驻
                    this.goodFormData.pageSize = 8;
                    this.goodFormData.orderBy = 'createTime desc';
                    this.getNewShops();
                    //广告2
                    // this.getBanner('02', 'indexBanner02', 1);
                    //精选服务
                    this.goodFormData.chosenFlag = '1';
                    this.getMailGoods('chooseGoods')
                    this.goodFormData = {}

                    // //知识产权
                    this.goodFormData.pageSize = 10;
                    // this.goodFormData.type = '371977891599065088';
                    // this.goodFormData.orderBy = 'homePageFlag desc';
                    // this.getMailGoods('incubationTypeList')
                    // // //法律服务
                    // this.goodFormData.type = '371979747670859776';
                    // this.getMailGoods('designTypeList')
                    // // //政策申报
                    // this.goodFormData.type = '371979827203252224';
                    // this.getMailGoods('checkTypeList')
                    // // //工商财税
                    // this.goodFormData.type = '371979918089625600';
                    // this.getMailGoods('propertyTypeList')
                    // // //评估评价
                    // this.goodFormData.type = '371980699979194368';
                    //  this.getMailGoods('technologyTypeList')
                    // // //检验检测
                    // this.goodFormData.type = '371981659690475520';
                    // this.getMailGoods('transferTypeList');
                    // // //科技咨询
                    // // this.goodFormData.type = '371980018614509568';
                    // // this.getMailGoods('knowledgeTypeList');
                    // // cookie用户信息
                    (this.userInfo = JSON.parse(
                        this.$utils.getCookie("USER_INFO")
                    ));
                    // 监听页面滚动，设置导航
                    window.addEventListener('scroll', function(){
                        var  scrollList = _this.typeList
                        var sections = ['service-box']
                        scrollList.forEach(function(key,index){
                            sections.push('tabs'+ index )
                        })
                        // console.log(sections,'sections')
                        var st = $(window).scrollTop()
                        sections.forEach(function(key,idx){
                            var offset = (window.innerHeight - $('#'+key).height()) / 2
                            if(st >= $('#'+key).offset().top - offset && idx == sections.length - 1) {
                                _this.changeSelectStyle = idx
                                return
                            }
                            if(st >= $('#'+key).offset().top - offset && st < $('#'+sections[idx+1]).offset().top - offset){
                                _this.changeSelectStyle = idx
                                return
                            }
                        })
                        // console.log(_this.changeSelectStyle)
                    }, true)

                    window.addEventListener('hashchange', function() {
                        const hash = location.hash.replace('/', '')
                        $('body,html').animate({
                            scrollTop: $(hash).offset().top
                        },100)
                    })
                    if (this.userInfo.userTypes) {
                        for (var it of this.userInfo.userTypes) {
                            if (it === "002") {
                                this.isSeller = true;
                            }
                        }
                    }
                },
                methods: {
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
                                if(n >= 100 && m >=10000 ){
                                    return '￥'+((n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)+'万元');
                                }else if (n < 100 && m >= 10000) {
                                    return '￥'+((n / 10000).toFixed(3) + '-' + (m / 10000).toFixed(2)+'万元');
                                } else {
                                    return '￥' + (n + '-' + m + '元');
                                }

                            }
                        }
                    },
                    formatPrice2: function (flag, v, n, m) {
                        if (flag == '2') {
                            return '面议'
                        }if(flag == "3"){
                            return '查看价格详情'
                        }
                        else {
                            if (typeof v !== 'undefined' ) {

                                return '￥'+ v

                            } else if (!v && !m ) {

                                return  '￥'+ n

                            } else if(n && m) {

                                return '￥' + n + '~' + m
                            }
                        }

                    },
                    fwsClick: function () {
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
                    onRadioChange(e) {
                        e === this.dataForm.discuss? (this.dataForm.discuss=0):(this.dataForm.discuss = e)
                    },
                    open:function (){
                        setTimeout(() => {
                            this.$refs.form.clearValidate();
                        }, 0);
                        this.cleanForm();
                        this.dialogFormVisible=true
                    },
                    // 清理表单
                    cleanForm() {
                        this.dataForm.enterpriseName='';
                        this.dataForm.description='';
                        this.dataForm.price='';
                        this.dataForm.discuss=0;
                        this.dataForm.contacts='';
                        this.dataForm.phone='';
                    },
                    getE:function (){
                        var vm=this
                        indexApi.getEq({}).then((res) => {
                            vm.showList=res.result.list
                            vm.$nextTick(() => {
                                $(".recent-news").slide({
                                    mainCell: ".bd ul",
                                    autoPlay: true,
                                    effect: "topLoop",
                                    vis:1,
                                });
                            })
                        })
                    },
                    submit:function (){
                            this.$refs.form.validate((valid) => {
                                console.log(valid, 'valid')
                                if (valid) {
                                    indexApi.submitEq(this.dataForm).then((res) => {
                                        if (res.code == 'rest.success') {
                                            this.$notify.success({
                                                title: '成功！',
                                                message: '提交成功!',
                                                duration: 2000
                                            });
                                            this.dialogFormVisible = false
                                            this.getE();
                                        }
                                    });
                                } else {
                                    this.$notify.error({
                                        title: '提示！',
                                        message: '请先完善信息填写!'
                                    });
                                }
                            });

                    },
                    // getMailSiteDetail: function () {
                    //     var vm = this
                    //     vm.$httpCom.mailSiteDetail().then(function (res) {
                    //         if (res.code === 'rest.success') {
                    //             vm.mailSite = res.result
                    //         }
                    //     })
                    // },
                    getAllServiceType: function () {
                        var vm = this
                        indexApi.mailServiceType().then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.mailServiceTypeList = res.result
                            }
                        })
                    },
                    // //获取类型板块
                    getMailServiceType: function (call) {
                        var vm = this
                        indexApi.mailServiceType().then(function (res) {
                            var List = res.result || []
                            //设置板块数据
                            for( var key in List){
                               List[key].goodList = []
                            }
                            //设置板块列表
                            vm.typeList = List
                            //执行回调
                            typeof call == 'function' ? call():[]
                        })
                    },
                    // //获取板块数据
                    getMailServiceData:function (idx) {
                        var vm = this
                        var item = vm.typeList[idx]
                        indexApi.selectMailGoods({type: item.id,orderBy:'homePageFlag desc,createTime desc',pageSize:6}).then(function (res) {
                            //设置数据列表
                            item.total = res.result.total
                            item.goodList  =  res.result.list || []
                            //判断是否循环
                            if(idx < vm.typeList.length - 1)vm.getMailServiceData(idx + 1)

                        })
                    },
                    // getMailServiceType: function () {
                    //     var vm = this
                    //     indexApi.mailServiceType().then(function (res) {
                    //         if (res.code === 'rest.success') {
                    //             vm.mailServiceTypeList = res.result
                    //             //知识产权
                    //             vm.incubationType = res.result.filter(function (s) {
                    //                 return s.id == res.result[0].id;
                    //             })[0];
                    //             //法律服务
                    //             vm.designType = res.result.filter(function (s) {
                    //                 return s.id == res.result[1].id;
                    //             })[0];
                    //             //政策申报
                    //             vm.checkType = res.result.filter(function (s) {
                    //                 return s.id == res.result[2].id;
                    //             })[0];
                    //             //工商财税
                    //             vm.propertyType = res.result.filter(function (s) {
                    //                 return s.id == res.result[3].id;
                    //             })[0];
                    //             // //评估评价
                    //             vm.technologyType = res.result.filter(function (s) {
                    //                  return s.id == res.result[4].id;
                    //             })[0];
                    //             //检验检测
                    //             vm.transferType = res.result.filter(function (s) {
                    //                 return s.id == res.result[5].id;
                    //             })[0];
                    //             //科技咨询
                    //             // vm.knowledgeType = res.result.filter(function (s) {
                    //             //     return s.id == res.result[6].id;
                    //             // })[0];
                    //         }
                    //     })
                    // },
                    getBanner: function (bannerType, key, pageSize) {
                        var vm = this
                        // 初始化banner
                        var initBanner = function () {
                            // 设置轮播图高度
                            $('#home-slider').css({
                                height: $('.dropdown-menu-main').outerHeight() + 'px'
                            })
                            // });
                        }
                        indexApi.selectBanner({bannerType: bannerType, pageSize: pageSize}).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.$data[key] = res.result
                                vm.$nextTick(function () {
                                    new Swiper('#home-slider', {
                                        autoplay: {
                                            delay: 2500,
                                            disableOnInteraction: false,
                                        },
                                        pagination: {
                                            el: '.swiper-pagination',
                                            clickable: true,
                                        },
                                    });
                                    // initBanner()
                                })
                                var img = new Image()
                                img.src = res.result[0].path
                                console.log(img.src,'获取图片')
                                img.onload = function (){
                                    console.log('图片加载完成')
                                    initBanner()
                                }
                            }
                        })
                    },
                    //查询最新店铺信息
                    getNewShops: function () {
                        var vm = this
                        indexApi.selectNewShops(this.goodFormData).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.newShops = res.result;
                                // setTimeout(function(){
                                vm.$nextTick(function () {
                                    $('#marquee-left').kxbdSuperMarquee({
                                        isMarquee:true,
                                        direction: 'left',
                                        scrollDelay:30,
                                        isEqual: false
                                    });
                                })

                            }
                        });
                    },
                    getMailGoods: function (dateKey) {
                        var vm = this
                        indexApi.selectMailGoods(this.goodFormData).then(function (res) {
                            if (res.code === 'rest.success') {

                                vm.$data[dateKey] = res.result.list
                                vm.$nextTick(function () {
                                    console.log('---------')
                                    //精选服务列表，只展示2的倍数
                                    if( vm.chooseGoods.length % 2 !== 0 ){
                                        var list = vm.chooseGoods
                                        vm.chooseGoods = list.splice(0,list.length - list.length % 2)

                                    }
                                  window.serviceSwiper = new Swiper('.service-list', {
                                        slidesPerView: 3,
                                      slidesPerColumn: 2,
                                      // slidesPerGroup: 3,
                                      //   spaceBetween: 30,
                                        // loop:true,
                                        navigation: {
                                            nextEl: '.item-next',
                                            prevEl: '.item-prev',
                                        },
                                    });
                                })
                            }
                        })
                    },
                    //取出指定类型
                    getSomeType: function (id, dataKey, typeList) {
                        var vm = this
                        let filter = typeList.filter(function (s) {
                            return s.id == id;
                        });
                        vm.$data[dataKey] = filter;
                    },
                    /**
                     * 点击发布
                     */
                    subClick: function (event) {
                        var vm = this;
                        $("#sub_form").validate({
                            rules: {
                                content: {
                                    required: true,
                                },
                                phone: {
                                    required: true,
                                },
                                code: {
                                    required: true,
                                }
                            },
                            messages: {
                                content: {
                                    required: "<span class='form_error'>请输入内容</span>"
                                },
                                phone: {
                                    required: "<span class='form_error'>请输入手机号</span>"
                                },
                                code: {
                                    required: "<span class='form_error'>请输入验证码</span>"
                                }
                            },
                            submitHandler: function (form, event) {
                                event.preventDefault() //阻止form表单默认提交
                                vm.demandSubmit();
                            }
                        })
                    },
                    /**
                     * 发送短信
                     */
                    sendClick: function (event) {
                        event.preventDefault() //阻止form表单默认提交
                        var phone = this.form.phone;

                        if (phone == '') {
                            this.$message.error('请输入正确的手机号');
                            return
                        }
                        // 格式校验
                        if (!(/^1[345678]\d{9}$/.test(phone))) {
                            this.$message.error('请输入正确的手机号');
                            return
                        }
                        this.isShowDialog = true;
                        var vm = this;
                        setTimeout(function () {
                            if (vm.$refs.validateRef) {
                                vm.$refs.validateRef.initImg(captcha, httpUrl);
                            }
                        }, 200)
                    },
                    /**
                     * 验证成功
                     */
                    toSuccess: function (m) {
                        this.form.token = m.token;
                        this.form.code = m.code;
                        $("#captcha").find("canvas").delay(500).fadeOut(500);
                        this.showMsg({
                            msg: "验证成功",
                            type: "success"
                        })
                    },
                    /**
                     * 查看更多
                     * @param index
                     */
                    checkMore: function (index) {
                        location.href='/mall/sub1.html?type='+this.mailServiceTypeList[index].id
                    },
                    /**
                     * 滑块验证成功
                     */
                    onSuccess: function (captchaData) {
                        var vm = this;
                        vm.isShowDialog = false;
                        vm.isDisabled = true
                        this.captchaData = captchaData;
                        // 发短信滑块验证
                        httpLogin.sendCaptchaCode({
                            validateSrc: this.form.phone,
                            businessType: dic.businessType.BUSINESS_TYPE_010,
                            type: 'slider',
                            token: captchaData.token,
                            code: captchaData.code
                        }).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.codeBtnText = vm.codeTime;
                                var interval = setInterval(function () {
                                    vm.codeBtnText--;
                                    if (vm.codeBtnText <= 0) {
                                        clearInterval(interval);
                                        vm.isDisabled = false
                                        vm.codeBtnText = '发送验证码'
                                    }
                                }, 1000)
                                vm.$dialog.showToast('验证码已发送');
                            } else {
                                vm.$dialog.showToast('验证码发送失败');
                                vm.isDisabled = false
                            }
                        }).catch(function (error) {
                            vm.$dialog.showToast('验证码发送失败');
                            vm.isDisabled = false
                        });
                    },
                    demandSubmit: function () {
                        var vm = this;
                        var param = JSON.parse(JSON.stringify(vm.form));
                        !vm.isSubmitDisabled && (this.isSubmitDisabled = true,
                                indexApi.saveMailDemand(param).then(function (data) {
                                    if (data.code == 'rest.success') {
                                        vm.$message({
                                            message: '发布成功',
                                            type: 'success'
                                        });
                                        vm.form = {}
                                        vm.isSubmitDisabled = false
                                        vm.codeBtnText=0;
                                    } else {
                                        vm.isSubmitDisabled = false
                                        vm.$message.error(data.desc);

                                    }
                                }).catch(function () {
                                    vm.isSubmitDisabled = false
                                })
                        )
                    },
                    handelSearch: function () {
                        location.href = '/mall/sub1.html?title=' + this.title
                    },
                    goCart: function () {
                        location.href = '/common/servicetrade/shopping_cart.html'
                    },
                    toLink: function (url) {
                        if (url) {
                            location.href = url
                        }
                    },
                    declaration: function () {

                    },
                    fwsClic2: function () {

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
                    // 右侧栏索引
                    changeStyle:function (index){
                        this.changeSelectStyle = index;
                    },
                }
            });
        })
});
