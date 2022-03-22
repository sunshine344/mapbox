/*
 * @Author: your name
 * @Date: 2021-09-13 14:14:30
 * @LastEditTime: 2021-09-28 10:33:21
 * @LastEditors: Please set LastEditors
 * @Description: 地图测量类
 */

/*  
    1、功能介绍

        1、测量类包含有 测距、侧面、测高的功能。
        2、测量可进行多次，如测高，每点击地图一次显示当前点击高度，上次测量不消失。
        3、测量功能包含单个删除跟全部删除方法
        
    2、 封装思路 

        1、测量是在地图的 viewer 层进行的，所以需要地图初始化创建完成后传入 viewer 对象进行地图操作
        2、该类具测距、侧面、测高的调用方法，调用后及可进行功能操作 
        3、测量完成后，销毁事件等处理(包括监听事件及测量状态等)
        4、侧面、测距等测量中，用到的算法都结合 turf.js 实现，包括用面中心点算法等

    3、 实现思路

        1、点击按钮开始测量，侦听鼠标LEFT_CLICK事件，记录坐标，绘制节点和折线；
        2、侦听鼠标移动事件，鼠标点击后即复制一个浮动点，在MOUSE_MOVE事件中不断更新最后一个浮动点，动态更新折线绘制；
        3、侦听鼠标右击事件，RIGHT_CLICK触发时销毁测量相关事件句柄（ScreenSpaceEventHandler），删除多余的浮动点；
        4、折线的动态绘制通过CallbackProperty属性绑定positions属性实现。

    4、封装参考
        https://www.cnblogs.com/HandyLi/p/11125326.html
        https://www.jianshu.com/p/4a97d3ed4a06
        https://github.com/zhangti0708/cesium-examples

 */


class MapMeasure {
    /**
     * @description: 创建类后传放入参数
     * @param {object} viewer 传入地图类
     * @param {object} options 传入配置项
     * @return {*}
     */    
    constructor (viewer, options) {
        this.viewer = viewer;         // 地图viewer对象传入
        this.drawingState = false;    // 测量状态
        this.distanceArr = [];        // 距离测量数据
        this.areaArr = [];            // 面积测量数据
        this.highArr = [];            // 高度测量数据
        this.currentExecution = null;  // 当前执行          
    }
    /*************************************************   公共方法 **************************************************/

    /**
     * @description: 删除全部测量数据及地图表现（需要判断当前绘制状态处理）
     * @param {*}
     */
    clearAll() {
        let distanceArr=this.distanceArr
        let areaArr=this.areaArr
        let highArr=this.highArr
        
        if (this.drawingState) {
            // 关闭量测工具 并清除地图上所有的标绘
            this.currentExecution.deactivate();
            this.currentExecution.clear();
        } else {
            // 清除地图上的标绘
            distanceArr.forEach(item=>{
                item.deactivate();
                item.clear()
            })
            areaArr.forEach(item=>{
                item.deactivate();
                item.clear()
            })
            highArr.forEach(item=>{
                item.deactivate();
                item.clear()
            })
        }
    }

    /**
     * @description: 获取绘制状态为其他互交功能提供便利
     * @param {*}
     * @return {*}  
     */
    getDrawingState() {
        return this.drawingState
    }

    /*************************************************   测距离  **************************************************/
    /**
     * @description: 测距离入口及调用
     */
    measureDistance() {
        // 绘制状态
        let _this = this
        if (!this.drawingState) {
            let drawingState = this.drawingState
            let distanceArr = this.distanceArr
            let handlerDis = new Cesium.MeasureHandler(_this.viewer, Cesium.MeasureMode.Distance);
            //注册测距功能事件
            handlerDis.measureEvt.addEventListener(function (result) {
                let dis = Number(result.distance);
                let distance =
                    dis > 1000 ?
                    (dis / 1000).toFixed(2) + "km" :
                    dis.toFixed(2) + "m";
                handlerDis.disLabel.text = "距离:" + distance;
            });
            handlerDis.activeEvt.addEventListener(function (isActive) {
                // debugger
                if (isActive == true) {
                    _this.viewer.enableCursorStyle = false;
                    _this.viewer._element.style.cursor = "";
                    distanceArr.push(handlerDis)
                } else {
                    _this.viewer.enableCursorStyle = true;
                    drawingState = false;
                }
            });
            // 开启绘制
            handlerDis.activate();
            this.currentExecution = handlerDis
        }
    }

