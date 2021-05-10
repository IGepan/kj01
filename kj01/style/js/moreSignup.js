// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/aindex.js', 'fileSaver', 'httpUrl', 'jqValidate'],
        function ($, dic, Vue, httpVueLoader, indexApi, fileSaver, httpUrl, jqValidate) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    breadcrumb: [
                        {
                            url: '/aindex.html',
                            label: '活动'
                        },
                        {
                            url: '/alist.html',
                            label: '活动列表'
                        },
                        {
                            label: '详情',
                            url: ''
                        },
                        {
                            label: '报名'
                        }
                    ],
                    detail: '',
                    formData: {
                        activeId: '',
                        groupEnrollList: []
                    },
                    company: '',
                    rows: 0,
                    companyRow: null,
                    tempEnroll: null,
                    companyList: [],
                    isAdd: false,
                    detailInfo: {}
                },
                filters: {
                    formatTime: function (v) {
                        return v ? v.split(' ')[0] : ''
                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'sub-head': httpVueLoader('/style/components/asub_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },
                created: function () {
                    this.initData()
                },
                mounted: function () {
                    var vm = this
                    document.addEventListener('click', function (e) {
                        vm.companyList = []
                    })
                },
                watch: {
                  'formData.groupEnrollList' () {
                    this.initUserInfo()
                  }
                },
                methods: {
                    initData: function () {
                        this.saasId = localStorage.getItem('saasId');
                        var id = this.$utils.getReqStr('id')
                        this.breadcrumb[2].url = '/adetail.html?id=' + id
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
                        if (this.userInfo && this.userInfo.userName) {
                            this.formData.activeId = id;
                            id && this.getDetailInfo(id) && this.getEnrollInfo(id);
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    initUserInfo: function () {
                        // $('#0_index_1').attr('v-model', this.detailInfo.realName | '');
                        // $('#0_index_2').attr('v-model', this.detailInfo.job | '');
                        // $('#0_index_3').attr('v-model', this.detailInfo.phone | '');
                        var keymaps = {
                            '01': {
                                '姓名': 'realName',
                                '职务': 'job',
                                '手机': 'phone'
                            }
                            // '02': {
                            //     '姓名': 'contacts',
                            //     '手机': 'contactsPhone'
                            // }
                        }

                        console.log(this.formData.groupEnrollList,'this.formData.groupEnrollList')
                        try {
                            for (let item of this.formData.groupEnrollList[0]) {
                                this.$set(item, 'value', this.detailInfo[keymaps[this.detailInfo.identityType][item.columnName]])
                            }
                        } catch (e) {}



                    },

                    getDetailInfo: function (id) {
                        var vm = this;
                        indexApi.selectIssueDetail({id: id || this.detail.id}).then(function (res) {
                            res.result.styles = {
                                backgroundImage: 'url(' + res.result.posterUrl + ')'
                            }
                            vm.detail = res.result ? res.result : {}
                        });
                        /**
                         * 获取用户信息
                         */
                        indexApi.detail().then((res) => {
                            vm.detailInfo = res.result;
                            if (res.result.companyName) {
                                vm.company = res.result.companyName
                            }else {
                                vm.company = res.result.organizationName;
                            }
                        });
                        return 1;
                    },
                    getEnrollInfo: function (id) {
                        var vm = this;
                        indexApi.getUserLastEnrollInfoByActiveId({id: id || this.detail.id}).then(function (res) {
                            var companyColumnId = ''
                            var company = ''
                            res.result.enrollColumnList.some((item, i) => {
                                if (item.columnType === '01') {
                                    company = JSON.parse(JSON.stringify(item))
                                    return true
                                }
                            });
                            company.message = ''
                            vm.tempEnroll = res.result.enrollColumnList
                            vm.companyRow = company
                            vm.isAdd = true
                            vm.handleAddPerson()
                        })
                        return 1;
                    },
                    getCompanyList(key) {
                        if (key) {
                            var vm = this;
                            indexApi.enterpriseTopList({name: key}).then(function (res) {
                                vm.companyList = res.data
                            })
                        }
                        return 1;
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
                    handleAddPerson() {
                        if (this.isAdd) {
                            var row = JSON.parse(JSON.stringify(this.tempEnroll))
                            var list = this.formData.groupEnrollList
                            row.forEach(function (item) {
                                item.message = ''
                            })
                            list.push(row)
                            this.formData.groupEnrollList = list
                            this.rows++
                        }
                    },
                    handleDelPerson(e) {
                        var dataset = this.getAttributeData(e.currentTarget, ['index']);
                        this.formData.groupEnrollList.splice(dataset.index, 1)
                        this.rows--
                    },
                    handleCompany: function (e) {
                        this.company = e.target.innerText
                        this.companyList = []
                    },
                    bindcompanyInput: function (e) {
                        this.getCompanyList(e.target.value)
                    },
                    bindcompanyInputBlur: function (e) {
                        var eItem = this.companyRow
                        // eItem.isNull && (!this.company || !this.detailInfo.companyName) && (flag = false, eItem.message = eItem.columnName + '不允许为空');
                        eItem.isNull && !this.company && (flag = false, eItem.message = eItem.columnName + '不允许为空');
                        eItem.value && eItem.columnType === '10' && !this.checkPhone(this.company) && (flag = false, eItem.message = eItem.columnName + '所填不是有效手机号码');
                        this.companyRow = eItem
                    },
                    bindcompanyInputFocus: function (e) {
                        var eItem = this.companyRow
                        eItem.message = ''
                        this.companyRow = eItem
                    },
                    bindInputFocus: function (e) {
                        var dataset = this.getAttributeData(e.target, ['di', 'pi']);
                        var eItem = this.formData.groupEnrollList[dataset.pi][dataset.di]
                        eItem.message = ''
                        this.formData.groupEnrollList[dataset.pi][dataset.di] = eItem
                    },
                    bindInputBlur: function (e) {
                        var dataset = this.getAttributeData(e.target, ['di', 'pi']);
                        var eItem = this.formData.groupEnrollList[dataset.pi][dataset.di]
                        eItem.isNull && !eItem.value && (flag = false, eItem.message = eItem.columnName + '不允许为空');
                        eItem.value && eItem.columnType === '10' && !this.checkPhone(eItem.value) && (flag = false, eItem.message = eItem.columnName + '所填不是有效手机号码');
                        eItem.value && eItem.columnType === '02' && !this.checkEmail(eItem.value) && (flag = false, eItem.message = eItem.columnName + '所填不是有效邮箱');
                        eItem.value && eItem.columnType === '19' && !this.checkIdCard(eItem.value) && (flag = false, eItem.message = eItem.columnName + '所填不是有效身份证');
                        this.formData.groupEnrollList[dataset.pi][dataset.di] = eItem
                    },
                    checkEmail(value) {
                        if (value != "" && !/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
                            return false
                        } else {
                            return true
                        }
                    },
                    checkPhone(phone) {
                        if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone))) {
                            return false;
                        } else {
                            return true
                        }
                    },
                    checkIdCard(value) {
                        let flg = true;
                        //地址编码
                        var city = {
                            11: "北京",
                            12: "天津",
                            13: "河北",
                            14: "山西",
                            15: "内蒙古",
                            21: "辽宁",
                            22: "吉林",
                            23: "黑龙江",
                            31: "上海",
                            32: "江苏",
                            33: "浙江",
                            34: "安徽",
                            35: "福建",
                            36: "江西",
                            37: "山东",
                            41: "河南",
                            42: "湖北 ",
                            43: "湖南",
                            44: "广东",
                            45: "广西",
                            46: "海南",
                            50: "重庆",
                            51: "四川",
                            52: "贵州",
                            53: "云南",
                            54: "西藏",
                            61: "陕西",
                            62: "甘肃",
                            63: "青海",
                            64: "宁夏",
                            65: "新疆",
                            71: "台湾",
                            81: "香港",
                            82: "澳门",
                            91: "国外"
                        };
                        if (!city[value.substr(0, 2)]) {
                            flg = false;
                        }
                        //检查身份证格式及长度
                        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
                            flg = false;
                        }
                        //生日日期是否正确
                        if (value.length == 15) {
                            var reg = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                            var arrSplit = value.match(reg);
                            var dtmBirth = new Date('19' + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                            var bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                            if (!bGoodDay) {
                                flg = false;
                            }
                        }
                        if (value.length == 18) {
                            var reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                            var arrSplit = value.match(reg);
                            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                            var bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                            if (!bGoodDay) {
                                flg = false;
                            }
                        }
                        //检查身份证号码末位校验码
                        var valnum, nTemp = 0;
                        // 加权因子
                        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        // 校验位
                        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                        if (value.length == 15) {
                            //把身份证号码转为18位
                            value = value.substr(0, 6) + '19' + value.substr(6, value.length - 6);
                        }
                        for (var i = 0; i < 17; i++) {
                            nTemp += value.substr(i, 1) * factor[i];
                        }
                        valnum = parity[nTemp % 11];
                        if (valnum != value.substr(17, 1)) {
                            flg = false;
                        }
                        return flg;

                    },
                    checkForm: function () {
                        var flag = true
                        var vm = this
                        this.formData.groupEnrollList.forEach(function (item) {
                            item.forEach(function (sitem) {
                                if (sitem.columnType === '01') {
                                    !vm.company && (flag = false, vm.companyRow.message = sitem.columnName + '不允许为空');
                                    vm.company && (sitem.value = vm.company);
                                    return 1;
                                } else {
                                    sitem.isNull && !sitem.value && (flag = false, sitem.message = sitem.columnName + '不允许为空');
                                    sitem.columnType === '10' && !vm.checkPhone(sitem.value) && (flag = false, sitem.message = sitem.columnName + '所填不是有效手机号码');
                                    sitem.value && sitem.columnType === '02' && !vm.checkEmail(sitem.value) && (flag = false, sitem.message = sitem.columnName + '所填不是有效邮箱');
                                    sitem.value && sitem.columnType === '19' && !vm.checkIdCard(sitem.value) && (flag = false, sitem.message = sitem.columnName + '所填不是有效身份证');
                                }
                            })
                        })
                        return flag
                    },
                    handleFormSubmit: function () {
                        var vm = this;
                        if (this.checkForm()) {
                            var data = JSON.parse(JSON.stringify(this.formData));
                            data.groupEnrollList = data.groupEnrollList.map((item) => {
                                item = item.map((sitem) => {
                                    return {
                                        enrollColumnId: sitem.id,
                                        value: sitem.value
                                    }
                                })
                                return item
                            })
                            indexApi.groupEnrollSubmit(data).then(function (res) {
                                if (res.code === 'rest.success') {
                                    setTimeout(function () {
                                        var referrer = document.referrer
                                        var toUrl = referrer
                                        if (referrer.indexOf('/common/login.html') !== -1) {
                                            toUrl = '/aindex.html'
                                        }
                                        window.location.href = toUrl
                                    }, 1000);
                                }
                            })
                        } else {
                            vm.$dialog.showToast('请完善表单信息！');
                        }
                    }
                }
            });
        })
});
