<template>
  <div class="mapbox">
    <Map class="mapbox-map" ref="myMap"></Map>
    <MapSwitch :myMap="myMap" class="mapbox-switch"/>
  </div>
</template>

<script lang="ts" setup>
import { ref,Ref, reactive, toRefs, onMounted,  } from 'vue';
import './scss/index.scss';
import Map from './components/Map.vue';
import MapSwitch from './components/MapSwitch.vue';
const myMap = ref(null); // 地图组件
onMounted(() => {
})
// 下面是定义调用父组件的下穿的方法的
// const emit = defineEmits<{
//     (e: 'on-click', name: string): void
// }>()
// 下面是暴露数据或者方法给父组件使用
// defineExpose({
//    list
// })

</script>
<style lang="scss" scoped>
</style>