<template>
    <div class="route-plan">
        <div class="plan-input">
            <div class="plan-box">
                <div class="search-title">
                    <span class="PingFangSC16">起点</span>
                </div>
                <div>
                    <!-- eventPoint: 点击打点调用的父组件方法 -->
                    <!-- <RealTime :msg="data.startPoint" @eventPointBtn="eventPoint"></RealTime> -->
                    <!-- removeClick: 删除一项数据
                    pick: 地图打点 -->
                    <RealTime :dataItem = "data.startPoint" @removeClick="removeSearchInput" @setImputData='setdDataItem' @pick='pickPoint'></RealTime>
                </div>
            </div>
            <div class="plan-box">
                <div class="search-title">
                    <span class="PingFangSC16">途径点</span>
                    <span class="iconfont icon-zengjia" v-if="data.addwayPointBtn" @click="addSearchIpunt('wayPoint')"></span>
                </div>
                <div v-for="(item,index) in data.wayPoint" :key="index">
                    <RealTime :dataItem = "item" @removeClick="removeSearchInput" @setImputData='setdDataItem' @pick='pickPoint'></RealTime>
                </div>
                
            </div>
            <div class="plan-box">
                <div class="search-title">
                    <span class="PingFangSC16">避让点</span>
                    <span class="iconfont icon-zengjia" v-if="data.addAvoidancePointBtn" @click="addSearchIpunt('avoidancePoint')"></span>
                </div>
                <div v-for="(item,index) in data.avoidancePoint" :key="index">
                    <RealTime :dataItem = "item" @removeClick="removeSearchInput" @setImputData='setdDataItem' @pick='pickPoint'></RealTime>
                </div>
            </div>
            <div class="plan-box">
                <div class="search-title">
                    <span class="PingFangSC16">终点</span>
                </div>
                <div>
                    <!-- eventPoint: 点击打点调用的父组件方法 -->
                    <!-- <RealTime :msg="data.startPoint" @eventPointBtn="eventPoint"></RealTime> -->
                    <RealTime :dataItem = "data.endPoint" @removeClick="removeSearchInput" @setImputData='setdDataItem' @pick='pickPoint'></RealTime>
                </div>
            </div>
            <div class="plan-box">
                <div class="search-title">
                    <span class="PingFangSC16">平均速度</span>
                </div>
                <div class="input-style">
                   <input type="text" :value="data.speedKMH" placeholder="请输入平均速度" @change="clearNoNum" oninput=" value= value.replace(/\D/g,'')" />
                   <span>km/h</span>
                </div>
            </div>
            <div class="plan-speed"></div>
        </div>
        <div class="search-btn">
            <span class="actives" @click="searchPath">搜索</span><span @click="resetBtn">重置</span>
        </div>
        <div class="search-result">
            <div class="path-list" v-if="data.resSearchData.dataList.length">
                <div class="list-title">
                    <div>总长：<span>{{ data.sumLength }}</span> </div>
                    <div>时长：<span>{{ data.duration }}</span> </div>
                    </div>
                <div class="list-center">
                    <div class="ponit-name" v-for="(item,index) in data.resSearchData.dataList" :key="index">
                        
                        <div class="title-name">
                            <p v-text="index == 0 ? '起':'途'"></p>
                            <div>
                                <span v-text="index == 0 ? '起始点':'途径点'" @click="qsdClick(item,'')"></span>
                                <i @click="isShow(item)" :class="item.listShow ? 'iconfont icon-fangxiao':'iconfont icon-fangxiao'"></i>
                                
                            </div>
                            
                        </div>
                        <ul v-if="item.listShow">
                            <li v-for="(ite,idx) in item.dataList" :key="idx" :class="ite.isActive ?'active':'' " @click="pathListClick(ite,idx,item,index)">
                                <span v-text="ite.name_chn ? ite.name_chn:'暂无名称'"></span>
                                <span>长度：<i>{{ite.length}}</i> 米</span>
                                <p><i class="iconfont iconluduan"></i></p>
                            </li>
                        </ul>
                    </div>
                    <div class="ponit-name">
                        <div class="title-name">
                            <p>终</p>
                            <div>
                                <span @click="qsdClick(data.resSearchData.dataList[data.resSearchData.dataList.length - 1], 'last')">终点</span>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
        

        
        
    </div>
