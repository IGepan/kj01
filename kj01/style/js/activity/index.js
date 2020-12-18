// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/style/js/api/activity.js',
    'echarts', 'dialog', 'httpUrl', 'laydate'],
    function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, echarts, dialog, httpUrl, laydate) {
      window.laydate = laydate
      window.echarts = echarts
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        http: httpUser,
        activityApi: activityApi,
      },
      watch: {},
      created: function () {},
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/conferenceLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
        'activity-graph': httpVueLoader('/style/components/activity_Graph.vue')
      },
      mounted: function () {},
      methods: {}
    });
  });
});
