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
                        fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
                        uploadData: {
                            system: 'ts'
                        },
                        uploadHeader: {},
                        formData: {
                            id: '',
                            name: '',//姓名
                            introduction:'',//专家介绍
                            contactName: '',//联系人姓名及职务
                            contactPhone: '',//联系方式
                            expertPhotos:'',//专家照片
                            expertPhotosId:'',
                            delFlag: '0',
                            version: '0',
                            isSubmit:0,
                        },
                        isActive: false,
                        isClose:false,
                        rules: {
                            name: [
                                {required: true, message: '请输入姓名',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            introduction: [
                                {required: true, message: '请输入专家介绍',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            contactName: [
                                {required: true, message: '请输入联系人姓名及职务', trigger: 'blur'},
                            ],
                            contactPhone: [
                                {required: true, message: '请填写联系方式',trigger: 'blur'},
                                {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码'}
                            ],
                            expertPhotos: [
                                {required:true, message: '请上传专家照片',trigger: 'blur'}
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

                    getData() {
                        indexApi.selectExpert().then((res) => {
                            if(res.code !== 'rest.success'){
                                window.location.href = "/common/login.html?back=/expert.html";
                            }
                            if (res.code == 'rest.success' && res.result) {
                                this.formData = res.result
                                this.formData.expertPhotos = res.result.expertPhotos.url
                            }
                                if (this.formData.isSubmit == 1) {
                                    this.isActive = true;
                                    this.isShow = true;
                                } else {
                                    this.isActive = false;
                                    this.isShow = false;
                                }
                        })
                    },
                    keep() {
                        this.formData.isSubmit = 0
                        indexApi.expertSubmit(this.formData).then((res) => {
                            if (res.code == 'rest.success') {
                                this.$notify.success({
                                    title: '成功！',
                                    message: '保存成功!',
                                    duration: 2000
                                });
                                setTimeout(function () {
                                    window.location.href = "/expert.html";
                                }, 2000);
                            } else {
                                this.$notify.error({
                                    title: '提示！',
                                    message: '请先登录!'
                                });
                                setTimeout(function () {
                                    window.location.href = "/common/login.html?back=/expert.html";
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
                                    indexApi.expertSubmit(this.formData).then((res) => {
                                        if (res.code == 'rest.success') {
                                            this.$notify.success({
                                                title: '成功！',
                                                message: '提交成功!',
                                                duration: 2000
                                            });
                                            setTimeout(function () {
                                                window.location.href = "/expert.html";
                                            }, 2000);
                                        } else {
                                            this.$notify.error({
                                                title: '提示！',
                                                message: '请先登录!'
                                            });
                                            setTimeout(function () {
                                                window.location.href = "/common/login.html?back=/expert.html";
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
                            this.formData.expertPhotosId = successInfo.data.id;
                            this.formData.expertPhotos = successInfo.data.url;
                            this.isFileLoad = false
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


