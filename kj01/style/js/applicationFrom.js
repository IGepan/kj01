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
                        isDisabledPlan: false,
                        isDisabledDeclare: false,
                        formData: {
                            id: '',
                            name: '',	//姓名
                            idNumber: '',	//身份证号
                            sex:0,	//性别( 0 男  1 女 )
                            age:'',	//年龄
                            phone:'',//手机号
                            job:'',	//职务
                            title:'',	//职称
                            email:'',	//电子邮箱
                            rank:0,	//专业能力（0 初级技术经纪人 ；1 中级技术经纪人； 2 高级技术经纪人）
                            company:'', //单位
                            address:'',	//地址
                            registeredAmount:'',	//促进技术合同登记金额
                            registeredNumber:'',	//促进技术合同登记项数
                            transactionAmount:'',	//技术交易额
                            economicPerformance:'',	//经济效益
                            promotingNumber:'',	//促进成果交易数量
                            promotingAmount:'',	//促进成果交易金额
                            active:'',	//组织技术培训、推广和产学研等活动
                            demand:'',	//征集企业技术需求
                            isAgree:0,	//是否同意签署（0 未同意 1 同意）
                            excellentContract: [{id:'',contractName:'',contractAmount:'',contractNumber:'', contractTurnover:'',}],//技术合同完成情况
                            excellentAchievement: [{id:'',achievementName:'', achievementDemand:'', achievementSupplier:'', achievementTurnover:''}],//促进成果交易情况
                            organization:'',//技术转移活动组织情况
                            caseSituation:'',//技术转移典型案例情况
                            // contractName:'',	//技术合同名称
                            // contractAmount:'',	//合同成交总金额
                            // contractNumber:'',	//合同中成交技术项数
                            // contractTurnover:'',	//合同中技术交易额
                            isSubmit:0,
                            // isSubmit:2,
                        },
                        delFlag:0,
                        sum:0,
                        isActive:false,
                        isClose:false,
                        rules: {
                            name: [
                                {required: true, message: '请输入姓名',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            idNumber: [
                                {required: true,
                                    validator: (rule, value, callback) => {
                                        if(!value){
                                            callback(new Error('请输入身份证号'));
                                        }
                                        else if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-8]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}[0-9xX]$/.test(value)) {
                                            callback(new Error('请填写正确的身份证号'));
                                        } else {
                                            callback();
                                        }
                                    },trigger: 'blur'},

                                // {pattern:/^[1-9]\d{5}(18|19|20)\d{2}(0[1-8]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}[0-9xX]$/ , message: '请填写正确的身份证号',trigger: 'blur'}

                            ],
                            age: [
                                {required: true, message: '请输入年龄',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            sex: [
                                {required: true, message: '请选择性别',trigger: 'change'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            rank: [
                                {required: true, message: '请选择',trigger: 'change'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            date: [
                                {type: 'string', required: true, message: '请选择企业注册时间',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            job: [
                                {required: true, message: '请输入职务', trigger: 'blur'},
                            ],
                            title: [
                                {required: true, message: '请输入职称', trigger: 'blur'},
                            ],
                            phone: [
                                {required: true,validator: (rule, value, callback) => {
                                                   if(!value){
                                                       callback(new Error('请输入电话号码'));
                                                   }
                                                    else if (!/^((0\d{2,3}\d{7,8})|(1\d{10}))$/.test(value)) {
                                                        callback(new Error('请填写正确的电话号码'));
                                                    } else {
                                                        callback();
                                                    }
                                                },trigger: 'blur'},
                                // {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码'}
                            ],
                            email: [
                                {required: true, validator: (rule, value, callback) => {
                                        if(!value){
                                            callback(new Error('请输入电子邮箱'));
                                        }
                                        else if (!/^[0-9a-zA-Z]+([\.\-_]*[0-9a-zA-Z]+)*@([0-9a-zA-Z]+[\-_]*[0-9a-zA-Z]+\.)+[0-9a-zA-Z]{2,6}$/.test(value)) {
                                            callback(new Error('请填写正确的电子邮箱'));
                                        } else {
                                            callback();
                                        }
                                    },trigger: 'blur'},
                                // {pattern: /^[0-9a-zA-Z]+([\.\-_]*[0-9a-zA-Z]+)*@([0-9a-zA-Z]+[\-_]*[0-9a-zA-Z]+\.)+[0-9a-zA-Z]{2,6}$/, message: '请填写正确的电子邮箱'}
                            ],
                            company: [
                                {required: true, message: '请输入单位',trigger: 'blur'},
                            ],
                            address: [
                                {required: true, message: '请输入通讯地址',trigger: 'blur'},
                            ],
                            registeredAmount: [
                                {required: true, message: '请输入技术合同登记金额',trigger: 'blur'},
                            ],
                            registeredNumber: [
                                {required: true, message: '请输入技术合同登记项数',trigger: 'blur'},
                            ],
                            transactionAmount: [
                                {required: true, message: '请输入技术交易额',trigger: 'blur'},
                            ],
                            economicPerformance: [
                                {required: true, message: '请输入产生的经济效益',trigger: 'blur'},
                            ],
                            promotingNumber: [
                                {required: true, message: '请输入成果交易数量',trigger: 'blur'},
                            ],
                            promotingAmount: [
                                {required: true, message: '请输入成果交易金额',trigger: 'blur'},
                            ],
                            active: [
                                {required: true, message: '请输入活动人次',trigger: 'blur'},
                            ],
                            demand: [
                                {required: true, message: '请输入企业技术需求',trigger: 'blur'},
                            ],
                            organization: [
                                {required: true, message: '请输入技术转移活动组织情况,没有则填写无',trigger: 'blur'},
                            ],
                            caseSituation: [
                                {required: true, message: '请输入技术转移典型案例情况,没有则填写无',trigger: 'blur'},
                            ],
                            // excellentContract: [
                            //     {required: true, validator: (rule, value, callback) => {
                            //             if (this.formData.excellentContract[0].contractName==""||this.formData.excellentContract[0].contractAmount=="") {
                            //                 console.log(this.formData.excellentContract[0].contractName,'+++')
                            //                 callback(new Error('请填写，没有则填写无'));
                            //             } else {
                            //                 callback();
                            //             }
                            //         } ,trigger:'blur'}
                            // ],
                            // excellentAchievement: [
                            //     {required: true, validator: (rule, value, callback) => {
                            //             if (this.formData.excellentAchievement[0].value =="") {
                            //                 callback(new Error('请填写，没有则填写无'));
                            //             } else {
                            //                 callback();
                            //             }
                            //         } ,trigger:'blur'}
                            // ],

                        },

                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'tag': httpVueLoader('/style/components/contract.vue'),
                    'tag1': httpVueLoader('/style/components/results.vue')
                },
                created() {
                    this.getData()

                },
                methods: {
                    //   验证身份证号码

                    getData() {
                        indexApi.selectBroker().then((res) => {
                            if(res.code !== 'rest.success'){
                                window.location.href = "/common/login.html?back=/applicationFrom.html";
                            }
                           if (res.code == 'rest.success' && res.result) {
                                this.formData = res.result
                                if (this.formData.isSubmit== 1) {
                                    this.delFlag=1
                                    this.isActive = true;
                                } else {
                                    this.isActive = false;
                                }
                            }
                        })
                    },
                    keep() {
                        // this.formData.isAgree = 0
                        indexApi.brokerSubmit(this.formData).then((res) => {
                            if (res.code == 'rest.success') {
                                this.$notify.success({
                                    title: '成功！',
                                    message: '保存成功!',
                                    duration: 2000
                                });
                                setTimeout(function () {
                                    window.location.href = "/applicationFrom.html";
                                }, 2000);
                            } else {
                                this.$notify.error({
                                    title: '提示！',
                                    message: '请先登录!'
                                });
                                setTimeout(function () {
                                    window.location.href = "/common/login.html?back=/applicationFrom.html";
                                }, 1000);
                            }
                        });
                    },
                    //提交表单
                    submit() {
                        // this.$alert('本次征集已结束', '提示', {
                        //     confirmButtonText: '确定',
                        //     callback: action => {
                        //         window.location.href=$pathPrefix+'/index.html'
                        //     }
                        // });
                        switch (this.formData.isAgree){
                            case 0:
                                this.$alert('请选择同意!', '提示', {
                                    type: 'warning',
                                    center: true
                                })
                                break;
                            default:
                                this.$confirm('此次提交后不可修改, 是否继续提交?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning',
                                    center: true
                                }).then(() => {
                                    // let flag = this.$refs.childRules.validateForm();
                                    // console.log(flag, 'flag')
                                    // this.$refs.form.validate((valid) => {
                                        this.$refs.form.validate((valid) => {
                                            this.sum = 1
                                            if (valid) {
                                                this.formData.isSubmit= 1
                                                indexApi.brokerSubmit(this.formData).then((res) => {
                                                    if (res.code == 'rest.success') {
                                                        this.$notify.success({
                                                            title: '成功！',
                                                            message: '报名表提交成功!',
                                                            duration: 2000
                                                        });
                                                        setTimeout(function () {
                                                            window.location.href = "/applicationFrom.html";
                                                        }, 2000);
                                                    } else {
                                                        this.$notify.error({
                                                            title: '提示！',
                                                            message: '请先登录!'
                                                        });
                                                        setTimeout(function () {
                                                            window.location.href = "/common/login.html?back=/applicationFrom.html";
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
                                    console.log("diandaolezheli")
                                    this.$message({
                                        type: 'info',
                                        message: '已取消提交'
                                    });
                                });
                        }
                  },
                    onRadioChange(e) {
                        e === this.formData.isAgree? (this.formData.isAgree=0):(this.formData.isAgree = e)
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


