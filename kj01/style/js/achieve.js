var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/style/js/api/activity.js', 'jqValidate', 'dialog', 'httpUrl', 'laydate', 'jqSelect', 'VueUeditor'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, jqValidate, dialog, httpUrl, laydate, jqSelect, VueUeditor) {
        Vue.config.devtools = true
        window.vueDom = new Vue({
            el: '#index_box',
            mixins: [userCenter],
            data: function () {
                return {
                    formData: {
                        noticeId: '1',
                        achievementName: '1',
                        companyName: '1',
                        districtAndCountry: '1',
                        applicationArea: '1',
                        comment: '1',
                        maturity: '1',
                        status: '1',
                        progressiveness: '1',
                        ownership: '1',
                        mode: '1',
                        intention: '1',
                        isExperience: '1',
                        isExhibition: '1'
                    },
                    options: [{
                        value: '选项1',
                        label: '渝中区'
                    }, {
                        value: '选项2',
                        label: '大渡口区'
                    }, {
                        value: '选项3',
                        label: '江北区'
                    }, {
                        value: '选项4',
                        label: '沙坪坝区'
                    }, {
                        value: '选项5',
                        label: '九龙坡区'
                    }, {
                        value: '选项5',
                        label: '南岸区'
                    }, {
                        value: '选项5',
                        label: '渝北区'
                    },{
                        value: '选项5',
                        label: '北碚区'
                    },{
                        value: '选项5',
                        label: '渝北区'
                    },{
                        value: '选项5',
                        label: '巴南区'
                    },{
                        value: '选项5',
                        label: '万州区'
                    },{
                        value: '选项5',
                        label: '涪陵区'
                    },{
                        value: '选项5',
                        label: '綦江区'
                    },{
                        value: '选项5',
                        label: '大足区'
                    },{
                        value: '选项5',
                        label: '巴南区'
                    },{
                        value: '选项5',
                        label: '黔江区'
                    },{
                        value: '选项5',
                        label: '长寿区'
                    },{
                        value: '选项5',
                        label: '江津区'
                    },{
                        value: '选项5',
                        label: '合川区'
                    },{
                        value: '选项5',
                        label: '永川区'
                    },{
                        value: '选项5',
                        label: '南川区'
                    },{
                        value: '选项5',
                        label: '璧山区'
                    },{
                        value: '选项5',
                        label: '铜梁区'
                    },{
                        value: '选项5',
                        label: '潼南区'
                    },{
                        value: '选项5',
                        label: '荣昌区'
                    },{
                        value: '选项5',
                        label: '两江新区'
                    },{
                        value: '选项5',
                        label: '高新区'
                    },{
                        value: '选项5',
                        label: '梁平区'
                    },{
                        value: '选项5',
                        label: '开州区'
                    },{
                        value: '选项5',
                        label: '城口县'
                    },{
                        value: '选项5',
                        label: '丰都县'
                    },{
                        value: '选项5',
                        label: '垫江县'
                    },{
                        value: '选项5',
                        label: '武隆'
                    },{
                        value: '选项5',
                        label: '忠县'
                    },{
                        value: '选项5',
                        label: '云阳'
                    },{
                        value: '选项5',
                        label: '奉节'
                    },{
                        value: '选项5',
                        label: '巫山'
                    },{
                        value: '选项5',
                        label: '石柱'
                    },{
                        value: '选项5',
                        label: '秀山'
                    },{
                        value: '选项5',
                        label: '酉阳'
                    },{
                        value: '选项5',
                        label: '彭水'
                    }
                    ],
                    value: ''
                }
            },
            methods: {
                submit() {
                    this.post('http://192.168.0.200:9769/tsAdmin/result/submit', this.formData).then((res) => {
                        if (res.code === 'rest.success') {

                        }
                    });
                }
            }
        });
    });
});


