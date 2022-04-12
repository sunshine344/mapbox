<!--
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-07-31 15:23:05
 * @LastEditors  : Pat
 * @LastEditTime : 2022-02-25 16:11:16
-->
<div align="center">
	<h2 style="margin:0;padding:0">ELCISFV标准
	<span style="margin-left:5px;height:60px;border-radius: 0 2px 2px 0;background-color: #d43544;color:white;padding:0 5px;font-size:12px;">v1.0.0</span></h2>
</div>

> ELCIS(ELi Components File Inventory Standard For Vue)易利数科内网前端 Vue 开发标准

- 开发人员必须使用 `typescript` 进行编写
- 必须遵守 `ELCIS` 标准
- 每一个文件只包含一个组件，每一个基本组件只包含单一功能

## 格式

- 无内容标签自闭合
  ```vue
  <script setup lang="ts">
  import { Button, Spac } from 'e-ui';
  </script>
  ```
  #### Counter example
  ```vue
  <template>
    <Button></Button>
    <!-- or -->
    <Spac></Spac>
  </template>
  ```
  #### Positive example
  ```vue
  <template>
    <Button />
    <!-- or -->
    <Spac />
  </template>
  ```
- 属性换行
  ```vue
  <script setup lang="ts">
  import { Button } from 'e-ui';
  </script>
  ```
  #### Counter example
  ```vue
  <template>
    <Button color="primary" @click="handleClick">提交</Button>
    <!-- or -->
    <Button color="primary" />
  </template>
  ```
  #### Positive example
  ```vue
  <template>
    <Button color="primary" @click="handleClick">提交</Button>
    <!-- or -->
    <Button color="primary" />
  </template>
  ```

## 组件命名
