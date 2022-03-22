
import WORLD_IMG from "@assets/images/map/world.jpg";
import BlackMarble_2016 from  "@assets/images/map/BlackMarble_2016.jpg";
import TEXTBOX from "@/assetsimages/map/textbox.png";
var configs = {
    d3map: null,
    mapDom: "map3d",
    mapUrl:BlackMarble_2016,
    mapOptions: {
        shouldAnimate: true,
        useDefaultRenderLoop: true,
        infoBox: false,
        contextOptions: {
            webgl: {
                alpha: false,
                antialias: true,
                preserveDrawingBuffer: true,
                failIfMajorPerformanceCaveat: false,
                depth: true,
                stencil: false,
                anialias: false
            },
        }
    },
    sceneUrl: "http://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace",
}
function supermap() {

    this._viewer = undefined

    this._scene = undefined

    this._layer = undefined

    this._sceneData = undefined

    this._mapData = undefined

    this._state = undefined

    this._util = undefined
    
    this.primitives = [] // primitive图元

    this.Lights = [] //光源
    
    this.postProcess = [] //后期处理
    this._css3Renderer = undefined
    this._css3Renderer1 = undefined
    this._css3Renderer2 = undefined
    this._css3Renderer3 = undefined
    this._css3Renderer4 = undefined
    this._css3Renderer5 = undefined
    this._css3Renderer6 = undefined
    this._css3Renderer7 = undefined
    this._css3Renderer8 = undefined
    this.postRender=null;//
    this.postRenderobjArrayObj={};//
    this.postRenderobjpostre;
    this.rollerShutterConfig=null;//卷帘对象
}
/**
 * @Descripttion: 初始化地图
 * @Author: 陈杰
 * @Date: 2021-11-30 14:59:31
 * @LastEditors: 
 * @param {*} opt
 * @return {*}
 */
supermap.prototype.init = function (opt = {}) {
    if (configs.mapDom && configs.mapUrl) {
        //Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYTQ2ZjdjNS1jM2E0LTQ1M2EtOWM0My1mODMzNzY3YjYzY2YiLCJpZCI6MjkzMjcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTE5NDIzNjB9.RzKlVTVDTQ9r7cqCo-PDydgUh8Frgw0Erul_BVxiS9c';
        //this._viewer = new Cesium.Viewer(configs.mapDom, configs.mapOptions);
        this._viewer =  new Cesium.Viewer(configs.mapDom, {
            imageryProvider: new Cesium.SingleTileImageryProvider({
                url:WORLD_IMG,
            }),
            animation: false, //动画控件
            timeline: true, //时间线
            fullscreenButton: false, // 全屏按钮
            geocoder: false, //地名查找（依赖google服务）
            homeButton: false, //重置到初始焦点与缩放
            selectionIndicator: false, //
            shadow: true,
            sceneMode: Cesium.SceneMode.SCENE3D,
            infoBox: false, //消息框
            sceneModePicker: false, //场景模式选择
            navigationHelpButton: false, //导航帮助按钮
            projectionPicker: false, //投影方式选择（3D、2D、Columbus）
            baseLayerPicker: false,
            shouldAnimate: true,
            navigation: false,
        });
        this._util = new Cesium.Utils(this._viewer)
        // this._viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
        //     mapId: 'mapbox.dark'
        // }))
        this._scene = this._viewer.scene
        this._scene.skyBox = this._util.setOneGroundSkyBox()
        //this._util.setSnowEffect()
        
        this.config(opt) //默认开始配置

        //this.loadScene() //加载场景

        // this.addThreeObject() //加载three obj
    } else {
        alert("请配置地图参数")
    }
}
supermap.prototype.setView=function(){
    this._util.setView({
        position: Cesium.Cartesian3.fromDegrees(106.6269866033348, 29.53232673901685, 0),
        orientation: {
            heading: 350.37060,
            pitch: -12.75012,
            roll: 0.00306
        }
    })
}
/**
 * @Descripttion: 地图点击
 * @Author: 陈杰
 * @Date: 2021-11-11 15:35:26
 * @LastEditors: 
 * @param {*}
 * @return {*}
 */
 supermap.prototype.creatOneClick=function(type,callBack){
    var  viewer=this._viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(event) {
        
        let car3 = viewer.scene.camera.pickEllipsoid(
            event.position,
            viewer.scene.globe.ellipsoid
        );
     
        if (Cesium.defined(car3)) {
            let cartographic = Cesium.Cartographic.fromCartesian(car3);
            let longitudeString = Cesium.Math.toDegrees(
                cartographic.longitude
            ).toFixed(6);　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　//要更高的精度就修改保留的小数位数
            let latitudeString = Cesium.Math.toDegrees(
                cartographic.latitude
            ).toFixed(6);　
            callBack([longitudeString,latitudeString],event,viewer)
        }
        if(type == 'one'){
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.destroy();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
// 移动屏幕位置
   supermap.prototype.screenPosition=function(calback){
       let _this=this;
        var arrLoc = [];
        var pickPosition = { x: null, y: null }
        var handler = new Cesium.ScreenSpaceEventHandler(_this._viewer.scene.canvas);　　//定义事件
        handler.setInputAction(function (movement) {
            var cartesian = _this._viewer.camera.pickEllipsoid(
                movement.position,
                _this._viewer.scene.globe.ellipsoid
            );
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(
                    cartographic.longitude
                ).toFixed(6);　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　//要更高的精度就修改保留的小数位数
                var latitudeString = Cesium.Math.toDegrees(
                    cartographic.latitude
                ).toFixed(6);　
               　　　　　　　　　　　　　　　　　　　　　　　　　　　　　//同上
                pickPosition.x = longitudeString;
                pickPosition.y = latitudeString;
                let cf = { x: parseFloat(pickPosition.x), y: parseFloat(pickPosition.y) }
                console.log(cf) //鼠标点击位置
                var a = {
                    position:_this._viewer.camera.position,
                    heading: _this._viewer.camera.heading,
                    pitch: _this._viewer.camera.pitch,
                    roll: _this._viewer.camera.roll
                }
                console.log(a)  //当前视角
                
                calback?calback([longitudeString,latitudeString],movement):null
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    supermap.prototype.movepostion=function(calback){
        let _this=this;
        let viewer=this._viewer;
        var arrLoc = [];
        var pickPosition = { x: null, y: null }
        var handler = new Cesium.ScreenSpaceEventHandler(_this._viewer.scene.canvas);　　//定义事件
        handler.setInputAction(function (movement) {
            let ellipsoid=viewer.scene.globe.ellipsoid;
            let cartesian=viewer.camera.pickEllipsoid(movement.endPosition,ellipsoid);
            if(cartesian){  
                let cartographic=ellipsoid.cartesianToCartographic(cartesian);
                let long=Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                let lat=Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
               
                
                calback?calback({postion:[long,lat]}):null


            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);



    }
    // 获取properties参数
    supermap.prototype.getproperties=function(event){
        let pick=this._viewer.scene.pick(event.position);
        if(pick){
            if(pick.id instanceof Cesium.Entity){
                // let ellipsoid=this._viewer.scene.globe.ellipsoid;
                return pick.id.properties

            }


        }

    }
/**
 * @Descripttion: 加载倾斜摄影
 * @Author: 陈杰
 * @Date: 2021-12-03 10:40:25
 * @LastEditors: enty={url:'http://10.51.100.2:8000/bjdzdt/4qxsy/tileset.json',heightOffset:0}
 * @param {*}
 * @return {*}
 */    
 supermap.prototype.obliquephotography=function(enty,calback){
     let _this=this;
let tileset=new Cesium.Cesium3DTileset({
            url:enty.url,
            // maximumScreenSpaceError: 2,
            // maximumNumberOfLoadedTiles: 10000,
            show:true,
        })
        let modelenty=null;
        let viewer=this._viewer;
    tileset.readyPromise.then(function(tileset) {
        modelenty= viewer.scene.primitives.add(tileset);
        var heightOffset=0; //设置建筑物与地面的高度
        enty.heightOffset?heightOffset=enty.heightOffset:heightOffset=0
        var boundingSphere = tileset.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude,heightOffset );
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        // viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 1.0));
        calback?calback(modelenty):null
    });
    // let modelenty=this._viewer.scene.primitives.add(tileset);
    // return modelenty;

 }
 supermap.prototype.obliquephotography1=function(enty,calback){
    let viewer=this._viewer;
    const promise = new Cesium.Cesium3DTileset({
        url: enty.url,  
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 10000,
    })
    //viewer.scene.primitives.add(promise);
    //return promise;
    promise.readyPromise.then((promise)=> {
        var heightOffset =0;  //设置建筑物与地面的高度
        var boundingSphere = promise.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        promise.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        // viewer.zoomTo(promise, new Cesium.HeadingPitchRange(0.5, -0.2, promise.boundingSphere.radius * 1.0));
        viewer.scene.primitives.add(promise);
        calback?calback(promise):null;
    });
    return promise;
     
 }
 /**
  * @Descripttion: 加载模型
  * @Author: 陈杰
  * @Date: 2021-12-09 15:59:49
  * @LastEditors: 
  * @param {*} enty
  * @param {*} calback
  * @return {*}
  */ 
 supermap.prototype.modelglb=function(enty,calback){
    const position = Cesium.Cartesian3.fromDegrees(enty.point[0],enty.point[1],(enty.heightOffset?enty.heightOffset:0));
        const heading = Cesium.Math.toRadians(90);//水平旋转
        const pitch = Cesium.Math.toRadians(0.0);
        const roll = Cesium.Math.toRadians(0.0);
        let headingPitchRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, headingPitchRoll);
        let modelenty=this._viewer.entities.add({
                id:(enty.id?enty.id:Date.parse(new Date())),
                name : enty.url,
                position : position,
                orientation: orientation,
                model : {
                uri :  enty.url
                }
        })

        calback?calback(modelenty):null;



 }
/**
 * @Descripttion: 加载天地图
 * @Author: 陈杰
 * @Date: 2021-11-30 15:04:51
 * @LastEditors: 
 * @param {*} url
 * @return {*}
 */
supermap.prototype.UrlTemplateImageryProvider=function(name='tdtCiaLayer',url='http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=915de993ea6873664830bf5d8217723c'){
    var bastLayer = this._viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url,
            layer:name,
            subdomains:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'],
            tilingScheme:new Cesium.WebMercatorTilingScheme(),
        })
    );
    return bastLayer;
}
supermap.prototype.UrlTemplateGeographicTilingSchemeImageryProvider=function(name='tdtCiaLayer',url='http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=915de993ea6873664830bf5d8217723c'){
    var bastLayer = this._viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url,
            layer:name,
            subdomains:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'],
            tilingScheme:new Cesium.GeographicTilingScheme(),
        })
    );
    return bastLayer;
}
/**
 * @Descripttion: 加载arcgis
 * @Author: 陈杰
 * @Date: 2022-01-21 20:00:19
 * @LastEditors: 
 * @param {*} name
 * @param {*} url https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer
 * @return {*}
 */
