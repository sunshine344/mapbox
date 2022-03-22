<!--
 * @Author: your name
 * @Date: 2022-01-22 12:51:19
 * @LastEditTime: 2022-01-22 15:59:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \code\src\view\Home\src\components\Location\Index.vue
-->
<template>
    <div id="loccationinfopoup" v-if="flagBoolean"> 
        <h3 class="loccationinfopoup-title">
            <CloseOutlined class="loccationinfopoup-title_closeicon" @click="close"/>
        </h3> 
        <Form  :model="formState"  @finish="onFinish"  @finishFailed="onFinishFailed">
            <FormItem label="经度" name="long" v-bind="longconfig">
                <AInput v-model:value="formState.long"></AInput>
            </FormItem>
             <FormItem label="纬度" name="lat" v-bind="latconfig">
                <AInput v-model:value="formState.lat"></AInput>
            </FormItem>
            <FormItem  :wrapper-col="{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 10 },
                        }">
                <Button type="primary" html-type="submit">确定</Button>
            </FormItem>
            
        </Form>  
    </div>
</template>

<script lang="ts">
import { reactive,defineComponent, toRefs,Ref,ref,onBeforeMount, onMounted } from "vue";
import {Input as AInput,Form,FormItem,Button} from 'ant-design-vue';
import {CloseOutlined} from '@ant-design/icons-vue';
interface FormState{
    long:string,
    lat:string,
}
declare interface AnyObject{ //声明数组对象
    [key: string]: any;
}
export default defineComponent({
    components:{
        AInput,
        Form,
        FormItem,
        Button,
        CloseOutlined
    },
    setup (props,context) {
           let formState = reactive({} as FormState);
           let flagBoolean:Ref<boolean>=ref(false)
           const longconfig:AnyObject = {
                rules: [{ type: 'string' as const, required: true, message: '请填写经度' }],
            }
            const latconfig:AnyObject = {
                rules: [{ type: 'string' as const, required: true, message: '请填写纬度' }],
            }
            const onFinish=(values:any)=>{
                let long:any=values.long;
                let lat:any=values.lat;
                long = long.replace(/\s*/g,"");
                lat = lat.replace(/\s*/g,"");
                context.emit('primary',{long,lat})
            }
            const onFinishFailed=(errorInfo:any)=>{
                
            }
            /**
             * @Descripttion: 关闭弹框
             * @Author: 陈杰
             * @Date: 2022-01-22 15:52:01
             * @LastEditors: 
             * @param {*}
             * @return {*}
             */            
            const close=()=>{
                flagBoolean.value=false;
                 formState={long:'',lat:''}
            }
            const show=()=>{
                 formState={long:'',lat:''}
                 flagBoolean.value=true;
                 
            }
        return {
           formState,
           longconfig,
           latconfig,
           onFinish,
           onFinishFailed,
           close,
           flagBoolean,
           show
        }
    }
})
</script>

<style lang="scss" scoped>
    @import './src/scss/Index.scss';
</style>
