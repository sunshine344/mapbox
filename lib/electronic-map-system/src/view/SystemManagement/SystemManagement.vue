<template>
  <div class="SystemManagementBox">
    <div class="leftNav">
      <leftNav></leftNav>
    </div>
    <div class="rightCon"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
export default defineComponent({
  components: {
    leftNav: defineAsyncComponent(
      () => import("@/components/LeftNav/LeftNav.vue")
    ),
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
@import "./SystemManagement.scss";
</style>