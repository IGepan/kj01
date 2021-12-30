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
                            organName: '',//	机构名称
                            date: '',//	成立日期
                            legalType:0,//	法人类型( 0 企业法人  1 事业法人 2 社团法人 3 法人内设机构 )
                            legalNum: '',//	法人代码
                            companyType:0,//	单位类型（0 科研机构 1 高等院校 2 交易机构 3 其他）
                            economicNature:0,//	经济性质
                            chargeName: '',//	负责人姓名
                            chargeJob: '',//	负责人职务
                            chargePhone: '',//负责人电话
                            connectName: '',//	联系人姓名
                            connectJob: '',//	联系人职务
                            connectPhone: '',//	联系人电话
                            address: '',//	通讯地址
                            qq: '',//	QQ
                            mainBusiness:[],//	主营业务
                            other:'',//	其他主营业务
                            officeSpace: '',//	办公面积
                            isWeb:0,//	是否独立网站（0是 1否）
                            isDatabase:0,//	是否有数据库系统（0是 1否）
                            totalPerson: '',//	总人数
                            masterNum: '',//	硕士及以上人数
                            bachelorNum: '',//	本科人数
                            associateNum: '',//	专科人数
                            seniorTitleNum: '',//	高级职称人数
                            intermediateTitleNum: '',//	中级职称人数
                            brokerNum: '',//	技术经理人数量
                            professionalNum: '',//	专职人员数量
                            assProportion: '',//	大专以上比例
                            brokerProportion: '',//	技术经理人比例
                            registeredAmount: '',//	促进技术合同登记金额
                            registeredNum: '',//	促进技术合同登记项数
                            transactionAmount: '',//	技术交易额
                            economicPerformance: '',//	经济效益
                            promotingNum: '',//	促进成果交易数量
                            promotingAmount: '',//	促进成果交易金额
                            active: '',//	组织技术培训、推广和产学研等活动
                            demand: '',//	征集企业技术需求
                            businessIncome: '',//	营业收入
                            workingExpenses: '',//	工作经费
                            techIncom: '',//	技术转移及其服务收入
                            techIncomeProportion: '',//	技术转移及其服务收入增长率
                            nationalFinance: '',//	国家财政
                            localFinance: '',//	地方财政
                            selfFinance: '',//	单位自筹
                            otherIncome: '',//	其他收入
                            isAgree:0,//是否同意签署（0 未同意 1 同意）
                            caseSituation: '',//	案例情况
                            organization: '',//	组织情况
                            excellentContract: [{id:'',contractName:'',contractAmount:'',contractNumber:'', contractTurnover:'',}],//技术合同完成情况
                            excellentAchievement: [{id:'',achievementName:'', achievementDemand:'', achievementSupplier:'', achievementTurnover:''}],//促进成果交易情况
                            excellentOrganBroker: [{id:'',name:'', idNumber:'', certificateNo:'', certificateOrgan:'',}],//专业技术人才队伍建设情况
                            // delFlag: '0',
                            // version: '0',
                            // isSubmit:2,
                        },
                        sum:0,
                        delFlag: 0,
                        isActive:false,
                        isClose:false,
                        rules: {
                            organName: [
                                {required: true, message: '请输入机构名称',trigger: 'blur'},
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


                            ],
                            legalType: [
                                {required: true, message: '请选择法人类型',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            companyType: [
                                {required: true, message: '请选择单位类型',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            economicNature: [
                                {required: true, message: '请选择经济性质',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            date: [
                                {type: 'string', required: true, message: '请选择成立日期',trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            legalNum: [
                                {required: true, message: '请输入法人代码', trigger: 'blur'},
                            ],
                            chargeName: [
                                {required: true, message: '请输入负责人姓名', trigger: 'blur'},
                            ],
                            chargeJob: [
                                {required: true, message: '请输入负责人职务', trigger: 'blur'},
                            ],
                            phone: [
                                {required: true, validator: (rule, value, callback) => {
                                        if(!value){
                                            callback(new Error('请输入负责人电话'));
                                        }
                                        else if (!/^((0\d{2,3}\d{7,8})|(1\d{10}))$/.test(value)) {
                                            callback(new Error('请填写正确的电话'));
                                        } else {
                                            callback();
                                        }
                                    },trigger: 'blur'},
                                // {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码'}
                            ],
                            connectName: [
                                {required: true, message: '请输入联系人姓名', trigger: 'blur'},
                            ],
                            connectJob: [
                                {required: true, message: '请输入联系人职务', trigger: 'blur'},
                            ],
                            connectPhone: [
                                {required: true, validator: (rule, value, callback) => {
                                        if(!value){
                                            callback(new Error('请填写联系人手机'));
                                        }
                                        else if (!/^((0\d{2,3}\d{7,8})|(1\d{10}))$/.test(value)) {
                                            callback(new Error('请填写正确的手机'));
                                        } else {
                                            callback();
                                        }
                                    },trigger: 'blur'},
                                // {pattern: /^((0\d{2,3}\d{7,8})|(1\d{10}))$/, message: '请填写正确的电话号码'}
                            ],

                            // qq: [
                            //     {required: true, validator: (rule, value, callback) => {
                            //             if(!value){
                            //                 callback(new Error('请输入QQ号'));
                            //             }
                            //             else if (!/[1-9][0-9]{4,12}/.test(value)) {
                            //                 callback(new Error('请填写正确的QQ号'));
                            //             } else {
                            //                 callback();
                            //             }
                            //         },trigger: 'blur'},
                            //     // {pattern:  /[1-9][0-9]{4,12}/, message: '请填写正确的QQ号'}
                            // ],
                            address: [
                                {required: true, message: '请输入通讯地址',trigger: 'blur'},
                            ],
                            mainBusiness: [
                                {type: 'array',required: true, message: '请至少选择一个主营业务',trigger: 'change'},
                            ],
                            officeSpace: [
                                {required: true, message: '请输入办公面积',trigger: 'blur'},
                            ],
                            isWeb: [
                                {required: true, message: '是否独立网站',trigger: 'blur'},
                            ],
                            isAgree: [
                                {required: true, validator: (rule, value, callback) => {
                                        if (this.isAgree!==1) {
                                            callback(new Error('请选择同意后才能提交报名'));
                                        } else {
                                            callback();
                                        }
                                    } ,trigger: 'change'},
                            ],
                            isDatabase: [
                                {required: true, message: '是否有数据库系统',trigger: 'blur'},
                            ],
                            totalPerson: [
                                {required: true, message: '请输入总人数',trigger: 'blur'},
                            ],
                            masterNum: [
                                {required: true, message: '请输入硕士及以上人数',trigger: 'blur'},
                            ],
                            bachelorNum: [
                                {required: true, message: '请输入本科人数',trigger: 'blur'},
                            ],
                            associateNum: [
                                {required: true, message: '请输入专科人数',trigger: 'blur'},
                            ],
                            seniorTitleNum: [
                                {required: true, message: '请输入高级职称人数',trigger: 'blur'},
                            ],
                            intermediateTitleNum: [
                                {required: true, message: '请输入中级职称人数',trigger: 'blur'},
                            ],
                            brokerNum: [
                                {required: true, message: '请输入技术经纪（理）人数',trigger: 'blur'},
                            ],
                            professionalNum: [
                                {required: true, message: '请输入专职人员数量',trigger: 'blur'},
                            ],
                            assProportion: [
                                {required: true, message: '请输入比例',trigger: 'blur'},
                            ],
                            brokerProportion: [
                                {required: true, message: '请输入比例',trigger: 'blur'},
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
                            businessIncome: [
                                {required: true, message: '请输入营业收入',trigger: 'blur'},
                            ],
                            workingExpenses: [
                                {required: true, message: '请输入工作经费',trigger: 'blur'},
                            ],
                            techIncom: [
                                {required: true, message: '请输入技术转移及其服务收入',trigger: 'blur'},
                            ],
                            techIncomeProportion: [
                                {required: true, message: '请输入技术转移及其服务收入增长率',trigger: 'blur'},
                            ],
                            nationalFinance: [
                                {required: true, message: '请输入国家财政',trigger: 'blur'},
                            ],
                            localFinance: [
                                {required: true, message: '请输入地方财政',trigger: 'blur'},
                            ],
                            selfFinance: [
                                {required: true, message: '请输入单位自筹',trigger: 'blur'},
                            ],
                            otherIncome: [
                                {required: true, message: '请输入其他收入',trigger: 'blur'},
                            ],
                            organization: [
                                {required: true, message: '请输入技术转移活动组织情况,没有则填写无',trigger: 'blur'},
                            ],
                            caseSituation: [
                                {required: true, message: '请输入技术转移典型案例情况,没有则填写无',trigger: 'blur'},
                            ],
                            // excellentContract: [
                            //     {required: true, validator: (rule, value, callback) => {
                            //             if (this.formData.excellentContract[0].contractName =="") {
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
                    'tag1': httpVueLoader('/style/components/results.vue'),
                    'tag2': httpVueLoader('/style/components/team.vue'),
                },
                watch:{
                    // valid:{
                    //     immediate:true,
                    //     handler(val){
                    //         this.flag = val
                    //         console.log(val,'val')
                    //     }
                    // }
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
                        indexApi.selectOrgan().then((res) => {
                            if(res.code !== 'rest.success'){
                                window.location.href = "/common/login.html?back=/organizationFrom.html";
                            }
                            if (res.code == 'rest.success' && res.result) {
                                this.formData = res.result
                                if (this.formData.isAgree ==1) {
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
                        indexApi.organSubmit(this.formData).then((res) => {
                            if (res.code == 'rest.success') {
                                this.$notify.success({
                                    title: '成功！',
                                    message: '保存成功!',
                                    duration: 2000
                                });
                                setTimeout(function () {
                                    window.location.href = "/organizationFrom.html";
                                }, 2000);
                            } else {
                                this.$notify.error({
                                    title: '提示！',
                                    message: '请先登录!'
                                });
                                setTimeout(function () {
                                    window.location.href = "/common/login.html?back=/organizationFrom.html";
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
                                           this.$refs.form.validate((valid) => {
                                               this.sum = 1
                                               console.log(valid, 'valid')
                                               if (valid) {
                                                   indexApi.organSubmit(this.formData).then((res) => {
                                                       if (res.code == 'rest.success') {
                                                           this.$notify.success({
                                                               title: '成功！',
                                                               message: '报名表提交成功!',
                                                               duration: 2000
                                                           });
                                                           setTimeout(function () {
                                                               window.location.href = "/organizationFrom.html";
                                                           }, 2000);
                                                       } else {
                                                           this.$notify.error({
                                                               title: '提示！',
                                                               message: '请先登录!'
                                                           });
                                                           setTimeout(function () {
                                                               window.location.href = "/common/login.html?back=/organizationFrom.html";
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


