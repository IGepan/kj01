require(['/common/js/require.config.js'], function () {
    require(['jquery','vue', 'httpVueLoader', 'httpUrl', '/style/js/api/index.js','ELEMENT'],
        function ($, Vue, httpVueLoader, httpUrl, indexApi,ELEMENT) {
            new Vue({
                el: '#index_box',
                data: function () {
                    return {
                        formData: {
                            noticeId: '1',
                            achievementName: '',
                            companyName: '',
                            activityName:'',
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
                        achievementList:[]

                    }
                },
                components: {
                    // 'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    // 'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    // 'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },

                methods: {
                    //获取全部列表数据
                    getAllList: function (id) {
                        var vm = this;
                        indexApi.selectReleaseByPage({ noticeId: 1,}).then(function (res) {
                            // vm.activiyList = vm.activiyList.concat(res.result.list || [])
                            vm.achievementList = res.result || []
                        })
                    },
                },
                mounted:function (){
                     this.getAllList();
                },
            });
        });
});


