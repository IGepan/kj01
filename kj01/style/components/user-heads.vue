<template>
  <div class="users">
    <template v-for="(head,hi) in heads">
      <span :key="hi" class="user-head"><img :src="head" alt=""></span>
    </template>
  </div>
</template>
<script>
module.exports = {
  props: ['heads'],
  data: function () {
    return {}
  }
}
</script>

<style>
.users {
  height: 26px;
  display: flex;
}
.users .user-head {
  width: 26px;
  height: 26px;
  border: solid 1px #e6e7f1;
  overflow: hidden;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  margin-left: -10px;
  background-color: #fff;
}
.users .user-head:first-child {
  margin-left: 0;
}
</style>
