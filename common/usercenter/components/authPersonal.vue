<template>
  <div>
    <div class="form_title"> 个人认证信息 </div>
    <table
      border="0"
      cellpadding="5"
      cellspacing="5"
      class="form_table"
    >
      <tr class="validate">
        <th>认证状态</th>
        <td>
          <div
            style="font-size: 14px;"
            v-text="formData.certificationFlagDisplay || '未认证'"
          >
          </div>
        </td>
      </tr>
      <tr class="validate form_item">
        <th>真实姓名</th>
        <td>
          <div class="ipt name">
            <input
              :disabled="isCertificationed"
              placeholder="请填写与证件上一致的姓名"
              v-model="formData.realName"
              type="text"
              class="required"
              data-valid="isNonEmpty||maxLength:20"
              data-error='真实姓名不能为空||内容过长'
            >
          </div>
        </td>
        <td class="form_msg"></td>
      </tr>
      <tr class="validate form_item">
        <th>性别</th>
        <td>
          <ly-radio
            :mdisabled="isCertificationed"
            class="radio"
            code='sex'
            :http='httpUser'
            v-model='formData.sex'
          ></ly-radio>
        </td>
        <td class="form_msg"></td>
      </tr>
      <tr class="validate form_item">
        <th>证件类型</th>
        <td>
          <ly-select
            v-model='formData.personalCertificateType'
            class='select'
            code='personal_certificate_type'
            :http='httpUser'
          ></ly-select>
        </td>
        <td class="form_msg"></td>
      </tr>
      <tr class="validate form_item">
        <th>证件号码</th>
        <td>
          <div class="ipt name">
            <input
              ref="pccEl"
              :disabled="isCertificationed"
              maxlength="30"
              v-model="formData.personalCertificateCode"
              type="text"
              class="required"
              data-valid="isNonEmpty||idCard||maxLength:30"
              data-error='证件号码不能为空||身份证号码格式不正确||内容过长'
            >
          </div>
        </td>
        <td
          ref="pccMsg"
          class="form_msg"
        ></td>
      </tr>
      <tr class="validate form_item">
        <th>身份证正面</th>
        <td>
          <div
            class="head"
            v-viewer
            :class="{loading: isFile1Load}"
            :style="{backgroundImage: formData.attachmentIdUrl1?'url('+formData.attachmentIdUrl1+')':'url(/common/images/defaultImg/idA.jpg)'}"
          ><img
              :src="formData.attachmentIdUrl1 || '/common/images/defaultImg/idA.jpg'"
              class="opacityZero"
            ></div>
          <label
            v-if="!isCertificationed"
            class="exbtn"
          >
            <ly-upload
              :exp="{type: 'mainPhoto'}"
              @upstart="file1"
              @success='cimgUploadSuccess'
              style="position: absolute;right: 10000px;"
              type='file'
              :header='uploadHeader'
              :url='fileUploadUrl'
              :data='uploadData'
              accept="image/*"
            >
            </ly-upload>
            <span class="exbtn">上传</span>
          </label>
        </td>
        <td class="form_msg"></td>
      </tr>
      <tr class="validate form_item">
        <th>身份证反面</th>
        <td>
          <div
            class="head"
            v-viewer
            :class="{loading: isFile2Load}"
            :style="{backgroundImage: formData.attachmentIdUrl2?'url('+formData.attachmentIdUrl2+')':'url(/common/images/defaultImg/idB.jpg)'}"
          ><img
              :src="formData.attachmentIdUrl2 || '/common/images/defaultImg/idB.jpg'"
              class="opacityZero"
            ></div>
          <label
            v-if="!isCertificationed"
            class="exbtn"
          >
            <ly-upload
              @upstart="file2"
              :exp="{type: 'secrecy'}"
              @success='cimgUploadSuccess'
              style="position: absolute;right: 10000px;"
              type='file'
              :header='uploadHeader'
              :url='fileUploadUrl'
              :data='uploadData'
              accept="image/*"
            >
            </ly-upload>
            <span class="exbtn">上传</span>
          </label>
        </td>
        <td class="form_msg"></td>
      </tr>
      <tr class="validate form_item">
        <th>证件到期时间</th>
        <td>
          <div class="radio">
            <label>
              <input
                :disabled="isCertificationed"
                type="radio"
                name="'radio_time"
                value="0"
                checked
                v-model="formData.alwaysValidFlag"
              />
              <b></b>
            </label>
          </div>
          <div class="radio_date date">
            <input
              ref="expireDateEl"
              :disabled="isCertificationed || formData.alwaysValidFlag === '1'"
              :class="{required: formData.alwaysValidFlag === '0'}"
              v-model="formData.expireDate"
              type="text"
              id="expireDate"
              data-valid="custom:expireDateValid"
            />
          </div>
          <div
            class="radio"
            style="margin-left: 40px;"
          >
            <label>
              <input
                :disabled="isCertificationed"
                type="radio"
                name="'radio_time"
                value="1"
                v-model="formData.alwaysValidFlag"
              />
              <b></b>长期有效
            </label>
          </div>
        </td>
        <td
          ref="expireDateMsg"
          class="form_msg"
        ></td>
      </tr>
      <tr class="validate form_item">
        <th style="width: 130px;">家庭或工作地址</th>
        <td>
          <div class="ipt">
            <input
              :disabled="isCertificationed"
              v-model="formData.workAddress"
              type="text"
              class="required"
              maxlength="200"
              data-valid="isNonEmpty||maxLength:200"
              data-error='家庭或工作地址不能为空'
            >
          </div>
        </td>
        <td class="form_msg"></td>
      </tr>
      <tr class="btns">
        <td></td>
        <td><button
            class="btn primary"
            @click="submitClick"
            :disabled="disabelSubmit"
            v-if="formData.certificationFlag!='02' && formData.certificationFlag!='03'"
          >提交审核</button>
          <button class="btn">取消</button></td>
      </tr>
    </table>
  </div>
