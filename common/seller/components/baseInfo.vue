<template>
  <div>
    <div class="addexperience">
      <span class="experience"><i class="iconfont icon-gongzuojingli"></i>基本信息</span>
    </div>
    <div class="exexperienceform active">
      <div class="expitem form_item">
        <span class="expname"><i>*</i>店铺名称：</span>
        <input
          maxlength="50"
          type="text"
          class="expipt required"
          v-model="formData.shopName"
          data-valid="isNonEmpty||maxLength:50"
          data-error='店铺名称不能为空||内容过长'
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>店铺标志：</span>
        <div class="iptbox">
          <label
            class="imgiptbox sign required"
            data-valid="custom:imgValid"
            v-viewer
          >
            <img
              :src="formData.shopLogoUrl"
              width="100%"
              height="100%"
              style="opacity: 0;"
              alt=""
            >
          </label>
          <div class="imgipttext">
            <img-uploader
              :title="imgBtnTitle"
              :option="imgOption"
            ></img-uploader><br>图片上传（文件格式GIF、JPG、JPEG、PNG文件大小80k以内，建议尺寸220px*220px）
          </div>
          <span class="vlt form_msg"></span>
        </div>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>经营地址：</span>
        <div class="iptbox">
          <ly-address-select
            class='required'
            data-valid="custom:addressValid"
            ref='addressRef'
            :http='http'
          ></ly-address-select>
          <div class="form_item">
            <input
              v-model="formData.location"
              type="text"
              maxlength="100"
              placeholder="详细地址"
              class="expipt mt20 required"
              data-valid="isNonEmpty||maxLength:100"
              data-error='详细地址不能为空||内容过长'
            >
            <button
              class="btn primary"
              @click="selectMapClick"
            >选择</button>
            <span class="vlt mt20 form_msg"></span>
          </div>
        </div>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>主要行业范围：</span>
        <label
          class="inline expsltlb w438"
          style="line-height: normal;"
        >
          <ly-select-level
            style="height: 36px;"
            data-valid="custom:industryValid"
            ref="industryEl"
            class="expslt required level"
            @input="handleIndustryInput"
            v-model="formData.industryList"
          ></ly-select-level>
        </label><span
          ref="industryMsg"
          class="vlt form_msg"
        ></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>主要服务领域：</span>
        <label
          class="inline expsltlb w438"
          style="line-height: normal;"
        >
          <ly-select-level
            ref="servicesEl"
            style="height: 36px;"
            data-valid="custom:servicesValid"
            type='service'
            class="expslt required level"
            v-model="formData.servicesList"
            @input="handleServicesInput"
          ></ly-select-level>
        </label><span
          ref="servicesMsg"
          class="vlt form_msg"
        ></span>
      </div>
    </div>
    <div class="expitem form_item">
      <span class="expname"><i>*</i>店铺简介：</span>
      <div
        class="iptbox"
        style
      >
        <div class="exptext">
          <vue-ueditor-wrap
            v-model="formData.comment"
            :config="myConfig"
          ></vue-ueditor-wrap>
        </div>
        <span
          class="vlt form_msg"
          style="width: 170px;"
        ></span>
      </div>
    </div>
    <div class="expitem form_item">
      <span class="expname"><i>*</i>服务案例：</span>
      <div
          class="iptbox"
          style
      >
        <div class="exptext">
          <vue-ueditor-wrap
              v-model="formData.case"
              :config="myConfig"
          ></vue-ueditor-wrap>
        </div>
        <span
            class="vlt form_msg"
            style="width: 170px;"
        ></span>
      </div>
    </div>
    <div class="expitem form_item">
      <span class="expname"><i>*</i>绑定手机：</span>
      <input
        v-model="formData.phone"
        type="text"
        class="expipt required"
        maxlength="11"
        data-valid="isNonEmpty||isMobile"
        data-error='手机号不能为空||手机号不正确'
      ><span class="vlt form_msg"></span>
    </div>
    <div class="expitem form_item">
      <span class="expname">绑定邮箱：</span>
      <input
        v-model="formData.email"
        type="text"
        class="expipt required"
        data-valid="isEmail"
        data-error='邮箱格式不正确'
      ><span class="vlt form_msg"></span>
    </div>
    <div class="workexpbtn">
      <button
        class="work-save"
        :disabled="isSubmitDisabled"
        @click="shopinfoUpdate"
      >保存</button>
      <button class="work-cancel">取消</button>
    </div>
  </div>