    /**
     * @description: 获取当前地图中 含有距离的数组
     */
    getDistance() {
        let distanceArr=this.distanceArr
        return distanceArr
    }

    /**
     * @description: 单个删除
     */
    clearDistance() {
        this.distanceArr=[]
    }
    /*************************************************   测面积  **************************************************/

    /**
     * @description: 测面积入口及调用
     */
    measureArea() {
        let _this = this;
        if (!this.drawingState) {
            let areaArr=this.areaArr
            let currentExecution=this.currentExecution
            let clampMode = 0; //空间模式
            let handlerArea = new Cesium.MeasureHandler(
                _this.viewer,
                Cesium.MeasureMode.Area,
                clampMode
            );
            handlerArea.measureEvt.addEventListener(function (result) {
                let mj = Number(result.area);
                let area =
                    mj > 1000000 ?
                    (mj / 1000000).toFixed(2) + "km²" :
                    mj.toFixed(2) + "㎡";
                handlerArea.areaLabel.text = "面积:" + area;
            });
            handlerArea.activeEvt.addEventListener(function (isActive) {
                if (isActive == true) {
                    _this.viewer.enableCursorStyle = false;
                    _this.viewer._element.style.cursor = "";
                    areaArr.push(handlerArea)
                } else {
                    _this.viewer.enableCursorStyle = true;
                    currentExecution = false;
                }
            });
            handlerArea.activate();
            this.currentExecution=handlerArea
        }
    }

    /**
     * @description: 获取当前地图中 含有面积的数组
     */
    getArea() {
        return this.areaArr
    }
    /*************************************************   测高度 **************************************************/

    /**
     * @description: 测高度入口及调用
     */
    measureHigh() {
        let _this = this;
        //初始化测量高度
        if (!this.drawingState) {
            let highArr=this.highArr
            let currentExecution=this.currentExecution
            let handlerHeight = new Cesium.MeasureHandler(
                _this.viewer,
                Cesium.MeasureMode.DVH
            );
            handlerHeight.measureEvt.addEventListener(function (result) {
                var distance =
                    result.distance > 1000 ?
                    (result.distance / 1000).toFixed(2) + "km" :
                    result.distance + "m";
                var vHeight =
                    result.verticalHeight > 1000 ?
                    (result.verticalHeight / 1000).toFixed(2) + "km" :
                    result.verticalHeight + "m";
                var hDistance =
                    result.horizontalDistance > 1000 ?
                    (result.horizontalDistance / 1000).toFixed(2) + "km" :
                    result.horizontalDistance + "m";
                // handlerHeight.disLabel.text = "空间距离:" + distance;
                handlerHeight.vLabel.text = "垂直高度:" + vHeight;
                handlerHeight.hLabel.text = "水平距离:" + hDistance;
            });
            handlerHeight.activeEvt.addEventListener(function (isActive) {
                if (isActive == true) {
                    _this.viewer.enableCursorStyle = false;
                    _this.viewer._element.style.cursor = "";
                    highArr.push(handlerHeight)
                } else {
                    _this.viewer.enableCursorStyle = true;
                    currentExecution = false;
                }
            });
            handlerHeight.activate();
            this.currentExecution = handlerHeight
            
        }
    }

    /**
     * @description: 获取当前地图中 含有高度的数组
     */
    getHigh() {
        return highArr
    }
}
export default MapMeasure