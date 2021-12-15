require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', 'httpUrl','/style/js/api/index.js'],
    function ($, Vue, httpVueLoader, httpUrl,indexApi) {
      new Vue({
        el: '#index_box',
        data: {
            detail:{},
            bannerList:[
                '/style/images/yzw/1.jpg',
                '/style/images/yzw/2.jpg',
                '/style/images/yzw/3.jpg',
                '/style/images/yzw/4.jpg',
                '/style/images/yzw/5.jpg',
                '/style/images/yzw/6.png',
                '/style/images/yzw/7.jpg',
                '/style/images/yzw/8.png',
                '/style/images/yzw/9.png',
                '/style/images/yzw/10.jpg',
            ]
        },
          create(){

          },
        mounted(){
            // // var id=this.$utils.getReqStr('id');
            // var aUrl=window.location.href
            // var str = aUrl.split("/").pop().replace(/(^introduction)|(\.\S+$)/g,"");
            // console.log(str,'wozaizhe')
            // if(str){
            //     this.getList(str);
            // }
        },
        methods: {
           // getList(id){
           //     var vm=this
           //     indexApi.selectBasePage({id:id}).then(function (res) {
           //         vm.detail=res.result
           //         console.log(this.detail,'woziii')
           //     })
           // }
        }
      })
    })
})
