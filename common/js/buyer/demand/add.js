// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpDemandApi', 'httpCom', 'jqValidate', 'httpLogin'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpDemandApi, httpCom, jqValidate, httpLogin) {
        Vue.component('vue-ueditor-wrap', VueUeditorWrap)
        window.vueDom = new Vue({
            el: '#index_box',
            mixins: [userCenter],
            data: {
                http: httpUser,
                httpCom: httpCom,
                jquery: $,
                fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
                uploadData: {
                    system: 'ts'
                },
                ueditorConfig: {
                    initialFrameHeight: 240,
                    maximumWords: 5000
                },
                word: '',
                address: [],
                options: {
                    cooperation_mode: [],
                    demand_case: [],
                    demand_type: [],
                    demand_stage: []
                },
                isSubmitDisabled: false,
                dataForm: {
                    title: '',	// 需求标题	是	[string]		查看
                    demandType: '',	//	需求类型 (字典表：demand_type)	是	[string]		查看
                    keyWord: [],	//	关键词	是	[string]		查看
                    country: '',	//	面向地区_国家 (字典表: administrative_division)	是	[string]		查看
                    province: '',	//	面向地区_省份 (字典表: administrative_division)	是	[string]		查看
                    city: '',	//	面向地区_城市 (字典表: administrative_division)	是	[string]		查看
                    district: '',	//	面向地区_区县 (字典表: administrative_division)	是	[string]		查看
                    budget: '',	//	预算	是	[object]
                    endDate: '',	//	截至日期	是	[string]		查看
                    contacts: '',	//	联系人	是	[string]		查看
                    phone: '',	//	联系电话	是	[string]		查看
                    stage: '',	//	需求所处阶段 (字典表：demand_stage)	是	[string]		查看
                    demandCase: '',	//	需求缘由 (字典表：demand_case)	是	[string]		查看
                    cooperationMode: '',	//	意向合作方式 (字典表：cooperation_mode)	是	[string]		查看
                    profession: '',	//	人才职业描述	是	[string]		查看
                    comment: '',	//	需求描述	是	[string]		查看
                    requirement: '',	//	投标要求	是	[string]		查看
                    industryList: [],	//	行业范围	是	[array]
                    quotaList: [],	//	指标	是	[array]
                    fileList: [],	//	附件	是	[array]
                    intermediateDate: '' // 中验日期
                },
                isNegotiation: false
            },
            watch: {
                'dataForm.demandType': function (o, n) {
                    if (o === '01') {
                        this.dataForm.profession = ''
                    } else if (o === '03') {
                        this.dataForm.stage = ''
                        this.dataForm.demandCase = ''
                        this.dataForm.cooperationMode = ''
                    } else {
                        this.dataForm.profession = ''
                        this.dataForm.stage = ''
                        this.dataForm.demandCase = ''
                        this.dataForm.cooperationMode = ''
                    }
                },
                'dataForm.profession': function (o, n) {
                    o && this.clearMsg('profession')
                },
                'dataForm.comment': function (o, n) {
                    o && this.clearMsg('comment')
                },
                'dataForm.requirement': function (o, n) {
                    o && this.clearMsg('requirement')
                }
            },
            mounted: function () {
                var now = new Date()
                laydate.render({
                    elem: '#endDate',
                    value: this.dataForm.endDate,
                    format: 'yyyy-MM-dd',
                    startkey: 'endDate',
                    min: '' + now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate(),
                    vm: this,
                    done: function (value, date, endDate) { //选择日期完毕的回调
                        this.vm.dataForm[this.startkey] = value;
                    }
                }),
                    laydate.render({
                        elem: '#intermediateDate',
                        value: this.dataForm.intermediateDate,
                        format: 'yyyy-MM-dd',
                        startkey: 'intermediateDate',
                        min: '' + now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate(),
                        vm: this,
                        done: function (value, date, endDate) { //选择日期完毕的回调
                            this.vm.dataForm[this.startkey] = value;
                        }
                    })
            },
            components: {
                'ly-toper': httpVueLoader('/style/components/toper.vue'),
                'header-bar': httpVueLoader('/common/components/header.vue'),
                'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
                'ly-address-select': httpVueLoader('/common/seller/components/technology/addressSelect1.vue'),
                'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
                'ly-upload': httpVueLoader('/common/components/upload.vue'),
                'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
            },
            created: function () {
                this.getOptions([
                    {"code": "cooperation_mode"},
                    {"code": "demand_case"},
                    {"code": "demand_type"},
                    {"code": "demand_stage"}
                ])
                var id = this.$utils.getReqStr('id')
                id && this.getInitDemand(id)
            },
            methods: {
                // 获取多个标准码
                getOptions: function (keys) {
                    var vm = this
                    httpCom.dictList({dictInfos: keys}).then(function (res) {
                        if (res.code === 'rest.success') {
                            res.result.forEach(function (codes) {
                                vm.options[codes.code] = codes.dictIInfos
                            })
                        }
                    })
                },
                getInitDemand: function (id) {
                    var vm = this
                    httpDemandApi.initDemand({id: id}).then(function (res) {
                        if (res.code === 'rest.success') {
                            res.result.keyWord ? (res.result.keyWord = res.result.keyWord.split(',')) : (res.result.keyWord = [])
                            var address = [res.result.country, res.result.province, res.result.city || '', res.result.district || '']
                            !res.result.quotaList && (res.result.quotaList = [])
                            !res.result.fileList && (res.result.fileList = [])
                            !res.result.endDate && (res.result.endDate = '')
                            vm.initStatus = res.result.certificationFlagDisplay
                            vm.$data.dataForm = res.result
                            vm.$nextTick(function () {
                                vm.$refs.addressRef.setValues(address);
                            })
                        }
                    })
                },
                //****************************数据校验****************************** */
                customdemandType: function (v, o, callback) {
                    if (this.dataForm.demandType.length == 0) {
                        callback(o, '需求类型不能为空')
                    } else {
                        callback(o)
                    }
                },
                customindustryList: function (v, o, callback) {
                    if (this.dataForm.industryList.length == 0) {
                        callback(o, '所属行业不能为空')
                    } else {
                        callback(o)
                    }
                },
                customarea: function (v, o, callback, e) {
                    v = this.getAddressArr()
                    var index = e && $(e.target).parent().index()
                    if (index !== undefined && index > 1) {
                        callback(o)
                    } else {
                        var vText = $.map($('.iptbox .expslt'), function (sel) {
                            return $(sel).find("option:selected").text()
                        })
                        if (v.filter(function (i) {
                            return i
                        }).length >= 2) {
                            callback(o)
                        } else {
                            callback(o, '面向地区必选')
                        }
                    }
                },
                customendDate: function (v, o, callback) {
                    if (this.dataForm.endDate.length == 0) {
                        callback(o, '截止日期不能为空')
                    } else {
                        callback(o)
                    }
                },
                customintermediateDate: function (v, o, callback) {
                    if (this.dataForm.intermediateDate.length == 0) {
                        callback(o, '中验日期不能为空')
                    } else {
                        callback(o)
                    }
                },
                customstage: function (v, o, callback) {
                    if (this.dataForm.demandType === '01' && !v) {
                        callback(o, '需求所处阶段不能为空')
                    } else {
                        callback(o)
                    }
                },
                customprofession: function (v, o, callback) {
                    if (this.dataForm.demandType === '03' && this.dataForm.profession.length == 0) {
                        callback(o, '人才职业描述不能为空')
                    } else {
                        callback(o)
                    }
                },
                customcomment: function (v, o, callback) {
                    if (this.dataForm.comment.length == 0) {
                        callback(o, '需求描述不能为空')
                    } else {
                        callback(o)
                    }
                },
                customrequirement: function (v, o, callback) {
                    if (this.dataForm.requirement.length == 0) {
                        callback(o, '对投标方的要求不能为空')
                    } else {
                        callback(o)
                    }
                },
                getAddressArr: function () {
                    return this.$refs.addressRef.getSelected();
                },
                // 提交数据处理
                getData: function () {
                    var addressArr = this.getAddressArr()
                    return JSON.parse(JSON.stringify(this.dataForm, function (k, v) {
                        switch (k) {
                            // 关键字
                            case 'keyWord':
                                v = v.join(',')
                                break;
                            case 'country':
                                v = addressArr[0]
                                break;
                            case 'province':
                                v = addressArr[1]
                                break;
                            case 'city':
                                v = addressArr[2]
                                break;
                            case 'district':
                                v = addressArr[3]
                                break;
                        }
                        return v
                    }))
                },
                clearMsg: function (code) {
                    this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
                },
                postDemand: function (data) {
                    var vm = this
                    if (!data.id) {
                        httpDemandApi.insertDemand(data).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.viewSuccessInfo(res.result)
                            }
                        })
                    } else {
                        httpDemandApi.updateDemand(data).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.viewSuccessInfo(res.result)
                            }
                        })
                    }
                },
                viewSuccessInfo: function (data) {
                    var vm = this
                    var options = {
                        texts: '<div class="form-view_examine"><h2><i class="iconfont icon-gou"></i>您的需求已提交，请静待管理员审核</h2><h2>审核时间为1-2个工作日</h2><h3>如有问题，请联系平台在线服务人员</h3><h2>您的<em>&nbsp;招标&nbsp;</em>需求已于' + data.publicDate + '成功发布</h2></div><div class="form-view_type centered">需求编号：' + data.id + ' 截止日期为：' + data.endDate + '</div>',
                        btnBoxClass: 'cover-box_button',
                        buttons: [
                            {
                                label: '返回网站首页',
                                class: 'back-blue',
                                fun: function () {
                                    vm.$utils.openNewTable('/', '_self')
                                    return 1
                                }
                            },
                            {
                                label: '继续发布需求',
                                class: 'continue-red',
                                fun: function () {
                                    vm.setinitData()
                                    return 1
                                }
                            },
                            {
                                label: '查看我已发布的需求',
                                class: 'see-yellow',
                                fun: function () {
                                    vm.$utils.openNewTable('/common/buyer/demand/list.html?code=001.001.002.002', '_self')
                                    return 1
                                }
                            }
                        ]
                    }
                    this.$dialog.confirm2(options)
                },
                setinitData: function () {
                    var vm = this
                    this.dataForm = {
                        title: '',	// 需求标题	是	[string]		查看
                        demandType: '',	//	需求类型 (字典表：demand_type)	是	[string]		查看
                        keyWord: [],	//	关键词	是	[string]		查看
                        country: '',	//	面向地区_国家 (字典表: administrative_division)	是	[string]		查看
                        province: '',	//	面向地区_省份 (字典表: administrative_division)	是	[string]		查看
                        city: '',	//	面向地区_城市 (字典表: administrative_division)	是	[string]		查看
                        district: '',	//	面向地区_区县 (字典表: administrative_division)	是	[string]		查看
                        budget: '',	//	预算	是	[object]
                        endDate: '',	//	截至日期	是	[string]		查看
                        contacts: '',	//	联系人	是	[string]		查看
                        phone: '',	//	联系电话	是	[string]		查看
                        stage: '',	//	需求所处阶段 (字典表：demand_stage)	是	[string]		查看
                        demandCase: '',	//	需求缘由 (字典表：demand_case)	是	[string]		查看
                        cooperationMode: '',	//	意向合作方式 (字典表：cooperation_mode)	是	[string]		查看
                        profession: '',	//	人才职业描述	是	[string]		查看
                        comment: '',	//	需求描述	是	[string]		查看
                        requirement: '',	//	投标要求	是	[string]		查看
                        industryList: [],	//	行业范围	是	[array]
                        quotaList: [],	//	指标	是	[array]
                        fileList: []	//	附件	是	[array]
                    }
                    this.word = ''
                    this.isSubmitDisabled = false
                    this.$nextTick(function () {
                        vm.$refs.addressRef.reSet();
                        window.scrollTo(0, 0)
                    })
                },
                createdVerify: function () {
                    var vm = this
                    var data = this.getData()
                    var infos = this.createdInfos(data)
                    var options = {
                        class: 'full',
                        title: '确认发布',
                        texts: infos,
                        buttons: [
                            {
                                label: '上一步',
                                fun: function () {
                                    vm.isSubmitDisabled = false
                                    return true;
                                }
                            },
                            {
                                label: '确认发布',
                                fun: function () {
                                    var v = $('#protocol').is(':checked')
                                    if (v) {
                                        $('#protocolView').off()
                                        vm.postDemand(data)
                                    } else {
                                        vm.$dialog.showToast('请选择阅读协议')
                                    }
                                    return v
                                }
                            }
                        ]
                    }
                    this.$dialog.confirm2(options)
                    // $('#protocolView').on('click', function () {
                    //   vm.$httpCom.protocol({
                    //     protocolType: 6
                    //   }).then(function (res) {
                    //     if (res.result) {
                    //       var options = {
                    //         class: 'full',
                    //         title: '需求发布规则',
                    //         texts: res.result.protocolContact,
                    //         buttons: [
                    //           {
                    //             label: '确认阅读'
                    //           }
                    //         ]
                    //       }
                    //       vm.$dialog.confirm2(options)
                    //     }
                    //   })
                    // })
                },
                createdInfos: function (data) {
                    var html = '<table class="table demand-table_view"><tbody>'
                    html += '<tr><th>需求标题：</th><td>' + data.title + '</td></tr>'
                    html += '<tr><th>所属行业：</th><td><div class="spans">' + data.industryList.map(function (i) {
                        return '<span>' + i.name + '</span>'
                    }).join('') + '</div></td></tr>'
                    html += '<tr><th>需求类型：</th><td>' + $('.inputradio input:checked').next().text() + '</td></tr>'
                    data.keyWord && (html += '<tr><th>标签：</th><td><div class="spans">' + this.dataForm.keyWord.map(function (i) {
                        return '<span>' + i + '</span>'
                    }).join('') + '</div></td></tr>')
                    html += '<tr><th>面向地区：</th><td>' + ($.map($('.iptbox .expslt'), function (sel) {
                        return $(sel).find("option:selected").text()
                    }).join(' ')) + '</td></tr>'
                    html += '<tr><th>需求预算（元）：</th><td>' + data.budget + '</td></tr>'
                    data.endDate && (html += '<tr><th>截止日期：</th><td>' + data.endDate + '</td></tr>')
                    html += '<tr><th>联系人：</th><td>' + data.contacts + '</td></tr>'
                    html += '<tr><th>联系电话：</th><td>' + data.phone + '</td></tr>'
                    data.stage && (html += '<tr><th>需求所处阶段：</th><td>' + $('#stage').find("option:selected").text() + '</td></tr>')
                    data.demandCase && (html += '<tr><th>需求缘由：</th><td>' + $('#demandCase').find("option:selected").text() + '</td></tr>')
                    data.cooperationMode && (html += '<tr><th>意向合作方式：</th><td>' + $('#cooperationMode').find("option:selected").text() + '</td></tr>')
                    data.profession && (html += '<tr><th>人才职业描述：</th><td><div class="tabview">' + data.profession + '</div></td></tr>')
                    html += '<tr><th>需求描述：</th><td class="article"><div class="tabview">' + data.comment + '</div></td></tr>'
                    html += '<tr><th>对投标方的要求：</th><td class="article"><div class="tabview">' + data.requirement + '</div></td></tr>'
                    data.quotaList.length && (html += '<tr><th style="font-weight: 700">投标指标（自定义）：</th><td></td></tr>' + data.quotaList.map(function (i) {
                        return '<tr><th>' + i.quotaName + '：</th><td>' + i.quotaComment + '</td></tr>'
                    }).join(''))
                    data.fileList.length && (html += '<tr><th>需求附件：</th><td><ul>' + data.fileList.map(function (i) {
                        return '<li>' + i.name + '</li>'
                    }).join('') + '</ul></td></tr>')

                    html += '</tbody></table>'
                    html += '<div class="form-view_rule"><label for="protocol"><input id="protocol" type="checkbox"><span>我已阅读并同意<a id="protocolView">《需求发布规则》</a></span></label></div>'
                    return html
                },
                clearMsg: function (code) {
                    this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
                },
                handleIndustryInput: function (v) {
                    v.length && this.clearMsg('industry')
                },
                handleNextStep: function () {
                    var vm = this
                    vm.isSubmitDisabled = true
                    $('.dataform').validate('submitValidate', function (val) {
                        if (val) {
                            vm.createdVerify()
                        } else {
                            vm.$dialog.showToast('请完善表单信息！')
                            vm.isSubmitDisabled = false
                        }
                    })
                },
                handleDeleteQuota: function (i) {
                    var list = this.dataForm.quotaList
                    list.splice(i, 1)
                    this.$set(this.dataForm, 'quotaList', list)
                },
                handleAddQuota: function () {
                    var list = this.dataForm.quotaList
                    list.push(
                        {
                            quotaName: '',	//	指标名称	是	[string]		查看
                            quotaComment: '',	//	指标说明	是	[string]		查看
                        }
                    )
                    this.$set(this.dataForm, 'quotaList', list)
                },
                handleUploadSuccess: function (successInfo) {
                    this.dataForm.fileList.push(successInfo.data)
                },
                handleDelFile: function (i) {
                    this.dataForm.fileList.splice(i, 1)
                },
                handleAddTag: function () {
                    if (this.word) {
                        this.dataForm.keyWord.push(this.word)
                        this.word = ''
                    }
                },
                handleDelTag: function (i) {
                    this.dataForm.keyWord.splice(i, 1)
                },
                handleSetNegotiation: function () {
                    if (this.isNegotiation) {
                        this.isNegotiation = false;
                    }else {
                      this.isNegotiation = true;
                    }
                },
            }
        });
    });
});
