<template>
  <div
    id="mapbox"
  ></div>
</template>

<script lang="ts" setup>
import {
	ref,
	Ref,
	reactive,
	toRefs,
	onMounted,
	defineEmits,
	defineExpose,
} from 'vue';
import { AnyObject } from '@config/type/global';
// 引入mapbox-gl
import '@cgcs2000/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '@cgcs2000/mapbox-gl';
const publick = `${import.meta.env.BASE_URL}`;
import {homeMapSet} from '../ts/hook.ts';

let map: any = {};
onMounted(() => {
	mapboxgl.accessToken = null;
	class Cjmapbox extends mapboxgl.Map {}
	Cjmapbox.prototype.__proto__._authenticate = function () {
		return true;
	};
	// 创建地图对象
	map = new mapboxgl.Map({
		container: 'mapbox',
		center: [103.94289132200007, 30.764436619500035], // 设置地图中心
		crs: 'EGSP:4490',
		view: '3D',
		// maxBounds: [],
		// 背景设置
		style: {
			version: 8,
			name: 'BlankMap',
			glyphs: `${publick}mapbox/{fontstack}/{range}.pbf`,
			sources: {},
			layers: [
				{
					id: 'background',
					type: 'background',
					paint: {
						'background-color': '#08294A',
					} /* 背景颜色 */,
				},
			],
		},
		showZoomControl: false, //不显示mapbox控制工具
		zoom: 8, //图层
		pitch: 0, //地图倾斜
		maxZoom: 18, //最大图层
		// minZoom: 6, //最小图层
		preserveDrawingBuffer: true,
	});
	map.on('load', () => {
		loadVectorMap('visible');
		// 加载天空盒子图层
		map.addLayer({
			id: 'sky',
			type: 'sky',
			paint: {
				'sky-type': 'atmosphere',
				'sky-atmosphere-sun': [0.0, 0.0],
				'sky-atmosphere-sun-intensity': 15,
			},
		});
	});
	const {loadVectorMap,loadImageMap} = homeMapSet(map);
	emit('loadVectorMap',loadVectorMap);
	emit('loadImageMap',loadImageMap);
});
const emit = defineEmits(['loadVectorMap','loadImageMap']);

</script>
<style lang="scss" scoped>
</style>