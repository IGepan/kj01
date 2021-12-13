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
          // this.getList();
        },
        methods: {
           getList(){
               var vm=this
               indexApi.selectBasePage({settingType:'wanzhouBase'}).then(function (res) {
                   vm.detail=res.result
                   console.log(this.detail,'woziii')
               })
           }
        }
      })
    })
})
