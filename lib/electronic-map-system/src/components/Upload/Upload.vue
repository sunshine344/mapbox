<template>
  <div class="upBox">
    <span class="gb"></span>
    <div class="top">
      <h5 class="upTitle"><span></span>文件上传说明</h5>
      <p>
        1、仅限上传.xlsx、.csv格式文件；
        <br />
        2、需包含ID、Time、Longitude、Latitude、Remark字段，ID、Time、Longitude、Latitude字段不能为空；
        <br />
        3、文件大小不能超过20M。
      </p>
    </div>
    <div class="bom">
      <!-- ajaxFun: 上传文件的回调，可进行接口提交 -->
      <UploadItem upDataType=".xlsx, .csv" @upload="uploadData" ref="uploadItem"></UploadItem>



      <div class="pag">
        <!-- <a-pagination :page-size="3" size="small" :total="50" /> -->
      </div>
      <!-- <div></div> -->
      <!-- <div class="clearfix">
        <a-upload
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button> <a-icon type="upload" /> Select File </a-button>
        </a-upload>
        <a-button
          type="primary"
          :disabled="fileList.length === 0"
          :loading="uploading"
          style="margin-top: 16px"
          @click="handleUpload"
        >
          {{ uploading ? "Uploading" : "Start Upload" }}
        </a-button>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
// import reqwest from "reqwest";
import "./Upload.scss";
import { ref, defineComponent, defineAsyncComponent, reactive } from "vue";
import UploadItem from '@components/upDataItem/upDataItem.vue'
// 接口参数
import { 
    FileDataUpload  // 文件上传
} from '@/api/core/mapPathPlot.ts'
export default defineComponent({
    components: {
      UploadItem,
    },
    setup() {
      const uploadItems = ref();
      const data: any = reactive({
       
      });
      // 上传
      const uploadData = async(formData:any) => {
        const res = await FileDataUpload(formData)
        debugger
        if(res.code == 0){
          uploadItems.value.uploadSuccess(res.msg)
        }else{
          uploadItems.value.uploadError(res.msg)
        }
      };
      
      return {
        data,
        uploadItems,
        uploadData,
      };
    },
});
</script>

<style lang="sass" scoped>
</style>