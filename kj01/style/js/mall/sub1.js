// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate', 'img_captcha', 'httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl, validate, captcha, httpLogin) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    mailSite: {},
                    goodList: [],
                    searchForm: {
                        pageSize: 10,
                        type: '',
                        price: '',
                        sort: ''
                    },
                    dicOptsSet: [
                        {
                            code: 'price',
                            label: '服务价格',
                            operationType: 'select',
                            childIndex: -1,
                            valueKey: 'price',
                            valueType: 'string',
                            isMoreShow: 0,
                            isMore: 0,
                            isTop: 0
                        },
                    ],
                    filters: [
                        {
                            value: false,
                            label: '价格排序',
                            seleced: true
                        },
                        // {
                        //     value: false,
                        //     label: '时间排序'
                        // },
                        {
                            value: false,
                            label: '综合排序'
                        }
                    ],
                    options: {
                        selectOpts: [],
                        searchOpts: [],
                        mailServiceTypeList: [],
                    },
                    title: '',
                    pages: '',
                    nameList: [],
                    result: [],
                    // 服务筛选临时缓存数组
                    ser: [],
                    // 价格筛选临时缓存数组
                    pr: [],
                    active: false,
                    activeAll: true,
                    activePriceAll:true,
                    parentId:null,
                    dialogFormVisible: false,
                    formLabelWidth: '120px',
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
                            {required: true, message: '请输入预期价格', trigger: 'blur'},
                        ],
                        contacts: [
                            {required: true, message: '请输入联系人', trigger: 'blur'},
                        ],
                        phone: [
                            {required: true, message: '请填写联系方式',trigger: 'blur'},
                            {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码',trigger: 'blur'}
                        ]

                    },
                },
                filters: {
                    // formatPrice2: function (flag, v, n, m) {
                    //     if (flag === '2') {
                    //         return '面议'
                    //     }if(flag === "3"){
                    //         return '查看价格详情'
                    //     }
                    //     else {
                    //         if (typeof v !== 'undefined') {
                    //             return (v / 10000).toFixed(2)
                    //         } else if (!v && !m) {
                    //             return (n / 10000).toFixed(2)
                    //         } else {
                    //             return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
                    //         }
                    //     }
                    // },
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
                    // 从url获取type的值
                    var type = this.$utils.getReqStr('type');


                    this.searchForm.title = title;
                    this.searchForm.type = type;
                    this.searchForm.orderBy = 'choosePriceTag asc,minPrice asc,price asc';
                    this.getMailGoods();
                    this.getDicList(this.dicOptsSet);
                    this.getMailServiceType();
                    // cookie用户信息
                    this.userInfo = JSON.parse(
                        this.$utils.getCookie("USER_INFO")
                    );


                },
                methods: {
                    //价格判断
                    formatPrice: function (flag, v, n, m) {
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
                                // this.searchForm.orderBy = 'createTime as'
                                this.searchForm.orderBy = ''
                            }
                            if (i === 2) {
                                this.searchForm.orderBy = 'choosePriceTag asc,minPrice asc,price asc'
                            }
                        } else {
                            // this.searchForm.orderBy = ''
                            this.searchForm.orderBy = 'choosePriceTag asc,minPrice asc,price asc'
                        }
                        this.getMailGoods()
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
                    handleSearchForm: function (e, is) {
                        var vm = this

                        console.log(e,'e')
                        if (e.value) {
                            this.searchForm.price = e.value
                        } else {
                            if (e.id==-1){
                                this.searchForm.type = e.parentId
                            } else {
                                if(e.id)
                                  this.searchForm.type = e.id
                                }

                            }

                        if (e.name || e.display) {
                            var ser = []
                            var pr = []
                            if (is == 'server') {
                                let list = e
                                if (this.ser.length >= 1) {
                                    this.ser = []
                                }
                                this.activeAll = false
                                this.ser.push(list)
                                this.options.mailServiceTypeList.forEach(function (item, dici) {
                                    if (e.id == item.id) {
                                        item.selected = true
                                        vm.parentId=e.id;
                                    }
                                    // item.children.forEach(function (item2, dici) {
                                    //     item2.selected = true
                                    // });
                                    item.children.forEach(function (item2, dici) {
                                        if (e.id == item2.id) {
                                            item2.selected = true
                                        }else if (e.parentId=='0'){
                                           if (item2.id==-1){
                                               item2.selected=true
                                           }else {
                                               item2.selected=false

                                           }
                                        }

                                    });
                                })
                            }
                            if (is == 'price') {
                                let list = e
                                if (this.pr.length >= 1) {
                                    this.pr = []
                                }

                                vm.options.searchOpts[0].dictIInfos.forEach(function (item, dici) {
                                    if (e.id == item.id) {
                                        item.selected = true
                                    }
                                })
                                this.activePriceAll=false
                                this.pr.push(list)
                                delete this.searchForm.pageNum
                            }
                            this.result = [...this.ser, ...this.pr]
                            delete this.searchForm.pageNum
                        } else if (e === 'server') {
                            this.result = [...this.ser = [], ...this.pr]
                            this.isActive = e
                            vm.parentId=null;
                            // 清空type
                            delete this.searchForm.type


                        } else if (e === 'price') {
                            this.result = [...this.ser, ...this.pr = []]
                            // 清空价格
                            delete this.searchForm.price
                            delete this.searchForm.pageNum
                        }

                        indexApi.selectMailGoods(this.searchForm).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.goodList = res.result.list
                                vm.$data.pages = res.result || ''
                            }
                        })
                    },
                    remove: function (index) {
                        // this.result.splice(index, 1)
                        var vm = this;

                        this.result = this.result.filter(function (el) {
                            return el.id !== index.id;
                        });

                        if (index.parentId) {
                            this.ser = []
                        } else {
                            this.pr = []
                        }
                        // this.nameList.splice(index.name||index.display, 1)
                        if (index.value) {
                            this.searchForm.price = null
                            delete this.searchForm.pageNum
                            vm.options.searchOpts[0].dictIInfos.forEach(function (item, dici) {
                                    item.selected = false
                            })
                            vm.activePriceAll = true

                        } else {
                            this.options.mailServiceTypeList.forEach(function (item, dici) {
                                item.selected = false
                                item.children.forEach(function (item2, dici) {
                                    item2.selected = false
                                });
                                vm.activeAll = true
                            })
                            this.searchForm.type = null
                            this.parentId=null
                            delete this.searchForm.pageNum

                        }
                        this.getMailGoods();
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
                        this.$httpCom.dictList({dictInfos: keys}).then(function (res) {
                            if (res.code === 'rest.success') {
                                var opts = []
                                opts = res.result.map(function (codes, i) {
                                    var value = vm.searchForm[keys[i].valueKey]
                                    var display = ''
                                    var di = ''
                                    var index = -1
                                    codes.dictIInfos.forEach(function (dic, dici) {
                                        dic.children = []
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
                    // 获取服务类型列表
                    getMailServiceType: function () {
                        var vm = this
                        indexApi.mailServiceType().then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.options.mailServiceTypeList = res.result || []
                                vm.options.mailServiceTypeList.forEach(function (item, si) {

                                    item.children.unshift({ id: "-1", id: -1, parentId:item.id,name: '不限', selected: true })

                                    item.selected = false

                                });

                                // 当url上有type值的时候，设置一级、二级服务类型的选中状态
                                if (vm.searchForm.type) {
                                    var types = []
                                    var parentId
                                    vm.options.mailServiceTypeList.forEach(function (el) {
                                        el.children.forEach(function(item, idx){
                                            if(item.id == vm.searchForm.type){
                                                types = [item]
                                                el.selected = true
                                                parentId = el.id
                                                el.children[0].selected = false
                                                return
                                            }
                                        })
                                        if(el.id == vm.searchForm.type){
                                            types = [el]
                                            parentId = el.id
                                            return
                                        }
                                    });

                                    types[0].selected = true
                                    // 缓存到服务数组中
                                    vm.ser.push(types[0])
                                    vm.activeAll = false
                                    vm.parentId= parentId;
                                    vm.result = types
                                }
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
                    handelSearch: function () {
                        var vm = this
                        vm.searchForm.title = vm.title
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
                },

            });
        })
});
