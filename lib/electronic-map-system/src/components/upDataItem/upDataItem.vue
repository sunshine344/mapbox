<!--
 * @Description: 文件上传组件
 * @Author: xufeng
 * @Date: 2022-02-24 15:41:37
 * @LastEditTime: 2022-02-25 13:37:52
 * @FilePath: \project\src\components\upDataItem\upDataItem.vue
-->
<template>
    <div class="up-data">
        <div class="input-box"></div>
        <a-upload :file-list="fileList" :accept="upDataType" :remove="handleRemove" :before-upload="beforeUpload">
        <a-button>
            <!-- <upload-outlined></upload-outlined> -->
           选择
        </a-button>
        </a-upload>
        <a-button
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploading"
        @click="handleUpload"
        >
        {{ uploading ? '' : '上传' }}
        </a-button>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, defineAsyncComponent, reactive,ref } from "vue";
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
interface AnyObject {
    [key:string]:any
}
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file: string | Blob;
}

export default defineComponent({
    name:"updata",
    components: {
        UploadOutlined,
    },
    props:{
        upDataType: {
            type:String,
            default: ""
        }
    },
    setup(props, context) {
        
        const fileList = ref<FileItem[]>([]);
        const uploading = ref<boolean>(false);

        const handleRemove = (file: FileItem) => {
            const index = fileList.value.indexOf(file);
            const newFileList = fileList.value.slice();
            newFileList.splice(index, 1);
            fileList.value = newFileList;
        };
        const beforeUpload = (file: FileItem) => {
            // fileList.value = [...fileList.value, file];
            debugger
            // 判断登录
            fileList.value = [file];
            return false;
        };

        const handleUpload = () => {
            const formData:any = new FormData();
            fileList.value.forEach((file: FileItem) => {
                formData.append('uploadFile', file as any);
            });
            uploading.value = true;
            context.emit("upload", formData)

        };
        // 上传成功
        const uploadSuccess = (msg:string)=>{
                fileList.value = [];
                uploading.value = false;
                message.success(msg);
        }
        // 上传失败
        const uploadError = (msg:string)=>{
                fileList.value = [];
                uploading.value = false;
                message.error(msg);
        }
        return {
            fileList,
            uploading,
            handleRemove,
            beforeUpload,
            handleUpload,
            uploadSuccess,
            uploadError
        }
    }
    
        
})
</script>
<style lang="scss">
    .up-data{
        position: relative;
        height: 38px;
        .input-box{
            width: 184px;
            height: 36px;
            background: rgba(15, 82, 166, 0.3);
            border: 1px solid rgba(13, 98, 192, 0.8);
        }
        .ant-upload{
            position: absolute;
            right: 36px;
            height: 30px;
            top: 0;
            display: inline-block;
            color: #FBCF0F !important;
            // .ant-btn{
            //     display: none;
            // }
        } 
        .ant-btn{
            position: absolute;
            top: 0;
            right: 0;
            color: #fff;
        }
        .ant-upload-list-item{
            position: absolute;
            top: 0;
            left: 10px;
            width: 160px;
            color: #fff !important;
        }
        .ant-upload-list-item:hover .ant-upload-list-item-info {
            background-color: transparent;
        }
        .ant-upload-list-item-info .anticon-loading, .ant-upload-list-item-info .anticon-paper-clip{
            color: #fff;
        }
        .ant-upload-list-item-card-actions .anticon {
            color: #fff;
        }
        .ant-btn-primary[disabled], .ant-btn-primary[disabled]:hover, .ant-btn-primary[disabled]:focus, .ant-btn-primary[disabled]:active{
            color: #fff;
        }
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