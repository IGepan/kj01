require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl', '/style/js/api/index.js', 'ELEMENT'],
        function ($, Vue, httpVueLoader, httpUrl, indexApi, ELEMENT) {
            Vue.component('vue-ueditor-wrap', VueUeditorWrap)
            new Vue({
                el: '#index_box',
                data: function () {
                    var validateNum= (rule, value, callback) => {
                        if (!this.formData.contactLandline && !this.formData.contactPhone) {
                            callback(new Error('请至少填写一个联系方式'));
                        } else {
                            callback();
                        }
                    };
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
                        serviceList: [
                            {
                                value: "政策申报",label: "政策申报",
                            },
                            {
                                value: '技术转移', label: "技术转移"
                            },
                            {
                                value: "科技咨询评估", label: "科技咨询评估",
                            },

                            {
                                value: "检验检测", label: "检验检测",
                            },
                            {
                                value: "工商财税", label: "工商财税",
                            },
                            {
                                value: "科技金融", label: "科技金融",
                            },
                            {
                                value: '知识产权', label: "知识产权"
                            },
                            {
                                value: "法律服务", label: "法律服务",

                            },
                            {
                                value: "研发设计", label: "研发设计",

                            },
                            {
                                value: '其他',
                                label: '其他'
                            }],
                        formData: {
                            id:'',
                            companyName: '',//单位名称
                            // address: '',//单位地址
                            // companyProfile:'',//单位简介
                            // service:'',//服务类型
                            // qualifications:'',//获得专业服务资质情况
                            contactName: '',//联系人姓名
                            contactTitle:'',//联系人职务
                            // wechatNumber:'',//微信号
                            contactLandline:'',//联系电话
                            // contactPhone: '',//联系手机
                            // email:'',//邮箱
                            // otherService:'',//其他服务
                            delFlag: '0',
                            version: '0',
                            isSubmit:0,
                        },
                        isActive: false,
                        isClose:false,
                        rules: {
                            companyName: [
                                {required: true, message: '请输入单位名称',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            address: [
                                {required: true, message: '请输入单位地址',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            companyProfile: [
                                {required: true, message: '请输入单位简介',trigger: 'blur'},
                            ],
                            service: [
                                {required:true, message: '请选择服务',trigger: 'blur'}
                            ],
                            qualifications: [
                                {required: true, message: '请输入服务案例',trigger: 'blur'},
                            ],
                            contactName: [
                                {required: true, message: '请输入联系人姓名', trigger: 'blur'},
                            ],
                            contactTitle: [
                                {required: true, message: '请输入联系人职务', trigger: 'blur'},
                            ],
                            wechatNumber: [
                                {required: true, message: '请输入联系人微信号', trigger: 'blur'},
                            ],
                            contactLandline: [
                                {required: true,message: '请输入联系人电话',trigger: 'blur'},
                                {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码',trigger: 'blur'}
                            ],
                            contactPhone: [
                                {required: true, trigger: 'blur'},
                                {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码',trigger: 'blur'}
                            ],
                            email: [
                                {required: true, message: '请输入E-mail',trigger: 'blur'},
                                {pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, message: '请填写正确的邮箱',trigger: 'blur'}
                            ],
                            otherService: [
                                {required:true, message: '请输入其他服务',trigger: 'blur'}
                            ],
                        },

                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'tag': httpVueLoader('/style/components/tag.vue')
                },
                created() {
                    // this.$alert('本次调查问卷已结束，感谢您的关注', '提示', {
                    //     confirmButtonText: '确定',
                    //     center: true,
                    //     callback() {
                    //         window.location.href = "/index.html"
                    //     }
                    // });
                    // window.location.href='https://www.kj01.cn/test.html'
                    this.getData()
                },
                methods: {
                    getData() {
                        indexApi.selectTerrace().then((res) => {
                            if(res.code !== 'rest.success'){
                                window.location.href = "/common/login.html?back=/mechanism.html";
                            }
                           if (res.code == 'rest.success' && res.result) {
                                this.formData = res.result
                                if (this.formData.isSubmit == 1) {
                                    this.isActive = true;
                                } else {
                                    this.isActive = false;
                                }
                            }
                        })
                    },
                    keep() {
                        this.formData.isSubmit = 0
                        indexApi.terraceSubmit(this.formData).then((res) => {
                            if (res.code == 'rest.success') {
                                this.$notify.success({
                                    title: '成功！',
                                    message: '保存成功!',
                                    duration: 2000
                                });
                                setTimeout(function () {
                                    window.location.href = "/mechanism.html";
                                }, 2000);
                            } else {
                                this.$notify.error({
                                    title: '提示！',
                                    message: '请先登录!'
                                });
                                setTimeout(function () {
                                    window.location.href = "/common/login.html?back=/mechanism.html";
                                }, 1000);
                            }
                        });
                    },
                    //提交表单
                    Submit() {
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
                                    indexApi.terraceSubmit(this.formData).then((res) => {
                                        if (res.code == 'rest.success') {
                                            this.$notify.success({
                                                title: '成功！',
                                                message: '提交成功!',
                                                duration: 2000
                                            });
                                            setTimeout(function () {
                                                window.location.href = "/mechanism.html";
                                            }, 2000);
                                        } else {
                                            this.$notify.error({
                                                title: '提示！',
                                                message: '请先登录!'
                                            });
                                            setTimeout(function () {
                                                window.location.href = "/common/login.html?back=/mechanism.html";
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


