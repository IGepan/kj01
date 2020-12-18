<template>
  <div class="setcontent active">
    <div class="addexperience">
      <span class="experience"><i class="iconfont icon-gongzuojingli"></i>资质证书</span>
      <button
        class="addexp"
        @click="addClick"
      >添加资质证书+</button>
    </div>
    <div
      class="experienceform"
      :class="{active: showAdd}"
    >
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证书获得时间：</span>
        <input
          class="timeipt required"
          data-valid="custom: timeValid"
          v-model="formData.getTime"
          type="text"
          id="getTime"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证书名称：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty||maxLength:50"
          data-error='证书名称不能为空||内容过长'
          v-model="formData.name"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证书照片：</span>
        <div class="iptbox form_item">
          <label class="exbtn">
            <ly-upload
              @success='imgUploadSuccess'
              data-valid="custom:imgValid"
              class="exbtn required"
              :header='uploadHeader'
              :url='uploadUrl'
              :data='uploadData'
              accept="image/*"
            >增加
            </ly-upload>
          </label>
          <span
            id="certificateImg"
            class="vlt form_msg"
          ></span>
          <ul
            class="keywordlist"
            v-viewer
          >
            <li
              v-for="(url,index) in formData.fileUrls"
              class="signimg"
              :style="{backgroundImage: 'url('+url+')'}"
            >
              <img
                :src="url"
                class="opacityZero"
              >
              <i
                class="iconfont icon-shanchuguanbicha2 icon_del"
                @click="delFileClick(index)"
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="workexpbtn">
        <button
          class="work-save"
          :disabled="isSubmitDisabled"
          @click="certificateInsert"
        >保存</button>
        <button
          class="work-cancel"
          @click="ceiClick"
        >取消</button>
      </div>
    </div>
    <div
      class="explist"
      v-if='certifList.length>0'
    >
      <div
        class="elist"
        v-for="certif in certifList"
      >
        <div class="fr edit">
          <i
            class="iconfont icon-xiugai mr10"
            @click="editClick(certif)"
          ></i>
          <i
            class="iconfont icon-remove-1-copy"
            @click="delClick(certif)"
          ></i>
        </div>
        <div class="expdesc">
          <span
            class="expft"
            v-text="certif.getTime"
          ></span>
          <span
            class="expbft"
            v-text="certif.name"
          ></span>
        </div>
        <div class="expworkdesc">
          <span>证书照片：</span>
          <div class="certificatelist pl20">
            <img
              :src="img.pathMini"
              alt=""
              class="cfcitem"
              v-for="img in certif.fileList"
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="expnothing"
      v-else
    >
      <i class="iconfont icon-tishi"></i>您还没有上传资质证书，请尽快完善 </div>
  </div>
</template>
<script>
module.exports = {
  inject: ['httpUrl', 'httpStore', 'uploadHeader', 'uploadUrl', 'uploadData'],
  data: function () {
    return {
      showAdd: false,
      isSubmitDisabled: false,
      formData: {
        getTime: '',
        name: '',
        fileIds: [],
        fileUrls: []
      },
      certifList: [],
      http: this.httpStore
    }
  },
  mounted () {
    var vm = this;
    laydate.render({
      elem: '#getTime', //指定元素
      value: vm.formData.getTime,
      done: function (val) { //选择日期完毕的回调
        vm.formData.getTime = val;
      },
    });
    this.initData();
  },
  watch: {

  },
  methods: {
    initData: function () {
      var vm = this;
      this.httpStore.certificateSelect().then(function (res) {
        vm.certifList = res.result;
      })
    },
    addClick: function () {
      this.formData.id = '';
      this.showAdd = true;
    },
    certificateInsert: function () {
      var vm = this;
      !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
        // 验证成功
        if (val) {
          vm.isSubmitDisabled = true
          if (vm.formData.id === '' || !vm.formData.id) {
            vm.httpStore.certificateInsert(vm.formData).then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('保存成功');
                vm.formData.fileUrls = []
                vm.formData.getTime = ''
                vm.formData.name = ''
                vm.formData.id = ''
                vm.formData.fileIds = []
                vm.initData();
              }
              vm.isSubmitDisabled = false
            }).catch(function () {
              vm.isSubmitDisabled = false
            })
          } else {
            vm.httpStore.certificateUpdate(vm.formData).then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('保存成功');
                vm.resetFormData();
                vm.initData();
              }
              vm.isSubmitDisabled = false
            }).catch(function () {
              vm.isSubmitDisabled = false
            })
          }
        }
      })

    },
    /**
     * 图片上传回调
     */
    imgUploadSuccess: function (successInfo) {
      this.formData.fileIds.push(successInfo.data.id);
      this.formData.fileUrls.push(successInfo.data.url)
      $('.imgiptbox').css('backgroundImage', 'url(' + this.formData.shopLogoUrl + ')')
      $('#certificateImg').hide()
    },
    imgValid: function (v, o, callback) {
      if (this.formData.fileIds && this.formData.fileIds.length > 0) {
        callback(o)
      } else {
        callback(o, '请上传证件照片')
      }
    },
    delClick: function (item) {
      var vm = this;
      this.$dialog.confirm({
        title: '提示',
        texts: '确定删除该证书？',
        callback: function () {
          vm.httpStore.certificateDel({
            id: item.id,
            version: item.version
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('删除成功');
              vm.initData();
            }
          })
        }
      })
    },
    editClick: function (item) {
      var vm = this;
      this.httpStore.certificateDetail({ id: item.id }).then(function (res) {
        var resData = res.result;
        vm.showAdd = true;
        vm.formData.id = resData.id;
        vm.formData.getTime = resData.getTime;
        vm.formData.version = resData.version;
        vm.formData.name = resData.name;
        vm.formData.fileUrls = [];
        for (var it of resData.fileList) {
          vm.formData.fileIds.push(it.id);
          vm.formData.fileUrls.push(it.pathMini);
        }
      })
    },
    delFileClick: function (index) {
      this.formData.fileUrls.splice(index, 1);
      this.formData.fileIds.splice(index, 1);
    },
    ceiClick: function () {
      this.resetFormData();
      this.showAdd = false;
    },
    resetFormData: function () {
      this.formData.fileUrls = []
      this.formData.getTime = ''
      this.formData.name = ''
      this.formData.id = ''
      this.formData.fileIds = []
    },
    timeValid: function (v, o, callback) {
      var vm = this
      setTimeout(function () {
        if (!vm.formData.getTime || vm.formData.getTime == '') {
          callback(o, '证书获得时间不能为空')
        } else {
          callback(o)
        }
      }, 1000)
    },
    imgValid: function (v, o, callback) {
      if (!this.formData.fileIds || this.formData.fileIds.length == 0) {
        callback(o, '证书照片不能为空')
      } else {
        callback(o)
      }
    }
  }
}
</script>

<style scoped>
</style>
