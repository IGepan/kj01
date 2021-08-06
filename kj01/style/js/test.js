require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl', '/style/js/api/index.js','ELEMENT'],
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
                        formData: {
                            companyName: '',//企业名称
                            address:'',//经营地址
                            date:'',//注册时间
                            contactName:'',//联系人姓名及职务
                            contactPhone:'',//联系电话
                            isJoinDepository: 1,//是否入科技型企业库
                            plan:1,//是否计划入科技型企业库
                            highTech:1,//是否是高新技术企业
                            declare:1,//是否计划申报高新技术企业
                            businessIncome:'',//营业收入
                            rdInvestment:'',//研发投入
                            employees:'',// 从业人员个数
                            rdPersonnel:'',//研发人员个数
                            //已有科技成果5-8
                            // achievement: {
                                leadingTechnologyList: [],//国际/国内领先技术
                                technologicalInnovationList: [],//行业领先或重大产业关键技术创新
                                intellectualPropertyList: [],//自主知识产权拥有量
                                inventionPatentList: [],//发明专利拥有量
                            // },
                            //已有科技资源9-13
                            // resources:{
                                rdPlatformList:[],// 市级以上科技研发平台
                                nationalInnovationPlatformList:[],// 国家级创新平台
                                technologicalInnovationPlatformList:[],//引进国际科技创新平台
                                leadingInnovationAllianceList:[],//主导成立的产业技术创新联盟
                                innovationAllianceList:[],//参加的产业技术创新联盟
                            // },
                            //计划建设的研发平台14-21
                            // platform:{
                                deviceList:[],//大科学装置
                                nationalLaboratoryList:[],//国家实验室
                                nationalKeyLaboratoryList:[],//国家重点实验室
                                nationalTechnologicalList:[],//国家技术创新中心
                                cqKeyLaboratoryList:[],//重庆市重点实验室
                                cqTechnologyTransferCenterList:[],// 重庆市技术转移中心
                                cqTechnologicalInnovationList:[],//重庆市技术创新中心
                                otherPlatformList:[],//其他（研发平台）
                            // },
                            //计划申报的研发项目22-27
                            // projects:{
                                kjbDevelopmentList:[],//科技部重大研发专项
                                rdProjectList:[],//重庆市科技型企业技术创新与应用发展专项
                                exploreList:[],//重庆市基础研究与前言探索专项
                                applicationDevelopmentList:[],//重庆市技术创新与应用发展专项
                                corePlanList:[],// 自主或主导参与的关键核心技术研发攻关计划
                                otherItemsList:[],// 其他（研发项目）
                            // },
                            cooperation:'',//合作形式
                            isSecrecy:1,//以上是否涉及保密项目
                            proposal:'',//企业发展中的问题、困难或对两江新区的建议
                            inputValue: '',//项目名称
                            delFlag: '0',
                            version: '0'
                        },
                        isActive:false,

                        rules: {
                            companyName: [
                                { required: true, message: '请输入企业名称', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            address: [
                                { required: true, message: '请输入经营地址', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            date: [
                                { type: 'string', required: true, message: '请选择企业注册时间', trigger: 'blur'},
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            contactName: [
                                { required: true, message: '请输入联系人姓名及职务', trigger: 'blur' },
                            ],
                            contactPhone: [
                                {required: true, message: '请填写联系电话', trigger: 'blur'},
                                {pattern:/^1[34578]\d{9}$/,message: '请填写正确的电话号码', trigger: 'blur'}
                            ],
                        businessIncome: [
                                { required: true, message: '请输入营业收入', trigger: 'blur' },
                            ],
                        rdInvestment: [
                                { required: true, message: '请输入研发投入', trigger: 'blur' },
                            ],
                        employees: [
                                { required: true, message: '请输入从业人员个数', trigger: 'blur' },
                            ],
                        rdPersonnel: [
                                { required: true, message: '请输入研发人员个数', trigger: 'blur' },
                            ],
                        leadingTechnologyList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.leadingTechnologyList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    },field:'formData.achievement.leadingTechnologyList',trigger: 'blur' }
                            ],
                        technologicalInnovationList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.technologicalInnovationList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    },trigger: 'blur'}
                            ],
                        intellectualPropertyList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.intellectualPropertyList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    },trigger: 'blur' }
                            ],
                        inventionPatentList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.inventionPatentList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    },trigger: 'blur' }
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            rdPlatformList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.rdPlatformList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    },trigger: 'blur' }
                            ],
                        nationalInnovationPlatformList: [
                            { required: true,validator:(rule, value, callback) => {
                                    if (this.formData.nationalInnovationPlatformList.length <= 0) {
                                        callback(new Error('请输入名称，没有则填写无'));
                                    }else {
                                        callback();
                                    }
                                },trigger: 'blur' }
                            ],
                        technologicalInnovationPlatformList: [
                            { required: true,validator:(rule, value, callback) => {
                                    if (this.formData.technologicalInnovationPlatformList.length <= 0) {
                                        callback(new Error('请输入名称，没有则填写无'));
                                    }else {
                                        callback();
                                    }
                                },trigger: 'blur' }
                            ],
                        leadingInnovationAllianceList: [
                                {required: true, validator:(rule, value, callback) => {
                                        if (this.formData.leadingInnovationAllianceList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        innovationAllianceList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.innovationAllianceList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        deviceList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.deviceList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        nationalLaboratoryList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.nationalLaboratoryList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        nationalKeyLaboratoryList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.nationalKeyLaboratoryList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        nationalTechnologicalList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.nationalTechnologicalList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },

                            ],
                        cqKeyLaboratoryList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.cqKeyLaboratoryList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },

                            ],
                        cqTechnologyTransferCenterList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.cqTechnologyTransferCenterList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },

                            ],
                        cqTechnologicalInnovationList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.cqTechnologicalInnovationList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },

                            ],
                        otherPlatformList: [
                        { required: true,validator:(rule, value, callback) => {
                                if (this.formData.otherPlatformList.length <= 0) {
                                    callback(new Error('请输入名称，没有则填写无'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                            kjbDevelopmentList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.kjbDevelopmentList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        rdProjectList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.rdProjectList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        exploreList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.exploreList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        applicationDevelopmentList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.applicationDevelopmentList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        corePlanList: [
                                { required: true, validator:(rule, value, callback) => {
                                        if (this.formData.corePlanList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                        otherItemsList: [
                                { required: true,validator:(rule, value, callback) => {
                                        if (this.formData.otherItemsList.length <= 0) {
                                            callback(new Error('请输入名称，没有则填写无'));
                                        }else {
                                            callback();
                                        }
                                    }, trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            proposal: [
                                { required: true, message: '请填写企业发展建议，没有则填写无', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            cooperation: [
                                { required: true, message: '请填写合作方式，没有则填写无', trigger: 'blur' }
                            ],
                        },

                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'tag':httpVueLoader('/style/components/tag.vue')
                },
                created() {
                    this.getData()
                },
                methods: {
                    getData(){
                        indexApi.selectQuestionnaire().then((res) => {
                            if (res.code == 'rest.success' && res.result) {
                                this.formData = res.result
                                this.isActive = true
                            }
                        })
                    },
                    //提交表单
                    submit() {
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
                                console.log(valid,'valid')
                                if (valid) {
                                    indexApi.submit(this.formData).then((res) => {
                                        if (res.code == 'rest.success') {
                                            this.$notify.success({
                                                title:'成功！',
                                                message: '问卷提交成功!',
                                                duration:2000
                                            });
                                            setTimeout(function(){
                                                window.location.href = "/test.html";
                                            },2000);
                                        } else {
                                            this.$dialog.showToast('系统错误');

                                        }
                                    });
                                }else {
                                    this.$notify.error({
                                        title:'提示！',
                                        message: '请先完善信息填写!'
                                    });
                                }
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消提交'
                            });
                        });

                    },
                    //重置表单
                    clearForm() {
                        for(let key in this.formData){
                            this.formData[key]=''
                            scrollTo(0, 0);
                        }
                        // this.$refs.from.resetFields();

                        // this.formData={}
                        this.formData.noticeId = '1';
                        this.formData.status='1';
                        this.formData.intention = '1';
                        this.formData.isExperience = '1';
                        this.formData.isExhibition = '1';
                    }
                }
            });
        });
});


