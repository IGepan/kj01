require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpVueLoader', 'httpUrl','/style/js/api/index.js'],
        function ($, Vue, httpVueLoader, httpUrl,indexApi) {
            new Vue({
                el: '#index_box',
                data: {
                    sIndex: 7,
                    newsList:[],
                    detailActive:0,
                    details:'',
                    id:'',
                    queryForm:{
                        pageNum:1,
                        pageSize:10,
                        total:0,
                    },
                    pages:0,
                    tabsParam:['工作状态','媒体关注'],//（这个也可以用对象key，value来实现）
                    nowIndex:0,//默认第一个tab为激活状态
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
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
                    this.detailActive = this.$utils.getReqStr('detailActive')?parseInt(this.$utils.getReqStr('detailActive')):0;
                    this.id = parseInt(this.$utils.getReqStr('id'));
                    if(this.id){
                        this.goDetail(this.id)
                    }
                    this.getcmsList()
                },
                methods: {
                    goBack(){
                        location.href='/platform.html'
                    },
                    getcmsList: function () {
                        var vm = this;
                        indexApi.contentListByPage({
                            pageNum:this.queryForm.pageNum,
                            pageSize:this.queryForm.pageSize,
                            type:1,
                            // nowIndex:this.nowIndex
                        }).then(function (res) {
                            vm.$data.newsList = res.result.list;
                            vm.$data.queryForm.total=res.result.total;
                            vm.$data.pages=res.result.pages;
                        })
                    },
                    goDetail(id){
                        var vm = this;
                        indexApi.contentDetail({
                            id:id
                        }).then(function (res) {
                            vm.$data.detailActive=1;
                            vm.$data.details=res.result
                        })
                    },
                    pageClick: function (index) {
                        if (index > 0 && index <= this.pages) {
                            this.queryForm.pageNum = index;
                            this.getcmsList();
                        }
                    },
                    isShowPage: function (index) {
                        var pageNum = this.queryForm.pageNum;
                        var row = parseInt(pageNum / 2);
                        if (row == 0 || row == 1) {
                            if (1 <= index && index <= 4) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if (row * 2 - 1 <= index && index <= row * 2 + 2) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    isMore: function () {
                        var pageNum = this.queryForm.pageNum;
                        var row = parseInt(pageNum / 2);
                        var index = row * 2 - 1;
                        return !(index + 4 > this.pages);
                    },
                    toggleTabs:function(index){
                        this.nowIndex=index;
                    },
                }
            })
        })
})
