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
                        ruleForm: {
                            name: '',               //活动名称

                            date1: '',              //活动开始日期
                            date2: '',              //活动开始时间

                            date3: '',              //活动结束日期
                            date4: '',              //活动结束时间

                            type: '1',
                            value:'',
                            resource: '1',
                            comment:'',
                            desc: '',
                            phone: ''
                            /*optionProps:'',*/
                            /*delivery: false,*/
                            /*type: [],*/
                            /*companyName: '',*/
                            /*textarea: '',*/
                            /*region: '',*/
                        },
                        rules: {
                            name: [
                                {required: true, message: '请填写活动名称', trigger: 'blur'},
                                // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                            ],
                            value: [
                                {required: true, message: '请选择活动类型', trigger: 'change'}
                            ],
                            date1: [
                                {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
                            ],
                            date2: [
                                {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
                            ],
                            date3: [
                                {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
                            ],
                            date4: [
                                {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
                            ],
                            type: [
                                {required: true, message: '请至少选择一个活动性质', trigger: 'change'}
                            ],
                            resource: [
                                {required: true, message: '请选择活动资源', trigger: 'change'}
                            ],
                            comment: [
                                { required: true, message: '请填写活动简介', trigger: 'change' },
                            ],
                            desc: [
                                {required: true, message: '请填写单位名称', trigger: 'blur'}
                            ],
                            phone: [
                                {required: true, message: '请填写联系电话', trigger: 'blur'},
                                {pattern:/^1[34578]\d{9}$/,message: '请填写正确的电话号码', trigger: 'blur'}
                            ],
                        },
                        typeList: [
                            {
                                value: '政策直播间',
                                label: '政策直播间',
                                children: [{value: '高企培育', label: '高企培育',},
                                    {value: '技术合同登记', label: '技术合同登记',},
                                    {value: '研发费用加计扣除', label: '研发费用加计扣除',},
                                    {value: '成果转化', label: '成果转化',},
                                    {value: '项目申报', label: '项目申报',}]
                            },
                            {
                                value: '主题培训', label: '主题培训',
                                children: [{value: '技术经纪人', label: '技术经纪人',},
                                    {value: '创新能力培训', label: '创新能力培训',},
                                    {value: '双创载体培训', label: '双创载体培训',},
                                    {value: '企业家培训', label: '企业家培训',},
                                    {value: '知识产权', label: '知识产权',},
                                    {value: '法律财税', label: '法律财税',}]
                            }, {

                                value: '对接会', label: '对接会',
                                children: [{value: '技术供需对接', label: '技术供需对接',},
                                    {value: '投融资对接', label: '投融资对接',},
                                    {value: '项目落地对接', label: '项目落地对接',}]
                            }, {
                                value: '创享会', label: '创享会',
                                children: [{value: '技术沙龙', label: '技术沙龙',},
                                    {value: '产业论坛', label: '产业论坛',},
                                    {value: '主题峰会', label: '主题峰会',},
                                    {value: '双创大赛', label: '双创大赛',},
                                    {value: '项目推介', label: '项目推介',}]
                            }
                        ]
                        /*[
                            {
                                value: 'broadcastRoom',
                                label: '政策直播间',
                                children: [{value: 'company', label: '高企培育',},
                                    {value: 'technicalContract', label: '技术合同登记',},
                                    {value: 'cost', label: '研发费用加计扣除',},
                                    {value: 'change', label: '成果转化',},
                                    {value: 'declaration', label: '项目申报',}]
                            },
                            {
                                value: 'train', label: '主题培训',
                                children: [{value: 'broker', label: '技术经纪人',},
                                    {value: 'ability', label: '创新能力培训',},
                                    {value: 'business', label: '双创载体培训',},
                                    {value: 'entrepreneur', label: '企业家培训',},
                                    {value: 'intellectualProperty', label: '知识产权',},
                                    {value: 'law', label: '法律财税',}]
                            }, {

                                value: 'communication', label: '对接会',
                                children: [{value: 'scienceSupply', label: '技术供需对接',},
                                    {value: 'invest', label: '投融资对接',},
                                    {value: 'projectGround', label: '项目落地对接',}]
                            }, {
                                value: 'share', label: '创享会',
                                children: [{value: 'salon', label: '技术沙龙',},
                                    {value: 'forum', label: '产业论坛',},
                                    {value: 'summit', label: '主题峰会',},
                                    {value: 'contest', label: '双创大赛',},
                                    {value: 'recommend', label: '项目推介',}]
                            }
                        ]*/
                    }
                },
                        components: {
                            'ly-toper': httpVueLoader('/style/components/toper.vue'),
                            // 'index-head': httpVueLoader('/style/components/index_head2.vue'),
                            'web-footer': httpVueLoader('/style/components/web_footer.vue')
                        },
                        methods: {
                            submitForm() {
                                console.log(this.$refs)
                                window.test = this.$refs.ruleForm
                                this.$refs.ruleForm.validate((valid) => {
                                    console.log(valid,'valid')
                                    if (valid) {
                                        indexApi.submit1(this.ruleForm).then((res) => {
                                            if (res.code == 'rest.success') {
                                                this.$message.success('提交成功');
                                                // this.clearForm();
                                                // scrollTo(0, 0);
                                                /*window.location.href = '/aindex.html'*/
                                                window.history.go(-1)
                                            } else {
                                                this.$dialog.showToast('系统错误');
                                            }
                                        });
                                    }else {
                                        this.$message.success('请完善活动信息');
                                    }
                                });
                            },
                            resetForm(ruleForm) {
                                this.$refs[ruleForm].resetFields();
                            },
                            handleChange(val) {
                                console.log(val);
                                this.ruleForm.value=val
                            }
                        }

                }
            )
            ;
        });
});


