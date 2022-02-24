require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl','/style/js/api/activity.js'],
        function ($, Vue, httpVueLoader, httpUrl,indexApi) {
            new Vue({
                el: '#index_box',
                data: {
                    // sIndex: 8,
                    sIndex: 6,
                    newsList:[],
                    detailActive:0,
                    details:'',
                    id:'',
                    queryForm:{
                        pageNum:1,
                        pageSize:10,
                        total:0,
                    },
                    breadcrumb: [
                        // {
                        //   url: '/aindex.html',
                        //   label: '活动'
                        // },
                        // {
                        //   url: '/atList.html',
                        //   label: '品牌活动列表'
                        // },
                        {
                            url: '/alist.html',
                            label: '活动列表'
                        },
                        {
                            label: '详情'
                        }
                    ],
                    pages:0,
                    nowIndex:1,//默认第一个tab为激活状态
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/newtoper.vue'),
                    // 'index-head': httpVueLoader('/style/components/index_head2.vue'),
                    'sub-head': httpVueLoader('/style/components/asub_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },
                filters: {
                    formatTime: function (v) {
                        if (v) {
                            v = v.split(' ')[0]
                            v = v.replace(/-/g,'.')
                            return v
                        } else {
                            return ''
                        }
                    }
                },
                mounted(){
                    // this.detailActive = this.$utils.getReqStr('detailActive')?parseInt(this.$utils.getReqStr('detailActive')):0;
                    this.id = this.$utils.getReqStr('id');
                    if(this.id) {
                        this.goDetail(this.id)
                    }
                    // var nowIndex = this.$utils.getReqStr('nowIndex')
                    // if(nowIndex) this.nowIndex = parseInt(nowIndex);
                    // this.getcmsList()
                },
                methods: {
                    goDetail(id){
                        var vm = this;
                        indexApi.getInfrom({
                            activityId:id
                        }).then(function (res) {
                            vm.$data.detailActive=1;
                            vm.$data.details=res.result
                        })
                    },
                }
            })
        })
})