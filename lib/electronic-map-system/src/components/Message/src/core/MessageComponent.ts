/*
 * @Autor        : Pat
 * @Description  : MessageComponent
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-02-05 10:09:27
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-18 15:58:57
 */
import { defineComponent, App, ref, Ref, createVNode, openBlock, createBlock, Transition, withCtx, withDirectives, vShow, nextTick, watchEffect } from 'vue';
declare interface AnyObject { [key: string]: any };
// Initialization module
// defineComponent only returns the objects passed to it
// The returned value has a synthetic type constructor for manual rendering functions, TSX and IDE tool support
// https://v3.cn.vuejs.org/api/global-api.html#definecomponent
let CurrentComponent = defineComponent({
    name: '_Message',
    props: {
        type: { type: String, default: "" },
        message: { type: String, default: "" },
        duration: { type: Number || Boolean, default: 3000 },
        time: { type: Number, default: 1 },
        offset: { type: Number, default: 20 },
        zIndex: { type: Number, default: 999 },
        id: { type: String, default: '' },
        position: { type: String, default: 'bottom' },
        animation: { type: String, default: 'right' },
        onClose: { type: Function, required: true },
    },
    // Initialization
    // Vue3.0 nitialization function
    // https://v3.cn.vuejs.org/guide/migration/attrs-includes-class-style.html#%E6%A6%82%E8%A7%88
    setup(props) {
        const messageState: Ref<boolean> = ref(true),
            messageClass: Ref<string> = ref(""),
            time = (callback: Function, duration: number) => setTimeout(callback, duration);
        let customStyle: any = ref();
        watchEffect(() => {
            let currentStyle: AnyObject = { zIndex: props.zIndex };
            currentStyle[props.position] = `${props.offset}px`;
            customStyle.value = currentStyle
        })
        if (props.duration) {
            nextTick(() => time(() => {
                messageClass.value = "msg-out";
                time(() => props.onClose(props.id), 700);
            }, props.time));
        }
        return { messageState, messageClass, id: props.id, customStyle }
    }
});
/**
 * @description: Initialization render function
 *               Node information required for rendering components
 *               https://v3.cn.vuejs.org/guide/migration/render-function-api.html#_3-x-%E8%AF%AD%E6%B3%95-2
 * @param {any} _ctx Vue prototype function object
 * @return {*}
 * @Date: 2021-01-28 14:26:18
 * @author: Pat
 */
CurrentComponent.render = function (_ctx: any, _cache: any): any {
    let setupAnimationString: string = _ctx.animation, setupPosition: string = _ctx.position;
    if (_ctx.messageState) {
        return (openBlock(), createBlock(Transition, { name: "slide-fade" }, {
            default: withCtx(() => [
                withDirectives(
                    createVNode("div", {
                        id: _ctx.id,
                        class: ["el-info-message", setupPosition, setupAnimationString, `${setupAnimationString}-animation`, `el-msg-${_ctx.type}`, _ctx.messageClass],
                        style: _ctx.customStyle,
                        innerHTML: _ctx.message
                    }),
                    [[vShow, !_ctx.messageClass]]
                )
            ]),
            _: 3
        }))
    };
    return;
};
// Initialization current components
// Retrieve the registered component (always return the constructor)
// https://v3.cn.vuejs.org/api/application-api.html#component
CurrentComponent.install = (app: App<Element>) => app.component(CurrentComponent.name, CurrentComponent);
export default CurrentComponent;