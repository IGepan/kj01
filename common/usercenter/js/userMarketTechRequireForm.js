// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, userCenterApi) {
            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            Vue.component('vue-ueditor-wrap', VueUeditorWrap);

            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,
                    // list: [],
                    // activeIndex: 0,
                    // isAll: false,
                    // userInfo: {},
                    // page: 1,
                    // pageSize: 20,
                    // totalPage: 1,
                    ueditorConfig: {
                        initialFrameHeight: 180,
                        maximumWords: 5000
                    },
                    // sels: [],
                    // sysUnread: '',
                    // busUnread: '',
                    areaList: [],
                    "intended_price_list": [
                        { "name": "金额", "value": 0 },
                        { "name": "面议", "value": 1 },
                    ],
                    "intended_price": 0,


                    // 筛选
                    "demand_case_list": [
                        { "id": 0, "display": "未委托经纪人" },
                        { "id": 1, "display": "已委托经纪人" },
                        { "id": 2, "display": "已委托多个经纪人" },
                    ],
                    "demand_case": "",//需求来源

                    "title": "",//需求名称：
                    "industry_area_list": [],//行业类型
                    "industry_area": '',//行业类型下拉选择框选中值
                    "key_words": "",//关键字：
                    // 筛选
                    "achievement_demand_type_list": [],//需求类型：
                    "achievement_demand_type": "",//需求类型：
                    "cooperation_mode_list": [],//合作方式
                    "cooperation_mode": "",//合作方式
                    "budget": "",
                    "demandDes": "",//技术描述：
                    "technicalNorm": "",//技术指标：
                    "otherDes": "",//其他描述：

                    "inputEntifyReqType": true,


                    "proRequireForm": {
                        "demandIndustryType": [],
                        "title": "",
                        "demandType": "",
                        "budget": "",
                        "cooperationMode": "",
                        "demandDes": "",
                        "technicalNorm": "",
                        "otherDes": "",
                        "area": "",
                        "companyName": "",
                    }, // 需求d对象


                    "secondOptions": [],
                    "firstShow": false,
                    "textList": [], // 标签显示出来的数组
                    "options": [],
                    "tagList": [],


                    "secondIndustryOptions": [],
                    "firstIndustryShow": false,
                    "textIndustryList": [], // 行业类型显示出来的数组
                    "optionsIndustry": [],
                    "industryList": [],
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                watch: {
                    intended_price(newName, oldName) {
                        var _this = this;
                        console.log(newName)
                        _this.proRequireForm.budget = newName == 1 ? 0 : ""
                    },

                },
                created: function () {
                    var _this = this;

                    // this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
                    // this.getMessageApi();
                    // this.checkUserMarketPart('jishurenzheng');
                    // 查询下拉框字典
                    _this.find_dictionary_type_list();

                    _this.selectArea();
                    // 查询树状
                    _this.findTechPatentTree("tag");
                    _this.findTechIndustryType("industryType");

                    // 若返显
                    var urlData = _this.$utils.urlPathParameters();
                    console.log(_this.$utils.validatesEmpty(urlData))
                    if (_this.$utils.validatesEmpty(urlData)) {
                        _this.tech_type = urlData.type;
                        var id = urlData.id;
                        _this.findRequireDetails(id);
                    }
                },
                components: {
                    'vue-ueditor-wrap': VueUeditorWrap,
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
                },
                methods: {
                    //查询地区
                    selectArea() {
                        userCenterApi.selectAllArea().then(res => {
                            this.areaList = res.result
                        });
                    },
                    ///////////查询三级级联////////
                    // 查询树状（标签）
                    findTechPatentTree: function (form) {
                        var _this = this;
                        userCenterApi.find_list_tag_tree(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var data = res.data;
                            console.log(data);
                            data.forEach(one => {
                                one.children.forEach(second => {
                                    second.children.forEach(three => {
                                        three.active = false;
                                    });
                                });
                            });
                            _this.options = data;
                            console.log(_this.options)
                        })
                    },

                    // 查询树状(行业类型)
                    findTechIndustryType: function (form) {
                        var _this = this;
                        userCenterApi.find_list_tag_tree(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var data = res.data;
                            console.log(data);
                            data.forEach(one => {
                                one.children.forEach(second => {
                                    second.active = false;
                                });
                            });
                            _this.optionsIndustry = data;
                            console.log(_this.optionsIndustry)
                        })
                    },



                    ///////////////////三级级联选择/////////////////////////

                    // 打开菜单
                    openMenuList: function () {
                        // console.log("112")
                        var _this = this;
                        // _this.firstShow = true;
                        $("#tag_tree_style").show();
                        _this.secondOptions = "";

                        for (let i = 0; i < _this.options.length; i++) {
                            const element = _this.options[i];
                            console.log(element);
                            _this.openFirstLevel(_this.options[0], 0)
                        }

                    },
                    // 打开第一层目录
                    openFirstLevel: function (item, index) {
                        console.log(item)
                        var _this = this;
                        _this.secondOptions = item.children;

                        console.log(_this.secondOptions)
                        _this.options.forEach(function (item, i) {
                            item.active = false;
                            if (index === i) {
                                item.active = true;
                            }
                        })
                    },

                    // 选择第三级目录
                    openThirdLevel: function (item, index) {
                        var _this = this;
                        console.log(item)

                        if (_this.textList.indexOf(item) === -1) {
                            _this.textList.push(item);
                            item.active = true;
                            // this.$set(item, 'active', true);
                        } else {
                            _this.textList.splice(_this.textList.indexOf(item), 1);
                            item.active = false;
                        }
                        if (_this.textList.length == 6) {
                            // _this.firstShow = false;
                            $("#tag_tree_style").hide();

                            _this.$dialog.showToast("最多选择5项!");

                            _this.textList.splice(5);
                            item.active = false;
                        }
                        console.log(_this.textList)
                        _this.tagList = [];
                        _this.textList.forEach(element => {
                            _this.tagList.push(element.id)
                        });
                        console.log(_this.tagList)

                    },
                    // 移除单个
                    removeSingle: function (index) {
                        var _this = this;
                        let removeId = _this.textList[index].id
                        console.log(_this.textList[index].id)
                        _this.textList.splice(index, 1);

                        _this.secondOptions.forEach(function (item) {
                            item.children.forEach(function (i) {
                                if (i.id == removeId) {
                                    i.active = false;
                                }
                            })
                        })

                    },
                    // 关闭
                    closeAllLevel: function () {
                        var _this = this;
                        // _this.firstShow = false;
                        $("#tag_tree_style").hide();

                    },

                    ////////////////////////////////////////////

                    // 打开菜单
                    openMenuListIndustry: function () {
                        // console.log("112")
                        var _this = this;
                        $("#industry_tree_style").show();
                        _this.secondIndustryOptions = "";

                        for (let i = 0; i < _this.optionsIndustry.length; i++) {
                            const element = _this.optionsIndustry[i];
                            console.log(element);
                            _this.openFirstLevelIndustry(_this.optionsIndustry[0], 0)
                        }

                    },


                    // 打开第一层目录
                    openFirstLevelIndustry: function (item, index) {
                        console.log(item)
                        var _this = this;
                        _this.secondIndustryOptions = item.children;

                        console.log(_this.secondIndustryOptions)
                        _this.optionsIndustry.forEach(function (item, i) {
                            item.active = false;
                            if (index === i) {
                                item.active = true;
                            }
                        })
                    },



                    //  选择第二层
                    openSecondLevelIndustry: function (item, index) {
                        var _this = this;
                        console.log(item)

                        if (_this.textIndustryList.indexOf(item) === -1) {
                            _this.textIndustryList.push(item);
                            item.active = true;
                            // this.$set(item, 'active', true);
                        } else {
                            _this.textIndustryList.splice(_this.textIndustryList.indexOf(item), 1);
                            item.active = false;
                        }
                        if (_this.textIndustryList.length == 4) {
                            // _this.firstShow = false;
                            $("#tag_tree_style").hide();

                            _this.$dialog.showToast("最多选择3项!");

                            _this.textIndustryList.splice(3);
                            item.active = false;
                        }
                        console.log(_this.textIndustryList)
                        _this.industryList = [];
                        _this.textIndustryList.forEach(element => {
                            _this.industryList.push(element.id)
                        });
                        console.log(_this.industryList)

                    },

                    // 移除单个
                    removeSingleIndustry: function (index) {
                        var _this = this;
                        let removeId = _this.textIndustryList[index].id;
                        _this.textIndustryList.splice(index, 1);
                        _this.secondIndustryOptions.forEach(function (item) {
                            if (item.id == removeId) {
                                item.active = false;
                            }
                        })

                    },
                    // 关闭
                    closeAllLevelIndustry: function () {
                        var _this = this;
                        // _this.firstShow = false;
                        $("#industry_tree_style").hide();

                    },
                    ///////////////////////////////////////////

                    // 班级
                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href = '/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },


                    // 提交结果
                    submitAuditRequireResults: function () {
                        var _this = this;

                        var form = _this.proRequireForm;
                        // 转标签
                        if (_this.tagList.length > 0 && typeof (_this.tagList[0]) == "object") {
                            var idForm = [];
                            _this.tagList.forEach(element => {
                                idForm.push(element.id);
                            });
                            _this.tagList = idForm;
                        }
                        form.tags = _this.tagList;


                        // 转行业类型 
                        if (_this.textIndustryList.length > 0 && typeof (_this.textIndustryList[0]) == "object") {
                            _this.industryList = [];
                            var industryForm = [];
                            _this.textIndustryList.forEach(element => {
                                industryForm.push(element.id);
                            });
                            _this.industryList = industryForm;
                        }

                        form.demandIndustryType = [];
                        _this.industryList.forEach(element => {
                            form.demandIndustryType.push(element);
                        });
                        form.budget = _this.intended_price == 1 ? 0 : _this.proRequireForm.budget;

                        console.log('form', form)
                        if (_this.noEmptyInputReq(form)) {
                            console.log('form', form)

                            userCenterApi.save_technology_require_results(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast("提交成功");
                                setTimeout(function () {
                                    // window.href = "/user_market_tech_achievements.html"
                                    window.location.href = "/common/usercenter/user_market_tech_require.html"
                                }, 2000)
                            })
                        }
                    },


                    // 提交时 非空验证
                    noEmptyInputReq: function (form) {
                        var _this = this;

                        if (!_this.$utils.validatesEmpty(form.title)) {
                            _this.$dialog.showToast("需求名称必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.companyName)) {
                            _this.$dialog.showToast("单位名称必填");
                            return false;
                        }
                        if (form.demandIndustryType.length < 1) {
                            _this.$dialog.showToast("行业类型必填");
                            return false;
                        }
                        if (form.tags.length < 1) {
                            _this.$dialog.showToast("标签必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.demandType)) {
                            _this.$dialog.showToast("需求类型必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.budget)) {
                            _this.$dialog.showToast("请输入需求预算或选择面议");
                            return false;
                        }

                        if (Number(form.budget) < 0) {
                            _this.$dialog.showToast("请输入正确的预算");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.cooperationMode)) {
                            _this.$dialog.showToast("合作方式必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.area)) {
                            _this.$dialog.showToast("所属区县必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.demandDes)) {
                            _this.$dialog.showToast("技术描述必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.technicalNorm)) {
                            _this.$dialog.showToast("技术指标必填");
                            return false;
                        }
                        return true;
                    },
                    // 预算
                    // "cooperationMode": _this.cooperation_mode,//合作方式
                    // 需求单位
                    // 单位性质



                    // 查询返现
                    findRequireDetails: function (form) {
                        var _this = this;
                        userCenterApi.find_require_details_results(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var dataForm = res.data;

                            _this.textList = dataForm.tags;
                            _this.tagList = dataForm.tags;
                            _this.textIndustryList = dataForm.demandIndustryType;
                            _this.industryList = dataForm.demandIndustryType;

                            _this.proRequireForm = dataForm;
                            _this.intended_price = dataForm.budget == 0 ? 1 : 0;
                            console.log(_this.proRequireForm)
                            // _this.title = dataForm.title;//需求名称：
                            // _this.demand_case = dataForm.demandCase;//需求来源
                            // _this.industry_area = dataForm.demandIndustryType;//行业类型
                            // _this.key_words = dataForm.keyWords;//关键字：
                            // _this.achievement_demand_type = dataForm.demandType;//需求类型：
                            // _this.cooperation_mode = dataForm.cooperationMode;//合作方式
                            // _this.budget = dataForm.budget;//预算价格
                            // _this.demandDes = dataForm.demandDes;//技术描述：
                            // _this.technicalNorm = dataForm.technicalNorm; //技术指标：
                            // _this.otherDes = dataForm.otherDes;//其他描述：

                        })
                    },


                    // 查询下拉框字典
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "industry_area",//行业类型
                            "achievement_demand_type",//需求类型
                            "additional_service",//附加服务
                            "achievement_belong",//权属性质
                            "achievement_cooperation",//合作方式
                            "price_range",//意向价格
                            "business_plan",//商业计划书
                            "demand_case"
                        ]
                        console.log(form)
                        // 技术需求列表查询
                        userCenterApi.dictionary_type_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }

                            var data = res.data
                            console.log(data);
                            var datalist = _this.arryGroupMatch(data)
                            for (let i = 0; i < datalist.length; i++) {
                                const element = datalist[i];
                                // console.log(element);
                                //  else
                                if (element.dictCode === "industry_area") {
                                    element.data.forEach(element => {
                                        _this.industry_area_list.push(element);
                                    });
                                } else if (element.dictCode === "achievement_demand_type") {
                                    element.data.forEach(element => {

                                        _this.achievement_demand_type_list.push(element);
                                    });
                                } else if (element.dictCode === "achievement_cooperation") {
                                    element.data.forEach(element => {

                                        _this.cooperation_mode_list.push(element);
                                    });
                                }
                            }
                            // console.log(_this.additional_service_list)
                        })
                    },

                    //数组变型得到新数组 JS数组根据字段进行分组
                    arryGroupMatch(arr) {
                        var map = {}
                        var dest = []
                        for (var i = 0; i < arr.length; i++) {
                            var ai = arr[i]
                            if (!map[ai.dictCode]) {
                                dest.push({
                                    dictCode: ai.dictCode,
                                    data: [ai]
                                })
                                map[ai.dictCode] = ai
                            } else {
                                for (var j = 0; j < dest.length; j++) {
                                    var dj = dest[j]
                                    if (dj.dictCode === ai.dictCode) {
                                        dj.data.push(ai)
                                        break
                                    }
                                }
                            }
                        }
                        return dest
                    },
                    // // 点击事件
                    // checkUserMarketPart: function (pageName) {
                    //     console.log(pageName)
                    // },

                    // selAll: function () {
                    //     var $this = this, ob = [];
                    //     this.isAll = !this.isAll;
                    //     this.list.forEach(function (d) {
                    //         if (!d.picked) {
                    //             ob.push(d);
                    //         }
                    //         $this.$set(d, 'picked', $this.isAll);
                    //     });
                    //     this.isAll ? this.sels = this.sels.concat(ob) : this.removeAll(this.list);
                    // },
                    // getInfo: function (i) {
                    //     if (i === this.activeIndex) return;
                    //     this.activeIndex = i;
                    // },
                    // indexOf: function (ar, v, key) {
                    //     for (var i = 0, l = ar.length; i < l; i++) {
                    //         if (ar[i][key] === v) {
                    //             return i;
                    //         }
                    //     }
                    //     return -1;
                    // },
                    // removeAll: function (ob) {
                    //     for (var i = this.sels.length - 1; i >= 0; i--) {
                    //         if (this.indexOf(ob, this.sels[i].id, 'id') > -1) {
                    //             this.sels.splice(i, 1);
                    //         }
                    //     }
                    // },
                    // addSel: function (k) {
                    //     if (this.indexOf(this.sels, k.id, 'id') === -1) {
                    //         this.sels.push(k);
                    //     }
                    // },
                    // removeSel: function (k) {
                    //     var index = this.indexOf(this.sels, k.id, 'id');
                    //     index > -1 && this.sels.splice(index, 1);
                    // },
                    // updateIsAll: function () {
                    //     for (var i = 0, l = this.list.length; i < l; i++) {
                    //         if (!this.list[i].picked) {
                    //             return false;
                    //         }
                    //     }
                    //     return true;
                    // },
                    // pick: function (k) {
                    //     !k.picked ? this.addSel(k) : this.removeSel(k);
                    //     if (k.readFlag === '0') {
                    //         this.readMessageApi(k.msgContentDtlId);
                    //     }
                    //     this.$set(k, 'picked', !k.picked);
                    //     this.$set(k, 'readFlag', '1');
                    //     this.isAll = k.picked ? this.updateIsAll() : false;
                    // },
                    // expand: function (k) {
                    //     k.expanded = !k.expanded;
                    // },
                    // setReaded: function () {
                    //     if (this.sels.length < 1) {
                    //         $dialog.showToast('请先选择');
                    //     } else {
                    //         var ids = [];
                    //         this.sels.forEach(function (d) {
                    //             if (d.readFlag === '0') {
                    //                 ids.push(d.msgContentDtlId);
                    //             }
                    //         });
                    //         ids.length && this.readMessageApi(ids.join(','));
                    //     }
                    // },
                    // delAll: function () {
                    //     if (this.sels.length < 1) {
                    //         $dialog.showToast('请先选择');
                    //     } else {
                    //         var ids = [];
                    //         this.sels.forEach(function (d) {
                    //             ids.push(d.id);
                    //         });
                    //         this.delMessageApi(ids.join(','));
                    //     }
                    // },
                    // updateSel: function () {
                    //     var $this = this;
                    //     var n = 0;
                    //     this.list.forEach(function (d) {
                    //         if ($this.indexOf($this.sels, d.id, 'id') > -1) {
                    //             n++;
                    //             $this.$set(d, 'picked', true);
                    //         }
                    //     });
                    //     if (this.list.length > 0) {
                    //         this.isAll = n === this.list.length;
                    //     }
                    // },
                    // getMessageApi: function (page) {
                    //     var $this = this;
                    //     page = page || this.page;
                    //     this.$http.post(httpUrl.baseUrl + '/msg/selectByPage', { userId: this.userInfo.userId, pageNum: page, pageSize: this.pageSize }).then(function (res) {
                    //         if (res.code === 'rest.success') {
                    //             $this.list = res.result.list;
                    //             $this.totalPage = res.result.pages;
                    //             $this.list.length > 0 && $this.$nextTick(function () {
                    //                 $this.$refs.txt.forEach(function (d, i) {
                    //                     if (d.offsetHeight > 38) {
                    //                         $this.$set($this.list[i], 'isExpand', true);
                    //                         $this.$set($this.list[i], 'expanded', true);
                    //                     }
                    //                     $this.$set($this.list[i], 'isHidden', true);
                    //                 });
                    //             });
                    //             $this.updateSel();
                    //         }
                    //     });
                    //     $this.noReadMessageApi();
                    // },
                    // noReadMessageApi: function () {
                    //     var $this = this;
                    //     this.$http.post(httpUrl.baseUrl + '/msg/lastSta', { userId: this.userInfo.userId }).then(function (res) {
                    //         if (res.code === 'rest.success') {
                    //             $this.sysUnread = res.result.notReadCount;
                    //         }
                    //     });
                    // },
                    // readMessageApi: function (ids) {
                    //     var $this = this;
                    //     this.$http.get(httpUrl.baseUrl + '/msg/setReadedBatchByIds', { ids: ids }).then(function (res) {
                    //         $this.noReadMessageApi();
                    //         $this.getMessageApi();
                    //     });
                    // },
                    // delMessageApi: function (ids) {
                    //     var $this = this;
                    //     this.$http.get(httpUrl.baseUrl + '/msg/deleteBatchByIds', { ids: ids }).then(function (res) {
                    //         $this.getMessageApi();
                    //     });
                    // },
                    // delMess: function (k) {
                    //     this.delMessageApi(k.id);
                    // }
                },
            });
        });
});
