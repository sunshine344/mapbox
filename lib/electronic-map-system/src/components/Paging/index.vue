<template>
  <div>
    <a-pagination :page-size="10" size="small" :total="50" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>