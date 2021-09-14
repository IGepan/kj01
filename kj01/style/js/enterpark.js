require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl', '/style/js/api/index.js', 'ELEMENT'],
        function ($, Vue, httpVueLoader, httpUrl, indexApi, ELEMENT) {
            Vue.component('vue-ueditor-wrap', VueUeditorWrap)
            new Vue({
                el: '#index_box',
                data: function () {
                    return {
                        ueditorConfig: {
                            initialFrameHeight: 240,
                            maximumWords: 5000
                        },
                        dialogImageUrl: '',
                        dialogVisible: false,
                        disabled: false,
                        isDisabledPlan: false,
                        isDisabledDeclare: false,
                        isShow: false,
                        isFileLoad: false,
                        isFile1Load: false,
                        isFile2Load: false,
                        isFile3Load: false,
                        fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
                        uploadData: {
                            system: 'ts'
                        },
                        uploadHeader: {},
                        serviceList: [{
                            value: '科技政策',
                            label: '科技政策'
                        }, {
                            value: '法律顾问',
                            label: '法律顾问'
                        }, {
                            value: '知识产权',
                            label: '知识产权'
                        }, {
                            value: '投融资',
                            label: '投融资'
                        }, {
                            value: '产业培训',
                            label: '产业培训'
                        },
                            {
                                value: '其他',
                                label: '其他'
                            }],
                        formData: {
                            id: '',
                            companyName: '',//企业名称
                            companyType:'',//企业类型
                            capital:'',//注册资本
                            businessScope:'',//经营范围
                            address: '',//经营地址
                            contactName: '',//联系人姓名及职务
                            contactPhone: '',//联系方式
                            companyProfile:'',//企业简介
                            isJoinDepository: 2,//是否入科技型企业库
                            plan: 1,//是否计划入科技型企业库
                            highTech: 2,//是否是高新技术企业
                            declare: 1,//是否计划申报高新技术企业
                            officeStaff:'',//办公人数
                            siteArea:'',//场地面积
                            siteDemand:'',//场地特殊需求
                            service:'',//需要产业园提供服务
                            otherService:'',//其他服务
                            businessLicense:'',//营业执照
                            businessLicenseId:'',
                            attachmentIdUrl1: '',
                            attachmentIdUrl2: '',
                            attachmentIdUrl3: '',//法人身份证
                            attachmentIdUrl1Id:'',
                            attachmentIdUrl2Id:'',
                            attachmentIdUrl3Id:'',
                            person:1,//法人或代理人
                            delFlag: '0',
                            version: '0',
                            isSubmit:0,
                        },
                        isActive: false,
                        isClose:false,
                        rules: {
                            companyName: [
                                {required: true, message: '请输入企业名称',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            companyType: [
                                {required: true, message: '请输入企业类型',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            capital: [
                                {required: true, message: '请输入注册资本',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            businessScope: [
                                {required: true, message: '请输入经营范围',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            address: [
                                {required: true, message: '请输入经营地址',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            contactName: [
                                {required: true, message: '请输入联系人姓名及职务', trigger: 'blur'},
                            ],
                            contactPhone: [
                                {required: true, message: '请填写联系方式',trigger: 'blur'},
                                {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码'}
                            ],
                            companyProfile: [
                                {required: true, message: '请输入企业简介',trigger: 'blur'},
                            ],
                            officeStaff: [
                                {required: true, message: '请输入办公人数',trigger: 'blur'},
                            ],
                            siteArea: [
                                {required: true, message: '请输入场地面积',trigger: 'blur'},
                            ],
                            siteDemand: [
                                {required: true, message: '请输入场地特殊需求',trigger: 'blur'},
                            ],
                            service: [
                                {required:true, message: '请输选择需要提供的服务',trigger: 'blur'}
                            ],
                            businessLicense: [
                                {required:true, message: '请上传营业执照副本',trigger: 'blur'}
                            ],
                            person: [
                                {required:true, message: '请选择身份',trigger: 'blur'}
                            ],
                            attachmentIdUrl1: [
                                {required:true, message: '请上传证件正面',trigger: 'blur'}
                            ],
                            attachmentIdUrl2: [
                                {required:true, message: '请上传证件反面',trigger: 'blur'}
                            ],
                            attachmentIdUrl3: [
                                {required:true, message: '请上传委托授权书',trigger: 'blur'}
                            ],

                        },

                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'ly-upload': httpVueLoader('/common/components/upload.vue')
                },
                created() {
                    this.getData()
                },
                methods: {
                    file:function(){
                        this.isFileLoad = true
            },
                    file3: function () {
                        this.isFile3Load = true
                    },
                    file2: function () {
                        this.isFile2Load = true
                    },
                    file1: function () {
                        this.isFile1Load = true
                    },

                    getData() {
                        indexApi.selectQuest().then((res) => {
                            if(res.code !== 'rest.success'){
                                window.location.href = "/common/login.html?back=/enterpark.html";
                            }
                           if (res.code == 'rest.success' && res.result) {
                               this.formData = res.result
                               this.formData.businessLicense = res.result.businessLicense.url
                               this.formData.attachmentIdUrl1 = res.result.attachmentIdUrl1.url
                               this.formData.attachmentIdUrl2 = res.result.attachmentIdUrl2.url
                               if(res.result.attachmentIdUrl3){
                                   this.formData.attachmentIdUrl3 = res.result.attachmentIdUrl3.url
                               }
                                if (this.formData.isJoinDepository == 1) {
                                    this.isDisabledPlan = true;
                                }
                                if (this.formData.highTech == 1) {
                                    this.isDisabledDeclare = true;
                                }
                                if (this.formData.isSubmit == 1) {
                                    console.log(this.formData)
                                    this.isActive = true;
                                    this.isShow = true;
                                } else {
                                    this.isActive = false;
                                    this.isShow = false;
                                }
                            }
                        })
                    },
                    keep() {
                        this.formData.isSubmit = 0
                        indexApi.ApplySubmit(this.formData).then((res) => {
                            if (res.code == 'rest.success') {
                                this.$notify.success({
                                    title: '成功！',
                                    message: '保存成功!',
                                    duration: 2000
                                });
                                setTimeout(function () {
                                    window.location.href = "/enterpark.html";
                                }, 2000);
                            } else {
                                this.$notify.error({
                                    title: '提示！',
                                    message: '请先登录!'
                                });
                                setTimeout(function () {
                                    window.location.href = "/common/login.html?back=/enterpark.html";
                                }, 1000);
                            }
                        });
                    },
                    //提交表单
                    ApplySubmit() {
                        // this.$alert('本次征集已结束', '提示', {
                        //     confirmButtonText: '确定',
                        //     callback: action => {
                        //         window.location.href=$pathPrefix+'/index.html'
                        //     }
                        // });
                        this.$confirm('此次提交后不可修改, 是否继续提交?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(() => {
                            this.$refs.form.validate((valid) => {
                                console.log(valid, 'valid')
                                if (valid) {
                                    this.formData.isSubmit = 1
                                    indexApi.ApplySubmit(this.formData).then((res) => {
                                        if (res.code == 'rest.success') {
                                            this.$notify.success({
                                                title: '成功！',
                                                message: '提交成功!',
                                                duration: 2000
                                            });
                                            setTimeout(function () {
                                                window.location.href = "/enterpark.html";
                                            }, 2000);
                                        } else {
                                            this.$notify.error({
                                                title: '提示！',
                                                message: '请先登录!'
                                            });
                                            setTimeout(function () {
                                                window.location.href = "/common/login.html?back=/enterpark.html";
                                            }, 1000);
                                        }
                                    });
                                } else {
                                    this.$notify.error({
                                        title: '提示！',
                                        message: '请先完善信息填写!'
                                    });
                                }
                            });
                        }).catch(() => {
                            console.log("diandaolezheli ")
                            this.$message({
                                type: 'info',
                                message: '已取消提交'
                            });
                        });

                    },
                    /**
                     * 图片上传回调
                     */
                    cimgUploadSuccess (successInfo) {
                        if(successInfo.exp.type === 'Photo'){
                            this.formData.businessLicenseId = successInfo.data.id;
                            this.formData.businessLicense = successInfo.data.url;
                            this.isFileLoad = false
                        }//营业执照
                        if (successInfo.exp.type === 'mainPhoto') {
                            this.formData.attachmentIdUrl1Id = successInfo.data.id;
                            this.formData.attachmentIdUrl1 = successInfo.data.url;
                            this.isFile1Load = false
                        }
                        if (successInfo.exp.type === 'secrecy') {
                            this.formData.attachmentIdUrl2Id = successInfo.data.id;
                            this.formData.attachmentIdUrl2 = successInfo.data.url;
                            this.isFile2Load = false
                        }
                        if(successInfo.exp.type === 'certificate'){
                            this.formData.attachmentIdUrl3Id = successInfo.data.id;
                            this.formData.attachmentIdUrl3 = successInfo.data.url;
                            this.isFile3Load = false
                        }
                    },
                    handlePlan(val) {
                        if (val == 1) {
                            this.formData.plan = 2;
                            this.isDisabledPlan = true;
                        } else {
                            this.isDisabledPlan = false;
                        }
                    },

                    handleDeclare(val) {
                        if (val == 1) {
                            this.formData.declare = 2;
                            this.isDisabledDeclare = true;
                        } else {
                            this.isDisabledDeclare = false;
                        }
                    },
                    //重置表单
                    clearForm() {
                        for (let key in this.formData) {
                            this.formData[key] = ''
                            scrollTo(0, 0);
                        }
                        // this.$refs.from.resetFields();

                        // this.formData={}
                        this.formData.noticeId = '1';
                        this.formData.status = '1';
                        this.formData.intention = '1';
                        this.formData.isExperience = '1';
                        this.formData.isExhibition = '1';
                    }
                }
            });
        });
});


