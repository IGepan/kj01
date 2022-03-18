// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', 'ELEMENT', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, ELEMENT, userCenterApi) {


            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            // Vue.component('user-tech-menu', httpVueLoader('/common/components/userTechMenu.vue'));
            Vue.component('user-tech-menu', httpVueLoader('/common/components/buyerLeft.vue'));
            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,
                    "tech_patent_list": [],//技术成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 4,//每页显示条数
                    "patent_type_list": [],   //   字典 行业类型


                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    var _this = this;
                    var urlData = _this.$utils.urlPathParameters();
                    _this.id = urlData.id;

                    _this.find_dictionary_type_list();
                    //

                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/newtoper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    // 'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue')
                    'user-tech-menu': httpVueLoader('/common/components/buyerLeft.vue')
                },
                methods: {
                    //


                    // 班级报名
                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href = this.$pathPrefix+'/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },




                    // 技术专利列表查询
                    find_tech_patent_list_page: function () {
                        var _this = this;

                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": _this.id,
                        }

                        _this.getTechPatentListPage(form);
                    },


                    // 技术专利列表查询
                    getTechPatentListPage: function (form) {
                        var _this = this;
                        userCenterApi.find_query_page_patent(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            var datalistCord = datalist.records;
                            datalistCord.forEach(element => {
                                element.patentType_display = _this.forEachDisplay(_this.patent_type_list, element.patentType);
                            });
                            console.log(datalistCord)
                            _this.tech_patent_list = datalistCord;
                            _this.allTotal = datalist.total;
                        })
                    },


                    // 翻页
                    handleCurrentChange: function () {


                    },



                    changePageView(item) {
                        var _this = this;
                        window.location.href =this.$pathPrefix+ "/common/usercenter/user_market_tech_patent_form.html?proId=" + _this.id + "&id=" + item.id;
                    },


                    /////////////////////字典/////////////////////////////////

                    // 根据字典查id对应的文字
                    forEachDisplay: function (arrayList, id) {
                        var value = ""
                        console.log(arrayList);
                        console.log(id);
                        arrayList.forEach(function (element) {
                            // console.log(id);
                            if (id == element.dictValue) {
                                value = element.display
                            }
                        });
                        return value;
                    },
                    //   查询字典
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "patent_type",  //  专业类型
                        ]
                        console.log(form)
                        //   技术成果列表查询
                        userCenterApi.dictionary_type_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }

                            var data = res.data
                            console.log(data);
                            var datalist = _this.arryGroupMatch(data);
                            for (let i = 0; i < datalist.length; i++) {
                                const element = datalist[i];
                                //   console.log(element);
                                //    else
                                if (element.dictCode === "patent_type") {
                                    element.data.forEach(element => {
                                        _this.patent_type_list.push(element);
                                    });
                                }
                            }
                            _this.find_tech_patent_list_page(); //  // 技术专利列表查询


                        })
                    },

                    //  数组变型得到新数组 JS数组根据字段进行分组
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

                    ////////////////////////////操作////////////////////////////////////////////

                    // 返回值
                    handleCommand(command) {
                        var _this = this;

                        console.log(command)
                        var type = command.num
                        var id = command.command.id
                        if (type == 0) {
                            window.location.href =this.$pathPrefix+ "/common/usercenter/user_market_tech_patent_form.html?proId=" + _this.id + "&id=" + id;
                        } else if (type == 1) {
                            console.log(2222)

                            userCenterApi.del_project_patent_info(id).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast("删除成功！");
                                _this.find_tech_patent_list_page(); //  // 技术专利列表查询
                            })
                        }
                    },


                    // 点击编辑
                    HandleButtonEdit(index, item, num) {
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },
                    // 点击删除
                    handleButtonDel(index, item, num) {
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },

                },
            });
        });
});