supermap.prototype.ArcGisMapServerImageryProvider=function(name='arcgisprovider',url='https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'){
  let arcgisLayer=  this._viewer.imageryLayers.addImageryProvider(
        new Cesium.ArcGisMapServerImageryProvider({
            layer:name?name:'arcgisprovider',
            url:url,
          })
    )
    return arcgisLayer;


}
/**
 * @Descripttion: 
 * @Author: 陈杰
 * @Date: 2021-12-21 10:00:55
 * @LastEditors: 
 * @param {*} name
 * @param {*} url http://125.70.9.194:6080/services/MapServer/sat_base_20200330/tile/{z}/{y}/{x}
 * @return {*}
 */
supermap.prototype.UrlTemplateImageryProviderGeographicTilingScheme=function(name,url){
    let opi = Math.PI / 180;
    let layer = this._viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url: url,
        layer: name,
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'c',
        credit: new Cesium.Credit('天地图全球影像服务'),
        maximumLevel: 14,
        tilingScheme: new Cesium.GeographicTilingScheme({
            numberOfLevelZeroTilesX: 1,
            numberOfLevelZeroTilesY: 1,
            rectangle: new Cesium.Rectangle(-180 * opi, -90 * opi, 180 * opi, 90 * opi)
        }),
        tileMatrixLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    }))

    return layer;
    
}
supermap.prototype.mapdem=function(name,url){
      
     let terrainProvider = new Cesium.CesiumTerrainProvider({
        url,
        // isSct: true,
    });

    this._viewer.terrainProvider=terrainProvider;
    return terrainProvider
}
/**
 * @Descripttion: 获取地形高度
 * @Author: 陈杰
 * @Date: 2021-12-22 18:23:52
 * @LastEditors: 
 * @param {*}
 * @return {*}
 */
supermap.prototype.getterrainProviderHeight=function(terrainData,point,calback){
        let positions = [
            Cesium.Cartographic.fromDegrees(point[0],point[1])    //输入经纬度
          ];
      
          let promise = Cesium.sampleTerrain(terrainData,14,positions); //获取14级地形高程
          Cesium.when(promise, function (updatedPositions) {
            let terrainHeight = updatedPositions[0].height;
            calback?calback(terrainHeight):null;
          }); 
}
supermap.prototype.remvoedem=function(){
    this._viewer.terrainProvider= new Cesium.EllipsoidTerrainProvider();
}

/**
 * 场景配置
 * 
 * @param opt
 */
 supermap.prototype.config = function (opt) {

    if (this._scene) {

        //设置环境光
        this._scene.lightSource.ambientLightColor = opt.ambientLightColor || new Cesium.Color(0.08, 0.08, 0.08, 1);

        //深度检测
        // this._scene.globe.depthTestAgainstTerrain = false;

        //地面调节
        //this._scene.globe.baseColor = Cesium.Color.BLACK;
        //this._scene.globe.globeAlpha = 0.1;
        this._scene.undergroundMode = true;
        this._scene.terrainProvider.isCreateSkirt = false;

        //调节场景环境
        this._scene.sun.show = false;
        this._scene.moon.show = false;
        // this._scene.skyBox.show = false;
        this._scene.skyAtmosphere.show = false;
        this._scene.fxaa = true;

        //开启颜色校正
        this._scene.colorCorrection.show = opt.colorCorrection || false;
        this._scene.colorCorrection.saturation = opt.saturation || 3.1;
        this._scene.colorCorrection.brightness = opt.brightness || 1.8;
        this._scene.colorCorrection.contrast = opt.contrast || 1.2;
        this._scene.colorCorrection.hue = opt.hue || 0;

        //开启泛光和HDR
        this._scene.bloomEffect.show = opt.bloomEffect || false;
        this._scene.hdrEnabled = opt.hdrEnabled || true;
        this._scene.bloomEffect.threshold = 1;
        this._scene.bloomEffect.bloomIntensity = 2;

        //最大距离
        //this._scene.screenSpaceCameraController.maximumZoomDistance = 5000.0
    }
}

/**
 * 加载场景
 * 
 * 
 * 示例白膜数据
 */
