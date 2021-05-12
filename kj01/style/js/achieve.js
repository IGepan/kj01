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
                            noticeId: '1',
                            achievementName: '',
                            companyName: '',
                            contact:'',
                            districtAndCountry: '',
                            applicationArea: '',
                            comment: '',
                            maturity: '',
                            status: '1',
                            progressiveness: '',
                            ownership: '',
                            mode: '',
                            intention: '1',
                            isExperience: '1',
                            isExhibition: '1'
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
                        modeList: [{
                            value: '技术许可',
                            label: '技术许可'
                        },{
                            value: '技术咨询',
                            label: '技术咨询'
                        },{
                            value: '技术服务',
                            label: '技术服务'
                        },{
                            value: '产品推广',
                            label: '产品推广'
                        }],
                        progressivenessList: [{
                            value: '国内领先',
                            label: '国内领先'
                        },{
                            value: '国际领先',
                            label: '国际领先'
                        },{
                            value: '其他',
                            label: '其他'
                        },],
                        statusList: [{
                            value: '未申请',
                            label: '未申请'
                        },{
                            value: '审查中',
                            label: '审查中'
                        },{
                            value: '已获得',
                            label: '已获得'
                        }],
                        maturityList: [{
                            value: '研发',
                            label: '研发'
                        },{
                            value: '试制',
                            label: '试制'
                        },{
                            value: '小批量生产',
                            label: '小批量生产'
                        },{
                            value: '批量生产',
                            label: '批量生产'
                        },
                        ],
                        districtAndCountryList: [{
                            value: '渝中区',
                            label: '渝中区'
                        }, {
                            value: '大渡口区',
                            label: '大渡口区'
                        }, {
                            value: '江北区',
                            label: '江北区'
                        }, {
                            value: '沙坪坝区',
                            label: '沙坪坝区'
                        }, {
                            value: '九龙坡区',
                            label: '九龙坡区'
                        }, {
                            value: '南岸区',
                            label: '南岸区'
                        }, {
                            value: '渝北区',
                            label: '渝北区'
                        }, {
                            value: '北碚区',
                            label: '北碚区'
                        }, {
                            value: '巴南区',
                            label: '巴南区'
                        }, {
                            value: '万州区',
                            label: '万州区'
                        }, {
                            value: '涪陵区',
                            label: '涪陵区'
                        }, {
                            value: '綦江区',
                            label: '綦江区'
                        }, {
                            value: '大足区',
                            label: '大足区'
                        }, {
                            value: '黔江区',
                            label: '黔江区'
                        }, {
                            value: '长寿区',
                            label: '长寿区'
                        }, {
                            value: '江津区',
                            label: '江津区'
                        }, {
                            value: '合川区',
                            label: '合川区'
                        }, {
                            value: '永川区',
                            label: '永川区'
                        }, {
                            value: '南川区',
                            label: '南川区'
                        }, {
                            value: '璧山区',
                            label: '璧山区'
                        }, {
                            value: '铜梁区',
                            label: '铜梁区'
                        }, {
                            value: '潼南区',
                            label: '潼南区'
                        }, {
                            value: '荣昌区',
                            label: '荣昌区'
                        }, {
                            value: '两江新区',
                            label: '两江新区'
                        }, {
                            value: '高新区',
                            label: '高新区'
                        }, {
                            value: '梁平区',
                            label: '梁平区'
                        }, {
                            value: '开州区',
                            label: '开州区'
                        }, {
                            value: '城口县',
                            label: '城口县'
                        }, {
                            value: '丰都县',
                            label: '丰都县'
                        }, {
                            value: '垫江县',
                            label: '垫江县'
                        }, {
                            value: '武隆',
                            label: '武隆'
                        }, {
                            value: '忠县',
                            label: '忠县'
                        }, {
                            value: '云阳',
                            label: '云阳'
                        }, {
                            value: '奉节',
                            label: '奉节'
                        }, {
                            value: '巫山',
                            label: '巫山'
                        }, {
                            value: '石柱',
                            label: '石柱'
                        }, {
                            value: '秀山',
                            label: '秀山'
                        }, {
                            value: '酉阳',
                            label: '酉阳'
                        }, {
                            value: '彭水',
                            label: '彭水'
                        }],
                        applicationAreaLIst: [
                            {
                                value: '高端装备',
                                label: '高端装备'
                            },{
                                value: '汽车',
                                label: '汽车'
                            },{
                                value: '生物医药',
                                label: '生物医药'
                            },{
                                value: '物联网',
                                label: '物联网'
                            },{
                                value: '新材料',
                                label: '新材料',
                            },{
                                value: '人工智能',
                                label: '人工智能'
                            },{
                                value: '新能源',
                                label: '新能源'
                            },{
                                value: '现代农业',
                                label: '现代农业'
                            },{
                                value: '电子信息',
                                label: '电子信息'
                            },{
                                value: '大数据',
                                label: '大数据'
                            },{
                                value: '半导体',
                                label: '半导体'
                            },{
                                value: '节能环保',
                                label: '节能环保'
                            },{
                                value: '新一代通信',
                                label: '新一代通信'
                            },{
                                value: '其他',
                                label: '其他'
                            }
                        ]
                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },
                methods: {
                    //提交表单

                    submit() {
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
                        // this.formData.noticeId = '1';
                        // this.formData.intention = '1';
                        // this.formData.isExperience = '1';
                        // this.formData.isExhibition = '1';
                    }
                }
            });
        });
});


