require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'jqValidate', 'httpVueLoader', 'seller', 'jqSelect', 'httpCom'], function ($, Vue, httpStore, httpUrl, dic, jqValidate, httpVueLoader, seller, jqSelect, httpCom) {

    // 全局需要使用的组件
    Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
    Vue.component('ly-address-select', httpVueLoader('./components/sellerAddressSelect.vue'));
    Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
    Vue.component('address-map', httpVueLoader('/common/components/addressMap.vue'));
    Vue.component('ly-select-level', httpVueLoader('/common/components/selectlevel1.vue'));
    Vue.component('img-uploader', httpVueLoader('/common/components/imgUploader.vue'));
    Vue.component('vue-ueditor-wrap', VueUeditorWrap)
    window.vueDom = new Vue({
      el: '#store_box',
      data: {
        certificationFlagDisplay: '',
        noPassReason: '',
        activeIndex: 0,
        uploadHeader: {},
        uploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
        uploadData: {
          system: 'ts'
        },
        http: httpStore,
        isShowMap: false,
        httpCom: httpCom
      },
      provide: {
        httpUrl: httpUrl,
        httpStore: httpStore,
        uploadHeader: this.uploadHeader,
        uploadData: {
          system: 'ts'
        },
        uploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload"
      },
      mixins: [seller],
      components: {
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'base-info': httpVueLoader('./components/baseInfo.vue'),
        'certificate': httpVueLoader('./components/certificate.vue'),
        'experience': httpVueLoader('./components/experience.vue'),
        'license': httpVueLoader('./components/license.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
        var vm = this;
        vm.$on('auth', function (result) {
          vm.certificationFlagDisplay = result.certificationFlagDisplay;
          vm.noPassReason = result.noPassReason;
        })
        var vm = this;
        var userJson = localStorage.getItem(dic.locaKey.USER_INFO);
        var token = '';
        if (userJson) {
          token = JSON.parse(userJson).access_token
        }
        this.uploadHeader = {
          'access-token': token
        }
        $(".setbar").on("click", "span", function () {
          var _index = $(this).index();
          vm.activeIndex = _index;
          $(this).addClass("active").siblings("span").removeClass("active");
        })

        $(".edit").on("click", "i.icon-remove-1-copy", function () {
          $(this).closest(".elist").remove();
        })
        $(".iptbox").on("click", ".radioipt", function () {
          $(this).addClass("active").closest(".prtradio").siblings(".prtradio").find(".radioipt").removeClass("active");
        })

      },
      methods: {
        // 代理子组件的校验
        addressValid: function (v, o, callback) {
          this.$refs.content.addressValid(v, o, callback);
        },
        industryValid (v, o, callback) {
          this.$refs.content.industryValid(v, o, callback);
        },
        servicesValid: function (v, o, callback) {
          this.$refs.content.servicesValid(v, o, callback);
        },
        imgValid: function (v, o, callback) {
          this.$refs.content.imgValid(v, o, callback);
        },
        timeValid: function (v, o, callback) {
          this.$refs.content.timeValid(v, o, callback);
        },
        commentValid: function (v, o, callback) {
          this.$refs.content.commentValid(v, o, callback);
        },
				/**
				 * 代理子组件标志上传回调
				 */
        imgUploadSuccess: function (id, url, type) {
          this.$refs.content.logoBack(id, url, type)
        },
				/**
			 * 地图点击后回调
			 */
        mapClick: function (mapInfo) {
          // this.formData.location = mapInfo.address;
          // this.formData.longitude = mapInfo.lng;
          // this.formData.latitude = mapInfo.lat;
          this.$refs.content.setMapInfo(mapInfo);
          this.isShowMap = false;
        }
      }
    });
  });
});