supermap.prototype.loadScene = function () {

    if (this._scene) {
        /**
         * 建筑
         */
        var promise = this._scene.open(configs.sceneUrl)

        Cesium.when.all(promise, (layer) => {

            this._util.setView({
                position: Cesium.Cartesian3.fromDegrees(106.6269866033348, 29.53232673901685, 2000),
                orientation: {
                    heading: 350.37060,
                    pitch: -12.75012,
                    roll: 0.00306
                }
            })

            layer[0].style3D.emissionColor = new Cesium.Color(2, 5, 10, 1); //自发光颜色


            this._util.setHypsometric(layer[0])

            this._util.bindFlyCircle(true) //给鼠标绑定旋转操作

        })


        /**
         * 扫描物
         */
        new Promise((resolve, reject) => {

            this._util.setRadarScanEffect({
                position: Cesium.Cartesian3.fromDegrees(106.54439406642704, 29.53412750079538, 10.0),
                color: Cesium.Color.DARKCYAN,
                radius: 500
            })

            this.addWall()
        })



        /**
        * 路网
        */
        new Promise((resolve, reject) => {

            this.addRoadLine("examples/data/json/lineback_1.json")

            this.addRoadLine("examples/data/json/lineback2_1.json")

            this.addRoadLine("examples/data/json/lineback3_1.json")
        })

        /**
         * 路径漫游 
         */
        new Promise((resolve, reject) => {

            var paths = [
                { lon: 106.57003293712452, lat: 29.524797836353418, alt: 0, height: 10000, time: 0 },
                { lon: 106.56383672216968, lat: 29.53146964052541, alt: 0, height: 10000, time: 120 },
                { lon: 106.56144813002342, lat: 29.531134070376954, alt: 0, height: 10000, time: 240 },
                { lon: 106.55416088966606, lat: 29.530970546674276, alt: 0, height: 10000, time: 360 },
                { lon: 106.55414087849685, lat: 29.53383654312555, alt: 0, height: 10000, time: 480 },
                { lon: 106.55414087849685, lat: 29.53383654312555, alt: 0, height: 10000, time: 600 }
            ]
            this._util.setPathRoaming({
                paths: paths,
                model: true,
                m_url: 'examples/data/model/qiche.gltf',
                m_scale: 1,
                m_minimumPixelSize: 1,
                label: true,
                l_text: '任务车辆.1',
                l_pixelOffset: new Cesium.Cartesian2(42, -48),
                l_fillColor: Cesium.Color.WHITE,
                l_outlineWidth: 3,
                billboard: true,
                b_img: 'examples/images/Textures/bp.png',
                b_width: 55,
                b_height: 80,
                b_scale: 2,
                b_pixelOffset: new Cesium.Cartesian2(20, 0)
            })

            var paths2 = [
                { lon: 106.5565907627419, lat: 29.53456446159264, alt: 0, height: 10000, time: 0 },
                { lon: 106.55814221039576, lat: 29.53472126114135, alt: 0, height: 10000, time: 120 },
                { lon: 106.55967343745067, lat: 29.535457923243882, alt: 0, height: 10000, time: 240 },
                { lon: 106.5605585760546, lat: 29.535371534594482, alt: 0, height: 10000, time: 360 },
                { lon: 106.56333275485729, lat: 29.532352521691557, alt: 0, height: 10000, time: 480 },
                { lon: 106.56401603756584, lat: 29.53145981355466, alt: 0, height: 10000, time: 600 },
                { lon: 106.56560417620496, lat: 29.531485540486234, alt: 0, height: 10000, time: 720 },
                { lon: 106.56982272180862, lat: 29.532047070094315, alt: 0, height: 10000, time: 840 }
            ]

            this._util.setPathRoaming({

                paths: paths2,
                model: true,
                m_url: 'examples/data/model/qiche.gltf',
                m_scale: 1,
                m_minimumPixelSize: 1,
                label: true,
                l_text: '任务车辆.2',
                l_pixelOffset: new Cesium.Cartesian2(42, -48),
                l_fillColor: Cesium.Color.WHITE,
                l_outlineWidth: 3,
                billboard: true,
                b_img: 'examples/images/Textures/bp.png',
                b_width: 55,
                b_height: 80,
                b_scale: 2,
                b_pixelOffset: new Cesium.Cartesian2(20, 0)
            })

            var paths3 = [
                { lon: 106.55995243647547, lat: 29.543838865278495, alt: 0, height: 10000, time: 0 },
                { lon: 106.56012297535275, lat: 29.54135878173985, alt: 0, height: 10000, time: 120 },
                { lon: 106.56010025753658, lat: 29.538155717188193, alt: 0, height: 10000, time: 240 },
                { lon: 106.5602143992771, lat: 29.535935972391595, alt: 0, height: 10000, time: 360 },
                { lon: 106.56566297913831, lat: 29.529388590619995, alt: 0, height: 10000, time: 480 },
                { lon: 106.56566297913831, lat: 29.529388590619995, alt: 0, height: 10000, time: 600 }
            ]

            this._util.setPathRoaming({

                paths: paths3,
                model: true,
                m_url: 'examples/data/model/qiche.gltf',
                m_scale: 1,
                m_minimumPixelSize: 1,
                label: true,
                l_text: '任务车辆.3',
                l_pixelOffset: new Cesium.Cartesian2(42, -48),
                l_fillColor: Cesium.Color.WHITE,
                l_outlineWidth: 3,
                billboard: true,
                b_img: 'examples/images/Textures/bp.png',
                b_width: 55,
                b_height: 80,
                b_scale: 2,
                b_pixelOffset: new Cesium.Cartesian2(20, 0)
            })

            var paths4 = [
                { lon: 106.55254218312906, lat: 29.525324292576798, alt: 0, height: 10000, time: 0 },
                { lon: 106.55094702943869, lat: 29.528138996089695, alt: 0, height: 10000, time: 120 },
                { lon: 106.55416687394586, lat: 29.531015366619958, alt: 0, height: 10000, time: 240 },
                { lon: 106.55796107689329, lat: 29.531015366619958, alt: 0, height: 10000, time: 360 },
                { lon: 106.55796107689329, lat: 29.53111995652228, alt: 0, height: 10000, time: 480 },
                { lon: 106.55826360770091, lat: 29.526149944173504, alt: 0, height: 10000, time: 600 },
                { lon: 106.55834657023352, lat: 29.525744009935668, alt: 0, height: 10000, time: 720 },
            ]

            this._util.setPathRoaming({

                paths: paths4,
                model: true,
                m_url: 'examples/data/model/CesiumMilkTruck.glb',
                m_scale:10,
                label: true,
                l_text: '社会车辆.1',
                l_pixelOffset: new Cesium.Cartesian2(42, -70),
                l_fillColor: Cesium.Color.WHITE,
                l_outlineWidth: 3,
                billboard: true,
                b_img: 'examples/images/Textures/bp2.png',
                b_width: 55,
                b_height: 80,
                b_scale: 2,
                b_pixelOffset: new Cesium.Cartesian2(20, -20)
            })

            var paths5 = [
                { lon: 106.54785660441873, lat: 29.541068287177758, alt: 0, height: 10000, time: 0 },
                { lon: 106.55096736681742, lat: 29.541274671684562, alt: 0, height: 10000, time: 120 },
                { lon: 106.55417026108965, lat: 29.542723927762594, alt: 0, height: 10000, time: 240 },
                { lon: 106.55768185185038, lat: 29.543343891151327, alt: 0, height: 10000, time: 360 },
                { lon: 106.56177018350208, lat: 29.543572027310912, alt: 0, height: 10000, time: 480 },
                { lon: 106.564952958958, lat: 29.543196019188958, alt: 0, height: 10000, time: 600 },
                { lon: 106.56496364017232, lat: 29.543182043715298, alt: 0, height: 10000, time: 720 },
            ]

            this._util.setPathRoaming({

                paths: paths5,
                model: true,
                m_url: 'examples/data/model/CesiumMilkTruck.glb',
                m_scale:10,
                label: true,
                l_text: '社会车辆.2',
                l_pixelOffset: new Cesium.Cartesian2(42, -70),
                l_fillColor: Cesium.Color.WHITE,
                l_outlineWidth: 3,
                billboard: true,
                b_img: 'examples/images/Textures/bp2.png',
                b_width: 55,
                b_height: 80,
                b_scale: 2,
                b_pixelOffset: new Cesium.Cartesian2(20, -20)
            })


            var paths5 = [
                { lon: 106.53723590282631, lat: 29.549647357633564, alt: 300, height: 10000, time: 0 },
                { lon: 106.54729432614089, lat: 29.525784806338617, alt: 300, height: 10000, time: 120 },
                { lon: 106.5710138566176, lat: 29.516772520652342, alt: 300, height: 10000, time: 240 },
                { lon: 106.5788276019971, lat: 29.53780626182699, alt: 300, height: 10000, time: 360 },
                { lon: 106.54982114025249, lat: 29.543572027310912, alt: 300, height: 10000, time: 480 }
            ]

            var flyEntity = this._util.setPathRoaming({

                paths: paths5,
                model: true,
                m_url: 'examples/data/model/CesiumDrone.gltf',
                label: true,
                l_text: '无人机侦察',
                l_outlineWidth: 3,
                l_fillColor: Cesium.Color.CYAN
            })
            // this._viewer.entities.add(this._util.createDynamicCylinder({
            //     positions: flyEntity.position.getValue(this._viewer.clock.currentTime),
            //     entity: flyEntity,
            //     cylinder: {
            //         length: 50,
            //         slices: 6,
            //         bottomRadius: 200,
            //         material: new Cesium.WarnLinkMaterialProperty({ freely: 'vertical', color: Cesium.Color.ORANGE, duration: 1, count: 0.0, direction: '-' }),
            //     }
            // }))


            var pointLight = this._util.setPointLight(
                flyEntity.position.getValue(this._viewer.clock.currentTime),
                {
                    color: new Cesium.Color(9, 160, 15, 0.8),
                    cutoffDistance: 500,
                    decay: 2,
                    intensity: 5
                })

            this._viewer.clock.onTick.addEventListener((clock) => {

                var position = flyEntity.position.getValue(this._viewer.clock.currentTime)

                pointLight.position = position
            });

        })

        /**
         * 高度光源线
         */
        new Promise((resolve, reject) => {

            this.addHeightLineLight({
                positions: {
                    startPoint: Cesium.Cartesian3.fromDegrees(106.56558869414897, 29.546645918115, 0.0),
                    endPoint: Cesium.Cartesian3.fromDegrees(106.56558869414897, 29.546645918115, 20000.0)
                },
                color: Cesium.Color.DARKGOLDENROD,
                width: 6
            })

            this.addHeightLineLight({
                positions: {
                    startPoint: Cesium.Cartesian3.fromDegrees(106.56698580585798, 29.530538206648064, 0.0),
                    endPoint: Cesium.Cartesian3.fromDegrees(106.56698580585798, 29.530538206648064, 20000.0)
                },
                color: Cesium.Color.CYAN,
                width: 6
            })

            this.addHeightLineLight({
                positions: {
                    startPoint: Cesium.Cartesian3.fromDegrees(106.5399480984319, 29.53383231300993, 0.0),
                    endPoint: Cesium.Cartesian3.fromDegrees(106.5399480984319, 29.53383231300993, 20000.0)
                },
                color: Cesium.Color.CYAN,
                width: 6
            })
            //
            this._viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(106.5399480984319, 29.53383231300993, 0.0),
                ellipsoid: {
                    radii: new Cesium.Cartesian3(200.0, 200.0, 200.0),
                    material: new Cesium.WallLinkMaterialProperty({ freely: 'vertical', color: Cesium.Color.RED.withAlpha(0.5), duration: 1000, count: 0, direction: '-' }),
                },
            });

            this.addHeightLineLight({
                positions: {
                    startPoint: Cesium.Cartesian3.fromDegrees(106.553868801763, 29.527073727667158, 0.0),
                    endPoint: Cesium.Cartesian3.fromDegrees(106.553868801763, 29.527073727667158, 20000.0)
                },
                color: Cesium.Color.DARKGOLDENROD,
                width: 6
            })

            this.addHeightLineLight({
                positions: {
                    startPoint: Cesium.Cartesian3.fromDegrees(106.54583250446436, 29.542360318905853, 0.0),
                    endPoint: Cesium.Cartesian3.fromDegrees(106.54583250446436, 29.542360318905853, 0.0)
                },
                color: Cesium.Color.CYAN,
                width: 6
            })

            //
            this._viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(106.54583250446436, 29.542360318905853, 0.0),
                ellipsoid: {
                    radii: new Cesium.Cartesian3(200.0, 200.0, 200.0),
                    material: new Cesium.WallLinkMaterialProperty({ freely: 'vertical', color: Cesium.Color.DARKGREEN.withAlpha(0.1), duration: 1000, count: 0, direction: '-' }),
                },
            });

        })

        /**
         * 弧线
         */
        new Promise((resolve, reject) => {

            var startPoints = Cesium.Cartesian3.fromDegrees(106.56298388731544, 29.532057959712986, 230.0)
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.55775961346458, 29.542807433251742, 0.0) },
            )
            this.addDynamicCricle({
                circle: { lng: 106.55775961346458, lat: 29.542807433251742, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })

            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.55510300690722, 29.527818241746893, 0.0) },
            )

            this.addDynamicCricle({
                circle: { lng: 106.55510300690722, lat: 29.527818241746893, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.55826955975746, 29.533090799351488, 0.0) },
            )

            this.addDynamicCricle({
                circle: { lng: 106.55826955975746, lat: 29.533090799351488, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })

            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.5518898036773, 29.53425871475176, 0.0) },
            )

            this.addDynamicCricle({
                circle: { lng: 106.5518898036773, lat: 29.53425871475176, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })

            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.55831081954038, 29.538058310725905, 0.0) },
            )

            this.addDynamicCricle({
                circle: { lng: 106.55831081954038, lat: 29.538058310725905, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })

            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.55200667660088, 29.529567664624146, 0.0) },
            )

            this.addDynamicCricle({
                circle: { lng: 106.55200667660088, lat: 29.529567664624146, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.56818853301075, 29.525016061106154, 0.0) },
            )

            this.addDynamicCricle({
                circle: { lng: 106.56818853301075, lat: 29.525016061106154, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })

            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.57296659709463, 29.5293255402316, 0.0) },
            )
            this.addDynamicCricle({
                circle: { lng: 106.57296659709463, lat: 29.5293255402316, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.56948261814809, 29.53323873346, 0.0) },
            )
            this.addDynamicCricle({
                circle: { lng: 106.56948261814809, lat: 29.53323873346, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.55511738770666, 29.520780769175847, 0.0) },
            )
            this.addDynamicCricle({
                circle: { lng: 106.55511738770666, lat: 29.520780769175847, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.56938764079821, 29.53789177413806, 0.0) },
            )
            this.addDynamicCricle({
                circle: { lng: 106.56938764079821, lat: 29.53789177413806, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.56869940844197, 29.54266106727103, 0.0) },
            )
            this.addDynamicCricle({
                circle: { lng: 106.56869940844197, lat: 29.54266106727103, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })
            this.addRadianLineLight(
                { startPoint: startPoints, endPoint: Cesium.Cartesian3.fromDegrees(106.57656077263997, 29.538952807799447, 0.0) },
            )
            this.addDynamicCricle({
                circle: { lng: 106.57656077263997, lat: 29.538952807799447, alt: 0.0 },
                color: Cesium.Color.CYAN,
                height: 0,
                radius: 20,
                count: 1
            })

        })

        /**
         * 楼宇信息
         */
        new Promise((resolve, reject) => {


            this._util.setPointLight(
                Cesium.Cartesian3.fromDegrees(106.56298388731544, 29.532057959712986, 50.0),
                {
                    color: Cesium.Color.CYAN,
                    cutoffDistance: 250,
                    decay: 1,
                    intensity: 2
                })
            this.addCircleLine({
                semiMinorAxis: 150,
                semiMajorAxis: 150,
                rotation: 0,
                center: Cesium.Cartesian3.fromDegrees(106.56298388731544, 29.532057959712986, 40.0),
                granularity: Math.PI / 45.0//间隔
            })

            //动态实体 楼宇中心
            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.56298388731544, 29.532057959712986, 230.0),
                model: { lng: 106.56298388731544, lat: 29.532057959712986, alt: 230.0 },
                circle: { lng: 106.56298388731544, lat: 29.532057959712986, alt: 350.0 },
                m_color: Cesium.Color.GREEN,
                label: true,
                billboard: true,
                text: ' xx大厦 ',
                l_fillColor: Cesium.Color.GREEN,
                l_pixelOffset: new Cesium.Cartesian2(0, -5),
            })

            this.addDynamicCricle({
                circle: { lng: 106.56298388731544, lat: 29.532057959712986, alt: 230.0 },
                color: Cesium.Color.GREEN,
                height: 205,
                radius: 30
            })

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.5659092537878, 29.530924830570186, 120.0),
                model: { lng: 106.5659092537878, lat: 29.530924830570186, alt: 120.0 },
                circle: { lng: 106.5659092537878, lat: 29.530924830570186, alt: 120.0 },
                m_color: Cesium.Color.GREEN,
                label: true,
                text: ' 写字楼 ',
                l_fillColor: Cesium.Color.GREEN,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                billboard: false

            })

            this.addDynamicCricle({
                circle: { lng: 106.5659092537878, lat: 29.530924830570186, alt: 120.0 },
                color: Cesium.Color.GREEN,
                height: 95,
                radius: 20
            })

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.56240261998792, 29.527304750255123, 120.0),
                model: { lng: 106.56240261998792, lat: 29.527304750255123, alt: 120.0 },
                circle: { lng: 106.56240261998792, lat: 29.527304750255123, alt: 120.0 },
                m_color: Cesium.Color.GREEN,
                label: true,
                l_fillColor: Cesium.Color.GREEN,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                billboard: false,
                text: ' 服务中心 '
            })

            this.addDynamicCricle({
                circle: { lng: 106.56240261998792, lat: 29.527304750255123, alt: 120.0 },
                color: Cesium.Color.GREEN,
                height: 95,
                radius: 20
            })

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.56339406642704, 29.53412750079538, 180.0),
                model: { lng: 106.56339406642704, lat: 29.53412750079538, alt: 180.0 },
                circle: { lng: 106.56339406642704, lat: 29.53412750079538, alt: 180.0 },
                m_color: Cesium.Color.GREEN,
                label: true,
                l_fillColor: Cesium.Color.GREEN,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                billboard: false,
                text: ' 商场 '
            })

            this.addDynamicCricle({
                circle: { lng: 106.56339406642704, lat: 29.53412750079538, alt: 180.0 },
                color: Cesium.Color.GREEN,
                height: 155,
                radius: 20
            })

            //

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.54439406642704, 29.53412750079538, 200.0),
                model: { lng: 106.54439406642704, lat: 29.54439406642704, alt: 200.0 },
                m_scale: 35,
                minimumPixelSize: 80,
                m_color: Cesium.Color.CYAN,
                label: true,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                l_fillColor: Cesium.Color.CYAN,
                billboard: false,
                text: ' 雷达探测 '
            })

            //

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.55439406642704, 29.53412750079538, 80.0),
                model: { lng: 106.55439406642704, lat: 29.53412750079538, alt: 80.0 },
                m_scale: 35,
                minimumPixelSize: 80,
                m_color: Cesium.Color.CYAN,
                label: true,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                billboard: false,
                text: '车牌: 京A53137 '
            })

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.54439406642704, 29.54412750079538, 80.0),
                model: { lng: 106.54439406642704, lat: 29.54412750079538, alt: 80.0 },
                m_scale: 35,
                minimumPixelSize: 80,
                m_color: Cesium.Color.CYAN,
                label: true,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                billboard: false,
                text: '车牌: 京A52157 '
            })

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.53582326246042, 29.53843116134104, 80.0),
                model: { lng: 106.53582326246042, lat: 29.53843116134104, alt: 80.0 },
                m_scale: 35,
                minimumPixelSize: 80,
                m_color: Cesium.Color.CYAN,
                label: true,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                billboard: false,
                text: '车牌: 京B52688 '
            })

            this.addDynamicEntity({
                position: Cesium.Cartesian3.fromDegrees(106.57205354541892, 29.560026997082456, 300.0),
                model: { lng: 106.57205354541892, lat: 29.560026997082456, alt: 300.0 },
                m_scale: 35,
                minimumPixelSize: 80,
                m_color: Cesium.Color.GREEN,
                label: true,
                l_pixelOffset: new Cesium.Cartesian2(0, -20),
                billboard: false,
                text: ' 隔离区 '
            })
            this.addPoi(Cesium.Cartesian3.fromDegrees(106.55682326246042, 29.534247808485972, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.55882326246042, 29.534247808485972, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.55982326246042, 29.534247808485972, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.56082326246042, 29.534247808485972, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.56582326246042, 29.534247808485972, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.55982326246042, 29.52843116134104, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.56082326246042, 29.52843116134104, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.56582326246042, 29.52843116134104, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.54982326246042, 29.52843116134104, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.53082326246042, 29.52843116134104, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.55582326246042, 29.54843116134104, 1.0))

            this.addPoi(Cesium.Cartesian3.fromDegrees(106.54539406642704, 29.54412750079538, 1.0))

        })

        // this._viewer.scene.camera.moveEnd.addEventListener((move) => {

        //     console.log(this._util.getCameraPosition())

        // });
        // var _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas)
        // _handler.setInputAction((movement) => {

        //     var cartesian = this._util.getCatesian3FromPX(movement.position)

        //     console.log(this._util.transformCartesianToWGS84(cartesian))

        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // this._util.setDark()
        // this._util.getHandelPosition((position,handel)=>{
        //     console.log(position)

        // })

        // this._util.setScanCircleEffect({
        //     position: new Cesium.Cartesian3.fromDegrees(106.50642721790797, 29.658575326606123, 5.0)
        // })

        // this._util.drawLine((value) => {
        //     console.log(value)
        // })

    }
}

