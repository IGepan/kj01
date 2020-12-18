// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpUrl', 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js', '/style/js/api/explain.js',], function ($, Vue, httpUrl, wxApi, explainApi) {
    document.title = '政策解读';
    new Vue({
      el: '#index_box',
      data: {
        id: '',
        info: '',
        isError: '',
        isBaseOtherFull: true
      },
      filters: {
        formatTime: function (v) {
          return v ? v.split(' ')[0] : ''
        },
        formatTime1: function (v, t) {
          if (v) {
            v = v.split(' ')[0]
            v = v.split('-')
            // v.splice(1,0,'年')
            // v.splice(3,0,'月')
            // v.push('日')
            return t ? ' ~ ' + v.join('.') : v.join('.')
          } else {
            return ''
          }
        },
        formatTime2: function (v, t) {
          if (v && t) {
            v = v.split(' ')[0]
            v = v.split('-')
            // v.splice(1,0,'年')
            // v.splice(3,0,'月')
            // v.push('日')

            t = t.split(' ')[0]
            t = t.split('-')
            // t.splice(1,0,'年')
            // t.splice(3,0,'月')
            // t.push('日')
            return v.join('.') + ' ~ ' + t.join('.')
          } else {
            return '无'
          }
        },
        formatAddress: function (v, v1, v2) {
          if (v) {

          } else {
            return ''
          }
        }
      },
      mounted: function () { },
      created: function () {
        this.id = this.$utils.getReqStr('id');
        this.getInfo()
      },
      methods: {
        getInfo: function () {
          var vm = this;
          explainApi.getDetailById({ id: this.id }).then(function (res) {
            if (res.code === 'rest.success') {
              var keys = '';
              var content = ''
              try {
                if (res.result.annotation) {
                  // 格式化标记信息
                  content = res.result.content;
                  // res.result.writtenDepartment && (res.result.writtenDepartment = res.result.writtenDepartment.split('ぶんかつ'));
                  res.result.annotation = keys = res.result.annotation.split(';').map(function (keysText) {
                    keysText = keysText.replace(/\s/g, '换行');
                    keysText = ('{"' + keysText + '"}').replace(/:/g, '":"').replace(/,/g, '","');
                    keysText = JSON.parse(keysText);
                    keysText.text = '<p>' + keysText.text.split('换行').join('</p><p>') + '</p>';
                    keysText['words'] = content.substring(keysText.start, keysText.end)
                    keysText['isOpen'] = 0
                    keysText['style'] = ''
                    return keysText
                  })
                  // res.result.annotation[0].text = '90年来，中国共产党由小到大，由弱变强，领导中国人民冲破重重难关，夺取了革命斗争和经济建设的一个又一个胜利。中国共产党坚持以马克思列宁主义、毛泽东思想、中国特色社会主义理论体系为指导，领导全国人民改革开放，奋斗进取，全面推进中国特色社会主义现代化建设，综合国力显著增强，取得了举世闻名的成就。能够说，中国共产党的历史，就是不断从胜利走向胜利的历史。90年的历史经验归结到一点，就是把马克思主义基本原理同中国具体实际相结合，探索自我的革命、建设和改革道路。这些经验弥足珍贵，值得全体共产党人永远铭记。在中国已经成功的历史事件中，无与伦比的北京奥运会，还有正在进行的举世瞩目的上海世博会，还有在世界金融危机背景下经济的依然快速增长，这一系列重大成就和标志性事件都要归功于神中国共产党，这就是为什么中国共产党会成立90周年却依然能够充满生机和活力。中国共产党在90年的奋斗历程中，培育构成了一系列彰显政党性质，反映名族精神，体现了时代要求和凝聚了各方力量的伟大精神，这些伟大精，对于推动党所领导的革命，建设和改革事业发挥了无可替代的重要作用，中国共产党的伟大精神具有理想高远，紧贴实际，科学理性。'
                  keys.length && keys.forEach(function (key, index) {
                    var repText = '<span class=\"' + (key.type === '1' ? 'necessary' : 'emphasis') + '\" data-index=\"' + index + '\">' + key.words + '</span>';
                    content = content.replace(key.words, repText)
                  })
                  content = content.split('\n');
                  content = content.join('</p><p>');
                  content = '<p>' + content + '</p>';
                }
                res.result.content = content;
                vm.info = res.result
              } catch (error) {
                vm.isError = '标记信息解析失败！'
              }
            } else {
              vm.isError = res.desc
            }
          })
        },
        handleShare: function () {
          wxApi.miniProgram.getEnv(function (res) {
            console.log(res.miniprogram)
            wxApi.miniProgram.postMessage({ data: { foo: 'bar' } })
          })
        },
        handleContact: function () {
          wxApi.miniProgram.postMessage({ data: { foo: 'bar' } })
        },
        handleContent: function (e) {
          var $target = e.target;
          var index = $target.dataset.index || $target.getAttribute("data-index")
          if ($target.nodeName === 'SPAN') {
            console.log(index)
            this.info.annotation[index].isOpen = 1;
            this.info.annotation[index].style = { top: e.pageY };
            document.body.style.overflow = 'hidden'
          }
        },
        handleTips: function (index, e) {
          this.info.annotation[index].isOpen = 0;
          document.body.style.overflow = ''
          console.log(e)
        },
        handleBaseOtherFull: function () {
          this.isBaseOtherFull = !this.isBaseOtherFull
        }
      }
    });
  })
});
