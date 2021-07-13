// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, httpUser, jqValidate, httpUrl, jqSelect, httpCom, userCenterApi) {

            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            Vue.component('vue-ueditor-wrap', VueUeditorWrap);


            window.vueDom = new Vue({
                el: '#index_box',
                // mixins: [userCenter],
                data() {
                    return {
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
                        // sels: [],
                        // sysUnread: '',
                        // busUnread: ''
                        ueditorConfig: {
                            initialFrameHeight: 180,
                            maximumWords: 5000
                        },

                        "title": "",//成果名称：
                        "industry_area_list": [],//行业类型
                        "industry_area": '',//行业类型下拉选择框选中值
                        "key_words": "",//关键字：
                        // 筛选
                        "achievement_demand_type_list": [],//成果类型：
                        "achievement_demand_type": "",//成果类型：

                        "achievement_belong": "",//权属性质
                        "achievement_belong_list": [],//权属性质

                        "achievement_maturity": "",//成熟度
                        "achievement_maturity_list": [],//成熟度

                        "additional_service": "",//附加服务：
                        "additional_service_list": [],//附加服务：
                        "team_first_name": "",//团队领头人
                        "budget": "",//意向价格
                        "cooperation_mode_list": [],//合作方式
                        "cooperation_mode": "",//合作方式

                        "country": "",//国家
                        "country_list": [],//国家
                        "provinces": "",//省
                        "province_list": [],//省
                        "citys": "",//市
                        "city_list": [],//市
                        "district": "",//区/县
                        "district_list": [],//区/县


                        "province_city_type": "",//1国家 2省 3市
                        "province_city_value": "",///1国家 2省 3市
                        "appNo": "",//专利申请号：
                        "projectDes": "",//成果描述：
                        "teamDes": "",//团队介绍

                        // "imageUrl": '',//图片
                        // "certificateUrl": "",//证书附件
                        // "businessUrl": "",//商业计划书
                        // "moveUrl": '',//视频




                        "edit_industry_area": '',//行业类型下拉选择框选中值
                        "edit_key_words": "",//关键字：
                        // 筛选
                        "edit_country": "   ",//国家
                        "edit_provinces": "   ",//省
                        "edit_citys": "   ",//市
                        "edit_district": "   ",//区/县

                        "edit_appNo": "   ",//专利申请号

                        // "edit_imageUrl": '',//图片
                        // "edit_certificateUrl": "   ",//证书附件
                        // "edit_businessUrl": "   ",//商业计划书
                        // "edit_moveUrl": '',//视频

                        // "achievement_belong_list": [],//权属性质
                        // "business_plan_list": [],//商业计划书
                        "areaValueList": {},
                        "inputEntifyType": true,
                        "techId": "",
                        "handleType": "0",
                        // 图片上传
                        "personImg": [],
                        "headImg": "",
                        "personImgFigures": [],//附图
                        "headImgFigures": [],
                        imgOption: {
                            size: '400,300',
                            prev: "main_picture",
                            title: "jhmokjn",
                            url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
                        },

                        imgOption1: {
                            size: '400,300',
                            prev: 'attached_figures',
                            title: "jhmokjn",
                            url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
                        },
                        // 附件上传
                        fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
                        uploadData: {
                            system: 'ts'
                        },
                        business_files1: [],	//	附件	是	[array]
                        business_files2: [],	//	附件	是	[array]
                        business_files3: [],	//	附件	是	[array]


                        "tech_type": 1,//返显对象


                        "secondOptions": [],
                        "firstShow": false,
                        "active": false,
                        "textList": [], // 标签显示出来的数组
                        "options": [],
                        "tagList": [],


                        "secondIndustryOptions": [],
                        "firstIndustryShow": false,
                        "active": false,
                        "textIndustryList": [], // 行业类型显示出来的数组
                        "optionsIndustry": [],
                        "industryList": [],

                        "basicProjectList": {}, // 赋值数组

                    };
                },
                watch: {

                    industry_area(newName, oldName) {
                        // this.fullName = newName + ' ' + this.lastName;
                        console.log(newName)
                    },

                    projectDes(newName, oldName) {
                        // this.fullName = newName + ' ' + this.lastName;
                        console.log(newName)
                    },


                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl,

                },
                created: function () {
                    var _this = this;

                    // 查询下拉框字典
                    _this.find_dictionary_type_list();
                    // 若上级页面有 路径参数 传来 ，返显值


                    var urlData = _this.$utils.urlPathParameters();
                    console.log(_this.$utils.validatesEmpty(urlData))
                    if (_this.$utils.validatesEmpty(urlData)) {
                        _this.tech_type = urlData.type;
                        _this.findTechAchiDetails(urlData.id);
                    } else {
                        // 查询国家
                        _this.find_provinces_citys_list();
                    }

                    // 查询树状
                    _this.findTechPatentTree("tag");
                    _this.findTechIndustryType("industryType");

                },
                components: {
                    'vue-ueditor-wrap': VueUeditorWrap,
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'img-uploader': httpVueLoader('/common/components/imgUploader.vue'),
                    // / imgUploaderMost.vue
                },

                methods: {

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
                        _this.textList.splice(index, 1);
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
                        _this.textIndustryList.splice(index, 1);
                    },
                    // 关闭
                    closeAllLevelIndustry: function () {
                        var _this = this;
                        // _this.firstShow = false;
                        $("#industry_tree_style").hide();

                    },
                    ///////////////////////////////////////////


                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href = '/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },




                    imgUploadSuccess: function (id, url, type, prev, data) {
                        var _this = this;
                        // 处理图片  
                        if (prev === 'main_picture' && data) {
                            // this.provesPhotoList.push({
                            //     id: data.id,
                            //     fileName: data.fileName,
                            //     url: data.url
                            // });
                            _this.headImg = id;
                            _this.personImg = url;
                            _this.$set(_this, 'logo', url);
                            console.log(_this.headImg);
                            console.log(_this.personImg);
                        } else if (prev === 'attached_figures' && data) {
                            _this.personImgFigures.push({
                                id: data.id,
                                fileName: data.fileName,
                                url: data.url
                            });
                            console.log(_this.personImgFigures);
                            var imgIdList = [];
                            _this.personImgFigures.forEach(element => {
                                imgIdList.push(element.id);
                            });
                            console.log(imgIdList)

                            _this.headImgFigures = imgIdList;
                        }

                    },
                    // 删除主图
                    delProvesPhotoClick: function (index) {
                        this.personImg.splice(index, 1);
                    },


                    // 删除附图
                    delFiguresPhotoClick: function (index) {
                        this.personImgFigures.splice(index, 1);
                    },

                    handleUploadSuccess1: function (successInfo) {
                        this.business_files1 = [];
                        this.business_files1.push(successInfo.data);
                        console.log("=============>>>" + this.business_files1[0].id);
                    },
                    handleUploadSuccess2: function (successInfo) {
                        this.business_files2 = [];
                        this.business_files2.push(successInfo.data)
                    },
                    handleUploadSuccess3: function (successInfo) {
                        this.business_files3 = [];
                        this.business_files3.push(successInfo.data)
                    },
                    handleDelFile1: function (i) {
                        this.business_files1.splice(i, 1)
                    },
                    handleDelFile2: function (i) {
                        this.business_files2.splice(i, 1)
                    },

                    handleDelFile3: function (i) {
                        this.business_files3.splice(i, 1)
                    },

                    // 技术成果详情 返显 find_technology_details

                    findTechAchiDetails: function (form) {
                        var _this = this;
                        userCenterApi.find_technology_details(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var data = res.data;


                            if (data.zMProjectAdditionalList.length > 0) {
                                data.additionalService = (data.zMProjectAdditionalList[0].additionalService);
                            }

                            _this.headImg = data.projectImg;
                            if (data.projectImgSecondary.length > 0 && typeof (data.projectImgSecondary[0]) == "object") {
                                var idForm = [];
                                data.projectImgSecondary.forEach(element => {
                                    idForm.push(element.id);
                                });
                                _this.headImgFigures = idForm;
                            }


                            _this.basicProjectList = data;
                            _this.textList = data.tags;
                            _this.tagList = data.tags;
                            _this.textIndustryList = data.projectIndustryType;
                            _this.industryList = data.projectIndustryType;

                            _this.areaValueList = data;

                            _this.techId = data.id;

                            if (_this.$utils.validatesEmpty(data.projectImg)) {
                                _this.find_img_file_url_query(data.projectImg, 0);// 成果图片
                            }
                            if (_this.$utils.validatesEmpty(data.certificateFiles)) {
                                _this.find_img_file_url_query(data.certificateFiles, 1); // 证书附件
                            }
                            if (_this.$utils.validatesEmpty(data.businessFiles)) {
                                _this.find_img_file_url_query(data.businessFiles, 2); // 商业计划书（只支持pdf和doc丶docx三种格式）
                            }
                            if (_this.$utils.validatesEmpty(data.projectVideo)) {
                                _this.find_img_file_url_query(data.projectVideo, 3); // 视频
                            }
                            if (_this.$utils.validatesEmpty(data.projectImgSecondary)) {
                                _this.find_imgListUrlQuery(data.projectImgSecondary); // 附图
                            }
                            // 查询国家
                            _this.find_provinces_citys_list();
                        })
                    },

                    // 查询多张
                    find_imgListUrlQuery: function (datalist) {
                        var _this = this;
                        datalist.forEach(element => {
                            element.url = httpUrl.fileShowUrl + '/resource/' + element.url//图片
                        });
                        _this.personImgFigures = datalist;
                        console.log(_this.personImgFigures)

                    },

                    // 查询附件
                    find_img_file_url_query: function (id, type) {
                        var _this = this
                        console.log(id)

                        console.log(type)

                        userCenterApi.find_attachment_query(id).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            console.log(res.data)
                            if (type == 0) {
                                var url = "";
                                url = httpUrl.fileShowUrl + '/resource/' + res.data.path
                                _this.personImg.push(url)//图片
                                console.log(_this.personImg)
                            }
                            else if (type == 1) {
                                var url = {}
                                url = httpUrl.fileShowUrl + "/resource/" + res.data.path
                                _this.business_files1.push(res.data);

                            } else if (type == 2) {
                                var url = {}
                                url = httpUrl.imgUploadUrl + "/resource/" + res.data.path
                                _this.business_files2.push(res.data);
                            } else if (type == 3) {
                                var url = {}
                                url = httpUrl.imgUploadUrl + "/resource/" + res.data.path
                                _this.business_files3.push(res.data);

                            }


                            console.log(_this.personImg)
                            console.log(_this.business_files1)
                            console.log(_this.business_files2)
                            console.log(_this.business_files3)
                        })
                    },




                    //     url: 
                    // },
                    // // 附件上传
                    // fileUploadUrl: ,

                    // 提交审核结果
                    submitAuditResults: function () {
                        var _this = this;


                        var form = _this.basicProjectList;

                        // 转标签
                        if (_this.tagList.length > 0 && typeof (_this.tagList[0]) == "object") {
                            var idForm = [];
                            _this.tagList.forEach(element => {
                                idForm.push(element.id);
                            });
                            _this.tagList = idForm;
                        }

                        // 转行业类型
                        if (_this.industryList.length > 0 && typeof (_this.industryList[0]) == "object") {
                            var industryForm = [];
                            _this.industryList.forEach(element => {
                                industryForm.push(element.id);
                            });
                            _this.industryList = industryForm;
                        }


                        form.tags = _this.tagList; // 标签
                        form.projectIndustryType = _this.industryList; // 行业类型
                        form.zMProjectAdditionalList = [];
                        form.id = _this.$utils.validatesEmpty(_this.techId) ? _this.techId : ""; // id
                        form.projectImg = _this.headImg; // 成果图片(主)
                        form.projectImgSecondary = _this.headImgFigures;  // 成果图片（副）
                        form.certificateFiles = _this.business_files1[0] ? _this.business_files1[0].id : "";  // 证书附件
                        form.businessFiles = _this.business_files2[0] ? _this.business_files2[0].id : "";  // 商业计划书（只支持pdf和doc丶docx三种格式）
                        form.projectVideo = _this.business_files3[0] ? _this.business_files3[0].id : "";  // 证书附件

                        if (_this.noEmptyInputAuth(form)) {
                            console.log(form)

                            userCenterApi.save_technology_results(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast("提交成功");
                                setTimeout(function () {
                                    // window.href = "/user_market_tech_achievements.html"
                                    window.location.href = "/common/usercenter/user_market_tech_achievements.html"
                                }, 2000)
                            })
                        }
                    },


                    // 提交时 非空验证
                    noEmptyInputAuth: function (form) {
                        var _this = this;



                        if (!_this.$utils.validatesEmpty(form.title)) {
                            _this.$dialog.showToast("成果名称必填");
                            return false;
                        }



                        if (form.projectIndustryType.length < 1) {
                            _this.$dialog.showToast("行业类型必填");
                            return false;
                        }


                        if (form.tags.length < 1) {
                            _this.$dialog.showToast("标签必填");
                            return false;
                        }


                        if (!_this.$utils.validatesEmpty(form.projectType)) {
                            _this.$dialog.showToast("成果类型必填");
                            return false;
                        }


                        if (!_this.$utils.validatesEmpty(form.additionalService)) {
                            _this.$dialog.showToast("附加服务必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.budget)) {
                            _this.$dialog.showToast("意向价格必填");
                            return false;
                        }


                        if (!_this.$utils.validatesEmpty(form.cooperationMode)) {
                            _this.$dialog.showToast("合作方式必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.achievementBelong)) {
                            _this.$dialog.showToast("权属性质必填");
                            return false;
                        }


                        if (!_this.$utils.validatesEmpty(form.achievementMaturity)) {
                            _this.$dialog.showToast("成熟度必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.projectDes)) {
                            _this.$dialog.showToast("成果描述必填");
                            return false;
                        }
                        console.log(form.projectImg)
                        if (!_this.$utils.validatesEmpty(form.projectImg)) {
                            _this.$dialog.showToast("成果主图必填");
                            return false;
                        }
                        return true;

                    },

                    // 点击国家
                    changeCountry: function (value) {
                        var _this = this
                        console.log(value)
                        userCenterApi.find_province_city(value).then(function (res) {
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            _this.province_list = res.data;
                            //alert(_this.areaValueList.province + "1111");
                            if ("" != _this.areaValueList.province && null != _this.areaValueList.province) {
                                _this.provinces = _this.areaValueList.province;//省
                                _this.areaValueList.provinces = "";
                                //alert(_this.areaValueList.province)
                                if ("" != _this.areaValueList.city && null != _this.areaValueList.city) {
                                    _this.changeProvinces(_this.provinces);
                                }
                            }
                            _this.$nextTick(
                                () => {
                                    if (_this.tech_type == 0) {
                                        _this.provinces = _this.areaValueList.province + "";//省
                                        _this.changeProvinces(_this.areaValueList.province);

                                    }
                                    // else {
                                    //     _this.provinces = "";
                                    //     _this.citys = "";
                                    //     _this.district = "";
                                    // }
                                }
                            )
                        })

                    },

                    // 点击省份
                    changeProvinces: function (value) {
                        var _this = this;
                        // _this.areaValueList.city = "";
                        // _this.areaValueList.district = "";
                        //alert(value)
                        userCenterApi.find_province_city(value).then(function (res) {
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            console.log(res);
                            _this.city_list = res.data;
                            if ("" != _this.areaValueList.city && null != _this.areaValueList.city) {
                                _this.citys = _this.areaValueList.city;//市
                                //alert(_this.citys);
                                _this.changeCity(_this.citys);
                                //_this.areaValueList.city = "";
                            }
                            _this.$nextTick(
                                () => {
                                    if (_this.tech_type == 0) {
                                        _this.citys = _this.areaValueList.city + "";//省
                                        _this.changeCity(_this.areaValueList.city)
                                    }
                                    // else {
                                    //     _this.citys = "";
                                    //     _this.district = "";
                                    // }
                                }
                            )
                        })
                    },

                    // 点击区、县
                    changeCity: function (value) {
                        var _this = this
                        console.log(value)
                        // alert(value);
                        userCenterApi.find_province_city(value).then(function (res) {
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            _this.district_list = res.data;
                            // if ("" != _this.areaValueList.city && null != _this.areaValueList.city) {

                            //     _this.citys = _this.areaValueList.city;//市
                            //     //alert(_this.citys);
                            //     //_this.changeCity(_this.citys);
                            // }

                            _this.$nextTick(
                                () => {
                                    if (_this.tech_type == 0) {
                                        _this.district = _this.areaValueList.district + "";//省
                                    }
                                    // else {
                                    //     _this.district = "";
                                    // }
                                }
                            )

                        })
                    },
                    // 查询国家
                    find_provinces_citys_list: function () {
                        var _this = this;
                        var form = {
                            "code": "administrative_division"
                        }
                        console.log(form)
                        userCenterApi.province_city_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.result
                            console.log(datalist)
                            _this.country_list = datalist;
                            _this.country = "100";
                            _this.changeCountry("100");
                        })
                    },


                    // 查询下拉框字典
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "industry_area",//行业类型
                            "achievement_maturity",//成熟度
                            "achievement_demand_type",//成果类型
                            "additional_service",//附加服务
                            "achievement_belong",//权属性质
                            "achievement_cooperation",//合作方式
                            "price_range",//意向价格
                            "business_plan"//商业计划书
                        ]
                        console.log(form)
                        // 技术成果列表查询
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
                                } else if (element.dictCode === "achievement_maturity") {
                                    element.data.forEach(element => {

                                        _this.achievement_maturity_list.push(element);
                                    });
                                } else if (element.dictCode === "achievement_belong") {
                                    element.data.forEach(element => {

                                        _this.achievement_belong_list.push(element);
                                    });
                                } else if (element.dictCode === "achievement_demand_type") {
                                    element.data.forEach(element => {

                                        _this.achievement_demand_type_list.push(element);
                                    });
                                }
                                else if (element.dictCode === "achievement_cooperation") {
                                    element.data.forEach(element => {

                                        _this.cooperation_mode_list.push(element);
                                    });
                                } else if (element.dictCode === "additional_service") {
                                    element.data.forEach(element => {

                                        _this.additional_service_list.push(element);
                                    });
                                }
                            }
                            console.log(_this.additional_service_list)
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

                },
            });
        });
});
