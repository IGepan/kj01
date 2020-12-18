<template>
  <div>
    <!--国家-->
    <label class="inline expsltlb w100">
      <select
        class="expslt"
        v-model="country"
      >
        <option
          :value="index"
          v-for="(item, index) in countryList"
          v-text="item.display"
        ></option>
      </select>
    </label>
    <!--省-->
    <label class="inline expsltlb">
      <select
        v-model="province"
        class="expslt"
      >
        <option
          :value="index"
          v-for="(item, index) in provinceList"
          v-text="item.display"
        ></option>
      </select>
    </label>
    <!--市-->
    <label class="inline expsltlb">
      <select
        v-model="city"
        class="expslt"
      >
        <option
          :value="index"
          v-for="(item, index) in cityList"
          v-text="item.display"
        ></option>
      </select>
    </label>
    <!--区-->
    <label class="inline expsltlb">
      <select
        v-model="district"
        class="expslt"
      >
        <option
          :value="index"
          v-for="(item, index) in districtList"
          v-text="item.display"
        ></option>
      </select>
    </label>
    <span class="vlt form_msg"></span>
  </div>

</template>

<script>
module.exports = {
  props: ['http', 'value'],
  data: function () {
    return {
      country: undefined,
      province: undefined,
      city: undefined,
      district: undefined,
      countryList: [], // 国家
      provinceList: [], // 省
      cityList: [], // 城市
      districtList: [], // 区
      mValue: this.value,
      values: [], // 初始化显示的值
    }
  },

  created: function () {
    this.initData();
  },
  watch: {
    value (val) {
      this.mValue = val;
    },
    mValue (val) {
      this.$emit("input", val);
    },
    country: function (val) {
      if (val != undefined) {
        this.province = undefined;
        this.city = undefined;
        this.district = undefined;
        this.provinceList = [];
        this.cityList = [];
        this.districtList = [];
        this.getDic(1, this.countryList[val].id);
      }
    },
    province (val) {
      if (val != undefined) {
        this.city = undefined;
        this.district = undefined;
        this.cityList = [];
        this.districtList = [];
        this.getDic(2, this.provinceList[val].id);
      }
    },
    city (val) {
      if (val != undefined) {
        this.district = undefined;
        this.districtList = [];
        this.getDic(3, this.cityList[val].id);
      }
    },
    district (val) { }
  },
  methods: {
    initData: function () {
      this.getDic(0);
    },
    getDic (type, parentId, group) {
      var vm = this;
      this.http.dict({
        code: 'administrative_division',
        group: group,
        parentId: parentId
      }).then(function (res) {
        switch (type) {
          case 0: {
            vm.countryList = res.result;
            var isReset = true;
            // 初始化赋值
            if (vm.values[0] && vm.values[0] != '') {
              for (var index in vm.countryList) {
                if (vm.countryList[index].value == vm.values[0]) {
                  vm.country = index;
                  vm.values[0] == '';
                  isReset = false
                  return;
                }
              }
            }
            if (res.result[0] && isReset) {
              vm.getDic(1, vm.countryList[0].id);
            }
            vm.country = 0;
            break;
          }
          case 1: {
            var isReset = true;
            vm.provinceList = res.result;
            // 初始化赋值
            if (vm.values[1] && vm.values[1] != '') {
              for (var index1 in vm.provinceList) {
                if (vm.provinceList[index1].value == vm.values[1]) {
                  vm.province = index1;
                  vm.values[1] == '';
                  isReset = false;
                  return;
                }
              }
            }
            if (res.result[0] && isReset) {
              vm.getDic(2, vm.provinceList[0].id);
            }
            break;
          }
          case 2: {
            var isReset = true;
            vm.cityList = res.result;
            // 初始化赋值
            if (vm.values[2] && vm.values[2] != '') {
              for (var index2 in vm.cityList) {
                if (vm.cityList[index2].value == vm.values[2]) {
                  vm.city = index2;
                  vm.values[2] == '';
                  isReset = false;
                  return;
                }
              }
            }
            if (res.result[0] && isReset) {
              vm.getDic(3, vm.cityList[0].id);
            }
            break;
          }
          case 3: {
            vm.districtList = res.result;
            // 初始化赋值
            if (vm.values[3] && vm.values[3] != '') {
              for (var index3 in vm.districtList) {
                if (vm.districtList[index3].value == vm.values[3]) {
                  vm.district = index3;
                  vm.values[3] == '';
                  return;
                }
              }
            }
            break;
          }
        }
      })
    },
    getSelected: function () {
      var country = this.countryList[this.country] ? this.countryList[this.country].value : '';
      var province = this.provinceList[this.province] ? this.provinceList[this.province].value : '';
      var city = this.cityList[this.city] ? this.cityList[this.city].value : '';
      var district = this.districtList[this.district] ? this.districtList[this.district].value : '';
      return [country, province, city, district];
    },
    setValues: function (values) {
      this.values = values;
      this.initData();
    },
    reSet: function () {
      this.country = 0
      this.province = undefined
      this.city = undefined
      this.district = undefined
      this.values = []
      this.getDic(1, '0');
    }
  }
}
</script>

<style>
</style>
