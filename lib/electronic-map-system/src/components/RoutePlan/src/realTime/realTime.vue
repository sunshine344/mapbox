<!--
 * @Description: file content
 * @Author: xufeng
 * @Date: 2022-02-17 09:22:51
 * @LastEditTime: 2022-02-24 16:07:41
 * @FilePath: \project\src\components\RoutePlan\src\realTime\realTime.vue
-->
<template>
    <div class="search-select">
        <span class="iconfont icon-fangxiao" v-if="dataItem.clearBtn" @click="removeSearchClick"></span>
        <a-select
            :style="dataItem.clearBtn ? 'width: 266px;height:36px;':'width: 300px;height:36px;'"
            show-search
            :value="data.nameVal"
            placeholder="请输入地址名称"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSearch"
            @change="handleChange"
        >
            <a-select-option v-for="(item,index) in data.list" :key="index">
            {{ item.中文名稱 }}
            </a-select-option>
        </a-select>
        <span class="iconfont icon-dingwei1" @click="pointPick(dataItem)"></span>
    </div>
</template>
<script lang="ts">
import {
    reactive,
    defineComponent,
    PropType,
    toRefs,
    Ref,
    ref,
    onBeforeMount,
    watch,
    onMounted
} from "vue";

// 接口参数
import { 
    SearchProperty,  // 属性查询接口
} from '@/api/core/mapPathPlot.ts'


export interface ColumnProps {
    type:string,
    clearBtn:boolean,
    wkt: string,
    id:string,
    name: string
}
export interface AnyObject {
    [key:string]:any
}
export default defineComponent({
    name:"realTime",
    components: {},
    props:{
        dataItem: {
            type:Object as PropType<ColumnProps>,
            default: {
                type:'',
                clearBtn:false,
                wkt:'',
                id:'',
                name:'',
            }
        }
    },
    setup(props, context) {
        /*监听props*/
        watch(props, (nweProps:AnyObject, oldProps:AnyObject) => {
            data.nameVal = nweProps.dataItem.name;
        });        
        const data: AnyObject = reactive({
            nameVal: props.dataItem.name,
            dataItemClick: null,
            list: [],
            currentValue: null,
        })
        /**************************************  调用父组件方法 *************************************************/
        /**
         * @description: 地图标记点点击
         */        
        function mapMarkPointClick (){
            context.emit("eventPointBtn");
        };

        /**
         * @description: 移除input搜索
         */        
        function removeSearchClick(){
            context.emit("removeClick", props.dataItem);
        }

        /**
         * @description: 地图点位拾取
         */ 
        function pointPick(dataItem:ColumnProps){
            context.emit('pick',dataItem);
        }
        /************************************* 组件内部方法 ****************************************************/

        //let s :unknown;   // 类型不确定unknown unknown不能赋值给别的 断言可用 a = s as string(类型断言)
        // function adfdf():void{} // :void 表示没有返回值 return null 或 return undefind 
        // let a: {
        //     sall:number,
        //     data?: string
        // }
        // data?: string 表示可选属性
        
        let timeout:number;
        function fetch(value:string) {   //callback:(res:any) => void
            if (timeout) {
                clearTimeout(timeout);
            } 
            data.currentValue = value;
            timeout = setTimeout(()=>{
                positiveCoding({
                    keyword: value,  
                    pageIndex: 1,
                    pageSize: 10,
                    releaseId: "ms6666",
                })
            },200);
        }
        /**
         * @description: 列表点击回显
         * @param {*} value 获取的input
         */        
        function handleSearch(value:string) {
            if(value){
                fetch(value);  // 添加回调res => (data.list = res)
            }
        }
        /**
         * @description: 数据变化
         * @param {*} value 获取的input
         */   
        function handleChange(value:string,item:AnyObject) {
            const datas = data.list[value]; 
            let obj:AnyObject = {
                type: props.dataItem.type,
                clearBtn: props.dataItem.clearBtn,
                wkt:  datas.esCenterPoint,
                id: props.dataItem.id,
                name:  datas.中文名稱,
            }
            data.nameVal = value;
            fetch(value);
            //返回数据
            context.emit("setImputData",obj);
        }
        /**
         * @description: 正向匹配接口请求, 通过地图掺入参数
         * @param {*} params 接口参数

         */        
        const positiveCoding = async (params: any) => {
            const res = await SearchProperty(params);
            console.log(data.list)
            if (data.currentValue === params.keyword) {
                data.list = res.dataList 
            }
            
        };
        onMounted(() => {});
        return {
            data,
            handleSearch, // 数据选择
            handleChange, // 数据变化
            removeSearchClick,  // 移除input搜索
            pointPick, // 打点
        }
    }
})
</script>
<style lang="scss">
    .search-select{
        margin-top: 10px;
        width: 100%;
        >span{
            padding: 0 8px;
            box-sizing: border-box;
            cursor: pointer;
            font-size: 18px;
            &:hover{
                color: #FBCF0F;
            }
        }
    }
</style>