supermap.prototype.addRoadLine = function (url, polyline) {

    var DEF_STYLE = {
        width: 2
    }
    polyline = polyline || DEF_STYLE

    if (url) {

        this._util.addLineLayer({
            url: url,
            polyline: polyline
        })
    }
}

supermap.prototype.addDynamicCricle = function (opt) {

    var cricleEntity = this._util.createDynamicCricle({
        center: opt.circle,
        imge: opt.imge,
        material: new Cesium.CircleWaveMaterialProperty({
            color: opt.color || Cesium.Color.DARKCYAN.withAlpha(0.8),
            count: opt.count || 3,
            gradient: opt.gradient || 0.9
        }),
        radius: opt.radius || 100,
        height: opt.height || 0.1,
        rotateAmount: 0.01
    })
    this._viewer.entities.add(cricleEntity)


}


supermap.prototype.addDynamicEntity = function (opt) {

    var Entity = this._util.createEntity()

    if (opt.model) {
        Entity.model = this._util.getModel({
            m_url: opt.m_url || 'examples/data/model/zhui.glb',
            m_scale: opt.m_scale || 40,
            m_minimumPixelSize: opt.m_minimumPixelSize || 50,
            m_color: opt.m_color 
        })

        this._util.setRotateModel({
            entity: Entity,
            position: opt.model,
            rotateAmount: 4
        })
    }

    if (opt.billboard) {

        Entity.billboard = this._util.getBillboard({
            b_img: 'examples/images/Textures/warn.png',
            b_width: 55,
            b_height: 55,
            b_pixelOffset: opt.b_pixelOffset || new Cesium.Cartesian2(0, -60)

        })
    }

    if (opt.label) {
        Entity.label = this._util.getLabel({
            l_text: opt.text,
            l_font: '16px sans-serif',
            l_pixelOffset: opt.l_pixelOffset || new Cesium.Cartesian2(0, -100),
            l_fillColor: opt.l_fillColor || Cesium.Color.CYAN
        })
    }

    Entity.position = opt.position
    this._viewer.entities.add(Entity)

}

supermap.prototype.addPoi = function (position) {

    this._viewer.entities.add(this._util.createPoint({
        position: position,
        lable: false,
        point: false,
        billboard: {
            b_img: 'examples/images/Textures/poi2.png',
            b_width: 42,
            b_height: 140,
            b_scale: 1.5
        }
    }))
}

supermap.prototype.addRadianLineLight = function (positions,width, color,duration,angularityFactor = 50000, numOfSingleLine = 500, cutoffDistance = 100) {
    if (positions) {
        this._util.addMaterialLine({
            positions: this._util.getLinkedPointList(positions.startPoint, positions.endPoint, angularityFactor, numOfSingleLine),
            width: width,
            material: new Cesium.PolylineCityLinkMaterialProperty({
                color: color || Cesium.Color.CYAN,
                duration: duration
            })
        })
        // this._util.setPointLight(
        //     positions.endPoint,
        //     {
        //         color: new Cesium.Color(1, 1, 2, 0.8),
        //         cutoffDistance: cutoffDistance,
        //         decay: 0.5,
        //         intensity: 1
        //     })
    }
}

supermap.prototype.addHeightLineLight = function (opt) {

    if (opt) {

        this._util.addMaterialLine({
            positions: [opt.positions.startPoint, opt.positions.endPoint],
            width: opt.width || 50,
            material: new Cesium.PolylineCityLinkMaterialProperty({
                color: opt.color || new Cesium.Color(2, 2, 5, 0.8),
                duration: opt.duration || 30000
            })
        })

        if (opt.pointLight) {
            this._util.setPointLight(
                positions.startPoint,
                {
                    color: new Cesium.Color(1, 1, 2, 0.8),
                    cutoffDistance: opt.cutoffDistance || 800,
                    decay: 0.5,
                    intensity: 1
                })
        }
    }
}

supermap.prototype.addCircleLine = function (opt) {

    var ellipse = this._util.computeEllipseEdgePositions(opt)

    var positions = []
    for (let i = 0; i < ellipse.outerPositions.length; i += 3) {
        let cartesian = new Cesium.Cartesian3(ellipse.outerPositions[i], ellipse.outerPositions[i + 1], ellipse.outerPositions[i + 2]);
        positions.push(cartesian)
    }
    positions.push(positions[0])

    var circleLine = this._viewer.entities.add(this._util.createLine({
        positions: positions,
        width: 8,
        material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.CYAN,
        }),
    }))

    this._util.setDynamicHeight({
        entity: circleLine.polyline,
        cartesians: circleLine.polyline.positions._value,
        minHeiht: 40,
        maxHeiht: 220,
        speed: 0.01
    })
}
// 添加风墙
supermap.prototype.addWall = function (warn) {
    this._viewer.entities.add({
        wall: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(warn),
            material: new Cesium.WallLinkMaterialProperty({ freely: 'vertical', color: Cesium.Color.DARKGREEN.withAlpha(0.1), duration: 1000, count: 0, direction: '-' }),
        }
    });
}

