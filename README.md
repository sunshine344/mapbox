<!--
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-28 14:58:44
-->
# EModel for Vue
Vue 3.0 + vite + ts
+ 根据配置生成环境与页面配置
+ `postcss` + `scss` 处理样式统一
+ 统一配置文件管理

## 初始化
```node
npm install 
// or
yarn install
```

## 启动
```node
npm run dev 
// or
yarn dev
```

## 打包
```node
npm run build 
// or
yarn build
```

## 环境配置
[amb]:https://www.npmjs.com/package/p.fs.amb
环境配置采用 [p.fs.amb][amb] 系统配置文件生成器（解决多余IP暴露引起的安全性问题）

然后在打包配置文件(`vite.config.js`)添加 `require("p.fs.amb")()`;

```
dev 环境默认开启 mock 数据模拟，其他环境根据对应 amb 文件配置的 mock 状态控制（mock:true）
打包默认关闭mock（mock:false）
```

## Mock
在 `amb` 文件夹下的文件内对象的参数 `mock` 为 `true`时启用。
添加新的数据接口时都需要在 `mock/model` 下添加对应文件 `xxx.mock.(t|j)s`。

示例请查看 `mock/model/login.mock.ts`

## Api
`src/api` 文件夹下管理系统前后端交互接口。`src/api/request` 是`axios`二次封装成果，大致配置与`axios`相同，暴露`['put', 'post', 'get', 'delete', 'head', 'patch','json','formData','uploadFile','upload']`等请求方法。

每个模块的请求都单独一个文件新建到 `src/api/core` 下。

`src/api/index.ts` 引入导出一个 `outputAPI(apiName:string)` ，如：`outputAPI('use.Login')`

```ts
import outputApi,{RequestObject} from "@api";
outputApi('use.Login')({
    username:'admin',
    password:'test123456'
}).then(({data,msg,code}:RequestObject)=>{
    console.log(data,msg,code)
})

// or
import type {RequestObject} from "@api";
import {Login} from "@api/core/use";
Login({
    username:'admin',
    password:'test123456'
}).then(({data,msg,code}:RequestObject)=>{
    console.log(data,msg,code)
})

```

## components
`src/components` 自定义公共组件。每一个组件命名采用大驼峰命名，并且一个组件一个文件夹，每个文件夹都必须包含出口文件和说明文件。`src/containers`文件要求一致，不过`src/containers`是业务组件（由公共组件组合改装生成）。以`Message`为例如：
```
|--- Message (组件名称命名)
    |--- src (重要代码文件)
        |--- core (主要结构代码文件)
        |--- img (组件图片文件)
        |--- scss (组件样式文件)
        |--- type (组件类型文件)
        |--- index.ts (处理输出文件)
    |--- index.ts (输出文件，统一格式)
    |--- README.md (组件使用说明)
```

## Router
`src/config/router` 系统路由配置。
- 静态路由配置 `src/config/router/core/constantRoutes.ts` 
- 动态路由配置 `src/config/router/core/asyncRoutes.ts` 
- 路由拦截配置 `src/config/router/permission.ts` 
路由配置必须以异步的方式进行配置，如：
```typescript
import type { RouteRecordRaw } from 'vue-router';
export default [
    {
        path: '/home',
        name: '首页',
        component: () => import("@view/Home.vue"),
    }
] as RouteRecordRaw[];
```

## Store
`src/config/store` 系统状态存储机配置。只需要在`src/config/store/modules` 文件夹下添加对应的模块名称命名的`.(t|j)s`文件和对应配置即可，如：
```typescript
const state = {
    user: {},
    collapseState: false
}

const mutations = {
    SET_USERINFO: (state: any, user: any) => {
        state.user = user;
    },
    SET_COLLAPSE: (state: any, collapseState: boolean) => {
        state.collapseState = collapseState;
    }
}

const actions = {
    generateUser({ commit }: any, info: any) {
        return new Promise(resolve => {
            commit('SET_USERINFO', info)
            resolve(info)
        })
    },
    generateCollapseState({ commit }: any, state: boolean) {
        return new Promise(resolve => {
            commit('SET_COLLAPSE', state)
            resolve(state)
        })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
```

