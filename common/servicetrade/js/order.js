var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'utils', 'httpVueLoader', 'httpCartApi', 'httpUserAddressApi', 'jqValidate', 'dialog', 'httpCom'], function ($, Vue, dic, utils, httpVueLoader, httpCartApi, httpUserAddressApi, jqValidate, dialog, httpCom) {
        Vue.component('ly-searchbox', httpVueLoader(this.$pathPrefix + '/style/components/searchbox.vue'))
        window.vueDom = new Vue({
            el: '#index_box',
            data: {
                http: httpCartApi,
                shopList: [],
                addressList: [],
                queryOrder: {
                    skuIds: []
                },
                isOpenAddress: false,
                isFullAddress: false,
                addressForm: {
                    id: '',
                    saasId: '',
                    userId: '',
                    contactsName: '',
                    mobile: '',
                    country: '100',
                    province: '',
                    city: '',
                    district: '',
                    location: '',
                    phone: '',
                    email: '',
                    defaultFlag: '0',
                    version: '0'
                },
                isSubmitDisabled: false,
                demandForm: null,
                selecedAddressIndex: -1,
                payOptions: [],
                countryOptions: [{"id": "0", "value": "100", "display": "中国"}],
                provinceOptions: [],
                cityOptions: [],
                districtpayOptions: [],
                httpCom: httpCom
            },
            components: {
                'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
                'ly-footer': httpVueLoader('/style/components/main_footer.vue')
            },
            created: function () {
                this.initPage()
            },
            computed: {
                shopTotal: function () {
                    return this.shopList.reduce(function (total, shop) {
                        return total += shop.details.reduce(function (subtotal, sku) {
                            return subtotal += (sku.subtotal >= 0 ? sku.subtotal : 0)
                        }, 0)
                    }, 0).toFixed(2)
                }
            },
            filters: {
                formatingPrice: function (p) {
                    return p.toFixed(2)
                },
                shopSubtotal: function (shop) {
                    return shop.details.reduce(function (shopSubtotal, sku) {
                        return shopSubtotal += sku.subtotal
                    }, 0).toFixed(2)
                }
            },
            watch: {
                'addressForm.province': function () {
                    this.changeAddress('cityOptions')
                },
                'addressForm.city': function () {
                    this.changeAddress('districtpayOptions')
                }
            },
            methods: {
								getToken: function () {
									var LOGIN_INFO = utils.getCookie(dic.locaKey.LOGIN_INFO);
									var token = '';
									if (LOGIN_INFO && LOGIN_INFO !== 'null') {
									  LOGIN_INFO = JSON.parse(LOGIN_INFO)
									  token = LOGIN_INFO.access_token
									}
									return token
								},
                //IM聊天界面
                onLineConsult: function (shopId, userId) {
                    if (shopId) {
                        this.$root.$chat_im.connect(userId);
                    }
                },
                selectJuan: function (k, v) {
                    if (k.innovationVouchersList[0] === v) {
                        k.innovationVouchersList = [];
                    } else {
                        k.innovationVouchersList = [v];
                    }
                },
                initPage: function () {
                    var infos = sessionStorage.getItem('orderInfo') || sessionStorage.getItem('buyNowdemandForm')
                    infos = infos ? JSON.parse(infos) : ''
                    if (infos) {
                        sessionStorage.removeItem('orderInfo')
                        sessionStorage.removeItem('buyNowdemandForm')
                        if (infos.source === '02') {
                            this.queryOrder = infos
                            this.getOrderInfo()
                        } else if (infos.source === '01') {
                            this.queryOrder = infos
                            this.getBuyNowInfo(infos.skuIds)
                        } else {
                            this.demandForm = infos
                            this.getBuyNowInfo(infos.buyNowData);
                        }
                    } else {
                        this.$dialog.showToast("没有订单数据！")
                    }

                    this.getAddressList()
                    this.getPayOptions()
                    this.addressSetInfo()
                },
                getOrderInfo: function () {
                    var vm = this
                    httpCartApi.getOrderInfo(this.queryOrder).then(function (res) {
                        if (res.code == 'rest.success') {
                            res.result.length && res.result.forEach(function (shop) {
                                shop.details.forEach(function (sku) {
                                    sku.requirement = ''
                                    sku.protocolPrice = sku.price !== undefined ? sku.price : ''
                                    sku.subtotal = sku.price !== undefined ? (sku.number * sku.price) : (sku.minPrice !== undefined ? (sku.number * sku.minPrice) : (sku.protocolPrice * sku.number))
                                })
                                shop.comment = ''
                                shop.payMode = '001'
                            })
                            //当有券的时候，回传的也是innovationVouchersList， 所以拷贝一份出来初始化
                            for (var i = 0, l = res.result.length; i < l; i++) {
                                if (res.result[i].innovationVouchersList) {
                                    res.result[i].innovationVouchersList1 = res.result[i].innovationVouchersList;
                                }
                                res.result[i].innovationVouchersList = [];
                            }
                            vm.$data.shopList = res.result
                        }
                    })
                },
                getBuyNowInfo: function (data) {
                    var vm = this;
										var token = this.getToken();
                    token&&httpCartApi.buyNow({list: data}).then(function (res) {
                        if (res.code == 'rest.success') {
                            res.result.length && res.result.forEach(function (shop) {
                                shop.details.forEach(function (sku) {
                                    sku.requirement = ''
                                    sku.protocolPrice = sku.price !== undefined ? sku.price : ''
                                    sku.subtotal = sku.price !== undefined ? (sku.number * sku.price) : (sku.minPrice!==undefined?(sku.number * sku.minPrice):0)
                                })
                                shop.comment = ''
                                shop.payMode = '001'
                            })
                            //当有券的时候，回传的也是innovationVouchersList， 所以拷贝一份出来初始化
                            for (var i = 0, l = res.result.length; i < l; i++) {
                                if (res.result[i].innovationVouchersList) {
                                    res.result[i].innovationVouchersList1 = res.result[i].innovationVouchersList;
                                }
                                res.result[i].innovationVouchersList = [];
                            }
                            vm.$data.shopList = res.result
                        } else {
                            vm.$dialog.showToast(res.desc)
                        }
                    })
                },
                addOrder: function () {
                    var vm = this
                    $('.orderValiform').validate('submitValidate', function (val) {
                        var contactsId = ''
                        var diagnosis = ''
                        if (val) {
                            if (!vm.addressList.length) {
                                vm.$dialog.showToast('请先添加委托人信息！')
                                return
                            } else if (vm.selecedAddressIndex === -1 && !vm.addressList.some(function (add) {
                                return add.defaultFlag === '1'
                            })) {
                                vm.$dialog.showToast('请选择委托人信息！')
                                return
                            }
                            contactsId = vm.selecedAddressIndex === -1 ? vm.addressList.filter(function (add) {
                                return add.defaultFlag === '1'
                            })[0].id : vm.addressList[vm.selecedAddressIndex].id
                            !vm.isSubmitDisabled && (vm.isSubmitDisabled = true, httpCartApi.getFormToken().then(function (res) {
                                    if (res.code == 'rest.success') {
                                        if (vm.demandForm) {
                                            diagnosis = {}
                                            diagnosis.title = vm.demandForm.planName
                                            diagnosis.budget = vm.demandForm.budget
                                            diagnosis.period = vm.demandForm.period
                                            diagnosis.sceneId = vm.demandForm.sceneId
                                            diagnosis.contents = vm.demandForm.contents
                                            diagnosis.tags = vm.demandForm.industry.concat(vm.demandForm.servicesTags).map(function (tag) {
                                                delete tag.name
                                                return tag
                                            })
                                        }
                                        httpCartApi.addOrder({
                                            contactsId: contactsId,
                                            formToken: res.result,
                                            orders: vm.shopList,
                                            diagnosis: diagnosis
                                        }).then(function (res) {
                                            if (res.code == 'rest.success') {
                                                vm.$dialog.showToast('提交成功')
                                                setTimeout(function () {
                                                    location.href = vm.$pathPrefix + '/common/buyer/order/?orderStatusFilter=01'
                                                }, 1000)
                                            } else {
                                                vm.$dialog.showToast(res.desc)
                                                vm.isSubmitDisabled = false
                                            }
                                        }).catch(function () {
                                            vm.isSubmitDisabled = false
                                        })
                                    } else {
                                        vm.isSubmitDisabled = false
                                    }
                                }).catch(function () {
                                    vm.isSubmitDisabled = false
                                })
                            )
                        }
                    })
                },
                getPayOptions: function () {
                    var vm = this
                    httpCartApi.dictSelect({code: 'pay_mode'}).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.$data.payOptions = res.result
                        }
                    })
                },
                initAddressSelectOpts: function (pid, type, next) {
                    var vm = this
                    httpCartApi.dictSelect({code: 'administrative_division', parentId: pid}).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm[type] = res.result
                            if (next !== 'districtpayOptions') {
                                vm.initAddressSelectOpts(res.result[0].id, next, 'districtpayOptions')
                            }
                        }
                    })
                },
                changeAddress: function (type) {
                    var vm = this
                    var pid = 0
                    if (type === 'cityOptions') {
                        this.provinceOptions.some(function (opt) {
                            if (opt.value === vm.addressForm.province) {
                                pid = opt.id
                                return true
                            }
                        })
                    } else {
                        this.cityOptions.some(function (opt) {
                            if (opt.value === vm.addressForm.city) {
                                pid = opt.id
                                return true
                            }
                        })
                    }
                    httpCartApi.dictSelect({code: 'administrative_division', parentId: pid}).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm[type] = res.result
                            if (type === 'cityOptions') {
                                vm.isOpenAddress && vm.addressForm.city === '' && (vm.addressForm.city = res.result[0].value)
                                vm.changeAddress('districtpayOptions')
                            } else {
                                vm.isOpenAddress && vm.addressForm.district === '' && (vm.addressForm.district = res.result[0].value)
                            }
                        }
                    })
                },
                changeFullAddress: function () {
                    this.isFullAddress = !this.isFullAddress
                },
                getAddressList: function () {
                    var vm = this;
										var token = this.getToken();
                   token && httpUserAddressApi.selectByUserId().then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.selecedAddressIndex !== -1 && (res.result[vm.selecedAddressIndex].activated = true)
                            vm.$data.addressList = res.result
                        }
                    })
                },
                addressSave: function () {
                    var vm = this
                    $('.valiform').validate('submitValidate', function (val) {
                        if (val) {
                            vm.addressForm.saasId = sessionStorage.getItem('saasId')
                            vm.addressForm.id === '' ? vm.addressInsert() : vm.addressUpdate()
                        }
                    })
                },
                phoneValid: function (v, o, callback) {
                    if (v.length > 12) {
                        callback(o, '长度为12个字符')
                    } else {
                        callback(o)
                    }
                },
                emailValid: function (v, o, callback) {
                    if (v.length > 50) {
                        callback(o, '长度为50个字符')
                    } else if (v && !/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(v)) {
                        callback(o, '邮箱格式错误')
                    } else {
                        callback(o)
                    }
                },
                protocolPriceValid: function (v, o, callback) {
                    var tv, sku, min, max
                    sku = this.shopList[o.getAttribute('data-shopIndex')].details[o.getAttribute('data-skuIndex')]
                    min = sku.minPrice
                    max = sku.maxPrice
                    if (v) {
                        tv = parseInt(v)
                        if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(v.trim())) {
                            callback(o, '协议单价必须为正整数或正小数')
                        } else if (tv < min || tv > max) {
                            callback(o, '协议单价区间为' + min + '-' + max)
                        } else {
                            callback(o)
                        }
                    } else {
                        min ? callback(o, '协议单价必填，协议单价区间为' + min + '-' + max) : callback(o, '协议单价必填')
                    }
                },
                addressSetInfo: function (id) {
                    if (typeof id === 'string') {
                        this.addressGet(id)
                    } else {
                        for (const key in this.addressForm) {
                            if (key === 'country') {
                                this.addressForm[key] = '100'
                            } else if (key === 'defaultFlag' || key === 'version') {
                                this.addressForm[key] = '0'
                            } else {
                                this.addressForm[key] = ''
                            }
                        }
                        this.initAddressSelectOpts('0', 'provinceOptions', 'cityOptions')
                        this.isOpenAddress = false
                        $('.valiform').validate('clear')
                    }
                },
                addressInsert: function () {
                    var vm = this
                    httpUserAddressApi.addressInsert(this.addressForm).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.$dialog.showToast("添加成功！")
                            vm.getAddressList()
                            vm.addressSetInfo()
                        }
                    })
                },
                addressUpdate: function () {
                    var vm = this
                    httpUserAddressApi.addressUpdate(this.addressForm).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.$dialog.showToast("修改成功！")
                            vm.getAddressList()
                            vm.addressSetInfo()
                        }
                    })
                },
                addressGet: function (id) {
                    var vm = this
                    httpUserAddressApi.addressdetail({id: id}).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.$data.addressForm = res.result
                            vm.changeAddress('cityOptions')
                            vm.isOpenAddress = true
                        }
                    })
                },
                addressDel: function (address) {
                    var vm = this
                    httpUserAddressApi.addressDelete({id: address.id, version: address.version}).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.getAddressList()
                        }
                    })
                },
                addressSetDefault: function (address) {
                    var vm = this
                    httpUserAddressApi.addressSetDefault({
                        id: address.id,
                        version: address.version
                    }).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.getAddressList()
                        }
                    })
                },
                selectAddress: function (i) {
                    var vm = this
                    this.selecedAddressIndex !== -1 && (this.$data.addressList[this.selecedAddressIndex].activated = false)
                    this.selecedAddressIndex = i
                    this.$nextTick(function () {
                        vm.$set(vm.addressList[i], 'activated', true)
                    })
                },
                changeNum: function (detail, flag) {
                    var number = flag ? detail.number + 1 : detail.number - 1
                    httpCartApi.shopcarChangeNum({
                        skuId: detail.skuId,
                        num: number
                    }).then(function (res) {
                        if (res.code == 'rest.success') {
                            detail.number = number
                            //如果价格为面议或者自定义，则根据协议单价计算金额
                            if (detail.choosePriceTag !== '0' || detail.choosePriceTag !== '1') {
                                detail.subtotal = detail.price !== undefined ? (detail.number * detail.protocolPrice) : (detail.number * detail.protocolPrice)
                            } else {
                                detail.subtotal = detail.protocolPrice * detail.number
                            }
                        }
                    })
                },
                subtractNumber: function (i, s) {
                    var detail = this.shopList[i].details[s]
                    if (detail.number > 1) {
                        this.changeNum(detail, false)
                    }
                },
                //修改自定义价格总金额显示
                changePrice: function (i,s) {
                    var detail = this.shopList[i].details[s]
                    httpCartApi.shopcarChangeNum({
                        skuId: detail.skuId,
                        num: detail.number
                    }).then(function (res) {
                        if (res.code == 'rest.success') {
                            //如果价格为面议或者自定义，则根据协议单价计算金额
                            if (detail.choosePriceTag !== '0' || detail.choosePriceTag !== '1') {
                                detail.subtotal = detail.price !== undefined ? (detail.number * detail.protocolPrice) : (detail.number * detail.protocolPrice)
                            } else {
                                detail.subtotal = detail.protocolPrice * detail.number
                            }
                        }
                    })
                },
                addNumber: function (i, s) {
                    var detail = this.shopList[i].details[s]
                    if (detail.number < detail.stock) {
                        this.changeNum(detail, true)
                    }
                }
            }
        })
    })
})
