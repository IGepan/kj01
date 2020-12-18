<template>
	<div>
	<div class="form_title"> 单位认证信息 </div>
		<div style="margin-top: 20px;">
			<div class="form_item_title" style="width: 130px;">身份类型：</div>
			<div class="form_item_content">
				<ly-radio ref="navRef" @change='radioChange' class="radio" group='2' code='identity_type' :http='httpUser' v-model='formData.identityType'></ly-radio>
			</div>
		</div>
		<!--企业 start-->
		<table v-if="formData.identityType=='02'" border="0" cellpadding="5" cellspacing="5" class="form_table valiform" style="margin-top: 0px;">
			<tr class="validate">
          <th>认证状态</th>
          <td>
            <div style="font-size: 14px;" v-text="formData.certificationFlagDisplay || '未认证'">
            </div>
          </td>
      </tr>
			<tr class="validate form_item">
				<th>企业名称</th>
				<td>
					<div class="ipt">
						<input placeholder="请填写与组织机构代码证上一致的名称" v-model="formData.organizationName" type="text" class="required"
								data-valid="isNonEmpty||maxLength:50" data-error='请输入企业名称||内容过长'>
					</div>
				</td>
				<td class="form_msg" v-if="formData.identityType=='02'"></td>
			</tr>
			<tr class="form_item" :class="{validate: formData.unifiedCode}">
				<th>营业执照注册号<br>(统一社会信用代码)</th>
				<td>
					<div class="ipt">
						<input v-model="formData.unifiedCode" type="text" :class="{required: formData.unifiedCode}" data-valid="isNonEmpty||maxLength:30" data-error='请输入营业执照注册号||内容过长'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>营业期限</th>
				<td>
					<div class="ipt date"  style="width: 190px" >
						<input ref="businessEl" v-model="formData.businessDuration" type="text" id="business" class="required"
							data-valid="custom:businessValid">
					</div>
          <div class="ipt"  style="width: 20px;font-size: 14px;font-weight: 400;vertical-align: middle;text-align: center;" >至</div>
          <div class="ipt date"  style="width: 190px" >
              <input v-model="formData.businessDurationTo" type="text" id="businessend" >
					</div>
				</td>
				<td ref="businessMsg" class="form_msg">结束时间不填为永久</td>
			</tr>
			<tr class="validate form_item">
				<th style="width: 130px;">营业执照所在地</th>
				<td>
					<ly-address-select class='required' data-valid="custom:addressValid" ref='addressRef' :http='httpUser'></ly-address-select>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>常用地址</th>
				<td>
					<div class="ipt">
						<input v-model="formData.commonLocation" type="text" class="required" data-valid="isNonEmpty" data-error='请输入常用地址'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>联系人</th>
				<td>
					<div class="ipt">
						<input v-model="formData.contacts" type="text" class="required" data-valid="isNonEmpty" data-error='请输入联系人'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>联系电话</th>
				<td>
					<div class="ipt">
						<input v-model="formData.contactsPhone" maxlength="11" type="text" class="required" data-valid="isNonEmpty" data-error='请输入联系电话'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="form_item" :class="{validate: !formData.unifiedCode}">
				<th>组织机构代码证</th>
				<td>
					<div class="ipt">
						<input v-model="formData.organizationCode" type="text" :class="{required: !formData.unifiedCode}" data-valid="isNonEmpty" data-error='请输入组织机构代码证'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="form_item">
				<th>证件扫描件</th>
				<td>
			<!--		<div class="head required"  :class="{loading: isFile2Load}" v-viewer  data-valid="custom:certificatImgsValid"
						:style="{backgroundImage: formData.attachmentIdUrl?'url('+formData.attachmentIdUrl+')':'url(/common/images/defaultImg/default_businesslicense.jpg)'}">
            <img
              :src="formData.attachmentIdUrl || '/common/images/defaultImg/default_businesslicense.jpg'"
              class="opacityZero"
            ></div>-->
					<div class="head"  :class="{loading: isFile2Load}" v-viewer
						 :style="{backgroundImage: formData.attachmentIdUrl?'url('+formData.attachmentIdUrl+')':''}">
						<img
								:src="formData.attachmentIdUrl"
								class="opacityZero"
						></div>
					<label class="exbtn">
						<ly-upload :exp="{type: 'secrecy'}" @upstart="file2" @success='cimgUploadSuccess'
							style="position: absolute;right: 10000px;" accept="image/*" type='file' :header='uploadHeader'
							:url='fileUploadUrl' :data='uploadData'>
						</ly-upload>
						<span class="exbtn">上传</span>
					</label><i>您可以上传营业执照或单位用户入驻备案信息表</i></td>
				<td class="form_msg"></td>
			</tr>

		</table>
		<div class="form_title" v-if="formData.identityType=='02'">
			法人信息
		</div>
		<table v-if="formData.identityType=='02'" border="0" cellpadding="5" cellspacing="5" class="form_table valiform" style="margin-top: 0px;">
			<tr class="form_item">
				<th style="width: 130px;">法定代表人</th>
				<td>
					<div class="ipt">
						<input v-model="formData.legalPersonName" type="text">
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr>
				<th>证件类型</th>
				<td>
					<ly-select v-model='formData.legalPersonCertificatType' class='select name' code='personal_certificate_type' :http='httpUser'></ly-select>
				</td>
			</tr>
			<tr class="form_item">
				<th>证件号码</th>
				<td>
					<div class="ipt">
						<input v-model="formData.legalPersonCertificatCode" type="text">
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="form_item">
				<th>证件到期时间</th>
				<td>
					<div class="radio">
						<label>
							<input type="radio" name="'radio_time" value="0" checked v-model="formData.alwaysValidFlag"/>
							<b></b>
						</label>
					</div>
					<div class="radio_date date">
						<input ref="expireDateEl" :disabled="formData.alwaysValidFlag === '1'" v-model="formData.expireDate" type="text" id="expireDate1"/>
					</div>
					<div class="radio" style="margin-left: 40px;">
						<label>
							<input type="radio" name="'radio_time" value="1" v-model="formData.alwaysValidFlag"/>
							<b></b>长期有效
						</label>
					</div>

				</td>
				<td ref="expireDateMsg" class="form_msg"></td>
			</tr>
			<tr class="btns">
				<td></td>
				<td><button class="btn primary" :disabled="isSubmitDisabled" @click="submitClick" v-if='!disabelSubmit' >提交审核</button>
					<button class="btn">取消</button></td>
			</tr>
		</table>
		<!--/企业-->
		<!--高校-->
		<table v-if="formData.identityType=='03'" border="0" cellpadding="5" cellspacing="5" class="form_table valiform" style="margin-top: 0px;">
			<tr class="validate">
          <th>认证状态</th>
          <td>
            <div style="font-size: 14px;" v-text="formData.certificationFlagDisplay || '未认证'">

            </div>
          </td>
        </tr>
			<tr class="validate form_item">
				<th>机构名称</th>
				<td>
					<div class="ipt">
						<input v-model="formData.organizationName" type="text" class="required" data-tip="" data-valid="isNonEmpty||maxLength:20" data-error='请输入高校名||内容过长'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th style="width: 125px;">组织机构代码证</th>
				<td>
					<div class="ipt">
						<input v-model="formData.organizationCode" type="text" class="required" data-valid="isNonEmpty" data-error='请输入组织机构代码证'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>证件所在地</th>
				<td>
					<ly-address-select class='required' data-valid="custom:addressValid" ref='addressRef' :http='httpUser'></ly-address-select>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>常用地址</th>
				<td>
					<div class="ipt">
						<input v-model="formData.commonLocation" type="text" class="required" data-valid="isNonEmpty" data-error='请输入常用地址'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="form_item">
				<th>证件扫描件</th>
				<td>
					<div class="head"  :class="{loading: isFile2Load}" v-viewer
						:style="{backgroundImage: formData.attachmentIdUrl?'url('+formData.attachmentIdUrl+')':''}">
            <img
              :src="formData.attachmentIdUrl || '/common/images/defaultImg/default_businesslicense.jpg'"
              class="opacityZero"
            >
          </div>
					<label class="exbtn">
						<ly-upload :exp="{type: 'secrecy'}" @upstart="file2" @success='cimgUploadSuccess'
							style="position: absolute;right: 10000px;" type='file' accept="image/*" :header='uploadHeader'
							:url='fileUploadUrl' :data='uploadData'>
						</ly-upload>
						<span class="exbtn">上传</span>
					</label><i>您可以上传营业执照或单位用户入驻备案信息表</i></td>
				<td class="form_msg"></td>
			</tr>
			<tr class="btns">
				<td></td>
				<td><button class="btn primary" :disabled="isSubmitDisabled" @click="submitClick" v-if='!disabelSubmit'>提交审核</button>
					<button class="btn">取消</button></td>
			</tr>
		</table>
		<!--科研-->
		<table v-if="formData.identityType=='04'" border="0" cellpadding="5" cellspacing="5" class="form_table valiform" style="margin-top: 0px;">
			<tr class="validate">
          <th>认证状态</th>
          <td>
            <div style="font-size: 14px;" v-text="formData.certificationFlagDisplay || '未认证'">

            </div>
          </td>
        </tr>
			<tr class="validate form_item">
				<th>机构名称</th>
				<td>
					<div class="ipt">
						<input v-model="formData.organizationName" type="text" class="required" data-tip="" data-valid="isNonEmpty||maxLength:20" data-error='请输入高校名||内容过长'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th style="width: 125px;">组织机构代码证</th>
				<td>
					<div class="ipt">
						<input v-model="formData.organizationCode" type="text" class="required" data-valid="isNonEmpty" data-error='请输入组织机构代码证'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>证件所在地</th>
				<td>
					<ly-address-select class='required' data-valid="custom:addressValid" ref='addressRef' :http='httpUser'></ly-address-select>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>常用地址</th>
				<td>
					<div class="ipt">
						<input v-model="formData.commonLocation" type="text" class="required" data-valid="isNonEmpty" data-error='请输入常用地址'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="form_item">
				<th>证件扫描件</th>
				<td>
					<div class="head" :class="{loading: isFile2Load}" v-viewer
						:style="{backgroundImage: formData.attachmentIdUrl?'url('+formData.attachmentIdUrl+')':''}">
            <img
              :src="formData.attachmentIdUrl"
              class="opacityZero"
            ></div>
					<label class="exbtn">
						<ly-upload :exp="{type: 'secrecy'}" @upstart="file2" @success='cimgUploadSuccess'
							style="position: absolute;right: 10000px;" type='file' accept="image/*" :header='uploadHeader'
							:url='fileUploadUrl' :data='uploadData'>
						</ly-upload>
						<span class="exbtn">上传</span>
					</label><i>您可以上传营业执照或单位用户入驻备案信息表</i></td>
				<td class="form_msg"></td>
			</tr>
			<tr class="btns">
				<td></td>
				<td><button class="btn primary" :disabled="isSubmitDisabled" @click="submitClick" v-if='!disabelSubmit'>提交审核</button>
					<button class="btn">取消</button></td>
			</tr>
		</table>
		<!--政府-->
		<table v-if="formData.identityType=='05'" border="0" cellpadding="5" cellspacing="5" class="form_table valiform" style="margin-top: 0px;">
			<tr class="validate">
          <th>认证状态</th>
          <td>
            <div style="font-size: 14px;" v-text="formData.certificationFlagDisplay || '未认证'">

            </div>
          </td>
        </tr>
			<tr class="validate form_item">
				<th>机构名称</th>
				<td>
					<div class="ipt">
						<input v-model="formData.organizationName" type="text" class="required" data-tip="" data-valid="isNonEmpty||maxLength:20" data-error='请输入高校名||内容过长'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th style="width: 125px;">组织机构代码证</th>
				<td>
					<div class="ipt">
						<input v-model="formData.organizationCode" type="text" class="required" data-valid="isNonEmpty" data-error='请输入组织机构代码证'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>证件所在地</th>
				<td>
					<ly-address-select class='required' data-valid="custom:addressValid" ref='addressRef' :http='httpUser'></ly-address-select>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="validate form_item">
				<th>常用地址</th>
				<td>
					<div class="ipt">
						<input v-model="formData.commonLocation" type="text" class="required" data-valid="isNonEmpty" data-error='请输入常用地址'>
					</div>
				</td>
				<td class="form_msg"></td>
			</tr>
			<tr class="form_item">
				<th>证件扫描件</th>
				<td>
					<div class="head"  :class="{loading: isFile2Load}" v-viewer
						:style="{backgroundImage: formData.attachmentIdUrl?'url('+formData.attachmentIdUrl+')':''}">
          <img
              :src="formData.attachmentIdUrl"
              class="opacityZero"
            >
          </div>
					<label class="exbtn">
						<ly-upload :exp="{type: 'secrecy'}" @upstart="file2" @success='cimgUploadSuccess'
							style="position: absolute;right: 10000px;" type='file' accept="image/*" :header='uploadHeader'
							:url='fileUploadUrl' :data='uploadData'>
						</ly-upload>
						<span class="exbtn">上传</span>
					</label>
						<i>您可以上传营业执照或单位用户入驻备案信息表</i></td>
				<td class="form_msg"></td>
			</tr>
			<tr class="btns">
				<td></td>
				<td><button class="btn primary" :disabled="isSubmitDisabled" @click="submitClick" v-if='!disabelSubmit'>提交审核</button>
					<button class="btn">取消</button></td>
			</tr>
		</table>
	</div>
