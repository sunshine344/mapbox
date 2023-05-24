<!-- 矢量地图和影像地图切换 -->
<template>
  <div class="mapSwitch">
    <div
      class="mapSwitch-item"
      @click="changeMapType('vec')"
    ></div>
    <div
      class="mapSwitch-item"
      @click="changeMapType('ima')"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {
	ref,
	reactive,
	toRefs,
	onMounted,
} from 'vue';
import { homeMapSwitch } from '../ts/hook.ts';
onMounted(() => {});
const props=defineProps({
  loadVectorMap:Function,
  loadImageMap:Function,
});
const {loadVectorMap,loadImageMap} = toRefs(props);
// const { changeMapType, } = homeMapSwitch();
const changeMapType=(type:string)=>{
  loadVectorMap('none');
}
</script>
<style lang="scss" scoped>
.mapSwitch {
	display: flex;
	background-color: rgb(236, 236, 236);
	padding: 6px;
	&-item {
		height: 60px;
		width: 90px;
		margin-right: 6px;
		box-sizing: border-box;
		background: url('../../../../public/vec.png') center center no-repeat;
		background-size: 100%;
		cursor: pointer;
	}
	&-item:nth-child(2) {
		background: url('../../../../public/ima.png') center center no-repeat;
		background-size: 100%;
		border-left: none;
		margin-right: 0;
	}
}
</style>