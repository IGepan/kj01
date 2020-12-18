<template>
  <div>
    <div class="addexperience">
      <span class="experience"><i class="iconfont icon-gongzuojingli"></i>经营许可上传</span>
      <button
        class="addexp"
        @click="showForm = true"
      >添加经营许可+</button>
    </div>
    <div
      class="experienceform"
      :class="{active: showForm}"
    >
      <div class="expitem">
        <span class="expname"><i>*</i>证书类型：</span>
        <ly-select
          style="display: inline-block;"
          class="expipt"
          v-model="formData.certificateType"
          code='certificate_type'
          :http='httpStore'
        ></ly-select>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证书名称：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="证书名称不能为空"
          v-model="formData.name"
          maxlength="50"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证书编号：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="证书编号不能为空"
          v-model="formData.certificateNo"
          maxlength="50"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>企业名称：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="企业名称不能为空"
          v-model="formData.enterpriseName"
          maxlength="50"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>地址：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="地址不能为空"
          v-model="formData.address"
          maxlength="100"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证件有效期：</span>
        <div class="iptbox">
          <div
            class="inline mr15 prtradio"
            @click="formData.alwaysValidFlag = '0'"
          >
            <div
              class="radioipt inline mr10"
              name="validity"
              :class="{active: formData.alwaysValidFlag === '0'}"
            ></div>
            <input
              v-model="formData.expireDate"
              type="text"
              class="timeipt inline required"
              id="expireDate"
              data-valid="custom:timeValid"
            >
          </div>
          <div
            class="inline prtradio"
            @click="formData.alwaysValidFlag = '1'"
          >
            <div
              class="radioipt inline mr10"
              name="validity"
              :class="{active: formData.alwaysValidFlag === '1'}"
            ></div>
            <span class="inline">长期</span>
          </div>
          <span class="vlt form_msg"></span>
          <div class="noticetext">若证件无期限限制，请勾选长期</div>
        </div>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>经营范围：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="经营范围不能为空"
          v-model="formData.businessScope"
          maxlength="100"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证件照片：</span>
        <div class="iptbox">
          <label
            class="imgiptbox sign"
            :style="{backgroundImage: 'url('+formData.certificateImgMiniPath+')'}"
          >
            <ly-upload
              @success='imgUploadSuccess'
              data-valid="custom:imgValid"
              class="required"
              :header='uploadHeader'
              :url='uploadUrl'
              :data='uploadData'
              accept="image/*"
            >
            </ly-upload>
          </label>
          <div class="imgipttext">图片上传（文件格式GIF、JPG、JPEG、PNG文件大小1M以内）</div>
          <span
            id="imgTips"
            class="vlt form_msg"
          ></span>
        </div>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>证书可查验网址：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="证书可查验网址不能为空"
          v-model="formData.certificateCheckAddress"
          maxlength="100"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="workexpbtn">
        <button
          class="work-save"
          :disabled="isSubmitDisabled"
          @click="saveClick"
        >保存</button>
        <button
          class="work-cancel"
          @click="ceiClick"
        >取消</button>
      </div>
    </div>
    <!--列表-->
    <div
      class="explist"
      v-if='licenseList.length>0'
    >
      <div
        class="elist"
        v-for="item in licenseList"
      >
        <div class="fr edit">
          <i
            class="iconfont icon-xiugai mr10"
            @click="editEduClick(item)"
          ></i>
          <i
            class="iconfont icon-remove-1-copy"
            @click="delEduClick(item)"
          ></i>
        </div>
        <div class="expdesc">
          <span
            class="expft"
            v-text="item.certificateNo"
          ></span>
          <span
            class="expbft"
            v-text="item.enterpriseName"
          ></span>
          <span
            class="expbft"
            v-text="item.name"
          ></span>
        </div>
        <div class="expworkdesc">
          <span
            style="width:160px;"
            v-text="item.certificateTypeDisplay"
          ></span>
          <div
            class="describe"
            v-text="item.certificationFlagDisplay"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="expnothing"
      v-else
    >
      <i class="iconfont icon-tishi"></i>您还没有上传经营许可，请尽快完善 </div>
  </div>
  </div>
