<template>
  <div>
    <tr>
      <th>头像</th>
      <td>
        <div
          class="head"
          style="background-image: url('http://dummyimage.com/110x110')"
        ></div>
        <button class="edithead">修改头像</button>
      </td>
      <td></td>
    </tr>
  </div>
</template>

<script>
module.exports = {
  props: ['form', 'http'],
  data: function () {
    return {
      mFormData: this.form,
      httpUser: this.http,
      industrySelectList: [],
      servicesSelectList: [],
    }
  },
  mounted: function () {
  },
  methods: {
    countrySuccess (val) {
      this.mFormData.country = val ? val.value : '';
      this.$refs.province.clearData();
      this.$refs.city.clearData();
      this.$refs.district.clearData();
      this.$refs.province.initData('administrative_division', val.id)
    },

    provinceSuccess (val) {
      this.mFormData.province = val ? val.value : '';
      this.mFormData.city = ''
      this.mFormData.district = ''
      this.$refs.city.clearData();
      this.$refs.district.clearData();
      if (val) {
        this.$refs.city.initData('administrative_division', val.id)
      }
    },
    citySuccess (val) {
      this.mFormData.city = val ? val.value : '';
      this.mFormData.district = '';
      this.$refs.district.clearData();
      if (val) {
        this.$refs.district.initData('administrative_division', val.id)
      }
    }
  },
}
</script>

<style>
</style>