supermap.prototype.addThreeObject = function () {


    // Lathe geometry
    var doubleSideMaterial = new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
    });
    var segments = 10;
    var points = [];
    for (var i = 0; i < segments; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * segments + 5, (i - 5) * 2));
    }
    var geometry = new THREE.LatheGeometry(points);
    var latheMesh = new THREE.Mesh(geometry, doubleSideMaterial);
    latheMesh.scale.set(100, 100, 100); //scale object to be visible at planet scale
    latheMesh.position.z += 1500.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    latheMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
    var latheMeshYup = new THREE.Group();
    latheMeshYup.add(latheMesh)
    this._util._three.scene.add(latheMeshYup); // don’t forget to add it to the Three.js scene manually

    var threeObject = []

    var maxWGS84 = [106.57003293712452, 29.524797836353418]
    var minWGS84 = [106.55003293712452, 29.504797836353418]

    var _3DOB = this._util.createThreeObject()
    _3DOB.maxWGS84 = maxWGS84
    _3DOB.minWGS84 = minWGS84
    _3DOB.threeMesh = latheMeshYup

    threeObject.push(_3DOB)

    this._util.addThreeObjects(threeObject)

}
/**
 * 初始化页面
 * 添加gu
 */
supermap.prototype.initGUI = function () {

    var viewer = this._viewer,
        gui = new dat.GUI();
    var sceneObj = new function () {
        //泛光开关
        this.bloomEffectShow = false,
        //泛光阈值
        this.bloomThreshold = 1
        //泛光强度
        this.bloomIntensity = 2
        //HDR开关
        this.hdrEnabled = true
        //颜色校正
        this.colorCorrectionShow = false
        //饱和度
        this.colorCorrectionSaturation = 3.1
        //亮度
        this.colorCorrectionBrightness = 1.8
        //对比度
        this.colorCorrectionContrast = 1.2
        //色调
        this.colorCorrectionHue = 0

        //环境光
        this.ambientLightColor = 0.1
    };
    var sceneEffect = gui.addFolder('场景效果')

    sceneEffect.add(sceneObj, 'bloomEffectShow').name('泛光开关').onChange(function (value) {
        viewer.scene.bloomEffect.show = value;
        viewer.scene.bloomEffect.threshold = sceneObj.bloomThreshold;
        viewer.scene.bloomEffect.bloomIntensity = sceneObj.bloomIntensity;
    });
    sceneEffect.add(sceneObj, 'bloomThreshold', 0, 1, 0.1).name('泛光阈值').onChange(function (value) {
        viewer.scene.bloomEffect.threshold = value;
    });
    sceneEffect.add(sceneObj, 'bloomIntensity', 0, 10, 0.1).name('泛光强度').onChange(function (value) {
        viewer.scene.bloomEffect.bloomIntensity = value;
    });
    sceneEffect.add(sceneObj, 'hdrEnabled').name('HDR开关').onChange(function (value) {
        viewer.scene.hdrEnabled = value;
    });
    sceneEffect.add(sceneObj, 'colorCorrectionShow').name('颜色校正').onChange(function (value) {
        viewer.scene.colorCorrection.show = value;
    });
    sceneEffect.add(sceneObj, 'colorCorrectionSaturation', 0, 5, 0.1).name('饱和度').onChange(function (value) {
        viewer.scene.colorCorrection.saturation = value;
    });
    sceneEffect.add(sceneObj, 'colorCorrectionBrightness', 0, 5, 0.1).name('亮度').onChange(function (value) {
        viewer.scene.colorCorrection.brightness = value;
    });
    sceneEffect.add(sceneObj, 'colorCorrectionContrast', 0, 5, 0.1).name('对比度').onChange(function (value) {
        viewer.scene.colorCorrection.contrast = value;
    });
    sceneEffect.add(sceneObj, 'colorCorrectionHue', 0, 5, 0.1).name('色调').onChange(function (value) {
        viewer.scene.hdrEnabled = value;
    });
    sceneEffect.add(sceneObj, 'colorCorrectionHue', 0, 1, 0.1).name('环境光').onChange(function (value) {
        viewer.scene.lightSource.ambientLightColor = new Cesium.Color(value, value, value, 1);
    });
    //sceneEffect.open()
}
/**
 * @Descripttion:添加点位
 * @Author: 陈杰
 * @Date: 2021-11-11 15:21:42
 * @LastEditors: 
 * @param {*}
 * @return {*}
 */
 supermap.prototype.addPointMark1=function(pointArray=[ { point:[104,34,50],img:""} ],option={name:"pointmark",fillColor:"#848A56",outlineColor:'"#000"',pixelOffset:[0,127],billboardpixelOffset:[0,20]}){
    var  viewer=this._viewer;
    let pointMarkCollection=new Cesium.CustomDataSource(option.name?option.name:'pointmark')
        if(pointArray instanceof Array){
        
            pointArray.forEach((item,i)=>{
                
                pointMarkCollection.entities.add(
                    {
                        id:item.id?item.id:Date.parse(new Date()),
                        properties:item,
                        position: Cesium.Cartesian3.fromDegrees(item.point[0],item.point[1],(item.point[2]?item.point[2]:0)),
                        billboard:{
                                image:item.img,
                                pixelOffset:option.billboardpixelOffset?new Cesium.Cartesian2(option.billboardpixelOffset[0],option.billboardpixelOffset[1]):new Cesium.Cartesian2(0,0),//广告牌位移位置
                                // verticalOrigin:Cesium.VerticalOrigin.BOTTOM ,
                                // width:option.width?option.width:50,
                                // height:option.height?option.height:50,
                                 width:option.width?option.width:50,
                                height:option.height?option.height:50,
                                // pixelOffset:new Cesium.Cartesian2(280,-60),//广告牌位移位置
                                // color:new Cesium.Color(1.0, 1.0, 1.0, 1),
                                scaleByDistance: new Cesium.NearFarScalar(2000, 1, 10000, 0.6),//根据广告牌与相机的距离获取或设置广告牌的近和远缩放属性。广告牌的比例将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。超出这些范围时，广告牌的比例将保持在最近的范围内。如果未定义，scaleByDistance将被禁用
                                pixelOffsetScaleByDistance: new Cesium.NearFarScalar( //据广告牌与摄像头的距离，获取或设置广告牌的近像素偏移量和远像素偏移量缩放属性。广告牌的像素偏移将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。在这些范围之外，广告牌的像素偏移比例将保持钳位到最近的范围。如果未定义，pixelOffsetScaleByDistance将被禁用。
                                    2000,
                                    1,
                                    10000,
                                    0.2
                                )
                        },
                            label: {
                                text:item.text?item.text:"",
                                font: "16pt 微软雅黑",
                                // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                //fillColor: Cesium.Color.fromCssColorString('#3e2ca0'),
                                fillColor: Cesium.Color.fromCssColorString(option.fillColor?option.fillColor:"#848A56"),
                                outlineColor: Cesium.Color.fromCssColorString(option.outlineColor?option.outlineColor:"#000"),
                                backgroundColor : new Cesium.Color(0.165, 0.165, 0.165, 0.8),
                                backgroundPadding : new Cesium.Cartesian2(10, 10),
                                style : Cesium.LabelStyle.FILL,
                                outlineWidth: 4,
                                showBackground: true, //确定是否显示该标签后面的背景。
                                verticalOrigin: Cesium.VerticalOrigin.Top,
                                pixelOffset: new Cesium.Cartesian2(option.pixelOffset?option.pixelOffset[0]:0,option.pixelOffset?option.pixelOffset[1]:0),
                                eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                                    2000,
                                    1,
                                    10000,
                                    0.2
                                ),
                                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                                //     0,
                                //     5000
                                // )
                                }
        
        
                    }
                )
            })
    
            return pointMarkCollection;



        }else{
            console.error('未传入数组')
        }
        viewer.dataSources.add(pointMarkCollection)
        // viewer.flyTo(pointMarkCollection)
        return pointMarkCollection;
}
supermap.prototype.addPolygn=function(geojson,calback){
    let  viewer=this._viewer;
    let promise=Cesium.GeoJsonDataSource.load(geojson,{
        stroke: Cesium.Color.WHITE.withAlpha(0),
        fill: Cesium.Color.BLUE.withAlpha(0),
        strokeWidth: 5,
        // markerSymbol: '?'
    })
    promise.then(function(dataSource){
        viewer.dataSources.add(dataSource)
        let entities=dataSource.entities.values;
        calback?calback(dataSource):null; //返回
            for(let i=0;i<entities.length;i++){
                let enty=entities[i];
                enty.polygon.material= Cesium.Color.fromCssColorString((enty.properties.color?enty.properties.color._value:'rgba(122,163,62,0.6)'));
                // enty.polygon.heightReference=Cesium.HeightReference.RELATIVE_TO_GROUND;
                enty.polygon.height=10; //地形上方高度
                let polyPositions = enty.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                let  polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                dataSource.entities.add({
                    id:i,
                    position:polyCenter,
                    label:{
                        text:((enty.properties.num?enty.properties.num._value:'')+''),
                        font: "16pt 微软雅黑",
                        style : Cesium.LabelStyle.FILL,
                        fillColor:Cesium.Color.fromCssColorString("#333333"),
                        pixelOffset:new Cesium.Cartesian2(0,-10),
                        eyeOffset: new Cesium.Cartesian3(0, 0,-10),
                        heightReference:Cesium.HeightReference.NONE,
                        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                            2000,
                            1,
                            10000,
                            0.2
                        ),
                    }
                })
            }
          
         
    })
   

}
supermap.prototype.addPointMark=function(pointArray=[ { point:[104,34,50],img:""} ],option={name:"pointmark",fillColor:"#848A56",outlineColor:'"#000"',pixelOffset:[0,127],billboardpixelOffset:[0,20]}){
    var  viewer=this._viewer;
    let pointMarkCollection=new Cesium.CustomDataSource(option.name?option.name:'pointmark');
        if(pointArray instanceof Array){
            pointArray.forEach((item,i)=>{
                pointMarkCollection.entities.add(
                        {
                            id:item.id?item.id:Date.parse(new Date()),
                            properties:item,
                            position: Cesium.Cartesian3.fromDegrees(item.point[0],item.point[1],(item.point[2]?item.point[2]:0)),
                            billboard:{
                                    image:item.img,
                                    pixelOffset:option.billboardpixelOffset?new Cesium.Cartesian2(option.billboardpixelOffset[0],option.billboardpixelOffset[1]):new Cesium.Cartesian2(0,0),//广告牌位移位置
                                    // verticalOrigin:Cesium.VerticalOrigin.BOTTOM ,
                                    width:option.width?option.width:30,
                                    height:option.height?option.height:30,
                                    // pixelOffset:new Cesium.Cartesian2(280,-60),//广告牌位移位置
                                    // color:new Cesium.Color(1.0, 1.0, 1.0, 1),
                                    scaleByDistance: new Cesium.NearFarScalar(2000, 1, 10000, 0.6),//根据广告牌与相机的距离获取或设置广告牌的近和远缩放属性。广告牌的比例将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。超出这些范围时，广告牌的比例将保持在最近的范围内。如果未定义，scaleByDistance将被禁用
                                    pixelOffsetScaleByDistance: new Cesium.NearFarScalar( //据广告牌与摄像头的距离，获取或设置广告牌的近像素偏移量和远像素偏移量缩放属性。广告牌的像素偏移将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。在这些范围之外，广告牌的像素偏移比例将保持钳位到最近的范围。如果未定义，pixelOffsetScaleByDistance将被禁用。
                                        2000,
                                        1,
                                        10000,
                                        0.2
                                    )
                            },
                            label: {
                                text:item.text?item.text:"",
                                font: "16pt 微软雅黑",
                                // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                //fillColor: Cesium.Color.fromCssColorString('#3e2ca0'),
                                fillColor: Cesium.Color.fromCssColorString(option.fillColor?option.fillColor:"#848A56"),
                                outlineColor: Cesium.Color.fromCssColorString(option.outlineColor?option.outlineColor:"#000"),
                                backgroundColor : new Cesium.Color(0.165, 0.165, 0.165, 0.8),
                                backgroundPadding : new Cesium.Cartesian2(10, 10),
                                style : Cesium.LabelStyle.FILL,
                                outlineWidth: 4,
                                showBackground: true, //确定是否显示该标签后面的背景。
                                verticalOrigin: Cesium.VerticalOrigin.Top,
                                pixelOffset: new Cesium.Cartesian2(option.pixelOffset?option.pixelOffset[0]:0,option.pixelOffset?option.pixelOffset[1]:0),
                                eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                                    2000,
                                    1,
                                    10000,
                                    0.2
                                ),
                                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                                //     0,
                                //     5000
                                // )
                                }
                    }
                )
            })
        }else{
            console.error('未传入数组')
        }
        viewer.dataSources.add(pointMarkCollection)
        // viewer.flyTo(pointMarkCollection)
        return pointMarkCollection;
}
var assetsTipImage=null;

