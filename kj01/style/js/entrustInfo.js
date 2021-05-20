require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl', '/style/js/api/index.js', 'ELEMENT'],
        function ($, Vue, httpVueLoader, httpUrl, indexApi, ELEMENT) {
            Vue.component('vue-ueditor-wrap', VueUeditorWrap)
            new Vue({
                    el: '#index_box',
                    data: {
                        value: [],
                        options: [
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
                    methods: {
                        handleChange(value) {
                            console.log(value);
                        }
                    }
                }
            )
            ;
        });
});