## dependencies

[igu]:https://www.npmjs.com/package/igu
[igu] 公共工具包(包含常规各种数据处理以及数据请求)

[sass]:https://www.sass.hk/
[sass] 专业级CSS扩展语言，适用于团队开发

[vue]:https://v3.cn.vuejs.org/
[vue] 开发基础框架

[vuex]:https://next.vuex.vuejs.org/
[vuex] 基础框架状态管理器

[vue-router]:https://next.router.vuejs.org/zh/
[vue-router] 基础框架路由

## 文件说明
```
|--- __test__ 单元测试目录
    |--- xxx.text.(ts|js) 功能测试文件
|--- amb (p.fs.amb 环境区分系统配置目录)
|--- api (p.fs.amb 环境区分系统请求配置目录)
|--- config (vite公共目录)
|--- mock (数据模拟目录)
    |--- model (各个接口数据模拟配置目录)
    |--- _createProductionServer.ts (创建mock数据必备文件)
    |--- _utlis.ts (创建mock数据工具文件)
|--- node_modules (依赖扩展目录)
|--- public (静态资源目录)
|--- src (工程目录)
    |--- api (请求目录)
        |--- config (请求配置目录)
            |--- request.ts (请求配置文件)
        |--- core (自定义请求目录)
        |--- index.ts (请求统一输出文件)
    |--- assets (资源目录)
        |--- images (图片资源目录)
        |--- scss (样式资源目录)
    |--- components (自定义公共组件目录)
    |--- config (系统配置目录)
        |--- router (路由配置目录)
            |--- core (路由配置)
                |--- asyncRoutes.ts (异步路由配置文件)
                |--- constantRoutes.ts (静态路由配置文件)
            |--- permission.ts (路由拦截配置文件)
            |--- index.ts (路由输出文件)
        |--- store (存储机目录)
            |--- modules (存储机配置目录)
            |--- index.ts (存储机输出文件)
        |--- type (类型目录)
    |--- config (系统配置目录)
        |--- global.d.ts (公共类型文件)
    |--- _utlis.ts (创建mock数据工具文件)
    |--- containers (自定义业务组件目录)
    |--- init (p.fs.amb生成配置目录)
    |--- shared (自定义工具目录)
        |--- _utlis.ts (公共工具文件)
        |--- rem.ts (main初始化工具文件)
        |--- storage.ts (浏览器存储机文件)
    |--- view (页面目录)
    |--- App.ts (引导页面)
    |--- main.ts (打包输出页面)
    |--- env.d.ts (全局类型)
|--- .browserslistrc
|--- .editorconfig (统一管理编辑器格式)
|--- .gitignore (统一管理排除提交文件)
|--- index.html (引导HTMML)
|--- shims-vue.d.ts (项目声明)
|--- tsconfig.json (ts配置文件)
|--- vite.config.js (打包配置文件)
```

## 开发规范要求

[vue-a]:https://cn.vuejs.org/v2/style-guide/
必须执行公司内部前端开发规范、W3C规范以及基础框架原始[规范A][vue-a]。

- 每一个功能模块及其组件必须对应编写单元测试文件并且跑通该文件

[anchor-id]: https://alidocs.dingtalk.com/i/team/vr4zEP0pwnLlGDYq/docs/vr4zEWrKVpKAMmDY?corpId=ding487f5e746371c086&iframeQuery=#
请访问公司内部文件（钉钉内文档->团队空间->工程中心知识库->基本前端开发规范） [易利科技前端开发规范说明书V1.1.docx][anchor-id] 

## 单元测试

[vue-test]:https://vue-test-utils.vuejs.org/zh/guides/
单元测试使用jest基于vue生成的成果[@vue/test-utils、vue-jest][vue-test]
