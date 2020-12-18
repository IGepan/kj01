<template>
  <div class="setcontent active">
    <div class="addexperience">
      <span class="experience"><i class="iconfont icon-gongzuojingli"></i>工作经历</span>
      <button
        class="addexp"
        id="addworkexp"
        @click="isAddActive=true"
      >添加工作经历+</button>
    </div>
    <div
      class="experienceform active"
      :class="{ valiform :workValiform}"
      id="workexp"
      v-if='isAddActive'
    >
      <div class="expitem form_item">
        <span class="expname"><i>*</i>工作单位：</span>
        <input
          maxlength="50"
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="工作单位不能为空"
          v-model="workFormData.company"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>起止时间：</span>
        <div class="iptbox">
          <input
            style="width:184px"
            class="timeipt required"
            data-valid="custom: timeValid"
            v-model="workFormData.startTime"
            type="text"
            id="startTime"
          >
          <span class="expz">至</span>
          <input
            style="width:184px"
            class="timeipt required"
            data-valid="custom: timeValid"
            v-model="workFormData.endTime"
            type="text"
            id="endTime"
          >
          <span class="vlt form_msg"></span>
        </div>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>工作职位：</span>
        <input
          maxlength="50"
          type="text"
          class="expipt required"
          v-model="workFormData.jobTitle"
          data-valid="isNonEmpty"
          data-error="工作职位不能为空"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>工作描述：</span>
        <div class="iptbox">
          <div
            class="exptext"
            style="width: 411px;"
          >
            <textarea
              data-valid="isNonEmpty"
              data-error="工作描述不能为空"
              maxlength="1000"
              v-model="workFormData.comment"
              style="height:100%"
              class="exptextarea required"
              name=""
              id=""
              cols="30"
              rows="10"
              placeholder="描述你的职责范围，工作任务及取得的成绩等"
            ></textarea>
            <span
              class="textnum"
              v-text="workFormData.comment.length+'/1000'"
            ></span>
          </div>
          <span class="vlt form_msg"></span>
        </div>
      </div>
      <div class="workexpbtn">
        <button
          class="work-save"
          :disabled="isSubmitDisabled"
          @click="saveWorkClick"
        >保存</button>
        <button
          class="work-cancel"
          id="workcancel"
          @click="ceiWorkClick()"
        >取消</button>
      </div>
    </div>
    <div
      class="explist"
      v-if='workList.length>0'
    >
      <div
        class="elist"
        v-for="item in workList"
      >
        <div class="fr edit">
          <i
            class="iconfont icon-xiugai mr10"
            @click="editClick(item)"
          ></i>
          <i
            class="iconfont icon-remove-1-copy"
            @click="delClick(item)"
          ></i>
        </div>
        <div class="expdesc">
          <span
            class="expft"
            v-text="item.startTime+'-'+item.endTime"
          ></span>
          <span
            class="expbft"
            v-text="item.company"
          ></span>
          <span
            class="expbft"
            v-text="item.jobTitle"
          ></span>
        </div>
        <div class="expworkdesc">
          <span>工作描述：</span>
          <div
            class="describe"
            v-text="item.comment"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="expnothing"
      v-else
    >
      <i class="iconfont icon-tishi"></i>您还没有上传工作经历，请尽快完善 </div>
    <!--教育经历-->
    <div class="addexperience">
      <span class="experience"><i class="iconfont icon-jiaoyujingli"></i>教育经历</span>
      <button
        class="addexp"
        @click="isEduAddActive = true"
      >添加教育经历+</button>
    </div>
    <!--表单-->
    <div
      class="experienceform active"
      :class="{ valiform :eduValiform}"
      v-if='isEduAddActive'
      id="workexp"
    >
      <div class="expitem form_item">
        <span class="expname"><i>*</i>毕业院校：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="毕业院校不能为空"
          v-model="eduFormData.university"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>专业：</span>
        <input
          type="text"
          class="expipt required"
          data-valid="isNonEmpty"
          data-error="专业不能为空"
          v-model="eduFormData.major"
        >
        <span class="vlt form_msg"></span>
      </div>
      <div class="expitem">
        <span class="expname"><i>*</i>学历：</span>
        <ly-select
          style="display: inline-block;"
          class="expipt"
          v-model="eduFormData.degree"
          code='degree'
          :http='httpStore'
        ></ly-select>
      </div>
      <div class="expitem form_item">
        <span class="expname"><i>*</i>起止时间：</span>
        <div class="iptbox">
          <input
            style="width:184px"
            data-valid="custom: timeValid"
            class="timeipt required"
            v-model="eduFormData.startTime"
            type="text"
            id="eduStartTime"
          >
          <span class="expz">至</span>
          <input
            style="width:184px"
            data-valid="custom: timeValid"
            class="timeipt required"
            v-model="eduFormData.endTime"
            type="text"
            id="eduEndTime"
          >
          <span class="vlt form_msg"></span>
        </div>
      </div>
      <div class="workexpbtn">
        <button
          class="work-save"
          :disabled="isSubmitDisabled"
          @click="saveEduClick"
        >保存</button>
        <button
          class="work-cancel"
          id="workcancel"
          @click="ceiEduClick()"
        >取消</button>
      </div>
    </div>
    <div
      class="explist"
      v-if='eduList.length>0'
    >
      <div
        class="elist"
        v-for="item in eduList"
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
            v-text="item.startTime+'-'+item.endTime"
          ></span>
          <span
            class="expbft"
            v-text="item.university"
          ></span>
          <span
            class="expbft"
            v-text="item.major"
          ></span>
        </div>
        <div class="expworkdesc">
          <span>学历：</span>
          <div
            class="describe"
            v-text="item.degreeDisplay"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="expnothing"
      v-else
    >
      <i class="iconfont icon-tishi"></i>您还没有上传教育经历，请尽快完善 </div>
  </div>
