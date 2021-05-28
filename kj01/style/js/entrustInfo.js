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
                            name: '',
                            region: '',
                            date1: '',
                            date2: '',
                            delivery: false,
                            type: [],
                            resource: '',
                            desc: '',
                            textarea: '',
                            value: [],
                            companyName: '',
                            type: '',
                            optionProps: {
                                value: 'id',
                                label: 'name',
                                children: 'child'
                            },
                            typeList: [
                                {
                                    value: 'broadcastRoom',
                                    label: '政策直播间',
                                    children: [{
                                        value: 'company',
                                        label: '高企培育',
                                    }, {
                                        value: 'technicalContract',
                                        label: '技术合同登记',
                                    }, {
                                        value: 'cost',
                                        label: '研发费用加计扣除',
                                    }, {
                                        value: 'change',
                                        label: '成果转化',
                                    }, {
                                        value: 'declaration',
                                        label: '项目申报',
                                    }
                                    ]
                                }, {
                                    value: 'train',
                                    label: '主题培训',
                                    children: [{
                                        value: 'broker',
                                        label: '技术经纪人',
                                    }, {
                                        value: 'ability',
                                        label: '创新能力培训',
                                    }, {
                                        value: 'business',
                                        label: '双创载体培训',
                                    }, {
                                        value: 'entrepreneur',
                                        label: '企业家培训',
                                    }, {
                                        value: 'intellectualProperty',
                                        label: '知识产权',
                                    }, {
                                        value: 'law',
                                        label: '法律财税',
                                    }
                                    ]
                                }, {
                                    value: 'communication',
                                    label: '对接会',
                                    children: [{
                                        value: 'scienceSupply',
                                        label: '技术供需对接',
                                    }, {
                                        value: 'invest',
                                        label: '投融资对接',
                                    }, {
                                        value: 'projectGround',
                                        label: '项目落地对接',
                                    }
                                    ]
                                }, {
                                    value: 'share',
                                    label: '创享会',
                                    children: [{
                                        value: 'salon',
                                        label: '技术沙龙',
                                    }, {
                                        value: 'forum',
                                        label: '产业论坛',
                                    }, {
                                        value: 'summit',
                                        label: '主题峰会',
                                    }, {
                                        value: 'contest',
                                        label: '双创大赛',
                                    }, {
                                        value: 'recommend',
                                        label: '项目推介',
                                    }
                                    ]
                                }
                            ]
                        },
                        rules: {
                            name: [
                                {required: true, message: '请输入活动名称', trigger: 'blur'},
                                {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                            ],
                            region: [
                                {required: true, message: '请选择活动区域', trigger: 'change'}
                            ],
                            date1: [
                                {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                            ],
                            date2: [
                                {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
                            ],
                            type: [
                                {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
                            ],
                            resource: [
                                {required: true, message: '请选择活动资源', trigger: 'change'}
                            ],
                            desc: [
                                {required: true, message: '请填写活动形式', trigger: 'blur'}
                            ]
                        },
                        components: {
                            'ly-toper': httpVueLoader('/style/components/toper.vue'),
                            // 'index-head': httpVueLoader('/style/components/index_head2.vue'),
                            'web-footer': httpVueLoader('/style/components/web_footer.vue')
                        },
                        methods: {
                            submitForm(formName) {
                                this.$refs[formName].validate((valid) => {
                                    if (valid) {
                                        alert('submit!');
                                    } else {
                                        console.log('error submit!!');
                                        return false;
                                    }
                                });
                            },
                            resetForm(formName) {
                                this.$refs[formName].resetFields();
                            },
                            handleChange(value) {
                                console.log(value);
                            }
                        }
                    }
                }
                }
            )
            ;
        });
});