// canvas绘字，未开发完成
supermap.prototype.addCanvastext=function(pointArray=[ { point:[104,34,50],img:""} ],option={name:"pointmark",fillColor:"#848A56",outlineColor:'"#000"',pixelOffset:[0,127],billboardpixelOffset:[0,20]}){
    var  viewer=this._viewer;
    let pointMarkCollection=new Cesium.CustomDataSource(option.name?option.name:'pointmark')
        if(pointArray instanceof Array){
            pointArray.forEach((item,i)=>{
                getassetTipTexture({text:'那好'},(canvas)=>{
                    pointMarkCollection.entities.add(
                        {
                            id:item.id?item.id:Date.parse(new Date()),
                            properties:item,
                            position: Cesium.Cartesian3.fromDegrees(item.point[0],item.point[1],(item.point[2]?item.point[2]:0)),
                            billboard:{
                                    image:canvas,
                                    pixelOffset:option.billboardpixelOffset?new Cesium.Cartesian2(option.billboardpixelOffset[0],option.billboardpixelOffset[1]):new Cesium.Cartesian2(0,0),//广告牌位移位置
                                    // pixelOffset:new Cesium.Cartesian2(0,-60),//广告牌位移位置
                                    width:option.width?option.width:93,
                                    height:option.height?option.height:134,
                                    // color:new Cesium.Color(1.0, 1.0, 1.0, 1),
                                    scaleByDistance: new Cesium.NearFarScalar(2000, 1, 10000, 0.6),//根据广告牌与相机的距离获取或设置广告牌的近和远缩放属性。广告牌的比例将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。超出这些范围时，广告牌的比例将保持在最近的范围内。如果未定义，scaleByDistance将被禁用
                                    pixelOffsetScaleByDistance: new Cesium.NearFarScalar( //据广告牌与摄像头的距离，获取或设置广告牌的近像素偏移量和远像素偏移量缩放属性。广告牌的像素偏移将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。在这些范围之外，广告牌的像素偏移比例将保持钳位到最近的范围。如果未定义，pixelOffsetScaleByDistance将被禁用。
                                        2000,
                                        1,
                                        10000,
                                        0.2
                                    )
                            },
                                label: {
                                    text:item.text?item.text:"",
                                    font: "12pt 微软雅黑",
                                    // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                    //fillColor: Cesium.Color.fromCssColorString('#3e2ca0'),
                                    fillColor: Cesium.Color.fromCssColorString(option.fillColor?option.fillColor:"#848A56"),
                                    outlineColor: Cesium.Color.fromCssColorString(option.outlineColor?option.outlineColor:"#000"),
                                    outlineWidth: 4,
                                    showBackground: false,
                                    verticalOrigin: Cesium.VerticalOrigin.Top,
                                    pixelOffset: new Cesium.Cartesian2(option.pixelOffset?option.pixelOffset[0]:0,option.pixelOffset?option.pixelOffset[1]:-127),
                                    
                                    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                                        2000,
                                        1,
                                        10000,
                                        0.2
                                    ),
                                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                                    //     0,
                                    //     5000
                                    // )
                                    }
            
            
                        }
                    )




                })
            })
            
            function getassetTipTexture(prop,caback){
                var img = document.createElement('img');
                
                img.src =TEXTBOX;
                img.onload = function(){
                    assetsTipImage = img;
                    drawAssetsTip(prop,caback)
                };
            }
            
            function drawAssetsTip(prop,caback){
                // if (typeof assetsTipImage == 'undefined') return;
                var dom = prop.text;
                var canvas = document.createElement("canvas");
                // canvas.width =200;
                // console.log(canvas.width)
                // canvas.height = 74;
                var context = canvas.getContext('2d');
                //绘制背景
                context.drawImage(assetsTipImage, 0, 0);
                //绘制第一行数字
                context.font = '10px bold 宋体';
                context.fillStyle = "#fff";
                context.fillText(dom, 0,30);
                //绘制第一行数字
                // var dom = "个";
                // context.font = '10px bold 宋体';
                // context.fillStyle = "#ffef00";
                // context.fillText(dom, 40, 35);
                // //绘制第一行数字
                // var dom = prop.assets;
                // context.font = '10px bold 宋体';
                // context.fillStyle = "#f4fff0";
                // context.fillText(dom, 20, 45);
                // return canvas;
                caback?caback(canvas):null;
            }
        }else{
            console.error('未传入数组')
        }
        viewer.dataSources.add(pointMarkCollection)
        // viewer.flyTo(pointMarkCollection)
        return pointMarkCollection;
    
}

/**
 * @Descripttion: 删除实体方法
 * @Author: 陈杰
 * @Date: 2021-11-11 16:46:44
 * @LastEditors: 
 * @param {*} Collection
 * @return {*}
 */
supermap.prototype.removeAllCollection=function(Collection){
    Collection.entities.removeAll()
}
// 分屏
/**
 * @Descripttion: 
 * @Author: 陈杰
 * @Date: 2021-12-05 21:20:24
 * @LastEditors: 
 * @param {*} NONE 不使用分屏 HORIZONTAL垂直分屏 TRIPLE三视口 VerticalTrisection水平三视口 QUAD四视口
 * @return {*}
 */
supermap.prototype.MultiViewportMode=function(value){
    this._viewer.scene.multiViewportMode = Cesium.MultiViewportMode[value];
}
/**
 * @Descripttion: 
 * @Author: 陈杰
 * @Date: 2022-01-21 20:12:26
 * @LastEditors: 
 * @param {*}
 * @return {*}
 */
