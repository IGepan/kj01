// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpStore', 'httpOrderApi', 'httpCom', 'jqValidate', 'dialog', 'fileSaver', 'httpUrl', 'laydate','seller','httpUser'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpStore, httpOrderApi, httpCom, jqValidate, dialog, fileSaver, httpUrl, laydate,seller,httpUser) {
            Vue.component('vue-ueditor-wrap', VueUeditorWrap)
            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [seller],
                data: {
                    httpUser: httpUser,
                    http: httpStore,
                    jquery: $,
                    isFixed: false,
                    keyName:'',
                    formData:{
                        id:"",
                        title:"",
                        commission:"",
                        achievementHolder:"",
                        transactionTime:"",
                        transactionAmount:'',
                        transactionMode:"",
                        patentTitle:"",
                        patentType:"",
                        patentee:"",
                        patentNo:"",
                        validityPeriod:"",
                        contractRegistrationNo:"",
                        introduction:"",
                        field: [], // 领域
                        // contracts:[],//服务合同
                    },
                    isSubmitDisabled: false,
                    options: {},
                    uploadHeader: {},
                    fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
                    uploadData: {
                        system: 'ts'
                    },
                    secrecyList: [], // 资料附件
                    protocol: false,
                    platform: '',
                    isConference: true,
                    imgBtnTitle: '上传附件',
                    imgOption: {
                        size: "470,380",
                        prev: "provesImg",
                        url: this.httpUrl.imgUploadUrl + '/file/resource/uploadImg'
                    },
                    provesPhotoList: [],//证明材料图片列表
                    imgOptionContract:{
                        size: "470,380",
                        prev: "contractImg",
                        url: this.httpUrl.imgUploadUrl + '/file/resource/uploadImg'
                    },
                    contractPhotoList:[],//服务合同图片列表
                    httpCom: httpCom
                },
                watch: {

                },
                created: function () {
                    // var state = this.queryForm.orderStatusFilter = this.$utils.getReqStr('orderStatusFilter')
                    // this.initData();
                },
                components: {
                    'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
                    'ly-header': httpVueLoader('/common/components/header.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'img-uploader': httpVueLoader('/common/components/imgUploader.vue'),
                    'ly-select': httpVueLoader('/common/components/select.vue'),
                },
                mounted: function () {
                    this.initData();
                    this.platform = this.isConference ? '易智网' : '成渝城市群综合科技'
                    laydate.render({
                        elem: '#timeEnd',
                        value: this.formData.validityPeriod,
                        format: 'yyyy-MM-dd',
                        startkey: 'validityPeriod',
                        vm: this,
                        showBottom: true,
                        done: function (value, date, endDate) { //选择日期完毕的回调
                            this.vm.formData[this.startkey] = value;
                        }
                    })
                    laydate.render({
                        elem: '#timetransaction',
                        value: this.formData.transactionTime,
                        type: 'datetime',
                        format: 'yyyy-MM-dd HH:mm:ss',
                        startkey: 'transactionTime',
                        vm: this,
                        showBottom: true,
                        done: function (value, date, endDate) { //选择日期完毕的回调
                            this.vm.formData[this.startkey] = value;
                        }
                    })
                },
                methods: {
                    initData: function () {
                        let vm=this;
                        vm.scrollSSS();
                        this.formData.id=this.$utils.getReqStr('id')?this.$utils.getReqStr('id'):'';
                        if (this.formData.id) {
                            httpOrderApi.serviceDetail({
                                id: this.formData.id
                            }).then(function (res) {
                                vm.formData = $.extend(vm.formData, res.result);
                                // 初始化标签属性
                                for (var it of vm.formData.tags) {
                                    // 领域
                                    if (it.tagType == '02' || it.tagType === '04') {
                                        vm.formData.field.push({
                                            tagId: it.tagId,
                                            tagType: it.tagType,
                                            name: it.name
                                        });
                                    }
                                }
                                //初始化 证明材料 附件
                                if(vm.formData.proves){
                                    for(let it of vm.formData.proves){
                                        vm.provesPhotoList.push({
                                            id: it.id,
                                            url: it.url,
                                            // attachmentType: it.attachmentType
                                        })
                                    }
                                }
                                //初始化 服务合同 附件
                                if(vm.formData.contracts){
                                    for(let it of vm.formData.contracts){
                                        vm.contractPhotoList.push({
                                            id: it.id,
                                            url: it.url,
                                            // attachmentType: it.attachmentType
                                        })
                                    }
                                }
                            })
                        }
                    },
                    scrollSSS: function () {
                        var vm = this;
                        setTimeout(function () {
                            var tp = $('.setform').offset().top;
                            var cc = $('.addexperience');
                            function setActive (tp) {
                                $('.setbar span').removeClass('active');
                                for (var i = 0, l = cc.length;i < l;i++) {
                                    var m = cc.eq(i).offset().top - 48;
                                    if (i < l - 1) {
                                        if (i === 0 && tp < m) {
                                            $('.setbar span').eq(i).addClass('active');
                                            break;
                                        } else if (tp >= m && tp < cc.eq(i + 1).offset().top - 48) {
                                            $('.setbar span').eq(i).addClass('active');
                                            break;
                                        }
                                    } else {
                                        $('.setbar span').eq(i).addClass('active');
                                    }
                                }
                            }
                            var $_scroll = function (wait, fn) {
                                var tid = 0;
                                var cur, last = new Date();
                                return function () {
                                    cur = new Date();
                                    clearTimeout(tid);
                                    if (cur - last >= wait) {
                                        fn();
                                        last = cur;
                                    } else {
                                        tid = setTimeout(fn, wait);
                                    }
                                };
                            };
                            $(window).scroll($_scroll(100, function () {
                                var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
                                if (scrolltop >= tp) {
                                    if (!vm.isFixed) {
                                        vm.$set(vm, 'isFixed', true);
                                        $('.setform').css('padding-top', '48px');
                                    }
                                } else {
                                    if (vm.isFixed) {
                                        vm.$set(vm, 'isFixed', false);
                                        $('.setform').css('padding-top', '0');
                                    }
                                }
                                !vm._isClick && setActive(scrolltop);
                            }));
                            $('.setbar span').each(function (i, d) {
                                $(this).click(function () {
                                    $('.setbar span').removeClass('active');
                                    $(this).addClass('active');
                                    vm._isClick = true;
                                    var stp = $('.addexperience').eq(i).offset().top - 50;
                                    if (i === 0) {
                                        stp -= 50;
                                    }
                                    $('body,html').animate({
                                        scrollTop: stp
                                    }, 200, function () {
                                        setTimeout(function () {
                                            vm._isClick = false;
                                        }, 120);
                                    });
                                });
                            });
                            $('html,body').scrollTop(0);
                        }, 60);
                    },
                    clearMsg: function (code) {
                        this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
                    },
                    handleServicesInput: function (v) {
                        v.length && this.clearMsg('services')
                    },
                    handleTransactionInput:function(v){
                        console.log(v);
                        v.length && this.clearMsg('transaction')
                    },
                    /**
                     * 图片上传回调
                     */
                    imgUploadSuccess: function (successInfo, a, t,prev, data) {
                        // 处理图片
                        if (prev==='provesImg' && data) {
                            this.provesPhotoList.push({
                                id: data.id,
                                fileName: data.fileName,
                                url: data.url
                            });
                        }else if(prev==='contractImg' && data){
                            this.contractPhotoList.push({
                                id: data.id,
                                fileName: data.fileName,
                                url: data.url
                            });
                        }
                    },
                    /**
                     * 获取附件属性
                     */
                    getAttachmentList: function (subData) {
                        // 证明材料
                        subData.proves = [];
                        if (this.provesPhotoList.length) {
                            for (var it in this.provesPhotoList) {
                                if (this.provesPhotoList.hasOwnProperty(it)) {
                                    subData.proves.push(this.provesPhotoList[it].id)
                                }
                            }
                        }
                        // 服务合同
                        subData.contracts = [];
                        if (this.contractPhotoList.length) {
                            for (var it in this.contractPhotoList) {
                                if (this.contractPhotoList.hasOwnProperty(it)) {
                                    subData.contracts.push(this.contractPhotoList[it].id)
                                }
                            }
                        }

                    },
                    /**
                     * 删除证明材料图片
                     */
                    delProvesPhotoClick: function (index) {
                        this.provesPhotoList.splice(index, 1);
                    },
                    /**
                     * 删除服务合同图片
                     */
                    delContractPhotoClick: function (index) {
                        this.contractPhotoList.splice(index, 1);
                    },
                    /**
                     * 校验服务领域
                     */
                    fieldValid: function (v, o, callback) {
                        if (this.formData.field.length == 0) {
                            callback(o, '服务领域不能为空')
                        } else {
                            callback(o)
                        }
                    },
                    /**
                     * 校验交易方式
                     */
                    transactionValid: function (v, o, callback) {
                        if (this.formData.transactionMode.length === 0) {
                            callback(o, '交易方式不能为空')
                        } else {
                            callback(o)
                        }
                    },
                    /**
                     * 校验服务合同
                     */
                    contractValid: function (v, o, callback) {
                        if (this.contractPhotoList.length == 0) {
                            callback(o, '服务合同不能为空')
                        } else {
                            callback(o)
                        }
                    },
                    /**
                     * 校验简介
                     */
                    introductionValid: function (v, o, callback) {
                        if (!this.formData.introduction || this.formData.introduction === '') {
                            callback(o, '简介不能为空')
                        } else {
                            callback(o)
                        }
                    },
                    /**
                     * 获取标签属性
                     */
                    getTagList: function (subData) {
                        subData.tags = [];
                        // 领域
                        if (subData.field && subData.field !== '') {
                            for (var it of subData.field) {
                                subData.tags.push(it)
                            }
                        }
                    },
                    handleOpenProtocol: function () {
                        var vm = this
                        this.$httpCom.protocol({
                            protocolType: 4
                        }).then(function (res) {
                            if (res.result) {
                                var options = {
                                    class: 'full',
                                    title: vm.platform+'服务平台供应发布规范',
                                    close: false,
                                    texts: '<div style="margin: 10px 20px;">' + res.result.protocolContact + '<div>',
                                    buttons: [
                                        {
                                            label: '确认阅读'
                                        }
                                    ]
                                }
                                vm.$dialog.confirm2(options)
                            }
                        })
                    },
                    saveClick: function () {
                        var subData = JSON.parse(JSON.stringify(this.formData))
                        var vm = this;
                        !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
                            if (val) {
                                vm.isSubmitDisabled = true
                                // 获取附件信息
                                vm.getAttachmentList(subData);
                                vm.getTagList(subData);
                                if (subData.id) {
                                    httpOrderApi.serviceCaseUpdate(subData).then(function (res) {
                                        if (res.code == 'rest.success') {
                                            vm.$dialog.showToast('保存成功');
                                            vm.back();
                                        }
                                        vm.isSubmitDisabled = false
                                    }).catch(function () {
                                        vm.isSubmitDisabled = false
                                    })
                                } else {
                                    httpOrderApi.serviceCaseInsert(subData).then(function (res) {
                                        if (res.code == 'rest.success') {
                                            vm.$dialog.showToast('添加成功');
                                            vm.back();
                                        }
                                        vm.isSubmitDisabled = false
                                    }).catch(function () {
                                        vm.isSubmitDisabled = false
                                    })
                                }
                            } else {
                                console.log("校验失败");
                            }
                        })
                    },
                    submitClick: function () {
                        var subData = JSON.parse(JSON.stringify(this.formData))
                        var vm = this;
                        !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
                            if (val && vm.protocol) {
                                vm.isSubmitDisabled = true;
                                // 获取附件信息
                                vm.getAttachmentList(subData);
                                // 获取标签
                                vm.getTagList(subData);
                                httpOrderApi.serviceCaseSubmit(subData).then(function (res) {
                                    if (res.code == 'rest.success') {
                                        vm.$dialog.showToast('提交成功');
                                        vm.back();
                                    }
                                    vm.isSubmitDisabled = false
                                }).catch(function () {
                                    vm.isSubmitDisabled = false
                                })
                            } else {
                                val && !vm.protocol && vm.$dialog.showToast('请勾选发布协议！');
                            }
                        })
                    },
                    back: function () {
                        setTimeout(function () {
                            window.history.go(-1);
                        }, 1500);
                    },
                }
            });
        });
});
