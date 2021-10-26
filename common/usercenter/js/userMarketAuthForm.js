//   JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', 'fileSaver', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, fileSaver, userCenterApi) {

            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            Vue.component('vue-ueditor-wrap', VueUeditorWrap);
            Vue.component('user-tech-menu', httpVueLoader('/common/components/userTechMenu.vue'));

            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    certificateList: [],
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,

                    ueditorConfig: {
                        initialFrameHeight: 180,
                        maximumWords: 5000
                    },
                    // "brokerPlatform_additionalService": "2",
                    //  技术经纪人
                    'actionUrl': httpUrl.uploadimg_url + '/file/upload',
                    "brokerPlatform": {
                        "academicDegree": "",
                        "additionalService": "",
                        "agentType": "",
                        "brokerDes": "",
                        "brokerEmail": "",
                        "brokerIdCard": "",
                        "brokerName": "",
                        "brokerPhone": "",
                        "graduationYear": "",
                        "brokerSchool": "",
                        "budget": "",
                        "id": "",
                        "work": "",//工作单位
                        "certificateId": "",//职务
                        "issuingUnit": "",
                        "certificatePic": "",
                        "post": "",
                        "industryArea": "",
                        "industryType": [],
                        "logo": "",
                        "tags": [],
                        "techNo": "",

                    },
                    'fileList':[],
                    // 转移机构
                    "transferAgencyForm": {
                        "organName": "",
                        "organDes": "",
                        "logo": "",
                        "id": ""
                    },
                    // 投资机构
                    "InvestmentForm": {
                        "investmentName": "",
                        "investorType": "",
                        "industryType": [],
                        "tags": [],
                        "financeStage": "",
                        "institutionalQuota": "",
                        "investmentDes": "",
                        "logo": "",
                        "id": "",

                    },
                    'pic':'',
                    "hasFormData": false,
                    "hasFormDataJudg": false,


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
                    "industryListText": "",

                    "authentication_type": "1",  //  认证类型：
                    "showRadio": 1,

                    //   学历
                    "academic_degree_list": [],
                    "agent_type_list": [],  //  经纪人类型：
                    "industry_type_list": [],  //  擅长领域
                    "industry_type": "",  //  擅长领域
                    "additional_service_list": [],  //  附加服务
                    "additional_service": "",  //  附加服务
                    "broker_des": "",  //  经纪人自我描述
                    "idcard_img_front": "",  //  人面像
                    "idcard_img_back": "",  //  国徽面
                    "graduation_certificate": "",  //  毕业证书
                    "broker_certificate": "",  //  经纪人证书
                    "personal_cover": "",  //  个人封面

                    //   技术转移机构
                    "organ_name": '',  //  机构名称：
                    "organ_logo": '',  //  机构logo
                    "organ_des": '',  //  机构描述：
                    "investment_industry_type_list": [],  //  擅长行业类型
                    "investor_type_list": [],  //  投资人类型
                    "finance_stage_list": [],  //  融资阶段
                    "institutional_quota_list": [],  //  投资范围investment_des


                    "inputType": true,  //  返回 true 才访问后台
                    "inputOrganType": true,
                    "inputInvestType": true,


                    "certification_list": {},  //  若有数据
                    "certification_type": "",
                    "certification_noPassReason": "",



                    //   修改编辑
                    "proId": "",
                    "personImg": " ",  //  个人封面
                    "inputDataType": false,
                    "dictionaryState": false,
                    // "certificate_or_not": false,

                    imgOption: {
                        size: '400,300',
                        prev: 'head',
                        title: "jhmokjn",
                        url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
                    },
                    "headImg": "",


                    ////////////////匹配///////////////////
                    "matchDate0": [],
                    "formList0": {
                        "pageParam": {
                            "current": 1,
                            "order": "desc",
                            "size": 5,
                            "sort": "id"
                        },
                        "payload": 0
                    },

                    "formList1": {
                        "pageParam": {
                            "current": 1,
                            "order": "desc",
                            "size": 5,
                            "sort": "id"
                        },
                        "payload": 0
                    },

                    "matchShow": false,
                    "matchDate1": [],
                    "userInfoType": {},

                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    var _this = this
                    setTimeout(function () {
                        _this.initData();
                    }, 1000)
                    _this.find_dictionary_type_list();
                    // 查询树状
                    _this.findTechPatentTree("tag");
                    _this.findTechIndustryType("industryType");
                },
                mounted: function () {
                    var vm = this;
                    vm.imgUploader = $('.edithead0').imgUploader(this.imgOption);
                },
                components: {
                    'vue-ueditor-wrap': VueUeditorWrap,
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'img-uploader': httpVueLoader('/common/components/imgUploader.vue'),
                    'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue')
                },
                computed: {

                },
                watch: {
                    dictionaryState(newName, oldName) {
                        //   this.fullName = newName + ' ' + this.lastName;
                        console.log(newName)
                        console.log(oldName)
                        if (newName == true) {
                            this.find_certification_type();
                        }
                    },

                    'certification_list': {
                        handler: function (newValue, oldValue) {
                            this.isCertificationed = newValue.certificationFlag === '03';
                        },
                        deep: true
                    },


                    authentication_type(newName, oldName) {
                        console.log(newName)
                        console.log(oldName)
                        this.showRadio = newName;
                        // this.textIndustryList = [];
                        // this.textList = [];
                        // if (newName == "1" || newName == "2") {
                        //     this.showType = 1
                        // } else if (newName == "3") {
                        //     this.showType = 2
                        // } else if (newName == "4") {
                        //     this.showType = 3
                        // }
                    }
                },
                methods: {
                    initData: function () {
                        let d = new Date()
                        let dy = d.getFullYear()
                        let dm = d.getMonth()
                        let dd = d.getDate()
                        this.saasId = localStorage.getItem('saasId');
                        var id = this.$utils.getReqStr('id');
                        this.id = id;
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)));
                        if (this.userInfo && this.userInfo.userName) {
                            this.myCertificateBrokerDetails(); // 查询经纪人证书详情
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },

                    getCertificateImg(path) {
                        return httpUrl.baseSchoolOutUrl + path;
                    },

                    //下载证书图片
                    getZmImg(path) {
                        // var uuid = "cms"+this.getDay()+ this.getHours()+ this.getMinutes()+this.getSeconds()+this.getMilliseconds()+ Math.round(Math.random() * 10000);
                        var imgUrl = httpUrl.baseSchoolOutUrl + path;
                        // this.download(imgUrl,1)
                        var lastIndex = path.lastIndexOf("/");
                        var imgName = path.substring(lastIndex);

                        userCenterApi.getZmImg({ imgUrl: imgUrl }).then(function (res) {
                            saveAs(res, "证书" + imgName, { type: 'image/png;charset=utf-8' })
                        });


                    },
                    // download(link,picName) {
                    //     let img = new Image()
                    //     img.setAttribute('crossOrigin', 'Anonymous')
                    //     img.crossOrigin
                    //     img.onload = function(){
                    //         let canvas = document.createElement('canvas')
                    //         let context = canvas.getContext('2d')
                    //         canvas.width = img.width
                    //         canvas.height = img.height
                    //         context.drawImage(img, 0, 0, img.width, img.height)
                    //         let url = canvas.toDataURL('images/png')
                    //         let a = document.createElement('a')
                    //         let event = new MouseEvent('click')
                    //         a.download = picName || 'default.png'
                    //         a.href = url
                    //         a.dispatchEvent(event)
                    //     }
                    //     img.src = link
                    // },

                    // 查询用户信息
                    myCertificagetUserInfo: function () {
                        var _this = this;
                        userCenterApi.myCertificagetUserInfo().then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var data = res.data;
                            console.log(data);
                            _this.userInfoType = data;

                            // organizationName: "高新技术企业申报（步扬科技）"
                            // phone: "15923168725"
                            // realName: ""
                            _this.brokerPlatform.brokerName = data.realName;
                            _this.transferAgencyForm.organName = data.organizationName;
                            _this.InvestmentForm.investmentName = data.organizationName;

                            // if (_this.userInfoType.identityType == '' || _this.userInfoType.identityType == undefined || _this.userInfoType.identityType == null) {
                            //     _this.$dialog.showToast("请先绑定个人信息");
                            //     setTimeout(function () {
                            //         window.location.href = '/common/usercenter/user_information.html';
                            //     }, 1000)
                            // } else if (_this.userInfoType.identityType != '01') {
                            //     _this.authentication_type = '3'
                            // } else {
                            //     _this.authentication_type = '1'
                            // }
                        })
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
                        _this.textList.splice(index, 1);
                        _this.tagList.splice(index, 1);

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
                        _this.industryList.splice(index, 1);
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

                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href = '/common/login.html';
                        }
                        var url = httpUrl.baseSchoolOutUrl + "/uc/myClass";
                        var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
                        var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
                        // window.open();
                        console.log(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
                        return window.open(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);

                    },
                    // 经纪人
                    brokerManager: function () {
                        var _this = this;

                        console.log(_this.certification_list)
                        var id = _this.certification_list.id
                        window.location.href = "user_market_auth_broker_management.html?id=" + id;

                        //   E:\front_pro\yzw\kj01\kj01\common\usercenter\user_market_auth_broker_management.html
                    },

                    //   查询经纪人证书详情
                    myCertificateBrokerDetails: function (phone) {
                        var _this = this;

                        var userPhone = localStorage.getItem("userPhone");
                        console.log(userPhone);
                        // if (null == userPhone && "" == userPhone || undefined == userPhone) {
                        //     window.location.href = '/common/login.html';
                        // }

                        var form = {
                            "mobile": userPhone,
                        };
                        // _this.certificate_or_not = false;

                        userCenterApi.myCertificateBrokerDetails(form).then(function (res) {
                            console.log(res);
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }

                            if (res.data.length > 0) {
                                // _this.certificate_or_not = true
                                _this.certificateList = res.data;

                            }
                        })
                    },



                    open() {
                        var _this = this;
                        this.$prompt('请输入技术转移机构名称', '绑定机构', {
                            confirmButtonText: '申请绑定',
                            cancelButtonText: '取消',
                            inputValidator: (value) => {
                                if ("" == value || null == value) {
                                    return "请输入机构名称";
                                }

                            }, beforeClose: function (action, instance, done) {
                                if (action === 'confirm') {
                                    var form = { "organName": instance.inputValue, "id": "" };
                                    userCenterApi.queryDetailsNative(form).then(function (res) {
                                        console.log(res);
                                        if (res.data == null) {
                                            _this.$dialog.showToast("该技术转移机构名称不存在，请确认后重试");
                                            return;
                                        }
                                        userCenterApi.saveZMVerifyBind(form).then(function (res) {
                                            console.log(res);
                                            if (!res.code) {
                                                _this.$dialog.showToast(res.message);
                                                return;
                                            }
                                            _this.$dialog.showToast("提交成功,请等待技术转移机构审核");
                                        })
                                    });
                                    done();
                                } else {
                                    done();
                                }
                            }
                        }).then(({ value }) => {

                            //     this.$message({
                            //       type: 'success',
                            //       message: '你的邮箱是: ' + value
                            //     });
                        }).catch(() => {
                            //     this.$message({
                            //       type: 'info',
                            //       message: '取消输入'
                            //     });
                        });
                    },
                    //   上传成功
                    //   imgUploadSuccess: function (id, url, type, data) {
                    //       this.certification_list[type] = id;
                    //       console.log(this.$refs.bgImg)
                    //       this.$refs.bgImg.style.backgroundImage = 'url(' + url + ')';
                    //   },
                    successFile(f) {
                        if(this.fileList.length>0){
                            this.fileList[0].name=f.result.fileName
                            this.fileList[0].id=f.result.id
                            this.brokerPlatform.certificatePic = f.result.id;
                        }else{
                            this.fileList.push({
                                name:f.result.fileName,
                                id:f.result.id,
                                url:''});
                            this.brokerPlatform.certificatePic = f.result.id;
                        }
                    },
                    handleRemove(f) {
                        console.log(f,"执行删除")
                        userCenterApi.deleteFileById({id: f.id}).then(res => {
                            if (res.code === 'rest.success') {
                                this.$message.success('删除成功')
                                this.fileList = []
                            }
                        });
                    },
                    handlePreview(f) {

                    },
                    imgUploadSuccess: function (id, url, type) {
                        this.headImg = id;
                        console.log(url)
                        this.$set(this.certification_list, 'logo', url);
                    },
                    //   binding_mechanism_active 绑定机构
                    binding_mechanism_active: function () {

                    },
                    //   提交经纪人
                    submitAuditBrokerResults: function () {
                        var _this = this;

                        _this.inputType = true;

                        console.log(_this.headImg)

                        // 转标签
                        if (_this.tagList.length > 0 && typeof (_this.tagList[0]) == "object") {
                            var idForm = [];
                            _this.tagList.forEach(element => {
                                idForm.push(element.id);
                            });
                            _this.tagList = idForm;
                        }

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

                        var form = _this.brokerPlatform;
                        form.id = _this.proId ? _this.proId : ""; // id
                        form.logo = _this.headImg; // 个人封面
                        console.log(_this.fileList,'----')
                        form.certificatePic = this.fileList[0].id
                        form.tags = _this.tagList;
                        form.industryType = _this.industryList;
                        form.techNo = _this.authentication_type == "1" ? 0 : form.techNo;
                        if (_this.noEmptyInputAuth(form)) {
                            console.log("form", form)
                            userCenterApi.edit_broker_form(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast("提交成功");
                                _this.find_certification_type();
                            })


                            var userFrom = {
                                "mobile": localStorage.getItem("userPhone"), //电话号码
                                "realNameYzw": form.brokerName,//真实姓名
                                "idCard": form.brokerIdCard,//身份证
                            }
                            console.log(userFrom);

                            userCenterApi.eduUserInfo(userFrom).then(function (res) {
                                console.log(res)
                            })
                        }
                    },


                    //   提交经纪人时 非空验证
                    noEmptyInputAuth: function (form) {
                        var _this = this;

                        if (!_this.$utils.validatesEmpty(form.brokerName)) {
                            _this.$dialog.showToast("姓名必填");
                            return false;
                        }
                        if (form.brokerIdCard.length != 18 || !_this.isIdValueNumber(form.brokerIdCard)) {
                            _this.$dialog.showToast("请输入有效身份证号");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.brokerSchool)) {
                            _this.$dialog.showToast("毕业学校必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.industryArea)) {
                            _this.$dialog.showToast("所学专业必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.academicDegree)) {
                            _this.$dialog.showToast("学历必填");
                            return false;
                        }

                        if (_this.authentication_type == "2") {
                            if (!_this.$utils.validatesEmpty(form.techNo)) {
                                _this.$dialog.showToast("证书编号必填");
                                return false;
                            }
                        }
                        if (!_this.isEmailsValue(form.brokerEmail)) {
                            _this.$dialog.showToast("请输入有效邮箱");
                            return false;
                        }
                        if (!_this.isPhoneValue(form.brokerPhone) || form.brokerPhone.length != 11) {
                            _this.$dialog.showToast("请输入有效手机号码");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.additionalService)) {
                            _this.$dialog.showToast("附加服务必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.certificateId)) {
                            _this.$dialog.showToast("证书编号必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.issuingUnit)) {
                            _this.$dialog.showToast("发证单位必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.certificatePic)) {
                            _this.$dialog.showToast("请上传证书复印件");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.post)) {
                            _this.$dialog.showToast("职务必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.work)) {
                            _this.$dialog.showToast("工作单位必填");
                            return false;
                        }

                        if (form.industryType.length < 1) {
                            _this.$dialog.showToast("行业类型必填");
                            return false;
                        }

                        if (form.tags.length < 1) {
                            _this.$dialog.showToast("标签必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.logo)) {
                            _this.$dialog.showToast("个人封面必填");
                            return false;
                        }
                        return true;

                    },

                    isEmailsValue: function (val) {
                        //   -1就是没有
                        if (val.indexOf("@") == -1) {
                            this.$dialog.showToast("请输入有效邮箱");
                            return false;;
                        } else {
                            return true;
                        }
                    },

                    //   电话号码验证
                    isPhoneValue: function (val) {
                        let value = val.replace('/(^\s*)|(\s*$)', '')    //  去除字符串前后空格
                        let num = Number(value);    //  将字符串转换为数字
                        if (isNaN(num) || value === '' || value === null) {
                            return false;;
                        } else {
                            return true;
                        }
                    },


                    //   验证身份证号码
                    isIdValueNumber: function (val) {
                        vals = val.charAt(val.length - 1);
                        vals = vals.toLowerCase();
                        val = val.substring(0, 17);
                        let value = val.replace('/(^\s*)|(\s*$)', '')    //  去除字符串前后空格
                        let values = vals.replace('/(^\s*)|(\s*$)', '')    //  去除字符串前后空格
                        let num = Number(value);    //  将字符串转换为数字
                        let nums = Number(values);    //  将字符串转换为数字
                        //   console.log(nums)
                        //   console.log(values)
                        if (isNaN(num) || value === '' || value === null) {    //  空字符串和null都会被当做数字
                            return false;
                        } else {
                            if (!isNaN(nums)) {   //  若最后一位是数字
                                return true;
                            } else if (isNaN(nums) && values == "x") {   //  判断最后一位不是数字，而且是x
                                return true;
                            } else if (values === '' || values === null) {
                                return false;
                            } else {
                                return false;
                            }
                        }
                    },


                    //   提交技术转移机构
                    submitAuditOrgan: function () {
                        var _this = this;

                        // if (_this.$utils.validatesEmpty(_this.certification_list) && _this.$utils.validatesEmpty(_this.certification_type)) {
                        //     _this.inputDataType = true;
                        // }
                        // if (_this.showType === 2) {
                        //     _this.noEmptyOrganAuth();
                        // }
                        // var form = {
                        //     "id": _this.inputDataType ? _this.proId : "",
                        //     "organName": _this.inputDataType ? _this.edit_organ_name : _this.organ_name,  //  机构名称：
                        //     "logo": _this.headImg,  //  机构logo
                        //     "organDes": _this.inputDataType ? _this.edit_organ_des : _this.organ_des,  //  机构描述：
                        // }
                        // console.log(form)
                        // console.log(_this.inputOrganType)

                        var form = _this.transferAgencyForm;
                        form.logo = _this.headImg;

                        if (_this.noEmptyOrganAuth(form)) {
                            console.log("form", form)
                            userCenterApi.edit_tech_organ(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast("提交成功");
                                _this.find_certification_type();

                            })
                        }
                    },

                    //   验证转移机构输入
                    noEmptyOrganAuth: function (form) {
                        var _this = this;
                        if (!_this.$utils.validatesEmpty(form.organName)) {
                            _this.$dialog.showToast("技术转移机构名称必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.organDes)) {
                            _this.$dialog.showToast("机构描述必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.logo)) {
                            _this.$dialog.showToast("机构logo必填");
                            return false;
                        }
                        return true;
                    },


                    //   提交投资机构
                    submitAuditInvest: function () {
                        var _this = this;

                        var form = _this.InvestmentForm;
                        console.log(_this.industryList);

                        // 转行业类型
                        if (_this.industryList.length > 0 && typeof (_this.industryList[0]) == "object") {
                            var datalist = []
                            _this.industryList.forEach(element => {
                                datalist.push(element.id);
                            });
                            _this.industryList = datalist;
                        }


                        form.logo = _this.headImg;
                        form.industryType = _this.industryList;
                        console.log(form.industryType)

                        if (_this.noEmptyInvestmentAuth(form)) {
                            console.log(form)
                            userCenterApi.edit_tech_investment(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast("提交成功");
                                _this.find_certification_type();
                            })
                        }
                    },

                    //   验证投资机构输入
                    noEmptyInvestmentAuth: function (form) {
                        var _this = this;
                        //   _this.inputInvestType = true;
                        if (!_this.$utils.validatesEmpty(form.investmentName)) {
                            _this.$dialog.showToast("投资机构名称必填");
                            return false;
                        }

                        if (!_this.$utils.validatesEmpty(form.investorType)) {
                            _this.$dialog.showToast("投资人类型必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.financeStage)) {
                            _this.$dialog.showToast("融资阶段必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.institutionalQuota)) {
                            _this.$dialog.showToast("投资范围必填");
                            return false;
                        }

                        if (form.industryType.length < 1) {
                            _this.$dialog.showToast("行业类型必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.investmentDes)) {
                            _this.$dialog.showToast("机构描述必填");
                            return false;
                        }
                        if (!_this.$utils.validatesEmpty(form.logo)) {
                            _this.$dialog.showToast("机构logo必填");
                            return false;
                        }

                        return true;

                    },

                    //   get_certification 查询是否有数据
                    find_certification_type: function () {
                        var _this = this;
                        userCenterApi.get_certification({}).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var data = res.data;

                            console.log("data", data)
                            if(res.data.info!==null){
                                if (!_this.$utils.validatesEmpty(data.info)) {
                                    _this.hasFormData = false;  // 判断显示是否显示输入框或者文本框
                                    // _this.hasFormDataJudg = false;  //没有数据，第一次填写
                                    _this.myCertificagetUserInfo();//用户信息
                                } else {
                                    _this.hasFormData = true;
                                    _this.certification_type = data.type;
                                    _this.proId = data.info.id
                                    var dataForm = data.info;
                                    _this.pic = dataForm.file.fileName
                                    this.fileList[0].name= dataForm.file.fileName
                                    this.fileList[0].id=dataForm.file.id
                                    this.fileList[0].url= httpUrl.fileShowUrl + '/resource/' + dataForm.file.path
                                    // id转字典文字
                                    dataForm.academicDegree_display = _this.forEachDisplay(_this.academic_degree_list, dataForm.academicDegree);
                                    dataForm.agentType_display = _this.forEachDisplay(_this.agent_type_list, dataForm.agentType);
                                    dataForm.investorType_display = _this.forEachDisplay(_this.investor_type_list, dataForm.investorType);
                                    dataForm.financeStage_display = _this.forEachDisplay(_this.finance_stage_list, dataForm.financeStage);
                                    dataForm.institutionalQuota_display = _this.forEachDisplay(_this.institutional_quota_list, dataForm.institutionalQuota);

                                    // 行业类型
                                    _this.certification_list = dataForm;
                                    if (_this.$utils.validatesEmpty(dataForm.industryType)) {

                                        if (dataForm.industryType.length > 0 && typeof (dataForm.industryType[0]) == "object") {
                                            _this.textIndustryList = dataForm.industryType;
                                            _this.industryList = dataForm.industryType;
                                        }
                                    }
                                    // 标签
                                    if (_this.$utils.validatesEmpty(dataForm.tags)) {
                                        if (dataForm.certificationFlag == 1 || dataForm.tags.length > 0) {
                                            var textBox = [];
                                            console.log(dataForm.tags)
                                            if (_this.$utils.validatesEmpty(dataForm.tags)) {
                                                dataForm.tags.forEach(element => {
                                                    textBox.push(element.name)
                                                });
                                            }

                                        }

                                        if (dataForm.tags.length > 0 && typeof (dataForm.tags[0]) == "object") {
                                            _this.tagList = dataForm.tags;
                                            _this.textList = dataForm.tags;
                                        }

                                    }
                                    // 附加服务
                                    console.log("dataForm.additionalService", dataForm.zMTechBrokerAdditionalList)
                                    if (_this.$utils.validatesEmpty(dataForm.zMTechBrokerAdditionalList) && dataForm.zMTechBrokerAdditionalList.length > 0) {
                                        dataForm.additionalService = (dataForm.zMTechBrokerAdditionalList[0].additionalService) + "";
                                        // brokerPlatform_additionalService = (dataForm.zMTechBrokerAdditionalList[0].additionalService) + "";
                                        dataForm.additionalService_display = _this.forEachDisplay(_this.additional_service_list, dataForm.zMTechBrokerAdditionalList[0].additionalService);
                                    }

                                    _this.certification_noPassReason = data.noPassReason;
                                    if (_this.$utils.validatesEmpty(dataForm.logo)) {
                                        _this.find_img_file_url_query(dataForm.logo);
                                    }

                                    if (_this.$utils.validatesEmpty(dataForm.logo)) {
                                        _this.headImg = dataForm.logo;
                                    }
                                    if (_this.$utils.validatesEmpty(dataForm.certificatePic)) {
                                        _this.fileList.id = dataForm.certificatePic;
                                    }

                                    if (_this.certification_type == 'TECH_BROKER') {
                                        _this.authentication_type = 1;
                                        _this.brokerPlatform = dataForm;
                                    } else if (_this.certification_type == 'TECH_BROKER_REMOTE') {

                                        _this.authentication_type = 2;
                                        _this.brokerPlatform = dataForm;

                                    } else if (_this.certification_type == 'TECH_ORGAN') {
                                        _this.authentication_type = 3;
                                        _this.transferAgencyForm = dataForm;

                                    } else if (_this.certification_type == 'INVESTMENT') {
                                        _this.authentication_type = 4;
                                        _this.InvestmentForm = dataForm;
                                    }

                                    console.log("_this.authentication_type", _this.authentication_type)
                                    console.log("_this.textIndustryList", _this.textIndustryList)
                                }
                            }else {
                                _this.getFrom()
                            }

                        })
                    },

                    getFrom:function (){
                        var _this = this;
                        userCenterApi.get_edit_form().then(function (res) {
                            console.log(res.data,'数据');
                                _this.brokerPlatform = res.data
                                _this.proId = res.data.id
                                var dataForm = res.data
                                // id转字典文字
                                dataForm.academicDegree_display = _this.forEachDisplay(_this.academic_degree_list, dataForm.academicDegree);
                                dataForm.agentType_display = _this.forEachDisplay(_this.agent_type_list, dataForm.agentType);
                                dataForm.investorType_display = _this.forEachDisplay(_this.investor_type_list, dataForm.investorType);
                                dataForm.financeStage_display = _this.forEachDisplay(_this.finance_stage_list, dataForm.financeStage);
                                dataForm.institutionalQuota_display = _this.forEachDisplay(_this.institutional_quota_list, dataForm.institutionalQuota);

                                // 行业类型
                                _this.certification_list = dataForm;
                                _this.certification_list.logo = httpUrl.fileShowUrl + '/resource/' + dataForm.path
                                if (_this.$utils.validatesEmpty(dataForm.industryTypeDisplay)) {

                                    if (dataForm.industryTypeDisplay.length > 0 && typeof (dataForm.industryTypeDisplay[0]) == "object") {
                                        _this.textIndustryList = dataForm.industryTypeDisplay;
                                        _this.industryList = dataForm.industryTypeDisplay;
                                    }
                                }
                                // 标签
                                if (_this.$utils.validatesEmpty(dataForm.tagsDisplay)) {
                                    if (dataForm.certificationFlag == 1 || dataForm.tags.length > 0) {
                                        var textBox = [];
                                        console.log(dataForm.tags)
                                        if (_this.$utils.validatesEmpty(dataForm.tagsDisplay)) {
                                            dataForm.tagsDisplay.forEach(element => {
                                                textBox.push(element.name)
                                            });
                                        }

                                    }

                                    if (dataForm.tagsDisplay.length > 0 && typeof (dataForm.tagsDisplay[0]) == "object") {
                                        _this.tagList = dataForm.tagsDisplay;
                                        _this.textList = dataForm.tagsDisplay;
                                    }

                                }
                                // 附加服务
                                console.log("dataForm.additionalService", dataForm.zMTechBrokerAdditionalList)
                                if (_this.$utils.validatesEmpty(dataForm.zMTechBrokerAdditionalList) && dataForm.zMTechBrokerAdditionalList.length > 0) {
                                    dataForm.additionalService = (dataForm.zMTechBrokerAdditionalList[0].additionalService) + "";
                                    // brokerPlatform_additionalService = (dataForm.zMTechBrokerAdditionalList[0].additionalService) + "";
                                    dataForm.additionalService_display = _this.forEachDisplay(_this.additional_service_list, dataForm.zMTechBrokerAdditionalList[0].additionalService);
                                }

                                _this.certification_noPassReason = data.noPassReason;
                                if (_this.$utils.validatesEmpty(dataForm.logo)) {
                                    // _this.find_img_file_url_query(dataForm.logo);
                                }

                                if (_this.$utils.validatesEmpty(dataForm.logo)) {
                                    _this.headImg = dataForm.logo;
                                }

                        })
                    },
                    //   查询附件
                    find_img_file_url_query: function (id) {
                        var _this = this
                        userCenterApi.find_attachment_query(id).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            console.log(res.data)
                            var url = "";
                            url = httpUrl.fileShowUrl + '/resource/' + res.data.path
                            console.log(url)
                            _this.personImg = url
                            _this.certification_list.logo = url
                        })
                    },



                    //   根据字典查id对应的文字
                    forEachDisplay: function (arrayList, id) {
                        var value = ""
                        arrayList.forEach(function (element) {
                            if (id == element.dictValue) {
                                value = element.display
                            }
                        });
                        return value;
                    },

                    //   查询字典表
                    find_dictionary_type_list: function () {
                        var _this = this;
                        var form = [
                            "agent_type",  //  行业类型
                            "industry_area",  //  擅长领域
                            "additional_service",  //  附加服务
                            "investor_type",  //  投资人类型
                            "finance_stage",  //  融资阶段
                            "institutional_quota",  //  投资范围
                            "academic_degree",
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
                                if (element.dictCode === "agent_type") {
                                    element.data.forEach(element => {
                                        _this.agent_type_list.push(element);
                                        _this.investment_industry_type_list.push(element);
                                    });
                                } else if (element.dictCode === "industry_area") {
                                    element.data.forEach(element => {
                                        _this.industry_type_list.push(element);
                                    });
                                } else if (element.dictCode === "additional_service") {
                                    element.data.forEach(element => {
                                        _this.additional_service_list.push(element);
                                    });
                                } else if (element.dictCode === "investor_type") {
                                    element.data.forEach(element => {
                                        _this.investor_type_list.push(element);
                                    });
                                } else if (element.dictCode === "finance_stage") {
                                    element.data.forEach(element => {
                                        _this.finance_stage_list.push(element);
                                    });
                                } else if (element.dictCode === "institutional_quota") {
                                    element.data.forEach(element => {
                                        _this.institutional_quota_list.push(element);
                                    });
                                } else if (element.dictCode === "academic_degree") {
                                    element.data.forEach(element => {
                                        _this.academic_degree_list.push(element);
                                    });
                                }
                                if (i == (datalist.length - 1)) {
                                    _this.dictionaryState = true;
                                }
                            }
                            console.log(_this.investor_type_list)
                        })
                    },
                    changeA: function (args) {
                        console.log(":" + this.brokerPlatform.additionalService);
                        console.log(args);
                        this.$forceUpdate();

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
                    /////////////////////////////////匹配///////////////////////////////////////
                    getImgPath(path) {
                        return httpUrl.fileShowUrl + '/resource/' + path;
                    },

                    // 跳转
                    handleMatchView: function (id, type) {
                        console.log(type)
                        if (type == 0) {
                            window.open("/technologyMarket/tech_achievements_details.html?id=" + id);
                        } else if (type == 1) {
                            window.open("/technologyMarket/tech_requirements_details.html?id=" + id);
                        }

                    },

                    // 查询匹配的技术经纪人信息 通过需求id或成果id
                    getProjectListPage: function (id) {
                        var _this = this;

                        _this.formList0.payload = id;
                        userCenterApi.queryMatchInfoProject(_this.formList0).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist.records)

                            _this.matchDate0 = datalist.records;
                        })
                    },


                    // 查询匹配的技术成果需求信息 通过技术经纪人id或成果id
                    getDemandListPage: function (id) {
                        var _this = this;

                        _this.formList1.payload = id;
                        userCenterApi.queryMatchInfoDemand(_this.formList1).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist.records)

                            _this.matchDate1 = datalist.records;
                        })
                    },


                    matchingNeedsAchievements() {
                        var _this = this;
                        console.log(_this.proId)
                        _this.getProjectListPage(_this.proId);
                        _this.getDemandListPage(_this.proId);
                        _this.matchShow = true;
                    },

                },
            });
        });
});