</template>

<script lang="ts">
import {
    reactive,
    defineComponent,
    toRefs,
    Ref,
    ref,
    onBeforeMount,
    onMounted,
} from "vue";


import { 
    SearchForward,  // 正编码查询
    routeDriving,  // 路径查询
} from '@/api/core/mapPathPlot.ts'

// 实时搜索组件
import RealTime from './src/realTime/realTime.vue' 

// 接口参数定义
export interface RoutePlan {
    avoidDistance?:number,    // 避让距离    
    avoidPoints?: string,     // 避让数组
    speedKMH?: string,        //自定义速度
    releaseId?: string,      // 图层ID
    waypoints:string,        // 路径地位 WKT ('起点;途径点;...终点') 
    avoidPolygons?:string,   // 避让点 WKT ('避让点,避让点,避让点')
}

export interface AnyObject {
    [key:string]:any
}
export interface addObj{
    type: String,
    clearBtn: Boolean,
    wkt: String,
    id: String,
    name: any,
    [propName: string] : any;
}

export default defineComponent({
    components: {
        RealTime, // 实时搜索组件
    },
    props:[],
    setup(props, context) {
        let data: any = reactive({
            // 起点
            clickDataItem: null,
            speedKMH: '20',
            startPoint: {
                type: 'qd',
                id:'qd',
                clearBtn: false,
                wkt: '',
                name: null,
            },
            // 途径点
            addwayPointBtn: true,
            wayPoint: [],
            addAvoidancePointBtn: true,
            // 避让点
            avoidancePoint: [],
            // 终点
            endPoint: {
                type: 'zd',
                clearBtn: false,
                wkt: '',
                name: null,
                id:'zd',
            },

            // 实时数据返回
            realTimeSearch: [

            ],

            resSearchData: {
                dataList:[],
                sumLength:'',
            },
            highLightItem: {},

        });

        onMounted(() => {});
        

        /**
         * @description: 添加途径点或避让点
         * @param {*} type 途径点或避让点
         */        
        function addSearchIpunt(type: string){
            let uuid:string = creatUuid(8, 16);
            const itemObj :addObj = {
                type: "",
                clearBtn: true,
                wkt:'',
                id: uuid,
                name: undefined,
            }
            if(type == 'wayPoint'){
                // 途径点
                if(data.wayPoint.length > 2){
                    data.addwayPointBtn = false;
                }else{
                    data.addwayPointBtn = true;
                }
                itemObj.type = "wayPoint";
                data.wayPoint.push(itemObj)
            }else{
                // 避让点
                if(data.avoidancePoint.length > 2){
                    data.addAvoidancePointBtn = false
                }else{
                    data.addAvoidancePointBtn = true
                }
                itemObj.type = "avoidancePoint";
                data.avoidancePoint.push(itemObj)
            }   
            console.log(JSON.stringify(data.wayPoint),"data.avoidancePoint"+data.avoidancePoint)   
        }

        function creatUuid (len: number, radix: number):string {
            const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i:number;
            radix = radix || CHARS.length;
            if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = CHARS[0 | Math.random()*radix];
            } else {
            // rfc4122, version 4 form
                var r:number;
                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = CHARS[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        }

        function searchPath(){
            // 判断起点终点是否设置
            if(data.startPoint.wkt && data.endPoint.wkt){
                 // 起点
                let waypoints = data.startPoint.wkt+';'
                let avoidPoints ='';
                // 避让点
                if(data.avoidancePoint.length){
                    for(let j= 0;j<data.avoidancePoint.length;j++){
                        if(data.avoidancePoint[j].wkt){
                           avoidPoints += data.avoidancePoint[j].wkt+';'
                        }
                    }
                }
                // 途径点
                if(data.wayPoint.length){
                    for(let i= 0;i<data.wayPoint.length;i++){
                        if(data.wayPoint[i].wkt){
                           waypoints += data.wayPoint[i].wkt+';'
                        }
                    }
                }
                waypoints += data.endPoint.wkt+';'
                
                avoidPoints = avoidPoints.substring(0,avoidPoints.length-1)
                waypoints = waypoints.substring(0,waypoints.length-1)
                // let search:RoutePlan = {
                //     avoidDistance: 10,    // 避让距离    
                //     avoidPoints: avoidPoints,     // 避让数组
                //     speedKMH: data.speedKMH,        //自定义速度
                //     releaseId: 'ms3333',      // 图层ID
                //     waypoints,  // 路径地位 WKT ('起点;途径点;...终点') 
                // }

                let search:RoutePlan = {
                    avoidDistance: 10,    // 避让距离    
                    //avoidPoints: avoidPoints,     // 避让数组
                    speedKMH: data.speedKMH,        //自定义速度
                    releaseId: 'ms3333',      // 图层ID
                    waypoints: 'POINT(119.134756 36.695247);POINT(119.114959 36.706912)', // 起点终点路径
                }
                positiveCoding(search)
            }else{
                alert('必须输入起点与终点字段！！！')
            }
        }
        /**
         * @description: 正向匹配接口请求, 通过地图掺入参数
         * @param {*} params 接口请求

         */        
        const positiveCoding = async (params: any) => {
            const res = await routeDriving(params);
            if(res.dataList.length){
                res.dataList.forEach((element:AnyObject) => {
                    element.sumLength = element.sumLength.toFixed(2);
                    element.listShow = true;
                    element.dataList.forEach((ele:AnyObject)=>{
                        ele.length = ele.length.toFixed(2);
                        ele.isActive = false;
                    })
                });
            }
            data.resSearchData = res;
            let sumLength = data.resSearchData.sumLength.toFixed(2);
            data.sumLength = sumLength + '米';
            let hour = Math.floor(data.resSearchData.duration/60);
            let second = data.resSearchData.duration % 60
            if(second){
                data.duration = hour+'分钟'+second+'秒';
            }else{
                data.duration = hour+'分钟';
            }
            // 地图渲染线段
            context.emit('setLine',data.resSearchData);
        };


        //重置状态及清除绘制结果
        
        function resetBtn(){
            // 数据重置
            data.startPoint = {
                type: 'qd',
                clearBtn: false,
                wkt: '',
                name: undefined,
                id:'qd',
            }
            // 途径点
            data.addwayPointBtn = true;

            data.wayPoint = [];
            data.addAvoidancePointBtn = true;
            // 避让点
            data.avoidancePoint = [];
            // 终点
            data.endPoint = {
                type: 'zd',
                clearBtn: false,
                wkt:'',
                name: undefined,
                id:'zd',
            };

            data.duration = null;
             data.sumLength = null;

            data.resSearchData = {
                dataList:[],
                sumLength:'',
            }
             // 地图重置

            context.emit('removePlanAll');



        }
        function isShow(item:AnyObject){
            item.listShow = !item.listShow;
        }
        function qsdClick(clickItem:AnyObject, type:string){
            let s = clickItem;
            //  飞行点位置
            context.emit('positionPoint',clickItem,type);
            
        }

        function pathListClick(ite:AnyObject,idx:number,item:AnyObject,index:number){
            if(data.highLightItem.index || data.highLightItem.index == 0 ){
                data.resSearchData.dataList[data.highLightItem.index].dataList[data.highLightItem.idx].isActive = false;
                data.highLightItem = {};
            }
            data.resSearchData.dataList[index].dataList[idx].isActive = true;
            data.highLightItem.index = index;
            data.highLightItem.idx = idx;
           
            //this.$parent.linkage(ite,idx,index);
            context.emit("linkage",ite, idx, index)
        } 
        function clearNoNum (obj:AnyObject){
            //先把非数字的都替换掉，除了数字和.
            obj.value = obj.value.replace(/[^\d.]/g,"");
            //必须保证第一个为数字而不是.
            obj.value = obj.value.replace(/^\./g,"");
            //保证只有出现一个.而没有多个.
            obj.value = obj.value.replace(/\.{2,}/g,".");
            //保证.只出现一次，而不能出现两次以上
            obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            //保证 数字整数位不大于8位
            if(100000000<=parseFloat(obj.value))
                obj.value = "";
        };
        /************************* 组件传值方法  *********************************/

        // function eventPoint(){
        //     context.emit('creatMarkPoint');
        // }
        /**
         * @description: 移除添加的数据
         * @param {*} item
         * @return {*}
         */        
        function removeSearchInput (removeItem:addObj){
            if(removeItem.type == 'wayPoint'){
                const newArr = data.wayPoint.filter( (item:addObj) => item.id != removeItem.id)
                data.wayPoint = newArr;
                data.addwayPointBtn = true;
                // 清除绘制的点数据
                context.emit('removePoint',removeItem);

            }else{
                const newArr = data.avoidancePoint.filter( (item:addObj) => item.id != removeItem.id)
                data.avoidancePoint = newArr;
                
                data.addAvoidancePointBtn = true
            }
        }
        /**
         * @description: 地图打点点击
         */        
        function pickPoint(item:addObj){
            data.clickDataItem = item;
            context.emit('mapPickPoint',item);
        }
        const getPickPointArr = (item:Array<number>) => {
            // 查询接口
            let param: AnyObject = {
                location: item[0]+","+item[1],
                //location: "114.20661350838914,22.336043544786435",
                releaseId: 'ms8888'
            }
            ajaxpointCoding(param,item);
            
        }
        /**
         * @description: 正编码接口调用（用于地图点击获取经纬度查询该点，最近的数据点位）
         * @param {*} params (location,releaseId)
         */   
        const ajaxpointCoding = async (params: any,LonLatArr: Array<number>) => {
            const res = await SearchForward(params);
            if(res && res.esCenterPoint){
                data.clickDataItem.wkt = res.esCenterPoint
                data.clickDataItem.name = res.中文名稱;
                if(data.clickDataItem.type == 'qd'){
                    data.startPoint = data.clickDataItem;
                }else if(data.clickDataItem.type == 'wayPoint'){
                    for(let i= 0;i<data.wayPoint.length;i++){
                        if(data.clickDataItem.id == data.wayPoint[i].id ){
                            data.wayPoint[i] = data.clickDataItem;
                            break; 
                        }
                    }
                }else if(data.clickDataItem.type == 'avoidancePoint'){
                    for(let i= 0;i<data.avoidancePoint.length;i++){
                        if(data.clickDataItem.id == data.avoidancePoint[i].id ){
                            data.avoidancePoint[i] = data.clickDataItem;
                            break; 
                        }
                    }
                }else{
                    data.endPoint = data.clickDataItem;
                }
                // 地图渲染该点
                context.emit('setPoint',data.clickDataItem);
            }else{
                alert("该位置无点位数据")
            }
        }; 
        function setdDataItem(item: AnyObject){
            data.clickDataItem = item;
            if(item.type == 'qd'){
                data.startPoint = item;
            }else if(item.type == 'wayPoint'){
                for(let i= 0;i<data.wayPoint.length;i++){
                    if(item.id == data.wayPoint[i].id ){
                        data.wayPoint[i] = item;
                        break; 
                    }
                }
            }else if(item.type == 'avoidancePoint'){
                for(let i= 0;i<data.avoidancePoint.length;i++){
                    if(item.id == data.avoidancePoint[i].id ){
                        data.avoidancePoint[i] = item;
                        break; 
                    }
                }
            }else{
                data.endPoint = item;
            }
            // 地图打点
            context.emit('setPoint',data.clickDataItem);
        }
        return {
            data,  // 数据集合
            addSearchIpunt, // 添加
            removeSearchInput, // 移除
            searchPath,  // 搜素
            clearNoNum, // imput
            resetBtn, // 重置(数据重置与地图重置)
            qsdClick, // 起点点击
            pathListClick,
            isShow, 
            // 地图方法
            pickPoint,  // 地图打点
            getPickPointArr,// 打完点的返回方法
            setdDataItem, // 设置数据
            
        };
        
        /******* list*****/
        //@mapPickPoint="mapPickOnceClick"
        // funciton mapPickOnceClick(){

        // }
    },
    
})
</script>

<style lang="scss">
@import "./RoutePlan.scss";
</style>