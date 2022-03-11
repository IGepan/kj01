require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', 'httpUrl','/style/js/api/index.js'],
    function ($, Vue, httpVueLoader, httpUrl,indexApi) {
      new Vue({
        el: '#index_box',
        data: {
          navList: [
            {
              label: '平台简介',
              active: 1
            },
            //平台动态-暂时隐藏
           /* {
              label: '平台动态',
              active: 0
            },*/
            {
              label: '服务内容',
              active: 0
            },
            {
              label: '联系我们',
              active: 0
            }
          ],
          nowIndex: 0,
          sIndex: 7,
          // sIndex: 9,
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
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/newtoper.vue'),
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
          this.nowIndex = this.$utils.getReqStr('activeIndex')?parseInt(this.$utils.getReqStr('activeIndex')):0;
          this.detailActive = this.$utils.getReqStr('detailActive')?parseInt(this.$utils.getReqStr('detailActive')):0;
          this.id = parseInt(this.$utils.getReqStr('id'));
          if(this.id){
            this.goDetail(this.id)
          }
          if(this.nowIndex){
            this.getcmsList()
          }
        },
        methods: {
          handleNav(i) {
            this.navList.forEach(function (item, ti) {
				item.active = ti === i
            });
            this.nowIndex = i;
            if(i===1){
              this.getcmsList()
              this.detailActive=0
            }
          },
          getcmsList: function () {
            var vm = this;
            indexApi.contentListByPage({
              format: 1,
              channelIds: 128,
              orderBy: 4,
              pageNum:this.queryForm.pageNum,
              pageSize:this.queryForm.pageSize,
            }).then(function (res) {
              vm.$data.newsList = res.body;
              vm.$data.queryForm.total=res.totalCount;
              let pages=parseInt((res.totalCount/10));
              if(res.totalCount%10!==0){
                vm.$data.pages=pages+1
              }
            })
          },
          goDetail(id){
            var vm = this;
            indexApi.contentDetail({
              format: 0,
              id:id
            }).then(function (res) {
              vm.$data.detailActive=1;
              vm.$data.details=res.body
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
        }
      })
    })
})
