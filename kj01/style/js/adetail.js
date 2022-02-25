// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/aindex.js','/common/js/libs/jquery.SuperSlide.2.1.3.js', 'fileSaver', 'httpUrl'],
        function ($, dic, Vue, httpVueLoader, indexApi,slide, fileSaver, httpUrl) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    breadcrumb: [
                        // {
                        //     url: '/aindex.html',
                        //     label: '活动'
                        // },
                        {
                            url: '/alist.html',
                            label: '活动列表'
                        },
                        {
                            label: '详情'
                        }
                    ],
                    detail: '',
                    qrcodeUrl: '',
                    recommendList: [],
                    evaluateList: [],
                    maxEvaluateViewLength: 2,
                    evaluateLength: 0,
                    calendar: {
                        days: [],
                        month: 0,
                        year: 0
                    },
                    dataList: [],
                    searchForm: {
                        activeType: "218340665862395559",
                        activeTypeDisplay: "易智大咖荟",
                        pageNum: 1,
                        pageSize: 8,
                        sortType: "01"
                    },
                    dataUrl:'',
                    activeNowTime: '',
                    selectIndex: 0,
                    dayResultList: [],
                    // comList:[],
                    isEvaluateFlag: false
                },
                filters: {
                    formatTime: function (v) {
                        return v ? v.split(' ')[0] : ''
                    },
                    formatTime1: function (v) {
                        var t;
                        if (v) {
                            t = new Date(v);
                            v = v.substr(0, 16) + [' 周日', ' 周一', ' 周二', ' 周三', ' 周四', ' 周五', ' 周六'][t.getDay()]
                        }
                        return v || '';
                    },
                    formatNumber: function (v) {
                        return Number(v).toFixed(1);
                    },
                    formatCity: function (v, c) {
                        return c && v ? v + '·' + c : v ? v : ''
                    },
                    formatItemDisplay: function (v) {
                        return v ? v.substr(2) : '';
                    }
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/newtoper.vue'),
                    'sub-head': httpVueLoader('/style/components/asub_head.vue'),
                    'evaluate': httpVueLoader('/style/components/evaluate.vue'),
                    'aside-today': httpVueLoader('/style/components/asideToday.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },
                created: function () {
                    this.initData()
                    this.dataUrl = this.$utils.getReqStr('act')
                   console.log(this.dataUrl,'000')
                },
                methods: {
                    initData: function () {
                        let d = new Date()
                        let dy = d.getFullYear()
                        let dm = d.getMonth()
                        let dd = d.getDate()
                        this.saasId = localStorage.getItem('saasId');
                        var id = this.$utils.getReqStr('id')
                        var aUrl=window.location.href
                        var str = aUrl.split("/").pop().replace(/(^active)|(\.\S+$)/g,"");
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
                        this.calendar = {
                            days: [],
                            day: dd,
                            week: d.getDay(),
                            month: dm,
                            initMonth: dm,
                            initYear: dy,
                            year: dy
                        }
                        this.activeNowTime = [dy, dm + 1, dd].map(this.formatNumber).join('/')
                        if(id){
                            id && this.getDetailInfo(id) && this.getRecommendById(id) && this.getEvaluateById(id) && this.createDays();
                        }
                        if(!id){
                            str && this.getDetailInfo(str) && this.getRecommendById(str) && this.getEvaluateById(str) && this.createDays();
                        }
                        this.qrcodeUrl = httpUrl.baseUrl + '/active/getWxacode?id=' + id;
                        this.getNewList();
                    },
                    getDetailInfo: function (id) {
                        var vm = this;
                        indexApi.selectIssueDetail({id: id || this.detail.id}).then(function (res) {

                            res.result.styles = {
                                backgroundImage: 'url(' + res.result.posterUrl + ')'
                            }
                            res.result.isCollection = res.result.isCollection || 0
                            res.result.sponsor = res.result.sponsor.split('ぶんかつ');
                            if (res.result.files) {
                                res.result.files.forEach(function (item) {
                                    item.flieType = item.name.substring(item.name.lastIndexOf(".") + 1)
                                    item.flieType = dic.imgs.indexOf(item.flieType) !== -1 ? 'tupian' : item.flieType
                                    item.flieType = dic.zips.indexOf(item.flieType) !== -1 ? 'yasuobao' : item.flieType
                                    item.flieType = dic.doc.indexOf(item.flieType) !== -1 ? 'word' : item.flieType
                                    item.flieType = dic.excel.indexOf(item.flieType) !== -1 ? 'excel' : item.flieType
                                    item.flieType = dic.ppt.indexOf(item.flieType) !== -1 ? 'ppt' : item.flieType
                                })
                            }
                            if (res.result.cooperation.length) {
                                let cooperations = res.result.cooperation
                                let group = []
                                cooperations.forEach((cooperation) => {
                                    if (group.indexOf(cooperation.cooperationType) === -1) {
                                        group.push(cooperation.cooperationType)
                                    }
                                })
                                cooperations = group.map((type) => {
                                    return cooperations.filter((cooperation) => {
                                        return cooperation.cooperationType === type
                                    })
                                })
                                res.result.cooperation = cooperations;

                            }
                            if (res.result.joinUser.length) {
                                res.result.joinUser.forEach(function (item) {
                                    item.styles = {
                                        backgroundImage: 'url(' + item.header + ')'
                                    }
                                    item.itemImg = item.header
                                });
                            }
                            res.result.evaluateResult = res.result.averageResult && res.result.averageResult[0] && res.result.averageResult[0].evaluateResult || 0
                            vm.detail = res.result ? res.result : {}
                            if (vm.detail.isIgnoreEndTime === 1 && vm.detail.statusCode === '0304' && vm.detail.isJoinActive !== 1) {
                                //如果已结束且活动可无视报名时间,则修改
                                vm.detail.statusCode = '0302'
                                vm.detail.statusDisplay = '立即报名'
                            }

                            res.result.longitude && vm.$nextTick(function () {
                                this.initMap()
                            });
                        })
                        return 1;
                    },
                    getNewList(){
                        var vm=this
                        indexApi.selectIssuePage(this.searchForm).then(function (res) {
                            res.result && res.result.list.forEach(function (item) {
                                item.itemUrl = '/adetail.html?id=' + item.id
                                item.styles = {
                                    backgroundImage: 'url(' + item.posterUrl + ')'
                                }
                                item.sponsor = item.sponsor ? item.sponsor.split('ぶんかつ')[0] : ''
                                if (Array.isArray(item.activeTypeDisplay) && item.activeTypeDisplay.length) {
                                    item.activeTypeDisplay = item.activeTypeDisplay[0].name
                                } else {
                                    item.activeTypeDisplay = ''
                                }
                                item.itemImg = item.posterUrl
                            });
                            vm.dataList = res.result ? res.result.list : []
                            vm.$nextTick(() => {
                                $(".slideTxtBox").slide({
                                    titCell:".hd ul",
                                    mainCell: ".bd ul",
                                    autoPlay:false,
                                    effect: "topLoop",
                                    scroll:1,
                                    pnLoop:true,
                                    vis: 3,
                                });
                            })
                        })
                    },
                    getRecommendById: function (id) {
                        var vm = this
                        indexApi.getRecommendActiveById({id: id}).then(function (res) {
                            res.result && res.result.forEach(function (item) {
                                item.itemUrl = '/adetail.html?id=' + item.id
                                item.styles = {
                                    backgroundImage: 'url(' + item.posterUrl + ')'
                                }
                                item.itemImg = item.posterUrl
                            });
                            vm.$data.recommendList = res.result || []
                        })
                        return 1;
                    },
                    getEvaluateById: function (id, page) {
                        var vm = this
                        page = page || 1;
                        indexApi.getActiveEvaluateListByPage({
                            id: id || this.detail.id,
                            pageNum: 1,
                            pageSize: 10000
                        }).then(function (res) {
                            res.result && res.result.list.forEach(function (item) {
                                item.styles = {
                                    backgroundImage: 'url(' + item.headUrl + ')'
                                }
                                item.itemImg = item.headUrl
                            });
                            vm.$data.evaluateLength = res.result.list.length
                            vm.$data.evaluateList = res.result.list || []
                        })
                        return 1;
                    },
                    getAttributeData: function (el, keys) {
                        var dataset = {}
                        if (el.dataset) {
                            dataset = el.dataset
                        } else {
                            keys.forEach(function (tkey) {
                                dataset[tkey] = el.getAttribute('data-' + tkey);
                            })
                        }
                        return dataset
                    },
                    getselectIssueMonth: function () {
                        var vm = this
                        indexApi.selectIssueMonth({
                            year: vm.calendar.year,
                            month: vm.calendar.month + 1
                        }).then(function (res) {
                            var month = vm.calendar.month
                            var initMonth = vm.calendar.initMonth
                            var initYear = vm.calendar.initYear
                            var year = vm.calendar.year
                            var day = vm.calendar.day
                            var d = new Date(`${year}/${month + 1}/1 11:00:00`)
                            var week = d.getDay()
                            var tempLength = week + vm.isMonthDays(year, month)
                            var prevLength = month === 0 ? vm.isMonthDays(year - 1, 11) : vm.isMonthDays(year, month - 1);
                            var temp = []
                            var setI = 0;
                            var selectIndex = 0
                            var value = 1
                            var tl = tempLength % 7;
                            var rl = res.result.length
                            tl && (tl = 7 - tl);
                            tempLength += tl;
                            while (tempLength > 0) {
                                tempLength--;
                                temp[tempLength] = 0;
                            }
                            tl = 1;
                            vm.$data.calendar.days = temp.map((item, i) => {
                                var ri = i - week
                                if (week > i) {
                                    return {
                                        activeNum: 0,
                                        click: 0,
                                        label: 0 // prevLength - week + i + 1
                                    }
                                } else if (week <= i && ri < rl) {
                                    var item = res.result[ri]
                                    var label = item.day
                                    !setI && (selectIndex = i, setI = 1);
                                    year == initYear && month === initMonth && label === day && (selectIndex = i, value = label);
                                    return {
                                        label: label,
                                        click: 1,
                                        activeNum: item.activeNum,
                                        isSelect: year == initYear && month === initMonth && label === day
                                    }
                                } else {
                                    return {
                                        activeNum: 0,
                                        click: 0,
                                        label: 0 // tl++
                                    }
                                }
                            });
                            vm.selectIndex = selectIndex
                            vm.handleSetDay({
                                currentTarget: {
                                    dataset: {
                                        index: selectIndex,
                                        click: 1,
                                        value: value
                                    }
                                }
                            })
                        })
                        return 1;
                    },
                    getselectIssueToday: function () {
                        var vm = this
                        indexApi.selectIssueToday({
                            pageNum: 1,
                            pageSize: 100,
                            activeNowTime: this.activeNowTime
                        }).then(function (res) {
                            res.result && res.result.list.forEach(function (item) {
                                item.itemUrl = '/adetail.html?id=' + item.id
                            });
                            vm.$data.dayResultList = res.result.list || []

                            // console.log(vm.detail.cooperation[0][0])
                            //   if(vm.detail.cooperation[0][0].cooperationTypeDisplay==='指导单位'){
                            //       vm.comList = vm.comList.splice(1,0,vm.$data.dayResultList)
                            //   }else {
                            //       vm.comList = vm.comList.unshift(vm.$data.dayResultList)
                            //   }


                        })
                        return 1;
                    },
                    createDays() {
                        this.getselectIssueMonth()
                        return 1;
                    },
                    isMonthDays(y, m) {
                        let tm = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                        let ms = tm[m]
                        !ms && (ms = y % 4 === 0 && y % 100 !== 0 || y % 400 === 0 ? 29 : 28);
                        return ms
                    },
                    formatNumber(n) {
                        n = n.toString()
                        return n[1] ? n : '0' + n
                    },
                    initMap: function () {
                        var vm = this;
                        this.map = new BMap.Map("activityMap");
                        // 设置中心点
                        var point = new BMap.Point(this.detail.longitude, this.detail.latitude);
                        this.map.centerAndZoom(point, 20);
                        this.marker = new BMap.Marker(point);           // 创建标注
                        this.map.addOverlay(this.marker);
                    },
                    handlePrevMonth() {
                        var month = this.calendar.month
                        var year = this.calendar.year
                        if (month > 0) {
                            this.calendar.month--
                        } else if (year > 1970) {
                            this.calendar.month = 11
                            this.calendar.year--
                        }
                        this.createDays()
                    },
                    handleNextMonth() {
                        var month = this.calendar.month
                        var year = this.calendar.year
                        if (month < 11) {
                            this.calendar.month++
                        } else if (year < 2040) {
                            this.calendar.month = 0
                            this.calendar.year++
                        }
                        this.createDays()
                    },
                    handleSetDay(e) {
                        var month = this.calendar.month
                        var year = this.calendar.year
                        var vals = this.getAttributeData(e.currentTarget, ['value', 'index', 'click']);
                        var click = parseInt(vals.click)
                        click && (
                            this.activeNowTime = [year, month + 1, vals.value].map(this.formatNumber).join('-'),
                                this.selectIndex = parseInt(vals.index),
                                this.getselectIssueToday()
                        );
                    },
                    handleShareToWeixin: function () {
                        var vm = this;
                        var options = {
                            title: '二维码',
                            width: '400px',
                            texts: '<div style="text-align: center;padding: 10px;"><img src="' + this.qrcodeUrl + '" alt="" srcset=""></div>',
                            buttons: []
                        };
                        vm.$dialog.confirm2(options)
                        // indexApi.getPolicyQRCodeById({id: this.detail.id}).then(function (res) {
                        //   console.log(res)

                        // })
                    },
                    handleShareToQQ: function () {
                        var url = "https://connect.qq.com/widget/shareqq/index.html";
                        var title = '精品政策-易智网';
                        var summary = this.detail.title;
                        var desc = this.detail.title;
                        var fullUrl = [url, '?url=', encodeURIComponent(document.location.href), '&title=', title, '&summary=', summary, '&desc=', desc].join('');
                        window.open(fullUrl)
                    },
                    handleFileSaveAs: function (i) {
                        var fileInfo = this.detail.files[i]
                        saveAs(httpUrl.imgUploadUrl + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
                    },
                    handleEvaluateMore: function () {
                        this.maxEvaluateViewLength = this.maxEvaluateViewLength > 2 ? 2 : this.evaluateLength;
                    },
                    handleStateClick: function () {
                        //liveFlag:1,为直播活动
                        if (this.detail.onLineFlag === '1' && this.detail.liveFlag.toString() === '1' && this.detail.isThird.toString() === '1' && this.detail.pullStreamUrl) {
                            //第三方直播
                            this.$utils.openNewTable(this.detail.pullStreamUrl)
                        } else {
                            if (this.userInfo && this.userInfo.userName) {
                                if (this.detail.statusCode === "0302") {
                                    window.location.href = '/moreSignup.html?id=' + this.detail.id
                                } else {
                                    if (this.detail.pullStreamUrl) {
                                        //易智网直播
                                        if (this.detail.isJoinActive === 1) {
                                            window.location.href = '/activityLive.html?id=' + this.detail.id
                                        } else {
                                            this.$dialog.showToast("您没有报名该活动，不可观看直播！")
                                        }
                                    }
                                    if(this.dataUrl!==null){
                                        window.location.href = '/infrom.html?id=' + this.dataUrl;
                                    }
                                }

                            } else {
                                window.location.href = '/common/login.html';
                            }
                        }

                    },

                    //委托举办活动信息收集
                    handleEntrust: function (){
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html?return=/entrustInfo.html";
                        } else {
                            window.location.href = "/entrustInfo.html";
                        }
                    },

                    handleColSelected: function () {
                        if (this.detail.isCollection) {
                            this.collectionCancel();
                        } else {
                            this.colSelected();
                        }
                    },
                    colSelected: function () {
                        var vm = this;
                        indexApi.selected({
                            storeId: this.detail.id,
                            type: '05'
                        }).then(function (res) {
                            if (res.code == 'rest.success') {
                                vm.detail.isCollection = 1;
                                vm.detail.collectionNum++
                                vm.$dialog.showToast("收藏成功")
                            }
                        })
                    },
                    collectionCancel: function () {
                        var vm = this;
                        indexApi.cancel({
                            goodsId: this.detail.id
                        }).then(function (res) {
                            if (res.code == 'rest.success') {
                                vm.detail.isCollection = 0;
                                vm.detail.collectionNum > 0 && (vm.detail.collectionNum--);
                                vm.$dialog.showToast("取消成功")
                            }
                        })
                    },
                    handleToggleEvaluate: function () {
                        if (this.userInfo && this.userInfo.userName) {
                            if (this.detail.isJoinActive) {
                                this.isEvaluateFlag = true;
                            } else {
                                this.$dialog.showToast('您还没有参与活动，请先参与！')
                            }
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    bindEvaluateSubmit: function (e) {
                        var vm = this;
                        indexApi.activeEvaluate({
                            anonymityFlag: this.userInfo.userName ? 1 : 0,
                            oid: this.detail.id,
                            results: e
                        }).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.detail.allowActiveEvaluate = 0
                                vm.detail.isEvaluate = 1
                                vm.$dialog.showToast("打分成功")
                            }
                            vm.isEvaluateFlag = false;
                            vm.getEvaluateById();
                            vm.getDetailInfo()
                        })
                    },
                    bindEvaluateToggle: function (e) {
                        this.isEvaluateFlag = e
                    },
                    handleToUrl: function () {
                        this.$dialog.showToast('敬请期待')
                    }
                }
            });
        })
});
