import { loadMapRaster } from './mapFun';
export const homeMapSwitch = () => {
	// 地图切换点击事件
	const changeMapType = (type: string) => {
		if (type == 'vec') {
			// 调用电子地图加载函数
      // loadVectorMap('visible');
      // loadImageMap('none');
		} else {
			// 加载影像地图函数
      // loadVectorMap('none');
      // loadImageMap('visible');
		}
	};
	return {
		changeMapType,
	};
};
export const homeMapSet = (map: any) => {
	/**
	 * @Description 加载矢量地图
	 * @Author: wms
	 * @param {string} isVisible 是否可见
	 * @Date: 2023-05-22 17:23:47
	 */
	const loadVectorMap = (isVisible: string) => {
		// 加载天地图矢量地图图层
		loadMapRaster(
			map,
			'vec_c',
			'vec_c',
			'http://t3.tianditu.com/DataServer?T=vec_c&tk=915de993ea6873664830bf5d8217723c&x={x}&y={y}&l={z}',
			isVisible,
		);
		// 加载天地图矢量标记图层
		loadMapRaster(
			map,
			'cva_c',
			'cva_c',
			'http://t3.tianditu.com/DataServer?T=cva_c&tk=915de993ea6873664830bf5d8217723c&x={x}&y={y}&l={z}',
			isVisible,
		);
	};
	/**
	 * @Description 加载影像地图
	 * @Author: wms
	 * @param {string}  isVisible 是否可见
	 * @Date: 2023-05-22 17:28:00
	 */
	const loadImageMap = (isVisible: string) => {
		loadMapRaster(
			map,
			'img_c',
			'img_c',
			'http://t3.tianditu.com/DataServer?T=img_c&tk=915de993ea6873664830bf5d8217723c&x={x}&y={y}&l={z}',
			isVisible,
		);
		// 加载天地图矢量标记图层
		loadMapRaster(
			map,
			'cia_c',
			'cia_c',
			'http://t3.tianditu.com/DataServer?T=cia_c&tk=915de993ea6873664830bf5d8217723c&x={x}&y={y}&l={z}',
			isVisible,
		);
	};
  return {
    loadVectorMap,
    loadImageMap
  }
};
