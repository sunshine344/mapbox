# Eli for front end cli

2022年易利数科产品二部前端开发脚手架模板 

+ Vue3.x + vite2.x + ECMAScript6 + TypeScript 
+ 遗弃Vuex，使用Vue3 readonly、 reactive 代替 
+ Jenkins 自动化集成 
+ Docker 前端自动化部署 
+ Postcss + sass + style var 样式配置统一管理 
+ Jest 单元测试，减少代码BUG率
+ 根据配置文件生成多环境、页面配置，打包后自动生成配置文件json 
+ Mockjs 前后端分离前端数据模拟


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

## 单元测试
```node
npm run test 
// or
yarn test
```

## 环境配置
[ambiences]:https://www.npmjs.com/package/ambiences
环境配置采用 [ambiences][ambiences] 多环境webpck\vite plugins配置生成当前环境配置（解决多余IP暴露引起的安全性问题）。

在打包配置文件(`vite.config.js`) 内 `plugins` 添加 `ambiences(build_file_type, build_file_name)`;


### .ambiences 配置示例
```
[[dev]]
// 开发环境
[api]
requestURL = "http://xxx.api.dev.com"
[config]
systemName = "DevDependencies system name";

[[test]]
// 测试环境
[api]
requestURL = "http://xxx.test.pro.com"
[config]
// 系统名称
systemName = "Test system name";

[[production]]
// 正式环境
[api]
requestURL = "http://xxx.api.pro.com"
[config]
// 系统名称
systemName = "Production system name";
```

### package.json 示例 

```json
{
    "scripts": {
        "dev": "vite --host --mode NODE_ENV=dev",
        "pro": "vite --host --mode NODE_ENV=production",
        "build": "vue-tsc --noEmit && vite build --mode NODE_ENV=production",
        "build:pro": "vite build --mode NODE_ENV=production",
    } 
} 
```


## Mock
在开发环境下 `mock` 应该为启用。
添加新的数据接口时都需要在 `mock/model` 下添加对应文件 `xxx.mock.(t|j)s`。

示例请查看 `mock/model/login.mock.ts`

## Api
`src/amb.js` 文件 `api` 参数为数据接口配置。`src/api/request` 是`axios`二次封装成果，大致配置与`axios`相同，暴露`['put', 'post', 'get', 'delete', 'head', 'patch','json','formData','uploadFile','upload']`等请求方法。

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
// page.ts
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

```js
import { outputStore } from "@store";
console.log(outputStore('page.user'))
```

## dependencies

[igu]:https://www.npmjs.com/package/igu
[igu] 公共工具包(包含常规各种数据处理以及数据请求)

[sass]:https://www.sass.hk/
[sass] 专业级CSS扩展语言，适用于团队开发

[vue]:https://v3.cn.vuejs.org/
[vue] 开发基础框架

[vue-router]:https://next.router.vuejs.org/zh/
[vue-router] 基础框架路由

## 文件说明
```
|--- __test__ 单元测试目录
    |--- xxx.text.(ts|js) 功能测试文件
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
            |--- core (存储机配置)
            |--- modules (存储机盒子目录)
            |--- index.ts (存储机输出文件)
        |--- type (类型目录)
        |--- enum.ts (枚举文件)
        |--- message.ts (消息管理文件)
        |--- validate.ts (表单验证文件)
    |--- containers (自定义业务组件目录)
    |--- shared (自定义工具目录)
        |--- _utlis.ts (公共工具文件)
        |--- rem.ts (main初始化工具文件)
        |--- storage.ts (浏览器存储机文件)
    |--- view (页面目录)
    |--- App.ts (引导页面)
    |--- main.ts (打包输出页面)
    |--- env.d.ts (全局类型)
    |--- shims-vue.d.ts (项目声明)
|--- .ambiences (环境、页面配置文件)
|--- .browserslistrc
|--- .dockerignore (docker排除文件)
|--- .editorconfig (统一管理编辑器格式)
|--- Dockerfile (docker配置文件)
|--- Jenkinsfile.groovy (Jenkins配置文件)
|--- .gitignore (统一管理排除提交文件)
|--- index.html (引导HTMML)
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