</template>
<script>
module.exports = {
  inject: ['httpUser', 'httpUrl'],
  data: function () {
    return {
      formData: {
        identityType: '01',
        id: '',
        userId: '', // 用户id
        realName: '', // 真实姓名
        sex: '1', // 性别(字典表：sex)
        personalCertificateType: '', // 证件类型(字典表：personal_certificate_t
        personalCertificateCode: '', // 证件号码
        personalCertificateAttachmentId1: '', // 证件附件1Id
        personalCertificateAttachmentId2: '', // 证件附件2Id
        personalCertificateAttachment1: {},
        personalCertificateAttachment2: {},
        expireDate: '', // 到期时间
        workAddress: '', // 工作地址
        alwaysValidFlag: '0', // 长期有效标识(字典表：yes_no)
        attachmentIdUrl1: undefined,
        attachmentIdUrl2: undefined,
        certificationFlagDisplay: undefined,
        certificationFlag: undefined,
        version: '', // 版本号
      },
      isFile1Load: false,
      isFile2Load: false,
      provincePid: '',
      cityPid: '',
      districtPid: '',
      industrySelectList: [],
      servicesSelectList: [],
      fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
      uploadData: {
        system: 'ts'
      },
      uploadHeader: {},
      disabelSubmit: false
    }
  },
  computed: {
    /**
     * 验证是否通过
     */
    isCertificationed: function () {
      return this.formData.certificationFlag === '03';
    }
  },
  mounted: function () {
    this.initData();
  },
  created: function () {
    this.$watch('formData.alwaysValidFlag', function (val) {
      val === '1' && (this.formData.expireDate = '', this.clearMsg('expireDate'))
    }, {
        immediate: true,
        deep: true
      })
    this.$watch('formData.personalCertificateType', function (val) {
      val !== '01' && this.clearMsg('pcc')
    }, {
        immediate: true,
        deep: true
      })
  },
  methods: {
    initData: function () {
      var vm = this;
      this.httpUser.detailPersonAuthen().then(function (res) {
        vm.formData = $.extend(vm.formData, res.result);
        vm.formData.attachmentIdUrl1 = vm.formData.personalCertificateAttachment1.url;
        vm.formData.attachmentIdUrl2 = vm.formData.personalCertificateAttachment2.url;
        vm.formData.personalCertificateAttachmentId1 = vm.formData.personalCertificateAttachment1.id;
        vm.formData.personalCertificateAttachmentId2 = vm.formData.personalCertificateAttachment2.id;
        setTimeout(function () {
          laydate.render({
            elem: '#expireDate', //指定元素
            // value: vm.formData.expireDate,
            done: function (val) { //选择日期完毕的回调
              val && vm.clearMsg('expireDate')
              vm.formData.expireDate = val;
            }
          });
        }, 100)
      })
      this.httpUser.industrySelect().then(function (res) {
        vm.industrySelectList = res.result;
        $("#industrySelect").mySelect({
          mult: true,//true为多选,false为单选
          option: vm.industrySelectList,
          onChange: function (vals) {//选择框值变化返回结果
            vm.formData.industryIds = vals;
          }
        });
      })
      this.httpUser.servicesSelect().then(function (res) {
        vm.servicesSelectList = res.result;
        $("#servicesSelect").mySelect({
          mult: true,//true为多选,false为单选
          option: vm.servicesSelectList,
          onChange: function (vals) {//选择框值变化返回结果
            vm.formData.servicesIds = vals;
          }
        });
      })
    },
    clearMsg: function (code) {
      this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
    },
    submitClick: function () {
      var vm = this;
      // 异步获取验证信息
      $('.valiform').validate('submitValidate', function (val) {
        if (val && !vm.isSubmitDisabled) {
          vm.formData.alwaysValidFlag === '1' && (vm.formData.expireDate = '')
          vm.isSubmitDisabled = true
          vm.httpUser.updatePersonAuthen(vm.formData).then(function (resp) {
            if (resp.code === 'rest.success') {
              vm.$dialog.showToast('提交成功');
              vm.httpUser.detailPersonAuthen().then(function (res) {
                var formData = $.extend(vm.formData, res.result);
                vm.$set(vm, 'formData', formData);
              })
            }
          }).catch(function () {
            vm.isSubmitDisabled = false
          })
        }
      });
    },
    file2: function () {
      this.isFile2Load = true
    },
    file1: function () {
      this.isFile1Load = true
    },
    /**
     * 图片上传回调
     */
    cimgUploadSuccess (successInfo) {
      if (successInfo.exp.type === 'mainPhoto') {
        this.formData.personalCertificateAttachmentId1 = successInfo.data.id;
        this.formData.attachmentIdUrl1 = successInfo.data.url;
        this.isFile1Load = false
      } else {
        this.formData.personalCertificateAttachmentId2 = successInfo.data.id;
        this.formData.attachmentIdUrl2 = successInfo.data.url;
        this.isFile2Load = false
      }
    },
    /**
     * 到期时间验证
     */
    expireDateValid (v, o, callback) {
      var vm = this;
      setTimeout(function () {
        v = vm.formData.expireDate;
        if (vm.formData.alwaysValidFlag == '1' || (v && v != '')) {
          callback(o)
        } else {
          callback(o, '证件到期时间不能为空');
        }
      }, 1000)
    },
  }
}
</script>

<style scoped>
</style>
