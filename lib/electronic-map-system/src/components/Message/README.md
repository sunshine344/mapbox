<!--
 * @Autor        : Pat
 * @Description  : DropdownSlots MD
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-28 14:31:19
 * @LastEditors  : Pat
 * @LastEditTime : 2021-02-05 14:31:20
-->
### Message 消息提示

常用于主动操作后的反馈提示。更多用于系统级通知的被动提醒。

### 参数说明 （Props）

|参数|说明|类型|必填|可选值|默认值|
|:--------|:-----|:----|:----|:----|:----|
|message|消息文字|string/HTMLString|-|-|-|
|type|主题|string|-|success/warning/info/error|-|
|duration|显示时间, 毫秒。设为false则不会自动关闭，设置为true使用默认时间关闭|number/boolean|-|-|3000|
|onClose|关闭时的回调函数, 参数为被关闭的 message 实例|function|-|-|-|
|position|Message显示位置。（不能设置相同，与对立属性给 `animation` ）|string|-|top/bottom/right/left|bottom|
|animation|Message动画显示位置。（不能设置相同，与对立属性给 `position`）|string|-|top/bottom/right/left|right|

### Event

|方法名称|说明|
|:--------|:----|
|close|关闭当前的 Message|

### 引用

```javascript
import Message from "/@/components/Message";
```

### 函数调用

```javascript
// 函数方式手动关闭
const messageMain = new Message({
    type: "success",
    message: "modelValue Message",
    duration: false
});
setTimeout(() => messageMain.close(), 2000)
```

### 组件调用

```html
// 组件模式调用
<Message type="success" message="modelValue Message" duration="3000"></Message>
```

### TSX\JSX调用

```jsx
// 组件模式调用
<Message {...{
    type: "success",
    message: "modelValue Message",
    duration: 4000
}}></Message>
```