/*
 * @Author: your name
 * @Date: 2022-02-14 18:41:28
 * @LastEditTime: 2022-02-24 09:52:56
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dianziditu\public\config.js
 */
var CONFIG={
    // 图层选择
    layers:[
        {
            title:'发展',
            children:[
                {
                    title:'H地区三维行人道路网',
                    url:'http://222.73.139.7:8082/tileMap/services/MapServer/msa9e4f6d7f5/tile/{z}/{y}/{x}?startLevel=1',
                },
                {
                    title:'H地区乡郊代表选举现有乡村、墟镇分界',
                    url:'http://222.73.139.7:8082/tileMap/services/MapServer/msbbddb1b14d/tile/{z}/{y}/{x}?startLevel=1'
                }
            ]
        },
        {
            title:'教育',
            children:[
                {
                    title:'H地区学校位置及资料', 
                    url:'http://222.73.139.7:8082/tileMap/services/MapServer/mse4b3c7d711/tile/{z}/{y}/{x}?startLevel=1'
                },
                
            ]
        },
        {
            title:'运输',
            children:[
                {
                    title:'H地区车辆分组及违例驾驶记分办事处位置', 
                }
            ]
        }

    ],
    basemap:{
        base:[
            {
                title:'香港影像',
                name:'香港地图',
                type:'MapServer',
                url:'http://222.73.139.7:8081/tileMap/services/MapServer/xianggang/tile/otherF/{z}/{y}/{x}?startLevel=1'
            },
            {
                title:'澳门影像',
                name:'影像地图',
                type:'MapServer',
                url:'http://222.73.139.7:8081/tileMap/services/MapServer/aomen/tile/otherF/{z}/{y}/{x}?startLevel=1'
            },
            {
                title:'矢量地图',
                name:'矢量地图',
                type:'MapServer',
                url:'http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1'
            },
           
          
        ],
        children:[
            {
                title:'注记地图',
                name:'注记地图',
                type:'MapServer',
                url:'http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1'
            },
            {
                title:'街景地图',
                name:'街景地图',
                type:'MapServer',
                url:'http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1'
            },
            {
                title:'室内地图',
                name:'室内地图',
                type:'MapServer',
                url:'http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1'
            },
            // 地形地址不要写到layer.json
            {
                title:'地形地图',
                name:'地形地图',
                type:'terrian',
                url:'http://localhost:80/bjdzdt/3swdx'  //本地代理
                // url:'http://10.51.100.2:8000/bjdzdt/3swdx'
            },
            // 模型写到tileset.json
            {
                title:'3D模型地图',
                name:'3D模型地图',
                type:'3dtitles',
                url:'http://localhost:80/bjdzdt/4qxsy/tileset.json' //本地代理
                // url:'http://10.51.100.2:8000/bjdzdt/4qxsy/tileset.json'
                
            },
        ]
    }
    
}