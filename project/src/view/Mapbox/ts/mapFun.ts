  
  import { AnyObject } from '@config/type/global';
  /**
   * @Description 加载地图图层
   * @Author: wms
   * @param {AnyObject} map 地图对象  
   * @param {string} sourceId 地图资源id  
   * @param {string} layerId 地图图层id  
   * @param {string} path 地图地址  
   * @param {string} isVisible 地图是否可见，值为'visible'或'none'
   * @param {string} downLayerId 地图是否可见，值为'visible'或'none'
   * @Date: 2023-05-22 17:08:52
   */
 export const loadMapRaster=(map:AnyObject,sourceId:string,layerId:string,path:string,isVisible:string,downLayerId?:string)=>{
    // 加载天地图矢量地图资源
		map.addSource(sourceId, {
			type: 'raster',
			tiles: [path],
			tileSize: 256,
		});
		// 加载矢量地图图层
		map.addLayer({
			id: layerId,
			type: 'raster',
			source: sourceId,
      layout:{
        visibility:isVisible,
      }
		},downLayerId);
 }