require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl', '/style/js/api/index.js','ELEMENT'],
        function ($, Vue, httpVueLoader, httpUrl, indexApi,ELEMENT) {
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
                            contact:'',//联系人姓名及职务
                            phone:'',//联系电话
                            warehousing:'1',//是否入科技型企业库
                            plan:'1',//是否计划入科技型企业库
                            hightech:'1',//是否是高新技术企业
                            declare:'1',//是否计划申报高新技术企业
                            //经营情况1-4
                            Operation1:'',
                            Operation1List:[],//关键字数组
                            Operation2:'',
                            Operation2List:[],//关键字数组
                            Operation3:'',
                            Operation3List:[],//关键字数组
                            Operation4:'',
                            Operation4List:[],//关键字数组
                            //已有科技成果5-8
                            achievement5:'',
                            achievement5List:[],
                            achievement6:'',
                            achievement6List:[],
                            achievement7:'',
                            achievement7List:[],
                            achievement8:'',
                            achievement8List:[],
                            //已有科技资源9-13
                            resources9:'',
                            resources9List:[],
                            resources10:'',
                            resources10List:[],
                            resources11:'',
                            resources11List:[],
                            resources12:'',
                            resources12List:[],
                            resources13:'',
                            resources13List:[],
                            //计划建设的研发平台14-21
                            platform14:'',
                            platform14List:[],
                            platform15:'',
                            platform15List:[],
                            platform16:'',
                            platform16List:[],
                            platform17:'',
                            platform17List:[],
                            platform18:'',
                            platform18List:[],
                            platform19:'',
                            platform19List:[],
                            platform20:'',
                            platform20List:[],
                            platform21:'',
                            platform21List:[],
                            //计划申报的研发项目22-27
                            projects22:'',
                            projects22List:[],
                            projects23:'',
                            projects23List:[],
                            projects24:'',
                            projects24List:[],
                            projects25:'',
                            projects25List:[],
                            projects26:'',
                            projects26List:[],
                            projects27:'',
                            projects27List:[],
                            cooperation:'',//合作形式
                            secrecy:'1',//以上是否涉及保密项目
                            idea:'',//企业发展中的问题、困难或对两江新区的建议
                            inputValue: '',
                            dynamicTags: ['标签一标签标签标签标签', '标签二标签标签标签', '标签三']//关键字数组
                        },

                        rules: {
                            achievementName: [
                                { required: true, message: '请输入成果名称', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            companyName: [
                                { required: true, message: '请输入单位名称', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            contact: [
                                { required: true, message: '请输入负责人姓名', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            districtAndCountry: [
                                { required: true, message: '请选择所在区县', trigger: 'blur' }
                            ],
                            applicationArea: [
                                { required: true, message: '请选择应用领域', trigger: 'blur' }
                            ],
                            comment: [
                                { required: true, message: '请输入成果简介', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            maturity: [
                                { required: true, message: '请选择成熟度', trigger: 'blur' }
                            ],
                            status: [
                                { required: true, message: '请选择专利状态', trigger: 'blur' }
                            ],
                            progressiveness: [
                                { required: true, message: '请选择先进性', trigger: 'blur' }
                            ],
                            ownership: [
                                { required: true, message: '请输入成果权属', trigger: 'blur' },
                                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],
                            mode: [
                                { required: true, message: '请选择合作方式', trigger: 'blur' }
                            ],
                        },

                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },
                methods: {

                    handleClose(tag) {
                        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                    },

                    showInput() {
                        // this.inputVisible = true;
                        this.$nextTick(_ => {
                            this.$refs.save.focus();
                            console.log(this.$refs.save.focus())
                        });
                    },

                    handleInputConfirm() {
                        let inputValue = this.formData.inputValue;
                        if (inputValue) {
                            this.dynamicTags.push(inputValue);
                        }
                        // this.inputVisible = false;
                        this.inputValue = '';
                    },
                    //提交表单
                    submit() {
                        // this.$alert('本次征集已结束', '提示', {
                        //     confirmButtonText: '确定',
                        //     callback: action => {
                        //         window.location.href=$pathPrefix+'/index.html'
                        //     }
                        // });
                        console.log(this.$refs)
                        window.test = this.$refs.form
                        this.$refs.form.validate((valid) => {
                            console.log(valid,'valid')
                            if (valid) {
                                indexApi.submit(this.formData).then((res) => {
                                    if (res.code == 'rest.success') {
                                        this.$message.success('提交成功');
                                        this.clearForm();
                                        scrollTo(0, 0);
                                    } else {
                                        this.$dialog.showToast('系统错误');

                                    }
                                });
                            }else {
                                this.$message.success('请完善信息');
                            }
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


