<template>
  <div class="iptbox">
    <!--国家-->
    <label class="inline expsltlb w100">
      <select
        class="expslt"
        v-model="country"
      >
        <option
          v-for="(item, index) in countryList"
          v-text="item.display"
          :key="index"
          :value="item.value"
        ></option>
      </select>
    </label>
    <!--省-->
    <label class="inline expsltlb w100">
      <select
        class="expslt"
        v-model="province"
      >
        <option
          v-for="(item, index) in provinceList"
          :value="item.value"
          :key="index"
          v-text="item.display"
        ></option>
      </select>
    </label>
    <!--市-->
    <label class="inline expsltlb w100">
      <select
        class="expslt"
        v-model="city"
      >
        <option
          v-for="(item, index) in cityList"
          :value="item.value"
          :key="index"
          v-text="item.display"
        ></option>
      </select>
    </label>
    <!--区-->
    <label class="inline expsltlb w100">
      <select
        class="expslt"
        v-model="district"
      >
        <option
          v-for="(item, index) in districtList"
          :value="item.value"
          :key="index"
          v-text="item.display"
        ></option>
      </select>
    </label>
    <span
      class="exbtn"
      v-if="ismap"
      @click="selectMap"
    >选择</span>
    <span
      class="vlt form_msg"
      style="width:200px;"
    ></span>
  </div>
</template>
<script>
module.exports = {
  props: ['http', 'ismap'],
  data: function () {
    return {
      country: '',
      province: '',
      city: '',
      district: '',
      countryList: [], // 国家
      provinceList: [], // 省
      cityList: [], // 城市
      districtList: [], // 区,
      values: ['','','','']
    }
  },

  created: function () {
    this.initData();
  },
  watch: {
    country: function (val) {
      if (val !== '') {
        this.province = '';
        this.city = '';
        this.district = '';
        this.provinceList = [];
        this.cityList = [];
        this.districtList = [];
        this.countryList.length && this.getDic(1, this.getPId(0, val));
      }
    },
    province: function (val) {
      if (val !== '') {
        this.city = '';
        this.district = '';
        this.cityList = [];
        this.districtList = [];
        this.provinceList.length && this.getDic(2, this.getPId(1, val));
      }
    },
    city: function (val) {
      if (val !== '') {
        this.district = '';
        this.districtList = [];
        this.cityList.length && this.getDic(3, this.getPId(2, val));
      }
    }
  },
  methods: {
    initData: function () {
      this.getDic(0);
    },
    getDic: function (type, parentId, group) {
      var vm = this;
      this.$httpCom.dict({
        code: 'administrative_division',
        group: group,
        parentId: parentId
      }).then(function (res) {
        switch (type) {
          case 0: {
            vm.countryList = res.result;
            vm.country = res.result[0].value;
            break;
          }
          case 1: {
            vm.provinceList = res.result;
            vm.values[1] && (vm.province = vm.values[1]);
            break;
          }
          case 2: {
            vm.cityList = res.result;
            vm.values[2] && (vm.city = vm.values[2]);
            break;
          }
          case 3: {
            vm.districtList = res.result;
            vm.values[3] && (vm.district = vm.values[3]);
            break;
          }
        }
      })
    },
    getPId: function (type, value) {
      var id = ''
      switch (type) {
        case 0:
          this.countryList.some(function (p){
            if (p.value === value) {
              id = p.id
              return true
            }
          })
        break;
        case 1:
          this.provinceList.some(function (p){
            if (p.value === value) {
              id = p.id
              return true
            }
          })
          this.values[1] = ''
        break;
        case 2:
          this.cityList.some(function (p){
            if (p.value === value) {
              id = p.id
              return true
            }
          })
          this.values[2] = ''
        break;
      }
      console.log(id)
      return id
    },
    getSelected: function () {
      return [this.country || '', this.province || '', this.city || '', this.district || ''];
    },
    setValues: function (values) {
      this.values = JSON.parse(JSON.stringify(values))
      this.$nextTick(function(){
        this.getDic(0);
      })
    },
    /**
     * 地图选择
     */
    selectMap: function () {
      this.$emit("selectmap");
    },
    reSet: function () {
      this.country = '100'
      this.province = ''
      this.city = ''
      this.district = ''
      this.values = []
      this.getDic(1, '0');
    }
  }
}
</script>

<style scoped>
</style>
