// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpUrl','/style/js/api/aindex.js'], function ($, Vue, httpUrl,indexApi) {
        document.title = '直播活动';
        new Vue({
            el: '#index_box',
            data: {
                url: '',
                rid: '',
                name: '',
                pullStreamUrl:''
            },
            filters: {},
            mounted: function () {
            },
            created: function () {
                this.name = this.$utils.getReqStr('name');
                this.rid = this.$utils.getReqStr('rid')?'&rid='+this.$utils.getReqStr('rid'):'';
                this.url = this.$utils.getReqStr('url');
                var vm = this;
                indexApi.getVedioToken({ phone: this.name}).then(function (res) {
                    if(res.code==='rest.success'){
                        indexApi.validateVedio({ phone: vm.name,token:res.result}).then(function (ress) {
                            if(ress.code==='rest.success'){
                                vm.pullStreamUrl=vm.url+'?name='+vm.name+'&email='+vm.name+'@qq.com'+vm.rid;
                            }else{
                                vm.pullStreamUrl='';
                                document.write(ress.desc)
                            }
                        }).catch((err)=>{
                            document.write(err.desc)
                        })

                    }
                })
            },
            methods: {

            }
        });
    })
});