</template>
<script>
	module.exports = {
		inject: ['httpUser', 'httpUrl'],
		data: function() {
			return {
				disabelSubmit: false,
        isSubmitDisabled: false,
				fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
				uploadData: {
					system: 'ts'
				},
				uploadHeader: {},
				formData: {
					identityType: '02',
					id: '', //
					saasId: '', //
					userId: '', //	用户Id
					organizationName: '', // 机构名称
					organizationType: '', // 机构类型(字典表:organization_type)
					academyType: '', // 院校分类(字典表:academy_type)
					scale: '', // 规模(字典表:scale)
					parentUnit: '', // 归属单位
					establishDate: '', // 成立时间
					contacts: '', // 联系人
					contactsPhone: '', // 联系人手机
					unifiedCode: '', // 统一社会信用代码
					organizationCode: '', // 组织机构代码证
					certificatImgs: [], // 证件图片
					attachmentIdUrl: undefined,
          businessDuration: '', // 营业年限
          businessDurationTo: '',
					certificatCountry: '', // 证件所在地国家(字典表:administrati
					certificatProvince: '', // 证件所在地省份(字典表:administrative_
					certificatCity: '', // 证件所在地城市(字典表:administrative_division)
					certificatDistrict: '', // 证件所在地区县(字典表:administrative_division)
					commonLocation: '', // 常用地址
					legalPersonName: '', // 法人姓名
					legalPersonCertificatType: '', // 法人证件类型(字典表：certificate_type)
					legalPersonCertificatCode: '', // 法人证件号码
					alwaysValidFlag: '0', // 长期有效标识(字典表：yes_no)
					expireDate: '', // 到期时间
					version: '' // 版本号
				},
				copyFormData: {}, // 用于重置数据
				provincePid: '',
				cityPid: '',
				districtPid: '',
				industrySelectList: [],
				servicesSelectList: [],
				isFile2Load: false
			}
		},
		mounted() {
			this.copyFormData = JSON.parse(JSON.stringify(this.formData));
			this.initData();
    },
    watch: {
    },
    created: function () {
      this.$watch('formData.alwaysValidFlag', function (val) {
          val === '1' && (this.formData.expireDate = '', this.clearMsg('expireDate'))
        }, {
          immediate: true,
          deep: true
      })
    },
		methods: {
			initData(){
				var vm = this;
				vm.httpUser.detailEnterpriseAuthen().then(function(res){
					vm.formData = $.extend(vm.formData, res.result);
					if(vm.formData.certificatImgs[0]) {
						vm.formData.attachmentIdUrl = vm.formData.certificatImgs[0].url;
					}
					if(vm.formData.certificatImgs[0]) {
						vm.formData.certificatImgs = [vm.formData.certificatImgs[0].id];
					}
					laydate.render({
						elem: '#business', //指定元素
						value: vm.formData.businessDuration,
            done: function (val) { //选择日期完毕的回调
              val && vm.clearMsg('business')
							vm.formData.businessDuration = val;
						},
          });
          laydate.render({
						elem: '#businessend', //指定元素
						value: vm.formData.businessDurationTo === '9999-12-31' ? '' : vm.formData.businessDurationTo,
            done: function (val) { //选择日期完毕的回调
							vm.formData.businessDurationTo = val;
						},
					});
					laydate.render({
						elem: '#expireDate1', //指定元素
						value: vm.formData.expireDate,
            done: function (val) { //选择日期完毕的回调
              val && vm.clearMsg('expireDate')
							vm.formData.expireDate = val;
						},
					});
					vm.$nextTick(function() {
						vm.initAddress();
						// 审核失败、审核中不让切换
						var certificationFlagArray = ['03', '02', '01', '04'];
						// if(certificationFlagArray.indexOf(vm.formData.certificationFlag) != -1) {
						// 	var navRadioRef = vm.$refs.navRef;
						// 	if(navRadioRef) {
						// 		navRadioRef.setDisabeld();
						// 	}
						// }
						if(['03', '02'].indexOf(vm.formData.certificationFlag) != -1){
							vm.disabelSubmit = true;
						}
						if(res.result.identityType) {
							var navRadioRef = vm.$refs.navRef;
							if(navRadioRef) {
								navRadioRef.setDisabeld();
							}
						}
					})
				})
				vm.httpUser.servicesSelect().then(function(res){
					vm.servicesSelectList = res.result;
					$("#servicesSelect").mySelect({
						mult:true,//true为多选,false为单选
						option: vm.servicesSelectList,
						onChange:function(vals){//选择框值变化返回结果
							vm.formData.servicesIds = vals;
						}
					});
				})
			},
			/**
			 * 初始化地址
			 */
			initAddress: function(){
				var addressArr = this.$refs.addressRef;
				if(addressArr) {
					addressArr.setValues([this.formData.certificatCountry, this.formData.certificatProvince, this.formData.certificatCity, this.formData.certificatDistrict]);
				}
			},
			/**
			 * 地址验证
			 */
			addressValid: function(v, o, callback) {
				var vm = this;
				setTimeout(function() {
					vm.getAddressValue();
					if(vm.formData.certificatCountry == '' || vm.formData.certificatProvince == '') {
						callback(o, '请选择营业执照所在地');
					} else {
						callback(o);
					}
				},500)
			},
			/**
			 * 到期时间验证
			 */
			expireDateValid: function(v, o, callback){
				var vm = this;
				setTimeout(function(){
					v = vm.formData.expireDate;
					if( vm.formData.alwaysValidFlag == '1' ||  (v && v != '')) {
						callback(o)
					}else {
						callback(o, '证件到期时间不能为空');
					}
				}, 1000)
			},
			/**
			 * 证件图片验证
			 */
			certificatImgsValid: function(v, o, callback) {
				if(this.formData.certificatImgs && this.formData.certificatImgs.length >0) {
					callback(o);
				}else {
					callback(o, '请上传证件扫描件');
				}
			},
			/**
			 * 营业年限校验
			 */
			businessValid: function(v, o, callback) {
				var vm = this;
				setTimeout(function(){
					v = $('#business').val();
					if( v && v != '') {
						callback(o)
					}else {
						callback(o, '营业年限不能为空');
					}
				},1000)
			},
			getAddressValue: function() {
				var addressArr = this.$refs.addressRef.getSelected();
				this.formData.certificatCountry = addressArr[0];
				this.formData.certificatProvince = addressArr[1];
				this.formData.certificatCity = addressArr[2];
				this.formData.certificatDistrict = addressArr[3];
			},
			submitClick: function(){
				var vm = this;
				// 异步获取验证信息
				$('.valiform').validate('submitValidate', function(val) {
					// 验证成功
					if(val && !vm.isSubmitDisabled) {
            vm.formData.alwaysValidFlag === '1' && (vm.formData.expireDate = '')
            vm.isSubmitDisabled = true
						vm.httpUser.updateSchoolAuthen(vm.formData).then(function(resp){
							if(resp.code === 'rest.success') {
								vm.$dialog.showToast('提交成功');
								vm.httpUser.detailEnterpriseAuthen().then(function(res){
									var formData = $.extend(vm.formData, res.result);
									vm.$set(vm, 'formData', formData);
									if(['03', '02'].indexOf(vm.formData.certificationFlag) != -1){
										vm.disabelSubmit = true;
									}
								})
							}
						}).catch(function () {
              vm.isSubmitDisabled = false
            })
					}
				});
      },
      clearMsg: function (code) {
        this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '',this.$refs[code + 'El'].style = '')
      },
			file2: function () {
				this.isFile2Load = true
			},
			cimgUploadSuccess: function(successInfo) {
				this.formData.certificatImgs = [successInfo.data.id];
				this.formData.attachmentIdUrl = successInfo.data.url;
				this.isFile2Load = false
			},
			radioChange: function(val) {
				this.copyFormData.identityType = this.formData.identityType;
				this.formData = JSON.parse(JSON.stringify(this.copyFormData));
				this.$nextTick(function(){
					$('.valiform').validate('clear');
					$(".edithead").imgUploader({
						size: "300,300",
						prev: "head",
						url: this.httpUrl.imgUploadUrl + '/file/resource/uploadImg'
					});
					this.initAddress();
				})
			}
		}
	}
</script>

<style scoped>

</style>
