require(['/common/js/require.config.js'], function () {
  require([
    'jquery',
    'dic',
    'vue',
    'httpVueLoader',
    '/style/js/api/technologyMarket.js',
    'httpUrl',
    '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
    function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll, toast) {
      new Vue({
        el: '#index_box',
        data: {
          dataList: [],//列表
          'total': 0, //总条数
          // 'currentPage': 1,//当前页
          // 'pageSize': 8,//每页显示条数
          conditionsList: {
            'projectSource': {
              name: '成果来源',
              id: 'projectSource',
              dictCodes: [
                { 'display': '全部', dictValue: '' },
                { 'display': '未委托经纪人', dictValue: '0' },
                { 'display': '已委托经纪人', dictValue: '1' },
                { 'display': '已委托多个经纪人', dictValue: '2' }],
              index: 0
            },
            'industryType': {
              name: '行业领域',
              queryTag: true,
              level: 2,
              id: 'projectIndustryType',
              dictCodes: [{ 'name': '全部', dictValue: '' }],
              index: 0,
            },
            'achievement_maturity': {
              name: '成熟度',
              id: 'achievementMaturity',
              dictCodes: [{ 'display': '全部', dictValue: '' }],
              index: 0,
            },

            'achievement_belong': {
              name: '权属性质',
              id: 'achievementBelong',
              dictCodes: [{ 'display': '全部' }],
              index: 0,
            },
            'achievement_cooperation': {
              name: '合作方式',
              id: 'cooperationMode',
              dictCodes: [{ 'display': '全部' }],
              index: 0,
            },
            'price_range': {
              name: '意向价格',
              id: 'budget_sectionQuery',
              dictCodes: [{ 'display': '全部' }],
              index: 0,
            },
            'business_plan': {
              name: '商业计划书',
              id: 'businessPlanProportion',
              dictCodes: [{ 'display': '全部' }],
              index: 0,
            },
          },
          sortActive: 0,
          sortList: [
            { id: 'create_time', name: '发布时间' },
            { id: 'read_count', name: '人气' },
          ],
          queryModel: {
            'pageParam': {
              'current': 1,
              'size': 8,
              'order': 'desc',
              'sort': 'id',
            },
            'payload': {
              projectSource: null,
              projectIndustryType: null,
              achievementMaturity: null,
              achievementBelong: null,
              cooperationMode: null,
              budget_sectionQuery: null,
              businessPlanProportion: null,
            },
          },
          "IndustryTypeChildren": [],
          "industrySecondShow": false,
          search:''
        },
        components: {
          //插入头信息
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          //插入市场
          'tech_market_header': httpVueLoader(
            '/style/components/tech_market_header.vue'),

          //插入脚信息
          'web-footer': httpVueLoader('/style/components/web_footer.vue'),
        },

        watch: {
          queryModel: {
            handler(n, o) {
              this.queryList();
            },
            deep: true,
          },
        },
        created: function () {
          // 技术成果列表查询
          this.initData();
          this.queryList();
          this.find_dictionary_type_list();
          this.find_tag_list();

        },
        methods: {

          initData: function () {
            let d = new Date();
            let dy = d.getFullYear();
            let dm = d.getMonth();
            let dd = d.getDate();
            this.saasId = localStorage.getItem('saasId');
            this.id = this.$utils.getReqStr('id');
            this.$utils.getCookie(dic.locaKey.USER_INFO) &&
              (this.userInfo = JSON.parse(
                localStorage.getItem(dic.locaKey.USER_INFO)));
          },

          Pricre: function (v) {

            if (typeof v !== 'undefined') {

              if (v >= 10000) {
                return (v / 10000).toFixed(2) + '万元';
              } else {
                return v + '元'
              }
            }

          },
          getImgPath(path) {
            return httpUrl.fileShowUrl + '/resource/' + path;
          },
          clickCondition(key, id, dictValue, index) {
            console.log(key, id, dictValue, index);
            this.conditionsList[key]['index'] = index;
            this.queryModel.payload[id] = dictValue;
          },
          orderClick(id, index) {
            console.log(id, index);
            this.sortActive = index;
            this.queryModel.pageParam.sort = id;
          },
          findData(val){
            this.queryModel.payload.title= val;
            this.queryList();
          },
          // 点击第二级
          clickConditionChild(key, id, dictValue, indexs) {
            var _this = this;
            console.log(key, id, dictValue, indexs);

            _this.IndustryTypeChildren.forEach((element, index) => {
              element.index = -1;
              if (indexs === index) {
                console.log(element)
                element.index = indexs;
              }
            });
            _this.queryModel.payload[id] = dictValue;
          },

          // 行业类型 显示第二级目录
          openProjectList(key, id, dictValue, index) {
            var _this = this;
            console.log(key, id, dictValue, index);
            _this.IndustryTypeChildren.forEach(element => {
              element.index = -1;
            })
            _this.conditionsList[key]['index'] = index;
            if (index == 0) {
              this.queryModel.payload[id] = dictValue;
              _this.industrySecondShow = false;

            } else {
              _this.industrySecondShow = true;
              _this.IndustryTypeChildren = _this.conditionsList[key].dictCodes[index].children;//第二级
            }

            console.log(_this.industrySecondShow)
          },

          release_project() {
            if (this.userInfo && this.userInfo.userName) {
              window.location.href = "/common/usercenter/user_market_tech_achievements.html";
            } else {
              toast.showToast("请先登录")
              setTimeout(function () {
                window.location.href = '/common/login.html';
              }, 2000)
            }
          },

          queryList() {
            let _this = this;
            indexApi.tech_achi_list(this.queryModel).then(function (res) {
              if (!res.code) {
                vm.$dialog.showToast(res.message);
                return;
              }
              let data = res.data;
              _this.dataList = data.records;
              _this.total = data.total;
            });
          },

          // 查询字典 并填充条件
          find_dictionary_type_list: function () {
            let _this = this;
            let codes = Object.keys(this.conditionsList);
            codes = codes.filter(key => !this.conditionsList[key].queryTag);
            // 技术成果列表查询
            indexApi.dictionary_type_list(codes).then(function (res) {
              console.log(res);
              if (!res.code) {
                vm.$dialog.showToast(res.message);
                return;
              }
              let data = res.data;
              let dictGroup = _this.arrayGroup(data);
              for (let dictKey of codes) {
                if (dictGroup[dictKey]) {
                  _this.conditionsList[dictKey]['dictCodes'].push(
                    ...dictGroup[dictKey]);
                }
              }
            },
            );
          },

          find_tag_list: function () {
            let _this = this;
            let codes = Object.keys(this.conditionsList);
            codes = codes.filter(key => this.conditionsList[key].queryTag);
            codes.forEach(code => {

              indexApi.query_tag_list(code).then(function (res) {
                console.log('查询' + code + '： ', res);
                if (!res.code) {
                  vm.$dialog.showToast(res.message);
                  return;
                }
                let data = res.data;
                // let arr = _this.getLevelTag(data, 1,
                //   _this.conditionsList[code].level);

                // let arr = _this.getLevelTag(data, 1,
                //   _this.conditionsList[code].level);
                console.log(data)
                data.forEach(d => {
                  d.children = d.children.map(item => {
                    return { 'display': item.name, dictValue: item.id, index: -1 };
                  });
                })
                _this.conditionsList[code]['dictCodes'] = [
                  ..._this.conditionsList[code]['dictCodes'],
                  ...data];
                console.log('11111111111111', _this.conditionsList[code]['dictCodes'])
              });

            });

          },

          getLevelTag(arr, index, level) {
            let result = [];
            if (index === level) {
              return arr;
            }
            arr.forEach(item => {
              if (item.children && item.children.length > 0) {
                if (index < level) {
                  let r = (this.getLevelTag(item.children, index + 1,
                    level));
                  result = [...result, ...r];
                }
              }
            });
            return result;
          },

          //数组变型得到新数组 JS数组根据字段进行分组
          arrayGroup(arr) {
            let obj = {};
            for (let item of arr) {
              if (!obj[item.dictCode]) {
                obj[item.dictCode] = [];
              }
              obj[item.dictCode].push(item);
            }
            return obj;
          },

        },
      });
    });
});
