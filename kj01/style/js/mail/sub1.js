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
                    filters: [
                        {
                            value: false,
                            label: '综合排序',
                            seleced: true
                        },
                        {
                            value: false,
                            label: '时间排序'
                        },
                        {
                            value: false,
                            label: '价格排序'
                        }
                    ],
                    options: {
                        selectOpts: [],
                        searchOpts: [],
                        mailServiceTypeList: [],
                    },
                    title:'',
                    pages: '',
                    nameList:[],
                    result: []
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

                    this.searchForm.title=title;
                    this.searchForm.type=type;
                    this.getMailGoods();
                    this.getDicList(this.dicOptsSet);
                    this.getMailServiceType();
                        // cookie用户信息
                        this.userInfo = JSON.parse(
                            this.$utils.getCookie("USER_INFO")
                        );
                },
                methods: {
                    handleFilter: function (i) {
                        if (this.filters[i].seleced) {
                            if (!this.filters[i].value) {
                                this.filters[i].value = true
                            } else {
                                this.filters[i].value = false
                            }
                        } else {
                            this.filters = this.filters.map(function (item, index) {
                                if (index === i) {
                                    item.seleced = true
                                    item.value = true
                                } else {
                                    item.seleced = false
                                    item.value = false
                                }
                                return item
                            })
                        }
                        if (i) {
                            if (i === 1) {
                                this.searchForm.orderBy= 'createTime asc'
                            }
                            if (i === 2) {
                                this.searchForm.orderBy= 'minPrice asc,price asc'
                            }
                        } else {
                            this.searchForm.orderBy =''
                        }
                        this.getMailGoods()
                    },
                    handleSearchForm: function (e){
                        var vm = this
                        // const attributeData = this.getAttributeData(e.target, ['typeid','price','name']);
                        // var dataset = attributeData;
                        if (e.typeid){
                            this.searchForm.type=dataset.typeid
                            this.options.selectOpts.type=dataset.typeid
                        }
                        if (e.price) {
                            this.searchForm.price = dataset.price
                            this.options.selectOpts.price=dataset.price
                        }
                        if(e.name || e.display) {
                            this.nameList.push(e.name || e.display)
                            if(this.nameList.length > 0) {vm.uniq(this.nameList)}
                        }
                        indexApi.selectMailGoods(this.searchForm).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.goodList = res.result.list
                                vm.$data.pages = res.result || ''
                            }
                        })
                    },
                    uniq:function(nameList) {
                        if (nameList.length <= 1) return this.result = nameList
                        nameList.sort()
                        this.result = [nameList[0]]
                        for (let i = 1, len = nameList.length; i < len; i++) {
                            if (nameList[i] !== nameList[i-1]) this.result.push(nameList[i])
                        }
                        // return this.result
                    },
                    remove: function (index) {
                        this.result.splice(index, 1)
                        this.nameList.splice(index, 1)
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
                    addSelectOpts: function (dataset) {
                        let flag = -1;
                        this.options.selectOpts.some(function (item, i) {
                            if (item.code === dataset.code) {
                                flag = i;
                                return true
                            }
                        });
                        if (dataset.value === '-1') {
                            this.options.selectOpts.splice(flag, 1)
                        } else {
                            flag === -1 ? this.options.selectOpts.push(dataset) : (this.options.selectOpts[flag] = dataset)
                        }
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
                    },
                    fwsClick2: function () {
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
                }
            });
        })
});