</template>
<script>
module.exports = {
  inject: ['httpUrl', 'httpStore', 'uploadHeader'],
  data: function () {
    return {
      uploadUrl: this.httpUrl.imgUploadUrl + "/file/resource/upload",
      uploadData: {
        system: 'ts'
      }, myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%'
      },
      formData: {
        shopName: '', // 店铺名称
        shopLogoUrl: '', // 图片路径
        shopLogo: '', // 图片id
        province: '', // 国别
        city: '', // 城市
        district: '', // 地区
        location: '', // 详细地址
        comment: '', // 简介
        case:'',// 服务案例
        phone: '', // 电话
        email: '', // 邮箱
        industryList: [], // 行业范围
        servicesList: [], // 服务领域
      },
      imgOption: {
        size: "220,220",
        prev: "shopLogo",
        url: this.httpUrl.imgUploadUrl + '/file/resource/uploadImg'
      },
      imgBtnTitle: '上传标志',
      isShowMap: true,
      isSubmitDisabled: false,
      provinceList: [],
      cityList: [],
      districtList: [],
      http: this.httpStore
    }
  },
  mounted: function () {
    this.initData();
  },
  methods: {
    initData: function () {
      var vm = this;
      this.httpStore.shopinfoDetail().then(function (res) {
        vm.$emit('auth', {
          certificationFlagDisplay: res.result.certificationFlagDisplay,
          noPassReason: res.result.noPassReason
        })
        vm.formData = $.extend(vm.formData, res.result);
        vm.formData.shopLogoUrl && (vm.imgBtnTitle = '修改标志',
          $('.imgiptbox').css('backgroundImage', 'url(' + vm.formData.shopLogoUrl + ')'))
        var addressArr = vm.$refs.addressRef;
        addressArr.setValues([vm.formData.country, vm.formData.province, vm.formData.city, vm.formData.district]);
      })
    },
    clearMsg: function (code) {
      this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
    },
    handleIndustryInput: function (v) {
      v.length && this.clearMsg('industry')
    },
    handleServicesInput: function (v) {
      v.length && this.clearMsg('services')
    },
    industryValid: function (v, o, callback) {
      if (this.formData.industryList.length == 0) {
        callback(o, '行业范围不能为空')
      } else {
        callback(o)
      }
    },
    servicesValid: function (v, o, callback) {
      if (this.formData.servicesList.length == 0) {
        callback(o, '服务领域不能为空');
      } else {
        callback(o)
      }
    },
    commentValid: function (v, o, callback) {
      var length = /\d/g.test($('#edui1_wordcount').text())
      if (this.formData.comment.length == 0) {
        callback(o, '店铺简介不能为空');
      } else if (!length) {
        callback(o, '店铺简介长度小于500字');
      } else {
        callback(o)
      }
    },
    /**
     * 图片上传回调
     */
    logoBack: function (id, url, type) {
      this.formData.shopLogoUrl = url;
      this.formData.shopLogo = id;
      this.imgBtnTitle = '修改标志'
      $('.imgiptbox').css('backgroundImage', 'url(' + this.formData.shopLogoUrl + ')')
    },
    /**
     * 图片上传回调
     */
    imgUploadSuccess: function (successInfo) {
      this.formData.shopLogoUrl = successInfo.data.url;
      this.formData.shopLogo = successInfo.data.id;
      $('.imgiptbox').css('backgroundImage', 'url(' + this.formData.shopLogoUrl + ')')
    },
    imgValid: function (v, o, callback) {
      if (this.formData.shopLogo && this.formData.shopLogo != '') {
        callback(o)
      } else {
        callback(o, '请上传店铺标志')
      }
    },
    shopinfoUpdate: function () {
      var vm = this;
      !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
        // 验证成功
        if (val) {
          vm.isSubmitDisabled = true
          var data = JSON.parse(JSON.stringify(vm.$data.formData, function (k, v) {
            if ((k === 'industryList' || k === 'servicesList') && v.length) {
              return v.map(function (i) {
                return { tagId: i.tagId, tagType: i.tagType }
              })
            }
            return v
          }))
          vm.httpStore.shopinfoUpdate(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$dialog.showToast('保存成功');
              setTimeout(function () {
                window.location.reload();
              }, 600)
            }
            vm.isSubmitDisabled = false
          }).catch(function () {
            vm.isSubmitDisabled = false
          })
        } else {
        }
      });
    },
    addressValid: function (v, o, callback) {
      var vm = this;
      setTimeout(function () {
        vm.getAddressValue();
        if (vm.formData.country == '' || vm.formData.province == '') {
          callback(o, '经营地址不能为空');
        } else {
          callback(o)
        }
      }, 800)
    },
    /**
     * 验证地址
     */
    getAddressValue: function () {
      var addressArr = this.$refs.addressRef.getSelected();
      this.formData.country = addressArr[0];
      this.formData.province = addressArr[1];
      this.formData.city = addressArr[2];
      this.formData.district = addressArr[3];
    },
    /**
     * 地图回调
     */
    setMapInfo: function (mapInfo) {
      this.formData.location = mapInfo.address;
      this.formData.longitude = mapInfo.lng;
      this.formData.latitude = mapInfo.lat;
      this.isShowMap = false;
    },
    /**
     * 选择地图
     */
    selectMapClick: function () {
      this.$emit('selmap');
    }
  }
}
</script>

<style >
.primary {
  background-color: #1154b0;
  color: #fff;
}
.btn {
  width: 80px;
  height: 30px;
}
</style>
