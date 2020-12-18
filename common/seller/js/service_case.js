// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpStore', 'httpOrderApi', 'httpCom', 'jqValidate', 'dialog', 'fileSaver', 'httpUrl', 'laydate'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpStore, httpOrderApi, httpCom, jqValidate, dialog, fileSaver, httpUrl, laydate) {

        window.vueDom = new Vue({
            el: '#index_box',
            mixins: [userCenter],
            data: {
                http: httpStore,
                jquery: $,
                serviceList:[],
                queryForm: {
                    pageNum: 1,	// 	第几页	是	[string]		查看
                    pageSize: 10,	// 	每页显示多少行	是	[string]		查看
                    keyWord:'',
                    startTime:'',
                    endTime:'',
                    patentType:'',
                    transactionMode:'',
                    certificationFlag:'',
                    total: 0,
                },
                options: {},
                pages: 1,
                pageCount: 4,
                httpCom: httpCom
            },
            watch: {
                'queryForm.startTime': function (newVal, oldval) {
                    this.queryForm.endTime && new Date(newVal) > new Date(this.queryForm.endTime) && this.$dialog.showToast('开始时间不能大于结束时间！')
                },
                'queryForm.endTime': function (newVal, oldval) {
                    this.queryForm.startTime && new Date(newVal) > new Date(this.queryForm.endTime) && this.$dialog.showToast('开始时间不能大于结束时间！')
                }
            },
            created: function () {
                this.initData();
            },
            components: {
                'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
                'ly-toper': httpVueLoader('/style/components/toper.vue'),
                'ly-upload': httpVueLoader('/common/components/upload.vue'),
                'ly-header': httpVueLoader('/common/components/header.vue'),
                'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
            },
            mounted: function () {
                laydate.render({
                    elem: '#timeStart',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    type: 'datetime',
                    startkey: 'startTime',
                    endkey: 'endTime',
                    vm: this,
                    showBottom: true,
                    done: function (value, date, endDate) { //选择日期完毕的回调
                        this.vm.queryForm[this.startkey] = value;
                    }
                })
                laydate.render({
                    elem: '#timeEnd',
                    type: 'datetime',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    startkey: 'startTime',
                    endkey: 'endTime',
                    vm: this,
                    showBottom: true,
                    done: function (value, date, endDate) { //选择日期完毕的回调
                        this.vm.queryForm[this.endkey] = value;
                    }
                })
            },
            methods: {
                initData: function () {
                    this.code = this.$utils.getReqStr('code');
                    this.getServiceCaseList();
                    this.getOptions()
                },
                getServiceCaseList: function () {
                    var vm = this
                    httpOrderApi.serviceCaseSelectByPage(this.queryForm).then(function (res) {
                        if (res.code === 'rest.success') {
                            vm.$set(vm, 'serviceList', res.result.list);
                            vm.queryForm.total = res.result.total;
                            vm.pages = res.result.pages;
                        } else {
                            vm.serviceList = []
                            vm.queryForm.total = 0
                            vm.pages = 0;
                        }
                    })
                },
                //删除
                handleDelete(id,v){
                    let vm = this;
                    httpOrderApi.serviceCaseDelete({
                        id: id,
                        version: v
                    }).then(function (res) {
                        if (res.code == 'rest.success') {
                            vm.$dialog.showToast('删除成功！')
                            vm.getServiceCaseList()
                        }
                    })
                },
                getOptions: function () {
                    var vm = this;
                    let params={
                        dictInfos:[
                            {code:'patent_type'},
                            {code:'transaction_mode'},
                            {code:'certification_status'}
                        ]
                    };
                    httpCom.dictList(params).then(function (res) {
                        if (res.code === 'rest.success') {
                            res.result.forEach((item,index)=>{
                                vm.options[res.result[index].code]=res.result[index].dictIInfos
                            })
                        }
                    })
                },
                pageClick: function (index) {
                    if (index > 0 && index <= this.pages) {
                        this.queryForm.pageNum = index;
                        this.getServiceCaseList();
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
                }
            }
        });
    });
});