supermap.prototype.shutterContrast=function(provider,direction){
    if(!provider||this.rollerShutterConfig){ //移除卷帘
        document.getElementById('vertical-slider').style.display='none';//显示
        this.rollerShutterConfig.latestSplitDirection = this.rollerShutterConfig.splitDirection;
        this.rollerShutterConfig.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.NONE);
       
        setRollerShutterSplit(this._viewer,this.rollerShutterConfig);
        this.rollerShutterConfig=null;
        return ;
    }
    let windowWidth = document.body.offsetWidth;
    let windowHeight =document.body.offsetHeight; // 窗口高度
   let  rollerShutterConfig = { // 卷帘配置参数，以对象方式实现地址传递
        splitDirection: new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT, Cesium.ImagerySplitDirection.NONE), // 初始时屏蔽左侧
        verticalSplitPosition: windowWidth / 2,
        horizontalSplitPosition: windowHeight / 2,
        imageryLayers: [provider], // 参与卷帘的影像图层数组
        latestSplitDirection: null // 用于在禁用卷帘后恢复之前的卷帘方向
    };
    this.rollerShutterConfig=rollerShutterConfig;
    document.getElementById('vertical-slider').style.display='block';//显示
    setRollerShutterSplit(this._viewer, rollerShutterConfig);
    bindSliderEvt(this._viewer, rollerShutterConfig);
    rollerShutterConfig.splitDirection=new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT, Cesium.ImagerySplitDirection.NONE)
    // 初始化卷帘。设置分割条初始位置及绑定相关事件。
    function setRollerShutterSplit(viewer, rollerShutterConfig) {
        let splitPosition = null;
        if (rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT, Cesium.ImagerySplitDirection.NONE))
            || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT, Cesium.ImagerySplitDirection.NONE))) {
            splitPosition = rollerShutterConfig.verticalSplitPosition;
        } else if (rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.TOP))
            || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.BOTTOM))) {
            splitPosition = rollerShutterConfig.horizontalSplitPosition;
        }
        for (var imageryLayer of rollerShutterConfig.imageryLayers) {
            imageryLayer.splitDirection = rollerShutterConfig.splitDirection;
        }
        if (splitPosition) { // 如果禁用卷帘就没有必要设置分割位置
            if (rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT, Cesium.ImagerySplitDirection.NONE))
                || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT, Cesium.ImagerySplitDirection.NONE))) {
                viewer.scene.imagerySplitPosition.x = splitPosition /windowWidth;
            } else if (rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.TOP)) ||
                rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.BOTTOM))) {
                viewer.scene.imagerySplitPosition.y = splitPosition /windowHeight;
            }
        }
    }
    // 注册卷帘分割条的拖拽事件。
    function bindSliderEvt(viewer, rollerShutterConfig) {
        let verticalSlider = document.getElementById('vertical-slider'); // 垂直分割条
        let horizontalSlider = document.getElementById('horizontal-slider'); // 水平分割条
        verticalSlider.addEventListener('mousedown', mouseDown, false);
        horizontalSlider.addEventListener('mousedown', mouseDown, false);
        let windowHeight = windowWidth;
        document.addEventListener('mouseup', mouseUp, false);
        function mouseUp(e) {
            document.removeEventListener('mousemove', sliderMove, false);
        }
        function mouseDown(e) {
            document.addEventListener('mousemove', sliderMove, false);
        }
        function sliderMove(e) { // 鼠标拖拽时执行
            // 解决拖拽鼠标粘滞的问题
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            if (rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT, Cesium.ImagerySplitDirection.NONE))
                || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT, Cesium.ImagerySplitDirection.NONE))) {
                verticalSlider.style.left = e.clientX + 'px';
                rollerShutterConfig.verticalSplitPosition = e.clientX;
            } else if (rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.TOP))
                || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.BOTTOM))) {
                let clientY = e.clientY;
                if (clientY < 0) {
                    clientY = 0;
                } else if (clientY > windowHeight) {
                    clientY = windowHeight - document.getElementById('horizontal-slider').offsetHeight;
                }
                horizontalSlider.style.top = clientY + 'px';
                rollerShutterConfig.horizontalSplitPosition = windowHeight - clientY;
            }
            setRollerShutterSplit(viewer, rollerShutterConfig);
        }
    }
}
supermap.prototype.removeShutterContrast=function(){





}
/**
 * @Descripttion:设置弹框位置
 * @Author: 陈杰
 * @Date: 2021-11-11 16:26:23
 * @LastEditors: element id元素point=[104,30] option={left:0,top:-100}
 * @param {*}
 * @return {*}
 */
supermap.prototype.setPoup=function(element,point,option={left:0,top:-100}){
    let  _this=this;
    var  viewer=this._viewer;
    _this.postRender=function(){
        if(!point ){
            return 
            }
            var postion=wgs84ToWindowCoordinates(viewer,point);
            setHtml(element,postion,option)
    }
    if(!element){
        viewer.scene.postRender.removeEventListener(_this.postRender,_this);
        this.postRenderobj=null;
        _this.postRender=null;
        return ;
    }
   
    if(!viewer){
        return ;
    }
    if(this.postRenderobj){
        viewer.scene.postRender.removeEventListener(_this.postRender,_this);
        this.postRenderobj=null;
    }
    let position2=null;
    let position1=null;
    var postion=wgs84ToWindowCoordinates(viewer,point);
    setHtml(element,postion,option)
    function wgs84ToWindowCoordinates(viwer,point){
            let ellipsoid=viwer.scene.globe.ellipsoid;
            let cartographic=Cesium.Cartographic.fromDegrees(point[0],point[1],0);
            let cartesian3=ellipsoid.cartographicToCartesian(cartographic);
            let postion=Cesium.SceneTransforms.wgs84ToWindowCoordinates(viwer.scene, cartesian3);
            return postion;
    }
    function fontSize(res) {
        let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (!clientWidth) {
            return res
        }
        return res * (clientWidth / 1920);
    }
    function  setHtml(element,postion,option) {
            let clientWidth=document.getElementById(element).clientWidth/2;
            let clienHeight=document.getElementById(element).clientHeight;
                document.getElementById(element).style.left=0
                document.getElementById(element).style.left=(postion.x+'px');
                document.getElementById(element).style.top=0
                document.getElementById(element).style.top=(postion.y+'px')
                document.getElementById(element).style.marginLeft =(0-(clientWidth-fontSize(option.left)))+'px'
                document.getElementById(element).style.marginTop =(0-(clienHeight-option.top))+'px';
                
    }
    if(!this.postRenderobj){
        this.postRenderobj=viewer.scene.postRender.addEventListener(_this.postRender,_this);
    }
}
/**
 * @Descripttion: 设置多个弹框
 * @Author: 陈杰
 * @Date: 2021-11-16 17:48:13
 * @LastEditors: 
 * @param {*} element
 * @param {*} point
 * @param {*} option
 * @param {*} top
 * @return {*}
 */
supermap.prototype.setPoupArray=function(element,point,option={left:0,top:-100}){
    let  _this=this;
    var  viewer=this._viewer;
  
    if(!element){
        for (const key in _this.postRenderobjArrayObj) {
            viewer.scene.postRender.removeEventListener(_this.postRenderobjpostrenderObj[key],_this);
        }
        _this.postRenderobjArrayObj={};
        _this.postRenderobjpostrenderObj={}
        return ;
    }
   
    if(!viewer){
        return ;
    }
    _this.postRenderobjpostrenderObj[element]=function(){
        if(!point ){
            return 
            }
            var postion=wgs84ToWindowCoordinates(viewer,point);
            setHtml(element,postion,option)
    }
    _this.postRenderobjArrayObj[element]=viewer.scene.postRender.addEventListener(_this.postRenderobjpostrenderObj[element],_this);
    // if(this.postRenderobj){
    //     viewer.scene.postRender.removeEventListener(_this.postRender,_this);
    //     this.postRenderobj=null;
    // }
    // _this.postRenderobjArrayObj[element]=viewer.scene.postRender.removeEventListener(_this.postRenderobjpostrenderObj[element],_this);
    let position2=null;
    let position1=null;
    var postion=wgs84ToWindowCoordinates(viewer,point);
    setHtml(element,postion,option)
    function wgs84ToWindowCoordinates(viwer,point){
            let ellipsoid=viwer.scene.globe.ellipsoid;
            let cartographic=Cesium.Cartographic.fromDegrees(point[0],point[1],0);
            let cartesian3=ellipsoid.cartographicToCartesian(cartographic);
            let postion=Cesium.SceneTransforms.wgs84ToWindowCoordinates(viwer.scene, cartesian3);
            return postion;
    }
    function fontSize(res) {
        let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (!clientWidth) {
            return res
        }
        return res * (clientWidth / 1920);
    }
    function  setHtml(element,postion,option) {
            let clientWidth=document.getElementById(element).clientWidth/2;
            let clienHeight=document.getElementById(element).clientHeight;
                document.getElementById(element).style.left=0
                document.getElementById(element).style.left=(postion.x+'px');
                document.getElementById(element).style.top=0
                document.getElementById(element).style.top=(postion.y+'px')
                document.getElementById(element).style.marginLeft =(0-(clientWidth-fontSize(option.left)))+'px'
                document.getElementById(element).style.marginTop =(0-(clienHeight-option.top))+'px';
                
    }
 
  return  _this.postRenderobjArrayObj;
}
/*弹框样式*/
/**
 * @Descripttion: 设置弹框
 * @Author: 陈杰
 * @Date: 2021-11-11 17:00:30
 * @LastEditors: 
 * @param {*} data
 * @return {*}
 */
supermap.prototype.setInfoPoup=function(el,dataobj){
    if(!dataobj){
        return ;
    }
    let introduce=null
    let cnt=`<div id="poupcesium">
                 <img src="../commponents/infopoup/image/top.png" class="poup-top"/>
                 <div class="poup-content">
                 <h3 class="poup-content-title" >${dataobj.title?dataobj.title:''}</h3>
                 ${
                     (()=>{
                        if(dataobj.data&&dataobj.data instanceof Array){
                            return  dataobj.data.map(function(e){
                                return ` <p class="poup-content-title-box" ><span  class="poup-content-title_item" >${e.title}：</span><span class="poup-content-title_item-cont">${e.cnt}</span></p>`
                            }).join('')
                        }
                     })()
                 }
                 </div>
                 <img src="../commponents/infopoup/image/bottom.png" class="poup-bottom">
                 <div class="bottom-arrow-box" id="pouparrow">

                        <img src="../commponents/infopoup/image/arrow.png" class="poup-arrow">
                </div>
            </div>`
    document.getElementById(el).innerHTML=cnt

}

/**
 * @Descripttion: 设置视频弹框
 * @Author: 陈杰
 * @Date: 2021-11-15 18:56:50
 * @LastEditors: 
 * @param {*} el
 * @param {*} url
 * @param {*} calback
 * @return {*}
 */