</template>
<script>
module.exports = {
  inject: ['httpStore', 'uploadUrl', 'uploadData', 'uploadHeader'],
  data: function () {
    return {
      showForm: false,
      isSubmitDisabled: false,
      licenseList: [],
      formData: {
        id: '',
        certificateType: '', // 证书类型(字典表：certificate_type)
        name: '', // 证书名称
        certificateNo: '', // 证书编号
        enterpriseName: '', // 	企业名称
        address: '', // 地址
        alwaysValidFlag: '0', // 长期有效标识(字典表：yes_no)
        expireDate: '', // 到期时间
        businessScope: '', // 经营范围
        certificateCheckAddress: '', // 证书查询地址
        fileId: '', // 证件照片Id
        certificateImgMiniPath: ''
      }
    }
  },
  mounted () {
    this.initData();
  },
  methods: {
    initData: function () {
      var vm = this;
      laydate.render({
        elem: '#expireDate', //指定元素
        value: vm.formData.expireDate,
        done: function (val) { //选择日期完毕的回调
          vm.formData.expireDate = val;
        },
      });
      this.licenseSelectByVo();
    },
    licenseSelectByVo: function () {
      var vm = this;
      this.httpStore.licenseSelectByVo().then(function (res) {
        vm.licenseList = res.result;
      })
    },
    saveClick: function () {
      var vm = this;
      !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
        // 验证成功
        if (val) {
          vm.isSubmitDisabled = true
          if (vm.formData.id && vm.formData.id !== '') {
            vm.httpStore.licenseUpdate(vm.formData).then(function (res) {
              if (res.code === 'rest.success') {
                vm.$dialog.showToast('保存成功');
                // vm.formData = {};
                vm.resetFormData();
                vm.licenseSelectByVo();
              }
              vm.isSubmitDisabled = false
            }).catch(function () {
              vm.isSubmitDisabled = false
            })
          } else {
            vm.httpStore.licenseInsert(vm.formData).then(function (res) {
              if (res.code === 'rest.success') {
                vm.$dialog.showToast('保存成功');
                // vm.formData = {};
                vm.resetFormData();
                vm.licenseSelectByVo();
              }
              vm.isSubmitDisabled = false
            }).catch(function () {
              vm.isSubmitDisabled = false
            })
          }
        }
      })
    },
    ceiClick: function () {
      this.showForm = false;
    },
    imgValid: function (v, o, callback) {
      if (this.formData.fileId && this.formData.fileId != '') {
        callback(o)
      } else {
        callback(o, '请上传证件照片')
      }
    },
    timeValid: function (v, o, callback) {
      var vm = this
      setTimeout(function () {
        if (vm.formData.alwaysValidFlag == '0') {
          if (vm.formData.expireDate && vm.formData.expireDate != '') {
            callback(o)
          } else {
            callback(o, '请选择有效期')
          }
        } else {
          callback(o)
        }
      }, 1000)
    },
    imgUploadSuccess: function (successInfo) {
      this.formData.fileId = successInfo.data.id;
      this.formData.certificateImgMiniPath = successInfo.data.url;
      $('#imgTips').hide()
    },
    resetFormData: function () {
      this.formData.id = '';

      for (var key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
          if (key != "alwaysValidFlag" && key != "certificateType") {
            this.formData[key] = "";
          }
        }
      }
      this.formData.alwaysValidFlag = "0";
    },
    editEduClick: function (item) {
      var vm = this;
      this.httpStore.licenseDetail({
        id: item.id
      }).then(function (res) {
        vm.formData = res.result;
        vm.showForm = true;
      })
    },
    delEduClick: function (item) {
      var vm = this;
      this.$dialog.confirm({
        title: '提示',
        texts: '确定删除该经营许可？',
        callback: function () {
          vm.httpStore.licenseDel({
            id: item.id,
            version: item.version
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('删除成功');
              vm.licenseSelectByVo();
            }
          })
        }
      })
    },
    ceiClick: function () {
      this.formData = {};
      this.showForm = false;
    },
  }
}
</script>

<style scoped>
</style>
