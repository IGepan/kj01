require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', 'httpUrl','/style/js/api/index.js'],
    function ($, Vue, httpVueLoader, httpUrl,indexApi) {
      new Vue({
        el: '#index_box',
        data: {
            detail:{}
        },
          create(){

          },
        mounted(){
            // var id=this.$utils.getReqStr('id');
            var aUrl=window.location.href
            var str = aUrl.split("/").pop().replace(/(^introduction)|(\.\S+$)/g,"");
            console.log(str,'wozaizhe')
                this.getList(str);
        },
        methods: {
           getList(id){
               var vm=this
               indexApi.selectBasePage({id:id}).then(function (res) {
                   vm.detail=res.result
                   console.log(this.detail,'woziii')
               })
           }
        }
      })
    })
})
