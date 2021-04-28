// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate', 'img_captcha', 'httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl, validate, captcha, httpLogin) {
            window.vueDom= new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    isPhoneError: false,
                    isShowDialog: false,
                    isSubmitDisabled: false,
                    isDisabled: false,
                    codeTime: 60,
                    codeBtnText: '发送验证码',
                    phoneErrorMsg: '',
                    formData: {
                        feedName: '',
                        content: '',
                        userName: '',
                        phone: '',
                        code: '',
                        fileId: []
                    },
                    rules: {
                        feedName: [
                            { required: true, message: '请填写商家名称', trigger: 'blur' }
                        ],
                        content: [
                            { required: true, message: '请填写投诉原因', trigger: 'blur' }
                        ],
                        userName: [
                            { required: true, message: '请填写您的姓名', trigger: 'blur' }
                        ],
                        phone: [
                            { required: true, message: '请输入您的手机号', trigger: 'blur' },
                            {
                                pattern:/^1[345678]\d{9}$/,  //正则
                                message: '请输入正确手机号'
                            }
                        ],
                        code: [
                            { required: true, message: '请输入验证码', trigger: 'blur' }
                        ]
                    },
                    imgOption: {
                        size: "470,380",
                        prev: "exbtn",
                        url: this.httpUrl.imgUploadUrl + '/file/resource/uploadImg'
                    },
                    mainPhotoList: [],
                    footList: [],
                    importFileUrl: this.httpUrl.imgUploadUrl + '/file/resource/uploadImg',
                    fileReader: new FileReader(),
                },
                filters: {},
                mounted: function () {
                },
                components: {
                    'ly-upload': httpVueLoader('/common/components/upload.vue'),
                    'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
                    'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
                    'header-mail': httpVueLoader('/style/components/header_mail.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'img-uploader': httpVueLoader('/common/components/imgUploader.vue')
                },
                created: function () {

                },
                methods: {
                    /**
                     * 发送短信
                     */
                    sendClick: function (event) {
                        event.preventDefault() //阻止form表单默认提交
                        var phone = this.formData.phone;

                        if (phone == '') {
                            this.$message.error('请输入正确的手机号');
                            return
                        }
                        // 格式校验
                        if (!(/^1[345678]\d{9}$/.test(phone))) {
                            this.$message.error('请输入正确的手机号');
                            return
                        }
                        this.isShowDialog = true;
                        var vm = this;
                        setTimeout(function () {
                            if (vm.$refs.validateRef) {
                                vm.$refs.validateRef.initImg(captcha, httpUrl);
                            }
                        }, 200)
                    }, /**
                     * 滑块验证成功
                     */
                    onSuccess: function (captchaData) {
                        const vm = this;
                        vm.isShowDialog = false;
                        vm.isDisabled = true
                        this.captchaData = captchaData;
                        // 发短信滑块验证
                        httpLogin.sendCaptchaCode({
                            validateSrc: this.formData.phone,
                            businessType: dic.businessType.BUSINESS_TYPE_009,
                            type: 'slider',
                            token: captchaData.token,
                            code: captchaData.code
                        }).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.codeBtnText = vm.codeTime;
                                var interval = setInterval(function () {
                                    vm.codeBtnText--;
                                    if (vm.codeBtnText == 0) {
                                        clearInterval(interval);
                                        vm.isDisabled = false
                                        vm.codeBtnText = '发送验证码'
                                    }
                                }, 1000)
                                vm.$dialog.showToast('验证码已发送');
                            } else {
                                vm.$dialog.showToast('验证码发送失败');
                                vm.isDisabled = false
                            }
                        }).catch(function (error) {
                            vm.$dialog.showToast('验证码发送失败');
                            vm.isDisabled = false
                        });
                    },
                    /**
                     * 提交投诉
                     */
                    subClick: function (event) {
                        var vm = this;
                        vm.$refs.formInfo.validate((valid) => {

                            if (!valid) {
                                return false
                            }
                            vm.feedbackSubmit();
                        })

                    },
                    feedbackSubmit: function () {
                        var vm = this;
                        var param = JSON.parse(JSON.stringify(vm.formData));
                        !vm.isSubmitDisabled && (this.isSubmitDisabled = true,
                                indexApi.saveMailFeedback(param).then(function (data) {
                                    if (data.code == 'rest.success') {
                                        vm.$dialog.showToast('发布成功');
                                        vm.formData = {}
                                        vm.mainPhotoList={}
                                        vm.isSubmitDisabled = false
                                    } else {
                                        vm.isSubmitDisabled = false
                                        vm.$dialog.showToast(data.desc);
                                    }
                                }).catch(function () {
                                    vm.isSubmitDisabled = false
                                })
                        )
                    },
                    httpRequest(options) {
                        const file = options.file
                        if (file) {
                            this.fileReader.readAsDataURL(file)
                        }
                        this.fileReader.onload = () => {
                            const base64Str = this.fileReader.result
                            var vm=this;
                            $.ajax({
                                'url': this.importFileUrl,
                                'data': { file: base64Str, system: 'ts' },
                                'type': 'post',
                                'contentType': 'application/x-www-form-urlencoded;charset=UTF-8',
                                'dataType': 'json',
                                'async': true,
                                'success': function (e) {
                                    if (e.code == "rest.success") {
                                        vm.mainPhotoList.push(e.result.url);
                                        vm.formData.fileId.push(e.result.id)
                                    }else {
                                        vm.$message.error('上传失败');
                                    }
                                },
                                'error': function (error) {
                                    vm.$message.error('上传失败');
                                },
                                'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),
                                'beforeSend': function () { },
                            });
                        }
                    },
                    beforeUpload(file) {
                        const isLt5M = file.size < 10 * 1024 * 1024
                        const types = ['image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/png'];
                        const isImage = types.includes(file.type);
                        if (!isImage) {
                            this.$message.error('上传图片只能是 JPG、JPEG、gif、bmp、PNG 格式!');
                            return false;
                        }
                        if (!isLt5M) {
                            this.$message.error('文件不能超过10MB')
                            return false
                        }
                    },
                    delMainPhotoClick: function (index) {
                        this.mainPhotoList.splice(index, 1);
                        this.formData.fileId.splice(index, 1);
                    },
                }
            });
        })
});
