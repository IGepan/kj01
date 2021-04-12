require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue','httpVueLoader'], function ($, Vue,httpVueLoader) {
    new Vue({
      el: '#index_box',
      data: {
        webInfo:''
      },
      components: {
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
        var that = this;
         that.getPublicDetail()
        $(".cnt_item").each(function(i){
          $(this).hover(function(){
            $(".cnt_item").removeClass("active");
            $(this).addClass("active");
          })
        })
      },
      methods: {
        getPublicDetail(){
          let vm=this;
          this.$httpCom.publicDetail().then(function(res) {
            if (res.code === "rest.success") {
              vm.webInfo = res.result;
              vm.monitorSetItem('webInfo', JSON.stringify(vm.webInfo));
            }
          });
        },
      }
    });
  });
});
