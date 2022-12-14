require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl','httpCartApi','httpOrderApi','httpUser',],
        function ($, Vue, httpVueLoader, httpUrl,indexApi,httpOrderApi,httpUser) {
            new Vue({
                el: '#index_box',
                data: {
                    // sIndex: 8,
                    sIndex: 6,
                    newsList:[],
                    detailActive:0,
                    details:'',
                    id:'',
                    ewmUrl:'',
                    queryForm:{
                        pageNum:1,
                        pageSize:10,
                        total:0,
                    },
                    breadcrumb: [
                        // {
                        //   url: '/aindex.html',
                        //   label: '活动'
                        // },
                        // {
                        //   url: '/atList.html',
                        //   label: '品牌活动列表'
                        // },
                        {
                            url: '/alist.html',
                            label: '活动列表'
                        },
                        {
                            label: '详情'
                        }
                    ],
                    pages:0,
                    nowIndex:1,//默认第一个tab为激活状态
                    searchForm: {
                        pageNum: 1,
                        pageSize: 10,
                        classType:"2",
                    },
                    tt:{},
                    dataList:[],
                    outTradeNo:'',
                    type:'',
                    price:0,
                    detailInfo:[]
                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
                    'ly-footer': httpVueLoader('/style/components/main_footer.vue')
                    // 'pages': httpVueLoader('/style/components/pages.vue'),
                },
                filters: {
                    formatTime: function (v) {
                        if (v) {
                            v = v.split(' ')[0]
                            v = v.replace(/-/g,'.')
                            return v
                        } else {
                            return ''
                        }
                    }
                },
                mounted(){
                    this.outTradeNo = this.$utils.getReqStr('id');
                    this.type=this.$utils.getReqStr('type');
                    this.init(this.outTradeNo);
                    console.log(this.type,'tyep')
                    // this.init(this.outTradeNo);
                    this.getQrcode(this.outTradeNo);
                    // var qrcode= new QRCode('qrcode', {
                    //
                    //     text: 'weixin://wxpay/bizpayurl?pr=onwXorVzz', // 需要转换为二维码的内容
                    //     width: 100,
                    //     height: 100,
                    //     colorDark: "#000000",
                    //     colorLight: "#ffffff",
                    // });
                    // qrcode.makeCode();
                    // if(this.id) {
                    //     this.goDetail(this.id)
                    // }
                    // this.getDataList();
                    // var nowIndex = this.$utils.getReqStr('nowIndex')
                    // if(nowIndex) this.nowIndex = parseInt(nowIndex);
                    // this.getcmsList()
                },
                methods: {
                    goDetail(id){
                        var vm = this;
                        indexApi.getInfrom({
                            activityId:id
                        }).then(function (res) {
                            vm.$data.detailActive=1;
                            vm.$data.details=res.result
                        })
                    },
                    goPage(index) {
                        var _this = this;
                        httpUser.detail().then(function (res) {
                            // console.log('res',res.result)
                            _this.userInfo=res.result
                            if(!_this.userInfo){
                                this.$dialog.showToast("请先登录")
                                window.location.href =this.$pathPrefix+'/common/login.html';
                            }else {
                                window.location.href= this.$pathPrefix + '/common/buyer/order/?orderStatusFilter=01'
                            }
                            // _this.getPolicyNoticeList(params);
                        });
                    },
                    init(val){
                        var vm =this
                            httpOrderApi.buyerDetail({ id: val }).then(function (res) {
                                if (res.code == 'rest.success') {
                                    vm.$data.detailInfo = res.result.details
                                }
                            })
                    },
                    getQrcode(val){
                        var vm =this
                        indexApi.getResult({
                            outTradeNo: val,
                            tradeType: 'NATIVE',
                            payChannel: 'wxPay'
                        }).then(function (res) {
                            console.log(res.result, 'res.result')
                            if (res.result && res.result.tradeState == 'SUCCESS') {
                                vm.price=res.result.amountPayerTotalDecimals
                                // indexApi.getUpdateStatus({payStatus: '002', id: val}).then(function (res) {
                                //     if (res.code == "rest.success") {
                                //         setTimeout(function () {
                                //             window.location.href = this.$pathPrefix + '/common/servicetrade/nativePay.html?id=' + val + '&type=01'
                                //         }, 300)
                                //     }
                                // })
                            }
                        })

                    },
                    getDataList(){
                        var vm = this;
                        indexApi.selectBan(this.searchForm).then(function (res) {
                         console.log(res,'res')
                            vm.$data.tt=res.result
                            vm.$data.dataList=res.result.list
                            vm.pages = res.result || ''
                            // res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
                        })
                    },
                    bindPageChange: function (e) {
                        this.$data.searchForm.pageNum = e;
                        this.getDataList()
                    },
                }
            })
        })
})