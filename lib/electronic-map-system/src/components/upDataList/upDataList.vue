<!--
 * @Description: 文件上传组件
 * @Author: xufeng
 * @Date: 2022-02-24 15:41:37
 * @LastEditTime: 2022-02-25 15:26:49
 * @FilePath: \project\src\components\updataList\upDataList.vue
-->
<template>
    <div class="data-list">
        <a-input-search
            v-model:value="data.searchValue"
            placeholder="input search text"
            @search="onSearch"
        />
        <ul class="data-ul">
            <li v-for="(item,index) in listPage.list" :key="index" :class="{active:data.plotActive== index }">
                <p :title="item.name" @click="loadData(item, index)">{{ item.layerName }}</p>
                <div class="icon-btn">
                    <span v-if="listPage.msgBtn" title="详情" class="iconfont icon-winfo-icon-chakanxiangqing" @click="showDetails(item,index)"></span>
                    <span  title="删除" class="iconfont icon-shanchu" @click="removeItem(item,index)"></span>
                </div>
            </li>
        </ul>
        <a-pagination v-model:current="current" :total="listPage.total" @change='changeCurrent' @showSizeChange="onShowSizeChange" show-less-items />
    </div>
</template>
<script lang="ts"> 
import { defineComponent, PropType, defineAsyncComponent,watch, reactive,ref } from "vue";

interface AnyObject {
    [key:string]:any
}
export default defineComponent({
    name:"upDataList",
    props:{
        listPage: {
            type:Object as PropType<AnyObject>,
            default: {
                total:0,
                list:[],
                pageSize: 5,
                msgBtn: true,
            }
        }
    },
    setup(props, context) {
        const data:AnyObject = reactive({
            plotActive: null,
            searchValue:'',
            current: 0,
        })
        const current = ref(1);
        const onSearch = ()=>{
            context.emit('search',  data.searchValue);
        }
        
        // 信息展示
        const showDetails = (item:any, index:number)=>{
            context.emit('showDetail', item)
        }
        /**
         * @description: 删除单条数据
         * @param {*} item
         * @param {*} index
         */        
        const removeItem = (item:any, index:number)=>{
            // 删除 查询
            context.emit('removeItemData', item)
        }
        const onShowSizeChange = (current: number, pageSize: number) => {
            console.log(current, pageSize);
        };
        const changeCurrent = (current1: number, pageSize: number) => {
            current.value = current1  
        };
        const loadData = (item:any, index:number)=>{
            
        };
        return {
            data,
            current,
            onSearch,
            onShowSizeChange,
            changeCurrent,
            loadData,
            showDetails,
            removeItem
        }
    }
    
        
})
</script>
<style lang="scss">
    .data-list{
        .data-ul{
            margin-top: 10px;
            li{
                padding-left: 10px;
                box-sizing: border-box;
                height: 38px;
                width: 100%;
                position: relative;
                background: rgba(15, 82, 166, 0.3);
                border: 1px solid rgba(13, 98, 192, 0.8);
                border-bottom: 0;
                &:last-child{
                    border-bottom: 1px solid rgba(13, 98, 192, 0.8);
                }
                p{
                    line-height: 36px;
                    width: calc(100% - 60px);
                    overflow: hidden;//多出部分隐藏
                    white-space: nowrap;//一行显示
                    text-overflow: ellipsis;//是否显示省略号
                }
                .icon-btn{
                    line-height: 36px;
                    position: absolute;
                    top: 0;
                    right: 10px;
                    span{
                        margin-left: 10px;
                    }
                }
                &:hover{
                    background: rgba(235, 167, 5, 0.4);
                    border: 1px solid #FBCF0F;
                }
                
            }
            .active{
                background: rgba(235, 167, 5, 0.4);
                border: 1px solid #FBCF0F;
            }
        }
    }
</style>