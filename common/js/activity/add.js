// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/style/js/api/activity.js', 'jqValidate', 'dialog', 'httpUrl', 'laydate', 'jqSelect', 'VueUeditor'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, jqValidate, dialog, httpUrl, laydate, jqSelect, VueUeditor) {
        Vue.config.devtools = true
        window.vueDom = new Vue({
            el: '#index_box',
            mixins: [userCenter],
            data: function () {
                return {
                    fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
                    http: httpUser,
                    options: {
                        cooperation_type: [],
                        user_code: []
                    },

                    type: 'add',
                    imgOption: {
                        size: '690,460',
                        prev: 'head',
                        type: 'posterId',
                        url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
                    },
                    ueditorConfig: {
                        initialFrameHeight: 240,
                        maximumWords: 10000,
                        toolbars: [[
                            'undo', //撤销
                            'redo', //重做
                            '|',
                            'bold', //加粗
                            'indent', //首行缩进
                            'italic', //斜体
                            'underline', //下划线
                            'strikethrough', //删除线
                            'subscript', //下标
                            'fontborder', //字符边框
                            'superscript', //上标
                            'formatmatch', //格式刷
                            'pasteplain', //纯文本粘贴模式
                            '|',
                            'selectall', //全选
                            'removeformat', //清除格式
                            'time', //时间
                            'date', //日期
                            'inserttitle', //插入标题
                            'cleardoc', //清空文档
                            'fontfamily', //字体
                            'fontsize', //字号
                            'paragraph', //段落格式
                            'spechars', //特殊字符
                            'searchreplace', //查询替换
                            '|',
                            'justifyleft', //居左对齐
                            'justifyright', //居右对齐
                            'justifycenter', //居中对齐
                            'justifyjustify', //两端对齐
                            '|',
                            'forecolor', //字体颜色
                            'backcolor', //背景色
                            '|',
                            'insertorderedlist', //有序列表
                            'insertunorderedlist', //无序列表
                            '|',
                            'lineheight', //行间距
                            'touppercase', //字母大写
                            'tolowercase', //字母小写
                            '|',
                            'simpleupload', // 单图上传
                            // 'template' // 模板
                            '|',
                            'inserttable'
                        ]]
                    },
                    $Uedit: null,
                    isOpenUeditTemplate: false,
                    templateList: [],
                    selectedIndex: '',
                    RetainOriginal: false,
                    activeId: '',
                    keywordVal: '',
                    isOpenCooperation: false,
                    isOnLineFlag: '0',
                    formData: {
                        title: '', // 活动名称
                        activeType: '', // 活动类型(字典表：active_type)
                        sponsor: [], // 主办单位
                        country: '', // 活动地点_国家(字典表:administrative_division)
                        province: '', // 活动地点_省份(字典表:administrative_division)
                        city: '', // 活动地点_城市(字典表:administrative_division)
                        district: '', // 活动地点_区县(字典表:administrative_division)
                        location: '', // 详细地址
                        longitude: '', // 经度
                        latitude: '', // 纬度
                        scale: '', // 活动规模
                        posterId: '', // 活动海报
                        activeText: '', // 活动详情
                        activeStartTime: '', // 活动开始时间
                        activeEndTime: '', // 活动结束时间
                        isNeverExpires: 0, // 是否长期有效(字典表：yes_no)
                        activeAbstract: '', // 活动摘要
                        subscribeTag: [], // 订阅关键字
                        industry: [],
                        fileIds: [],
                        branches: [],
                        onLineFlag: '0',
                        liveFlag: 0,
                        pushStreamUrl: '',
                        pullStreamUrl: '',//直播地址
                        thirdUrl: '',//第三方直播地址
                        indexUrl: '',//易智网直播地址
                        isUpdateEnroll: 1,
                        enrollFlag: 0,
                        isUpdateSign: 1,
                        signFlag: 0,
                        isUpdateReceipt: 1,
                        receiptFlag: 0,
                        cooperation: [], // 协作单位
                        enrollRule: { // Av02EnrollRuleEntity
                            auditFlag: '', // 是否需要审核(字典表：yes_no)
                            enrollStartTime: '', // 报名开始时间
                            enrollEndTime: '', // 报名结束时间
                            comment: '', // 报名说明
                            isIgnoreEndTime: 1 //是否无视报名结束时间，默认无视
                        },
                        enrollColumn: [],
                        signRule: { // Av04SignRuleEntity
                            signLocation: '', // 签到地点
                            longitude: '', // 签到经度
                            latitude: '', // 签到纬度
                            signArea: '', // 签到范围
                            signPeriodDtls: [
                                {
                                    signStartTime: '', // 签到开始时间
                                    signEndTime: '' // 签到结束时间
                                }
                            ],
                            comment: '', // 签到说明
                        },
                        signColumn: [],
                        receiptRule: {
                            receiptStartTime: '', // 	回执调查开始时间
                            receiptEndTime: '', // 	回执调查结束时间
                            comment: '' // 征集说明
                        },
                        receiptColumn: [],
                        liveInfo: {
                            liveStartTime: "",
                            liveEndTime: "",
                            canReplay: "0",
                            canInteract: "0"
                        },
                        isThird: '1'
                    },
                    branchesList: [],
                    location: '',
                    city: '',
                    isShowMap: false,
                    isSubmitDisabled: false,
                    liveTab: [
                        {
                            name: '第三方直播',
                        },
                        {
                            name: '易智网直播',
                        }
                    ],
                    activeliveTab: 0
                };
            },
            watch: {
                'formData.enrollFlag': function (n, o) {
                    n && this.$nextTick(function () {
                        this.type !== 'view' && (this.$nrollTime = laydate.render({
                            elem: '#nrollTime',
                            type: 'datetime',
                            value: '',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            startkey: 'enrollStartTime',
                            endkey: 'enrollEndTime',
                            vm: this,
                            trigger: 'click',
                            calendar: true,
                            done: function (value, date, endDate) { //选择日期完毕的回调
                                this.vm.formData.enrollRule[this.startkey] = value;
                            }
                        }));
                        this.type !== 'view' && (this.$nrollTime1 = laydate.render({
                            elem: '#nrollTime1',
                            type: 'datetime',
                            value: '',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            startkey: 'enrollStartTime',
                            endkey: 'enrollEndTime',
                            vm: this,
                            trigger: 'click',
                            calendar: true,
                            done: function (value, date, endDate) { //选择日期完毕的回调
                                this.vm.formData.enrollRule[this.endkey] = value
                            }
                        }));
                        document.querySelector('#nrollTime').value = this.formData.enrollRule.enrollStartTime || ''
                        document.querySelector('#nrollTime1').value = this.formData.enrollRule.enrollEndTime || ''
                    });
                },
                'formData.signFlag': function (n, o) {
                    n && this.$nextTick(function () {
                        if (this.type === 'add' && this.formData.activeStartTime && this.formData.activeEndTime) {
                            this.formData.signRule.signPeriodDtls[0].signStartTime = this.formData.activeStartTime;
                            this.formData.signRule.signPeriodDtls[0].signEndTime = this.formData.activeEndTime;
                        }
                        this.initSingDate()
                    });
                },
                'formData.receiptFlag': function (n, o) {
                    n && this.$nextTick(function () {
                        this.type !== 'view' && (this.$receiptTime = laydate.render({
                            elem: '#receiptTime',
                            type: 'datetime',
                            value: '',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            startkey: 'receiptStartTime',
                            endkey: 'receiptEndTime',
                            trigger: 'click',
                            vm: this,
                            calendar: true,
                            done: function (value, date, endDate) { //选择日期完毕的回调
                                this.vm.formData.receiptRule[this.startkey] = value;
                            }
                        }));
                        this.type !== 'view' && (this.$receiptTime1 = laydate.render({
                            elem: '#receiptTime1',
                            type: 'datetime',
                            value: '',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            startkey: 'receiptStartTime',
                            endkey: 'receiptEndTime',
                            trigger: 'click',
                            vm: this,
                            calendar: true,
                            done: function (value, date, endDate) { //选择日期完毕的回调
                                this.vm.formData.receiptRule[this.endkey] = value;
                            }
                        }));
                        document.querySelector('#receiptTime').value = this.formData.receiptRule.receiptStartTime || ''
                        document.querySelector('#receiptTime1').value = this.formData.receiptRule.receiptEndTime || ''
                    });
                },
                'activeliveTab': function (n, o) {
                    n && this.$nextTick(function () {
                        this.type !== 'view' && (this.$liveTime = laydate.render({
                            elem: '#liveTime',
                            type: 'datetime',
                            value: '',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            startkey: 'liveStartTime',
                            endkey: 'liveEndTime',
                            vm: this,
                            trigger: 'click',
                            calendar: true,
                            done: function (value, date, endDate) { //选择日期完毕的回调
                                this.vm.formData.liveInfo[this.startkey] = value;
                            }
                        }));
                        this.type !== 'view' && (this.$liveTime1 = laydate.render({
                            elem: '#liveTime1',
                            type: 'datetime',
                            value: '',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            startkey: 'liveStartTime',
                            endkey: 'liveEndTime',
                            vm: this,
                            trigger: 'click',
                            calendar: true,
                            done: function (value, date, endDate) { //选择日期完毕的回调
                                this.vm.formData.liveInfo[this.endkey] = value
                            }
                        }));
                        document.querySelector('#liveTime').value = this.formData.liveInfo.liveStartTime || ''
                        document.querySelector('#liveTime1').value = this.formData.liveInfo.liveEndTime || ''
                    });
                },
            },
            created: function () {
                this.activeId = this.$utils.getReqStr('id');
                this.type = this.$utils.getReqStr('type') || 'add';
            },
            components: {
                'vue-ueditor-wrap': VueUeditor,
                'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
                'header-bar': httpVueLoader('/common/components/header.vue'),
                'buyer-left': httpVueLoader('/common/components/conferenceLeft.vue'),
                'ly-address-select': httpVueLoader('/common/components/addressSelect.vue'),
                'address-map': httpVueLoader('/common/components/addressMap.vue'),
                'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
                'img-uploader': httpVueLoader('/common/components/imgUploader.vue'),
                'ly-code-mulselect': httpVueLoader('/common/components/mulCodeSelect.vue'),
                'ly-upload': httpVueLoader('/common/components/upload.vue'),
                'ly-select': httpVueLoader('/common/components/select.vue'),
                'select-type': httpVueLoader('/style/components/selectType.vue'),
                // 'el-select':httpVueLoader('/common/components/select.vue')
            },
            mounted: function () {
                this.type !== 'view' && (this.$time = laydate.render({
                    elem: '#time',
                    type: 'datetime',
                    value: this.formData.activeStartTime,
                    format: 'yyyy-MM-dd HH:mm:ss',
                    startkey: 'activeStartTime',
                    endkey: 'activeEndTime',
                    vm: this,
                    trigger: 'click',
                    calendar: true,
                    done: function (value, date, endDate) { //选择日期完毕的回调
                        value && (this.vm.$refs.atimeMsg.innerText = '')
                        this.vm.formData[this.startkey] = value;
                    }
                }));
                this.type !== 'view' && (this.$time2 = laydate.render({
                    elem: '#time1',
                    type: 'datetime',
                    value: this.formData.activeEndTime,
                    format: 'yyyy-MM-dd HH:mm:ss',
                    startkey: 'activeStartTime',
                    endkey: 'activeEndTime',
                    vm: this,
                    trigger: 'click',
                    calendar: true,
                    done: function (value, date, endDate) { //选择日期完毕的回调
                        value && (this.vm.$refs.atimeMsg.innerText = '')
                        this.vm.formData[this.endkey] = value;
                    }
                }));
                this.initData()
                if (!this.activeId) {
                    this.$nextTick(function () {
                        var vm = this
                        setTimeout(function () {
                            var addressArr = vm.$refs.addressRef;
                            if (addressArr) {
                                addressArr.setValues(['100', '500000', '500100', '']);
                            }
                        }, 100)
                    })
                }
            },
            methods: {
                //是否点播
                getRadioVal (event) {
                    let radioVal = event.target.value;
                    console.log(radioVal);
                },
                initData: function () {
                    this.queryBranch()
                    this.getOptions([
                        {'code': "cooperation_type"}
                    ])
                    !this.activeId && this.getSetting('enroll') && this.getSetting('sign') && this.getSetting('receipt');
                    this.activeId && this.getDetail();
                    this.getTemplateList()
                    this.getTree([
                        {
                            type: '11'
                        }
                    ])
                    // this.getliveAuth()

                },
                queryBranch: function () {
                    activityApi.queryBranch().then(res => {
                        this.branchesList = res.result;
                    });
                },
                getTree: function (keys) {
                    var vm = this;
                    activityApi.getTree(keys).then(function (res) {
                        if (res.code === 'rest.success') {
                            vm.options['user_code'] = res.result[0]
                        }
                    });
                },
                getDetail: function () {
                    var vm = this;
                    activityApi.detail({id: this.activeId}).then(function (res) {
                        if (res.code === 'rest.success') {
                            var to = res.result
                            for (var key in to) {
                                if (key !== 'poster' && key !== 'files') {
                                    if (key === 'sponsor') {
                                        // 初始化 主办方
                                        vm.formData[key] = to[key] ? to[key].split('ぶんかつ') : [];
                                    } else if (key === 'isNeverExpires') {
                                        // 初始化 转化随到随学
                                        vm.formData[key] = parseInt(to[key]);
                                    } else {
                                        // 初始化 其他属性
                                        vm.formData[key] = to[key];
                                    }
                                }
                                // 附件
                                if (key === 'files') {
                                    vm.formData['fileIds'] = to[key]
                                }
                            }
                            to.enrollColumn.forEach((item) => {
                                if (item.isNull === 1) {
                                    item.isHidden = 0
                                }
                            });
                            // 初始化 报名签到等设置
                            to.enrollRule && (vm.formData.enrollFlag = 1);
                            to.signRule && (vm.formData.signFlag = 1);
                            to.receiptRule && (vm.formData.receiptFlag = 1);
                            to.receiptFlag === '0' && (vm.formData.receiptFlag = 0)
                            !to.enrollRule && vm.getSetting('enroll');
                            !to.signRule && vm.getSetting('sign');
                            !to.receiptRule && vm.getSetting('receipt');
                            to.status === '02' && (vm.isSubmitDisabled = true);
                            // 宣传图片
                            to.poster && (vm.$refs.bgImg.style.backgroundImage = 'url(' + to.poster.url + ')');
                            // 地址初始化
                            var addressArr = vm.$refs.addressRef;
                            if (to.onLineFlag === '0' && addressArr) {
                                to.country && addressArr.setValues([to.country || '100', to.province || '500000', to.city || '500100', to.district]);
                            } else if (addressArr) {
                                addressArr.reset();
                            }
                            // 时间
                            to.activeStartTime && (document.querySelector('#time').value = to.activeStartTime);
                            to.activeEndTime && (document.querySelector('#time1').value = to.activeEndTime);
                            //直播
                            to.liveFlag.toString() === '1' && to.isThird.toString() === '0' && (vm.formData.liveFlag = 1) && (vm.activeliveTab = 1);
                            vm.liveTab.forEach((item, indexs) => {
                                if (vm.activeliveTab === indexs) {
                                    item.selected = true
                                } else {
                                    item.selected = false
                                }
                            });
                            //回显推送站点
                            // res.result.branchesList.pop()
                            vm.formData.branches=res.result.branchesList
                            vm.formData.branches.splice(vm.formData.branches.indexOf('185797207564156929'),1);
                            // res.result.branchesList.forEach((item) => {
                            //     if(item!=="185797207564156929"){
                            //         vm.formData.branches.push(item)
                            //     }
                            //     console.log(vm.formData.branches,'0000')
                            // })
                            console.log(vm.formData.branches,'0000')
                            to.pullStreamUrl && to.isThird.toString() === '1' && (vm.formData.thirdUrl = to.pullStreamUrl)
                        }
                    })
                },
                getOptions: function (keys) {
                    var vm = this;
                    this.$httpCom.dictList({dictInfos: keys}).then(function (res) {
                        if (res.code === 'rest.success') {
                            res.result.forEach(function (codes) {
                                vm.options[codes.code] = codes.dictIInfos
                            })
                        }
                    })
                },
                getSetting: function (templeteCode) {
                    var vm = this;
                    activityApi.getByCode({templeteCode: templeteCode}).then(function (res) {
                        if (res.code === 'rest.success') {
                            res.result.forEach(function (item) {
                                item.options && (item.voptions = item.options.split(','));
                            })
                            vm.formData[templeteCode + 'Column'] = res.result
                        }
                    });
                    return 1;
                },
                getTemplateList: function () {
                    var vm = this;
                    activityApi.selectPolicy({}).then(function (res) {
                        if (res.code === 'rest.success') {
                            res.result.forEach(item => {
                                item.selected = 0
                            })
                            vm.templateList = res.result;
                        }
                    })
                },
                requestForm: function (type) {
                    var vm = this;
                    $('.valiform').validate('submitValidate', function (val) {
                        if (val) {
                            vm.getAddressValue();
                            vm.formData.thirdUrl && vm.formData.isThird && (vm.formData.pullStreamUrl = vm.formData.thirdUrl)
                            var data = JSON.parse(JSON.stringify(vm.formData, function (k, v) {
                                if (k === 'fileIds') {
                                    return v.map(function (file) {
                                        return file.id;
                                    })
                                }
                                if (k === 'sponsor') {
                                    return v && v.join('ぶんかつ');
                                }
                                return v;
                            }));
                            data.signRule.signPeriodDtls.sort(function (a, b) {
                                var a = new Date(a.signStartTime).getTime()
                                var b = new Date(b.signStartTime).getTime()
                                return a < b ? -1 : a > b ? 1 : 0;
                            });
                            vm.isSubmitDisabled = true

                            activityApi[type](data).then(function (res) {
                                // alert(1)
                                if (res.code === 'rest.success') {
                                    setTimeout(() => {
                                        // window.history.back(-1)
                                        window.location.href=this.$pathPrefix+'/common/activity/list.html?code=001.004.001.001'
                                    }, 2000);
                                } else {
                                    vm.isSubmitDisabled = false
                                }
                                vm.$dialog.showToast(res.desc);
                            }).catch(function (error) {
                                vm.$dialog.showToast('系统错误！');
                                vm.isSubmitDisabled = false
                            });
                        }
                    })
                },
                handleInsert: function () {
                    this.requestForm(this.type === 'edit' ? 'update' : 'insert')
                },
                handleSubmit: function () {
                    this.requestForm('submit')
                },
                handleBack: function () {
                    // location.href = 'common/activity/list.html?code=001.004.001.001'
                   window.history.back(-1)
                },
                handleDelFile: function (i) {
                    this.formData.fileIds.splice(i, 1)
                },
                handleOpenMap: function () {
                    this.getAddressValue();
                    if (this.formData.country && this.formData.province && this.formData.city && this.formData.district) {
                        var $option = $(this.$refs.addressRef.$el).find('option:selected')
                        this.location = $option.text()
                        this.city = $option[2].innerText
                        this.isShowMap = true
                    } else {
                        this.$dialog.showToast('请先选择省市区');
                    }
                },
                changeEnrollCheckbox(item) {
                    if (item.isNull === 1) {
                        item.isHidden = 0
                    }
                },
                handEnrollCheckbox: function (e) {
                    if (!this.formData.isUpdateEnroll) {
                        // this.$dialog.showToast('当前已有人员报名，不允许修改报名内容！');
                        // e.stopPropagation()
                        // e.preventDefault()
                        // return false
                    }
                },
                handleAddKeywordClick: function () {
                    if (this.keywordVal) {
                        this.formData.sponsor.push(this.keywordVal)
                        this.keywordVal = ''
                    } else {
                        this.$dialog.showToast('请先填写主办单位')
                    }
                },
                handleDelKeywordClick: function (index) {
                    this.formData.sponsor.splice(index, 1);
                },
                handleAddCooperation: function (e) {
                    var dataset = e.target.dataset
                    this.formData.cooperation.push({
                        cooperationTypeDisplay: dataset.name,
                        cooperationType: dataset.type,
                        cooperationName: ''
                    })
                },
                handleDelCooperation: function (index) {
                    this.formData.cooperation.splice(index, 1);
                },
                changeSignCheckbox(item) {
                    if (item.isNull === 1) {
                        item.isHidden = 0
                    }
                },
                handSignCheckbox: function (e) {
                    if (!this.formData.isUpdateSign) {
                        this.$dialog.showToast('当前已有人员签到，不允许修改签到内容！');
                        e.stopPropagation()
                        e.preventDefault()
                        return false
                    }
                },
                clearMsg: function (code) {
                    this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
                },
                handLiveCheckbox: function (e) {
                    if (this.formData.onLineFlag === '0') {
                        this.$dialog.showToast('请先选择为线上活动！或线上+线下活动');
                        e.stopPropagation()
                        e.preventDefault()
                        return false
                    }
                },
                bindUeditReady: function (uedit) {
                    this.$Uedit = uedit
                    $('.edui-toolbar').append(`<div class="edui-box edui-button edui-template edui-default" onclick="window.vueDom.handleOpenTemplate()"><div>套用模板</div></div>`)
                },
                handleOpenTemplate: function () {
                    this.isOpenUeditTemplate = true
                },
                handleCloseTemplate: function () {
                    this.isOpenUeditTemplate = false;
                },
                handleSetTemplate: function (e) {
                    if (typeof this.selectedIndex === 'number') {
                        this.$Uedit.setContent(this.templateList[this.selectedIndex].content, this.RetainOriginal);
                        this.handleCloseTemplate()
                    } else {
                        this.$message.error('请选择模板！');
                    }
                },
                handleSetIndex: function (e) {
                    let index = e.currentTarget.dataset.index;
                    typeof this.selectedIndex === 'number' && (this.templateList[this.selectedIndex].selected = 0);
                    this.templateList[index].selected = 1
                    this.selectedIndex = parseInt(index);
                    this.handleSetTemplate()
                },
                initSingDate: function () {
                    this.$nextTick(function () {
                        var vm = this
                        $('.time_box .time_row').each(function (i, item) {
                            var $itemInput = $(item).find('input');
                            var temp = vm.formData.signRule.signPeriodDtls[i]
                            var isUpdateSign = vm.formData.isUpdateSign
                            $itemInput.each(function (index, input) {
                                var $item = '';
                                var $titem = ''
                                if (isUpdateSign) {
                                    vm.type !== 'view' && laydate.render({
                                        elem: '#' + input.getAttribute("id"),
                                        type: 'datetime',
                                        value: '',
                                        format: 'yyyy-MM-dd HH:mm:ss',
                                        startkey: 'signStartTime',
                                        endkey: 'signEndTime',
                                        valueType: index,
                                        subIndex: i,
                                        vm: vm,
                                        trigger: 'click',
                                        calendar: true,
                                        change: function (value, date, endDate) { //选择日期完毕的回调
                                            // this.vm.checkSignTims(value);
                                            // console.log(value)
                                        },
                                        done: function (value, date, endDate) { //选择日期完毕的回调
                                            value && (this.vm.$refs.atimeMsg.innerText = '');
                                            this.vm.checkSignTims(value, this.subIndex);
                                            this.valueType ? (this.vm.formData.signRule.signPeriodDtls[this.subIndex][this.endkey] = value) : (this.vm.formData.signRule.signPeriodDtls[this.subIndex][this.startkey] = value);
                                        }
                                    });
                                    input.value = index ? temp.signEndTime : temp.signStartTime
                                } else {
                                    $item = $(input)
                                    $item.val(index ? temp.signEndTime : temp.signStartTime)
                                    // $titem = $item.clone(false)
                                    // $item.replaceWith($titem)
                                    // $titem.val(index ? temp.signEndTime : temp.signStartTime)
                                }
                            })
                        });
                    })
                },
                checkSignTims: function (time, excludeIndex) {
                    var vm = this
                    if (this.formData.signRule.signPeriodDtls.some(function (signTime, i) {
                        if (typeof excludeIndex === 'number' && excludeIndex === i) return false;
                        if (signTime.signStartTime && signTime.signEndTime) {
                            if (vm.timeInRange(time, signTime.signStartTime, signTime.signEndTime)) {
                                return true
                            }
                        }
                    })) {
                        this.$dialog.showToast("其他签到时段已包含,请重选！");
                        return true
                    } else {
                        return false
                    }
                },
                handleAddSignTimeRange: function () {
                    var length = this.formData.signRule.signPeriodDtls.length
                    var temp = this.formData.signRule.signPeriodDtls[length - 1]
                    var isUpdateSign = this.formData.isUpdateSign
                    if (isUpdateSign) {
                        if (length < 10) {
                            if (temp.signStartTime && temp.signEndTime) {
                                if (!this.endIsGreaterThanThebeginning(temp.signStartTime, temp.signEndTime)) {
                                    this.formData.signRule.signPeriodDtls.push(
                                        {
                                            signStartTime: '', // 签到开始时间
                                            signEndTime: '' // 签到结束时间
                                        });
                                    this.initSingDate();
                                } else {
                                    this.$dialog.showToast("签到开始时间必须小于结束时间！");
                                }
                            } else {
                                this.$dialog.showToast("请先选择签到开始或结束时间！");
                            }
                        } else {
                            this.$dialog.showToast("最多添加10组签到时间！");
                        }
                    } else {
                        this.$dialog.showToast('当前已有人员签到，不允许修改签到内容！');
                    }
                },
                handleDelSingTimeOne: function (i) {
                    var isUpdateSign = this.formData.isUpdateSign
                    if (isUpdateSign) {
                        this.formData.signRule.signPeriodDtls.splice(i, 1)
                    } else {
                        this.$dialog.showToast('当前已有人员签到，不允许修改签到内容！');
                    }
                },
                handleDelEnrollFormItem: function (i) {
                    this.formData.enrollColumn.splice(i, 1)
                },
                handleDelSignFormItem: function (i) {
                    this.formData.signColumn.splice(i, 1)
                },
                handleDelReceiptFormItem: function (i) {
                    this.formData.receiptColumn.splice(i, 1)
                },
                handleClearLiveSet: function () {
                    // if (this.formData.isUpdateEnroll) {
                    this.formData.liveFlag = 0
                    this.formData.isThird = ''
                    // } else {
                    //   this.$dialog.showToast('当前已有人员报名，不允许修改报名内容！');
                    // }
                },
                handleClearEnrollSet: function () {
                    if (this.formData.isUpdateEnroll) {
                        this.formData.enrollFlag = 0
                    } else {
                        this.$dialog.showToast('当前已有人员报名，不允许修改报名内容！');
                    }
                },
                handleClearSignSet: function () {
                    if (this.formData.isUpdateSign) {
                        this.formData.signFlag = 0
                    } else {
                        this.$dialog.showToast('当前已有人员签到，不允许修改签到内容！');
                    }
                },
                handleClearReceiptSet: function () {
                    if (this.formData.isUpdateReceipt) {
                        this.formData.receiptFlag = 0
                    } else {
                        this.$dialog.showToast('当前已有人员反馈，不允许修改反馈内容！');
                    }
                },
                //TODO
                handleSetLine: function () {
                    if (!this.formData.isUpdateSign) {
                        this.$dialog.showToast('当前已有人员签到，不允切换模式！');
                        return false
                    } else {
                        if (this.formData.onLineFlag === '2') {
                            this.formData.onLineFlag = '0'
                            this.isOnLineFlag = '0'
                          this.$dialog.showToast('当前正在设置线下活动');
                            var addressArr = this.$refs.addressRef;
                            if (addressArr) {
                                this.formData.country = '100'
                                this.formData.province = '500000'
                                this.formData.city = '500100'
                                this.formData.district = ''
                                addressArr.setValues([this.formData.country, this.formData.province, this.formData.city, this.formData.district]);
                            }
                        }
                    }
                },
                handleSetOnLine: function () {
                    if (!this.formData.isUpdateSign) {
                        this.$dialog.showToast('当前已有人员签到，不允切换模式！');
                        return false
                    } else {
                        if (this.formData.onLineFlag === '0' || this.formData.onLineFlag === '2') {
                            this.formData.onLineFlag = '1'
                            this.isOnLineFlag = '1'
                            var addressArr = this.$refs.addressRef;
                            if (addressArr) {
                                this.formData.country = ''
                                this.formData.province = ''
                                this.formData.city = ''
                                this.formData.district = ''
                                addressArr.reset();
                            }
                        } else {
                            $('#addressBox').removeAttr(":disableds");
                            this.formData.onLineFlag = '0'
                            this.isOnLineFlag = '0'
                            var addressArr = this.$refs.addressRef;
                            if (addressArr) {
                                this.formData.country = '100'
                                this.formData.province = '500000'
                                this.formData.city = '500100'
                                this.formData.district = ''
                                addressArr.setValues([this.formData.country, this.formData.province, this.formData.city, this.formData.district]);
                            }
                        }
                    }
                },
                handleActivity: function () {
                    if (!this.formData.isUpdateSign) {
                        this.$dialog.showToast('当前已有人员签到，不允切换模式！');
                        return false
                    } else {
                        if (this.formData.onLineFlag === '1' || this.formData.onLineFlag === '0' || this.formData.onLineFlag === '2') {
                            this.isOnLineFlag = '0'
                            this.formData.onLineFlag = '2'
                            this.$dialog.showToast('当前正在设置线上+线下活动');
                            var addressArr = this.$refs.addressRef;
                            if (addressArr) {
                                this.formData.country = '100'
                                this.formData.province = '500000'
                                this.formData.city = '500100'
                                this.formData.district = ''
                                addressArr.setValues([this.formData.country, this.formData.province, this.formData.city, this.formData.district]);
                            }
                        }
                    }
                },
                addressValid: function (v, o, callback) {
                    var vm = this;
                    setTimeout(function () {
                        vm.getAddressValue();
                        if (vm.formData.country == '' || vm.formData.province == '') {
                            callback(o, '所在地区不能为空');
                        } else {
                            callback(o)
                        }
                    }, 800)
                },
                getAddressValue: function () {
                    var addressArr = this.$refs.addressRef.getSelected();
                    this.formData.country = addressArr[0];
                    this.formData.province = addressArr[1];
                    this.formData.city = addressArr[2];
                    this.formData.district = addressArr[3];
                },
                inputIndustry: function (v) {
                    v.length && this.clearMsg('industry')
                },
                industryValid: function (v, o, callback) {
                    if (!this.formData.industry.length) {
                        callback(o, '所属行业不能为空')
                    } else {
                        callback(o)
                    }
                },
                activeTimeValid: function (v, o, callback) {
                    if (!this.formData.isNeverExpires && (!this.formData.activeStartTime || !this.formData.activeEndTime)) {
                        callback(o, '活动时间不能为空')
                    } else if (!this.formData.isNeverExpires && this.endIsGreaterThanThebeginning(this.formData.activeStartTime, this.formData.activeEndTime)) {
                        callback(o, '活动开始时间不能大于结束时间')
                    } else {
                        this.formData.isNeverExpires && (this.formData.activeStartTime = '', this.formData.activeEndTime = '')
                        document.querySelector('#time').value = '';
                        document.querySelector('#time1').value = '';
                        callback(o)
                    }
                },
                activeImgValid: function (v, o, callback) {
                    if (!this.formData.posterId) {
                        callback(o, '宣传图不能为空')
                    } else {
                        callback(o)
                    }
                },
                timeInRange: function (time, begin, end) {
                    begin = new Date(begin).getTime();
                    time = new Date(time).getTime();
                    end = new Date(end).getTime();
                    return begin <= time && time <= end;
                },
                endIsGreaterThanThebeginning: function (begin, end) {
                    return new Date(begin).getTime() >= new Date(end).getTime();
                },
                customprofession: function (v, o, callback) {
                    var $this = this
                    setTimeout(function () {
                        var t = $this.formData.activeText;
                        v = $this.formData.activeText ? $this.formData.activeText.replace(/<\/?.+?>/g, "").replace(/ /g, "") : '';
                        if (t === '') {
                            callback(o, '活动详情不能为空')
                        } else if (v.length > 10000) {
                            callback(o, '活动详情少于10000字')
                        } else {
                            callback(o)
                        }
                    }, 2000)
                },
                signAreaValid: function (v, o, callback) {
                    if (!this.formData.longitude && !this.formData.latitude) {
                        callback(o, '请先使用地图选择详细地址！')
                    } else {
                        callback(o)
                    }
                },
                activeTimeIncludeliveTime: function (begin, end, time) {
                    return (new Date(time).getTime() >= new Date(begin).getTime()) && (new Date(time).getTime() <= new Date(end).getTime());
                },
                liveTimeValid: function (v, o, callback) {
                    if (!this.formData.liveInfo.liveStartTime || !this.formData.liveInfo.liveEndTime) {
                        callback(o, '开始或结束时间必填')
                    } else if (!this.formData.isNeverExpires && !this.activeTimeIncludeliveTime(this.formData.activeStartTime, this.formData.activeEndTime, this.formData.liveInfo.liveStartTime) && !this.activeTimeIncludeliveTime(this.formData.activeStartTime, this.formData.activeEndTime, this.formData.liveInfo.liveEndTime)) {
                        callback(o, '直播开始或直播结束时间必须在活动时间的范围内')
                    } else if (this.endIsGreaterThanThebeginning(this.formData.liveInfo.liveStartTime, this.formData.liveInfo.liveEndTime)) {
                        callback(o, '开始时间不能大于结束时间')
                    } else {
                        callback(o)
                    }
                },
                nrollTimeValid: function (v, o, callback) {
                    if ((this.formData.enrollRule.enrollStartTime && !this.formData.enrollRule.enrollEndTime) || (!this.formData.enrollRule.enrollStartTime && this.formData.enrollRule.enrollEndTime)) {
                        callback(o, '开始或结束时间必填')
                    } else if (this.endIsGreaterThanThebeginning(this.formData.enrollRule.enrollStartTime, this.formData.enrollRule.enrollEndTime)) {
                        callback(o, '可报名时间开始时间不能大于结束时间')
                    } else {
                        callback(o)
                    }
                },
                signTimeValid: function (v, o, callback) {
                    var vm = this
                    if (this.formData.signRule.signPeriodDtls.some(function (time) {
                        if (!time.signStartTime || !time.signEndTime) {
                            return true
                        }
                    })) {
                        callback(o, '可签到时间开始或结束时间必填,请检查！')
                    } else if (this.formData.signRule.signPeriodDtls.some(function (time) {
                        return vm.endIsGreaterThanThebeginning(time.signStartTime, time.signEndTime)
                    })) {
                        callback(o, '可签到时间开始时间不能大于结束时间,请检查！')
                    } else if (this.formData.signRule.signPeriodDtls.some(function (time, i) {
                        return vm.checkSignTims(time.signStartTime, i) || vm.checkSignTims(time.signEndTime, i)
                    })) {
                        callback(o, '可签到时间存在包含关系,请检查！')
                    } else {
                        callback(o)
                    }
                },
                receiptTimeValid: function (v, o, callback) {
                    if (!this.formData.receiptRule.receiptStartTime || !this.formData.receiptRule.receiptEndTime) {
                        callback(o, '意见征集时间不能为空')
                    } else if (this.endIsGreaterThanThebeginning(this.formData.receiptRule.receiptStartTime, this.formData.receiptRule.receiptEndTime)) {
                        callback(o, '意见征集时间开始时间不能大于结束时间')
                    } else {
                        callback(o)
                    }
                },
                bindSponsorValid: function (v, o, callback) {
                    if (!this.formData.sponsor.length) {
                        callback(o, '主办单位不能为空')
                    } else {
                        callback(o)
                    }
                },
                bindCooperationValid: function (v, o, callback) {
                    if (this.formData.cooperation.some(function (item) {
                        return !item.cooperationName
                    })) {
                        callback(o, '合作单位信息不能为空')
                    } else {
                        callback(o)
                    }
                },
                bindActiveTypeValid: function (v, o, callback) {
                    if (!this.formData.activeType) {
                        callback(o, '活动类型不能为空')
                    } else {
                        callback(o)
                    }
                },
                uploadSuccess: function (successInfo) {
                    this.formData.fileIds.push(successInfo.data)
                },
                imgUploadSuccess: function (id, url, type, data) {
                    this.formData[type] = id;
                    this.$refs.bgImg.style.backgroundImage = 'url(' + url + ')';
                },
                // 地图点击后回调
                mapClick: function (mapInfo) {
                    this.formData.location = mapInfo.address;
                    this.formData.longitude = mapInfo.lng;
                    this.formData.latitude = mapInfo.lat;
                    this.formData.signRule.signLocation = mapInfo.address;
                    this.formData.signRule.longitude = mapInfo.lng;
                    this.formData.signRule.latitude = mapInfo.lat;
                    this.isShowMap = false;
                },
                handleLiveTab(index) {
                    if (index === 0) {
                        this.activeliveTab = index;
                        this.formData.isThird = 1;
                        this.formData.liveInfo.canInteract = '0';
                        this.formData.liveInfo.canReplay = '0';
                        this.formData.liveInfo.liveEndTime = '';
                        this.formData.liveInfo.liveStartTime = '';
                    } else {
                        var vm = this;
                        //判断当前用户是否有创建直播的权限
                        activityApi.liveAuth({code: '01'}).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.formData.isThird = 0;
                                vm.activeliveTab = index;
                                vm.formData.thirdUrl = ''
                            } else {
                                vm.$dialog.showToast(res.desc);
                            }
                        });
                    }
                }
            }
        });
    });
})
;
