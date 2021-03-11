// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate','img_captcha','httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl,validate,captcha,httpLogin) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    mailSite: {},
                    goodList: [],
                    searchForm: {
                        pageSize: 10,
                        type:'',
                        price:'',
                        sort:''
                    },
                    dicOptsSet: [
                        { code: 'price', label: '服务价格', operationType: 'select', childIndex: -1, valueKey: 'price', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0 },
                    ],
                    options: {
                        selectOpts: [],
                        searchOpts: [],
                        mailServiceTypeList: [],
                    },
                    title:'',
                    pages: ''
                },
                filters: {
                    formatPrice2: function (flag, v, n, m) {
                        if(flag === '1') {
                            return '面议'
                        } else {
                            if(typeof v !== 'undefined') {
                                return (v / 10000).toFixed(2)
                            } else if(!v && !m) {
                                return (n / 10000).toFixed(2)
                            } else {
                                return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
                            }
                        }
                    },
                },
                mounted: function () {
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
                    'index-head': httpVueLoader('/style/components/index_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'header-mail': httpVueLoader('/style/components/header_mail.vue'),
                    'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
                    'pages': httpVueLoader('/style/components/pages.vue')
        },
                created: function () {
                    var title = this.$utils.getReqStr('title');
                    var type = this.$utils.getReqStr('type');

                    this.searchForm.title=title
                    this.searchForm.type=type
                    this.getMailGoods()
                    this.getDicList(this.dicOptsSet)
                    this.getMailServiceType()
                },
                methods: {
                    handleSearchForm: function (e){
                        var vm = this
                        var dataset = this.getAttributeData(e.target, ['typeid','price','order_by_1','order_by_2','order_by_3']);

                        if (dataset.typeid){
                            this.searchForm.type=dataset.typeid
                            this.options.selectOpts.type=dataset.typeid
                        }
                        if (dataset.price) {
                            this.searchForm.price = dataset.price
                            this.options.selectOpts.price=dataset.price
                        }
                        if (dataset.order_by_1) {
                            this.searchForm.orderBy=dataset.order_by_1
                        }
                        if (dataset.order_by_2) {
                            this.searchForm.orderBy=dataset.order_by_2
                        }
                        if (dataset.order_by_3) {
                            this.searchForm.orderBy=dataset.order_by_3
                        }

                        indexApi.selectMailGoods(this.searchForm).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.goodList = res.result.list
                                vm.$data.pages = res.result || ''
                            }
                        })
                    },
                    getMailGoods: function () {
                        var vm = this
                        indexApi.selectMailGoods(this.searchForm).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.goodList = res.result.list
                                vm.$data.pages = res.result || ''
                            }
                        })
                    },
                    getDicList: function (keys) {
                        var vm = this
                        this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
                            if (res.code === 'rest.success') {
                                var opts = []
                                opts = res.result.map(function (codes, i) {
                                    var value = vm.searchForm[keys[i].valueKey]
                                    var display = ''
                                    var di = ''
                                    var index = -1
                                    codes.dictIInfos.forEach(function (dic, dici) {
                                        dic.children = []
                                        if (value) {
                                            dic.selected = value === dic.value
                                        } else {
                                            dic.selected = !dici
                                        }
                                    })
                                    codes.valueType = keys[i].valueType
                                    codes.label = keys[i].label
                                    codes.operationType = keys[i].operationType
                                    codes.isTop = keys[i].isTop
                                    codes.valueKey = keys[i].valueKey
                                    codes.isMoreShow = keys[i].isMoreShow
                                    codes.isMore = keys[i].isMore
                                    codes.childIndex = value ? index : keys[i].childIndex
                                    value && vm.addSelectOpts({
                                        di: di,
                                        pi: i + 1 + '',
                                        value: value,
                                        code: codes.code,
                                        label: codes.label,
                                        display: display
                                    })
                                    return codes
                                });
                                vm.options.searchOpts = opts;
                            }
                        })
                    },
                    bindPageChange: function (e) {
                        this.$data.searchForm.pageNum = e;
                        this.getMailGoods()
                    },
                    getMailServiceType: function () {
                        var vm = this
                        indexApi.mailServiceType().then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.options.mailServiceTypeList = res.result
                            }
                        })
                    },
                    getAttributeData: function (el, keys) {
                        var dataset = {}
                        if (el.dataset) {
                            dataset = el.dataset
                        } else {
                            keys.forEach(function (tkey) {
                                dataset[tkey] = el.getAttribute('data-' + tkey);
                            })
                        }
                        return dataset
                    },
                    handelSearch:function (){
                        var vm = this
                        vm.searchForm.title=vm.title
                        indexApi.selectMailGoods(this.searchForm).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.goodList = res.result.list
                                vm.$data.pages = res.result || ''
                            }
                        })
                    }
                }
            });
        })
});
