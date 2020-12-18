// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/resources.js', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, indexApi, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: '',
          options: {
            companyType: [
              {
                url: '/resources/enterprise_list.html?tags=cqMiddleMinFirm',
                label: '科技型企业',
                active: true,
                value: 0
              },
              {
                url: '/resources/enterprise_list.html?tags=highTechFirm',
                label: '高新技术企业',
                active: false,
                value: 1
              },
              {
                url: '',
                label: '其他',
                active: false,
                value: 2
              }
            ],
            talentsType: [
              {
                url: '/resources/talents_list.html?type=高层次人才',
                label: '高层次人才',
                active: true,
                value: '高层次人才'
              },
              {
                url: '/resources/talents_list.html?type=学术性人才',
                label: '学术性人才',
                active: false,
                value: '学术性人才'
              }
            ],
            apparatusType: [],
            organizationType: []
          },
          countNumbers: [
            {
              url: '/resources/enterprise_list.html',
              label: '科技企业',
              num: 0,
              keyName: 'enterpriseNum',
              unit: '家'
            },
            {
              url: '/resources/organization_list.html',
              label: '研发机构',
              num: 0,
              keyName: 'researchNum',
              unit: '家'
            },
            {
              url: '/resources/talents_list.html',
              label: '科技人才',
              num: 0,
              keyName: 'teacTalentNum',
              unit: '位'
            },
            {
              url: '/resources/equipment_list.html',
              label: '仪器设备',
              num: 0,
              keyName: 'equipmentNum',
              unit: '台/套'
            },
            {
              url: '/resources/patent_list.html',
              label: '专利成果',
              num: 0,
              keyName: 'teacResult',
              unit: '项'
            }
          ],
          selectCompanyIndex: 0,
          companyList: [],
          organizationIndex: 0,
          organizationList: [],
          talentsIndex: 0,
          talentsList: [],
          apparatusIndex: 0,
          apparatusList: [],
          achievementIndex: 0,
          achievements: [
            {
              label: '专利',
              descText: '专利资源包括中国的发明专利、实用新型、外观设计，收录始于1980年，已收录20638391+条。',
              className: 'patent',
              active: true
            },
            {
              label: '文献',
              descText: '文献论文资源包括中文期刊论文，收录始于1989年，已收录68458574+条，主要包括南大核心（CSSCI）、北大核心（中文核心）、CSCD和EI/SCI来源期刊。',
              className: 'literature',
              active: false
            },
            {
              label: '标准',
              descText: '',
              className: 'standard',
              active: false
            },
            {
              label: '项目',
              descText: '',
              className: 'project',
              active: false
            },
            {
              label: '成果',
              descText: '',
              className: 'achievement',
              active: false
            },
            {
              label: '软著',
              descText: '',
              className: 'thesoft',
              active: false
            }
          ]
        },
        filters: {
          firstWord: function (v) {
            return v ? v.substr(0, 1) : ''
          }
        },
        mounted: function () {
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'number-grow': httpVueLoader('/style/components/number.vue'),
          'sources-head': httpVueLoader('/style/components/sources_head.vue'),
          'sources-baner-search': httpVueLoader('/style/components/sources_baner_search.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          this.saasId = localStorage.getItem('saasId');
          this.getNumbers()
          this.getCompanyList()
          this.getTypes()
          this.apparatusListType()
          this.getTalentsList()
        },
        methods: {
          getNumbers: function () {
            var vm = this;
            indexApi.indexNum({}).then(function (res) {
              if (res.code === 200) {
                vm.countNumbers.forEach(function (item) {
                  item.num = res.data[item.keyName] || 0
                });
              }
            })
          },
          getTypes: function () {
            var vm = this;
            indexApi.getTypes({}).then(function (res) {
              if (res.code === 200) {
                var opts = res.data.orgType
                vm.options.organizationType = opts.map(function (item, i) {
                  item['active'] = !i
                  item.label = item.baseType
                  item.url = '/resources/organization_list.html?orgType=' + item.baseType
                  return item;
                })
                vm.getOrganizationList()
              }
            })
          },
          apparatusListType: function () {
            var vm = this;
            indexApi.apparatusListType({}).then(function (res) {
              if (res.code === 200) {
                var str = '8,7,5,1';
                var opts = res.data.filter(function (item) {
                  return str.indexOf(item.id) !== -1
                })
                vm.options.apparatusType = opts.map(function (item, i) {
                  item['active'] = !i
                  item.label = item.name
                  item.url = '/resources/equipment_list.html?equipmentTypeId=' + item.id
                  return item;
                })
                vm.getApparatusList()
              }
            })
          },
          getCompanyList: function () {
            var vm = this;
            indexApi.enterprisecqList({ tagType: this.options.companyType[this.selectCompanyIndex].value, page: 1, limit: 6 }).then(function (res) {
              if (res.code === 200) {
                res.data && res.data.forEach(function (item) {
                  item['label'] = item.highTechFirm ? '高新技术企业' : item.uniconFirm ? '独角兽' : item.gazelleFirm ? '瞪羚' : item.gnuFirm ? '牛羚' : item.newHighResearchOrg ? '新型高端研发机构' : item.newResearchOrg ? '新型研发机构' : item.middleMinFirm ? '国家级科技型企业' : item.cqMiddleMinFirm ? '市级科技型企业' : ''
                  item['itemUrl'] = '/resources/enterprise_detail.html?id=' + item.id
                });
                vm.companyList = res.data || []
              }
            })
          },
          getOrganizationList: function () {
            var vm = this;
            indexApi.cqresearchbaseList({ orgType: this.options.organizationType[this.organizationIndex].label, page: 1, limit: 6 }).then(function (res) {
              if (res.code === 200) {
                res.data && res.data.forEach(function (item) {
                  item['itemUrl'] = '/resources/organization_detail.html?id=' + item.itemCode
                });
                vm.organizationList = res.data
              }
            })
          },
          getTalentsList: function () {
            var vm = this;
            indexApi.talentList({ type: this.options.talentsType[this.talentsIndex].value, page: 1, limit: 8 }).then(function (res) {
              if (res.code === 200) {
                res.data && res.data.forEach(function (item) {
                  item['itemUrl'] = '/resources/talents_detail.html?id=' + item.id
                });
                vm.talentsList = res.data
              }
            })
          },
          getApparatusList: function () {
            var vm = this;
            indexApi.equipmentinstrumentList({ equipmentTypeId: this.options.apparatusType[this.apparatusIndex].id, page: 1, limit: 3 }).then(function (res) {
              if (res.code === 200) {
                res.data && res.data.forEach(function (item) {
                  item['itemUrl'] = '/resources/equipment_detail.html?id=' + item.id
                  item.styles = {
                    backgroundImage: 'url(' + httpUrl.companyApi + '/yzw/api/' + item.imgUrl + ')'
                  }
                  item['itemImg'] = httpUrl.companyApi + '/yzw/api/' + item.imgUrl
                });
                vm.apparatusList = res.data
              }
            })
          },
          handleSetCompany: function (i) {
            if (this.selectCompanyIndex !== i) {
              this.options.companyType[this.selectCompanyIndex].active = false
              this.options.companyType[i].active = true
              this.selectCompanyIndex = i
              this.getCompanyList()
            }
          },
          handleSetOrganization: function (i) {
            if (this.organizationIndex !== i) {
              this.options.organizationType[this.organizationIndex].active = false
              this.options.organizationType[i].active = true
              this.organizationIndex = i
              this.getOrganizationList()
            }
          },
          handleSetTalents: function (i) {
            if (this.talentsIndex !== i) {
              this.options.talentsType[this.talentsIndex].active = false
              this.options.talentsType[i].active = true
              this.talentsIndex = i
              this.getTalentsList()
            }
          },
          handleSetApparatus: function (i) {
            if (this.apparatusIndex !== i) {
              this.options.apparatusType[this.apparatusIndex].active = false
              this.options.apparatusType[i].active = true
              this.apparatusIndex = i
              this.getApparatusList()
            }
          },
          handleClickToPage: function (i, type) {
            var option = this.options[type][i]
            console.log(option)
            option.url && this.$utils.openNewTable(option.url)
          },
          handleSetAchievement: function (i) {
            if (2 > i && this.achievementIndex !== i) {
              this.achievements[this.achievementIndex].active = false
              this.achievements[i].active = true
              this.achievementIndex = i
            }
          },
          handleNextAchievement: function () {
            this.handleSetAchievement(this.achievementIndex === 0 ? 1 : 0)
          },
          handlePrevAchievement: function () {
            this.handleSetAchievement(this.achievementIndex === 0 ? 1 : 0)
          },
          handleClickToCount: function (i) {
            i.url && this.$utils.openNewTable(i.url)
          }
        }
      });
    })
});
