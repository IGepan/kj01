// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/style/js/libs/scroll.js',
            '/style/js/libs/swiper-5.4.1/js/swiper.min.js',
            '/style/js/libs/swiper-5.4.1/js/swiper.animate.min.js','/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', '/common/js/libs/jquery.SuperSlide.2.1.3.js', 'httpUrl', 'validate', 'img_captcha', 'httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl, validate, captcha, httpLogin) {
            window.vueDom = new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    mailSite: {},
                    mailServiceTypeList: [],
                    knowledgeTypeList:[],
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
                    changeSelectStyle:'0',//索引样式

                },
                filters: {
                    formatPrice2: function (flag, v, n, m) {
                        if (flag === '2') {
                            return '面议'
                        }if(flag === "3"){
                            return '查看价格详情'
                        }else {
                            if (typeof v !== 'undefined') {
                                return (v / 10000).toFixed(2)
                            } else if (!v && !m) {
                                return (n / 10000).toFixed(2)
                            } else {
                                return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
                            }
                        }
                    },
                },
                // mounted: function () {
                // },
                components: {
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
                    'index-head': httpVueLoader('/style/components/index_head.vue'),
                    'header-mail': httpVueLoader('/style/components/header_mail.vue'),
                    'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
                },
                mounted: function () {
                    var _this = this
                    this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
                    this.saasId = localStorage.getItem('saasId');
                    this.getMailSiteDetail();
                    this.getMailServiceType();
                    //首页banner
                    this.getBanner('01', 'indexBanner', 10);
                    //广告2
                    this.getBanner('02', 'indexBanner02', 1);
                    //精选服务
                    this.goodFormData.chosenFlag = '1';
                    this.goodFormData.pageSize = 10;
                    this.getMailGoods('chooseGoods')
                    //知识产权
                    this.goodFormData = {}
                    this.goodFormData.pageSize = 8;
                    this.goodFormData.type = '371977891599065088';
                    this.goodFormData.orderBy = 'homePageFlag desc';
                    this.getMailGoods('incubationTypeList')
                    //法律服务
                    this.goodFormData.type = '371979747670859776';
                    this.getMailGoods('designTypeList')
                    //政策申报
                    this.goodFormData.type = '371979827203252224';
                    this.getMailGoods('checkTypeList')
                    //工商财税
                    this.goodFormData.type = '371979918089625600';
                    this.getMailGoods('propertyTypeList')
                    //评估评价
                    this.goodFormData.type = '371980699979194368';
                     this.getMailGoods('technologyTypeList')
                    //检验检测
                    this.goodFormData.type = '371981659690475520';
                    this.getMailGoods('transferTypeList');
                    //科技咨询
                    // this.goodFormData.type = '371980018614509568';
                    // this.getMailGoods('knowledgeTypeList');
                    // cookie用户信息
                    (this.userInfo = JSON.parse(
                        this.$utils.getCookie("USER_INFO")
                    ));
                    // 监听页面滚动，设置导航
                    /**
                     * <ul class="active4"><li class=""><a href="#/service-box">精选<br>服务</a></li>
                     * <li class=""><a href="#/property">知识<br>产权</a></li> <li class=""><a href="#/law">法律<br>服务</a></li>
                     * <li class=""><a href="#/policy">政策<br>申报</a></li>
                     * <li class="changeStyle"><a href="#/business">工商<br>财税</a></li>
                     * <li class=""><a href="#/inspection">检验<br>检测</a></li>
                     * <li class=""><a href="#/technology">科技<br>咨询</a></li></ul>
                     * @type {string[]}
                     */
                    var sections = ['service-box', 'property', 'law', 'policy', 'business', 'inspection', 'technology']
                    window.addEventListener('scroll', function(){
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
                        console.log(_this.changeSelectStyle)
                    }, true)

                    window.addEventListener('hashchange', function() {
                        const hash = location.hash.replace('/', '')
                        $('body,html').animate({
                            scrollTop: $(hash).offset().top
                        },300)
                    })
                },
                methods: {
                    getMailSiteDetail: function () {
                        var vm = this
                        vm.$httpCom.mailSiteDetail().then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.mailSite = res.result
                            }
                        })
                    },
                    getMailServiceType: function () {
                        var vm = this
                        indexApi.mailServiceType().then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.mailServiceTypeList = res.result
                                //知识产权
                                vm.incubationType = res.result.filter(function (s) {
                                    return s.id == res.result[0].id;
                                })[0];
                                //法律服务
                                vm.designType = res.result.filter(function (s) {
                                    return s.id == res.result[1].id;
                                })[0];
                                //政策申报
                                vm.checkType = res.result.filter(function (s) {
                                    return s.id == res.result[2].id;
                                })[0];
                                //工商财税
                                vm.propertyType = res.result.filter(function (s) {
                                    return s.id == res.result[3].id;
                                })[0];
                                // //评估评价
                                vm.technologyType = res.result.filter(function (s) {
                                     return s.id == res.result[4].id;
                                })[0];
                                //检验检测
                                vm.transferType = res.result.filter(function (s) {
                                    return s.id == res.result[5].id;
                                })[0];
                                //科技咨询
                                // vm.knowledgeType = res.result.filter(function (s) {
                                //     return s.id == res.result[6].id;
                                // })[0];
                            }
                        })
                    },
                    getBanner: function (bannerType, key, pageSize) {
                        var vm = this
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

                                })
                            }
                        })
                    },

                    getMailGoods: function (dateKey) {
                        var vm = this
                        indexApi.selectMailGoods(this.goodFormData).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.$data[dateKey] = res.result.list
                                vm.$nextTick(function () {
                                    new Swiper('.service-list', {
                                        slidesPerView: 4,
                                        spaceBetween: 30,
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
