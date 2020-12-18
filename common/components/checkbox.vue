<template>
  <label
    class="ly-input"
    :for="'checkbox' + name"
  >
    <input
      :id="'checkbox' + name"
      :checked="checked"
      type="checkbox"
      :disabled="disabled"
      @change="$emit('change', $event.target.checked ? trueValue : falseValue)"
    >
    <i class="iconfont icon-checkbox"></i>
    <span
      class="ly-input-text"
      v-text="label"
    ></span>
  </label>
</template>
<script>
module.exports = {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    name: {
      type: String,
      default: '1'
    },
    'checked': [Boolean, Number, String],
    'disabled': {
      type: Boolean,
      default: false
    },
    label: String,
    trueValue: {
      type: [Boolean, Number, String],
      default: true
    },
    falseValue: {
      type: [Boolean, Number, String],
      default: false
    }
  }
}
</script>
<style>
.ly-input {
  user-select: none;
  display: inline-block;
  font-size: 18px;
  cursor: pointer;
}
.ly-input input {
  position: absolute;
  left: -9999em;
}
.ly-input input[type='checkbox'] + .icon-checkbox {
  font-size: 1em;
}
.ly-input input[type='checkbox'] + .icon-checkbox:before {
  content: '\e68f';
}
.ly-input input[type='checkbox']:checked + .icon-checkbox:before {
  content: '\e61f';
}

.ly-input-text {
  font-size: 1em;
}
</style>