</template>
<script>
module.exports = {
  inject: ['httpStore'],
  data: function () {
    return {
      isEduAddActive: false,
      isAddActive: false,
      isSubmitDisabled: false,
      workFormData: {
        company: '', //	工作单位
        jobTitle: '', // 工作职位
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        comment: '' // 工作描述
      },
      workValiform: true,
      eduValiform: true,
      eduFormData: {
        university: '', // 毕业院校
        major: '', // 专业
        degree: '', // 学历(字典表：degree)
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      workList: [],
      eduList: []
    }
  },
  watch: {
    isAddActive: function (val) {
      if (val) {
        this.$nextTick(function () {
          this.initTime();
          this.workValiform = true
          this.eduValiform = false
        })
      }
    },
    isEduAddActive: function (val) {
      if (val) {
        this.$nextTick(function () {
          this.initTime();
          this.workValiform = false
          this.eduValiform = true
        })
      }
    }
  },
  mounted () {
    this.initData();
  },
  methods: {
    initData: function () {
      this.initTime();
      this.workSelectByVo();
      this.eduSelectByVo();
    },
    initTime: function () {
      var vm = this;
      laydate.render({
        elem: '#startTime', //指定元素
        type: 'month',
        value: vm.workFormData.startTime,
        done: function (val) { //选择日期完毕的回调
          vm.workFormData.startTime = val;
        },
      });
      laydate.render({
        elem: '#endTime', //指定元素
        type: 'month',
        value: vm.workFormData.endTime,
        done: function (val) { //选择日期完毕的回调
          vm.workFormData.endTime = val;
        },
      });
      laydate.render({
        elem: '#eduStartTime', //指定元素
        type: 'month',
        value: vm.eduFormData.startTime,
        done: function (val) { //选择日期完毕的回调
          vm.eduFormData.startTime = val;
        },
      });
      laydate.render({
        elem: '#eduEndTime', //指定元素
        type: 'month',
        value: vm.eduFormData.endTime,
        done: function (val) { //选择日期完毕的回调
          vm.eduFormData.endTime = val;
        },
      });
    },
    /**
     * 查询工作列表
     */
    workSelectByVo: function () {
      var vm = this;
      this.httpStore.workSelectByVo().then(function (res) {
        vm.workList = res.result;
      })
    },
    /**
     * 查询教育列表
     */
    eduSelectByVo: function () {
      var vm = this;
      this.httpStore.eduSelectByVo().then(function (res) {
        vm.eduList = res.result;
      })
    },
    /**
     * 新增教育经历
     */
    eduInsert: function () {
      var vm = this;
      this.workValiform = false;
      this.$nextTick(function () {
        !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
          vm.workValiform = true;
          // 验证成功
          if (val) {
            vm.isSubmitDisabled = true
            if (vm.eduFormData.id && vm.eduFormData.id !== '') {
              vm.httpStore.eduUpdate(vm.eduFormData).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('保存成功');
                  vm.resetEduFormData();
                  vm.eduSelectByVo();
                }
                vm.isSubmitDisabled = false
              }).catch(function () {
                vm.isSubmitDisabled = false
              })
            } else {
              vm.httpStore.eduInsert(vm.eduFormData).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('保存成功');
                  vm.resetEduFormData();
                  vm.eduSelectByVo();
                }
                vm.isSubmitDisabled = false
              }).catch(function () {
                vm.isSubmitDisabled = false
              })
            }
          }
        })
      })
    },
    /**
     * 新增工作经历
     */
    workInsert: function () {
      var vm = this;
      this.eduValiform = false;
      this.$nextTick(function () {
        !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
          // vm.eduValiform = true;
          // 验证成功
          if (val) {
            vm.isSubmitDisabled = true
            if (vm.workFormData.id && vm.workFormData.id !== '') {
              vm.httpStore.workUpdate(vm.workFormData).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('保存成功');
                  vm.resetWorkFormData();
                  vm.workSelectByVo();
                  vm.isSubmitDisabled = false
                } else {
                  vm.isSubmitDisabled = false
                }
              })
            } else {
              vm.httpStore.workInsert(vm.workFormData).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('保存成功');
                  vm.resetWorkFormData();
                  vm.workSelectByVo();
                  vm.isSubmitDisabled = false
                } else {
                  vm.isSubmitDisabled = false
                }
              })
            }
          }
        })
      })
    },
    saveWorkClick: function () {
      this.workInsert();
    },
    delClick: function (item) {
      var vm = this;
      this.$dialog.confirm({
        title: '提示',
        texts: '确定删除该经历？',
        callback: function () {
          vm.httpStore.workDel({
            id: item.id,
            version: item.version
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('删除成功');
              vm.workSelectByVo();
            }
          })
        }
      })
    },
    editClick: function (item) {
      var vm = this;
      this.httpStore.workInit({ id: item.id }).then(function (res) {
        var resData = res.result;
        vm.workFormData = resData;
        vm.isAddActive = true;
      })
    },
    delEduClick: function (item) {
      var vm = this;
      this.$dialog.confirm({
        title: '提示',
        texts: '确定删除该经历？',
        callback: function () {
          vm.httpStore.eduDel({
            id: item.id,
            version: item.version
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('删除成功');
              vm.eduSelectByVo();
            }
          })
        }
      })
    },
    editEduClick: function (item) {
      var vm = this;
      this.httpStore.eduinit({ id: item.id }).then(function (res) {
        var resData = res.result;
        vm.eduFormData = resData;
        vm.isEduAddActive = true;
      })
    },
    ceiWorkClick: function () {
      this.resetWorkFormData();
      this.isAddActive = false;
    },
    ceiEduClick: function () {
      this.resetEduFormData();
      this.isEduAddActive = false;
    },
    resetWorkFormData: function () {
      this.workFormData.id = '';
      this.workFormData.company = '';
      this.workFormData.jobTitle = '';
      this.workFormData.startTime = '';
      this.workFormData.endTime = '';
      this.workFormData.comment = ''
    },
    resetEduFormData: function () {
      this.eduFormData.id = '';
      this.eduFormData.university = ''; // 毕业院校
      this.eduFormData.major = '', // 专业
        this.eduFormData.degree = '', // 学历(字典表：degree)
        this.eduFormData.startTime = '', // 开始时间
        this.eduFormData.endTime = '' // 结束时间
    },
    saveEduClick: function () {
      this.eduInsert();
    },
    timeValid: function (v, o, callback) {
      var vm = this
      setTimeout(function () {
        var formData = vm.workFormData;
        if (vm.eduValiform) {
          formData = vm.eduFormData;
        }
        if (!formData.startTime || formData.startTime == '') {
          callback($(o).siblings('input')[0], '请选择开始时间')
        } else if (!formData.endTime || formData.endTime == '') {
          callback($(o).siblings('input')[0], '请选择结束时间')
        } else {
          callback(o)
          $(o).siblings('input').removeAttr('style')
        }
      }, 1500)
    },
  }
}
</script>

<style scoped>
</style>