supermap.prototype.setVideoPoup=function(el,url='https://www.runoob.com/try/demo_source/mov_bbb.mp4',calback){
    function close(){
        document.getElementById(el).innerHTML='';
        document.getElementById('el-icon-close')?document.getElementById('el-icon-close').removeEventListener('click',close,false):null
        calback?calback():null
    }
    let introduce=null;
    let cnt=`<div id="poupcesium" style="width:364px" class="poupcesium-video">
                    <img src="../commponents/infopoup/image/top.png" class="poup-top poup-top-video"/>
                    <div class="poup-content poup-content-video">
                        <h3 class="poup-content-title" style="box-sizing: border-box;" ><span>某某摄像监控</span><span class="el-icon-close" id="el-icon-close">x</span></h3>
                        <div class="poup-video">
                            <video src='examples/data/cs.mp4' preload='auto' controls='controls' ></video>
                        </div>
                    
                    </div>
                    <img src="../commponents/infopoup/image/bottom.png" class="poup-bottom poup-top-video">
            </div>`
     document.getElementById(el).innerHTML=cnt;
     document.getElementById('el-icon-close').addEventListener('click',close,false)

}
/**
 * @Descripttion: 设置警告框
 * @Author: 陈杰
 * @Date: 2021-11-15 18:57:15
 * @LastEditors: 
 * @param {*}
 * @return {*}
 */
 supermap.prototype.warningPoup=function(el,data){
        let introduce=null;
        let div= document.createElement('div');
        div.className='poupcesiumwarning'
       
        let cnt=(`<div class="poupcesiumwarning-title">${data.title?data.title:""}</div><ul    class="poupcesiumwarning-box">
                        ${
                            (()=>{
                                if(data.data&&data.data instanceof Array){
                                    return data.data.map((item,i)=>{
                                        return (
                                         `<li class="poupcesiumwarning-box-item">
                                                <span class="poupcesiumwarning-box-item-title">${item.title?item.title:""}:</span>
                                                <span class="poupcesiumwarning-box-item-cnt">${item.cnt?item.cnt:""}</span>
                                            </li>`
                                        )
                                    }).join('')
                                }
                            })()
                        }
                </ul>`
        )   
                    // <li class="poupcesiumwarning-box-item">
                        //     <span class="poupcesiumwarning-box-item-title">编号:</span>
                        //     <span class="poupcesiumwarning-box-item-cnt">0001</span>
                        // </li>
    div.id=el;
    document.body.append(div);         
     document.getElementById(el).innerHTML=cnt;
     
 }
 /**
  * @Descripttion: 交通事故弹框
  * @Author: 陈杰
  * @Date: 2021-11-17 10:16:04
  * @LastEditors: 
  * @param {*} el
  * @param {*} data
  * @return {*}
  */ 
 supermap.prototype.warningimgPoup=function(el,data){
    let introduce=null;
    let div= document.createElement('div');
    div.className='poupcesiumwarningimg'
   
    let cnt=(`<div class="poupcesiumwarning-title">${data.title?data.title:""}</div><div class="poupcesiumwarning-box poupcesiumwarning-box-traffic">
                    <img src=${data.img} class="poupcesiumwarning-trafficimg"/>
                    <span class="poupcesiumwarning-translation">${data.description?data.description:""}</span>
                </div>`
            )   
            //  ${
            //             (()=>{
            //                 if(data.data&&data.data instanceof Array){
            //                     return data.data.map((item,i)=>{
            //                         return (
            //                          `<li class="poupcesiumwarning-box-item">
            //                                 <span class="poupcesiumwarning-box-item-title">${item.title?item.title:""}:</span>
            //                                 <span class="poupcesiumwarning-box-item-cnt">${item.cnt?item.cnt:""}</span>
            //                             </li>`
            //                         )
            //                     }).join('')
            //                 }
            //             })()
            //         }
div.id=el;
document.body.append(div);         
 document.getElementById(el).innerHTML=cnt;
 
}
 /**
 * @Descripttion: 交通事故弹框图片
 * @Author: 陈杰
 * @Date: 2021-11-16 17:23:29
 * @LastEditors: 
 * @param {*} el
 * @param {*} dataobj
 * @return {*}
 */
supermap.prototype.setTrafficHazardsPoup=function(el,dataobj={img:"image/traffic/1.jpg",text:'发生交通视图发生交通视图发生交通视图发生交通视图发生交通视图发生交通视图'}){
    // if(!dataobj){
    //     return ;
    // }
    let div= document.createElement('div');
    div.className='poupcesiumtraffic'
    let cnt=`<div id="poupcesium">
                 <img src="../commponents/infopoup/image/top.png" class="poup-top"/>
                 <div class="poup-content">
                    <img src=${dataobj.img} class="poup-content-traffic-img"/>
                    <p class="poup-content-traffic-text">${dataobj.text?dataobj.text:""}</p>
                 </div>
                 <img src="../commponents/infopoup/image/bottom.png" class="poup-bottom">
                //  <div class="poupcesiumtraffic-bottom-arrow-box" id="pouparrow">

                //         <img src="../commponents/infopoup/image/arrow.png" class="poup-arrow">
                // </div>
            </div>`
        div.id=el;
        document.body.append(div);  
     document.getElementById(el).innerHTML=cnt

}
supermap.prototype.heatmap=function(){




    
}
/**
 * 添加无人机投影
 */
supermap.prototype.addFlyViewe = function (paths) {
    var flyEntity = this._util.setPathRoaming({

        paths: paths,
        model: true,
        m_url: 'examples/data/model/CesiumDrone.gltf',
        label: true,
        l_text: '无人机',
        l_outlineWidth: 3,
        l_fillColor: Cesium.Color.CYAN
    })
    var pointLight = this._util.setPointLight(
        flyEntity.position.getValue(this._viewer.clock.currentTime),
        {
            color: new Cesium.Color(9, 160, 15, 0.8),
            cutoffDistance: 500,
            decay: 2,
            intensity: 5
        })

    this._viewer.clock.onTick.addEventListener((clock) => {
        var position = flyEntity.position.getValue(this._viewer.clock.currentTime)
            if(position){
                pointLight.position = position
            }
    });

    this.Lights.push(pointLight)

}
supermap.prototype.createCss3Renderer = function (param) {

    param.obj.addEntityLayer({
        id: param.id,
        position: param.position,//高度为 boxHeightMax
        element: `<div class='ysc-dynamic-layer ys-css3-box' id='` + param.id + `'>
               <div class='line'></div>
               `+ param.div + `
           </div>`,
        offset: [10, -250],
        boxShow: false,
        circleShow: false,
    })

}
/**
 * 初始化场景
 * 
 */
supermap.prototype.closeScene = function (callback) {

    //初始化所有效果
    this._viewer.scene.camera.stopFlyCircle();

    //实体
    this._viewer.entities.removeAll()

    //特效
    for (let i in this.postProcess) {

        this._scene.postProcessStages.remove(this.postProcess[i])
    }
    //图元
    for (let i in this.primitives) {
        this._scene.primitives.remove(this.primitives[i])
    }

    //光源
    for (let i in this.Lights) {

        this._viewer.scene.removeLightSource(this.Lights[i]);
    }

    // 弹窗
    if (this._layers) this._layers.closeAll();

    // 热力图
    if (this.heatMapImgName && this.heatMapImgName.length > 0) {

        for (let layer of this._layerGroup) {

            for (let name of this.heatMapImgName) {

                layer.removeOverlayImage(name);
            }

        }
        this.heatMapImgName = []
    }

    //标牌
    if (this._css3Renderer) {

        this._css3Renderer.removeEntityLayer('labelTip');
        this._css3Renderer = undefined;
    }
    if (this._css3Renderer6) {
        this._css3Renderer6.removeEntityLayer('labelTip');
        this._css3Renderer6 = undefined;
    }
    if (this._css3Renderer7) {
        this._css3Renderer7.removeEntityLayer('labelTip');
        this._css3Renderer7 = undefined;
    }

    // init clock
    this._viewer.clock.startTime = new Cesium.JulianDate()
    this._viewer.clock.currentTime = this._viewer.clock.startTime
    this._viewer.clock.multiplier = 1.0
    this._viewer.shouldAnimate = true


    // // 去除下雨下雪
    // if($(".rain-effect")){
    //     $(".rain-effect").unbind();
    // }   
    // if($(".snow-effect")){
    //     $(".snow-effect").unbind();
    // }
    
    if(this.TQXY){
        this.TQXY.enabled = false;
    }
    if(this.TQXX){
        this.TQXX.enabled = false;
    }
    // 删除弹框
    $(".map-weather").hide();

    // 路况专题
    if (this.searchPointsCollection) {
        this.searchPointsCollection.entities.removeAll();
        $('.map-roadCondition').hide();
        //this.measure.clearAll();
    }


    // this._util.flyTo({
    //     position: { x: -2178243.864201297, y: 4381910.723903083, z: 4093349.024458371 },
    //     orientation: {
    //         heading: Cesium.Math.toRadians(90.06027123960881),
    //         pitch: Cesium.Math.toRadians(-40.88443857899552),
    //         roll: Cesium.Math.toRadians(359.99916052293423)
    //     },
    //     duration: 5,
    //     callback: () => {

    //         if (typeof callback === 'function') {

    //             callback()
    //         } else {
    //             // 
    //             this._state = this._STATECODE.zero
    //         }
    //     }
    // })
    policeTopic?policeTopic.remove():null;
    DeviceInformation? DeviceInformation.remove():null;//移除设备信息
    videoSurveillance?videoSurveillance.remove():null;//移除视频监控
    topicOfPolice?topicOfPolice.remove():null;//移除警情
    trafficHazards?trafficHazards.remove():null;
    trafficHotspot?trafficHotspot.remove():null;
    policeTopics?policeTopics.remove():null;
    if (typeof callback === 'function') {
        callback()
    }
}
supermap.prototype.fontSize=function(res) {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) {
        return res
    }
    
    return res * (clientWidth / 1920);
}
supermap.prototype.flyEntity=function(enty,option) {
    this._viewer.flyTo(enty,{
    	// offset:new Cesium.HeadingPitchRange(option.heading,option.pitch,option.roll)
        // offset:option 
    })
   
}
supermap.prototype.flyToCameralong=function(destination, duration = 3, callBack = null) {
   
    this._viewer.scene.camera.flyTo({
        destination:Cesium.Cartesian3.fromDegrees(destination.position[0],destination.position[1],destination.position[2]?destination.position[2]:0),
        orientation: {
            heading:destination.heading,
            pitch:destination.pitch,
            roll:destination.roll,
        },
        duration: duration,
        complete: function () {
            if (callBack) {
                callBack();
            }else{
                console.log('定位失败！');
            }
        },
    });
}
supermap.prototype.flyToCamera=function(destination, duration = 3, callBack = null) {
    this._viewer.scene.camera.flyTo({
        destination:new Cesium.Cartesian3(destination.position.x,destination.position.y,destination.position.z),
        orientation: {
            heading:destination.heading,
            pitch:destination.pitch,
            roll:destination.roll,
        },
        duration: duration,
        complete: function () {
            if (callBack) {
                callBack();
            }else{
                console.log('定位失败！');
            }
        },
    });
}
supermap.prototype.rotateHeading=function(coord){
    let viewer=this._viewer;
    let camera=viewer.scene.camera;
    let secene=viewer.scene
    let heading=Cesium.Math.toDegrees(camera.heading);
    if(heading>=360 || heading<=-360){
                heading=0;
    }
    heading=heading+0.25;
    let pitch=viewer.camera.pitch;
    let distance=viewer.camera.distance;
    let ellipsoid=viewer.scene.globe.ellipsoid;
    let cartographic=ellipsoid.cartesianToCartographic(viewer.camera.position);
    let lat=Cesium.Math.toDegrees(cartographic.latitude);
    let lng=Cesium.Math.toDegrees(cartographic.longitude);
    // let distance=cartographic.height;
    camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(coord[0], coord[1],distance),
        orientation: {
            heading : Cesium.Math.toRadians(heading),
            pitch : pitch,
            endTransform: Cesium.Matrix4.IDENTITY
        }

    })









}
export default supermap;