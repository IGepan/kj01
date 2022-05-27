require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl','httpCartApi','httpOrderApi'],
        function ($, Vue, httpVueLoader, httpUrl,indexApi,httpOrderApi) {
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
                    qUrl:'',
                    detailInfo:[],
                    time:0,
                    price:0

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
                beforeDestroy(){
                    console.log('---')
                },
                mounted(){
                    this.outTradeNo = this.$utils.getReqStr('id');
                    this.getOrderInfo(this.outTradeNo)
                    this.init(this.outTradeNo);
                    var vm=this
                    vm.num=0
                    clearInterval(vm.time)
                    vm.time=setInterval(()=>{
                        vm.num++
                        vm.getQrcode(vm.outTradeNo);
                        if (vm.num >10) {
                            clearInterval(vm.time)
                            this.$dialog.showToast("支付时间超时!")
                            setTimeout(function () {
                                window.location.href = this.$pathPrefix + '/common/servicetrade/qrcode.html?id=' + vm.outTradeNo
                            }, 500)
                        }
                    },5000)
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
                    getOrderInfo: function (id) {
                        var vm = this
                        httpOrderApi.buyerDetail({ id:id}).then(function (res) {
                            if (res.code == 'rest.success') {
                                vm.$data.detailInfo = res.result.details
                                vm.$data.price= res.result.details[0].protocolPrice
                                console.log(vm.$data.price,'vm.price')
                                vm.init(id,vm.$data.price)
                            }
                        })
                    },
                    init(val,p){
                        var vm =this
                        var price=p*100
                        indexApi.getQ({description:"测试", amount:price,outTradeNo:val}).then(function (res) {
                            // res = JSON.parse
                            if(res.code_url){
                                vm.ewmUrl = res.code_url
                                vm.$nextTick(function () {
                                    new QRCode('qrcode', {
                                        text: vm.ewmUrl, // 需要转换为二维码的内容
                                        width: 100,
                                        height: 100,
                                        colorDark: "#000000",
                                        colorLight: "#ffffff",
                                    });
                                })
                            }

                        })
                    },
                    getQrcode(val){
                                var vm = this
                                indexApi.getResult({
                                    outTradeNo: val,
                                    tradeType: 'NATIVE',
                                    payChannel: 'wxPay'
                                }).then(function (res) {
                                    console.log(res.result, 'res.result')
                                    if (res.result && res.result.tradeState == 'SUCCESS') {
                                        clearInterval(vm.time)
                                        indexApi.getUpdateStatus({payStatus: '002', id: val}).then(function (res) {
                                            if (res.code == "rest.success") {
                                                setTimeout(function () {
                                                    window.location.href = this.$pathPrefix + '/common/servicetrade/nativePay.html?id=' + val + '&type=01'
                                                }, 300)
                                            }
                                        })
                                    }else if(res.result && res.result.tradeState == 'PAYERROR'){
                                        clearInterval(vm.time)
                                        indexApi.getUpdateStatus({orderStatus: '008', id: val}).then(function (res) {
                                            if (res.code == "rest.success") {
                                                setTimeout(function () {
                                                    window.location.href = this.$pathPrefix + '/common/servicetrade/nativePay.html?id=' + val + '&type=02'
                                                }, 300)
                                            }
                                        })
                                    }
                                })
                    },
                    goNow(val){
                        indexApi.getResult({
                            outTradeNo: val,
                            tradeType: 'NATIVE',
                            payChannel: 'wxPay'
                        }).then(function (res) {
                            console.log(res.result, 'res.result')
                            if (res.result && res.result.tradeState !== 'PAYERROR') {
                                indexApi.getUpdateStatus({payStatus: '002', id: val}).then(function (res) {
                                    if (res.code == "rest.success") {
                                        setTimeout(function () {
                                            window.location.href = this.$pathPrefix + '/common/servicetrade/nativePay.html?id=' + val + '&type=01'
                                        }, 300)
                                    }
                                })
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